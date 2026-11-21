// 合方：两首方剂病机相近、单方又分不开时，按仲景「合方」的做法并用。
//
// 这不是把两首方随意叠加：先做相容性检查（十八反、十九畏、毒性叠加、药味高度重复），
// 通过后才合成一首「合方」，两首方各自的证据仍要分别通过文献核查。

/** 十八反 / 十九畏的相反对药对（双向记一次）。 */
const INCOMPATIBLE = [
  ['甘草', '甘遂'],
  ['甘草', '大戟'],
  ['甘草', '海藻'],
  ['甘草', '芫花'],
  ['乌头', '半夏'],
  ['川乌', '半夏'],
  ['草乌', '半夏'],
  ['附子', '半夏'],
  ['附子', '瓜蒌'],
  ['附子', '贝母'],
  ['附子', '白蔹'],
  ['附子', '白及'],
  ['藜芦', '人参'],
  ['藜芦', '丹参'],
  ['藜芦', '玄参'],
  ['藜芦', '细辛'],
  ['藜芦', '芍药'],
  ['巴豆', '牵牛子'],
  ['丁香', '郁金'],
  ['肉桂', '赤石脂'],
  ['人参', '五灵脂'],
  ['三棱', '牙硝'],
  ['硫黄', '朴硝'],
  ['狼毒', '密陀僧']
]

/** 毒性药：两方同时出现即视为毒性叠加，需医师把关。 */
const TOXIC = ['附子', '川乌', '草乌', '乌头', '巴豆', '甘遂', '大戟', '芫花', '商陆', '细辛', '朱砂', '雄黄', '马钱子']

const herbNames = (formula) => (formula.composition ?? []).map((item) => item.herb).filter((h) => typeof h === 'string')

/**
 * 相容性检查。
 * @returns {{level:'ok'|'caution'|'block', reasons:string[], overlap:number, shared:string[]}}
 */
export function combineCheck(a, b) {
  const reasons = []
  let level = 'ok'
  const escalate = (next) => {
    if (next === 'block' || level === 'ok') level = next
  }

  if (a.id === b.id || a.name === b.name) {
    return { level: 'block', reasons: [`两首是同一方（${a.name}），不需要合方`], overlap: 1, shared: [] }
  }

  // 汉制与清制不能直接叠加：同一味药在不同体系下的克数差 10 倍
  const systemA = a.doseSystem === 'qing' ? 'qing' : 'han'
  const systemB = b.doseSystem === 'qing' ? 'qing' : 'han'
  if (systemA !== systemB) {
    reasons.push(`剂量体系不同（${a.name} 为${systemA === 'qing' ? '清制' : '汉制'}，${b.name} 为${systemB === 'qing' ? '清制' : '汉制'}），不能直接合方；请分别开具或由医师重新定量`)
    escalate('block')
  }

  const left = herbNames(a)
  const right = herbNames(b)
  const shared = left.filter((h) => right.includes(h))
  const union = new Set([...left, ...right])
  const overlap = union.size === 0 ? 0 : shared.length / union.size

  for (const [x, y] of INCOMPATIBLE) {
    const hit = (left.includes(x) && right.includes(y)) || (left.includes(y) && right.includes(x))
    if (hit) {
      reasons.push(`十八反/十九畏：${x} 与 ${y} 相反，禁止同用`)
      escalate('block')
    }
  }

  for (const herb of TOXIC) {
    if (left.includes(herb) && right.includes(herb)) {
      reasons.push(`毒性叠加：两方都含${herb}，合方后剂量会累加，须医师重新定量`)
      escalate('caution')
    }
  }

  if (overlap >= 0.7) {
    reasons.push(`药味重复 ${Math.round(overlap * 100)}%，两方几乎是同一张方，取其中一首即可`)
    escalate('block')
  } else if (overlap >= 0.45) {
    reasons.push(`药味重复 ${Math.round(overlap * 100)}%（共有 ${shared.join('、')}），合方后总量偏大，须酌减`)
    escalate('caution')
  }

  if (left.length === 0 || right.length === 0) {
    reasons.push('有一方缺少组成，无法检查相容性')
    escalate('block')
  }

  if (reasons.length === 0) reasons.push('未发现相反、相畏或毒性叠加')
  return { level, reasons, overlap, shared }
}

/**
 * 合成一首合方：药味去重（同一味药不重复累加），指标取并集（权重取高者）。
 * @returns {object} 与库内方剂同结构的对象
 */
export function buildCombined(a, b) {
  const seen = new Map()
  const composition = []
  for (const item of [...(a.composition ?? []), ...(b.composition ?? [])]) {
    const key = item.herb
    if (seen.has(key)) {
      // 两方共有：保留第一次出现的条目，并标注
      const existing = seen.get(key)
      existing.shared = true
      continue
    }
    const copy = { ...item }
    seen.set(key, copy)
    composition.push(copy)
  }

  const merged = new Map()
  for (const indicator of [...(a.indicators ?? []), ...(b.indicators ?? [])]) {
    const current = merged.get(indicator.id)
    if (current === undefined || indicator.w > current.w) merged.set(indicator.id, { ...indicator })
  }

  const safety = [...new Set([...(a.safety ?? []), ...(b.safety ?? [])])]
  safety.push(
    a.school === 'zhongzhong' || b.school === 'zhongzhong'
      ? '合方为两首方叠加，药味与总量偏大，须医师按体质酌减；本合方不是仲景原方，也不是张锡纯原方。'
      : '合方为两首方叠加，药味与总量偏大，须医师按体质酌减；本合方不是仲景原方。'
  )

  return {
    id: `${a.id}+${b.id}`,
    name: `${a.name}合${b.name}`,
    alias: undefined,
    source: `${a.source}；${b.source}`,
    six: a.six === b.six ? a.six : '合方',
    school: a.school === 'zhongzhong' || b.school === 'zhongzhong' ? 'zhongzhong' : a.school === 'shifang' || b.school === 'shifang' ? 'shifang' : 'jingfang',
    doseSystem: a.doseSystem === 'qing' ? 'qing' : 'han',
    doseBasis: a.doseBasis === b.doseBasis ? a.doseBasis ?? 'han' : 'modern',
    composition,
    decoction: `两方各按原法煎取，混合后分温服；或合为一剂同煎。${a.decoction ?? ''}`.trim(),
    pattern: [...new Set([...(a.pattern ?? []), ...(b.pattern ?? [])])].slice(0, 8),
    indicators: [...merged.values()],
    contra: [...(a.contra ?? []), ...(b.contra ?? [])],
    clauses: [...(a.clauses ?? []), ...(b.clauses ?? [])],
    modern: {
      terms: [...new Set([...(a.modern?.terms ?? []), ...(b.modern?.terms ?? [])])],
      conditions: [...new Set([...(a.modern?.conditions ?? []), ...(b.modern?.conditions ?? [])])]
    },
    safety,
    verified: a.verified === true && b.verified === true,
    combined: true,
    parts: [a.id, b.id],
    brief: [a.brief, b.brief].filter(Boolean).join('；')
  }
}
