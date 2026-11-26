// 端到端流程测试：用假 ctx 模拟「提问 → 患者作答」的完整接诊。
import { test } from 'node:test'
import assert from 'node:assert/strict'

import { apply, name, inject } from '../lib/index.js'

/** 造一个假 ctx：工具表 + 记录提问 + 按脚本作答。 */
function makeHost(script) {
  const registered = new Map()
  const asked = []
  const skills = []
  let index = 0
  const ctx = {
    skills: {
      register(definition) {
        skills.push(definition)
        return () => {}
      }
    },
    effect(run) {
      const disposer = run()
      return disposer ?? (() => {})
    },
    tools: {
      register(definition) {
        registered.set(definition.name, definition)
        return () => registered.delete(definition.name)
      }
    },
    systemPrompt: {
      section(section) {
        ctx.sections.push(section)
        return () => {}
      }
    },
    sections: [],
    userQuestions: {
      async ask(request) {
        asked.push(request)
        const answer = script[index++]
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

/** 直接调用工具定义（绕过 registry，只测执行与渲染）。 */
async function run(host, toolName, args, extra = {}) {
  const definition = host.registered.get(toolName)
  assert.ok(definition !== undefined, `工具未注册：${toolName}`)
  const exec = { callId: `call-${Math.random().toString(16).slice(2)}`, signal: new AbortController().signal, arguments: args, ...extra }
  const value = await definition.execute(args, exec)
  const content = definition.output.render(args, value)
  return { value, text: content.map((block) => block.text).join('\n') }
}

const intakeAnswers = [
  [
    { id: 'name', selected: [], custom: '陈小明' },
    { id: 'age', selected: ['31–45岁'] },
    { id: 'sex', selected: ['男'] },
    { id: 'chief', selected: ['感冒发热、咳嗽咽痛'], custom: '两天前淋雨受凉' },
    { id: 'duration', selected: ['2–3天'] }
  ]
]

test('插件导出契约', async () => {
  assert.equal(name, 'dsh-zhongzhong')
  // Cordis 4 只认「服务名数组」；写成 { required, optional } 会等两个不存在的服务，
  // fiber 永远 pending，Plugins 页显示「等待依赖」。
  assert.ok(Array.isArray(inject), 'inject 必须是服务名数组')
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
  assert.equal(host.ctx.sections[0].name, 'zhongzhong:workflow')
  // 全局只留指引，完整流程在技能里
  assert.match(host.ctx.sections[0].text, /zhongzhong/)
  assert.equal(host.skills.length, 1)
  const skill = host.skills[0]
  assert.equal(skill.name, 'zhongzhong')
  assert.equal(skill.invocation.modelInvocable, true)
  assert.equal(skill.invocation.userInvocable, true)
  assert.match(skill.content, /宁可多问一句/)
})

test('完整接诊流程：桂枝汤证', async () => {
  const host = makeHost([
    // intake
    intakeAnswers[0],
    // symptoms（寒热/汗/头身/胸腹/饮食）
    [
      { id: 'sym_cold_heat', selected: ['恶寒怕冷', '发热'] },
      { id: 'sym_sweat', selected: ['自汗（动则汗出）'] },
      { id: 'sym_head_body', selected: ['头痛'] },
      { id: 'sym_chest_abdomen', selected: ['以上都没有'] },
      { id: 'sym_digestion', selected: ['以上都没有'] }
    ],
    // symptoms2（二便/睡眠/咳喘/其他）
    [
      { id: 'sym_stool_urine', selected: ['以上都没有'] },
      { id: 'sym_sleep_mind', selected: ['以上都没有'] },
      { id: 'sym_respiratory', selected: ['鼻塞流涕'] },
      { id: 'sym_other', selected: ['以上都没有'] }
    ],
    // signs
    [
      { id: 'sign_temp', selected: [], custom: '37.8' },
      { id: 'sign_bp', selected: [], custom: '118/76' },
      { id: 'sign_pulse', selected: [], custom: '82' },
      { id: 'tongue', selected: ['舌淡红', '苔薄白'] },
      { id: 'pulse', selected: ['浮', '微/弱'] },
      { id: 'notes', selected: [], custom: '平时易出汗' }
    ],
    // differentiate：鉴别问题（无新增）+ 候选选择
    [{ id: 'discriminate_1', selected: ['以上都没有'] }],
    [{ id: 'choose_formula', selected: [] }]
  ])
  apply(host.ctx)

  const intake = await run(host, 'zhongzhong_consult', { stage: 'intake' })
  assert.equal(intake.value.status, 'ok')
  assert.equal(intake.value.case.patient.name, '陈小明')
  assert.match(intake.value.case.chief, /感冒发热/)
  assert.match(intake.text, /```json/)
  const caseJson = JSON.parse(intake.text.split('```json')[1].split('```')[0])
  assert.equal(caseJson.patient.name, '陈小明')

  const s1 = await run(host, 'zhongzhong_consult', { stage: 'symptoms', case: intake.value.case })
  assert.equal(s1.value.status, 'ok')
  assert.ok(s1.value.case.symptoms.includes('aversion_cold'))

  const s2 = await run(host, 'zhongzhong_consult', { stage: 'symptoms2', case: s1.value.case })
  assert.equal(s2.value.status, 'ok')
  assert.ok(s2.value.case.symptoms.includes('nasal'))

  const signs = await run(host, 'zhongzhong_consult', { stage: 'signs', case: s2.value.case })
  assert.equal(signs.value.status, 'ok')
  assert.equal(signs.value.case.vitals.tempC, 37.8)
  assert.equal(signs.value.case.vitals.sbp, 118)
  assert.deepEqual(signs.value.case.pulse, ['pulse_float', 'pulse_weak'])
  assert.equal(signs.value.next_stage, 'special')

  const diff = await run(host, 'zhongzhong_differentiate', { case: signs.value.case })
  assert.equal(diff.value.status, 'decided', diff.value.message)
  assert.equal(diff.value.chosen.id, 'guizhi_tang')
  assert.ok(diff.value.ranking.length >= 1)
  assert.ok(host.asked.some((request) => request.questions[0].id === 'choose_formula'))

  const evidence = await run(host, 'zhongzhong_evidence', { case: diff.value.case, formula: '桂枝汤', online: false })
  assert.equal(evidence.value.verdict, 'supported')
  assert.ok(evidence.value.classic.length >= 1)
  assert.match(evidence.text, /文献依据/)

  const prescribe = await run(host, 'zhongzhong_prescribe', {
    case: diff.value.case,
    formula: '桂枝汤',
    modifications: ['咳嗽加杏仁 9g'],
    notes: '三剂后复诊',
    online: false
  })
  assert.equal(prescribe.value.status, 'prescribed', prescribe.value.message)
  assert.match(prescribe.text, /处方笺/)
  assert.match(prescribe.text, /1 两 = 3 克/)
  assert.match(prescribe.text, /免责声明|不能替代面诊/)
})

test('信息不足时拒绝给方', async () => {
  const host = makeHost([
    // 鉴别问题一律「以上都没有」
    [{ id: 'discriminate_1', selected: ['以上都没有'] }],
    [{ id: 'discriminate_2', selected: ['以上都没有'] }],
    [{ id: 'discriminate_3', selected: ['以上都没有'] }]
  ])
  apply(host.ctx)
  const tiny = {
    patient: { name: '某', age: 30, sex: '女' },
    chief: '有点累',
    symptoms: ['fatigue'],
    tongue: ['舌淡红'],
    pulse: ['细']
  }
  const diff = await run(host, 'zhongzhong_differentiate', { case: tiny })
  assert.notEqual(diff.value.status, 'decided')
  assert.ok(['need_more', 'insufficient'].includes(diff.value.status), diff.value.status)
  assert.match(diff.text, /不能定方|没有任何方证|需要继续提问/)
})

test('文献不足时开方被拦截', async () => {
  const host = makeHost([[{ id: 'confirm_prescribe', selected: [] }]])
  apply(host.ctx)
  const caseData = {
    patient: { name: '某', age: 30, sex: '女' },
    chief: '咽痛',
    symptoms: ['sore_throat'],
    tongue: ['舌红'],
    pulse: ['数']
  }
  const result = await run(host, 'zhongzhong_prescribe', { case: caseData, formula: '四逆汤', online: false })
  assert.equal(result.value.status, 'blocked')
  assert.ok(result.value.alternatives.length > 0)
  assert.match(result.text, /不能开方/)
})

test('危险信号直接建议就医', async () => {
  const host = makeHost([])
  apply(host.ctx)
  const result = await run(host, 'zhongzhong_prescribe', {
    case: {
      patient: { age: 68, sex: '男' },
      symptoms: ['chest_pain', 'profuse_sweat'],
      vitals: { tempC: 38.2, sbp: 190, dbp: 110, pulse: 132 }
    },
    formula: '桂枝汤',
    online: false
  })
  assert.equal(result.value.status, 'emergency')
  assert.match(result.text, /立即就医/)
  assert.equal(host.asked.length, 0)
})

test('没有提问界面时退化为 manual', async () => {
  const host = makeHost([])
  delete host.ctx.userQuestions
  apply(host.ctx)
  const result = await run(host, 'zhongzhong_consult', { stage: 'intake' })
  assert.equal(result.value.status, 'manual')
  assert.ok(result.value.questions.length >= 3)
  assert.match(result.text, /称呼/)
})

test('方剂详情与剂量折算', async () => {
  const host = makeHost([])
  apply(host.ctx)
  const result = await run(host, 'zhongzhong_formula', { name: '小柴胡汤' })
  assert.equal(result.value.status, 'ok')
  assert.match(result.text, /柴胡/)
  assert.match(result.text, /24g/)
  const missing = await run(host, 'zhongzhong_formula', { name: '不存在的方' })
  assert.equal(missing.value.status, 'not_found')
})

const guizhiCase = {
  patient: { name: '张三', age: 35, sex: '男' },
  chief: '感冒后头痛发热',
  symptoms: ['aversion_wind', 'fever', 'spontaneous_sweat', 'headache', 'nasal'],
  tongue: ['tongue_pink', 'coat_thin_white'],
  pulse: ['pulse_float', 'pulse_weak'],
  vitals: { tempC: 37.8, pulse: 82 }
}

test('质疑：依据不足时维持原判并追问依据', async () => {
  const host = makeHost([
    [{ id: 'objection_source', selected: ['网上/短视频看到的说法'] }],
    [{ id: 'objection_concern', selected: ['药性太猛/有毒副作用'] }]
  ])
  apply(host.ctx)
  const result = await run(host, 'zhongzhong_discuss', {
    case: guizhiCase,
    formula: '桂枝汤',
    objection: '我在网上看到说这个方太热了，应该清热，不该用桂枝。',
    online: false
  })
  assert.equal(result.value.status, 'maintain', result.value.message)
  assert.match(result.value.markdown, /我的判断不变/)
  assert.match(result.value.markdown, /原文依据/)
  assert.match(result.value.markdown, /什么情况下我会改方/)
  // 追问了两个依据类问题
  assert.equal(host.asked.length, 1)
  assert.equal(host.asked[0].questions.length, 2)
  assert.equal(host.asked[0].questions[0].id, 'objection_source')
  assert.ok(host.asked[0].questions[1].options.length >= 3)
})

test('质疑：提到妊娠禁忌时立即修正并认错', async () => {
  const host = makeHost([])
  apply(host.ctx)
  const result = await run(host, 'zhongzhong_discuss', {
    case: { ...guizhiCase, patient: { name: '李四', age: 31, sex: '女' } },
    formula: '桃核承气汤',
    objection: '我怀孕两个月了，这个方还能吃吗？',
    online: false
  })
  assert.equal(result.value.status, 'revise')
  assert.match(result.value.markdown, /我承认/)
  assert.match(result.value.markdown, /妊娠/)
  assert.ok(result.value.conflicts.length >= 1)
  assert.ok(result.value.conflicts[0].herbs.length >= 1)
})

test('质疑：话里带新症状时重新辨证并改方', async () => {
  const host = makeHost([])
  apply(host.ctx)
  const result = await run(host, 'zhongzhong_discuss', {
    case: guizhiCase,
    formula: '桂枝汤',
    objection: '其实我还一直口苦、胁肋胀满、忽冷忽热、恶心想吐，是不是搞错了？',
    online: false
  })
  assert.equal(result.value.status, 'revise', result.value.message)
  assert.ok(result.value.new_findings.length >= 2)
  assert.match(result.value.markdown, /我承认/)
  assert.match(result.value.markdown, /修正后的判断/)
})

test('质疑：没有提问界面时退化为 manual', async () => {
  const host = makeHost([])
  delete host.ctx.userQuestions
  apply(host.ctx)
  const result = await run(host, 'zhongzhong_discuss', {
    case: guizhiCase,
    formula: '桂枝汤',
    objection: '我觉得不对',
    online: false
  })
  assert.equal(result.value.status, 'manual')
  assert.equal(result.value.questions.length, 2)
})

test('辨证卡显示方证详解（patternDetail）', async () => {
  const host = makeHost([
    [{ id: 'choose_formula', selected: ['小柴胡汤（推荐）——68%'] }]
  ])
  apply(host.ctx)
  const caseData = {
    patient: { name: '李四', age: 42, sex: '女' },
    chief: '忽冷忽热、口苦',
    symptoms: ['alternating', 'bitter_mouth', 'hypochondriac', 'poor_appetite', 'nausea'],
    tongue: ['coat_thin_white'],
    pulse: ['pulse_wiry']
  }
  const diff = await run(host, 'zhongzhong_differentiate', { case: caseData })
  assert.equal(diff.value.status, 'decided', diff.value.message)
  assert.match(diff.text, /### 方证详解/)
  assert.match(diff.text, /一句话方证/)
  assert.match(diff.text, /功用/)
  assert.match(diff.text, /往来寒热/)

  const detail = await run(host, 'zhongzhong_formula', { name: '小柴胡汤' })
  assert.match(detail.text, /方证详解/)
  assert.match(detail.text, /清胆热/)
})

test('后世方：依据标注为手册方证，处方笺带提示', async () => {
  const host = makeHost([[{ id: 'confirm_prescribe', selected: ['确认开方'] }]])
  apply(host.ctx)
  const caseData = {
    patient: { name: '某', age: 45, sex: '女' },
    chief: '失眠多梦、易惊',
    symptoms: ['insomnia', 'dreamy_sleep', 'nausea', 'palpitation', 'anxiety', 'dizziness'],
    tongue: ['coat_yellow_greasy'],
    pulse: ['pulse_slippery']
  }
  const detail = await run(host, 'zhongzhong_formula', { name: '温胆汤' })
  assert.equal(detail.value.status, 'ok')
  assert.match(detail.text, /后世方|手册/)

  const evidence = await run(host, 'zhongzhong_evidence', { case: caseData, formula: '温胆汤', online: false })
  assert.equal(evidence.value.verdict, 'supported', evidence.value.message)
  assert.match(evidence.text, /依据类型：手册方证/)

  const prescribed = await run(host, 'zhongzhong_prescribe', { case: caseData, formula: '温胆汤', online: false })
  assert.equal(prescribed.value.status, 'prescribed', prescribed.value.message)
  assert.match(prescribed.text, /后世方\/经验方/)
})

test('每道问诊题都必须有选项（否则空提交会被界面拦住）', async () => {
  const { questionsFor, STAGES } = await import('../lib/questions.js')
  for (const stage of STAGES) {
    for (const question of questionsFor(stage)) {
      assert.ok(
        Array.isArray(question.options) && question.options.length > 0,
        `阶段 ${stage} 的「${question.header ?? question.id}」没有选项，用户无法提交`
      )
    }
  }
})

test('补充题可选「没有补充」，过敏史进入病历与处方警示', async () => {
  const { questionsFor, applyAnswers } = await import('../lib/questions.js')
  const { emptyCase } = await import('../lib/engine/case.js')
  const notes = questionsFor('signs').find((q) => q.id === 'notes')
  assert.ok(notes.options.some((o) => o.label === '没有补充'))

  // 只选「没有补充」：可以提交，且不产生任何补充信息
  const plain = applyAnswers(emptyCase(), [{ id: 'notes', selected: ['没有补充'], custom: '' }])
  assert.equal(plain.notes, '')
  assert.equal(plain.allergy, '')

  // 选过敏史 + 自定义：过敏史单独成字段
  const allergic = applyAnswers(emptyCase(), [
    { id: 'notes', selected: ['有药物过敏史', '正在服用西药或中成药'], custom: '磺胺类' }
  ])
  assert.equal(allergic.allergy, '磺胺类')
  assert.match(allergic.notes, /正在服用西药/)

  const host = makeHost([])
  apply(host.ctx)
  const sheet = await run(host, 'zhongzhong_formula', { name: '桂枝汤' })
  assert.equal(sheet.value.status, 'ok')
})

test('方族鉴别：四逆汤家族四个分支各归其方', async () => {
  const branches = [
    ['脸色发白、没血色', '四逆汤'],
    ['脸发红（两颧像抹了胭脂），但身上并不怕冷', '通脉四逆汤'],
    ['脸发红，人没精神、总想睡，还拉肚子', '白通汤'],
    ['脸发红，心里烦、干呕，脉搏几乎摸不到', '白通加猪胆汁汤']
  ]
  for (const [label, expected] of branches) {
    const host = makeHost([
      [{ id: 'family_sini_daiyang', selected: [label] }],
      [{ id: 'choose_formula', selected: [] }]
    ])
    apply(host.ctx)
    const result = await run(host, 'zhongzhong_differentiate', {
      case: {
        patient: { name: '某', age: 60, sex: '男' },
        chief: '腹泻、手足厥冷',
        symptoms: ['腹泻', '手足厥冷', '脉微欲绝', '畏寒肢冷'],
        tongue: ['舌淡白'],
        pulse: ['微/弱']
      }
    })
    assert.equal(result.value.status, 'decided', `${label}: ${result.value.message}`)
    assert.equal(result.value.chosen.name, expected, `${label} 判成了 ${result.value.chosen.name}`)
    // 第一次问的一定是家族鉴别题
    assert.equal(host.asked[0].questions[0].id, 'family_sini_daiyang')
  }
})

test('方族鉴别：承气汤家族也会触发', async () => {
  const host = makeHost([
    [{ id: 'family_chengqi', selected: ['肚子硬邦邦的，一按就疼，还不让按'] }],
    [{ id: 'choose_formula', selected: [] }]
  ])
  apply(host.ctx)
  const result = await run(host, 'zhongzhong_differentiate', {
    case: {
      patient: { name: '某', age: 45, sex: '男' },
      chief: '便秘腹胀',
      symptoms: ['便秘', '腹部胀满', '潮热', '大便干硬', '腹硬拒按'],
      tongue: ['苔黄'],
      pulse: ['滑']
    }
  })
  assert.equal(host.asked[0].questions[0].id, 'family_chengqi')
  assert.equal(result.value.status, 'decided', result.value.message)
  assert.ok(['大承气汤', '小承气汤'].includes(result.value.chosen.name))
})

test('家族鉴别：患者说「说不清」时退出，不硬套', async () => {
  const host = makeHost([
    [{ id: 'family_sini_daiyang', selected: ['以上都没有（说不清 / 都不像）'] }],
    [{ id: 'family_sini_pattern', selected: [] }],
    [{ id: 'discriminate_2', selected: ['以上都没有'] }]
  ])
  apply(host.ctx)
  const result = await run(host, 'zhongzhong_differentiate', {
    case: {
      patient: { name: '某', age: 60, sex: '男' },
      chief: '腹泻、手足厥冷',
      symptoms: ['腹泻', '手足厥冷', '脉微欲绝', '畏寒肢冷'],
      tongue: ['舌淡白'],
      pulse: ['微/弱']
    }
  })
  // 家族题只问一次，不重复
  const askedFamily = host.asked.filter((request) => request.questions.some((q) => q.id.startsWith('family_sini')))
  assert.equal(askedFamily.length, 1, '「说不清」后仍在重复问家族题')
  // 没有硬套方族：结果不是靠 boost 直接给定的
  assert.ok(['need_more', 'decided'].includes(result.value.status))
  if (result.value.status === 'need_more') {
    assert.match(result.value.message, /说不清|不要再逼|客观症状/)
  }
})

test('家族鉴别：泻心汤类也会触发且能定方', async () => {
  const host = makeHost([
    [{ id: 'family_xiexin', selected: ['打嗝带着食物的馊味，肚子咕咕响、拉肚子'] }],
    [{ id: 'choose_formula', selected: [] }]
  ])
  apply(host.ctx)
  const result = await run(host, 'zhongzhong_differentiate', {
    case: {
      patient: { name: '某', age: 40, sex: '男' },
      chief: '胃脘痞满、嗳气',
      symptoms: ['心下（胃脘）痞满', '嗳气（打嗝）', '肠鸣漉漉', '腹泻'],
      tongue: ['苔黄腻'],
      pulse: ['弦']
    }
  })
  assert.equal(host.asked[0].questions[0].id, 'family_xiexin')
  assert.equal(result.value.status, 'decided', result.value.message)
  assert.equal(result.value.chosen.name, '生姜泻心汤')
})

test('会话标题：采集到姓名与主诉后改成「姓名·主诉」', async () => {
  const renames = []
  const host = makeHost([
    [
      { id: 'name', selected: ['张三'] },
      { id: 'age', selected: ['35-44 岁'] },
      { id: 'sex', selected: ['女'] },
      { id: 'chief', selected: ['头痛'] },
      { id: 'duration', selected: ['一周内'] },
      { id: 'context', selected: [] }
    ]
  ])
  // 补上 sessionTitle 服务与 agent.session，模拟真实调用环境
  host.ctx.sessionTitle = { rename: (session, title) => renames.push([session, title]) }
  const agent = { session: { id: 's1' } }
  apply(host.ctx)
  const result = await run(host, 'zhongzhong_consult', { stage: 'intake' }, { agent })
  assert.equal(result.value.status, 'ok')
  assert.deepEqual(renames, [[agent.session, '张三·头痛']])
})

test('会话标题：不留名时用「患者·主诉」', async () => {
  const renames = []
  const host = makeHost([
    [
      { id: 'name', selected: ['不方便留名'] },
      { id: 'age', selected: ['25-34 岁'] },
      { id: 'sex', selected: ['男'] },
      { id: 'chief', selected: ['失眠'] },
      { id: 'duration', selected: ['一周内'] },
      { id: 'context', selected: [] }
    ]
  ])
  host.ctx.sessionTitle = { rename: (session, title) => renames.push(title) }
  apply(host.ctx)
  await run(host, 'zhongzhong_consult', { stage: 'intake' }, { agent: { session: { id: 's2' } } })
  assert.deepEqual(renames, ['患者·失眠'])
})

test('会话标题：没有 sessionTitle 服务时不崩，也不影响问诊', async () => {
  const host = makeHost([
    [
      { id: 'name', selected: ['李四'] },
      { id: 'age', selected: ['45-54 岁'] },
      { id: 'sex', selected: ['男'] },
      { id: 'chief', selected: ['胃痛'] },
      { id: 'duration', selected: ['一周内'] },
      { id: 'context', selected: [] }
    ]
  ])
  apply(host.ctx)
  const result = await run(host, 'zhongzhong_consult', { stage: 'intake' }, { agent: { session: { id: 's3' } } })
  assert.equal(result.value.status, 'ok')
  assert.equal(result.value.case.chief, '胃痛')
})

test('病案导出：写入文件、可追加复诊、默认带隐私提示', async () => {
  const { mkdtemp, readFile, rm } = await import('node:fs/promises')
  const { tmpdir } = await import('node:os')
  const path = await import('node:path')

  const host = makeHost([])
  apply(host.ctx)
  const dir = await mkdtemp(path.join(tmpdir(), 'zhongzhong-'))
  const record = {
    patient: { name: '张三', age: 38, sex: '男' },
    chief: '头痛',
    symptoms: ['恶寒怕冷', '头痛'],
    tongue: ['舌淡白'],
    pulse: ['浮'],
    allergy: '青霉素'
  }

  const first = await run(host, 'zhongzhong_export', { case: record, formula: '桂枝汤', pattern: '太阳中风证', advice: '避风，温服取微汗', dir })
  assert.equal(first.value.status, 'ok')
  assert.match(first.value.path, /2026-\d{2}-\d{2}-张三\.md$/)
  assert.equal(first.value.appended, false)

  const text = await readFile(first.value.path, 'utf8')
  assert.match(text, /# 中医衷中参西病案 · 张三/)
  assert.match(text, /病史摘要/)
  assert.match(text, /太阳中风证/)
  assert.match(text, /处方笺/)
  assert.match(text, /青霉素/) // 过敏史必须进病案
  assert.match(text, /个人健康信息/)

  // 复诊：追加到同一文件，形成连续档案
  const second = await run(host, 'zhongzhong_export', { case: record, formula: '桂枝汤', dir })
  assert.equal(second.value.status, 'ok')
  assert.equal(second.value.appended, true)
  const merged = await readFile(second.value.path, 'utf8')
  assert.equal((merged.match(/## 就诊记录/g) ?? []).length, 1)
  assert.match(second.value.message, /含个人健康信息/)

  await rm(dir, { recursive: true, force: true })
})

test('病案导出：文件名清洗、空病历拒绝、未知方报错', async () => {
  const { mkdtemp, rm } = await import('node:fs/promises')
  const { tmpdir } = await import('node:os')
  const path = await import('node:path')

  const host = makeHost([])
  apply(host.ctx)
  const dir = await mkdtemp(path.join(tmpdir(), 'zhongzhong-'))

  const odd = await run(host, 'zhongzhong_export', {
    case: { patient: { name: '李四/王五:测试' }, chief: '胃痛', symptoms: ['胃脘疼痛'] },
    dir
  })
  assert.equal(odd.value.status, 'ok')
  assert.ok(!/[\\/:*?"<>|]/.test(path.basename(odd.value.path)), `文件名未清洗：${odd.value.path}`)

  const empty = await run(host, 'zhongzhong_export', { case: {}, dir })
  assert.equal(empty.value.status, 'error')

  const unknown = await run(host, 'zhongzhong_export', {
    case: { chief: '头痛', symptoms: ['头痛'] },
    formula: '不存在汤',
    dir
  })
  assert.equal(unknown.value.status, 'error')
  assert.match(unknown.value.message, /找不到方剂/)

  await rm(dir, { recursive: true, force: true })
})

test('会话标题：同名服务缺失/会话缺失时给出可诊断的原因', async () => {
  const { syncSessionTitle, titleSyncLine } = await import('../lib/tools.js')
  const record = { patient: { name: '张三' }, chief: '头痛' }

  const noService = syncSessionTitle({ get: () => undefined }, { agent: { session: { id: 's' } } }, record)
  assert.equal(noService.status, 'no-service')
  assert.match(titleSyncLine(noService), /no-service/)

  const noSession = syncSessionTitle({ get: () => ({ rename: () => {} }) }, {}, record)
  assert.equal(noSession.status, 'no-session')

  const boom = syncSessionTitle({ get: () => ({ rename: () => { throw new Error('session not live') } }) }, { agent: { session: { id: 's' } } }, record)
  assert.equal(boom.status, 'error')
  assert.match(boom.reason, /not live/)

  const ok = syncSessionTitle({ get: () => ({ rename: () => {} }) }, { agent: { session: { id: 's' } } }, record)
  assert.equal(ok.status, 'renamed')
  assert.equal(ok.title, '张三·头痛')
  assert.match(titleSyncLine(ok), /张三·头痛/)

  assert.equal(syncSessionTitle({ get: () => undefined }, {}, { chief: '' }).status, 'skipped')
})

test('会话标题：问诊结果里带上标题同步状态', async () => {
  const host = makeHost([
    [
      { id: 'name', selected: ['王五'] },
      { id: 'age', selected: ['25-34 岁'] },
      { id: 'sex', selected: ['男'] },
      { id: 'chief', selected: ['咳嗽'] },
      { id: 'duration', selected: ['一周内'] },
      { id: 'context', selected: [] }
    ]
  ])
  host.ctx.sessionTitle = { rename: () => {} }
  apply(host.ctx)
  const result = await run(host, 'zhongzhong_consult', { stage: 'intake' }, { agent: { session: { id: 's9' } } })
  assert.equal(result.value.status, 'ok')
  assert.equal(result.value.title_sync.status, 'renamed')
  assert.match(result.text, /会话标题已设为「王五·咳嗽」/)
})

test('合方：相容的两方可以合成一首，重复度过高的两方被拒', async () => {
  const { combineCheck, buildCombined } = await import('../lib/engine/combine.js')
  const { resolveFormula } = await import('../lib/data/index.js')

  const ok = combineCheck(resolveFormula('桂枝汤'), resolveFormula('小柴胡汤'))
  assert.notEqual(ok.level, 'block', ok.reasons.join('；'))
  const merged = buildCombined(resolveFormula('桂枝汤'), resolveFormula('小柴胡汤'))
  assert.equal(merged.name, '桂枝汤合小柴胡汤')
  assert.equal(merged.combined, true)
  assert.equal(merged.composition.length, 9) // 5 + 7 - 3 味共有
  assert.ok(merged.indicators.length >= 15)

  const dup = combineCheck(resolveFormula('桂枝汤'), resolveFormula('桂枝加葛根汤'))
  assert.equal(dup.level, 'block')
  assert.match(dup.reasons.join('；'), /药味重复/)

  const self = combineCheck(resolveFormula('桂枝汤'), resolveFormula('桂枝汤'))
  assert.equal(self.level, 'block')
})

test('合方：十八反与毒性叠加分别拦住 / 提示', async () => {
  const { combineCheck } = await import('../lib/engine/combine.js')
  const fake = (name, herbs) => ({ id: name, name, composition: herbs.map((h) => ({ herb: h, text: '9g' })) })

  const reverse = combineCheck(fake('甲', ['甘草', '桂枝']), fake('乙', ['甘遂', '大枣']))
  assert.equal(reverse.level, 'block')
  assert.match(reverse.reasons.join('；'), /十八反/)

  const toxic = combineCheck(fake('丙', ['附子', '干姜']), fake('丁', ['附子', '甘草']))
  assert.equal(toxic.level, 'caution')
  assert.match(toxic.reasons.join('；'), /毒性叠加/)
})

test('分差很小时给出合方 / 取最优的选项', async () => {
  const host = makeHost([])
  apply(host.ctx)
  const { describeCloseCall } = await import('../lib/tools.js')
  const ranking = [
    { formula: { id: 'a', name: '桂枝汤', composition: [{ herb: '桂枝' }, { herb: '芍药' }] }, score: 0.7 },
    { formula: { id: 'b', name: '小柴胡汤', composition: [{ herb: '柴胡' }, { herb: '黄芩' }] }, score: 0.68 },
    { formula: { id: 'c', name: '麻黄汤', composition: [{ herb: '麻黄' }] }, score: 0.4 }
  ]
  const close = describeCloseCall(ranking)
  assert.ok(close !== undefined)
  assert.equal(close.gap, 2)
  assert.ok(close.options.includes('combine'))
  assert.ok(close.options.includes('pick_best'))

  // 分差够大时不提示
  assert.equal(describeCloseCall([{ ...ranking[0], score: 0.9 }, { ...ranking[1], score: 0.5 }]), undefined)
})

test('医师强制开方口令：默认关闭，配置后才生效', async () => {
  const phrase = '本机专用口令-测试'
  const setup = (config) => {
    const host = makeHost([
      [{ id: 'confirm_prescribe', selected: ['确认开方'] }],
      [{ id: 'confirm_prescribe', selected: ['确认开方'] }]
    ])
    apply(host.ctx, config)
    return host
  }
  const record = {
    patient: { name: '某', age: 40, sex: '男' },
    chief: '头痛',
    symptoms: ['头痛', '恶寒怕冷'],
    tongue: ['舌淡白'],
    pulse: ['浮']
  }

  // 未配置：口令无效，仍然被文献门槛拦住
  const off = setup({})
  const blocked = await run(off, 'zhongzhong_prescribe', { case: record, formula: '天雄散', clinician_override: phrase, online: false })
  assert.equal(blocked.value.status, 'blocked')

  // 配置了：口令正确则出方，且处方笺顶部有强制开方警示
  const on = setup({ overridePhrase: phrase })
  const forced = await run(on, 'zhongzhong_prescribe', { case: record, formula: '天雄散', clinician_override: phrase, online: false })
  assert.equal(forced.value.status, 'prescribed', forced.value.message)
  assert.match(forced.value.markdown, /医师强制开方/)
  assert.match(forced.value.markdown, /天雄散/)

  // 口令错误：仍被拦住
  const wrong = setup({ overridePhrase: phrase })
  const stillBlocked = await run(wrong, 'zhongzhong_prescribe', { case: record, formula: '天雄散', clinician_override: '瞎猜的', online: false })
  assert.equal(stillBlocked.value.status, 'blocked')
})
