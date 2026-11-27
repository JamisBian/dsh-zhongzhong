// 衷中参西问诊工具集
//
// 全部工具都在 Host 侧执行；提问走 ctx.userQuestions（原生选项卡片），
// 没有可用答案 UI 时退化为「返回问题清单，由模型用 ask_user_question 代问」。
// 工具之间通过病历对象（case）传递状态，不做服务端持久化。

import { normalizeCase, caseSummary, redFlags, markAsked } from './engine/case.js'
import {
  rankFormulas,
  confidence,
  discriminators,
  describeRanking,
  pct,
  inferSix,
  TUNING,
  highMatchException,
  closePrescriptionPair
} from './engine/match.js'
import { verify, evidenceText, verdictLabel } from './engine/evidence.js'
import { buildSheet } from './engine/prescribe.js'
import { jsonSafe } from './engine/json-safe.js'
import { detectConcerns, findConflicts, newSymptomsFrom, buildDefense, sourceQuestion, concernQuestion, stanceLabel } from './engine/discuss.js'
import { mergeCase } from './engine/case.js'
import { resolveFormula } from './data/index.js'
import { huangNote } from './data/huang-notes.js'
import { zhangNote } from './data/zhang-notes.js'
import { patternDetail } from './data/pattern-detail.js'
import { familyInPlay, applyFamilyAnswers } from './data/families.js'
import { combineCheck, buildCombined } from './engine/combine.js'
import { doseText } from './engine/dose.js'
import { questionsFor, applyAnswers, stageLabel, STAGES } from './questions.js'
import { labelOf } from './data/symptoms.js'
import { mkdir, readFile, stat, writeFile } from 'node:fs/promises'
import { homedir } from 'node:os'
import path from 'node:path'

const MAX_ROUNDS = 3

/** 把内部问题格式转成 userQuestions.ask 的请求格式。 */
function toRequestQuestions(questions) {
  return questions.map((q) => ({
    id: q.id,
    question: q.question,
    ...(q.header === undefined ? {} : { header: q.header }),
    ...(q.options === undefined || q.options.length === 0 ? {} : { options: q.options }),
    ...(q.multi_select === undefined ? {} : { multiSelect: q.multi_select })
  }))
}

/** 区分「没有 UI 提供方」「用户取消」「其它异常」。 */
function classifyAskError(err) {
  const code = typeof err === 'object' && err !== null ? String(err.code ?? '') : ''
  const message = err instanceof Error ? err.message : String(err)
  if (code === 'NO_PROVIDER' || /no user-questions/i.test(message)) return 'manual'
  if (code === 'ASK_ABORTED' || code === 'ASK_CANCELLED' || /aborted|cancelled/i.test(message)) return 'cancelled'
  return 'error'
}

/**
 * 向患者提问一批问题。
 * @returns {Promise<{kind:'answers', answers:object[]}|{kind:'manual'}|{kind:'cancelled'}|{kind:'error', message:string}>}
 */
async function askBatch(ctx, exec, questions) {
  const service = typeof ctx.get === 'function' ? ctx.get('userQuestions') : ctx.userQuestions
  if (service === undefined || typeof service.ask !== 'function') return { kind: 'manual' }
  try {
    const result = await service.ask({
      questions: toRequestQuestions(questions),
      ...(exec.agent === undefined ? {} : { agent: exec.agent }),
      signal: exec.signal,
      wait: { callId: exec.callId }
    })
    return {
      kind: 'answers',
      answers: result.answers.map((a) => ({
        id: a.id,
        selected: [...a.selected],
        ...(a.custom === undefined ? {} : { custom: a.custom })
      }))
    }
  } catch (err) {
    const kind = classifyAskError(err)
    if (kind === 'manual') return { kind: 'manual' }
    if (kind === 'cancelled') return { kind: 'cancelled' }
    return { kind: 'error', message: err instanceof Error ? err.message : String(err) }
  }
}

/**
 * 把 dsh-tcm-lit 的 tcm_lit_search 接成引擎可用的 search 函数。
 * 没装该插件时返回 undefined，证据卡会如实显示「未启用」。
 * @param {any} ctx
 * @param {any} exec
 * @returns {((query:string)=>Promise<any>) | undefined}
 */
export function literatureSearchOf(ctx, exec) {
  const tools = typeof ctx.get === 'function' ? ctx.get('tools') : ctx?.tools
  if (tools === undefined || tools === null || typeof tools.get !== 'function') return undefined
  const definition = tools.get('tcm_lit_search', exec?.agent)
  if (definition === undefined || typeof definition.execute !== 'function') return undefined
  return async (query) => {
    const args = { query, limit: 5, chinese_only: true }
    return definition.execute(args, {
      ...(exec ?? {}),
      arguments: args
    })
  }
}

/** Markdown 代码块里的病历 JSON（供模型原样回传）。 */
function caseBlock(caseData) {
  return ['```json', JSON.stringify(caseData), '```'].join('\n')
}

/** 问题清单的纯文本渲染（manual 模式用）。 */
export function questionsText(questions) {
  const lines = []
  for (const q of questions) {
    lines.push(`**${q.header === undefined ? '' : `${q.header}：`}${q.question}**`)
    if ((q.options ?? []).length > 0) {
      lines.push(q.options.map((o) => `- ${o.label}${o.description === undefined ? '' : `（${o.description}）`}`).join('\n'))
    }
    if (q.multi_select === true) lines.push('_可多选_')
  }
  return lines.join('\n\n')
}

/** 统一的定义构造器（不依赖 @deepseek-ai/dsh-tools 的 defineTool）。 */
function tool(definition) {
  return {
    name: definition.name,
    description: definition.description,
    parameters: definition.parameters,
    output: definition.output,
    async execute(args, exec) {
      // 宿主校验工具返回值为「无损 JSON」：undefined 键会在往返中消失，
      // NaN/Infinity 会变成 null。统一在出口清洗，避免某个分支多带一个
      // undefined 就让整个工具报 `value is not lossless JSON`。
      return jsonSafe(await definition.execute(args, exec))
    }
  }
}

/** 字符串字段。 */
const str = (description, extra = {}) => ({ type: 'string', description, ...extra })
/** 对象字段。 */
const obj = (description) => ({ type: 'object', description })

const TEXT_ONLY = (value, text) => [{ type: 'text', text }]

// ── 病案导出 ─────────────────────────────────────────────

/** `~` 展开成家目录。 */
function expandHome(input) {
  const text = String(input ?? '').trim()
  if (text === '') return ''
  if (text === '~') return homedir()
  if (text.startsWith('~/')) return path.join(homedir(), text.slice(2))
  return text
}

/** 文件名/目录名去掉不能落盘的字符。 */
export function safeName(input, fallback = '未命名') {
  const cleaned = String(input ?? '')
    .replace(/[\\/:*?"<>|\u0000-\u001f]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
    .replace(/^\.+/, '')
  return cleaned === '' ? fallback : cleaned.slice(0, 60)
}

/** 导出时写进文件的时间。 */
function stamp(date = new Date()) {
  const p = (n) => String(n).padStart(2, '0')
  return `${date.getFullYear()}-${p(date.getMonth() + 1)}-${p(date.getDate())} ${p(date.getHours())}:${p(date.getMinutes())}`
}

/** 病案正文（不含一级标题）。 */
export function recordBody(caseData, extra = {}) {
  const lines = []
  const push = (line) => lines.push(line)
  push('## 一、病史摘要')
  push('')
  push('```')
  push(caseSummary(caseData))
  push('```')
  if (typeof extra.pattern === 'string' && extra.pattern.trim() !== '') {
    push('')
    push('## 二、辨证结论')
    push('')
    push(extra.pattern.trim())
  }
  if (extra.sheet !== undefined) {
    push('')
    push('## 三、处方笺')
    push('')
    push(extra.sheet.markdown)
  }
  if (typeof extra.advice === 'string' && extra.advice.trim() !== '') {
    push('')
    push('## 四、医嘱与调护')
    push('')
    push(extra.advice.trim())
  }
  return lines.join('\n')
}

/** 组装完整病案文件内容。 */
export function composeRecord(caseData, extra = {}) {
  const name = String(caseData.patient?.name ?? '').trim()
  const who = name === '' || /不方便|匿名|不填|保密/.test(name) ? '未留名' : name
  const head = [
    `# 中医衷中参西病案 · ${who}`,
    '',
    `> 就诊时间：${stamp()}`,
    '> 本文件含个人健康信息，请妥善保管，勿随意转发或上传。'
  ]
  return `${head.join('\n')}\n\n${recordBody(caseData, extra)}\n`
}

/**
 * 分差很小（< minMargin）时，给出「合方 / 取最优 / 继续问」的可行选项。
 * @returns {{gap:number, a:object, b:object, combine:object, options:string[]}|undefined}
 */
export function describeCloseCall(ranking) {
  if (!Array.isArray(ranking) || ranking.length < 2) return undefined
  const [first, second] = ranking
  const gap = first.score - second.score
  if (gap >= TUNING.minMargin) return undefined
  const check = combineCheck(first.formula, second.formula)
  return {
    gap: Math.round(gap * 1000) / 10,
    a: { name: first.formula.name, score: Math.round(first.score * 100) },
    b: { name: second.formula.name, score: Math.round(second.score * 100) },
    combine: { level: check.level, reasons: check.reasons, overlap: check.overlap },
    options: check.level === 'block' ? ['pick_best', 'ask_more'] : ['combine', 'pick_best', 'ask_more']
  }
}

/**
 * 接近双选（<4%）的展示数据。
 * @param {{a:object,b:object,gap:number}} pair
 */
export function describePair(pair) {
  const view = (entry) => ({
    id: entry.formula.id,
    name: entry.formula.name,
    six: entry.formula.six,
    score: Math.round(entry.score * 100),
    coverage: pct(entry.score)
  })
  return {
    gap: Math.round(pair.gap * 1000) / 10,
    a: view(pair.a),
    b: view(pair.b)
  }
}

/** 分差保留一位小数，避免 0.7% 被四舍五入成 1%。 */
function gapText(gap) {
  return `${Math.round(gap * 1000) / 10}%`
}

/**
 * 用「姓名·主诉」重命名当前会话，顶替默认的「zhongzhong command session」。
 *
 * 会话标题由 dsh-session-title 管理：显式 rename 属于「用户指定」，会钉住标题，
 * 后续消息不再自动改写。拿不到服务或会话对象时静默跳过——标题不是关键路径。
 */
export function syncSessionTitle(ctx, exec, caseData) {
  const chief = String(caseData?.chief ?? '').trim()
  if (chief === '') return { status: 'skipped', reason: '还没有主诉' }
  const rawName = String(caseData?.patient?.name ?? '').trim()
  const anonymous = rawName === '' || /不方便|匿名|不填|保密|未知/.test(rawName)
  // 标题上限按字节算（默认 120 字节），中文一字 3 字节，取 30 字以内更稳妥
  const title = `${anonymous ? '患者' : rawName}·${chief}`.slice(0, 30)

  const titles = typeof ctx.get === 'function' ? ctx.get('sessionTitle') : ctx.sessionTitle
  if (titles === undefined || titles === null || typeof titles.rename !== 'function') {
    return { status: 'no-service', reason: '当前部署没有挂载 session-title 服务', title }
  }
  const session = exec?.agent?.session
  if (session === undefined) {
    return { status: 'no-session', reason: '拿不到当前会话对象（exec.agent.session 为空）', title }
  }
  try {
    titles.rename(session, title)
    return { status: 'renamed', title }
  } catch (error) {
    return { status: 'error', reason: error instanceof Error ? error.message : String(error), title }
  }
}

/** 标题同步结果的一行说明（给模型与卡片看）。 */
export function titleSyncLine(sync) {
  if (sync === undefined) return ''
  if (sync.status === 'renamed') return `会话标题已设为「${sync.title}」`
  if (sync.status === 'skipped') return ''
  return `会话标题未设置（${sync.status}：${sync.reason ?? ''}）`
}

/** 注册全部衷中参西工具。 */
export function registerZhongzhongTools(ctx, config = {}) {
  /** 医师强制开方口令（本机配置，仓库与 README 都不含）。 */
  const overridePhrase = typeof config.overridePhrase === 'string' ? config.overridePhrase.trim() : ''
  const allowCombine = config.allowCombine !== false
  ctx.tools.register(
    tool({
      name: 'zhongzhong_consult',
      description:
        '中医衷中参西问诊：以「选项列表」向患者提问并采集病历。stage 依次为 intake（姓名/年龄/性别/主诉）→ symptoms（寒热汗出头身胸腹饮食）→ symptoms2（二便睡眠咳喘其他）→ signs（体温/血压/脉搏/舌象/脉象）→ special（衷中参西录特征症：气机/出血/妇科/神志中风/消渴淋浊/胸膈五官/疮疡，按主诉选问）。' +
        '返回更新后的病历（case）。原则：先问清楚再判断，绝不跳步。若一次只问部分方面，重复调用本工具即可。',
      parameters: {
        type: 'object',
        properties: {
          stage: { type: 'string', enum: [...STAGES], description: '问诊阶段' },
          case: obj('当前病历（上一轮工具返回的 case；首轮省略）')
        },
        required: ['stage']
      },
      output: {
        schema: {
          type: 'object',
          properties: {
            status: { type: 'string', enum: ['ok', 'manual', 'cancelled', 'need_intake', 'error'] },
            stage: { type: 'string' },
            next_stage: str('下一个建议阶段'),
            summary: str('病历摘要'),
            message: str('提示'),
            questions: { type: 'array', items: { type: 'object' } },
            case: obj('更新后的病历')
          }
        },
        render: (_args, value) => TEXT_ONLY(value, consultText(value))
      },
      async execute(args, exec) {
        const stage = String(args.stage ?? '')
        let caseData = normalizeCase(args.case)

        if (!STAGES.includes(stage)) {
          return { status: 'error', message: `未知阶段 ${stage}，可用：${STAGES.join('、')}` }
        }
        if (stage !== 'intake' && caseData.chief === '') {
          return {
            status: 'need_intake',
            stage,
            message: '还没有主诉，无法开始问诊。请先调用 zhongzhong_consult({ stage: "intake" })。'
          }
        }

        const questions = questionsFor(stage)
        const asked = await askBatch(ctx, exec, questions)
        if (asked.kind === 'manual') {
          return {
            status: 'manual',
            stage,
            questions,
            summary: caseSummary(caseData),
            case: caseData,
            message: '当前没有可用的提问界面。请把下面的问题用 ask_user_question 原样问给患者，再把答案整理进 case 后调用下一个阶段。'
          }
        }
        if (asked.kind === 'cancelled') {
          return { status: 'cancelled', stage, summary: caseSummary(caseData), message: '患者取消了本轮问诊。' }
        }
        if (asked.kind === 'error') {
          return { status: 'error', stage, message: asked.message }
        }

        caseData = applyAnswers(caseData, asked.answers)
        const titleSync = syncSessionTitle(ctx, exec, caseData)
        const nextStage = nextStageAfter(stage)
        return {
          status: 'ok',
          stage,
          case: caseData,
          next_stage: nextStage,
          title_sync: titleSync,
          summary: caseSummary(caseData),
          message:
            nextStage === ''
              ? '问诊信息已采集完毕，可以进行辨证（zhongzhong_differentiate）。'
              : `本阶段已完成。下一步：zhongzhong_consult({ stage: "${nextStage}", case })`
        }
      }
    })
  )

  ctx.tools.register(
    tool({
      name: 'zhongzhong_differentiate',
      description:
        '衷中参西辨证：依据病历在同一套方证引擎里评估候选方剂（经方 + 张锡纯《医学衷中参西录》自拟方 + 药物篇单方）。遵守「宁可多问，不可早断」——主症命中不足时先弹鉴别问题；' +
        '但当前两方分差 <4% 时不再强行二选一，返回两首候选（pair），开方时分别核对两方。确定时返回 decided（含首选方与排序）。' +
        'exclude 用于排除已核查无效的方剂。',
      parameters: {
        type: 'object',
        properties: {
          case: obj('病历（zhongzhong_consult 返回的 case）'),
          exclude: { type: 'array', items: { type: 'string' }, description: '需要排除的方剂 id 或方名' }
        },
        required: ['case']
      },
      output: {
        schema: {
          type: 'object',
          properties: {
            status: { type: 'string', enum: ['decided', 'need_more', 'manual', 'cancelled', 'insufficient', 'error'] },
            six: str('六经归属'),
            chosen: obj('首选方剂'),
            pair: obj('接近双选：前两方分差 <4%，开方时分别出方由患者二选一'),
            ranking: { type: 'array', items: { type: 'object' } },
            questions: { type: 'array', items: { type: 'object' } },
            rounds: { type: 'integer' },
            summary: str('病历摘要'),
            message: str('提示'),
            case: obj('更新后的病历')
          }
        },
        render: (_args, value) => TEXT_ONLY(value, differentiateText(value))
      },
      async execute(args, exec) {
        let caseData = normalizeCase(args.case)
        syncSessionTitle(ctx, exec, caseData)
        const exclude = (args.exclude ?? []).map((x) => resolveFormula(x)?.id ?? x).filter((x) => typeof x === 'string')
        let rounds = 0
        /** 方族鉴别带来的加权，跨轮保留 */
        const boosts = {}
        let familyAsked = false
        let familyUndecided = false

        // 先补问鉴别点，直到自信或问不出新东西
        for (;;) {
          const ranking = rankFormulas(caseData, { exclude, boosts })

          // 同一方族有两首以上进候选：先问家族鉴别，再谈权重
          if (!familyAsked) {
            const inPlay = familyInPlay(ranking)
            if (inPlay !== undefined) {
              const answered = await askBatch(ctx, exec, inPlay.family.questions)
              if (answered.kind === 'manual') {
                return {
                  status: 'manual',
                  questions: inPlay.family.questions,
                  ranking: describeRanking(ranking),
                  summary: caseSummary(caseData),
                  case: caseData,
                  message: `这几首方同属「${inPlay.family.name}」，症状高度重叠。请用 ask_user_question 问清家族鉴别点后再继续。`
                }
              }
              if (answered.kind === 'cancelled') return { status: 'cancelled', summary: caseSummary(caseData), case: caseData }
              if (answered.kind === 'error') return { status: 'error', message: answered.message }

              const applied = applyFamilyAnswers(inPlay.family, answered.answers)
              if (applied.undecided) {
                // 患者说不清：不硬套方族，退回按客观症状继续问
                familyUndecided = true
              }
              if (applied.symptoms.length > 0) {
                caseData = mergeCase(caseData, { symptoms: applied.symptoms })
              }
              for (const [id, weight] of Object.entries(applied.boosts)) {
                boosts[id] = (boosts[id] ?? 0) + weight
              }
              familyAsked = true
              rounds += 1
              continue
            }
          }

          const conf = confidence(ranking)
          // 前两方分差 <4%：不再继续追问，直接进入「分别出方、患者二选一」。
          if (closePrescriptionPair(ranking) !== undefined) break
          if (conf.confident && rounds > 0) break
          if (conf.confident && rounds === 0) break
          const ds = discriminators(caseData, ranking)
          if (ds.length === 0 || rounds >= MAX_ROUNDS) break

          const question = {
            id: `discriminate_${rounds + 1}`,
            header: '再确认几个细节',
            question: '为了让方证更明确，请确认以下情况（可多选；都没有就选「以上都没有」）：',
            options: [...ds.map((d) => ({ label: d.label })), { label: '以上都没有' }],
            multi_select: true
          }
          const asked = await askBatch(ctx, exec, [question])
          if (asked.kind === 'manual') {
            return {
              status: 'manual',
              questions: [question],
              ranking: describeRanking(ranking),
              summary: caseSummary(caseData),
              case: caseData,
              message: '当前没有可用的提问界面，请用 ask_user_question 代问后把答案并入 case，再次调用本工具。'
            }
          }
          if (asked.kind === 'cancelled') return { status: 'cancelled', summary: caseSummary(caseData), case: caseData }
          if (asked.kind === 'error') return { status: 'error', message: asked.message }

          const before = caseData.symptoms.length
          caseData = applyAnswers(caseData, asked.answers)
          markAsked(
            caseData,
            ds.map((d) => d.id)
          )
          rounds += 1
          if (caseData.symptoms.length === before) break
        }

        const ranking = rankFormulas(caseData, { exclude, boosts })
        const conf = confidence(ranking)
        const six = inferSix(caseData)
        // 衷中参西录方不按六经归类；首选是张锡纯方时，卡片直接显示「衷中」
        const displaySix = ranking.length > 0 && ranking[0].formula.school === 'zhongzhong' ? '衷中' : six.channel

        if (ranking.length === 0) {
          return {
            status: 'insufficient',
            six: displaySix,
            summary: caseSummary(caseData),
            case: caseData,
            message: '现有症状没有任何方证命中。请回到问诊阶段补充信息（尤其是寒热、二便、胸腹、舌脉）。'
          }
        }

        const pair = closePrescriptionPair(ranking)
        if (pair !== undefined) {
          const top = pair.a
          return {
            status: 'decided',
            six: displaySix,
            chosen: {
              id: top.formula.id,
              name: top.formula.name,
              six: top.formula.six,
              school: top.formula.school ?? 'jingfang',
              book: top.formula.book ?? 'jingfang',
              kind: top.formula.kind ?? 'formula',
              route: top.formula.route ?? 'internal',
              score: Math.round(top.score * 100) / 100,
              coverage: pct(top.score),
              pattern: top.formula.pattern,
              brief: briefOf(top.formula),
              matched: top.matched.map((m) => labelOf(m.id))
            },
            pair: describePair(pair),
            ranking: describeRanking(ranking),
            rounds,
            summary: caseSummary(caseData),
            case: caseData,
            message: `两首方分差仅 ${gapText(pair.gap)}（${pair.a.formula.name} ${pct(pair.a.score)} vs ${pair.b.formula.name} ${pct(pair.b.score)}），按本机规则不再强行二选一：开方时会分别核对两方，都过门槛则分别出方由患者二选一。下一步调用 zhongzhong_evidence / zhongzhong_prescribe。`
          }
        }

        if (!conf.confident) {
          const ds = discriminators(caseData, ranking)
          const closeCall = describeCloseCall(ranking)
          const tail = closeCall === undefined
            ? ''
            : `\n\n两方分差仅 ${closeCall.gap}%（${closeCall.a.name} ${closeCall.a.score}% vs ${closeCall.b.name} ${closeCall.b.score}%）。\n` +
              (closeCall.combine.level === 'block'
                ? `不能合方：${closeCall.combine.reasons.join('；')}。可让患者在两者中选其一，或继续追问。`
                : `可选：① 合方（zhongzhong_prescribe 传 combine: ["${closeCall.a.name}","${closeCall.b.name}"]）；` +
                  `② 取当前最优「${closeCall.a.name}」；③ 继续追问。合方前已做相容性检查：${closeCall.combine.reasons.join('；')}。`)
          return {
            status: 'need_more',
            six: displaySix,
            ranking: describeRanking(ranking),
            close_call: closeCall,
            questions: ds.map((d) => ({ id: d.id, label: d.label, question: d.label })),
            rounds,
            summary: caseSummary(caseData),
            case: caseData,
            message:
              `${conf.reason}。还不能给方：请继续提问。可直接再次调用 zhongzhong_differentiate（会自动追问），或用 ask_user_question 询问上述待确认要点。` +
              (familyUndecided ? '（患者对家族鉴别点说不清，不要再逼他选，改问客观症状或建议面诊。）' : '') +
              tail
          }
        }

        // 候选确认：让患者在有依据的情况下选一次
        const top = ranking.slice(0, 3)
        const options = [
          ...top.map((entry, index) => ({
            label: `${entry.formula.name}${index === 0 ? '（推荐）' : ''}——${pct(entry.score)}`,
            description: `方证：${briefOf(entry.formula)}`
          })),
          { label: '以上都没有（都不像，请继续追问）' },
          { label: '由医生按排序决定' }
        ]
        const pick = await askBatch(ctx, exec, [
          {
            id: 'choose_formula',
            header: '候选方剂',
            question: '综合目前的症状与舌脉，最接近哪个方证？（不确定可选「由医生按排序决定」）',
            options
          }
        ])
        if (pick.kind === 'manual') {
          return {
            status: 'manual',
            six: displaySix,
            ranking: describeRanking(ranking),
            summary: caseSummary(caseData),
            case: caseData,
            questions: [
              {
                id: 'choose_formula',
                header: '候选方剂',
                question: '综合目前的症状与舌脉，最接近哪个方证？',
                options
              }
            ],
            message: '当前没有可用的提问界面，请用 ask_user_question 让患者选择候选方剂。'
          }
        }
        if (pick.kind === 'cancelled') return { status: 'cancelled', six: displaySix, summary: caseSummary(caseData), case: caseData }
        if (pick.kind === 'error') return { status: 'error', message: pick.message }

        const chosenLabel = pick.answers[0]?.selected?.[0] ?? pick.answers[0]?.custom ?? ''
        if (chosenLabel.includes('都不像')) {
          const ds = discriminators(caseData, ranking)
          return {
            status: 'need_more',
            six: displaySix,
            ranking: describeRanking(ranking),
            questions: ds.map((d) => ({ id: d.id, label: d.label, question: d.label })),
            rounds,
            summary: caseSummary(caseData),
            case: caseData,
            message: '患者认为候选方都不像。请回到问诊补充方面（例如寒热、二便、胸腹、睡眠），或继续追问上述要点。'
          }
        }

        const picked = top.find((entry) => chosenLabel.includes(entry.formula.name)) ?? top[0]
        return {
          status: 'decided',
          six: displaySix,
          chosen: {
            id: picked.formula.id,
            name: picked.formula.name,
            six: picked.formula.six,
            school: picked.formula.school ?? 'jingfang',
            book: picked.formula.book ?? 'jingfang',
            kind: picked.formula.kind ?? 'formula',
            route: picked.formula.route ?? 'internal',
            score: Math.round(picked.score * 100) / 100,
            coverage: pct(picked.score),
            pattern: picked.formula.pattern,
            brief: briefOf(picked.formula),
            matched: picked.matched.map((m) => labelOf(m.id))
          },
          ranking: describeRanking(ranking),
          rounds,
          summary: caseSummary(caseData),
          case: caseData,
          message: `已确定候选方 ${picked.formula.name}。下一步必须调用 zhongzhong_evidence 核查文献，有支撑才可开方。`
        }
      }
    })
  )

  ctx.tools.register(
    tool({
      name: 'zhongzhong_evidence',
      description:
        '文献核查：查《伤寒论》《金匮要略》条文，以及《医学衷中参西录》原书主治/方论中是否有与本案见症对应的内容；现代文献交给 dsh-tcm-lit 的 tcm_lit_search 检索中文期刊题录（题名/刊名/年份/DOI）。' +
        'verdict 为 supported（有经典条文支撑，可进入开方）、weak（条文相关但方证覆盖不足）、modern-only（仅现代研究）、unsupported（无支撑）。' +
        '若本方为当前排序第一且匹配度 >70%，即使 verdict 不是 supported，也会返回 high_match.eligible=true，可按高匹配度例外进入开方（仍须患者确认）。' +
        '否则按返回的 alternatives 回到 zhongzhong_differentiate 换方。',
      parameters: {
        type: 'object',
        properties: {
          case: obj('病历'),
          formula: str('方剂名（如「桂枝汤」）或 id'),
          online: { type: 'boolean', description: '是否联网检索中文文献（dsh-tcm-lit），默认 true' }
        },
        required: ['case', 'formula']
      },
      output: {
        schema: {
          type: 'object',
          properties: {
            status: { type: 'string', enum: ['ok', 'error'] },
            verdict: { type: 'string', enum: ['supported', 'weak', 'modern-only', 'unsupported', 'unverified'] },
            verdict_label: str('判定中文'),
            formula: obj('方剂'),
            coverage: str('方证覆盖度'),
            classic: { type: 'array', items: { type: 'object' } },
            modern: obj('现代文献检索结果'),
            high_match: obj('高匹配度例外（当前排序第一且匹配度 >70%）'),
            alternatives: { type: 'array', items: { type: 'object' } },
            message: str('提示')
          }
        },
        render: (_args, value) =>
          TEXT_ONLY(
            value,
            value.status === 'error'
              ? `Error: ${value.message}`
              : [
                  value.markdown ?? '',
                  '',
                  '---',
                  `判定：**${value.verdict_label}**。${
                    value.verdict === 'supported'
                      ? '可以进入 zhongzhong_prescribe 开方。'
                      : value.high_match?.eligible === true
                        ? '可按高匹配度例外进入 zhongzhong_prescribe 开方（文献未支持，开方时仍须患者确认）。'
                        : '不得开方：请按 alternatives 换方并回到 zhongzhong_differentiate。'
                  }`
                ].join('\n')
          )
      },
      async execute(args, exec) {
        const formula = resolveFormula(args.formula)
        if (formula === undefined) {
          return { status: 'error', message: `没有找到方剂「${args.formula}」。可先调用 zhongzhong_formula 查询方名。` }
        }
        const caseData = normalizeCase(args.case)
        const report = await verify(caseData, formula, {
          signal: exec.signal,
          online: args.online !== false,
          literatureSearch: literatureSearchOf(ctx, exec)
        })
        return {
          status: 'ok',
          verdict: report.verdict,
          verdict_label: verdictLabel(report.verdict),
          formula: report.formula,
          coverage: report.coverage,
          classic: report.classic,
          modern: report.modern,
          high_match: report.highMatch,
          alternatives: report.alternatives,
          markdown: evidenceText(report),
          message: report.reason
        }
      }
    })
  )

  ctx.tools.register(
    tool({
      name: 'zhongzhong_formula',
      description: '方剂详情：按方名查询组成、原方剂量（经方 1 两=3 克；张锡纯方清制 1 两=30 克）、煎服法/用法、方证要点、原文/原书主治与注意事项。适用于经方、衷中参西录方与单方。',
      parameters: {
        type: 'object',
        properties: {
          name: str('方剂名或别名，例如「小柴胡汤」')
        },
        required: ['name']
      },
      output: {
        schema: {
          type: 'object',
          properties: {
            status: { type: 'string', enum: ['ok', 'not_found'] },
            formula: obj('方剂'),
            markdown: str('方剂详情'),
            message: str('提示')
          }
        },
        render: (_args, value) => TEXT_ONLY(value, value.markdown ?? `Error: ${value.message ?? '未找到方剂'}`)
      },
      async execute(args) {
        const formula = resolveFormula(args.name)
        if (formula === undefined) {
          return { status: 'not_found', message: `未收录方剂「${args.name}」。` }
        }
        return {
          status: 'ok',
          formula: {
            id: formula.id,
            name: formula.name,
            six: formula.six,
            source: formula.source,
            pattern: formula.pattern,
            composition: formula.composition.map((part) => doseText(part, formula.doseSystem === 'qing' ? 'qing' : 'han'))
          },
          markdown: formulaMarkdown(formula)
        }
      }
    })
  )

  ctx.tools.register(
    tool({
      name: 'zhongzhong_prescribe',
      description:
        '开方：先做危险信号筛查与文献复核，再向患者弹出「确认开方」选项，确认后才生成处方笺（含原方剂量、按方剂体系折算、煎服法/用法、用药警示、免责声明）。经方按汉制 1 两=3 克；张锡纯方按清制 1 两=30 克；单方与外用方会单独标注。' +
        '文献判定不是 supported 时，若本方为当前排序第一且匹配度 >70%，可按「高匹配度例外」开方（仍须患者确认）；前两方分差 <4% 时返回 status=choose，分别给出两方处方，由患者二选一（不可同时服用）。命中危险信号时建议立即就医。',
      parameters: {
        type: 'object',
        properties: {
          case: obj('病历'),
          formula: str('方剂名或 id'),
          combine: {
            type: 'array',
            items: { type: 'string' },
            description: '合方：传两个方名（如 ["桂枝汤","小柴胡汤"]），此时忽略 formula。仅在两方病机相容时可用'
          },
          clinician_override: str('医师强制开方口令（仅本机配置了才生效，患者不要填写）'),
          modifications: { type: 'array', items: { type: 'string' }, description: '随证加减（如「咳嗽加杏仁 9g」）' },
          notes: str('医嘱补充'),
          online: { type: 'boolean', description: '是否联网复核中文文献（dsh-tcm-lit），默认 true' }
        },
        required: ['case', 'formula']
      },
      output: {
        schema: {
          type: 'object',
          properties: {
            status: { type: 'string', enum: ['prescribed', 'choose', 'blocked', 'emergency', 'declined', 'change', 'evidence_only', 'manual', 'cancelled', 'error'] },
            verdict: str('文献判定'),
            formula: obj('方剂'),
            sheet: obj('处方笺'),
            candidates: { type: 'array', items: { type: 'object' }, description: '接近双选时的两方处方（各含 sheet）' },
            pair: obj('接近双选信息'),
            high_match: obj('高匹配度例外'),
            alternatives: { type: 'array', items: { type: 'object' } },
            reasons: { type: 'array', items: { type: 'string' } },
            questions: { type: 'array', items: { type: 'object' } },
            markdown: str('处方笺 Markdown'),
            message: str('提示')
          }
        },
        render: (_args, value) => TEXT_ONLY(value, prescribeText(value))
      },
      async execute(args, exec) {
        const caseData = normalizeCase(args.case)
        const combineNames = (Array.isArray(args.combine) ? args.combine : []).filter((x) => typeof x === 'string' && x.trim() !== '')
        const override = overridePhrase !== '' && String(args.clinician_override ?? '').trim() === overridePhrase

        let formula
        let combineInfo
        let parts = []
        if (combineNames.length > 0) {
          if (combineNames.length !== 2) {
            return { status: 'error', message: '合方需要正好两个方名，例如 combine: ["桂枝汤","小柴胡汤"]。' }
          }
          if (!allowCombine) return { status: 'error', message: '本机未开启合方功能。' }
          const left = resolveFormula(combineNames[0])
          const right = resolveFormula(combineNames[1])
          if (left === undefined || right === undefined) {
            return { status: 'error', message: `没有找到方剂「${left === undefined ? combineNames[0] : combineNames[1]}」。` }
          }
          combineInfo = combineCheck(left, right)
          if (combineInfo.level === 'block') {
            return {
              status: 'blocked',
              reasons: combineInfo.reasons,
              message: `不能合方：${combineInfo.reasons.join('；')}。请改取其中一首，或回到辨证重新选方。`
            }
          }
          formula = buildCombined(left, right)
          parts = [left, right]
        } else {
          formula = resolveFormula(args.formula)
        }
        if (formula === undefined) return { status: 'error', message: `没有找到方剂「${args.formula}」。` }

        // 1. 危险信号
        const flags = redFlags(caseData)
        if (flags.level === 'emergency' && !override) {
          return {
            status: 'emergency',
            reasons: flags.reasons,
            message: `出现需要立即就医的情况：${flags.reasons.join('；')}。此时不应自行服药，请立即前往急诊或拨打 120。`
          }
        }

        // 2. 文献复核（防绕过）：合方要求两首方各自通过
        const online = args.online !== false
        const literatureSearch = literatureSearchOf(ctx, exec)
        const partReports = parts.length === 0
          ? []
          : await Promise.all(parts.map((part) => verify(caseData, part, { signal: exec.signal, online, literatureSearch })))
        const report = parts.length === 0
          ? await verify(caseData, formula, { signal: exec.signal, online, literatureSearch })
          : partReports.find((r) => r.verdict === 'supported') ?? partReports[0]

        const highMatch = parts.length === 0
          ? highMatchException(caseData, formula)
          : { eligible: false, threshold: TUNING.highMatchThreshold, score: 0, top: null, reason: '合方不适用高匹配度例外。' }

        // 接近双选：前两方分差 <4%，分别出方由患者二选一。
        const ranking = parts.length === 0 ? rankFormulas(caseData) : []
        const pair = parts.length === 0 && !override ? closePrescriptionPair(ranking) : undefined
        const pairInvolvesFormula = pair !== undefined && (pair.a.formula.id === formula.id || pair.b.formula.id === formula.id)
        let pairCandidates
        if (pairInvolvesFormula) {
          const entries = [pair.a, pair.b]
          const pairReports = await Promise.all(
            entries.map((entry) =>
              entry.formula.id === formula.id
                ? Promise.resolve(report)
                : verify(caseData, entry.formula, { signal: exec.signal, online, literatureSearch })
            )
          )
          pairCandidates = entries.map((entry, index) => ({
            entry,
            report: pairReports[index],
            // 接近双选时，两方都可按「匹配度 >70%」的高匹配例外放行；否则仍要求文献 supported。
            eligible: pairReports[index].verdict === 'supported' || entry.score > TUNING.highMatchThreshold + 1e-9
          }))
        }

        if (pairCandidates !== undefined) {
          const eligible = pairCandidates.filter((candidate) => candidate.eligible)
          const requested = pairCandidates.find((candidate) => candidate.entry.formula.id === formula.id)
          if (eligible.length === 2) {
            const candidates = pairCandidates.map(({ entry, report: candidateReport }) => {
              const notes = [
                `接近双选：两方分差 ${gapText(pair.gap)}，本处方仅供二选一，**不要与另一方同时服用**。`
              ]
              if (entry.formula.id !== formula.id && (args.modifications ?? []).length > 0) {
                notes.push('本次加减只套用在点名的方，另一方按原方出方。')
              }
              if (candidateReport.verdict !== 'supported') {
                notes.push(`高匹配度例外：匹配度 ${pct(entry.score)} > 70%，文献核查为「${verdictLabel(candidateReport.verdict)}」。`)
              }
              const sheet = buildSheet(caseData, entry.formula, {
                modifications: entry.formula.id === formula.id ? (args.modifications ?? []) : [],
                notes: [args.notes ?? '', ...notes].filter((x) => x.trim() !== '').join('\n'),
                ...(candidateReport.verdict === 'supported'
                  ? {}
                  : {
                      highMatch: {
                        eligible: true,
                        pair: true,
                        threshold: TUNING.highMatchThreshold,
                        score: entry.score,
                        verdict: candidateReport.verdict,
                        verdictLabel: verdictLabel(candidateReport.verdict)
                      }
                    })
              })
              return {
                id: entry.formula.id,
                name: entry.formula.name,
                six: entry.formula.six,
                score: Math.round(entry.score * 1000) / 1000,
                coverage: pct(entry.score),
                verdict: candidateReport.verdict,
                eligible: true,
                evidence: candidateReport,
                sheet
              }
            })
            const [first, second] = candidates
            const markdown = [
              `# 接近双选：${first.name} / ${second.name}`,
              '',
              `> 两方分差仅 ${gapText(pair.gap)}（${first.name} ${first.coverage} vs ${second.name} ${second.coverage}）。以下为两首方各自的处方笺，请**任选其一**；**不要同时服用**。`,
              '',
              '---',
              '',
              `## 选项一：${first.name}（${first.coverage}）`,
              '',
              first.sheet.markdown,
              '',
              '---',
              '',
              `## 选项二：${second.name}（${second.coverage}）`,
              '',
              second.sheet.markdown
            ].join('\n')
            const question = {
              id: 'choose_near_tie',
              header: '接近双选',
              question: `两方分差仅 ${gapText(pair.gap)}。已分别出方，请二选一（不要同时服用）：`,
              options: [
                { label: `用 ${first.name}（${first.coverage}）` },
                { label: `用 ${second.name}（${second.coverage}）` },
                { label: '先看两方依据' },
                { label: '暂不开方' }
              ]
            }
            const caution = flags.level === 'caution' ? flags.reasons : []
            return {
              status: 'choose',
              verdict: report.verdict,
              formula: report.formula,
              pair: describePair(pair),
              candidates,
              high_match: highMatch,
              questions: [question],
              markdown: caution.length === 0 ? markdown : `${markdown}\n\n> ⚠️ 另请注意：${caution.join('；')}，建议同时就医评估。`,
              message: `两方分差仅 ${gapText(pair.gap)}，已分别出方。请让患者二选一；不要同时服用。`
            }
          }
          if (eligible.length === 1 && requested?.eligible !== true) {
            const other = eligible[0]
            return {
              status: 'blocked',
              verdict: report.verdict,
              reasons: [`${formula.name}：${report.reason}`, `${other.entry.formula.name}：${other.report.reason}`],
              alternatives: [
                {
                  id: other.entry.formula.id,
                  name: other.entry.formula.name,
                  six: other.entry.formula.six,
                  score: Math.round(other.entry.score * 100) / 100,
                  matched: other.entry.matched.slice(0, 4).map((m) => labelOf(m.id))
                }
              ],
              message: `两方分差仅 ${gapText(pair.gap)}，但「${formula.name}」未过开方门槛；同分的「${other.entry.formula.name}」已过。请改用后者，或回到辨证继续确认。`
            }
          }
        }

        const failing = parts.length === 0
          ? (report.verdict === 'supported' ? [] : [{ name: formula.name, report }])
          : partReports.filter((r) => r.verdict !== 'supported').map((r) => ({ name: r.formula.name, report: r }))
        const exception = parts.length === 0 && !override && failing.length > 0 && highMatch.eligible
        let pairNote = ''
        if (pairCandidates !== undefined) {
          const eligible = pairCandidates.filter((candidate) => candidate.eligible)
          const other = eligible[0]?.entry.formula.id === formula.id ? pairCandidates.find((candidate) => candidate.entry.formula.id !== formula.id) : eligible[0]
          if (eligible.length === 1 && other !== undefined) {
            pairNote = `接近双选说明：两方分差仅 ${gapText(pair.gap)}，但「${other.entry.formula.name}」未过开方门槛，因此本次只出「${formula.name}」。`
          }
        }

        if (failing.length > 0 && !override && !exception) {
          const first = failing[0]
          return {
            status: 'blocked',
            verdict: first.report.verdict,
            reasons: failing.map((f) => `${f.name}：${f.report.reason}`),
            alternatives: report.alternatives,
            message: [
              failing.length === 2 ? '两首方都未通过文献核查：' : `${failing[0].name} 未通过文献核查：`,
              ...failing.map((f) => `- ${f.name}（${verdictLabel(f.report.verdict)}）：${f.report.reason}`),
              '请回到第 4 步换方；若两首方分差很小，可考虑合方（combine 参数）或取当前最优方。',
              ...(pairCandidates !== undefined ? [`两方分差仅 ${gapText(pair.gap)}，但两方都未过开方门槛（需文献支持，或匹配度 >70%）。`] : [])
            ].join('\n')
          }
        }

        // 3. 患者确认
        const question = exception
          ? {
              id: 'confirm_prescribe',
              header: '确认开方（高匹配度例外）',
              question: `文献未支持（${verdictLabel(report.verdict)}），但「${formula.name}」是当前最高匹配方（${pct(highMatch.score)}，>70%）。是否按本方开具？`,
              options: [
                { label: '确认开方' },
                { label: '先看文献依据' },
                { label: '换一个方' },
                { label: '暂不开方' }
              ]
            }
          : {
              id: 'confirm_prescribe',
              header: '确认开方',
              question: `文献已核实：${report.classic.length} 条原文与您的见症相符。是否按「${formula.name}」开具处方？`,
              options: [
                { label: '确认开方' },
                { label: '先看文献依据' },
                { label: '换一个方' },
                { label: '暂不开方' }
              ]
            }
        const confirm = await askBatch(ctx, exec, [question])
        if (confirm.kind === 'manual') {
          return {
            status: 'manual',
            verdict: report.verdict,
            questions: [question],
            message: '当前没有可用的提问界面：请用 ask_user_question 让患者确认「确认开方」后，再重新调用本工具。'
          }
        }
        if (confirm.kind === 'cancelled') return { status: 'cancelled' }
        if (confirm.kind === 'error') return { status: 'error', message: confirm.message }

        const choice = confirm.answers[0]?.selected?.[0] ?? confirm.answers[0]?.custom ?? ''
        if (choice.includes('暂不')) return { status: 'declined', message: '患者选择暂不开方。' }
        if (choice.includes('换一个')) {
          return { status: 'change', alternatives: report.alternatives, message: '患者要求换方，请回到 zhongzhong_differentiate。' }
        }
        if (choice.includes('先看')) {
          return {
            status: 'evidence_only',
            verdict: report.verdict,
            ...(exception ? { high_match: highMatch } : {}),
            markdown: evidenceText(report),
            message: exception
              ? '已展示文献依据与高匹配度例外说明。可再次调用 zhongzhong_prescribe 请患者确认开方。'
              : '已展示文献依据。可再次调用 zhongzhong_prescribe 请患者确认开方。'
          }
        }

        // 4. 出方
        const forceNotes = []
        if (override && flags.level === 'emergency') {
          forceNotes.push(`⚠️ 本例存在急诊指征：${flags.reasons.join('；')}。处置顺序应为「先急诊、后调理」，本处方不得替代急诊处理。`)
        }
        if (override) {
          forceNotes.push(
            '⚠️ 医师强制开方：本次未通过常规文献/红旗门槛，由医师据临床经验决定，仅限医师本人决策使用。须先排除急诊指征，患者应同步就医。'
          )
        }
        if (exception) {
          forceNotes.push(
            `⚠️ 高匹配度例外开方：本方为当前最高匹配方（${pct(highMatch.score)}，>70%），文献核查未通过（${verdictLabel(report.verdict)}）。本处方不属于文献支持开方，须由执业中医师复核。`
          )
        }
        if (pairNote !== '') forceNotes.push(pairNote)
        if (combineInfo !== undefined && combineInfo.reasons.length > 0) {
          forceNotes.push(`合方说明：${combineInfo.reasons.join('；')}。两方原量叠加，须按体质酌减。`)
        }
        const sheet = buildSheet(caseData, formula, {
          modifications: args.modifications ?? [],
          notes: [args.notes ?? '', ...forceNotes].filter((x) => x.trim() !== '').join('\n'),
          evidence: report,
          ...(exception
            ? {
                highMatch: {
                  eligible: true,
                  threshold: TUNING.highMatchThreshold,
                  score: highMatch.score,
                  verdict: report.verdict,
                  verdictLabel: verdictLabel(report.verdict)
                }
              }
            : {})
        })
        const caution = flags.level === 'caution' ? flags.reasons : []
        return {
          status: 'prescribed',
          verdict: report.verdict,
          ...(exception ? { high_match: highMatch } : {}),
          formula: parts.length > 0
            ? { id: formula.id, name: formula.name, six: formula.six, school: formula.school, combined: true }
            : report.formula,
          sheet,
          markdown: caution.length === 0 ? sheet.markdown : `${sheet.markdown}\n\n> ⚠️ 另请注意：${caution.join('；')}，建议同时就医评估。`,
          message: exception
            ? '处方已生成（高匹配度例外，文献未支持）。请提醒患者：本处方须在执业中医师指导下使用，3 剂后复诊。'
            : '处方已生成。请提醒患者：本方需在执业中医师指导下使用，3 剂后复诊。'
        }
      }
    })
  )

  ctx.tools.register(
    tool({
      name: 'zhongzhong_discuss',
      description:
        '医患沟通·守正答辩：当患者对结论提出质疑、要求换方或拿出别的说法时调用。' +
        '先自动核对：①患者的话里是否含新的病情信息 ②是否提到妊娠/高血压/心脏病/糖尿病/出血等用药禁忌；' +
        '若确实说错（含禁忌、或新信息改变判断）就明确修正并换方；否则维持原判，同时给出三层依据（方证要点/原文/中文文献）并追问患者的依据来源。' +
        '态度可以坚定，但依据必须可复核；绝不因为患者坚持就改方，也不为了面子硬撑。',
      parameters: {
        type: 'object',
        properties: {
          case: obj('病历'),
          formula: str('当前判断的方剂（方名或 id）'),
          objection: str('患者质疑的原话，尽量完整摘录'),
          online: { type: 'boolean', description: '是否联网核查中文文献（dsh-tcm-lit），默认 true' }
        },
        required: ['case', 'formula', 'objection']
      },
      output: {
        schema: {
          type: 'object',
          properties: {
            status: { type: 'string', enum: ['maintain', 'revise', 'manual', 'cancelled', 'error'] },
            stance_label: str('立场标签'),
            objection: str('患者原话'),
            new_findings: { type: 'array', items: { type: 'string' } },
            conflicts: { type: 'array', items: { type: 'object' } },
            basis: obj('依据'),
            revision: obj('修正方案'),
            questions: { type: 'array', items: { type: 'object' } },
            markdown: str('应答稿'),
            message: str('提示'),
            case: obj('更新后的病历')
          }
        },
        render: (_args, value) =>
          TEXT_ONLY(value, value.markdown === undefined ? String(value.message ?? value.status) : value.markdown)
      },
      async execute(args, exec) {
        const formula = resolveFormula(args.formula)
        if (formula === undefined) return { status: 'error', message: `没有找到方剂「${args.formula}」。` }
        const objection = String(args.objection ?? '').trim()
        if (objection === '') return { status: 'error', message: '请把患者的质疑原话放进 objection。' }

        const caseData = normalizeCase(args.case)
        const concerns = detectConcerns(objection)
        const conflicts = findConflicts(formula, concerns)
        const newIds = newSymptomsFrom(objection, caseData)
        const merged = newIds.length === 0 ? caseData : mergeCase(caseData, { symptoms: newIds })

        const ranking = rankFormulas(merged)
        const top = ranking[0]
        const alternative = ranking.find((entry) => entry.formula.id !== formula.id && entry.score >= TUNING.minScore)
        const stillTop = top !== undefined && top.formula.id === formula.id
        const report = await verify(merged, formula, {
          signal: exec.signal,
          online: args.online !== false,
          literatureSearch: literatureSearchOf(ctx, exec)
        })

        let stance
        let reason
        if (conflicts.length > 0) {
          stance = 'revise'
          reason = `您提到的「${conflicts.map((c) => c.concern).join('、')}」与方中的 ${[...new Set(conflicts.flatMap((c) => c.herbs))].join('、')} 存在明确的用药风险，这一点是我之前没有问到的，必须改。`
        } else if (!stillTop && alternative !== undefined) {
          stance = 'revise'
          reason = newIds.length > 0
            ? `您这句话里包含了我此前没有采集到的信息（${newIds.map(labelOf).join('、')}），并入后重新计算，${top.formula.name} 的方证吻合度更高（${Math.round(alternative.score * 100)}% vs ${Math.round((ranking.find((r) => r.formula.id === formula.id)?.score ?? 0) * 100)}%）。`
            : `按现有病历重新核对，${top.formula.name} 的吻合度确实高于 ${formula.name}，是我前面的判断站不住。`
        } else {
          stance = 'maintain'
          const exceptionNote = report.highMatch?.eligible === true ? `；且本方为当前排序第一（${pct(report.highMatch.score)} >70%），按高匹配度例外开方` : ''
          reason = `依据是方证对应：您身上的 ${(report.classic[0]?.matched ?? []).slice(0, 4).map((m) => m.label).join('、') || formula.pattern.slice(0, 4).join('、')} 与原文描述一致，方证覆盖度 ${report.coverage}${exceptionNote}；这类质疑不足以推翻结论。`
        }

        const revision =
          stance === 'revise' && alternative !== undefined
            ? { from: formula.name, to: alternative.formula.name, to_id: alternative.formula.id, why: reason }
            : null

        // 维持原判时，追问患者的依据（选项列表）
        let patientReason
        const questions = []
        if (stance === 'maintain') {
          const asked = await askBatch(ctx, exec, [sourceQuestion(), concernQuestion()])
          if (asked.kind === 'cancelled') return { status: 'cancelled', case: merged, message: '患者中断了沟通。' }
          if (asked.kind === 'error') return { status: 'error', message: asked.message }
          if (asked.kind === 'manual') {
            return {
              status: 'manual',
              objection,
              case: merged,
              questions: [sourceQuestion(), concernQuestion()],
              message: '当前没有可用的提问界面：请用 ask_user_question 追问患者的依据来源与担心点，再决定怎么回应。'
            }
          }
          const sources = (asked.answers.find((a) => a.id === 'objection_source')?.selected ?? []).filter(
            (label) => label !== '' && label !== '以上都没有'
          )
          const concerns2 = (asked.answers.find((a) => a.id === 'objection_concern')?.selected ?? []).filter(
            (label) => label !== '' && label !== '以上都没有'
          )
          patientReason = { sources, concerns: concerns2 }
          if (patientReason.sources.length === 0 && patientReason.concerns.length === 0) patientReason = undefined
        }

        const markdown = buildDefense({
          caseData: merged,
          formula,
          stance,
          reason,
          report,
          conflicts,
          newFindings: newIds,
          patientReason,
          alternative
        })

        return {
          status: stance,
          stance_label: stanceLabel(stance),
          objection,
          new_findings: newIds.map(labelOf),
          conflicts,
          basis: {
            coverage: report.coverage,
            matched: report.classic.flatMap((hit) => hit.matched.map((m) => m.label)),
            classical: report.classic.map((hit) => ({ ref: hit.ref, text: hit.text })),
            modern: (report.modern.hits ?? []).slice(0, 3).map((hit) => ({
              title: hit.title,
              journal: hit.journal,
              year: hit.year,
              doi: hit.doi,
              url: hit.url
            }))
          },
          ...(revision === null ? {} : { revision }),
          markdown,
          case: merged,
          message:
            stance === 'maintain'
              ? '已维持原判并给出依据。回答时先复述结论，再逐条给依据，最后说明什么情况下会改方。'
              : '已修正判断。请明确承认前面没考虑到的地方，然后按新结论重新核查文献、开方。'
        }
      }
    })
  )
  ctx.tools.register(
    tool({
      name: 'zhongzhong_export',
      description:
        '把本次接诊导出成 Markdown 病案文件（病历摘要 + 辨证结论 + 处方笺 + 医嘱），默认存到 ~/中医病案/<日期>-<患者>.md。' +
        '同一患者复诊时默认追加到同一文件，形成连续档案。文件含个人健康信息，工具会在返回值里提示保管。' +
        '开方之后或患者要求留存时调用；未开方也可以只导出病历。',
      parameters: {
        type: 'object',
        properties: {
          case: obj('要导出的病历（上一次工具返回的 case）'),
          formula: str('已确定的方名（可选；给了就附上处方笺）'),
          modifications: str('随证加减（可选，逗号分隔）'),
          pattern: str('辨证结论（可选，模型整理的一段话：六经、方证、鉴别要点）'),
          advice: str('医嘱与调护（可选）'),
          dir: str('保存目录，默认 ~/中医病案'),
          filename: str('文件名，默认 <日期>-<患者>.md'),
          append: { type: 'boolean', description: '文件已存在时追加（默认 true）' }
        },
        required: ['case']
      },
      output: {
        schema: {
          type: 'object',
          properties: {
            status: str('ok 或 error'),
            path: str('最终写入的绝对路径'),
            bytes: { type: 'number', description: '本次写入的字节数' },
            appended: { type: 'boolean', description: '是否追加到已有文件' },
            markdown: str('写入的完整内容'),
            message: str('给模型看的说明')
          }
        },
        render: (args, value) => TEXT_ONLY('zhongzhong_export', exportText(value))
      },
      async execute(args) {
        const caseData = normalizeCase(args.case)
        if (caseData.chief === '' && caseData.symptoms.length === 0) {
          return { status: 'error', message: '病历为空，没有可导出的内容。请先完成问诊。' }
        }

        const formulaName = String(args.formula ?? '').trim()
        let sheet
        if (formulaName !== '') {
          const formula = resolveFormula(formulaName)
          if (formula === undefined) {
            return { status: 'error', message: `找不到方剂「${formulaName}」。请先在 zhongzhong_formula 里查证方名。` }
          }
          const mods = String(args.modifications ?? '')
            .split(/[、,，;；]/)
            .map((m) => m.trim())
            .filter((m) => m !== '')
          sheet = buildSheet(caseData, formula, { modifications: mods })
        }

        const dir = path.resolve(expandHome(args.dir ?? '') || path.join(homedir(), '中医病案'))
        if (/^\/(proc|sys|dev)(\/|$)/.test(dir)) {
          return { status: 'error', message: `拒绝写入系统目录：${dir}` }
        }

        const date = stamp().slice(0, 10)
        const who = safeName(caseData.patient?.name ?? '', '未留名')
        const filename = safeName(args.filename ?? '', `${date}-${who}.md`)
        const target = path.join(dir, filename.endsWith('.md') ? filename : `${filename}.md`)

        const body = recordBody(caseData, {
          pattern: args.pattern ?? '',
          advice: args.advice ?? '',
          sheet
        })
        const header = composeRecord(caseData, {
          pattern: args.pattern ?? '',
          advice: args.advice ?? '',
          sheet
        })

        try {
          await mkdir(dir, { recursive: true })
          let existed = false
          try {
            await stat(target)
            existed = true
          } catch {
            existed = false
          }

          const append = args.append !== false
          let content
          if (existed && append) {
            const previous = await readFile(target, 'utf8')
            const separator = previous.endsWith('\n') ? '' : '\n'
            content = `${previous}${separator}\n---\n\n## 就诊记录 · ${stamp()}\n\n${body}\n`
            await writeFile(target, content, 'utf8')
          } else {
            content = header
            await writeFile(target, content, 'utf8')
          }

          const bytes = Buffer.byteLength(content, 'utf8')
          return {
            status: 'ok',
            path: target,
            bytes,
            appended: existed && append,
            markdown: content,
            message:
              `${existed && append ? '已追加到' : '已写入'} ${target}（${(bytes / 1024).toFixed(1)} KB）。` +
              '该文件含个人健康信息，请提醒患者妥善保管、不要随意分享或上传。'
          }
        } catch (error) {
          return { status: 'error', message: `写入失败：${error instanceof Error ? error.message : String(error)}；目标路径 ${target}` }
        }
      }
    })
  )
}

/** 下一阶段。 */
function nextStageAfter(stage) {
  const index = STAGES.indexOf(stage)
  return index >= 0 && index < STAGES.length - 1 ? STAGES[index + 1] : ''
}

/** 方剂详情 Markdown。 */
function formulaMarkdown(formula) {
  const system = formula.doseSystem === 'qing' ? 'qing' : 'han'
  const lines = []
  lines.push(`## ${formula.name}${formula.alias === undefined ? '' : `（${formula.alias}）`}`)
  lines.push(`出处：${formula.source}　归类：${formula.six}`)
  if (formula.combined === true) {
    lines.push('类型：合方（两首方叠加，非仲景原方，也非张锡纯原方）')
  } else if (formula.school === 'zhongzhong') {
    lines.push(
      formula.bencao === true
        ? '类型：衷中参西录·单方（药物篇单味药）'
        : formula.kind === 'danfang'
          ? '类型：衷中参西录·单味方（医方篇）'
          : '类型：张锡纯自拟方（衷中参西录）'
    )
    if (formula.route === 'external') lines.push('用法：**外用/外治，不可内服**')
  }
  lines.push(system === 'qing' ? '### 组成（原方 → 清制折算：1两=30g）' : '### 组成（原方 → 1两=3g 折算）')
  lines.push(formula.composition.map((part) => `- ${doseText(part, system)}`).join('\n'))
  lines.push(formula.route === 'external' ? '### 用法（外用）' : '### 煎服法')
  lines.push(formula.decoction)
  lines.push('### 方证要点')
  lines.push(formula.pattern.map((p) => `- ${p}`).join('\n'))
  lines.push(formula.school === 'zhongzhong' ? '### 原书主治' : '### 原文')
  lines.push(formula.clauses.map((c) => `- ${c.ref}：${c.text}`).join('\n'))
  if (formula.school === 'zhongzhong' && typeof formula.explanation === 'string' && formula.explanation !== '') {
    lines.push('### 方论摘要')
    lines.push(clip(formula.explanation, 600))
  }
  if ((formula.safety ?? []).length > 0) {
    lines.push('### 注意事项')
    lines.push(formula.safety.map((s) => `- ⚠️ ${s}`).join('\n'))
  }
  const detail = patternDetail(formula.id)
  if (detail !== undefined) {
    lines.push('### 方证详解')
    if (detail.brief !== undefined) lines.push(`- 一句话方证：${stripEnd(detail.brief)}`)
    if (detail.function !== undefined) lines.push(`- 功用：${detail.function}`)
    if (detail.pattern !== undefined) lines.push(`- 主治：${clip(detail.pattern, 320)}`)
    if (detail.analysis !== undefined) lines.push(`- 用药分析：${clip(detail.analysis, 240)}`)
    if (detail.reading !== undefined) lines.push(`- 学习要点：${clip(detail.reading, 200)}`)
    if (Array.isArray(detail.indications) && detail.indications.length > 0) {
      lines.push(`- 适用疾病：${stripEnd(detail.indications[0])}`)
    }
    if (Array.isArray(detail.modifications) && detail.modifications.length > 0) {
      lines.push(`- 参考加减：${detail.modifications.slice(0, 6).map(stripEnd).join('；')}`)
    }
  }
  const zhang = zhangNote(formula.id)
  if (zhang !== undefined && zhang.modifications.length > 0) {
    lines.push('### 张锡纯加减（参考）')
    lines.push(zhang.modifications.map((m) => `- ${m}`).join('\n'))
    lines.push('> 张氏剂量偏重，仅取加减思路，不可照搬克数。')
  }
  const huang = huangNote(formula.id)
  if (huang !== undefined) {
    lines.push('### 黄煌经验（参考）')
    if (huang.constitution !== undefined) lines.push(`- 体质：${clip(huang.constitution, 200)}`)
    if (huang.diseases !== undefined) lines.push(`- 适用疾病：${clip(huang.diseases, 200)}`)
    if (huang.modifications !== undefined) lines.push(`- 加减：${huang.modifications}`)
    if (huang.cautions !== undefined) lines.push(`- 注意：${huang.cautions}`)
  }
  return lines.join('\n')
}

/** 截断过长文本。 */
function clip(text, max) {
  return text.length <= max ? text : `${text.slice(0, max)}…`
}

/** 去掉句末标点。 */
function stripEnd(text) {
  return String(text).replace(/[；;。\s]+$/, '')
}

/**
 * 候选卡片用的一句话方证：优先用《仲圣方证合一要诀》的方证句，
 * 没有则退回方证要点列表。
 */
function briefOf(formula) {
  if (typeof formula.brief === 'string' && formula.brief !== '') return clip(formula.brief, 48)
  const detail = patternDetail(formula.id)
  if (detail !== undefined && typeof detail.brief === 'string' && detail.brief !== '') {
    return clip(stripEnd(detail.brief), 48)
  }
  return formula.pattern.slice(0, 4).join('、')
}

/** consult 结果的模型可见文本。 */
function consultText(value) {
  const lines = []
  if (value.status === 'ok') {
    lines.push(`## 问诊 · ${stageLabel(value.stage)}（已完成）`)
    lines.push(value.summary)
    lines.push('')
    lines.push('### 当前病历（原样传给下一个工具）')
    lines.push(caseBlock(value.case))
    lines.push('')
    lines.push(value.message)
    const syncLine = titleSyncLine(value.title_sync)
    if (syncLine !== '') {
      lines.push('')
      lines.push(`> ${syncLine}`)
    }
  } else if (value.status === 'manual') {
    lines.push(`## 问诊 · ${stageLabel(value.stage)}（需要代问）`)
    lines.push(value.message)
    lines.push('')
    lines.push(questionsText(value.questions ?? []))
  } else {
    lines.push(value.message ?? value.status)
  }
  return lines.join('\n')
}

/** differentiate 结果的模型可见文本。 */
function differentiateText(value) {
  const lines = []
  if (value.status === 'decided') {
    lines.push(`## 辨证结果：${value.chosen.name}（${value.chosen.six}）`)
    lines.push(value.summary)
    lines.push('')
    lines.push('### 候选排序')
    lines.push(
      (value.ranking ?? [])
        .map((r, i) => `${i + 1}. ${r.name}（${r.six}）匹配度 ${Math.round(r.score * 100)}%｜已见：${r.matched.join('、')}`)
        .join('\n')
    )
    lines.push('')
    lines.push(`### 首选\n- 方剂：${value.chosen.name}（${value.chosen.id}）\n- 匹配度：${value.chosen.coverage}\n- 方证：${value.chosen.pattern.join('、')}`)
    if (value.pair !== undefined) {
      lines.push('')
      lines.push(`### 接近双选（分差 ${value.pair.gap}%）`)
      lines.push(`- ${value.pair.a.name}：${value.pair.a.score}%`)
      lines.push(`- ${value.pair.b.name}：${value.pair.b.score}%`)
      lines.push('- 两首方分差 <4%，开方时会分别核对两方；都过门槛则分别出方，由患者二选一；不要同时服用。')
    }
    const detail = patternDetail(value.chosen.id)
    if (detail !== undefined) {
      lines.push('')
      lines.push('### 方证详解')
      if (detail.brief !== undefined) lines.push(`- **一句话方证**：${stripEnd(detail.brief)}`)
      if (detail.function !== undefined) lines.push(`- **功用**：${detail.function}`)
      if (detail.pattern !== undefined) lines.push(`- **主治**：${clip(detail.pattern, 260)}`)
      if (Array.isArray(detail.modifications) && detail.modifications.length > 0) {
        lines.push(`- **参考加减**：${detail.modifications.slice(0, 3).map(stripEnd).join('；')}`)
      }
    }
  } else if (value.status === 'need_more') {
    lines.push('## 尚不能定方：需要继续提问')
    lines.push(value.message)
    if ((value.questions ?? []).length > 0) {
      lines.push('')
      lines.push('### 待确认要点')
      lines.push((value.questions ?? []).map((q) => `- ${q.label}`).join('\n'))
    }
  } else if (value.status === 'manual') {
    lines.push('## 需要代为提问')
    lines.push(value.message)
    lines.push('')
    lines.push(questionsText(value.questions ?? []))
  } else {
    lines.push(value.message ?? value.status)
  }
  if (value.status !== 'insufficient' && value.status !== 'error') {
    lines.push('')
    lines.push('### 病历')
    lines.push(caseBlock(value.case ?? {}))
  }
  return lines.join('\n')
}

/** export 结果的模型可见文本。 */
function exportText(value) {
  if (value.status !== 'ok') return `## 导出失败\n\n${value.message ?? '未知错误'}`
  return [
    '## 病案已导出',
    '',
    `- 文件：\`${value.path}\``,
    `- 大小：${(value.bytes / 1024).toFixed(1)} KB${value.appended ? '（追加到已有档案）' : ''}`,
    '- ⚠️ 含个人健康信息，请提示患者妥善保管',
    '',
    '### 预览（前 400 字）',
    '',
    value.markdown.length > 400 ? `${value.markdown.slice(0, 400)}…` : value.markdown
  ].join('\n')
}

/** prescribe 结果的模型可见文本。 */
function prescribeText(value) {
  switch (value.status) {
    case 'prescribed':
      return value.markdown
    case 'choose':
      return value.markdown
    case 'emergency':
      return `## ⚠️ 需要立即就医\n\n${(value.reasons ?? []).join('；')}\n\n${value.message}`
    case 'blocked':
      return [
        '## 不能开方：文献核查未通过',
        value.message,
        '',
        '### 备选方剂',
        (value.alternatives ?? []).map((a) => `- ${a.name}（${a.six}）匹配度 ${Math.round(a.score * 100)}%：${a.matched.join('、')}`).join('\n')
      ].join('\n')
    case 'evidence_only':
      return `${value.markdown}\n\n---\n${value.message}`
    case 'change':
      return [
        '## 患者要求换方',
        (value.alternatives ?? []).map((a) => `- ${a.name}（${a.six}）匹配度 ${Math.round(a.score * 100)}%：${a.matched.join('、')}`).join('\n'),
        '',
        '请调用 zhongzhong_differentiate 重新确认。'
      ].join('\n')
    case 'manual':
      return `## 需要患者确认\n\n${value.message}\n\n${questionsText(value.questions ?? [])}`
    default:
      return value.message ?? value.status
  }
}
