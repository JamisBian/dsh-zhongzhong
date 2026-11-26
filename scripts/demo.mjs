// 无界面演示：模拟一位患者走完整条经方接诊流程，把每一步的卡片内容打印出来。
// 用法：node scripts/demo.mjs            （离线文献核查）
//       node scripts/demo.mjs --online    （联网查中文文献；脚本没有注入 tcm_lit_search，会显示未启用）

import { apply } from '../lib/index.js'

const online = process.argv.includes('--online')

/** 患者作答脚本（按顺序消费）。 */
const script = [
  // intake
  [
    { id: 'name', selected: [], custom: '陈小明' },
    { id: 'age', selected: ['31–45岁'] },
    { id: 'sex', selected: ['男'] },
    { id: 'chief', selected: ['感冒发热、咳嗽咽痛'], custom: '两天前淋雨受凉' },
    { id: 'duration', selected: ['2–3天'] },
    { id: 'context', selected: ['以上都不是'] }
  ],
  // symptoms
  [
    { id: 'sym_cold_heat', selected: ['恶寒怕冷', '发热'] },
    { id: 'sym_sweat', selected: ['自汗（动则汗出）'] },
    { id: 'sym_head_body', selected: ['头痛'] },
    { id: 'sym_chest_abdomen', selected: ['以上都没有'] },
    { id: 'sym_digestion', selected: ['以上都没有'] }
  ],
  // symptoms2
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
    { id: 'notes', selected: [], custom: '平时容易出汗' }
  ],
  // 衷中参西特征症（本例与主诉无关，全部选「以上都没有」）
  [
    { id: 'sym_zz_qi_blood', selected: ['以上都没有'] },
    { id: 'sym_zz_women', selected: ['以上都没有'] },
    { id: 'sym_zz_mind', selected: ['以上都没有'] },
    { id: 'sym_zz_fluid', selected: ['以上都没有'] },
    { id: 'sym_zz_chest', selected: ['以上都没有'] },
    { id: 'sym_zz_skin_other', selected: ['以上都没有'] }
  ],
  // 候选方剂
  [{ id: 'choose_formula', selected: ['桂枝汤（推荐）——78%'] }]
]

let step = 0
const registered = new Map()
const ctx = {
  tools: { register: (definition) => registered.set(definition.name, definition) },
  systemPrompt: { section: () => () => {} },
  userQuestions: {
    async ask(request) {
      const answer = script[step++]
      if (answer === undefined) throw Object.assign(new Error('no answer'), { code: 'ASK_CANCELLED' })
      // 对照问题 id 校验脚本是否对齐
      const ids = request.questions.map((q) => q.id)
      const given = answer.map((a) => a.id)
      if (ids.join(',') !== given.join(',')) {
        console.warn(`\n[脚本与问题不对齐]\n  问题: ${ids.join(', ')}\n  作答: ${given.join(', ')}`)
      }
      return { answers: answer }
    }
  },
  get(name) {
    return this[name]
  }
}

apply(ctx)

const line = (title) => {
  console.log(`\n${'═'.repeat(72)}\n${title}\n${'═'.repeat(72)}`)
}

async function call(name, args) {
  const definition = registered.get(name)
  const exec = { callId: `${name}-${Math.random().toString(16).slice(2)}`, signal: new AbortController().signal }
  const value = await definition.execute(args, exec)
  const text = definition.output.render(args, value)
    .map((block) => block.text)
    .join('\n')
  return { value, text }
}

line('① 问诊 · 一般资料与主诉')
const intake = await call('zhongzhong_consult', { stage: 'intake' })
console.log(intake.text)

line('② 问诊（上）· 寒热汗出头身胸腹饮食')
const s1 = await call('zhongzhong_consult', { stage: 'symptoms', case: intake.value.case })
console.log(s1.text.split('### 当前病历')[0].trim())

line('③ 问诊（下）· 二便睡眠咳喘其他')
const s2 = await call('zhongzhong_consult', { stage: 'symptoms2', case: s1.value.case })
console.log(s2.text.split('### 当前病历')[0].trim())

line('④ 客观指标与舌脉')
const signs = await call('zhongzhong_consult', { stage: 'signs', case: s2.value.case })
console.log(signs.text.split('### 当前病历')[0].trim())

line('⑤ 衷中参西特征症（按主诉选问；本例全部跳过）')
const special = await call('zhongzhong_consult', { stage: 'special', case: signs.value.case })
console.log(special.text.split('### 当前病历')[0].trim())

line('⑥ 辨证（先自动追问鉴别点，再给候选）')
const diff = await call('zhongzhong_differentiate', { case: special.value.case })
console.log(diff.text.split('### 病历')[0].trim())

line('⑦ 文献核查')
const evidence = await call('zhongzhong_evidence', {
  case: diff.value.case,
  formula: diff.value.chosen.name,
  online
})
console.log(evidence.text)

line('⑧ 开方（红旗筛查 → 文献复核 → 患者确认）')
script.push([{ id: 'confirm_prescribe', selected: ['确认开方'] }])
const prescribe = await call('zhongzhong_prescribe', {
  case: diff.value.case,
  formula: diff.value.chosen.name,
  online
})
console.log(prescribe.text)

line('⑧ 患者质疑：「网上说该清热，不该用桂枝」')
script.push(
  [
    { id: 'objection_source', selected: ['网上/短视频看到的说法'] },
    { id: 'objection_concern', selected: ['药性太猛/有毒副作用'] }
  ],
  []
)
const discuss = await call('zhongzhong_discuss', {
  case: diff.value.case,
  formula: diff.value.chosen.name,
  objection: '我在网上看到说这个方太热了，应该清热，不该用桂枝。',
  online: false
})
console.log(discuss.text)

console.log('\n演示结束。经方按 1 两 = 3 克折算，张锡纯方按清制 1 两 = 30 克折算；仅供学习参考，不能替代面诊。')
