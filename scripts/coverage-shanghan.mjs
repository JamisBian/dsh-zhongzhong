// 伤寒六经覆盖度：按篇统计，并标出宋本有、库内无的方。
import { FORMULAS, isVerified } from '../lib/data/index.js'

const CHANNELS = ['太阳', '阳明', '少阳', '太阴', '少阴', '厥阴', '霍乱', '差后']
const rows = new Map(CHANNELS.map((c) => [c, []]))
for (const f of FORMULAS) {
  if (rows.has(f.six)) rows.get(f.six).push(f.name)
}

let total = 0
for (const [channel, names] of rows) {
  total += names.length
  console.log(`${channel.padEnd(4, '　')} ${String(names.length).padStart(3)} 首：${names.join('、')}`)
}
console.log('─'.repeat(72))
console.log(`伤寒六经合计 ${total} 首（全库 ${FORMULAS.length} 首，其中可辨证 ${FORMULAS.filter(isVerified).length} 首）`)
console.log(`另有张锡纯方/单方 ${FORMULAS.filter((f) => f.school === 'zhongzhong').length} 首，按《医学衷中参西录》篇目统计，不列入六经`)

/** 宋本《伤寒论》中只有外治法、佚方或与他方重出的条目，未单列。 */
const NOT_LISTED = [
  '烧裈散（阴阳易，取妇人中裈烧灰，外治）',
  '大猪胆汁导（外治导法）',
  '土瓜根导（外治导法）',
  '禹余粮丸（宋本原方已佚，仅存方名）'
]
console.log('\n未单列的宋本条目：')
for (const item of NOT_LISTED) console.log(`  · ${item}`)
