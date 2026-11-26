// 《医学衷中参西录》数据与统一引擎测试
import { test } from 'node:test'
import assert from 'node:assert/strict'

import { FORMULAS, formulaById, resolveFormula, herbWarnings } from '../lib/data/index.js'
import { ALL_ITEMS, resolveId, labelOf } from '../lib/data/symptoms.js'
import { canonicalHerb } from '../lib/data/herbs.js'
import { normalizeCase, redFlags, caseSummary } from '../lib/engine/case.js'
import { rankFormulas, confidence, scoreFormula } from '../lib/engine/match.js'
import { verify, classicEvidence } from '../lib/engine/evidence.js'
import { buildSheet, compositionLines, DOSE_BASIS } from '../lib/engine/prescribe.js'
import { doseOf, doseText } from '../lib/engine/dose.js'
import { FAMILIES, familyInPlay, familyOf } from '../lib/data/families.js'
import { sourceQuestion, concernQuestion } from '../lib/engine/discuss.js'
import { combineCheck } from '../lib/engine/combine.js'
import { questionsFor, applyAnswers, STAGES } from '../lib/questions.js'
import { emptyCase } from '../lib/engine/case.js'
import { apply, name, inject } from '../lib/index.js'

const zzAll = FORMULAS.filter((f) => f.school === 'zhongzhong')
const zzFormulas = zzAll.filter((f) => f.bencao !== true)
const zzBencao = FORMULAS.filter((f) => f.bencao === true)
const jingfang = FORMULAS.filter((f) => f.school !== 'zhongzhong')

/** 造一个假 ctx（与 flow.test.mjs 同形）。 */
function makeHost(script = []) {
  const registered = new Map()
  const asked = []
  const skills = []
  const ctx = {
    tools: { register: (definition) => registered.set(definition.name, definition) },
    systemPrompt: { section: (section) => ctx.sections.push(section) },
    sections: [],
    skills: { register: (definition) => skills.push(definition) },
    effect: (run) => run(),
    userQuestions: {
      async ask(request) {
        asked.push(request)
        const answer = script.shift()
        if (answer === undefined) throw Object.assign(new Error('cancelled'), { code: 'ASK_CANCELLED' })
        return { answers: answer }
      }
    },
    get(service) {
      return this[service]
    }
  }
  return { ctx, registered, asked, skills }
}

async function run(host, toolName, args) {
  const definition = host.registered.get(toolName)
  assert.ok(definition !== undefined, `工具未注册：${toolName}`)
  const value = await definition.execute(args, { callId: 'c1', signal: new AbortController().signal, arguments: args })
  const text = definition.output.render(args, value).map((block) => block.text).join('\n')
  return { value, text }
}

test('数据规模：经方 228 首原样保留，追加张锡纯方与单方', () => {
  assert.equal(jingfang.length, 228, `经方 ${jingfang.length} 首`)
  assert.equal(zzFormulas.length, 174, `张锡纯方 ${zzFormulas.length} 首（含 ${zzFormulas.filter((f) => f.kind === 'danfang').length} 首单味方）`)
  assert.equal(zzAll.length, 261, `张锡纯方 + 单方 ${zzAll.length} 首`)
  assert.equal(zzBencao.length, 87, `药物篇单方 ${zzBencao.length} 味`)
  assert.equal(FORMULAS.length, 489)
  assert.ok(zzAll.every((f) => f.doseSystem === 'qing'))
  assert.ok(zzAll.every((f) => f.source.includes('医学衷中参西录')))
  assert.ok(zzBencao.every((f) => f.kind === 'danfang' && f.bencao === true))
})

test('张锡纯方结构：组成、主治、指标、清制剂量齐全', () => {
  const ids = new Set(ALL_ITEMS.map((i) => i.id))
  for (const f of zzAll) {
    assert.ok(f.id && f.name && f.source, `${f.name} 缺基础字段`)
    assert.ok(f.composition.length >= 1, `${f.name} 缺组成`)
    assert.ok(f.pattern.length >= 1, `${f.name} 缺方证要点`)
    assert.ok(f.clauses.length >= 1, `${f.name} 缺原书主治`)
    assert.ok(f.indicators.length >= 1, `${f.name} 缺指标`)
    assert.ok(f.indicators.some((ind) => ind.w >= 3), `${f.name} 没有主症 w=3`)
    for (const ind of f.indicators) assert.ok(ids.has(ind.id), `${f.name} 未知指标 ${ind.id}`)
    for (const part of f.composition) {
      assert.ok(part.herb, `${f.name} 药味缺名`)
      // 药名必须是标准名，不能把「生杭芍」这类炮制前缀混进 herb
      assert.equal(canonicalHerb(part.herb)?.herb ?? part.herb, part.herb, `${f.name} 药名未归一：${part.herb}`)
      assert.ok(part.prep === undefined || typeof part.prep === 'string')
    }
    assert.equal(f.doseSystem, 'qing')
    assert.equal(f.verified, true)
  }
})

test('清制折算：1 两 = 30 克、1 钱 = 3 克、1 分 = 0.3 克', () => {
  assert.equal(doseOf({ dose: [{ unit: '两', value: 1 }] }, 'qing').modern, '≈30g')
  assert.equal(doseOf({ dose: [{ unit: '钱', value: 1 }] }, 'qing').modern, '≈3g')
  assert.equal(doseOf({ dose: [{ unit: '分', value: 1 }] }, 'qing').modern, '≈0.3g')
  assert.equal(doseOf({ dose: [{ unit: '钱', value: 6 }] }, 'qing').modern, '≈18g')
  assert.equal(doseOf({ dose: [{ unit: '两', value: 1 }, { unit: '钱', value: 5 }] }, 'qing').modern, '≈45g')
  // 汉制不受影响
  assert.equal(doseOf({ liang: 3 }, 'han').modern, '≈9g')
  assert.equal(doseText({ herb: '大枣', count: 12, unit: '枚' }, 'qing'), '大枣 12枚')
})

test('煎服法不会被「加减/方论」句子污染', () => {
  const shengxian = resolveFormula('升陷汤')
  assert.match(shengxian.decoction, /水煎服|水煎/)
  assert.doesNotMatch(shengxian.decoction, /酌加人参/)

  const zhengan = resolveFormula('镇肝熄风汤')
  assert.match(zhengan.decoction, /水煎服|水煎/)
  assert.doesNotMatch(zhengan.decoction, /煎厥|气血上攻/)

  const suyu = resolveFormula('薯蓣粥')
  assert.match(suyu.decoction, /每服|上药/)
})

test('处方笺：张锡纯方标清制，经方仍标汉制', () => {
  const c = normalizeCase({ patient: { name: '某', age: 40, sex: '男' }, chief: '气短', symptoms: ['胸中大气下陷（气短不足以息）'] })
  const shengxian = buildSheet(c, resolveFormula('升陷汤'))
  assert.equal(shengxian.doseBasis, 'qing')
  assert.match(shengxian.markdown, /张氏原量/)
  assert.match(shengxian.markdown, /1 两 = 30 克/)
  assert.match(shengxian.markdown, /黄芪 \| 6钱 \| 18g/)
  assert.doesNotMatch(shengxian.markdown, /1 两 = 3 克/)

  const guizhi = buildSheet(c, resolveFormula('桂枝汤'))
  assert.equal(guizhi.doseBasis, 'han')
  assert.match(guizhi.markdown, /汉制原量/)
  assert.match(guizhi.markdown, /1 两 = 3 克/)
})

test('单方：石膏单味有主治、有证据、处方笺标「单方」', async () => {
  const f = resolveFormula('石膏（单味）')
  assert.ok(f !== undefined)
  assert.equal(f.kind, 'danfang')
  assert.equal(f.bencao, true)
  assert.match(f.brief, /实热|壮热|烦渴/)

  const c = normalizeCase({ symptoms: ['发热', '口渴喜冷饮', '大汗出'], pulse: ['洪大'] })
  const report = await verify(c, f, { online: false })
  assert.equal(report.verdict, 'supported', report.reason)
  assert.equal(report.basis, '衷中参西录·单方')

  const sheet = buildSheet(c, f)
  assert.match(sheet.markdown, /单方（单味药）/)
  assert.match(sheet.markdown, /随证酌用/)
  assert.match(sheet.markdown, /不能替代面诊/)
})

test('外用方：姜胶膏标注外用，不可内服', () => {
  const f = resolveFormula('姜胶膏')
  assert.equal(f.route, 'external')
  const c = normalizeCase({ chief: '腿疼', symptoms: ['关节疼痛', '肢体麻木'] })
  const sheet = buildSheet(c, f)
  assert.match(sheet.title, /外用方/)
  assert.match(sheet.markdown, /用法（外用）/)
  assert.match(sheet.markdown, /不可内服/)
  assert.match(sheet.markdown, /不能替代面诊/)
})

test('升陷汤证：气短不足以息，统一引擎能定方并核查', async () => {
  const c = normalizeCase({
    patient: { name: '某', age: 52, sex: '男' },
    chief: '气短、吸气费劲',
    symptoms: ['胸中大气下陷（气短不足以息）', '努力呼吸/呼吸费力', '短气（气不够用）', '疲乏无力'],
    tongue: ['舌淡白'],
    pulse: ['沉迟微弱']
  })
  const ranking = rankFormulas(c)
  assert.equal(ranking[0].formula.name, '升陷汤', `实际 ${ranking[0].formula.name}`)
  const report = await verify(c, ranking[0].formula, { online: false })
  assert.equal(report.verdict, 'supported', report.reason)
  assert.equal(report.basis, '衷中参西录原文')
  assert.ok(report.classic.length >= 1)
})

test('镇肝熄风汤证：脑充血/眩晕/脉弦长有力', () => {
  const c = normalizeCase({
    chief: '头晕胀痛',
    symptoms: ['脑充血/头目胀痛', '头晕目眩', '头痛', '耳鸣', '半身不遂', '口眼歪斜'],
    tongue: ['舌红'],
    pulse: ['弦长有力']
  })
  const ranking = rankFormulas(c)
  assert.equal(ranking[0].formula.name, '镇肝熄风汤', `实际 ${ranking[0].formula.name}`)
  assert.equal(confidence(ranking).confident, true, confidence(ranking).reason)
})

test('玉液汤/滋膵饮：消渴多饮多尿，两者都在前列', () => {
  const c = normalizeCase({
    chief: '口渴多尿',
    symptoms: ['大渴多饮', '多尿', '尿甜', '疲乏无力'],
    tongue: ['舌红少津'],
    pulse: ['虚数']
  })
  const ranking = rankFormulas(c)
  const names = ranking.map((e) => e.formula.name)
  assert.ok(names.includes('玉液汤'), names.join('、'))
  assert.ok(names.includes('滋膵饮'), names.join('、'))
  assert.ok(['玉液汤', '滋膵饮'].includes(ranking[0].formula.name))
})

test('固冲汤/安冲汤：血崩归固冲，经量多归安冲，同族会触发鉴别', () => {
  const beng = normalizeCase({ chief: '血崩', symptoms: ['崩漏', '疲乏无力'], tongue: ['舌淡白'], pulse: ['微/弱'] })
  const r1 = rankFormulas(beng)
  assert.equal(r1[0].formula.name, '固冲汤', `实际 ${r1[0].formula.name}`)

  const duo = normalizeCase({ chief: '经量多', symptoms: ['经量过多', '疲乏无力'], tongue: ['舌淡白'], pulse: ['虚'] })
  const r2 = rankFormulas(duo)
  assert.equal(r2[0].formula.name, '安冲汤', `实际 ${r2[0].formula.name}`)

  // 既有崩漏又有量多时，两首都在前五，触发冲脉方族鉴别
  const both = normalizeCase({ symptoms: ['崩漏', '经量过多', '疲乏无力'], tongue: ['舌淡白'], pulse: ['微/弱'] })
  const r3 = rankFormulas(both)
  assert.ok(familyInPlay(r3) !== undefined, '没有触发方族鉴别')
  assert.equal(familyInPlay(r3).family.id, 'zz_chongmai')
})

test('汉制与清制不能直接合方', () => {
  const check = combineCheck(resolveFormula('桂枝汤'), resolveFormula('升陷汤'))
  assert.equal(check.level, 'block')
  assert.ok(check.reasons.some((r) => /剂量体系不同/.test(r)), check.reasons.join('；'))
})

test('安胎方需要「妊娠」事实前提，不是性别限制', () => {
  const noPregnancy = rankFormulas(normalizeCase({ symptoms: ['滑胎'] }))
  assert.ok(!noPregnancy.some((entry) => entry.formula.name === '寿胎丸'), '非妊娠时安胎方不应进候选')

  const pregnancy = rankFormulas(normalizeCase({ symptoms: ['滑胎'], context: ['pregnancy'] }))
  assert.ok(pregnancy.some((entry) => entry.formula.name === '寿胎丸'), '妊娠时寿胎丸应可进候选')
})

test('妊娠期出血/腹痛/发热直接转产科急诊', () => {
  const flags = redFlags(normalizeCase({ context: ['pregnancy'], symptoms: ['崩漏', '腹痛'] }))
  assert.equal(flags.level, 'emergency')
  assert.ok(flags.reasons.some((r) => /妊娠/.test(r)))
  const child = redFlags(normalizeCase({ patient: { age: 2 }, symptoms: ['发热'] }))
  assert.equal(child.level, 'emergency')
})

test('张锡纯方族：升陷汤类、淋浊类已登记', () => {
  const ids = new Set(FAMILIES.map((f) => f.id))
  assert.ok(ids.has('zz_shengxian'))
  assert.ok(ids.has('zz_linzhuo'))
  assert.equal(familyOf(resolveFormula('升陷汤').id).id, 'zz_shengxian')
  assert.equal(familyOf(resolveFormula('膏淋汤').id).id, 'zz_linzhuo')
})

test('special 问诊阶段：六组问题、选项齐全、答案能回填', () => {
  assert.ok(STAGES.includes('special'))
  const questions = questionsFor('special')
  assert.equal(questions.length, 6)
  for (const q of questions) {
    assert.ok(Array.isArray(q.options) && q.options.length >= 5, `${q.header} 选项过少`)
    assert.ok(q.options.some((o) => o.label === '以上都没有'), `${q.header} 缺兜底选项`)
    for (const option of q.options) {
      if (option.label === '以上都没有') continue
      assert.ok(resolveId(option.label) !== undefined, `${q.header} 选项未登记：${option.label}`)
    }
  }
  const caseData = applyAnswers(emptyCase(), [
    { id: 'sym_zz_qi_blood', selected: ['胸中大气下陷（气短不足以息）', '崩漏'] },
    { id: 'sym_zz_mind', selected: ['脑充血/头目胀痛'] },
    { id: 'sym_zz_fluid', selected: ['大渴多饮', '砂淋/石淋'] }
  ])
  assert.ok(caseData.symptoms.includes('qi_sinking'))
  assert.ok(caseData.symptoms.includes('metrorrhagia'))
  assert.ok(caseData.symptoms.includes('brain_hyperemia'))
  assert.ok(caseData.symptoms.includes('polydipsia'))
  assert.ok(caseData.symptoms.includes('stone_urine'))
})

test('症状/舌脉/方族选项卡都有「以上都没有」兜底', () => {
  for (const stage of ['symptoms', 'symptoms2', 'signs']) {
    for (const q of questionsFor(stage)) {
      if (q.id === 'notes') continue // 有「没有补充」
      if (q.id.startsWith('sign_')) continue // 有「没有测量」
      assert.ok(q.options.some((o) => o.label === '以上都没有'), `${q.header} 缺兜底选项`)
    }
  }
  const context = questionsFor('intake').find((q) => q.id === 'context')
  assert.ok(context.options.some((o) => o.label === '以上都没有'), '特殊情况缺兜底选项')
  for (const family of FAMILIES) {
    for (const q of family.questions) {
      assert.ok(q.options.some((o) => o.label.includes('以上都没有')), `${q.header} 缺兜底选项`)
    }
  }
  for (const q of [sourceQuestion(), concernQuestion()]) {
    assert.ok(q.options.some((o) => o.label === '以上都没有'), `${q.header} 缺兜底选项`)
  }
})

test('新症状接入病历摘要与危险信号', () => {
  const c = normalizeCase({ symptoms: ['崩漏', '头晕目眩', '脑充血/头目胀痛'] })
  const summary = caseSummary(c)
  assert.match(summary, /崩漏/)
  const flags = redFlags(c)
  assert.equal(flags.level, 'emergency')
  assert.ok(flags.reasons.some((r) => /失血/.test(r)))
})

test('用药安全：张锡纯方里的毒烈药也会挂警示', () => {
  const sheet = buildSheet(
    normalizeCase({ chief: '痫风', symptoms: ['痫风'] }),
    resolveFormula('振颓丸')
  )
  assert.ok(herbWarnings(resolveFormula('振颓丸')).some((w) => w.includes('马钱子')))
  assert.ok(sheet.warnings.some((w) => w.includes('马钱子')))
  assert.match(sheet.markdown, /不能替代面诊/)
})

test('剂量体系切换不影响证据门槛', async () => {
  const c = normalizeCase({ symptoms: ['发热', '口渴喜冷饮', '大汗出'], pulse: ['洪大'] })
  const report = await verify(c, resolveFormula('石膏（单味）'), { online: false })
  assert.equal(report.verdict, 'supported')
  assert.ok(report.classic.some((hit) => hit.ref.includes('医学衷中参西录')))
  assert.equal(DOSE_BASIS.qing.label, '张氏原量（清制）')
})

test('插件导出契约与工具表', () => {
  assert.equal(name, 'dsh-zhongzhong')
  assert.ok(Array.isArray(inject), 'inject 必须是服务名数组，不能是 { required, optional }')
  assert.deepEqual(inject, ['tools', 'systemPrompt'])
  const host = makeHost([])
  apply(host.ctx)
  assert.deepEqual([...host.registered.keys()].sort(), [
    'zhongzhong_consult',
    'zhongzhong_differentiate',
    'zhongzhong_discuss',
    'zhongzhong_evidence',
    'zhongzhong_export',
    'zhongzhong_formula',
    'zhongzhong_prescribe'
  ])
  assert.equal(host.skills[0].name, 'zhongzhong')
  // 加载技能时 validateDefinition() 要求 source 是字符串，缺了会报 source must be a string
  assert.equal(host.skills[0].source, 'runtime')
  assert.match(host.ctx.sections[0].text, /zhongzhong/)
})

test('端到端：气短不足以息 → 升陷汤 → 证据 → 处方', async () => {
  const host = makeHost([
    // intake
    [
      { id: 'name', selected: ['王先生'] },
      { id: 'age', selected: ['46–60岁'] },
      { id: 'sex', selected: ['男'] },
      { id: 'chief', selected: ['其他（请在下方填写）'], custom: '气短、吸气费劲' },
      { id: 'duration', selected: ['1–4周'] },
      { id: 'context', selected: ['以上都没有'] }
    ],
    // symptoms
    [
      { id: 'sym_cold_heat', selected: ['以上都没有'] },
      { id: 'sym_sweat', selected: ['自汗（动则汗出）'] },
      { id: 'sym_head_body', selected: ['以上都没有'] },
      { id: 'sym_chest_abdomen', selected: ['胸膈满闷'] },
      { id: 'sym_digestion', selected: ['以上都没有'] }
    ],
    // symptoms2
    [
      { id: 'sym_stool_urine', selected: ['以上都没有'] },
      { id: 'sym_sleep_mind', selected: ['以上都没有'] },
      { id: 'sym_respiratory', selected: ['短气（气不够用）'] },
      { id: 'sym_other', selected: ['疲乏无力'] }
    ],
    // signs
    [
      { id: 'sign_temp', selected: ['正常（36–37.2℃）'] },
      { id: 'sign_bp', selected: ['正常（约 120/80）'] },
      { id: 'sign_pulse', selected: ['偏慢（60 次以下）'] },
      { id: 'tongue', selected: ['舌淡白'] },
      { id: 'pulse', selected: ['沉', '微/弱'] },
      { id: 'notes', selected: ['没有补充'] }
    ],
    // special
    [
      { id: 'sym_zz_qi_blood', selected: ['胸中大气下陷（气短不足以息）', '努力呼吸/呼吸费力'] },
      { id: 'sym_zz_women', selected: ['以上都没有'] },
      { id: 'sym_zz_mind', selected: ['以上都没有'] },
      { id: 'sym_zz_fluid', selected: ['以上都没有'] },
      { id: 'sym_zz_chest', selected: ['以上都没有'] },
      { id: 'sym_zz_skin_other', selected: ['以上都没有'] }
    ],
    // differentiate：先家族鉴别，再选方
    [{ id: 'family_zz_shengxian', selected: ['就是气短、吸气费劲，没有明显怕冷，也不觉得郁闷'] }],
    [{ id: 'choose_formula', selected: [] }],
    // prescribe 确认
    [{ id: 'confirm_prescribe', selected: ['确认开方'] }]
  ])
  apply(host.ctx)

  const intake = await run(host, 'zhongzhong_consult', { stage: 'intake' })
  assert.equal(intake.value.status, 'ok')
  const symptoms = await run(host, 'zhongzhong_consult', { stage: 'symptoms', case: intake.value.case })
  const symptoms2 = await run(host, 'zhongzhong_consult', { stage: 'symptoms2', case: symptoms.value.case })
  const signs = await run(host, 'zhongzhong_consult', { stage: 'signs', case: symptoms2.value.case })
  assert.equal(signs.value.next_stage, 'special')
  const special = await run(host, 'zhongzhong_consult', { stage: 'special', case: signs.value.case })
  assert.equal(special.value.status, 'ok')
  assert.ok(special.value.case.symptoms.includes('qi_sinking'))

  const diff = await run(host, 'zhongzhong_differentiate', { case: special.value.case })
  assert.equal(diff.value.status, 'decided', diff.value.message)
  assert.equal(diff.value.chosen.name, '升陷汤')
  assert.equal(diff.value.six, '衷中')

  const evidence = await run(host, 'zhongzhong_evidence', { case: diff.value.case, formula: '升陷汤', online: false })
  assert.equal(evidence.value.verdict, 'supported', evidence.value.message)
  assert.match(evidence.text, /衷中参西录原文/)

  const prescribed = await run(host, 'zhongzhong_prescribe', {
    case: diff.value.case,
    formula: '升陷汤',
    online: false
  })
  assert.equal(prescribed.value.status, 'prescribed', prescribed.value.message)
  assert.match(prescribed.text, /张氏原量/)
  assert.match(prescribed.text, /黄芪/)
  assert.match(prescribed.text, /不能替代面诊/)
})

test('skills 服务晚挂载时，技能仍然注册为 zhongzhong', () => {
  const registered = []
  let resume
  const sections = []
  const ctx = {
    tools: { register: () => () => {} },
    systemPrompt: { section: (section) => { sections.push(section); return () => {} } },
    effect: (run) => run(),
    get(name) {
      return this[name]
    },
    inject(deps, callback) {
      assert.deepEqual(deps, ['skills'])
      resume = callback
      return () => {}
    }
  }
  apply(ctx)
  assert.equal(registered.length, 0, 'skills 未就绪时不应硬注册')
  assert.equal(sections.length, 0, '技能未注册时不应先挂 POINTER')
  ctx.skills = {
    register(definition) {
      registered.push(definition)
      return () => {}
    }
  }
  assert.equal(typeof resume, 'function')
  resume()
  assert.equal(registered.length, 1)
  assert.equal(registered[0].name, 'zhongzhong')
  assert.equal(registered[0].invocation.userInvocable, true)
  assert.equal(sections.length, 1)
  assert.match(sections[0].text, /zhongzhong/)
})

test('端到端：单方石膏的确认与处方', async () => {
  const host = makeHost([[{ id: 'confirm_prescribe', selected: ['确认开方'] }]])
  apply(host.ctx)
  const caseData = {
    patient: { name: '某', age: 35, sex: '男' },
    chief: '高热烦渴',
    symptoms: ['fever', 'thirst_cold', 'profuse_sweat'],
    tongue: ['tongue_red'],
    pulse: ['pulse_surging']
  }
  const result = await run(host, 'zhongzhong_prescribe', { case: caseData, formula: '石膏（单味）', online: false })
  assert.equal(result.value.status, 'prescribed', result.value.message)
  assert.match(result.text, /单方（单味药）/)
  assert.match(result.text, /随证酌用/)
  assert.match(result.text, /不能替代面诊/)
})

test('manual 模式：special 阶段把 6 组问题交给模型代问', async () => {
  const host = makeHost([])
  delete host.ctx.userQuestions
  apply(host.ctx)
  const result = await run(host, 'zhongzhong_consult', { stage: 'special', case: { chief: '气短', symptoms: ['qi_sinking'], tongue: ['tongue_pale'], pulse: ['pulse_weak'] } })
  assert.equal(result.value.status, 'manual')
  assert.equal(result.value.questions.length, 6)
  assert.match(result.text, /气机与出血/)
})

test('未匹配的方剂仍然会被文献门槛拦住', async () => {
  const host = makeHost([])
  apply(host.ctx)
  const c = { chief: '咽痛', symptoms: ['sore_throat'], tongue: ['tongue_red'], pulse: ['pulse_rapid'] }
  const result = await run(host, 'zhongzhong_prescribe', { case: c, formula: '升陷汤', online: false })
  assert.equal(result.value.status, 'blocked')
  assert.ok(result.value.alternatives.length > 0)
  assert.match(result.text, /不能开方/)
})

test('scoreFormula：单方有先验降权，不能盖过成方', () => {
  const c = normalizeCase({ symptoms: ['发热', '口渴喜冷饮', '大汗出'], pulse: ['洪大'] })
  const shigao = scoreFormula(c, resolveFormula('石膏（单味）'))
  const baihu = scoreFormula(c, resolveFormula('白虎汤'))
  assert.ok(shigao !== undefined && baihu !== undefined)
  assert.ok(shigao.score < baihu.score, `单方 ${shigao.score} 不应高于白虎汤 ${baihu.score}`)
})
