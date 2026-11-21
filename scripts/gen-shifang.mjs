// 把《黄煌经方使用手册》里未入库的方（后世方 + 漏收经方）生成数据文件。
//
// 证据来源与经方不同：经方的依据是《伤寒论》《金匮要略》原文，这批的依据是
// 手册的「原书方证 / 经典方证」，因此 school='shifang'，开方时明确标注。
import { readFileSync, writeFileSync } from 'node:fs'
import { FORMULAS } from '../lib/data/index.js'
import { resolveIdsInText } from '../lib/data/symptoms.js'

const SRC = '/home/bian/next/fangzheng/data/黄煌经方使用手册.md'
const lines = readFileSync(SRC, 'utf8').split('\n')
const SKIP = new Set(['经方汤液煎煮法', '经方用量原则及折算法', '编写说明'])

const clean = (t) => String(t).replace(/__([^_]+)__/g, '$1').replace(/\s+/g, ' ').trim()

/** 按「# 方名」切块。 */
const entries = []
let current = null
let field = null
for (const raw of lines) {
  const line = raw.trim()
  if (line === '') continue
  if (line.startsWith('# ')) {
    const name = clean(line.slice(2))
    current = SKIP.has(name) ? null : { name, intro: '', fields: {} }
    field = null
    if (current !== null) entries.push(current)
    continue
  }
  if (current === null) continue
  const m = /^【([^】]+)】\s*(.*)$/.exec(line)
  if (m !== null) {
    field = m[1]
    current.fields[field] = clean(m[2])
    continue
  }
  if (field === null) current.intro = clean(`${current.intro} ${line}`)
  else current.fields[field] = clean(`${current.fields[field] ?? ''} ${line}`)
}

// 手工录入的方（不含本脚本上次生成的 _hf 条目），避免重跑时把自己当已存在
/** 手册条目没标出处的经方，按原文补出出处。 */
const CLASSIC_OVERRIDE = {
  麻黄连翘赤小豆汤: '《伤寒论·辨阳明病脉证并治》'
}

const have = new Set()
for (const f of FORMULAS.filter((x) => !String(x.id).endsWith('_hf'))) {
  have.add(f.name)
  have.add(f.name.replace(/（.*?）/g, ''))
  if (f.alias !== undefined) have.add(f.alias)
}
const EXTRA_ALIAS = { 葛根芩连汤: '葛根芩连汤', 理中汤: '理中丸' }
/** 与库内已有方同方异名，跳过。 */
const DUPLICATE_OF = {
  茯苓桂枝白术甘草汤: '苓桂术甘汤',
  茯苓桂枝五味甘草汤: '桂苓五味甘草汤'
}

/** 「姜制半夏15g，茯苓15g」→ [{herb,text:'15g'}]；也支持「半夏：天麻=2：2」比例写法。 */
function parseDose(text) {
  const out = []
  // 比例写法：A：B：C = 2：2：1
  const ratio = /^([^=＝]+)[=＝]([\d：:，,\s]+)$/.exec(text.trim())
  if (ratio !== null) {
    const herbs = ratio[1].split(/[：:，,、]/).map((h) => h.trim()).filter((h) => h !== '')
    const parts = ratio[2].split(/[：:，,]/).map((n) => n.trim()).filter((n) => n !== '')
    herbs.forEach((herb, i) => {
      if (i < parts.length) out.push({ herb, text: `${parts[i]}份` })
    })
    return out
  }
  for (const token of text.split(/[，,、；;]/)) {
    const m = /^([\u4e00-\u9fa5]{1,6}?)\s*(\d+(?:\.\d+)?)\s*(g|克|枚|片|ml)/.exec(token.trim())
    if (m === null) {
      // 宋制「陈皮一钱」「半夏一钱半」
      const t = /^([\u4e00-\u9fa5]{1,5}?)([一二三四五六七八九十半]+钱(?:半)?|[一二三四五六七八九十]+分)/.exec(token.trim())
      if (t !== null) out.push({ herb: t[1], text: t[2] })
      continue
    }
    out.push({ herb: m[1], text: `${m[2]}${m[3] === '克' ? 'g' : m[3]}` })
  }
  return out
}

/** 从方证/体质/主治文本里推方证指标（自动生成，权重视来源分层）。 */
function deriveIndicators(fields, intro) {
  const weights = new Map()
  const bump = (text, w) => {
    for (const id of resolveIdsInText(text)) weights.set(id, Math.max(weights.get(id) ?? 0, w))
  }
  // 只从「方证」文本推导：体质/疾病/加减里的症状太泛，会把方证稀释成噪声
  const fangZheng = fields['原书方证'] ?? fields['经典方证'] ?? fields['方证提要'] ?? ''
  // 「适用于以…为特征」这一句最接近方证提要，权重最高；原书方证作兼症
  bump(intro, 3)
  bump(fangZheng, 2)
  bump(fields['体质要求'] ?? '', 1)
  const sorted = [...weights.entries()].sort((a, b) => b[1] - a[1]).slice(0, 8)
  return sorted.map(([id, w]) => ({ id, w }))
}

const generated = []
const seen = new Set()
const skipped = []
for (const entry of entries) {
  if (have.has(entry.name) || have.has(entry.name.replace(/（.*?）/g, ''))) continue
  if (seen.has(entry.name)) continue
  if (EXTRA_ALIAS[entry.name] !== undefined && have.has(EXTRA_ALIAS[entry.name])) continue
  if (DUPLICATE_OF[entry.name] !== undefined && have.has(DUPLICATE_OF[entry.name])) continue

  const modernDose = entry.fields['常用剂量'] ?? entry.fields['处方'] ?? entry.fields['推荐处方'] ?? ''
  const ancientDose = entry.fields['原书配方'] ?? entry.fields['经典配方'] ?? ''
  const dosage = modernDose !== '' ? modernDose : ancientDose.replace(/。[\s\S]*$/, '')
  const composition = parseDose(dosage)
  const doseBasis = modernDose !== '' ? 'modern' : 'ratio'
  const evidenceText =
    entry.fields['原书方证'] ??
    entry.fields['经典方证'] ??
    entry.fields['方证提要'] ??
    entry.fields['适用人群'] ??
    (entry.intro.includes('适用于') ? entry.intro.split('适用于')[1] : '')
  const sourceText = entry.fields['原书配方'] ?? entry.fields['经典配方'] ?? ''
  const book = /《([^》]+)》/.exec(sourceText)?.[1] ?? '黄煌经方使用手册'
  const isClassic = CLASSIC_OVERRIDE[entry.name] !== undefined || /伤寒论|金匮要略|金匮/.test(book)
  const indicators = deriveIndicators(entry.fields, entry.intro)

  const minIndicators = 2
  if (composition.length < 2 || indicators.length < minIndicators || evidenceText.length < 10) {
    skipped.push(`${entry.name}（组成 ${composition.length}、方证 ${evidenceText === '' ? '无' : '有'}、指标 ${indicators.length}）`)
    continue
  }

  const pattern = evidenceText
    .split(/[。；]/)
    .map((s) => s.trim())
    .filter((s) => s !== '')
    .slice(0, 4)

  seen.add(entry.name)
  generated.push({
    id: entry.name.replace(/[^\u4e00-\u9fa5a-z0-9]/gi, '') + '_hf',
    name: entry.name,
    school: isClassic ? 'jingfang' : 'shifang',
    source: CLASSIC_OVERRIDE[entry.name] ?? `《${book}》（转引自黄煌《经方使用手册》）`,
    six: '杂病',
    doseBasis,
    composition,
    decoction: entry.fields['煎服法'] ?? '按手册常用剂量，水煎分 2–3 次温服。',
    pattern,
    indicators,
    clauses: [
      {
        ref: `黄煌《经方使用手册》·${entry.name}【${entry.fields['原书方证'] !== undefined ? '原书方证' : entry.fields['经典方证'] !== undefined ? '经典方证' : '方证提要'}】`,
        text: evidenceText
      }
    ],
    modern: {
      terms: [],
      conditions: (entry.fields['适用疾病'] ?? '').split(/[、，]/).slice(0, 12)
    },
    safety: (entry.fields['注意事项'] ?? '')
      .split(/[。；]/)
      .map((s) => s.trim())
      .filter((s) => s !== '')
      .slice(0, 4),
    brief: entry.intro.split('。')[0],
    autoPattern: true
  })
}

console.log(`手册方 ${entries.length}，本次新增 ${generated.length}，跳过 ${skipped.length}`)
console.log(`  经方 ${generated.filter((g) => g.school === 'jingfang').length}，后世方 ${generated.filter((g) => g.school === 'shifang').length}`)
if (skipped.length > 0) console.log(`  跳过：${skipped.join('；')}`)

const body = generated.map((g) => `  ${JSON.stringify(g)}`).join(',\n')
writeFileSync(
  'lib/data/formulas-handbook.js',
  `// 《黄煌经方使用手册》补录：后世方、经验方与漏收经方
//
// 由 scripts/gen-shifang.mjs 生成，请勿手改。
// 证据来源与仲景原文不同：school='shifang' 的方以手册「原书方证/经典方证」为依据，
// 开方时会明确标注「非仲景原文」。方证指标由方证文本自动推导，尚未逐方人工校准。

export const HANDBOOK_FORMULAS = [
${body}
]
`
)
console.log('写入 lib/data/formulas-handbook.js')
