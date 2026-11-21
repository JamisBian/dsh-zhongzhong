// 剂量折算：汉制（经方）与清制（张锡纯）两套
//
// 经方全库统一「1 两 = 3 克」（用户指定）；《医学衷中参西录》是清代方，
// 张锡纯用量偏重，按清制「1 两 = 30 克、1 钱 = 3 克、1 分 = 0.3 克」折算，
// 并在处方笺上明确标注「张氏原量」，不可与汉制混用。
//
// 数据写法：
//   { herb:'桂枝', liang:3 }                      汉制
//   { herb:'黄芪', dose:[{unit:'两',value:6}] }   通用（按方剂 doseSystem 折算）
//   { herb:'大枣', count:12, unit:'枚' }          计数
//   { herb:'鲜茅根', text:'四钱', grams:'12' }    原文写法（无结构剂量）

/** 一两折合克数（汉制）。改这一个常量即可切换经方剂量体系。 */
export const GRAMS_PER_LIANG = 3

/** 一斤折合克数（汉制）。 */
export const GRAMS_PER_JIN = GRAMS_PER_LIANG * 16

/** 一铢折合克数。 */
export const GRAMS_PER_ZHU = GRAMS_PER_LIANG / 24

/** 两套度量衡。 */
export const DOSE_SYSTEMS = {
  han: { id: 'han', label: '汉制', liang: GRAMS_PER_LIANG, zhu: GRAMS_PER_ZHU, jin: GRAMS_PER_JIN },
  qing: { id: 'qing', label: '清制', liang: 30, qian: 3, fen: 0.3, li: 0.03, jin: 480, wa: 1 }
}

/** 计数 / 容量单位：不折算克数。 */
const COUNT_UNITS = new Set(['枚', '个', '片', '条', '具', '粒', '对', '只', '张', '叶', '茎', '根', '支', '滴', '丸', '锭', '块', '朵', '足', '升', '合', '寸', '尺', '撮', '等分'])

/** 去掉浮点噪声，最多保留一位小数。 */
export function round1(n) {
  return Math.round(n * 10) / 10
}

/** 克数 → 展示文案。 */
export function formatGrams(n) {
  return String(round1(n))
}

/** 数字展示：整数不带小数点。 */
function num(n) {
  return Number.isInteger(n) ? String(n) : String(n)
}

function factorOf(unit, system) {
  const spec = DOSE_SYSTEMS[system] ?? DOSE_SYSTEMS.han
  if (unit === '两') return spec.liang
  if (unit === '钱') return spec.qian ?? null
  if (unit === '分') return spec.fen ?? null
  if (unit === '厘') return spec.li ?? null
  if (unit === '斤') return spec.jin
  if (unit === '铢') return spec.zhu ?? null
  if (unit === '瓦') return spec.wa ?? null
  return null
}

/**
 * 单味药的剂量展示。
 * @param {object} part
 * @param {'han'|'qing'} [system]
 * @returns {{ancient:string, modern:string, grams:number|null}}
 */
export function doseOf(part, system = 'han') {
  // 通用剂量数组：一两五钱、二钱、三枚……
  if (Array.isArray(part.dose) && part.dose.length > 0) {
    const ancient = part.dose.map((d) => `${num(d.value)}${d.unit}`).join('')
    let grams = 0
    let convertible = false
    for (const d of part.dose) {
      const factor = factorOf(d.unit, system)
      if (factor === null) continue
      grams += d.value * factor
      convertible = true
    }
    return { ancient, modern: convertible ? `≈${formatGrams(grams)}g` : '', grams: convertible ? grams : null }
  }
  if (typeof part.liang === 'number') {
    const grams = part.liang * (DOSE_SYSTEMS[system] ?? DOSE_SYSTEMS.han).liang
    return { ancient: `${num(part.liang)}两`, modern: `≈${formatGrams(grams)}g`, grams }
  }
  if (typeof part.zhu === 'number') {
    const grams = part.zhu * GRAMS_PER_ZHU
    return { ancient: `${num(part.zhu)}铢`, modern: `≈${formatGrams(grams)}g`, grams }
  }
  if (typeof part.qian === 'number') {
    const grams = part.qian * DOSE_SYSTEMS.qing.qian
    return { ancient: `${num(part.qian)}钱`, modern: `≈${formatGrams(grams)}g`, grams }
  }
  if (typeof part.fen === 'number') {
    const grams = part.fen * DOSE_SYSTEMS.qing.fen
    return { ancient: `${num(part.fen)}分`, modern: `≈${formatGrams(grams)}g`, grams }
  }
  if (typeof part.jin === 'number') {
    const grams = part.jin * (DOSE_SYSTEMS[system] ?? DOSE_SYSTEMS.han).jin
    return { ancient: `${num(part.jin)}斤`, modern: `≈${formatGrams(grams)}g`, grams }
  }
  if (typeof part.count === 'number') {
    return { ancient: `${num(part.count)}${part.unit ?? '枚'}`, modern: '', grams: null }
  }
  const ancient = part.text ?? part.doseNote ?? ''
  const modern = typeof part.grams === 'string' ? `≈${part.grams}` : ''
  return { ancient, modern, grams: null }
}

/**
 * 一行剂量：「桂枝 三两（≈9g）」。
 * @param {object} part
 * @param {'han'|'qing'} [system]
 */
export function doseText(part, system = 'han') {
  const { ancient, modern } = doseOf(part, system)
  if (ancient === '' && modern === '') return part.prep === undefined ? part.herb : `${part.herb}（${part.prep}）`
  const prep = part.prep === undefined || part.prep === '' ? '' : `，${part.prep}`
  return modern === '' ? `${part.herb} ${ancient}${prep}` : `${part.herb} ${ancient}（${modern}）${prep}`
}
