// 从康平本《伤寒论》+ 王付方证讲解，补齐宋本伤寒论的方
import { readFileSync, writeFileSync } from 'node:fs'
import { FORMULAS } from '../lib/data/index.js'
import { resolveIdsInText } from '../lib/data/symptoms.js'

const KANGPING = '/home/bian/next/fangzheng/data/康平本伤寒论.md'
const WANGFU = '/home/bian/next/fangzheng/data/王付原文.md'

const clean = (t) => String(t).replace(/__([^_]+)__/g, '$1').replace(/\s+/g, ' ').trim()
/** 只认「X主之」和「宜/与/可与 X」这两种位置，避免把「可与桂枝汤」整体当方名。 */
const MAIN = /([\u4e00-\u9fa5]{2,8}?(?:汤|丸|散|煎|酒))主之/g
const ORDAIN = /(?:宜|可与|与|属|以)\s*([\u4e00-\u9fa5]{2,8}?(?:汤|丸|散|煎|酒))/g
const FANG_BLOCK = /^([\u4e00-\u9fa5]{2,10}?)方[：:]/

// ── 康平本：条文 + 方名 ────────────────────────────────
const clauses = []
{
  const lines = readFileSync(KANGPING, 'utf8').split('\n')
  let current = null
  for (const raw of lines) {
    const line = raw.trim()
    if (line === '') continue
    if (line.startsWith('# ')) {
      const m = /^#\s*(\d+)\s*(.*)$/.exec(line)
      current = { num: m === null ? null : Number(m[1]), text: clean(m === null ? line.slice(2) : m[2]), fang: '' }
      clauses.push(current)
      continue
    }
    if (current !== null && current.fang === '' && line.includes('方：')) current.fang = clean(line)
  }
}

/** 方名 → 条文（取含「方名主之/宜/与」的那一条） */
const byFormula = new Map()
for (const clause of clauses) {
  const names = [
    ...[...clause.text.matchAll(MAIN)].map((m) => m[1]),
    ...[...clause.text.matchAll(ORDAIN)].map((m) => m[1])
  ]
  for (const name of names) {
    if (!byFormula.has(name)) byFormula.set(name, [])
    byFormula.get(name).push(clause)
  }
  const fangName = FANG_BLOCK.exec(clause.fang)
  if (fangName !== null && !byFormula.has(fangName[1])) byFormula.set(fangName[1], [clause])
}

// ── 王付：组成/用法/功用/主治 ──────────────────────────
const wf = new Map()
{
  const lines = readFileSync(WANGFU, 'utf8').split('\n')
  let current = null
  let field = null
  for (const raw of lines) {
    const line = raw.trim()
    if (line === '') continue
    if (line.startsWith('###')) {
      const name = clean(line.replace(/^#+\s*>?\s*/, ''))
      current = { name, fields: {} }
      field = null
      if (!wf.has(name)) wf.set(name, current)
      continue
    }
    if (current === null) continue
    const m = /^【([^】]+)】\s*(.*)$/.exec(line)
    if (m !== null) {
      field = m[1]
      current.fields[field] = clean(m[2])
      continue
    }
    if (field !== null) current.fields[field] = clean(`${current.fields[field] ?? ''} ${line}`)
  }
}

const have = new Set()
for (const f of FORMULAS) {
  have.add(f.name)
  have.add(f.name.replace(/（.*?）/g, ''))
  if (f.alias !== undefined) have.add(f.alias)
}

/** 去掉误抓的动宾短语。 */
const BAD = /^(可与|宜|与|服|作|先|复|更|若|当|属|以|用|进|少少|微微|取|饮|欲|渴|不)/
const missing = [...byFormula.keys()]
  .filter((name) => !have.has(name) && name.length >= 3 && !BAD.test(name))
  .sort()
console.log(`康平本出现方名 ${byFormula.size}，库内已有 ${byFormula.size - missing.length}，缺 ${missing.length}`)
console.log(missing.join('、'))

// ── 名称归一与清洗 ─────────────────────────────────────
const NORMALIZE = {
  麻黄连轺赤子豆汤: '麻黄连轺赤小豆汤',
  汤去桂加茯苓白朮汤: '桂枝去桂加茯苓白术汤',
  去桂加白朮汤: '桂枝去桂加茯苓白术汤',
  茯苓桂枝白朮甘草汤: '苓桂术甘汤',
  旋复代赭汤: '旋覆代赭汤',
  生姜半夏甘草人参汤: '厚朴生姜半夏甘草人参汤',
  葛根黄连黄芩甘草汤: '葛根芩连汤',
  桃仁承气汤: '桃核承气汤',
  白头翁加阿胶甘草汤: '白头翁加甘草阿胶汤',
  大黄附子细辛汤: '大黄附子汤',
  麻黄细辛附子汤: '麻黄附子细辛汤',
  理中汤: '理中丸',
  蜀漆牡蛎龙骨救逆汤: '桂枝救逆汤'
}
const DROP = new Set([
  '承气汤', '柴胡汤', '新加汤', '利膈汤', '利膈汤合甘草干姜汤', '半夏散及汤',
  '一两人参三两新加汤', '半夏苦酒汤', '苦酒汤', '半夏散', '半夏茯苓汤', '杏子汤', '麻黄附子汤'
])

const wanted = [...new Set(
  missing.map((name) => NORMALIZE[name] ?? name).filter((name) => !DROP.has(name) && !have.has(name))
)].sort()

/** 王付【方药】→ [{herb, text:'9g'}] */
function parseWangfuDose(textValue) {
  const out = []
  for (const token of String(textValue).split(/[\s　]+/)) {
    const m = /^([\u4e00-\u9fa5]{1,6}?)(.*)$/.exec(token.trim())
    if (m === null) continue
    const grams = /[（(]([\d.]+)g[）)]/.exec(m[2])
    if (grams === null) {
      const count = /^[^（(]*?([\d一二三四五六七八九十]+)(枚|个|片)/.exec(m[2])
      if (count === null) continue
      out.push({ herb: m[1], text: `${count[1]}${count[2]}` })
      continue
    }
    out.push({ herb: m[1], text: `${grams[1]}g` })
  }
  return out
}

const generated = []
const skipped = []
for (const name of wanted) {
  const wangfu = wf.get(name)
  const clauseList = byFormula.get(name) ?? []
  const clause = clauseList[0]
  const composition = wangfu === undefined ? [] : parseWangfuDose(wangfu.fields['方药'] ?? '')
  const zhuZhi = wangfu?.fields['主治'] ?? ''
  const zheng = /中医病证[：:]\s*([^2]*)/.exec(zhuZhi)?.[1] ?? ''
  const indicators = []
  const seen = new Set()
  const bump = (text, w) => {
    for (const id of resolveIdsInText(text)) {
      if (seen.has(id)) continue
      seen.add(id)
      indicators.push({ id, w })
    }
  }
  bump(zheng, 3)
  bump(clause?.text ?? '', 2)
  if (composition.length < 2 || indicators.length < 2 || clause === undefined) {
    skipped.push(`${name}（组成${composition.length}/指标${indicators.length}/条文${clause === undefined ? '无' : '有'}）`)
    continue
  }
  generated.push({
    id: `${name}_sh`,
    name,
    school: 'jingfang',
    source: '《伤寒论》（康平本）',
    six: '伤寒',
    doseBasis: 'modern',
    autoPattern: true,
    composition,
    decoction: wangfu?.fields['用法'] ?? '水煎，分温再服。',
    pattern: zheng.split(/[。；]/).filter((s) => s.trim() !== '').slice(0, 4),
    indicators: indicators.slice(0, 8),
    clauses: [{ ref: `《伤寒论》（康平本）第${clause.num ?? '?'}条`, text: clause.text }],
    modern: { terms: [], conditions: (/(西医疾病[：:][^]*)/.exec(zhuZhi)?.[1] ?? '').split(/[、，]/).filter(Boolean).slice(0, 8) },
    safety: [],
    brief: (wangfu?.fields['功用'] ?? zheng).split('。')[0]
  })
}

console.log(`\n可生成 ${generated.length}，跳过 ${skipped.length}`)
if (skipped.length > 0) console.log(`跳过：${skipped.join('；')}`)
writeFileSync(
  'lib/data/formulas-shanghan-extra.js',
  `// 宋本《伤寒论》补遗（康平本原文 + 王付方证讲解）
//
// 由 scripts/gen-shanghan.mjs 生成，请勿手改。
// 方证指标由王付【主治】的证候描述自动推导（autoPattern: true，得分打 85 折），
// 尚未逐方人工校准；条文取康平本，条号与宋本不完全对应。

export const SHANGHAN_EXTRA_FORMULAS = [
${generated.map((g) => `  ${JSON.stringify(g)}`).join(',\n')}
]
`
)
console.log('写入 lib/data/formulas-shanghan-extra.js')
