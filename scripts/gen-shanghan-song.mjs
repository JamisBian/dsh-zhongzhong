// 按宋本编次补全伤寒六经方（原文取康平本，组成与方证取王付方证讲解）
import { readFileSync, writeFileSync } from 'node:fs'
import { FORMULAS } from '../lib/data/index.js'
import { resolveIdsInText } from '../lib/data/symptoms.js'

const KANGPING = '/home/bian/next/fangzheng/data/康平本伤寒论.md'
const WANGFU = '/home/bian/next/fangzheng/data/王付原文.md'
const clean = (t) => String(t).replace(/__([^_]+)__/g, '$1').replace(/\s+/g, ' ').trim()

/** 宋本编次：方名 → 六经（篇名用于引用） */
const SONG = {
  太阳: [
    '桂枝去芍药汤', '桂枝去芍药加附子汤', '桂枝麻黄各半汤', '桂枝二麻黄一汤', '桂枝二越婢一汤',
    '桂枝去桂加茯苓白术汤', '葛根加半夏汤', '干姜附子汤', '桂枝新加汤', '桂枝甘草汤',
    '厚朴生姜半夏甘草人参汤', '芍药甘草附子汤', '茯苓四逆汤', '茯苓甘草汤', '栀子甘草豉汤',
    '栀子生姜豉汤', '栀子干姜汤', '大陷胸汤', '大陷胸丸', '三物白散', '柴胡加芒硝汤',
    '桂枝甘草龙骨牡蛎汤', '抵当汤', '抵当丸', '文蛤散', '蜜煎导'
  ],
  少阴: ['通脉四逆汤', '白通汤', '白通加猪胆汁汤', '附子汤', '桃花汤', '甘草汤', '苦酒汤', '半夏散及汤', '猪肤汤', '桔梗汤'],
  厥阴: ['当归四逆加吴茱萸生姜汤', '麻黄升麻汤', '干姜黄芩黄连人参汤'],
  太阴: ['桂枝加芍药汤', '桂枝加大黄汤'],
  霍乱: ['四逆加人参汤', '通脉四逆加猪胆汁汤'],
  差后: ['枳实栀子豉汤', '牡蛎泽泻散', '烧裈散']
}
const CHAPTER = {
  太阳: '辨太阳病脉证并治',
  少阴: '辨少阴病脉证并治',
  厥阴: '辨厥阴病脉证并治',
  太阴: '辨太阴病脉证并治',
  霍乱: '辨霍乱病脉证并治',
  差后: '辨阴阳易差后劳复病脉证并治'
}
/** 王付/康平本里的异名 */
const ALIAS = { 桂枝新加汤: '桂枝加芍药生姜各一两人参三两新加汤', 三物白散: '三物小白散' }

// ── 康平本 ────────────────────────────────────────────
const MAIN = /([\u4e00-\u9fa5]{2,8}?(?:汤|丸|散|煎|酒))主之/g
const ORDAIN = /(?:宜|可与|与|属|以)\s*([\u4e00-\u9fa5]{2,8}?(?:汤|丸|散|煎|酒))/g
const BLOCK = /^([\u4e00-\u9fa5]{2,10}?)方[：:]/
const clauses = new Map()
{
  const lines = readFileSync(KANGPING, 'utf8').split('\n')
  let current = null
  for (const raw of lines) {
    const line = raw.trim()
    if (line === '') continue
    if (line.startsWith('# ')) {
      const m = /^#\s*(\d+)\s*(.*)$/.exec(line)
      current = { num: m === null ? null : Number(m[1]), text: clean(m === null ? line.slice(2) : m[2]), fang: '' }
      for (const mm of current.text.matchAll(MAIN)) if (!clauses.has(mm[1])) clauses.set(mm[1], current)
      for (const mm of current.text.matchAll(ORDAIN)) if (!clauses.has(mm[1])) clauses.set(mm[1], current)
      continue
    }
    if (current !== null && current.fang === '') {
      const b = BLOCK.exec(line)
      if (b !== null) {
        current.fang = clean(line)
        if (!clauses.has(b[1])) clauses.set(b[1], current)
      }
    }
  }
}

// ── 王付 ──────────────────────────────────────────────
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

/** 炮制后缀，解析药名时剥掉。 */
const PREP = /(炮制|炮|生用|生|炙|炒|煅|酒洗|汤洗|去皮|去心|去芦|去节|切|擘|碎|打碎|研|洗)+$/

/**
 * 王付【方药】的真实写法是「药名炮制，再，剂量（克数）」：
 *   附子炮，去皮，破八片二枚（10g ）   桂枝去皮，三两（9g）   大枣擘，十二枚
 * 所以按空格切词后：克数取括号、药名取第一个逗号前、剂量取词尾的数字+单位。
 */
function parseDose(raw) {
  const out = []
  const seen = new Set()
  const text = String(raw).replace(/[（(]\s*/g, '（').replace(/\s*[）)]/g, '）')
  for (const token of text.split(/[\s　]+/)) {
    const piece = token.trim()
    if (piece === '') continue
    const grams = /（([\d.]+)\s*g）/.exec(piece)
    const body = piece.replace(/（[^）]*）/g, '')
    if (body === '') continue
    const dose = /([\d一二三四五六七八九十百半]+)\s*(两|铢|枚|升|合|钱匕|钱|茎|个|片|把|具|分|斤)?\s*$/.exec(body)
    if (dose === null) continue
    const head = body.slice(0, dose.index).split(/[，,]/)[0]
    const herb = head.replace(PREP, '').trim()
    if (herb.length < 1 || herb.length > 6) continue
    if (/^(上|右|以|水|煮|取|内|去|温|服|分|若|加|各|方|味)$/.test(herb)) continue
    if (seen.has(herb)) continue
    seen.add(herb)
    out.push({ herb, text: grams === null ? `${dose[1]}${dose[2] ?? '分'}` : `${grams[1]}g` })
  }
  return out
}

/** 已在 formulas-shanghan-manual.js 手工写定的方，一律不重复生成。 */
const MANUAL = new Set([
  '桂枝新加汤',
  '厚朴生姜半夏甘草人参汤',
  '大陷胸丸',
  '三物白散',
  '蜜煎导',
  '半夏散及汤',
  '猪肤汤',
  '当归四逆加吴茱萸生姜汤',
  '干姜黄芩黄连人参汤',
  '桂枝加大黄汤',
  '牡蛎泽泻散',
  '生姜泻心汤',
  '赤石脂禹余粮汤',
  '桂枝人参汤',
  '黄芩加半夏生姜汤'
])

// 本脚本上次生成的条目（中文名 + _sh）要从 have 里排掉，否则重跑会把自己当成「已存在」；
// 手工补录的方是拼音 id（如 daxianxiong_wan_sh），必须保留。
const isGenerated = (x) => /^[\u4e00-\u9fa5].*_sh$/.test(String(x.id))

const have = new Set()
for (const f of FORMULAS.filter((x) => !isGenerated(x))) {
  have.add(f.name.replace(/（.*?）/g, ''))
  if (f.alias !== undefined) have.add(f.alias)
}

const generated = []
const skipped = []
for (const [six, names] of Object.entries(SONG)) {
  for (const name of names) {
    if (have.has(name) || MANUAL.has(name)) continue
    const wfName = ALIAS[name] ?? name
    const wangfu = wf.get(wfName) ?? wf.get(name)
    const clause = clauses.get(wfName) ?? clauses.get(name)
    const composition = parseDose(wangfu?.fields['方药'] ?? clause?.fang ?? '')
    const zhuZhi = wangfu?.fields['主治'] ?? ''
    const zheng = /中医病证[：:]\s*([^]*?)(?:2\.|西医疾病|$)/.exec(zhuZhi)?.[1] ?? ''
    const indicators = []
    const seen = new Set()
    for (const [text, weight] of [[zheng, 3], [clause?.text ?? '', 2]]) {
      for (const id of resolveIdsInText(text)) {
        if (seen.has(id)) continue
        seen.add(id)
        indicators.push({ id, w: weight })
      }
    }
    if (composition.length < 1 || indicators.length < 2 || clause === undefined) {
      skipped.push(`${name}（组成${composition.length}/指标${indicators.length}/条文${clause === undefined ? '无' : '有'}）`)
      continue
    }
    generated.push({
      id: `${name}_sh`,
      name,
      school: 'jingfang',
      source: `《伤寒论·${CHAPTER[six]}》`,
      six,
      doseBasis: 'modern',
      autoPattern: true,
      generated: true,
      composition,
      decoction: wangfu?.fields['用法'] ?? '水煎，分温再服。',
      pattern: (zheng.split(/[。；]/).filter((s) => s.trim() !== '').slice(0, 4).length > 0
        ? zheng.split(/[。；]/).filter((s) => s.trim() !== '').slice(0, 4)
        : [(wangfu?.fields['功用'] ?? clause.text.slice(0, 40)).trim()]),
      indicators: indicators.slice(0, 8),
      clauses: [{ ref: `《伤寒论·${CHAPTER[six]}》`, text: clause.text }],
      modern: { terms: [], conditions: [] },
      safety: [],
      brief: (wangfu?.fields['功用'] ?? zheng).split('。')[0]
    })
  }
}

console.log(`生成 ${generated.length} 首，跳过 ${skipped.length}`)
if (skipped.length > 0) console.log(`跳过：${skipped.join('；')}`)
console.log(generated.map((g) => `${g.name}[${g.six}] ${g.composition.length}味/${g.indicators.length}症`).join('\n'))

writeFileSync(
  'lib/data/formulas-shanghan-song.js',
  `// 宋本《伤寒论》补遗（按六经编次）
//
// 由 scripts/gen-shanghan-song.mjs 生成，请勿手改。
// 原文取康平本（条号与宋本不同，故只标篇名，不标条号）；
// 组成、功用、主治取王付《伤寒杂病论》方证讲解。
// 方证指标由王付【主治】自动推导（autoPattern: true，得分打 85 折），待人工校准。

export const SHANGHAN_SONG_FORMULAS = [
${generated.map((g) => `  ${JSON.stringify(g)}`).join(',\n')}
]
`
)
console.log('写入 lib/data/formulas-shanghan-song.js')
