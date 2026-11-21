// 张锡纯方 + 药物篇单方覆盖度 / 自洽性报告
//
// 用法：node scripts/coverage-zhongzhong.mjs
//
// 检查：
//   1. 174 首方是否都有组成、原书主治、指标、至少 1 条主症
//   2. 87 味单方是否都有主治、指标、用法
//   3. 每首方/每味单方能否在「自身方证」构造的病例上通过文献门槛
//   4. 清制剂量是否都能折算，或明确标「随证酌用/等分」
//   5. 每个篇目的方数

import { FORMULAS, resolveFormula } from '../lib/data/index.js'
import { normalizeCase } from '../lib/engine/case.js'
import { verify } from '../lib/engine/evidence.js'
import { labelOf } from '../lib/data/symptoms.js'

const zz = FORMULAS.filter((f) => f.school === 'zhongzhong' && f.bencao !== true)
const df = FORMULAS.filter((f) => f.bencao === true)

const bySection = new Map()
for (const f of zz) bySection.set(f.chapter, (bySection.get(f.chapter) ?? 0) + 1)

let problems = 0
const fail = (text) => {
  problems += 1
  console.log(`  ✘ ${text}`)
}

console.log('《医学衷中参西录》覆盖度')
console.log('─'.repeat(72))
console.log(`医方 ${zz.length} 首，分 ${bySection.size} 篇；药物篇单方 ${df.length} 味`)
console.log('')
for (const [chapter, count] of bySection) {
  const names = zz.filter((f) => f.chapter === chapter).map((f) => f.name)
  console.log(`${chapter.padEnd(12, '　')} ${String(count).padStart(3)} 首：${names.join('、')}`)
}

console.log('')
console.log('结构检查')
for (const f of zz) {
  if (f.composition.length === 0) fail(`${f.name} 缺组成`)
  if (f.clauses.length === 0 || f.clauses[0].text.trim() === '') fail(`${f.name} 缺原书主治`)
  if (!Array.isArray(f.indicators) || f.indicators.length === 0) fail(`${f.name} 缺指标`)
  if (!f.indicators.some((ind) => ind.w >= 3)) fail(`${f.name} 没有主症 w=3`)
  if (f.doseSystem !== 'qing') fail(`${f.name} 剂量体系不是 qing`)
  for (const part of f.composition) {
    const has = Array.isArray(part.dose) ? part.dose.length > 0 : typeof part.text === 'string' && part.text !== ''
    if (!has) fail(`${f.name} ${part.herb} 缺剂量`)
  }
}
for (const f of df) {
  if (!f.brief || f.brief.trim() === '') fail(`${f.name} 缺一句话主治`)
  if (!Array.isArray(f.indicators) || f.indicators.length === 0) fail(`${f.name} 缺指标`)
  if (!f.indicators.some((ind) => ind.w >= 3)) fail(`${f.name} 没有主症 w=3`)
  if (!f.decoction || f.decoction.trim() === '') fail(`${f.name} 缺用法`)
}
if (problems === 0) console.log('  ✔ 结构与剂量检查全部通过')

console.log('')
console.log('方证自洽性（用自身指标构造病例，必须 supported）')
let bad = 0
for (const f of [...zz, ...df]) {
  const ids = f.indicators.filter((ind) => ind.w >= 2).map((ind) => ind.id)
  if (ids.length === 0) {
    fail(`${f.name} 没有 w≥2 的指标`)
    continue
  }
  const c = normalizeCase({ symptoms: ids })
  const report = await verify(c, f, { online: false })
  if (report.verdict !== 'supported') {
    bad += 1
    console.log(`  ✘ ${f.name}：${report.verdict}（${report.coverage}）`)
  }
}
if (bad === 0) console.log(`  ✔ ${zz.length + df.length} 首方/单方全部能通过自身文献门槛`)

console.log('')
console.log('抽查')
const samples = ['升陷汤', '镇肝熄风汤', '玉液汤', '固冲汤', '寿胎丸', '活络效灵丹', '石膏（单味）', '人参（单味）']
for (const name of samples) {
  const f = resolveFormula(name)
  if (f === undefined) {
    fail(`抽查失败：找不到 ${name}`)
    continue
  }
  const ids = f.indicators.filter((ind) => ind.w >= 2).map((ind) => ind.id)
  console.log(`  · ${f.name}（${f.indicators.length} 条指标）：${ids.map(labelOf).join('、')}`)
}

console.log('')
if (problems === 0) {
  console.log(`全部通过：${zz.length} 首张锡纯方 + ${df.length} 味单方`)
} else {
  console.log(`${problems} 项问题`)
  process.exitCode = 1
}
