// 把方剂库与《金匮要略》原文索引对齐：找出每首方在书里的条文与组成。
import { readFileSync, writeFileSync } from 'node:fs'
import { FORMULAS, isVerified } from '../lib/data/index.js'

const index = JSON.parse(readFileSync('data/jingui-index.json', 'utf8'))

/** 异体字/简称归一。 */
const VARIANTS = [
  [/黄耆/g, '黄芪'], [/黄蓍/g, '黄芪'], [/朮/g, '术'], [/蚘/g, '蛔'], [/症瘕/g, '癥瘕'],
  [/栝蒌/g, '瓜蒌'], [/栝楼/g, '瓜蒌'], [/黄蘖/g, '黄柏'], [/黄檗/g, '黄柏'],
  [/苩/g, '芍'], [/茈/g, '紫']
]
const norm = (text) => VARIANTS.reduce((acc, [re, to]) => acc.replace(re, to), text)

/** 方名别名表：库里的名字 ↔ 书里的写法。 */
const ALIASES = {
  苓桂术甘汤: ['茯苓桂枝白术甘草汤', '苓桂术甘汤'],
  肾气丸: ['八味肾气丸', '肾气丸'],
  理中丸: ['理中丸', '人参汤'],
  麻黄加术汤: ['麻黄加术汤'],
  麻杏石甘汤: ['麻黄杏仁甘草石膏汤'],
  葛根芩连汤: ['葛根黄芩黄连汤'],
  瓜蒌薤白半夏汤: ['瓜蒌薤白半夏汤', '栝蒌薤白半夏汤'],
  枳实薤白桂枝汤: ['枳实薤白桂枝汤'],
  胶艾汤: ['胶艾汤', '芎归胶艾汤'],
  己椒苈黄丸: ['己椒苈黄丸', '防己椒目葶苈大黄丸'],
  桂枝救逆汤: ['桂枝去芍药加蜀漆牡蛎龙骨救逆汤', '桂枝救逆汤'],
  黄芪芍药桂枝苦酒汤: ['芪芍桂酒汤', '黄芪芍药桂枝苦酒汤'],
  甘姜苓术汤: ['甘姜苓术汤', '肾着汤'],
  桂枝加龙骨牡蛎汤: ['桂枝加龙骨牡蛎汤'],
  竹叶汤: ['竹叶汤'],
  王不留行散: ['王不留行散']
}

const clauses = index.chapters.flatMap((chapter) =>
  chapter.clauses
    .filter((c) => c.text !== undefined)
    .map((c) => ({ chapter: chapter.title, text: norm(c.text), raw: c.text, formulas: c.formulas, composition: c.composition }))
)

function findClauses(formula) {
  const names = [formula.name, ...(formula.alias === undefined ? [] : [formula.alias]), ...(ALIASES[formula.name] ?? [])]
    .map(norm)
    .filter((n) => n.length >= 3)
  return clauses.filter((c) => names.some((name) => c.text.includes(name)))
}

const rows = []
for (const f of FORMULAS) {
  if (!(f.source ?? '').includes('金匮要略')) continue
  const hits = findClauses(f)
  rows.push({ formula: f, hits })
}

const missing = rows.filter((r) => r.hits.length === 0)
const pendingWithClause = rows.filter((r) => !isVerified(r.formula) && r.hits.length > 0)
const mismatched = rows.filter((r) => isVerified(r.formula) && r.hits.length > 0 && r.formula.clauses.some((c) => !r.hits.some((h) => h.raw.includes(c.text.slice(0, 12)))))

console.log(`金匮方 ${rows.length}：书中有条文 ${rows.length - missing.length}，未找到 ${missing.length}`)
console.log(`\n名录条目中可升 A 档（书中有条文）：${pendingWithClause.length}`)
for (const r of pendingWithClause) console.log(`  ✓ ${r.formula.name}（${r.hits[0].chapter.slice(0, 8)}）`)
console.log(`\n未在书中找到：${missing.length}`)
for (const r of missing) console.log(`  ✗ ${r.formula.name}`)
console.log(`\n我的条文与原文可能不一致：${mismatched.length}`)
for (const r of mismatched) console.log(`  ! ${r.formula.name}`)

writeFileSync('data/classics-match.json', JSON.stringify(rows.map((r) => ({ id: r.formula.id, name: r.formula.name, verified: isVerified(r.formula), hits: r.hits.map((h) => ({ chapter: h.chapter, text: h.raw, composition: h.composition })) })), null, 1))
console.log('\n写入 data/classics-match.json')
