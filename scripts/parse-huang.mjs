// 解析《黄煌经方使用手册》：方名 → 体质/疾病谱/加减/注意事项/常用剂量
import { readFileSync, writeFileSync } from 'node:fs'
import { FORMULAS } from '../lib/data/index.js'

const SRC = '/home/bian/next/fangzheng/data/黄煌经方使用手册.md'
const lines = readFileSync(SRC, 'utf8').split('\n')

const FIELDS = ['经典配方', '常用剂量', '推荐处方', '煎服法', '经典方证', '体质要求', '适用疾病', '加减法', '注意事项', '适用人群', '方证提要']
const entries = new Map()
let current = null
let field = null

for (const raw of lines) {
  const line = raw.trim()
  if (line === '') continue
  if (line.startsWith('# ')) {
    const name = line.slice(2).replace(/[【】]/g, '').trim()
    current = { name, fields: {} }
    field = null
    if (!entries.has(name)) entries.set(name, current)
    continue
  }
  if (current === null) continue
  const m = /^【([^】]+)】\s*(.*)$/.exec(line)
  if (m !== null && (FIELDS.includes(m[1]) || m[1].endsWith('法') || m[1].endsWith('求') || m[1].endsWith('病'))) {
    field = m[1]
    current.fields[field] = m[2].trim()
    continue
  }
  if (field !== null) current.fields[field] = (current.fields[field] ?? '') + line
}

console.log(`黄煌手册：${entries.size} 首方`)

/** 我方与黄煌方名的差异。 */
const ALIAS = {
  '理中丸（汤）': '理中丸',
  '麻黄杏仁甘草石膏汤': '麻杏石甘汤',
  '葛根黄芩黄连汤': '葛根芩连汤',
  '苓桂术甘汤': '苓桂术甘汤'
}

const notes = {}
let hit = 0
for (const f of FORMULAS) {
  const key = ALIAS[f.name] ?? f.name
  const entry = entries.get(key) ?? entries.get(f.name.replace(/（.*?）/g, ''))
  if (entry === undefined) continue
  hit += 1
  const fields = entry.fields
  notes[f.id] = {
    name: f.name,
    dosage: fields['常用剂量'] ?? fields['推荐处方'] ?? '',
    constitution: fields['体质要求'] ?? fields['适用人群'] ?? '',
    diseases: fields['适用疾病'] ?? '',
    modifications: fields['加减法'] ?? '',
    cautions: fields['注意事项'] ?? '',
    classicEvidence: fields['经典方证'] ?? ''
  }
}
console.log(`匹配到 ${hit} 首（占库内 ${FORMULAS.length}）`)
const missing = FORMULAS.filter((f) => notes[f.id] === undefined).map((f) => f.name)
console.log(`未匹配 ${missing.length}：${missing.slice(0, 30).join('、')}`)

writeFileSync('data/huang-notes.json', JSON.stringify(notes, null, 1))
console.log('写入 data/huang-notes.json')
