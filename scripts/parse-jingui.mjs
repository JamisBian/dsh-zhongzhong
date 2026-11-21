// 解析《金匮要略》原文，建立「篇 → 条文 → 方名/组成」索引。
// 用法：node scripts/parse-jingui.mjs [--write]
import { readFileSync, writeFileSync } from 'node:fs'

const SRC = '/home/bian/next/fangzheng/data/金匮要略.md'
const OUT = 'data/jingui-index.json'

const lines = readFileSync(SRC, 'utf8').split('\n')
const chapters = []
let chapter = { title: '未分篇', clauses: [] }
let current = null

const isChapter = (text) => /第[一二三四五六七八九十百]+/.test(text) && !/主之|方：/.test(text)
const FORMULA_RE = /([\u4e00-\u9fa5]{2,10}?(?:汤|丸|散|膏|酒|煎|丹|饮|方))(?=[，、。；：\s]|$)/g

for (const raw of lines) {
  const line = raw.trim()
  if (line === '') continue
  if (line.startsWith('# ')) {
    const text = line.slice(2).trim()
    if (isChapter(text)) {
      if (chapter.clauses.length > 0) chapters.push(chapter)
      chapter = { title: text, clauses: [] }
      current = null
      continue
    }
    // 条文体：含「主之/宜/可与/方」或长度 > 12 的标题
    const looksClause = /主之|宜|可与|当以|方$|方：/.test(text) || text.length > 12
    if (looksClause) {
      current = { text, formulas: [], composition: [] }
      const found = [...text.matchAll(FORMULA_RE)].map((m) => m[1])
      // 「主之」前的那个方名最可靠
      const beforeMain = text.split('主之')[0]
      const main = [...beforeMain.matchAll(FORMULA_RE)].map((m) => m[1]).pop()
      current.formulas = main === undefined ? found : [main, ...found.filter((f) => f !== main)]
      chapter.clauses.push(current)
    } else {
      current = { note: text, formulas: [], composition: [] }
      chapter.clauses.push(current)
    }
    continue
  }
  // 方剂组成行：以方名 + 「方：」开头，或紧跟在条文后
  const comp = /^([\u4e00-\u9fa5]{2,10}?(?:汤|丸|散|膏|酒|煎|丹|饮))方[：:]?(.*)$/.exec(line)
  if (comp !== null) {
    if (current !== null) current.composition.push({ name: comp[1], text: comp[2].trim() })
    continue
  }
  if (current !== null && current.text !== undefined) {
    // 条文正文续行（组成或方后注）
    current.composition.push({ name: '', text: line })
  }
}
if (chapter.clauses.length > 0) chapters.push(chapter)

const totalClauses = chapters.reduce((n, c) => n + c.clauses.filter((x) => x.text !== undefined).length, 0)
const totalFormulas = new Set(
  chapters.flatMap((c) => c.clauses.flatMap((x) => (x.text === undefined ? [] : x.formulas.concat(x.composition.map((y) => y.name).filter(Boolean)))))
)
console.log(`篇 ${chapters.length}，条文 ${totalClauses}，出现方名 ${totalFormulas.size}`)
console.log(chapters.map((c) => `${c.title}：${c.clauses.filter((x) => x.text !== undefined).length} 条`).join('\n'))

if (process.argv.includes('--write')) {
  writeFileSync(OUT, JSON.stringify({ source: SRC, chapters }, null, 1))
  console.log(`\n写入 ${OUT}`)
}
