// 无界面演示（二）：张锡纯「大气下陷 → 升陷汤」完整接诊
// 用法：node scripts/demo-zhongzhong.mjs

import { apply } from '../lib/index.js'

const script = [
  [
    { id: 'name', selected: [], custom: '王先生' },
    { id: 'age', selected: ['46–60岁'] },
    { id: 'sex', selected: ['男'] },
    { id: 'chief', selected: ['其他（请在下方填写）'], custom: '气短、吸气费劲' },
    { id: 'duration', selected: ['1–4周'] },
    { id: 'context', selected: ['以上都不是'] }
  ],
  [
    { id: 'sym_cold_heat', selected: ['以上都没有'] },
    { id: 'sym_sweat', selected: ['自汗（动则汗出）'] },
    { id: 'sym_head_body', selected: ['以上都没有'] },
    { id: 'sym_chest_abdomen', selected: ['胸膈满闷'] },
    { id: 'sym_digestion', selected: ['以上都没有'] }
  ],
  [
    { id: 'sym_stool_urine', selected: ['以上都没有'] },
    { id: 'sym_sleep_mind', selected: ['以上都没有'] },
    { id: 'sym_respiratory', selected: ['短气（气不够用）'] },
    { id: 'sym_other', selected: ['疲乏无力'] }
  ],
  [
    { id: 'sign_temp', selected: ['正常（36–37.2℃）'] },
    { id: 'sign_bp', selected: ['正常（约 120/80）'] },
    { id: 'sign_pulse', selected: ['偏慢（60 次以下）'] },
    { id: 'tongue', selected: ['舌淡白'] },
    { id: 'pulse', selected: ['沉', '微/弱'] },
    { id: 'notes', selected: ['没有补充'] }
  ],
  [
    { id: 'sym_zz_qi_blood', selected: ['胸中大气下陷（气短不足以息）', '努力呼吸/呼吸费力'] },
    { id: 'sym_zz_women', selected: ['以上都没有'] },
    { id: 'sym_zz_mind', selected: ['以上都没有'] },
    { id: 'sym_zz_fluid', selected: ['以上都没有'] },
    { id: 'sym_zz_chest', selected: ['以上都没有'] },
    { id: 'sym_zz_skin_other', selected: ['以上都没有'] }
  ],
  [{ id: 'choose_formula', selected: [] }],
  [{ id: 'confirm_prescribe', selected: ['确认开方'] }]
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

const line = (title) => console.log(`\n${'═'.repeat(72)}\n${title}\n${'═'.repeat(72)}`)
async function call(name, args) {
  const definition = registered.get(name)
  const value = await definition.execute(args, { callId: `${name}-1`, signal: new AbortController().signal })
  const text = definition.output.render(args, value).map((block) => block.text).join('\n')
  return { value, text }
}

line('① 问诊 · 一般资料与主诉（气短、吸气费劲）')
const intake = await call('zhongzhong_consult', { stage: 'intake' })
console.log(intake.text.split('### 当前病历')[0].trim())

line('② 主症（上）')
const s1 = await call('zhongzhong_consult', { stage: 'symptoms', case: intake.value.case })
console.log(s1.text.split('### 当前病历')[0].trim())

line('③ 主症（下）')
const s2 = await call('zhongzhong_consult', { stage: 'symptoms2', case: s1.value.case })
console.log(s2.text.split('### 当前病历')[0].trim())

line('④ 客观指标与舌脉')
const signs = await call('zhongzhong_consult', { stage: 'signs', case: s2.value.case })
console.log(signs.text.split('### 当前病历')[0].trim())

line('⑤ 衷中参西特征症（气机与出血：大气下陷 + 努力呼吸）')
const special = await call('zhongzhong_consult', { stage: 'special', case: signs.value.case })
console.log(special.text.split('### 当前病历')[0].trim())

line('⑥ 辨证：经方、张锡纯方、单方同台排序')
const diff = await call('zhongzhong_differentiate', { case: special.value.case })
console.log(diff.text.split('### 病历')[0].trim())

line('⑦ 文献核查（衷中参西录原文）')
const evidence = await call('zhongzhong_evidence', { case: diff.value.case, formula: diff.value.chosen.name, online: false })
console.log(evidence.text)

line('⑧ 开方：确认后生成清制处方笺')
const prescribe = await call('zhongzhong_prescribe', { case: diff.value.case, formula: diff.value.chosen.name, online: false })
console.log(prescribe.text)

console.log('\n演示结束。张锡纯方按清制 1 两 = 30 克、1 钱 = 3 克折算；仅供学习参考，不能替代面诊。')
