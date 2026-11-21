// 把 data/huang-notes.json 生成为 ESM 模块（避免运行时读文件）。
import { readFileSync, writeFileSync } from 'node:fs'
const notes = JSON.parse(readFileSync('data/huang-notes.json', 'utf8'))
const body = Object.entries(notes)
  .map(([id, n]) => {
    const parts = [`id: '${id}'`]
    for (const key of ['dosage', 'constitution', 'diseases', 'modifications', 'cautions']) {
      if (typeof n[key] === 'string' && n[key].trim() !== '') parts.push(`${key}: ${JSON.stringify(n[key].trim())}`)
    }
    return `  { ${parts.join(', ')} }`
  })
  .join(',\n')

const out = `// 黄煌《经方使用手册》结构化摘录（体质/疾病谱/加减/注意事项/常用剂量）
//
// 由 scripts/parse-huang.mjs + scripts/gen-huang-notes.mjs 从
// /home/bian/next/fangzheng/data/黄煌经方使用手册.md 生成，请勿手改。
// 仅作参考层：辨证与开方门槛仍由方证权重与原文条文决定。

export const HUANG_NOTES = [
${body}
]

const BY_ID = new Map(HUANG_NOTES.map((n) => [n.id, n]))

/** 取某方的黄煌经验。 */
export function huangNote(id) {
  return BY_ID.get(id)
}
`
writeFileSync('lib/data/huang-notes.js', out)
console.log(`写入 lib/data/huang-notes.js：${Object.keys(notes).length} 条`)
