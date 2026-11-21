// 覆盖度报告：按《金匮要略》22 篇统计已收录方剂（含名录条目）。
// 用法：node scripts/coverage.mjs

import { FORMULAS, isVerified, chapterOf, JINGUI_CHAPTERS } from '../lib/data/index.js'

const rows = new Map()
for (const chapter of JINGUI_CHAPTERS) rows.set(chapter, { verified: [], pending: [] })

let shanghan = 0
let zhongzhong = 0
let other = 0
for (const f of FORMULAS) {
  if (f.school === 'zhongzhong') {
    zhongzhong += 1
    continue
  }
  const chapter = chapterOf(f)
  const isJingui = (f.source ?? '').includes('金匮要略')
  if (!isJingui) {
    if ((f.source ?? '').includes('伤寒论')) shanghan += 1
    else other += 1
    continue
  }
  const key = JINGUI_CHAPTERS.find((c) => chapter.startsWith(c) || c.startsWith(chapter)) ?? null
  const bucket = key === null ? null : rows.get(key)
  if (bucket === null) {
    other += 1
    continue
  }
  if (isVerified(f)) bucket.verified.push(f.name)
  else bucket.pending.push(f.name)
}

let totalVerified = 0
let totalPending = 0
console.log('《金匮要略》篇目覆盖')
console.log('─'.repeat(72))
for (const [chapter, bucket] of rows) {
  totalVerified += bucket.verified.length
  totalPending += bucket.pending.length
  const flag = bucket.verified.length === 0 ? '  ← 未覆盖' : ''
  console.log(
    `${chapter.padEnd(24, '　')} 已核 ${String(bucket.verified.length).padStart(2)}　名录 ${String(bucket.pending.length).padStart(2)}${flag}`
  )
  if (bucket.verified.length > 0) console.log(`  ✓ ${bucket.verified.join('、')}`)
  if (bucket.pending.length > 0) console.log(`  ○ ${bucket.pending.join('、')}（待补原文）`)
}
console.log('─'.repeat(72))
console.log(`金匮：已核 ${totalVerified} 首 + 名录 ${totalPending} 首 = ${totalVerified + totalPending} 首`)
console.log(`伤寒：${shanghan} 首；其它出处：${other} 首；张锡纯方/单方：${zhongzhong} 首；全库合计 ${FORMULAS.length} 首`)
