// 把《仲圣方证合一要诀》与《王付原文》结构化为 patternDetail
import { readFileSync, writeFileSync } from 'node:fs'
import { FORMULAS } from '../lib/data/index.js'

const ZHONGSHENG = '/home/bian/next/fangzheng/data/仲圣方证合一要诀.md'
const WANGFU = '/home/bian/next/fangzheng/data/王付原文.md'

/** 去掉 markdown 强调与多余空白。 */
const clean = (text) =>
  String(text)
    .replace(/__([^_]+)__/g, '$1')
    .replace(/\*\*([^*]+)\*\*/g, '$1')
    .replace(/\s+/g, ' ')
    .trim()

// ── 仲圣方证合一要诀 ────────────────────────────────────
const zs = new Map()
{
  const lines = readFileSync(ZHONGSHENG, 'utf8').split('\n')
  let current = null
  for (const raw of lines) {
    const line = raw.trim()
    if (line === '') continue
    if (line.startsWith('# ')) {
      const m = /^#\s*\d+\.\s*([^：:]+)[：:]\s*(.*)$/.exec(line)
      if (m === null) continue
      current = { name: clean(m[1]), brief: clean(m[2]), indications: [], modifications: [], composition: '' }
      if (!zs.has(current.name)) zs.set(current.name, current)
      continue
    }
    if (current === null) continue
    if (line.startsWith('*')) {
      current.modifications.push(clean(line.replace(/^\*+\s*/, '')))
      continue
    }
    if (/克|枚|两/.test(line) && current.composition === '') {
      current.composition = clean(line)
      continue
    }
    if (current.indications.length === 0) current.indications.push(clean(line))
  }
}

// ── 王付原文 ────────────────────────────────────────────
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

/** 方名别名：两书与库内的写法差异。 */
const ALIAS = {
  桂枝加厚朴杏仁汤: '桂枝加厚朴杏子汤',
  桂枝栝蒌汤: '瓜蒌桂枝汤',
  栝蒌桂枝汤: '瓜蒌桂枝汤',
  肾气丸: '肾气丸',
  八味肾气丸: '肾气丸',
  理中丸: '理中丸（汤）',
  人参汤: '理中丸（汤）',
  胶艾汤: '胶艾汤',
  芎归胶艾汤: '胶艾汤',
  麻杏石甘汤: '麻黄杏仁甘草石膏汤',
  葛根芩连汤: '葛根黄芩黄连汤',
  炙甘草汤: '炙甘草汤'
}

const detail = []
let fromZS = 0
let fromWF = 0
for (const f of FORMULAS) {
  const names = [f.name, f.name.replace(/（.*?）/g, ''), ...(f.alias === undefined ? [] : [f.alias])]
  const zsHit = names.map((n) => zs.get(ALIAS[n] ?? n)).find((x) => x !== undefined)
  const wfHit = names.map((n) => wf.get(ALIAS[n] ?? n)).find((x) => x !== undefined)
  if (zsHit === undefined && wfHit === undefined) continue
  if (zsHit !== undefined) fromZS += 1
  if (wfHit !== undefined) fromWF += 1
  detail.push({
    id: f.id,
    name: f.name,
    ...(zsHit === undefined
      ? {}
      : {
          brief: zsHit.brief,
          indications: zsHit.indications,
          modifications: zsHit.modifications
        }),
    ...(wfHit === undefined
      ? {}
      : {
          function: wfHit.fields['功用'] ?? '',
          pattern: wfHit.fields['主治'] ?? '',
          reading: wfHit.fields['导读'] ?? '',
          analysis: wfHit.fields['用药分析'] ?? ''
        })
  })
}

console.log(`仲圣要诀：${zs.size} 首，命中库内 ${fromZS}`)
console.log(`王付原文：${wf.size} 首，命中库内 ${fromWF}`)
console.log(`合并 patternDetail：${detail.length} 首`)

const body = detail
  .map((d) => `  ${JSON.stringify(d)}`)
  .join(',\n')

writeFileSync(
  'lib/data/pattern-detail.js',
  `// 方证要点与讲解（patternDetail）
//
// 由 scripts/gen-pattern-detail.mjs 从
//   《仲圣方证合一要诀》：一句话方证、适用疾病、加减
//   《王付原文》：功用、中医病证（方证要点）、西医疾病、用药分析、导读
// 合并生成，请勿手改。用于辨证卡与方剂详情，不参与打分与开方门槛。

export const PATTERN_DETAIL = [
${body}
]

const BY_ID = new Map(PATTERN_DETAIL.map((d) => [d.id, d]))

/** 取某方的方证详解。 */
export function patternDetail(id) {
  return BY_ID.get(id)
}
`
)
console.log('写入 lib/data/pattern-detail.js')
