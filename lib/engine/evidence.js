// 文献核查引擎
//
// 两层证据：
//   1. 原文：内置《伤寒论》《金匮要略》条文，以及《医学衷中参西录》原书主治；
//      检查原文中是否出现患者的阳性见症。这是「开方」的硬门槛。
//   2. 现代文献：交给 dsh-tcm-lit 的 tcm_lit_search 查中文期刊题录；
//      不再直连 PubMed。插件未装或网络不可用时如实标注，绝不伪造文献。
//
// 判定：只有 classic 命中且方证覆盖度达标才返回 supported；否则 unsupported，
// 调用方必须换方（或继续追问），不得开方。

import { labelOf, item } from '../data/symptoms.js'
import { rankFormulas, scoreFormula, pct, TUNING, highMatchException } from './match.js'
import { formulaById, isVerified } from '../data/index.js'
import { literatureEvidence } from './literature.js'

/** 经文中的古代表述 → 症状 id。用于判断「条文里是否写到患者的症状」。 */
const CLASSIC_ALIASES = {
  fever: ['发热', '身热', '翕翕发热', '潮热'],
  aversion_cold: ['恶寒', '啬啬恶寒', '振寒'],
  aversion_wind: ['恶风', '淅淅恶风'],
  no_sweat: ['无汗', '不汗出', '汗不出'],
  spontaneous_sweat: ['汗出', '自汗', '汗自出'],
  profuse_sweat: ['大汗出', '大汗'],
  headache: ['头痛', '头重'],
  dizziness: ['目眩', '头眩', '起则头眩', '冒眩', '眩'],
  stiff_neck: ['项背强几几', '项强', '项背强'],
  body_ache: ['身疼', '身疼痛', '身体疼', '一身尽重'],
  joint_pain: ['骨节疼痛', '支节烦疼', '历节疼'],
  heavy_body: ['身重', '一身尽重'],
  edema: ['浮肿', '肿', '面目肿大'],
  chest_oppression: ['胸满', '胸中窒', '胸胁满', '胸胁苦满'],
  chest_pain: ['心痛彻背', '胸痹', '胸痛'],
  palpitation: ['心悸', '心动悸', '心下悸', '惊悸'],
  hypochondriac: ['胸胁苦满', '胁下痞硬', '胁痛', '胁下满'],
  epigastric_distention: ['心下痞', '心下满', '心下逆满', '心下支结', '痞硬'],
  epigastric_pain: ['心下急', '心下痛', '心中痛'],
  abdominal_pain: ['腹中痛', '腹痛', '腹中急痛', '腹中㽲痛'],
  lower_abdomen: ['少腹急结', '少腹满', '少腹肿痞', '少腹里急'],
  abdominal_fullness: ['腹满', '腹胀满', '腹大满'],
  rigidity: ['拒按', '腹硬', '按之即痛'],
  mass_abdomen: ['癥', '痞块'],
  bitter_mouth: ['口苦'],
  dry_mouth: ['咽干', '口干', '唇口干燥', '口燥'],
  thirst: ['口渴', '欲饮水', '消渴', '大烦渴'],
  thirst_cold: ['大渴', '渴欲饮水', '欲饮水数升'],
  thirst_no_drink: ['但欲漱水不欲咽'],
  nausea: ['喜呕', '欲呕', '呕而', '泛恶'],
  vomiting: ['呕吐', '呕', '吐'],
  dry_heave: ['干呕'],
  belching: ['噫气', '噫'],
  poor_appetite: ['不欲饮食', '嘿嘿不欲饮食', '默默不欲饮食', '不能食', '食不下'],
  acid_reflux: ['吞酸', '嘈杂'],
  constipation: ['不大便', '大便不通', '大便难'],
  hard_stool: ['大便硬', '大便则硬', '燥屎', '大便必硬'],
  diarrhea: ['下利', '自利', '泄利', '利遂不止', '下利清谷'],
  loose_stool: ['便溏', '下利'],
  mucus_stool: ['下重', '脓血', '热利'],
  dark_urine: ['小便黄', '尿如皂角汁'],
  clear_urine: ['小便清', '小便利'],
  frequent_urine: ['小便数'],
  difficult_urine: ['小便不利', '小便难'],
  insomnia: ['不得眠', '不得卧', '不能卧'],
  dreamy_sleep: ['多梦'],
  irritability: ['心烦', '虚烦', '郁郁微烦', '懊憹'],
  restlessness: ['烦躁', '躁', '烦惊'],
  depression: ['悲伤欲哭', '脏躁'],
  anxiety: ['烦惊', '惊'],
  forgetfulness: ['健忘'],
  lethargy: ['但欲寐', '嗜卧'],
  delirium: ['谵语', '神昏'],
  cough: ['咳', '咳嗽'],
  wheezing: ['喘', '上气'],
  white_sputum: ['痰', '涎沫'],
  yellow_sputum: ['黄痰', '痰黄'],
  sore_throat: ['咽痛', '咽喉不利'],
  nasal: ['鼻鸣', '鼻塞'],
  throat_globus: ['咽中如有炙脔', '咽中'],
  fatigue: ['少气', '虚羸', '乏力'],
  weight_loss: ['虚羸', '消瘦', '羸瘦'],
  jaundice: ['发黄', '身黄', '谷疸'],
  bleeding: ['下血', '衄', '漏下', '便血'],
  menstrual: ['经水', '月经', '经断'],
  dysmenorrhea: ['经行腹痛', '少腹寒'],
  leukorrhea: ['带下'],
  numbness: ['麻木', '不仁'],
  spasm: ['挛急', '脚挛急', '筋惕肉瞤'],
  hot_palms: ['手掌烦热', '手足心热'],
  cold_limbs: ['手足厥冷', '四逆', '手足厥寒', '手足逆冷', '厥逆'],
  chill_body: ['畏寒', '恶寒', '身冷', '肤冷'],
  tidal_fever: ['潮热', '蒸蒸发热', '日晡所发热'],
  alternating: ['往来寒热', '寒热往来'],
  tongue_pale: ['舌淡'],
  tongue_red: ['舌红'],
  coat_yellow: ['苔黄'],
  coat_none: ['少苔', '无苔'],
  pulse_float: ['脉浮'],
  pulse_deep: ['脉沉'],
  pulse_tight: ['脉浮紧', '脉紧'],
  pulse_weak: ['脉微', '脉微弱', '脉微欲绝'],
  pulse_knotted: ['脉结代', '结代'],
  pulse_surging: ['脉洪大', '洪大'],
  pulse_thin: ['脉细'],
  pulse_wiry: ['脉弦'],
  pulse_slippery: ['脉滑'],
  pulse_rapid: ['脉数', '脉促'],
  fever_high: ['壮热'],
  // 《金匮要略》杂病条文的常用表述
  qi_rush: ['气从少腹上至心', '气从少腹上冲', '奔豚', '气上冲胸', '气上撞心'],
  lower_abdomen_throb: ['脐下悸', '脐下跳动'],
  borborygmus: ['肠鸣', '腹中雷鸣', '水走肠间', '沥沥有声'],
  saliva: ['吐涎沫', '涎唾', '多涎', '涎沫', '吐清水'],
  hiccup: ['哕逆', '哕'],
  short_breath: ['短气', '气短'],
  orthopnea: ['喘不得卧', '不得卧', '倚息', '不得平卧'],
  muscle_twitch: ['聂聂动', '筋惕肉瞤', '身瞤动', '肉瞤', '四肢聂聂动'],
  spermatorrhea: ['失精', '梦交', '精自出', '遗精']
}

/** 某症状在经文里的候选表述。 */
function classicalForms(id) {
  const forms = new Set(CLASSIC_ALIASES[id] ?? [])
  const label = labelOf(id)
  if (label !== id) forms.add(label.replace(/（[^）]*）/g, ''))
  // 问诊词表里的同义词也要能命中原文（衷中参西录用词与经方不同）
  for (const alias of item(id)?.aliases ?? []) forms.add(alias)
  return [...forms].filter((f) => f !== '')
}

/**
 * 在方剂的条文中查找与患者阳性见症相关的内容。
 * @param {object} formula
 * @param {object} caseData
 * @param {string[]} positiveIds
 */
export function classicEvidence(formula, caseData, positiveIds) {
  const hits = []
  for (const clause of formula.clauses) {
    const matched = []
    for (const id of positiveIds) {
      const forms = classicalForms(id)
      if (forms.some((form) => clause.text.includes(form))) {
        matched.push({ id, label: labelOf(id) })
      }
    }
    if (matched.length > 0) {
      hits.push({ ref: clause.ref, text: clause.text, matched })
    }
  }
  // 衷中参西录方：原书主治多用古语，患者点选的是规范化症状词。
  // 文字没有逐字命中时，仍以「原书主治」为据，但把取到的方证要点列出来，
  // 并明确标注「据原书主治归纳」，不冒充原文逐字相符。
  if (hits.length === 0 && formula.school === 'zhongzhong') {
    const matched = (formula.indicators ?? [])
      .filter((ind) => ind.w >= 2 && positiveIds.includes(ind.id))
      .map((ind) => ({ id: ind.id, label: labelOf(ind.id) }))
    if (matched.length > 0) {
      hits.push({
        ref: `${formula.source}·${formula.name}主治`,
        text: String(formula.clauses?.[0]?.text ?? formula.brief ?? '').trim(),
        matched,
        normalized: true
      })
    }
  }
  return hits
}

/**
 * 综合核查。
 * @param {object} caseData
 * @param {object} formula
 * @param {{signal?:AbortSignal, online?:boolean, literatureSearch?:(query:string)=>Promise<any>, timeoutMs?:number}} [options]
 */
export async function verify(caseData, formula, options = {}) {
  if (!isVerified(formula)) {
    return {
      formula: { id: formula.id, name: formula.name, six: formula.six },
      verdict: 'unverified',
      score: 0,
      coverage: '—',
      matchedCount: 0,
      classic: [],
      classicHitCount: 0,
      modern: { status: 'skipped', hits: [], note: '名录条目暂不检索现代文献' },
      highMatch: {
        eligible: false,
        threshold: TUNING.highMatchThreshold,
        score: 0,
        top: null,
        reason: '名录条目没有方证指标，不适用高匹配度例外。'
      },
      missing: [],
      conflicts: [],
      reason: `${formula.name} 目前只收录了篇目与组成（名录条目），原文条文尚未录入，无法完成文献核查，因此不能开方。请核对《金匮要略》原书或换用已核方剂。`,
      alternatives: alternativesFor(caseData, formula)
    }
  }
  const positiveIds = [...caseData.symptoms, ...caseData.tongue, ...caseData.pulse]
  // 评估指定方剂本身，不依赖它是否进入 Top-N
  const entry = scoreFormula(caseData, formula)
  const score = entry?.score ?? 0
  const matched = entry?.matched ?? []
  const classic = classicEvidence(formula, caseData, positiveIds)
  const modern =
    options.online === false
      ? { status: 'skipped', hits: [], note: '已关闭联网检索' }
      : await literatureEvidence(formula, caseData, {
          search: options.literatureSearch,
          signal: options.signal,
          timeoutMs: options.timeoutMs
        })
  const highMatch = highMatchException(caseData, formula)

  const classicHitCount = classic.reduce((sum, hit) => sum + hit.matched.length, 0)
  // 依据分三类：仲景原文 / 手册方证（后世方）/ 后世注家方证。
  // 按「实际命中的那条条文」判定，而不是看方剂有没有混录原文。
  const hitRef = classic[0]?.ref ?? formula.clauses[0]?.ref ?? ''
  const basis =
    formula.school === 'zhongzhong'
      ? formula.bencao === true
        ? '衷中参西录·单方'
        : '衷中参西录原文'
      : formula.school === 'shifang'
        ? '手册方证（后世方/经验方）'
        : /伤寒论|金匮要略/.test(hitRef)
          ? '仲景原文'
          : '后世注家方证'
  let verdict
  if (classic.length > 0 && score >= TUNING.minScore) verdict = 'supported'
  else if (classic.length > 0) verdict = 'weak'
  else if (modern.status === 'ok' && modern.hits.length > 0) verdict = 'modern-only'
  else verdict = 'unsupported'

  const missing = (entry?.missing ?? []).filter((m) => m.w >= 2).map((m) => labelOf(m.id))
  const conflicts = (entry?.contraMatched ?? []).map((c) => labelOf(c.id))

  return {
    formula: { id: formula.id, name: formula.name, six: formula.six, school: formula.school ?? 'jingfang' },
    basis,
    verdict,
    score: Math.round(score * 100) / 100,
    coverage: pct(score),
    matchedCount: matched.length,
    classic,
    classicHitCount,
    modern,
    highMatch,
    missing,
    conflicts,
    reason: verdictReason(verdict, formula, classicHitCount, score, modern, basis, highMatch),
    alternatives: alternativesFor(caseData, formula)
  }
}

/** 依据来源的中文名。 */
export function basisLabelOf(formula, ref) {
  if (formula.school === 'zhongzhong') return formula.bencao === true ? '衷中参西录·单方' : '衷中参西录原文'
  if (formula.school === 'shifang') return '手册方证'
  return /伤寒论|金匮要略/.test(ref ?? '') ? '仲景原文' : '后世注家方证'
}

function verdictReason(verdict, formula, classicHitCount, score, modern, basisLabel, highMatch) {
  const modernNote =
    modern.status === 'ok'
      ? modern.hits.length > 0
        ? `中文文献另有 ${modern.total ?? modern.hits.length} 篇相关报道（仅作旁证）`
        : '中文文献未见相关报道'
      : modern.status === 'unavailable'
        ? '中文文献检索未启用（dsh-tcm-lit 未安装）'
        : modern.status === 'offline'
          ? '中文文献检索失败'
          : modern.status === 'skipped'
            ? '本次未检索现代文献'
            : '现代文献检索不可用'
  const exceptionNote =
    highMatch?.eligible === true
      ? `本方为当前排序第一、匹配度 ${pct(highMatch.score)}（>${pct(highMatch.threshold)}），可按高匹配度例外开方（仍须患者确认）`
      : ''
  if (verdict === 'supported') {
    const classicName = basisLabel === '衷中参西录原文' || basisLabel === '衷中参西录·单方' ? '原书主治' : '条文'
    return `依据（${basisLabel}）${classicName}命中 ${classicHitCount} 处与本案见症相符的表述，方证吻合度 ${pct(score)}；${modernNote}。`
  }
  if (verdict === 'weak') {
    return `条文有相关内容（${basisLabel}），但方证吻合度仅 ${pct(score)}，证据强度不足；${modernNote}。`
  }
  if (verdict === 'modern-only') {
    return `经典条文中未见与本次见症直接对应的内容，仅中文文献提及；${modernNote}。${exceptionNote === '' ? '按经方规范不宜据此开方。' : `${exceptionNote}。`}`
  }
  return `条文、注家方证与现代文献均未见支持本方的相关内容；${modernNote}。${exceptionNote === '' ? '应按流程换方或继续辨证。' : `${exceptionNote}。`}`
}

/** 无文献支撑时的替代候选。 */
export function alternativesFor(caseData, formula) {
  const ranking = rankFormulas(caseData, { exclude: [formula.id], shortlist: 4 })
  return ranking.map((entry) => ({
    id: entry.formula.id,
    name: entry.formula.name,
    six: entry.formula.six,
    score: Math.round(entry.score * 100) / 100,
    matched: entry.matched.slice(0, 4).map((m) => labelOf(m.id))
  }))
}

/**
 * 给模型看的证据摘要文本。
 * @param {Awaited<ReturnType<typeof verify>>} report
 */
export function evidenceText(report) {
  const lines = []
  lines.push(`## 文献核查：${report.formula.name}`)
  lines.push(`结论：**${verdictLabel(report.verdict)}**（方证吻合度 ${report.coverage}）`)
  lines.push(`依据类型：${report.basis ?? '仲景原文'}`)
  lines.push(report.reason)
  if (report.classic.length > 0) {
    lines.push('### 文献依据')
    for (const hit of report.classic) {
      lines.push(`- ${hit.ref}：${hit.text}`)
      lines.push(`  - 与本案相关：${hit.matched.map((m) => m.label).join('、')}${hit.normalized === true ? '（据原书主治归纳）' : ''}`)
    }
  } else {
    lines.push('### 文献依据')
    lines.push('- 未检索到与本案见症直接对应的条文')
  }
  lines.push('### 现代文献（中文期刊 · dsh-tcm-lit）')
  if (report.modern.status === 'ok' && report.modern.hits.length > 0) {
    for (const hit of report.modern.hits) {
      const meta = [hit.journal, hit.year].filter((part) => part !== '' && part !== undefined && part !== null).join(', ')
      lines.push(`- ${hit.title}${meta === '' ? '' : `（${meta}）`}${hit.doi === '' ? '' : ` DOI ${hit.doi}`}`)
    }
    if (typeof report.modern.query === 'string' && report.modern.query !== '') {
      const source = report.modern.source === 'crossref' ? 'Crossref' : report.modern.source === 'openalex' ? 'OpenAlex 中文库' : 'dsh-tcm-lit'
      lines.push(`- 检索式：${report.modern.query}（数据源：${source}）`)
    }
  } else {
    lines.push(`- ${report.modern.note}`)
  }
  if (report.verdict !== 'supported') {
    lines.push('### 开方门槛')
    if (report.highMatch?.eligible === true) {
      lines.push(`- ⚠️ 高匹配度例外：${report.highMatch.reason}开方时仍须患者确认。`)
    } else if (typeof report.highMatch?.reason === 'string') {
      lines.push(`- 未达高匹配度例外：${report.highMatch.reason}`)
    }
  }
  if (report.missing.length > 0) lines.push(`### 尚缺的方证要点\n- ${report.missing.join('、')}`)
  if (report.conflicts.length > 0) lines.push(`### 相反见症\n- ${report.conflicts.join('、')}（需慎重）`)
  if (report.verdict !== 'supported' && report.alternatives.length > 0) {
    lines.push('### 备选方剂')
    for (const alt of report.alternatives) {
      lines.push(`- ${alt.name}（${alt.six}，匹配度 ${alt.score}）：${alt.matched.join('、')}`)
    }
  }
  return lines.join('\n')
}

/** 判定文案。 */
export function verdictLabel(verdict) {
  switch (verdict) {
    case 'supported':
      return '有文献支撑'
    case 'weak':
      return '证据不足'
    case 'modern-only':
      return '仅有现代研究'
    case 'unverified':
      return '名录条目·待核原文'
    default:
      return '无文献支撑'
  }
}

/** 方剂详情的文本卡片。 */
export function formulaText(formula, doseTextOf) {
  const lines = []
  lines.push(`## ${formula.name}${formula.alias === undefined ? '' : `（${formula.alias}）`}`)
  lines.push(`出处：${formula.source}　六经：${formula.six}`)
  lines.push('### 组成')
  lines.push(formula.composition.map((part) => `- ${doseTextOf(part)}`).join('\n'))
  lines.push('### 煎服法')
  lines.push(formula.decoction)
  lines.push('### 方证要点')
  lines.push(formula.pattern.map((p) => `- ${p}`).join('\n'))
  lines.push('### 原文')
  for (const clause of formula.clauses) lines.push(`- ${clause.ref}：${clause.text}`)
  if ((formula.safety ?? []).length > 0) {
    lines.push('### 注意事项')
    lines.push(formula.safety.map((s) => `- ${s}`).join('\n'))
  }
  return lines.join('\n')
}

/** 供其它模块使用的方名解析。 */
export { formulaById }
