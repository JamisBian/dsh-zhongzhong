// 问诊问题库：5 阶段，全部以「选项列表」形式提问，仅姓名/体温/血压/脉搏保留自由填写。
// 第 5 阶段 special 是《医学衷中参西录》特征症，按主诉选问。

import { SYMPTOMS, TONGUE, PULSE, byCategory, resolveId, resolveIds, resolveIdsInText } from './data/symptoms.js'
import { mergeCase } from './engine/case.js'

const NONE = '以上都没有'

/** 单阶段的最大问题数（避免一次卡片过长）。 */
export const STAGES = ['intake', 'symptoms', 'symptoms2', 'signs', 'special']

/** 年龄分段 → 代表年龄（仅在未填具体年龄时用于风险判断）。 */
const AGE_BANDS = [
  { label: '18岁以下', age: 12 },
  { label: '18–30岁', age: 24 },
  { label: '31–45岁', age: 38 },
  { label: '46–60岁', age: 52 },
  { label: '61岁以上', age: 68 }
]

const DURATIONS = ['1天以内', '2–3天', '4–7天', '1–4周', '1–6个月', '半年以上']

const CHIEFS = [
  '感冒发热、咳嗽咽痛',
  '胃肠不适（胃胀、胃痛、腹泻、便秘）',
  '头晕、头痛',
  '失眠、心烦、情绪低落',
  '胸胁不舒、心悸',
  '关节疼痛、肢体麻木',
  '妇科问题（月经、带下、痛经）',
  '水肿、小便不利',
  '其他（请在下方填写）'
]

/** 把分类变成多选问题。 */
function symptomQuestion(cat, id, extra = {}) {
  const items = byCategory(cat)
  return {
    id,
    header: extra.header ?? categoryLabel(cat),
    question: extra.question ?? `是否有以下「${categoryLabel(cat)}」方面的情况？（可多选）`,
    options: items.map((s) => ({ label: s.label })),
    multi_select: true
  }
}

const CAT_LABELS = {
  cold_heat: '寒热',
  sweat: '汗出',
  head_body: '头身',
  chest_abdomen: '胸腹',
  digestion: '饮食口味',
  stool_urine: '二便',
  sleep_mind: '睡眠情志',
  respiratory: '咳喘咽喉',
  other: '其他'
}

function categoryLabel(cat) {
  return CAT_LABELS[cat] ?? cat
}

/** 第一阶段：一般资料 + 主诉。 */
export function intakeQuestions() {
  return [
    {
      id: 'name',
      header: '称呼',
      question: '请问怎么称呼您？（可直接填写，或选择「不方便留名」）',
      options: [{ label: '不方便留名' }]
    },
    {
      id: 'age',
      header: '年龄',
      question: '您的年龄？可点选年龄段；如需精确，请在下方填写具体岁数。',
      options: AGE_BANDS.map((b) => ({ label: b.label }))
    },
    {
      id: 'sex',
      header: '性别',
      question: '您的性别？',
      options: [{ label: '男' }, { label: '女' }]
    },
    {
      id: 'chief',
      header: '主诉',
      question: '您哪里不舒服？可多选，也可在下框具体描述。',
      options: CHIEFS.map((label) => ({ label })),
      multi_select: true
    },
    {
      id: 'duration',
      header: '病程',
      question: '这次不舒服多久了？',
      options: DURATIONS.map((label) => ({ label }))
    },
    {
      id: 'context',
      header: '特殊情况',
      question: '是否处于以下特殊情况？（影响用药安全，可多选；都没有就选「以上都不是」）',
      options: [
        { label: '妊娠期' },
        { label: '产后6周内' },
        { label: '哺乳期' },
        { label: '月经期' },
        { label: '围绝经期' },
        { label: '术后恢复期' },
        { label: '外伤/疮疡' },
        { label: '年老体弱（70岁以上）' },
        { label: '以上都不是' }
      ],
      multi_select: true
    }
  ]
}

/** 第二阶段（上）：寒热、汗、头身、胸腹、饮食。 */
export function symptomQuestionsA() {
  return [
    symptomQuestion('cold_heat', 'sym_cold_heat'),
    symptomQuestion('sweat', 'sym_sweat'),
    symptomQuestion('head_body', 'sym_head_body'),
    symptomQuestion('chest_abdomen', 'sym_chest_abdomen'),
    symptomQuestion('digestion', 'sym_digestion')
  ]
}

/** 第二阶段（下）：二便、睡眠、咳喘、其他。 */
export function symptomQuestionsB() {
  return [
    symptomQuestion('stool_urine', 'sym_stool_urine'),
    symptomQuestion('sleep_mind', 'sym_sleep_mind'),
    symptomQuestion('respiratory', 'sym_respiratory'),
    symptomQuestion('other', 'sym_other')
  ]
}

/** 第五阶段：《医学衷中参西录》特征症（可按主诉跳过）。 */
export function specialQuestions() {
  const group = (id, header, question, cats) => ({
    id,
    header,
    question,
    options: [...cats.flatMap((cat) => byCategory(cat)).map((s) => ({ label: s.label })), { label: '以上都没有' }],
    multi_select: true
  })
  return [
    group(
      'sym_zz_qi_blood',
      '气机与出血',
      '《衷中参西录》常从「大气/冲气/血证」入手。以下气机、呼吸与出血方面，符合哪些？（可多选；都没有就选「以上都没有」）',
      ['zz_qi', 'zz_blood']
    ),
    group(
      'sym_zz_women',
      '妇科',
      '如果是女性患者，以下妇科情况符合哪些？（男性或无关者选「以上都没有」）',
      ['zz_women']
    ),
    group(
      'sym_zz_mind',
      '神志与中风',
      '以下神志、抽搐、中风与肢体方面，符合哪些？（可多选）',
      ['zz_mind']
    ),
    group(
      'sym_zz_fluid',
      '消渴与淋浊',
      '以下消渴（多饮多尿）、淋浊、癃闭方面，符合哪些？（可多选）',
      ['zz_fluid']
    ),
    group(
      'sym_zz_chest',
      '胸膈与五官',
      '以下胸膈（噎膈/反胃）、咽喉、眼、耳、牙方面，符合哪些？（可多选）',
      ['zz_chest']
    ),
    group(
      'sym_zz_skin_other',
      '疮疡与其他',
      '以下疮疡皮肤与其余特征，符合哪些？（可多选；都没有就选「以上都没有」）',
      ['zz_skin', 'zz_misc']
    )
  ]
}

/** 第三阶段：客观指标 + 舌脉。 */
export function signQuestions() {
  return [
    {
      id: 'sign_temp',
      header: '体温',
      question: '最近测的体温是多少？可点选区间；有具体数值请填在下方（如 36.8）。',
      options: [
        { label: '正常（36–37.2℃）' },
        { label: '低热（37.3–38℃）' },
        { label: '中度发热（38.1–39℃）' },
        { label: '高热（39℃以上）' },
        { label: '没有测量' }
      ]
    },
    {
      id: 'sign_bp',
      header: '血压',
      question: '血压是多少？可填「120/80」这样的数值；没测过请选「没有测量」。',
      options: [
        { label: '正常（约 120/80）' },
        { label: '偏高（≥140/90）' },
        { label: '偏低（≤90/60）' },
        { label: '没有测量' }
      ]
    },
    {
      id: 'sign_pulse',
      header: '脉搏',
      question: '安静时每分钟脉搏多少次？可填数值（如 78）；没测请选「没有测量」。',
      options: [
        { label: '60–90 次/分' },
        { label: '偏快（90 次以上）' },
        { label: '偏慢（60 次以下）' },
        { label: '没有测量' }
      ]
    },
    {
      id: 'tongue',
      header: '舌象',
      question: '对着镜子看看舌头（自然光下、不要刚吃东西），符合哪些？可多选。',
      options: TONGUE.map((t) => ({ label: t.label })),
      multi_select: true
    },
    {
      id: 'pulse',
      header: '脉象',
      question: '脉象（如有中医师诊过脉请选择；自己不会摸脉请选「不清楚，请医生判断」）。可多选。',
      options: [...PULSE.map((p) => ({ label: p.label })), { label: '不清楚，请医生判断' }],
      multi_select: true
    },
    {
      id: 'notes',
      header: '补充',
      question: '还有什么需要说明的？（可多选；有具体情况请填在下方）',
      options: [
        { label: '没有补充' },
        { label: '正在服用西药或中成药' },
        { label: '有高血压、糖尿病等慢性病' },
        { label: '有药物过敏史' },
        { label: '近期做过手术或住过院' },
        { label: '长期熬夜、饮酒或吸烟' },
        { label: '工作需久站、久坐或高强度' }
      ],
      multi_select: true
    }
  ]
}

/**
 * 取某阶段的问题清单。
 * @param {'intake'|'symptoms'|'symptoms2'|'signs'} stage
 */
export function questionsFor(stage) {
  switch (stage) {
    case 'intake':
      return intakeQuestions()
    case 'symptoms':
      return symptomQuestionsA()
    case 'symptoms2':
      return symptomQuestionsB()
    case 'signs':
      return signQuestions()
    case 'special':
      return specialQuestions()
    default:
      throw new Error(`未知问诊阶段：${stage}（可用：${STAGES.join('、')}）`)
  }
}

/** 阶段的中文名。 */
export function stageLabel(stage) {
  return (
    {
      intake: '一般资料与主诉',
      symptoms: '主症（上）',
      symptoms2: '主症（下）',
      signs: '客观指标与舌脉',
      special: '衷中参西特征症'
    }[stage] ?? stage
  )
}

/** 答案中「以上都没有 / 没有测量 / 不清楚」这类占位选项。 */
const PLACEHOLDERS = new Set([NONE, '以上都没有（无此方面不适）', '没有测量', '不清楚，请医生判断', '不方便留名', '其他（请在下方填写）'])

/**
 * 把一批答答案写入病历。
 * @param {object} caseData 现有病历
 * @param {Array<{id:string, selected:string[], custom?:string}>} answers
 * @returns {object} 新病历
 */
export function applyAnswers(caseData, answers) {
  const patch = { patient: {}, vitals: {}, symptoms: [], tongue: [], pulse: [] }
  const textBits = []

  for (const answer of answers) {
    const selected = (answer.selected ?? []).filter((s) => !PLACEHOLDERS.has(s))
    const custom = typeof answer.custom === 'string' ? answer.custom.trim() : ''
    switch (answer.id) {
      case 'name':
        if (custom !== '') patch.patient.name = custom
        else if (selected.length > 0) patch.patient.name = selected[0]
        break
      case 'age': {
        const m = custom.match(/\d{1,3}/)
        if (m !== null) patch.patient.age = Number(m[0])
        else if (selected.length > 0) {
          const band = AGE_BANDS.find((b) => b.label === selected[0])
          if (band !== undefined) {
            patch.patient.ageBand = band.label
            patch.patient.age = band.age
          }
        }
        break
      }
      case 'sex':
        if (selected.length > 0) patch.patient.sex = selected[0]
        break
      case 'chief': {
        const parts = [...selected]
        if (custom !== '') parts.push(custom)
        if (parts.length > 0) patch.chief = parts.join('；')
        break
      }
      case 'duration':
        if (selected.length > 0) patch.duration = selected[0]
        break
      case 'context': {
        const map = {
          妊娠期: 'pregnancy',
          产后6周内: 'postpartum',
          哺乳期: 'lactation',
          月经期: 'menstruation',
          围绝经期: 'menopause',
          术后恢复期: 'surgery',
          '外伤/疮疡': 'injury',
          '年老体弱（70岁以上）': 'elderly'
        }
        patch.context = selected.map((label) => map[label]).filter((key) => key !== undefined)
        break
      }
      case 'sign_temp': {
        if (custom !== '') {
          const value = Number(custom.match(/\d{2}(?:\.\d)?/)?.[0])
          if (Number.isFinite(value)) patch.vitals.tempC = value
        } else if (selected.length > 0) {
          const band = selected[0]
          if (band.includes('正常')) patch.vitals.tempC = 36.6
          else if (band.includes('低热')) patch.vitals.tempC = 37.8
          else if (band.includes('中度')) patch.vitals.tempC = 38.6
          else if (band.includes('高热')) patch.vitals.tempC = 39.5
        }
        break
      }
      case 'sign_bp': {
        if (custom !== '') {
          const m = custom.match(/(\d{2,3})\s*[/／]\s*(\d{2,3})/)
          if (m !== null) {
            patch.vitals.sbp = Number(m[1])
            patch.vitals.dbp = Number(m[2])
          }
        } else if (selected.length > 0) {
          const band = selected[0]
          if (band.includes('正常')) {
            patch.vitals.sbp = 120
            patch.vitals.dbp = 80
          } else if (band.includes('偏高')) {
            patch.vitals.sbp = 145
            patch.vitals.dbp = 95
          } else if (band.includes('偏低')) {
            patch.vitals.sbp = 88
            patch.vitals.dbp = 58
          }
        }
        break
      }
      case 'sign_pulse': {
        if (custom !== '') {
          const value = Number(custom.match(/\d{2,3}/)?.[0])
          if (Number.isFinite(value)) patch.vitals.pulse = value
        } else if (selected.length > 0) {
          const band = selected[0]
          if (band.includes('偏快')) patch.vitals.pulse = 102
          else if (band.includes('偏慢')) patch.vitals.pulse = 55
          else if (band.includes('60–90')) patch.vitals.pulse = 75
        }
        break
      }
      case 'tongue':
        patch.tongue = resolveIds(selected)
        break
      case 'pulse':
        patch.pulse = resolveIds(selected)
        break
      case 'notes': {
        const picked = selected.filter((label) => label !== '没有补充')
        // 过敏史单独存字段：处方笺与用药警示都要显示
        if (picked.includes('有药物过敏史')) patch.allergy = custom !== '' ? custom : '患者自述有药物过敏史（具体不详）'
        const contextual = picked.filter((label) => label !== '有药物过敏史')
        if (contextual.length > 0) textBits.push(contextual.join('；'))
        if (custom !== '') textBits.push(custom)
        break
      }
      default: {
        // 症状多选题：选项标签即症状标签
        const ids = resolveIds(selected)
        for (const id of ids) if (!patch.symptoms.includes(id)) patch.symptoms.push(id)
        if (custom !== '') {
          for (const id of resolveIdsInText(custom)) {
            if (!patch.symptoms.includes(id)) patch.symptoms.push(id)
          }
          textBits.push(custom)
        }
      }
    }
    // 记录问过的选项，避免重复提问
    for (const label of selected) {
      const id = resolveId(label)
      if (id !== undefined) patch.asked = [...(patch.asked ?? []), id]
    }
  }

  if (textBits.length > 0) patch.notes = textBits.join('；')
  return mergeCase(caseData, patch)
}

/** 供工具描述用的阶段清单文本。 */
export function stageGuide() {
  return STAGES.map((stage, i) => `${i + 1}. ${stage}（${stageLabel(stage)}）`).join('\n')
}

export { SYMPTOMS }
