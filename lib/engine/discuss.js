// 医患沟通引擎：面对患者质疑时「守正」的判定与应答稿
//
// 原则（用户设定）：
//   1. 结论是严密分析出来的，就要站得住脚 —— 不跟着患者跑。
//   2. 但对方提供了新的病情信息、或指出真正的禁忌，就必须修正，并明确认错。
//   3. 反驳要给依据（方证要点 + 原文 + 现代文献），并追问对方的依据。
//   4. 说不出依据的结论，不许说。

import { labelOf, resolveIdsInText } from '../data/symptoms.js'
import { caseSummary, mergeCase } from './case.js'

/** 药物-基础病风险表（用于「患者一提就自查」）。 */
export const RISK_HERBS = {
  pregnancy: {
    label: '妊娠/备孕',
    keywords: ['怀孕', '妊娠', '孕妇', '有喜', '备孕', '哺乳'],
    herbs: ['桃仁', '大黄', '朴硝', '芒硝', '水蛭', '虻虫', '附子', '半夏', '吴茱萸', '牡丹皮', '桂枝', '当归', '川芎', '细辛', '代赭石', '甘遂', '大戟', '芫花', '商陆', '马钱子', '三棱', '莪术', '红花', '麝香', '穿山甲', '牛膝', '益母草', '乳香', '没药', '铅', '轻粉', '朱砂', '硫黄', '鸦胆子', '罂粟壳', '藤黄', '皂荚', '常山', '胆矾', '全蝎', '蜈蚣'],
    advice: '妊娠期用药需由产科与中医师共同评估，活血、峻下、有毒药一律不用或极慎用。'
  },
  hypertension: {
    label: '高血压',
    keywords: ['高血压', '血压高', '血压偏高'],
    herbs: ['麻黄', '附子', '甘草', '桂枝', '细辛', '黄芪', '人参', '党参'],
    advice: '麻黄升压、甘草可致水钠潴留，高血压者需减量或改用他方，并监测血压。'
  },
  heart: {
    label: '心脏疾病',
    keywords: ['心脏病', '冠心病', '心律不齐', '心律不整', '心衰', '心功能'],
    herbs: ['麻黄', '附子', '细辛', '蟾酥', '洋金花'],
    advice: '麻黄碱可致心悸、升压，心脏病者慎用；附子需严格炮制与先煎。'
  },
  diabetes: {
    label: '糖尿病',
    keywords: ['糖尿病', '血糖高', '血糖偏高'],
    herbs: ['甘草', '大枣', '饴糖', '胶饴', '蜂蜜', '糖', '粳米', '龙眼肉', '熟地黄'],
    advice: '含糖辅料与甘草需计入，糖尿病患者应减量并监测血糖。'
  },
  bleeding: {
    label: '出血倾向/抗凝',
    keywords: ['出血', '凝血', '抗凝', '阿司匹林', '华法林', '氯吡格雷', '月经量多', '血小板'],
    herbs: ['桃仁', '大黄', '水蛭', '虻虫', '牡丹皮', '当归', '川芎', '桂枝', '三棱', '莪术', '红花', '乳香', '没药', '三七', '蒲黄', '五灵脂', '益母草', '牛膝', '麝香', '穿山甲'],
    advice: '活血药与抗凝药叠加有出血风险，需评估后使用。'
  },
  kidney: {
    label: '肾功能不全',
    keywords: ['肾衰', '肾功能', '肌酐高', '透析'],
    herbs: ['关木通', '防己', '细辛', '附子', '朱砂', '轻粉', '铅', '雄黄', '马钱子'],
    advice: '肾功能不全者需调整剂量与煎法，避免含马兜铃酸药材。'
  }
}

/**
 * 从患者原话里识别基础病/特殊情况。
 * @param {string} text
 * @returns {{key:string,label:string,keyword:string}[]}
 */
export function detectConcerns(text) {
  if (typeof text !== 'string' || text.trim() === '') return []
  const out = []
  for (const [key, spec] of Object.entries(RISK_HERBS)) {
    const keyword = spec.keywords.find((k) => text.includes(k))
    if (keyword !== undefined) out.push({ key, label: spec.label, keyword })
  }
  return out
}

/**
 * 方剂与患者情况的冲突。
 * @param {object} formula
 * @param {ReturnType<typeof detectConcerns>} concerns
 */
export function findConflicts(formula, concerns) {
  const out = []
  for (const concern of concerns) {
    const spec = RISK_HERBS[concern.key]
    const hit = formula.composition.map((p) => p.herb).filter((herb) => spec.herbs.includes(herb))
    if (hit.length > 0) {
      out.push({ concern: concern.label, herbs: hit, advice: spec.advice })
    }
  }
  return out
}

/**
 * 患者话里提到、但病历里还没有的症状。
 * @param {string} text
 * @param {object} caseData
 */
export function newSymptomsFrom(text, caseData) {
  if (typeof text !== 'string') return []
  const known = new Set([...caseData.symptoms, ...caseData.tongue, ...caseData.pulse])
  return resolveIdsInText(text).filter((id) => !known.has(id))
}

/** 依据来源选项。 */
export function sourceQuestion() {
  return {
    id: 'objection_source',
    header: '您的依据',
    question: '想请您说说：这个看法主要来自哪里？（可多选，我好判断怎么跟您解释；都没有就选「以上都没有」）',
    options: [
      { label: '网上/短视频看到的说法' },
      { label: '别的医生或朋友建议' },
      { label: '我自己对照症状查的' },
      { label: '以前吃过类似的方，没效' },
      { label: '我看了书上的条文' },
      { label: '其他（请填写）' },
      { label: '以上都没有' }
    ],
    multi_select: true
  }
}

/** 担心点选项。 */
export function concernQuestion() {
  return {
    id: 'objection_concern',
    header: '您的担心',
    question: '您最担心的是哪一点？（可多选；没有特别担心就选「以上都没有」）',
    options: [
      { label: '方子不对我的证' },
      { label: '药性太猛/有毒副作用' },
      { label: '想再用别的方法确认一下' },
      { label: '价格或煎药太麻烦' },
      { label: '其他（请填写）' },
      { label: '以上都没有' }
    ],
    multi_select: true
  }
}

/**
 * 生成应答稿。
 * @param {object} input
 */
export function buildDefense(input) {
  const { caseData, formula, stance, reason, report, conflicts, newFindings, patientReason, alternative } = input
  const lines = []

  if (stance === 'revise') {
    lines.push(`## 这一点需要修正：${formula.name}${alternative === undefined ? '' : ` → ${alternative.name}`}`)
    lines.push('')
    lines.push(`**我承认**：${reason}`)
    lines.push('')
    if (alternative !== undefined) {
      lines.push(`修正后的判断：**${alternative.name}**（${alternative.six}，匹配度 ${Math.round(alternative.score * 100)}%）`)
      lines.push(`依据：${alternative.formula.pattern.slice(0, 5).join('、')}`)
      if (alternative.formula.clauses.length > 0) {
        lines.push(`原文：${alternative.formula.clauses[0].ref}「${alternative.formula.clauses[0].text}」`)
      }
      lines.push('')
      lines.push('下一步：重新核查文献后开方。')
    } else {
      lines.push('目前没有更合适的替代方，建议先补充问诊信息（尤其是寒热、二便、舌脉），或线下就诊。')
    }
    return lines.join('\n')
  }

  lines.push(`## 我的判断不变：${formula.name}`)
  lines.push('')
  lines.push(`**为什么**：${reason}`)
  lines.push('')
  lines.push('### 一、您身上的方证要点')
  const matched = (report?.classic ?? []).flatMap((hit) => hit.matched.map((m) => m.label))
  const unique = [...new Set(matched)]
  lines.push(unique.length > 0 ? unique.map((m) => `- ${m}`).join('\n') : '- （本轮未提取到明确的对应要点）')
  lines.push('')
  lines.push('### 二、原文依据')
  if ((report?.classic ?? []).length > 0) {
    for (const hit of report.classic) lines.push(`- ${hit.ref}：「${hit.text}」`)
  } else {
    lines.push('- 本次未检索到直接对应条文（这一点必须如实告知，不能含糊）')
  }
  lines.push('')
  lines.push('### 三、现代文献（中文期刊）')
  if (report?.modern?.status === 'ok' && report.modern.hits.length > 0) {
    for (const hit of report.modern.hits.slice(0, 3)) {
      const meta = [hit.journal, hit.year].filter((part) => part !== '' && part !== undefined && part !== null).join(', ')
      const link = hit.doi !== '' ? ` DOI ${hit.doi}（https://doi.org/${hit.doi}）` : hit.url !== '' ? ` ${hit.url}` : ''
      lines.push(`- ${hit.title}${meta === '' ? '' : `（${meta}）`}${link}`)
    }
  } else {
    lines.push(`- ${report?.modern?.note ?? '本次未检索中文文献'}`)
  }
  if (report?.highMatch?.eligible === true) {
    lines.push(
      `- 开方门槛：本方为当前排序第一（${Math.round(report.highMatch.score * 100)}%，>70%），按「高匹配度例外」开方；这不是文献支持，处方笺已标注。`
    )
  }
  if (conflicts.length > 0) {
    lines.push('')
    lines.push('### 四、您提到的情况我已核对')
    for (const conflict of conflicts) {
      lines.push(`- ${conflict.concern}：方中 ${conflict.herbs.join('、')} 需要特别处理。${conflict.advice}`)
    }
    lines.push('- 处理办法：减量/换药/加强监测，或改用不含该药的方。**这一点我不会含糊过去。**')
  }
  if (newFindings.length > 0) {
    lines.push('')
    lines.push(`### 补充信息已并入辨证\n- 新增见症：${newFindings.map(labelOf).join('、')}（已重新计算，结论未变）`)
  }
  if (patientReason !== undefined && (patientReason.sources.length > 0 || patientReason.concerns.length > 0)) {
    lines.push('')
    lines.push('### 我理解您的顾虑')
    if (patientReason.sources.length > 0) lines.push(`- 您的说法来自：${patientReason.sources.join('、')}`)
    if (patientReason.concerns.length > 0) lines.push(`- 您担心：${patientReason.concerns.join('、')}`)
    lines.push(...tailor(patientReason, formula))
  }
  lines.push('')
  lines.push('### 什么情况下我会改方')
  lines.push('- 出现新的、与方证相反的见症（如由无汗转为大汗、脉由浮紧转为微弱）')
  lines.push('- 服药 1–2 剂后症状加重或出现新不适')
  lines.push('- 您拿出的文献/病历能证明病机与我的判断不同（我会逐条核对，不盲从也不回避）')
  lines.push('')
  lines.push('---')
  lines.push('以上依据都可复核：原文见《伤寒论》《金匮要略》相应篇目，现代文献可按 DOI 在期刊官网或知网检索。您如果还有疑问，我们继续对证据，不对态度。')
  return lines.join('\n')
}

/** 按患者的担心点补充解释。 */
function tailor(reason, formula) {
  const out = []
  for (const concern of reason.concerns) {
    if (concern.includes('有毒') || concern.includes('太猛')) {
      out.push(`- 关于药性：${formula.name} 的用量按 1 两 = 3 克折算，并附煎法（含先煎/久煎要求）与禁忌；出现口麻、心悸立即停药。`)
    } else if (concern.includes('不对')) {
      out.push('- 关于对不对证：判断依据是「方证对应」——不是按病名，而是按您身上的这组见症与原文描述是否吻合。')
    } else if (concern.includes('确认')) {
      out.push('- 关于再确认：可以先不服药，观察 1–2 天；或把这份依据拿给线下中医师复核，我把条文和 DOI 都列出来了。')
    } else if (concern.includes('麻烦') || concern.includes('价格')) {
      out.push('- 关于煎服：可代煎，但含附子/细辛的方必须自己先煎，代煎无法保证煎煮时间。')
    }
  }
  return out
}

/** 一句话结论标签。 */
export function stanceLabel(stance) {
  return { maintain: '维持原判', revise: '修正判断', ask: '需要追问' }[stance] ?? stance
}

