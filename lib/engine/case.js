// 病历模型：归一化、合并、危险信号（红旗）识别

import { resolveId, resolveIds, labelOf } from '../data/symptoms.js'

/** 空病历。 */
export function emptyCase() {
  return {
    patient: { name: '', age: null, ageBand: '', sex: '' },
    chief: '',
    duration: '',
    vitals: { tempC: null, sbp: null, dbp: null, pulse: null },
    symptoms: [],
    tongue: [],
    pulse: [],
    notes: '',
    allergy: '',
    context: [],
    asked: []
  }
}

/** 数字化：容忍 "36.8℃"、"120/80"、"78次/分"。 */
function num(value) {
  if (typeof value === 'number' && Number.isFinite(value)) return value
  if (typeof value !== 'string') return null
  const m = value.replace(/[，,]/g, '').match(/-?\d+(?:\.\d+)?/)
  return m === null ? null : Number(m[0])
}

/** 血压："120/80" → [120, 80]。 */
function bloodPressure(value) {
  if (typeof value === 'object' && value !== null) {
    const sbp = num(value.sbp ?? value.systolic)
    const dbp = num(value.dbp ?? value.diastolic)
    return [sbp, dbp]
  }
  if (typeof value === 'string') {
    const m = value.match(/(\d{2,3})\s*[/／]\s*(\d{2,3})/)
    if (m !== null) return [Number(m[1]), Number(m[2])]
    return [num(value), null]
  }
  return [null, null]
}

/**
 * 把模型/外部给的松散对象归一化成病历。
 * 症状与舌脉接受 id、label、别名或自由文本（可识别为选项的才收）。
 * @param {unknown} raw
 * @returns {object} 病历
 */
export function normalizeCase(raw) {
  const base = emptyCase()
  if (raw === null || typeof raw !== 'object') return base
  const src = /** @type {Record<string, any>} */ (raw)

  const patient = src.patient ?? {}
  base.patient.name = typeof patient.name === 'string' ? patient.name : typeof src.name === 'string' ? src.name : ''
  base.patient.age = num(patient.age ?? src.age)
  base.patient.ageBand = typeof patient.ageBand === 'string' ? patient.ageBand : typeof src.ageBand === 'string' ? src.ageBand : ''
  base.patient.sex = typeof patient.sex === 'string' ? patient.sex : typeof src.sex === 'string' ? src.sex : ''

  base.chief = typeof src.chief === 'string' ? src.chief : ''
  base.duration = typeof src.duration === 'string' ? src.duration : ''
  base.notes = typeof src.notes === 'string' ? src.notes : ''
  base.allergy = typeof src.allergy === 'string' ? src.allergy : ''

  base.symptoms = resolveIds(src.symptoms)
  base.tongue = resolveIds(src.tongue)
  base.pulse = resolveIds(src.pulse)
  base.asked = resolveIds(src.asked)
  base.context = Array.isArray(src.context) ? src.context.filter((c) => typeof c === 'string') : []

  const vitals = src.vitals ?? {}
  base.vitals.tempC = num(vitals.tempC ?? vitals.temperature ?? src.temperature ?? src.tempC)
  const [sbp, dbp] = bloodPressure(vitals.bp ?? vitals.bloodPressure ?? vitals.pressure ?? src.bp ?? src.bloodPressure)
  base.vitals.sbp = vitals.sbp === undefined ? sbp : num(vitals.sbp)
  base.vitals.dbp = vitals.dbp === undefined ? dbp : num(vitals.dbp)
  base.vitals.pulse = num(vitals.pulse ?? vitals.heartRate ?? src.pulseRate ?? src.pulse_rate)
  return base
}

/** 合并补丁：数组取并集，标量覆盖（空值不覆盖）。 */
export function mergeCase(current, patch) {
  const next = normalizeCase(current)
  const add = normalizeCase(patch)
  if (add.patient.name !== '') next.patient.name = add.patient.name
  if (add.patient.age !== null) next.patient.age = add.patient.age
  if (add.patient.ageBand !== '') next.patient.ageBand = add.patient.ageBand
  if (add.patient.sex !== '') next.patient.sex = add.patient.sex
  if (add.chief !== '') next.chief = add.chief
  if (add.duration !== '') next.duration = add.duration
  if (add.notes !== '') next.notes = add.notes
  if (add.allergy !== '') next.allergy = add.allergy
  for (const key of ['tempC', 'sbp', 'dbp', 'pulse']) {
    if (add.vitals[key] !== null) next.vitals[key] = add.vitals[key]
  }
  for (const key of ['symptoms', 'tongue', 'pulse', 'asked', 'context']) {
    for (const id of add[key]) if (!next[key].includes(id)) next[key].push(id)
  }
  return next
}

/** 把一批选项 id 记入「已问过」。 */
export function markAsked(caseData, ids) {
  for (const id of ids) if (!caseData.asked.includes(id)) caseData.asked.push(id)
  return caseData
}

/** 病历中的所有阳性条目（主症 + 舌 + 脉）。 */
export function positives(caseData) {
  return [...caseData.symptoms, ...caseData.tongue, ...caseData.pulse]
}

/** 特殊情况（妊娠/产后等）的中文名。 */
export const CONTEXT_LABELS = {
  pregnancy: '妊娠期',
  postpartum: '产后6周内',
  lactation: '哺乳期',
  menstruation: '月经期',
  menopause: '围绝经期',
  surgery: '术后恢复期',
  injury: '外伤/疮疡',
  elderly: '年老体弱'
}

export function contextLabel(key) {
  return CONTEXT_LABELS[key] ?? key
}

/** 一句话病历摘要（给模型和处方笺用）。 */
export function caseSummary(caseData) {
  const { patient, vitals } = caseData
  const ageText = patient.age !== null ? `${patient.age}岁` : patient.ageBand
  const who = [patient.name === '' ? '未留名' : patient.name, patient.sex === '' ? '' : patient.sex, ageText]
    .filter((s) => s !== '')
    .join('，')
  const vital = []
  if (vitals.tempC !== null) vital.push(`体温 ${vitals.tempC}℃`)
  if (vitals.sbp !== null || vitals.dbp !== null) vital.push(`血压 ${vitals.sbp ?? '?'}/${vitals.dbp ?? '?'} mmHg`)
  if (vitals.pulse !== null) vital.push(`脉搏 ${vitals.pulse} 次/分`)
  const main = caseData.symptoms.map(labelOf).join('、')
  const tongue = caseData.tongue.map(labelOf).join('、')
  const pulse = caseData.pulse.map(labelOf).join('、')
  return [
    `患者：${who}`,
    `主诉：${caseData.chief === '' ? '未填写' : caseData.chief}${caseData.duration === '' ? '' : `（病程 ${caseData.duration}）`}`,
    vital.length > 0 ? `客观指标：${vital.join('；')}` : '',
    caseData.context.length === 0 ? '' : `特殊情况：${caseData.context.map(contextLabel).join('、')}`,
    caseData.allergy === '' ? '' : `⚠️ 药物过敏史：${caseData.allergy}`,
    main === '' ? '' : `症状：${main}`,
    tongue === '' ? '' : `舌象：${tongue}`,
    pulse === '' ? '' : `脉象：${pulse}`
  ]
    .filter((s) => s !== '')
    .join('\n')
}

/**
 * 危险信号（红旗）识别。命中即不建议自行服药，应就医／急诊。
 * @returns {{level:'emergency'|'caution'|'ok', reasons:string[]}}
 */
export function redFlags(caseData) {
  const reasons = []
  const { vitals, patient } = caseData
  const has = (id) => caseData.symptoms.includes(id)

  if (vitals.tempC !== null && vitals.tempC >= 40) reasons.push(`体温 ${vitals.tempC}℃ 属高热`)
  if (vitals.tempC !== null && vitals.tempC >= 39 && (patient.age !== null && (patient.age < 3 || patient.age > 75))) {
    reasons.push('高龄或幼儿高热')
  }
  if (vitals.sbp !== null && vitals.sbp >= 180) reasons.push(`收缩压 ${vitals.sbp} mmHg 明显升高`)
  if (vitals.dbp !== null && vitals.dbp >= 110) reasons.push(`舒张压 ${vitals.dbp} mmHg 明显升高`)
  if (vitals.sbp !== null && vitals.sbp <= 85) reasons.push(`收缩压 ${vitals.sbp} mmHg 偏低，警惕休克`)
  if (vitals.pulse !== null && vitals.pulse >= 130) reasons.push(`脉搏 ${vitals.pulse} 次/分 明显增快`)
  if (vitals.pulse !== null && vitals.pulse <= 45) reasons.push(`脉搏 ${vitals.pulse} 次/分 明显减慢`)

  if (has('delirium') && vitals.tempC !== null && vitals.tempC >= 39) reasons.push('高热伴神昏谵语')
  if (has('chest_pain') && (has('profuse_sweat') || has('wheezing'))) reasons.push('胸痛伴大汗或喘促，需排除心梗')
  if (has('rigidity') && has('abdominal_pain') && vitals.tempC !== null && vitals.tempC >= 38.5) {
    reasons.push('腹痛拒按伴发热，需排除急腹症')
  }
  if (has('bleeding') && has('dizziness')) reasons.push('出血伴头晕，警惕失血')
  if ((has('metrorrhagia') || has('hematemesis') || has('hematochezia')) && (has('dizziness') || has('breath_faint') || has('fatigue'))) {
    reasons.push('大量出血伴头晕/气弱，警惕失血')
  }
  if (has('hemoptysis') && (has('breath_faint') || has('orthopnea'))) reasons.push('咳血伴气促，需排除大咯血')
  if (has('stroke') && (has('delirium') || has('aphasia'))) reasons.push('中风伴神志/言语异常')
  if (has('convulsion')) reasons.push('抽搐发作')
  if (has('cholera') && (has('breath_faint') || has('cold_limbs'))) reasons.push('霍乱吐泻伴气弱肢冷，警惕脱水休克')
  if (has('urinary_retention') && has('abdominal_pain')) reasons.push('小便不通伴腹痛，需排除急性尿潴留')
  if (
    caseData.context.includes('pregnancy') &&
    (has('bleeding') || has('metrorrhagia') || has('abdominal_pain') || (vitals.tempC !== null && vitals.tempC >= 38.5))
  ) {
    reasons.push('妊娠期伴出血/腹痛/发热，需产科与中医师共同评估')
  }
  if (patient.age !== null && patient.age < 3 && (has('fever') || has('cough') || has('diarrhea') || has('vomiting'))) {
    reasons.push('3 岁以下幼儿出现急性症状，需儿科评估')
  }
  if (has('delirium')) reasons.push('神志异常')

  if (reasons.length === 0) return { level: 'ok', reasons }

  const severe =
    reasons.some((r) => /高热|休克|心梗|急腹症|失血|神志|妊娠|幼儿/.test(r)) ||
    (vitals.tempC !== null && vitals.tempC >= 40) ||
    (vitals.sbp !== null && vitals.sbp <= 85)
  return { level: severe ? 'emergency' : 'caution', reasons }
}

/** 是否填够了可以开始辨证的最小信息。 */
export function readiness(caseData) {
  const missing = []
  if (caseData.chief === '') missing.push('主诉')
  if (caseData.symptoms.length === 0) missing.push('症状')
  if (caseData.pulse.length === 0) missing.push('脉象')
  if (caseData.tongue.length === 0) missing.push('舌象')
  return { ready: missing.length === 0, missing }
}
