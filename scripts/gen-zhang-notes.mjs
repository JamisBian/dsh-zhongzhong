// 解析张锡纯《医学衷中参西录》加减法 → lib/data/zhang-notes.js
import { readFileSync, writeFileSync } from 'node:fs'
import { FORMULAS } from '../lib/data/index.js'

const lines = readFileSync('/home/bian/next/fangzheng/data/张锡纯加减.md', 'utf8').split('\n')
const raw = new Map()
let current = null
for (const line of lines) {
  const text = line.trim()
  if (text === '') continue
  if (text.startsWith('# ')) {
    const m = /^#\s*([^：:]+)[：:]\s*(.*)$/.exec(text)
    current = { name: (m === null ? text.slice(2) : m[1]).trim(), base: m === null ? '' : m[2].trim(), mods: [] }
    raw.set(current.name, current)
    continue
  }
  if (current !== null) {
    for (const sentence of text.split('。').map((s) => s.trim()).filter((s) => s !== '')) current.mods.push(sentence)
  }
}

const notes = []
for (const f of FORMULAS) {
  const hit = raw.get(f.name) ?? raw.get(f.name.replace(/（.*?）/g, ''))
  if (hit === undefined) continue
  notes.push({ id: f.id, name: f.name, base: hit.base, modifications: hit.mods.slice(0, 12) })
}

const body = notes
  .map((n) => `  { id: ${JSON.stringify(n.id)}, name: ${JSON.stringify(n.name)}, base: ${JSON.stringify(n.base)}, modifications: ${JSON.stringify(n.modifications)} }`)
  .join(',\n')

writeFileSync(
  'lib/data/zhang-notes.js',
  `// 张锡纯加减法摘录（《医学衷中参西录》）
//
// 由 scripts/gen-zhang-notes.mjs 从
// /home/bian/next/fangzheng/data/张锡纯加减.md 生成，请勿手改。
// 张氏用药剂量偏重（如石膏 50g、麻黄 18g），与本库 1 两 = 3 克的折算不同，
// 仅作「随证加减」的思路参考，不可直接照搬剂量。

export const ZHANG_NOTES = [
${body}
]

const BY_ID = new Map(ZHANG_NOTES.map((n) => [n.id, n]))

export function zhangNote(id) {
  return BY_ID.get(id)
}
`
)
console.log(`张锡纯加减：源文件 ${raw.size} 首，匹配库内 ${notes.length} 首`)
console.log(notes.map((n) => `${n.name}(${n.modifications.length})`).join('、'))
