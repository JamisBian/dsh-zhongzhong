// 方证匹配引擎 + 置信度门槛
//
// 设计原则：宁可多问，不可早断。
// 候选方剂的分差不够、主症未命中、或信息缺失时，引擎拒绝进入「选方」阶段，
// 只输出下一轮「鉴别问题」，由 call 方继续向患者提问。

import { FORMULAS } from '../data/index.js'
import { labelOf, item } from '../data/symptoms.js'

/** 判定阈值。 */
export const TUNING = {
  /** 进入候选的最低匹配度。 */
  minScore: 0.6,
  /** 首选与次选的最小分差。 */
  minMargin: 0.08,
  /** 达到此匹配度时，分差要求减半（方证特征高度吻合）。 */
  highScore: 0.72,
  /** 参与比对的候选数。 */
  shortlist: 5,
  /** 一轮最多问几个鉴别点。 */
  maxDiscriminators: 8,
  /** 主症权重下限（w≥3 视为主症）。 */
  keyWeight: 3,
  /** 单方/单味药的先验降权：能治同一组症时，优先成方。 */
  danfangPenalty: 0.02,
  /** 药物篇单味药的先验降权：本草主治宽泛，不能盖过成方。 */
  bencaoPenalty: 0.12
}

const clamp = (n, lo, hi) => Math.min(hi, Math.max(lo, n))

/**
 * 近义症状：患者只报了一个时，另一个按 0.6 权重计入。
 * 恶风/恶寒在问诊里病人常不作区分，但「但恶寒不恶风」与「但恶风」在方证上仍分轻重，
 * 所以只做折扣计入，不当成完全等同。
 */
export const SOFT_EQUIV = {
  aversion_wind: 'aversion_cold',
  aversion_cold: 'aversion_wind'
}
const SOFT_WEIGHT = 0.6

/** 六经特征症：用于给「跨经」的方剂扣分，避免太阳方抢柴胡证。 */
export const CHANNEL_MARKERS = {
  太阳: ['aversion_cold', 'aversion_wind', 'no_sweat', 'pulse_float', 'stiff_neck'],
  阳明: ['thirst_cold', 'profuse_sweat', 'pulse_surging', 'tidal_fever', 'rigidity'],
  少阳: ['alternating', 'hypochondriac', 'bitter_mouth', 'dry_mouth'],
  太阴: ['diarrhea', 'chill_body', 'poor_appetite', 'loose_stool'],
  少阴: ['cold_limbs', 'lethargy', 'pulse_weak', 'clear_urine'],
  厥阴: ['cold_limbs', 'hot_palms', 'alternating']
}

/**
 * 跨经扣分：病历里某经的特征症越集中，其他经的方剂越要往后排。
 * 杂病方不受此约束。
 * @param {object} formula
 * @param {Set<string>} positives
 * @returns {number} 0 ~ 0.2
 */
export function dominantChannel(positives, min = 2) {
  let dominant = ''
  let best = 0
  for (const [channel, markers] of Object.entries(CHANNEL_MARKERS)) {
    const count = markers.filter((id) => positives.has(id)).length
    if (count > best) {
      best = count
      dominant = channel
    }
  }
  return best >= min ? { channel: dominant, count: best } : undefined
}

export function channelPenalty(formula, positives) {
  // 杂病方与衷中参西录方不按六经扣分
  if (formula.six === '杂病' || formula.six === '衷中' || CHANNEL_MARKERS[formula.six] === undefined) return 0
  const dominant = dominantChannel(positives)
  if (dominant === undefined) return 0
  if (dominant.channel === formula.six) return 0
  return Math.min(0.2, 0.08 * (dominant.count - 1))
}

/**
 * 六经归属明确时，同经的仲景方优先。
 * 不是排斥张锡纯方：它们仍参与同一套打分，只是经方在「六经证据充分」时先被考虑。
 */
export function channelFitBonus(formula, positives) {
  if (formula.six === '杂病' || formula.six === '衷中' || CHANNEL_MARKERS[formula.six] === undefined) return 0
  const dominant = dominantChannel(positives, 1)
  return dominant !== undefined && dominant.channel === formula.six ? 0.06 : 0
}

/**
 * 给全部方剂打分并排序。
 * @param {object} caseData 归一化病历
 * @param {{exclude?:string[], shortlist?:number}} [options]
 */
export function rankFormulas(caseData, options = {}) {
  const exclude = new Set(options.exclude ?? [])
  const boosts = options.boosts ?? {}
  const ranked = []
  for (const formula of FORMULAS) {
    if (exclude.has(formula.id)) continue
    // 名录条目没有方证指标，不参与辨证
    if (!Array.isArray(formula.indicators)) continue
    // requires 是事实性前提（金疮、安胎）：不成立就不进入候选。
    // 注意：这里只判断「情境是否存在」，绝不判断性别——妇人方同样可用于男性。
    if (Array.isArray(formula.requires) && !formula.requires.some((key) => caseData.context.includes(key))) continue
    const entry = scoreFormula(caseData, formula)
    if (entry === undefined) continue
    if (boosts[formula.id] !== undefined) entry.score = clamp(entry.score + boosts[formula.id], 0, 1)
    ranked.push(entry)
  }

  ranked.sort((a, b) => b.score - a.score || b.keyHit - a.keyHit || a.formula.name.localeCompare(b.formula.name, 'zh'))
  const shortlist = options.shortlist ?? TUNING.shortlist
  return ranked.slice(0, shortlist)
}

/**
 * 给单首方打分（不依赖是否进入候选）。evidence 用它评估指定方剂。
 * @returns 评分条目，或 undefined（方证指标为空 / 无命中）
 */
export function scoreFormula(caseData, formula) {
  if (!Array.isArray(formula.indicators) || formula.indicators.length === 0) return undefined
  const positives = new Set([...caseData.symptoms, ...caseData.tongue, ...caseData.pulse])

  let hit = 0
  let total = 0
  let contra = 0
  const matched = []
  const missing = []
  // 方证核心：权重最高的 3 个要点（同权重按声明顺序），代表该方的「主症」
  // 只把 w>=2 的要点算进核心；单症方（如常山治疟）不会因为一条 w=1 的兼症被稀释
  const corePool = formula.indicators.filter((ind) => ind.w >= 2)
  const core = [...(corePool.length > 0 ? corePool : formula.indicators)].sort((a, b) => b.w - a.w).slice(0, 3)
  let coreTotal = 0
  for (const ind of core) coreTotal += ind.w
  const hasKeyWeight = formula.indicators.some((ind) => ind.w >= TUNING.keyWeight)
  let coreHit = 0
  for (const ind of formula.indicators) {
    total += ind.w
    if (positives.has(ind.id)) {
      hit += ind.w
      matched.push(ind)
      if (core.some((c) => c.id === ind.id)) coreHit += ind.w
    } else if (SOFT_EQUIV[ind.id] !== undefined && positives.has(SOFT_EQUIV[ind.id])) {
      hit += ind.w * SOFT_WEIGHT
      matched.push({ ...ind, soft: true })
      if (core.some((c) => c.id === ind.id)) coreHit += ind.w * SOFT_WEIGHT
    } else {
      missing.push(ind)
    }
  }
  const contraMatched = []
  for (const c of formula.contra ?? []) {
    if (positives.has(c.id)) {
      contra += c.w
      contraMatched.push(c)
    }
  }
  if (total === 0 || matched.length === 0) return undefined

  // 核心分量按本方主症归一；但没有一条主症（w≥3）的方，最多只能拿到六成，
  // 避免「自动生成指标」这类缺少主症的方靠兼症拿高分。
  const coreRatio = coreTotal === 0 ? 0 : (coreHit / coreTotal) * (hasKeyWeight ? 1 : 0.6)
  const coverage = hit / total
  const keyHit = matched.filter((m) => m.w >= TUNING.keyWeight).length
  // contexts 是情境相关（产后/妊娠）：命中时小幅加权，不命中也不排除
  const contextBonus = Array.isArray(formula.contexts) && formula.contexts.some((key) => caseData.context.includes(key)) ? 0.06 : 0
  const raw = 0.55 * coreRatio + 0.35 * coverage + 0.1 * Math.min(1, keyHit / 4) + contextBonus
  // 方证指标由手册文本自动推导的方，先验降权，避免抢走手校方的候选位
  const autoPenalty = formula.autoPattern === true ? 0.15 : 0
  const danfangPenalty = formula.bencao === true ? TUNING.bencaoPenalty : formula.kind === 'danfang' ? TUNING.danfangPenalty : 0
  // 张锡纯方主治文字短、指标少，小样本容易把覆盖度顶满；给一点先验降权，避免压过证据更完整的经方
  const depthPenalty =
    formula.school === 'zhongzhong' && formula.kind !== 'danfang'
      ? formula.indicators.length < 5
        ? 0.04
        : formula.indicators.length < 7
          ? 0.02
          : 0
      : 0
  const penalty = contra * 0.12 + channelPenalty(formula, positives) + autoPenalty + danfangPenalty + depthPenalty
  const bonus = channelFitBonus(formula, positives)
  return {
    formula,
    score: clamp(raw - penalty + bonus, 0, 1),
    coverage,
    coreRatio,
    keyHit,
    contra,
    matched: matched.sort((a, b) => b.w - a.w),
    missing: missing.sort((a, b) => b.w - a.w),
    contraMatched
  }
}

/**
 * 由症状推断六经归属（仅用于解释，不参与打分）。
 * @returns {{channel:string, basis:string[]}}
 */
export function inferSix(caseData) {
  const has = (id) => caseData.symptoms.includes(id)
  const scores = { 太阳: 0, 阳明: 0, 少阳: 0, 太阴: 0, 少阴: 0, 厥阴: 0 }
  const basis = {}
  const note = (channel, text) => {
    scores[channel] += 1
    ;(basis[channel] ??= []).push(text)
  }
  if (has('aversion_cold') || has('aversion_wind')) note('太阳', '恶寒恶风')
  if (has('no_sweat') || has('spontaneous_sweat')) note('太阳', '汗出异常')
  if (has('pulse_float')) note('太阳', '脉浮')
  if (has('stiff_neck') || has('headache') || has('body_ache')) note('太阳', '头项身疼痛')
  if (has('profuse_sweat') || has('thirst_cold') || has('pulse_surging') || has('tidal_fever')) note('阳明', '大热大汗大渴')
  if (has('constipation') || has('hard_stool') || has('rigidity')) note('阳明', '燥实内结')
  if (has('jaundice') || has('yellow_sputum')) note('阳明', '里热')
  if (has('alternating') || has('hypochondriac') || has('bitter_mouth')) note('少阳', '往来寒热、胸胁苦满、口苦')
  if (has('dry_mouth') && has('dizziness')) note('少阳', '口苦咽干目眩')
  if (has('diarrhea') && has('poor_appetite') && !has('fever')) note('太阴', '腹满而吐、自利')
  if (has('cold_limbs') && has('diarrhea') && has('lethargy')) note('少阴', '厥逆下利但欲寐')
  if (has('pulse_weak') || has('pulse_deep')) note('少阴', '脉微沉')
  if (has('cold_limbs') && (has('hot_palms') || has('thirst_cold'))) note('厥阴', '寒热错杂、厥热往来')

  let best = '太阳'
  for (const [channel, value] of Object.entries(scores)) if (value > scores[best]) best = channel
  return { channel: best, basis: basis[best] ?? [] }
}

/**
 * 置信度评估。
 * @param {ReturnType<typeof rankFormulas>} ranking
 * @returns {{confident:boolean, reason:string, margin:number, top?:object, runnerUp?:object}}
 */
export function confidence(ranking) {
  if (ranking.length === 0) {
    return { confident: false, reason: '没有任何方剂的方证与目前信息吻合', margin: 0 }
  }
  const top = ranking[0]
  const runnerUp = ranking[1]
  const margin = runnerUp === undefined ? top.score : top.score - runnerUp.score

  if (top.matched.length < 2) {
    return { confident: false, reason: `${top.formula.name} 仅命中 ${top.matched.length} 个方证要点，信息太少`, margin, top, runnerUp }
  }
  if (top.keyHit < 1) {
    return { confident: false, reason: `${top.formula.name} 未命中任何主症`, margin, top, runnerUp }
  }
  if (top.score < TUNING.minScore) {
    return {
      confident: false,
      reason: `最高匹配度仅 ${pct(top.score)}（低于 ${pct(TUNING.minScore)} 的门槛），不足以判定方证`,
      margin,
      top,
      runnerUp
    }
  }
  const required = top.score >= TUNING.highScore ? TUNING.minMargin / 2 : TUNING.minMargin
  if (runnerUp !== undefined && margin < required) {
    return {
      confident: false,
      reason: `${top.formula.name} 与 ${runnerUp.formula.name} 分差仅 ${pct(margin)}，需要进一步鉴别`,
      margin,
      top,
      runnerUp
    }
  }
  return { confident: true, reason: `${top.formula.name} 方证吻合度 ${pct(top.score)}，领先次选 ${pct(margin)}`, margin, top, runnerUp }
}

/** 0.723 → "72%" */
export function pct(n) {
  return `${Math.round(n * 100)}%`
}

/**
 * 生成下一轮鉴别问题：从最接近的几个方剂里，挑「还没问过、且能区分候选」的方证要点。
 * @param {object} caseData
 * @param {ReturnType<typeof rankFormulas>} ranking
 * @param {{max?:number}} [options]
 * @returns {{id:string,label:string,weight:number,spread:number}[]}
 */
export function discriminators(caseData, ranking, options = {}) {
  const asked = new Set(caseData.asked)
  const known = new Set([...caseData.symptoms, ...caseData.tongue, ...caseData.pulse])
  const max = options.max ?? TUNING.maxDiscriminators
  const pool = new Map()

  const contenders = ranking.slice(0, 4)
  for (const entry of contenders) {
    for (const ind of entry.formula.indicators) {
      if (ind.w < 2) continue
      if (known.has(ind.id) || asked.has(ind.id)) continue
      const existing = pool.get(ind.id) ?? { id: ind.id, weight: ind.w, spread: 0, formulas: [] }
      existing.spread += 1
      existing.weight = Math.max(existing.weight, ind.w)
      existing.formulas.push(entry.formula.name)
      pool.set(ind.id, existing)
    }
  }

  return [...pool.values()]
    .filter((entry) => item(entry.id) !== undefined)
    .sort((a, b) => b.spread * b.weight - a.spread * a.weight)
    .slice(0, max)
    .map((entry) => ({
      id: entry.id,
      label: labelOf(entry.id),
      weight: entry.weight,
      spread: entry.spread
    }))
}

/**
 * 候选项的展示数据（给模型与卡片）。
 */
export function describeRanking(ranking) {
  return ranking.map((entry) => ({
    id: entry.formula.id,
    name: entry.formula.name,
    six: entry.formula.six,
    score: Math.round(entry.score * 100) / 100,
    coverage: pct(entry.coverage),
    summary: entry.formula.pattern.join('、'),
    matched: entry.matched.map((m) => labelOf(m.id)),
    missing: entry.missing.filter((m) => m.w >= 2).slice(0, 4).map((m) => labelOf(m.id)),
    conflicts: entry.contraMatched.map((c) => labelOf(c.id))
  }))
}
