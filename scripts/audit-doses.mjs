// 剂量审计：扫出「1 两 = 3 克」折算后会明显不合临床的方，提醒改用经验剂量或原方比例。
// 用法：node scripts/audit-doses.mjs

import { FORMULAS, isVerified, chapterOf } from '../lib/data/index.js'
import { doseOf, GRAMS_PER_LIANG } from '../lib/engine/dose.js'

/** 矿物、贝壳、滋膏类允许大剂量，不参与可疑区间判断。 */
const BIG_HERBS = new Set([
  '石膏', '牡蛎', '龙骨', '代赭石', '赤石脂', '灶心黄土', '滑石', '寒水石', '白石脂', '紫石英',
  '生地黄', '干地黄', '麦门冬', '葳蕤', '天门冬', '阿胶', '饴糖', '胶饴', '白蜜', '蜜',
  '粳米', '小麦', '薏苡仁', '赤小豆', '羊肉', '猪膏', '大枣'
])
/** 有毒/峻烈药，剂量上限更严。 */
const TOXIC = new Set(['附子', '乌头', '川乌', '细辛', '麻黄', '半夏', '吴茱萸', '蜀椒', '巴豆', '甘遂', '芫花', '大戟', '雄黄', '铅丹', '水蛭', '虻虫', '䗪虫'])

const LOW = 2
const HIGH = 30
const TOXIC_HIGH = 12

const warnings = []
const byBasis = { han: 0, qing: 0, modern: 0, ratio: 0, external: 0, unverified: 0 }

for (const f of FORMULAS) {
  if (!isVerified(f)) {
    byBasis.unverified += 1
    continue
  }
  const basis = f.doseBasis ?? 'han'
  byBasis[basis] = (byBasis[basis] ?? 0) + 1
  if (basis !== 'han' && basis !== 'qing') continue

  const caps = f.doseCap ?? {}
  const system = basis === 'qing' ? 'qing' : 'han'
  const low = basis === 'qing' ? 0.3 : LOW
  // 张氏丸/散/膏/饼/粥多为一料或多次服用，不能按一次汤剂的上限判断
  const skipHigh = /丸|丹|散|膏|饼|粥|锭|胶/.test(f.name) || f.kind === 'danfang'
  const high = basis === 'qing' ? (skipHigh ? Infinity : 120) : HIGH
  const toxicHigh = basis === 'qing' ? (skipHigh ? Infinity : 30) : TOXIC_HIGH
  for (const part of f.composition) {
    const { grams } = doseOf(part, system)
    if (grams === null) continue
    if (BIG_HERBS.has(part.herb)) continue
    if (caps[part.herb] !== undefined) continue
    const limit = TOXIC.has(part.herb) ? toxicHigh : high
    if (grams < low) {
      warnings.push(`${f.name}（${chapterOf(f)}，${basis}）：${part.herb} ${grams}g 偏低，考虑注明「原方一料，分次服」或改用经验剂量`)
    } else if (grams > limit) {
      warnings.push(`${f.name}（${chapterOf(f)}，${basis}）：${part.herb} ${grams}g 偏高（上限 ${limit}g），须由医师按体质调整`)
    }
  }

  // 含「升/合/枚」但没有克数估值
  for (const part of f.composition) {
    if (
      typeof part.text === 'string' &&
      typeof part.grams !== 'string' &&
      typeof part.count !== 'number' &&
      !/随证|不拘|等分|多备|磨取|分量用时斟酌/.test(part.text)
    ) {
      warnings.push(`${f.name}：${part.herb}「${part.text}」缺现代估值（建议补 grams 字段）`)
    }
  }
}

console.log(`方剂总数 ${FORMULAS.length}：汉制 ${byBasis.han} 首、清制 ${byBasis.qing} 首、经验剂量 ${byBasis.modern} 首、原方比例 ${byBasis.ratio} 首、外用 ${byBasis.external} 首、名录 ${byBasis.unverified} 首`)
console.log(`折算标准：汉制 1 两 = ${GRAMS_PER_LIANG} 克；清制 1 两 = 30 克（张锡纯方）`)
if (warnings.length === 0) {
  console.log('\n没有可疑剂量。')
} else {
  console.log(`\n可疑项 ${warnings.length} 条：`)
  for (const warning of warnings) console.log(`  · ${warning}`)
}
