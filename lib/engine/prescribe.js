// 处方笺生成：经方（汉制）与衷中参西录方（清制/单方/外用）统一出口

import { doseText, doseOf, DOSE_SYSTEMS } from './dose.js'
import { herbWarnings } from '../data/index.js'
import { huangNote } from '../data/huang-notes.js'
import { caseSummary } from './case.js'

/** 方剂使用自己的度量衡：经方 doseSystem 缺省 han，张锡纯方 qing。 */
export function systemOf(formula) {
  return formula.doseSystem === 'qing' ? 'qing' : 'han'
}

/**
 * 组成明细。
 * @param {object} formula
 */
export function compositionLines(formula) {
  const basis = formula.doseBasis ?? systemOf(formula)
  const system = systemOf(formula)
  return formula.composition.map((part) => {
    const { ancient, modern } = doseOf(part, system)
    return {
      herb: part.herb,
      ancient,
      // 比例配伍的丸散：折算克数无临床意义，一律留空
      modern: basis === 'ratio' ? '' : modern.replace(/^≈/, ''),
      prep: part.prep ?? '',
      raw: part.raw ?? '',
      text: doseText(part, system)
    }
  })
}

/** 三档剂量的说明文案。 */
export const DOSE_BASIS = {
  han: {
    label: '汉制原量',
    conversion: () => '原方剂量按 1 两 = 3 克折算；枚/升/合等按汉制估值，仅供临床参考。'
  },
  qing: {
    label: '张氏原量（清制）',
    conversion: () =>
      '张锡纯原方按清制折算：1 两 = 30 克、1 钱 = 3 克、1 分 = 0.3 克。张氏用量偏重，须由医师按体质、年龄与病情调整，不可照搬。'
  },
  modern: {
    label: '经验剂量',
    conversion: () =>
      '本方宋校剂量（钱/分）或折算值与临床不符，组成按现代经验剂量列出；仍需由医师按证加减。'
  },
  ratio: {
    label: '原方比例',
    conversion: () =>
      '本方为等分/比例配伍的丸散，折算克数没有临床意义；请按原方比例或医师经验剂量使用。'
  }
}

/**
 * 生成处方笺。
 * @param {object} caseData
 * @param {object} formula
 * @param {{modifications?:string[], notes?:string, evidence?:object}} [options]
 */
export function buildSheet(caseData, formula, options = {}) {
  const composition = compositionLines(formula)
  const additions = (options.modifications ?? []).filter((m) => typeof m === 'string' && m.trim() !== '')
  const capNotes = Object.entries(formula.doseCap ?? {}).map(
    ([herb, max]) => `本方原方 ${herb} 用量偏大，现代临床建议不超过 ${max}g，须由医师按体质调整。`
  )
  const schoolNotes = []
  if (formula.school === 'shifang') {
    schoolNotes.push('本方为后世方/经验方，依据为黄煌《经方使用手册》的方证与临床经验，非仲景原文；请结合辨证使用。')
  }
  if (formula.combined === true) {
    schoolNotes.push('本方为两首方合成的合方，药味与总量偏大，须由医师按体质酌减；不是仲景原方，也不是张锡纯原方。')
  } else if (formula.school === 'zhongzhong') {
    schoolNotes.push(
      formula.bencao === true
        ? '本方为《医学衷中参西录》药物篇的单方（单味药），依据为张锡纯原书的主治与用法，非仲景原文；单味药同样需要辨证与定量。'
        : formula.kind === 'danfang'
          ? '本方为《医学衷中参西录》医方篇的单味方，依据为原书主治，非仲景原文；单味药同样需要辨证与定量。'
          : '本方出自张锡纯《医学衷中参西录》，为张氏自拟方，依据为原书主治与方论，非仲景原文；剂量按清制折算，须由医师调整。'
    )
  }
  const external = formula.route === 'external' || formula.doseBasis === 'external'
  const routeNotes = external
    ? ['本方为外用/外治方，不可内服；皮肤过敏、破损处慎用，出现刺激立即停用。']
    : []
  const allergyNote =
    caseData.allergy === '' ? [] : [`患者自述药物过敏史：${caseData.allergy}。开方前须逐味核对，必要时做过敏试验。`]
  const warnings = [...allergyNote, ...schoolNotes, ...routeNotes, ...capNotes, ...herbWarnings(formula), ...(formula.safety ?? [])]
  const system = systemOf(formula)
  const basis = formula.doseBasis === undefined ? system : formula.doseBasis
  const huang = huangNote(formula.id)
  const advice = external
    ? [
        '按原书用法外用（敷、洗、点、熨等），不可内服',
        '使用前先在健康皮肤小面积试用，出现红肿刺痛立即停用',
        '3–5 天后复诊；疮面扩大、发热或疼痛加重须及时就医'
      ]
    : formula.kind === 'danfang'
      ? [
          '单味药，剂量须由医师按体质、年龄与病情确定，不可自行加量',
          '每日一剂，水煎分二次温服（原书另有用法者从其法）',
          '服药 3 剂后复诊；症状加重或出现新不适立即停药并就医'
        ]
      : [
          '每日一剂，水煎分二次温服（或遵煎服法）',
          '服药期间忌生冷、油腻、辛辣，注意保暖',
          '服药 3 剂后复诊，若症状加重或出现新不适立即停药并就医'
        ]
  const sheet = {
    title: external ? `${formula.name} 外用方` : `${formula.name} 处方笺`,
    formula: {
      id: formula.id,
      name: formula.name,
      source: formula.source,
      six: formula.six,
      school: formula.school ?? 'jingfang',
      kind: formula.kind ?? 'formula',
      route: external ? 'external' : 'internal'
    },
    patient: caseData.patient,
    summary: caseSummary(caseData),
    pattern: formula.pattern,
    composition,
    additions,
    decoction: formula.decoction,
    doseBasis: basis,
    doseBasisLabel: (DOSE_BASIS[basis] ?? DOSE_BASIS[system] ?? DOSE_BASIS.han).label,
    conversion: (DOSE_BASIS[basis] ?? DOSE_BASIS[system] ?? DOSE_BASIS.han).conversion(),
    system,
    advice,
    warnings: [...new Set(warnings)],
    ...(huang?.modifications === undefined ? {} : { modificationsReference: huang.modifications }),
    ...(huang?.constitution === undefined ? {} : { constitutionReference: clip(huang.constitution, 160) }),
    notes: options.notes ?? '',
    disclaimer: external
      ? '本方为外治方，由 AI 依据《医学衷中参西录》原文整理，仅供中医师参考，不能替代面诊与执业医师处方。外用药同样可能过敏或刺激，须在医师指导下使用。'
      : '本处方由 AI 依据《伤寒论》《金匮要略》方证对应原则与《医学衷中参西录》原方整理，仅供中医师参考，不能替代面诊与执业医师处方。孕妇、儿童、老人及慢性病用药者须由医师面诊后调整。'
  }
  sheet.markdown = sheetText(sheet)
  return sheet
}

/** 截断长文本，避免卡片过长。 */
function clip(text, max) {
  return text.length <= max ? text : `${text.slice(0, max)}…`
}

/**
 * 处方笺 Markdown。
 * @param {ReturnType<typeof buildSheet>} sheet
 */
export function sheetText(sheet) {
  const lines = []
  lines.push(`# ${sheet.title}`)
  lines.push(`**出处**：${sheet.formula.source}　**归类**：${sheet.formula.six}`)
  lines.push('')
  lines.push('## 病历摘要')
  lines.push(sheet.summary.split('\n').map((l) => `> ${l}`).join('\n'))
  lines.push('')
  lines.push('## 辨证要点')
  lines.push(sheet.pattern.map((p) => `- ${p}`).join('\n'))
  lines.push('')
  lines.push('## 处方')
  const header =
    sheet.doseBasis === 'han'
      ? '| 药物 | 原方用量 | 折算(1两=3g) | 炮制 |'
      : sheet.doseBasis === 'qing'
        ? '| 药物 | 原方用量 | 折算(1两=30g) | 炮制 |'
        : '| 药物 | 用量 | 折算 | 炮制 |'
  lines.push(header)
  lines.push('| --- | --- | --- | --- |')
  for (const part of sheet.composition) {
    lines.push(`| ${part.herb} | ${part.ancient === '' ? '—' : part.ancient} | ${part.modern === '' ? '—' : part.modern} | ${part.prep === '' ? '—' : part.prep} |`)
  }
  if (sheet.additions.length > 0) {
    lines.push('')
    lines.push(`**加减**：${sheet.additions.join('；')}`)
  }
  lines.push('')
  lines.push(`> **${sheet.doseBasisLabel}**：${sheet.conversion}`)
  lines.push('')
  lines.push(sheet.formula.route === 'external' ? '## 用法（外用）' : '## 煎服法')
  lines.push(sheet.decoction)
  lines.push('')
  lines.push('## 医嘱')
  lines.push(sheet.advice.map((a) => `- ${a}`).join('\n'))
  if (sheet.warnings.length > 0) {
    lines.push('')
    lines.push('## 用药警示')
    lines.push(sheet.warnings.map((w) => `- ⚠️ ${w}`).join('\n'))
  }
  if (sheet.modificationsReference !== undefined) {
    lines.push('')
    lines.push('## 随证加减（参考）')
    lines.push(sheet.modificationsReference)
  }
  if (sheet.notes !== '') {
    lines.push('')
    lines.push('## 备注')
    lines.push(sheet.notes)
  }
  lines.push('')
  lines.push(`---\n${sheet.disclaimer}`)
  return lines.join('\n')
}
