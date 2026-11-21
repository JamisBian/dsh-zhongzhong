// 解析《医学衷中参西录》：医方 177 首 + 药物 79 味（单方）
//
// 只做「原文 → 结构化 JSON」，不做辨证指标；指标在 gen-zhongzhong.mjs 里
// 按主治文字 + 人工校准生成。原文里的 OCR 缺字（黄/萸肉/于术/大黄芪）在这里修。
//
// 用法：node scripts/parse-zhongzhong.mjs

import { readFileSync, writeFileSync } from 'node:fs'
import { dirname, join, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { canonicalHerb } from '../lib/data/herbs.js'

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const SRC = join(root, 'data/医学衷中参西录.txt')
const OUT = join(root, 'data/zhongzhong-index.json')
const text = readFileSync(SRC, 'utf8')
const medStart = text.indexOf('二、药物')
if (medStart < 0) throw new Error('找不到「二、药物」分隔')
const medPart = text.slice(0, medStart)
const drugPart = text.slice(medStart)

const CN_DIGIT = { 零: 0, 一: 1, 二: 2, 两: 2, 三: 3, 四: 4, 五: 5, 六: 6, 七: 7, 八: 8, 九: 9 }

/** 中文数字 → number（支持 十/二十/一百/半）。 */
export function cnNumber(input) {
  const s = String(input ?? '').trim()
  if (s === '') return null
  if (s === '半') return 0.5
  if (/^\d+(?:\.\d+)?$/.test(s)) return Number(s)
  if (s.includes('十')) {
    const [a, b] = s.split('十')
    const tens = a === '' ? 1 : CN_DIGIT[a]
    const ones = b === '' ? 0 : CN_DIGIT[b]
    if (tens === undefined || ones === undefined) return null
    return tens * 10 + ones
  }
  let value = 0
  for (const ch of s) {
    if (ch === '半') {
      value += 0.5
      continue
    }
    const d = CN_DIGIT[ch]
    if (d === undefined) return null
    value = value * 10 + d
  }
  return value
}

const UNIT = '两钱分斤枚个片条具粒对只张叶茎根支滴厘瓦撮升合寸尺丸锭块朵足'
const UNIT_RE = new RegExp(`(${UNIT})`)

/**
 * 解析剂量文字，例如：
 *   一两、钱半、二两半、一钱五分、各二钱、八十一枚、不拘多少、等分
 * @returns {{parts:{unit:string,value:number}[], note:string, prep:string}}
 */
export function parseDose(input) {
  const raw = String(input ?? '').replace(/\s+/g, '')
  if (raw === '') return { parts: [], note: '', prep: '' }
  if (/不拘多少|不拘|少许|适量|随证|酌用|分量用时斟酌|多备|任意|不论多少/.test(raw)) {
    return { parts: [], note: raw.split(/[，,]/)[0], prep: '' }
  }
  if (/等分/.test(raw)) return { parts: [{ unit: '等分', value: 1 }], note: '等分', prep: '' }
  const parts = []
  // 剂量可能写在炮制说明之后：「萸肉(去净核,一两)」「生龙骨(捣细,六钱)」
  const re = /(半|[一二两三四五六七八九十百\d]+(?:\.\d+)?)\s*(两|钱|分|斤|枚|个|片|条|具|粒|对|只|张|叶|茎|根|支|滴|厘|瓦|撮|升|合|寸|尺|丸|锭|块|朵|足)/g
  let doseText = ''
  let prevEnd = 0
  for (const m of raw.matchAll(re)) {
    // 已经取到剂量后，中间若出现「如无…可用…代之」「或用…」这类替代说明，后面的数字不是本方用量
    if (parts.length > 0) {
      const gap = raw.slice(prevEnd, m.index)
      if (/[如或代另再共每可用至之]/.test(gap)) break
    }
    const value = m[1] === '半' ? 0.5 : cnNumber(m[1])
    if (value === null) continue
    const after = raw.slice(m.index + m[0].length)
    parts.push({ unit: m[2], value: after.startsWith('半') ? value + 0.5 : value })
    doseText += m[0]
    prevEnd = m.index + m[0].length
  }
  if (parts.length === 0) {
    // 「钱半」「两半」这种数字在单位后的写法
    const m = /(半|[一二两三四五六七八九十百\d]+)?(两|钱|分|斤|枚|个|片|条|具|粒|对|只|张|叶|茎|根|支|滴|厘|瓦)(半?)/.exec(raw)
    if (m !== null) {
      const value = m[1] === undefined || m[1] === '' ? 1 : cnNumber(m[1])
      if (value !== null) {
        parts.push({ unit: m[2], value: value + (m[3] === '半' ? 0.5 : 0) })
        doseText += m[0]
      }
    }
  }
  const prep = raw.replace(doseText, '').replace(/^[，,、；;\s]+|[，,、；;\s]+$/g, '').replace(/[，,]{2,}/g, '，')
  return { parts, note: '', prep }
}

// ── 医方分节 ────────────────────────────────────────────────
const sectionRe = /一、医方\\?\(([一二三四五六七八九十]+)\)(治[^\n　0-9]{1,10}?方)/g
const sections = [...medPart.matchAll(sectionRe)].map((m) => ({ no: m[1], name: m[2], index: m.index, end: m.index + m[0].length }))

const NAME_FIX = {
  加味黄五物汤: '加味黄芪五物汤',
  鸡汤: '鸡胵汤',
  薯蓣苜汤: '薯蓣芣苢汤',
  牛黄芪: '牛黄'
}

/** 从「属性：」前进 50 字里回溯方名。 */
function nameBefore(body, at) {
  const before = body.slice(Math.max(0, at - 60), at)
  const m = /(?:^|[\n　\s。])(?:(\d{1,2})[．.]\s*)?([\u4e00-\u9fa5]{2,16})\s*$/.exec(before)
  if (m === null) return undefined
  const rawName = m[2].trim()
  if (rawName === '' || rawName.length > 14) return undefined
  return { number: m[1] ?? '', rawName, start: at - rawName.length - (m[1] === undefined ? 0 : m[1].length + 1) }
}

const DOSEY = /[两钱分斤枚个片条具粒撮寸尺张叶茎根支滴厘瓦升合丸锭块朵足]/
const doseParenRe = /([\u4e00-\u9fa5]{1,18})\s*[（(]([^（）()]{1,60}?)[）)]/g

const PREP_CHARS = /[生熟炙炒清鲜净真大小野川广怀醋酒蜜炮制煅飞朱血乌白黄黑青嫩干法水于云潞淡明粉镜面油酸杭台辽硫猪羊]/

/**
 * 把药名 token 的前缀拆成「炮制字 + 正文」。
 * 生鸡内金 → {prep:'生', prose:''}；治中风防风 → {prep:'', prose:'治中风'}。
 */
function splitPrep(prefix) {
  if (typeof prefix !== 'string' || prefix === '') return { prep: '', prose: '' }
  const tail = /[生熟炙炒清鲜净真大小野川广怀醋酒蜜炮制煅飞朱血乌白黄黑青嫩干法水于云潞淡明粉镜面油酸杭台辽硫猪羊]+$/.exec(prefix)
  if (tail === null) return { prep: '', prose: prefix }
  const value = tail[0]
  const prep = value.length <= 4 ? value : value.slice(-2)
  return { prep, prose: prefix.slice(0, prefix.length - prep.length) }
}

/** 从主治文字里解析「药名(剂量)」连续段。 */
function parseComposition(attr) {
  const pairs = []
  for (const m of attr.matchAll(doseParenRe)) {
    const token = m[1]
    const inner = m[2]
    if (!DOSEY.test(inner) && !/等分|不拘|少许|适量/.test(inner)) continue
    const info = canonicalHerb(token)
    if (info === undefined) continue
    const dose = parseDose(inner)
    if (dose.parts.length === 0 && dose.note === '') continue
    const split = splitPrep(info.prefix ?? '')
    pairs.push({
      tokenStart: m.index,
      start: m.index + split.prose.length,
      end: m.index + m[0].length,
      token,
      herb: info.herb,
      prefix: split.prep,
      inner,
      dose
    })
  }
  if (pairs.length === 0) return { composition: [], compositionRaw: '', zhuzhi: attr, usage: '', rest: attr }
  // 找最长的「连续」段：两味药之间只允许空白/逗号/顿号
  let best = []
  let current = []
  for (const pair of pairs) {
    if (current.length === 0) {
      current = [pair]
      continue
    }
    const prev = current[current.length - 1]
    const gap = attr.slice(prev.end, pair.tokenStart)
    if (/^[\s　,，、;；]*$/.test(gap)) current.push(pair)
    else {
      if (current.length > best.length) best = current
      current = [pair]
    }
  }
  if (current.length > best.length) best = current
  const first = best[0]
  const last = best[best.length - 1]
  const zhuzhi = attr.slice(0, first.start)
  const compositionRaw = attr.slice(first.start, last.end)
  const rest = attr.slice(last.end)
  const usageEnd = rest.indexOf('。')
  const usage = usageEnd === -1 ? rest.slice(0, 240) : rest.slice(0, usageEnd + 1)
  return { composition: best, compositionRaw, zhuzhi, usage, rest }
}

const formulas = []
for (let i = 0; i < sections.length; i += 1) {
  const section = sections[i]
  const bodyStart = section.end
  const bodyEnd = i + 1 < sections.length ? sections[i + 1].index : medPart.length
  const body = medPart.slice(bodyStart, bodyEnd)
  const marks = []
  for (const m of body.matchAll(/属性：/g)) {
    const at = m.index
    const named = nameBefore(body, at)
    if (named === undefined) continue
    const after = body.slice(at + 3)
    const nextMark = body.indexOf('属性：', at + 3)
    const attr = nextMark === -1 ? after : after.slice(0, nextMark - (at + 3))
    // 不是主治的「属性」段（例如敦复汤后的问答重复标题）跳过：
    // 允许「(附∶…)治…」「前证之剧者」「治同前证」，也允许开头就是组成的丸散。
    const head = attr.slice(0, 120)
    const treatmentLike = /治|主|疗|消|补|清|通|止|安|固|生|化|开|降|升|镇|养|益|利|除|解|散|攻|下|吐|和|温|凉|热|寒|调/.test(head)
    const doseLike = /[一-龥]{1,10}\s*[（(][^（）()]{0,40}[两钱分斤枚个片条具粒撮寸尺张叶茎根支滴厘瓦升合][^（）()]{0,40}[）)]/.test(head)
    if (!treatmentLike && !doseLike) continue
    marks.push({ at, ...named, attrStart: at + 3, attrEnd: nextMark === -1 ? body.length : nextMark })
  }
  marks.sort((a, b) => a.at - b.at)
  const seen = new Set()
  for (let j = 0; j < marks.length; j += 1) {
    const mark = marks[j]
    const name = NAME_FIX[mark.rawName] ?? mark.rawName.replace(/\s+/g, '')
    if (seen.has(name)) continue
    seen.add(name)
    const next = marks[j + 1]
    const blockEnd = next === undefined ? body.length : next.start
    const block = body.slice(mark.start, blockEnd)
    const attr = body.slice(mark.attrStart, mark.attrEnd)
    const parsed = parseComposition(attr)
    formulas.push({
      sectionNo: section.no,
      section: section.name,
      number: mark.number,
      name,
      rawName: mark.rawName,
      zhuzhi: parsed.zhuzhi.trim(),
      compositionRaw: parsed.compositionRaw,
      usage: parsed.usage.trim(),
      explanation: parsed.rest.trim().slice(0, 1200),
      composition: parsed.composition.map((p) => ({
        herb: p.herb,
        prep: [p.prefix, p.dose.prep].filter((x) => x !== '').join('；'),
        dose: p.dose.parts,
        doseNote: p.dose.note,
        raw: `${p.token}(${p.inner})`
      })),
    })
  }
}

// ── 药物篇（单方） ──────────────────────────────────────────
const drugRe = /二、药物\\?(\d{1,2})[．.]\s*([^\n属]{2,24}?)(?:解)?属性：/g
const drugMarks = [...drugPart.matchAll(drugRe)].map((m) => ({ no: Number(m[1]), rawName: m[2].trim(), index: m.index, attrStart: m.index + m[0].length }))
const drugs = []
const seenDrug = new Set()
for (let i = 0; i < drugMarks.length; i += 1) {
  const mark = drugMarks[i]
  // 「人参解附∶人参形状考」这类附注先去掉；「朴硝、硝石」「附子、乌头、天雄」拆成多味
  let baseName = mark.rawName
    .replace(/^附[∶:]/, '')
    .replace(/附[∶:].*$/, '')
    .replace(/解$/, '')
    .trim()
  const names = baseName.split(/[、,，]/).map((item) => item.trim()).filter((item) => item !== '')
  if (names.length === 0) continue
  const end = i + 1 < drugMarks.length ? drugMarks[i + 1].index : drugPart.length
  const raw = drugPart.slice(mark.attrStart, end)
  const sentences = raw.split(/(?<=[。；])/).map((s) => s.trim()).filter((s) => s !== '')
  const indications = sentences.filter((s) => /治|主|疗|善|能/.test(s)).slice(0, 6)
  const usage = sentences.filter((s) => /煎汤|煮汁|为末|冲服|单用|一味|每服|泡服|含化|外敷|点眼|嚼服|送服|作粥|代茶/.test(s)).slice(0, 6)
  for (const name of names) {
    const canonical = canonicalHerb(name)?.herb ?? name
    if (seenDrug.has(canonical)) continue
    seenDrug.add(canonical)
    drugs.push({
      no: mark.no,
      name: canonical,
      source: `《医学衷中参西录·药物·${canonical}解》`,
      indications,
      usage,
      text: raw
    })
  }
}

// ── 原文以「即前方加…」写成的方：从底方推导组成 ────────────────
const byName = new Map(formulas.map((f) => [f.name, f]))
const addTo = (name, baseName, additions) => {
  const target = byName.get(name)
  const base = byName.get(baseName)
  if (target === undefined || base === undefined) return
  target.composition = [...base.composition, ...additions]
  target.derivedFrom = baseName
  target.zhuzhi = target.zhuzhi || base.zhuzhi
}
addTo('三鲜饮', '二鲜饮', [{ herb: '小蓟', prep: '鲜', dose: [{ unit: '两', value: 2 }], doseNote: '', raw: '鲜小蓟根(二两)' }])
addTo('荡痰加甘遂汤', '荡痰汤', [{ herb: '甘遂', prep: '', dose: [{ unit: '钱', value: 2 }], doseNote: '', raw: '甘遂末(二钱)' }])
addTo('薯蓣鸡子黄粥', '薯蓣粥', [{ herb: '鸡子黄', prep: '熟', dose: [{ unit: '枚', value: 3 }], doseNote: '', raw: '熟鸡子黄(三枚)' }])
// 滋阴宣解汤 = 宣解汤 + 生山药一两，甘草改三钱
{
  const target = byName.get('滋阴宣解汤')
  const base = byName.get('宣解汤')
  if (target !== undefined && base !== undefined) {
    const comp = base.composition.map((p) => ({ ...p }))
    const gancao = comp.find((p) => p.herb === '甘草')
    if (gancao !== undefined) gancao.dose = [{ unit: '钱', value: 3 }]
    comp.push({ herb: '山药', prep: '生', dose: [{ unit: '两', value: 1 }], doseNote: '', raw: '生山药(一两)' })
    target.composition = comp
    target.derivedFrom = '宣解汤'
  }
}
// 滋阴清燥汤 = 滋阴宣解汤 - 连翘、蝉蜕
{
  const target = byName.get('滋阴清燥汤')
  const base = byName.get('滋阴宣解汤')
  if (target !== undefined && base !== undefined) {
    target.composition = base.composition.filter((p) => p.herb !== '连翘' && p.herb !== '蝉蜕').map((p) => ({ ...p }))
    target.derivedFrom = '滋阴宣解汤'
  }
}
// 原文里没有括号剂量的方：按原书补录
{
  const tie = byName.get('一味铁养汤')
  if (tie !== undefined) tie.composition = [{ herb: '铁锈', prep: '', dose: [], doseNote: '磨取铁锈水，煎汤服', raw: '长锈生铁，和水磨取其锈' }]
  const yanggan = byName.get('羊肝猪胆丸')
  if (yanggan !== undefined) {
    yanggan.composition = [
      { herb: '羊肝', prep: '', dose: [{ unit: '具', value: 1 }], doseNote: '', raw: '羊肝(一具)' },
      { herb: '猪胆汁', prep: '', dose: [], doseNote: '和为丸', raw: '猪胆汁和为丸' }
    ]
  }
  const qingjiang = byName.get('清降汤')
  if (qingjiang !== undefined) {
    qingjiang.composition = [
      { herb: '山药', prep: '生', dose: [{ unit: '两', value: 1 }], doseNote: '', raw: '生山药(一两)' },
      { herb: '半夏', prep: '清', dose: [{ unit: '钱', value: 3 }], doseNote: '', raw: '清半夏(三钱)' },
      { herb: '山萸肉', prep: '', dose: [{ unit: '钱', value: 5 }], doseNote: '', raw: '山萸肉(五钱)' },
      { herb: '赭石', prep: '生', dose: [{ unit: '钱', value: 6 }], doseNote: '', raw: '生赭石(六钱)' },
      { herb: '牛蒡子', prep: '炒', dose: [{ unit: '钱', value: 2 }], doseNote: '', raw: '炒牛蒡子(二钱)' },
      { herb: '白芍', prep: '', dose: [{ unit: '钱', value: 4 }], doseNote: '', raw: '白芍药(四钱)' },
      { herb: '甘草', prep: '', dose: [{ unit: '钱', value: 1.5 }], doseNote: '', raw: '甘草(钱半)' }
    ]
    qingjiang.zhuzhi = '治因吐衄不止，致阴分亏损，不能潜阳而作热，不能纳气而作喘。甚或冲气因虚上干，为呃逆、眩晕；心血因虚甚不能内荣，为怔忡、惊悸不寐；或咳逆，或自汗，诸虚证蜂起之候。'
  }
  // 原文把附方写在「按」里 / 组成写法特殊：按原书校正
  const maru = byName.get('古方马乳饮')
  if (maru !== undefined) {
    maru.composition = [{ herb: '马乳', prep: '青白', dose: [], doseNote: '随挤随服，早午晚各一次', raw: '青白马乳' }]
  }
  const huafu = byName.get('化腐生肌散')
  if (huafu !== undefined && !huafu.composition.some((p) => p.herb === '朱砂')) {
    huafu.composition.push({ herb: '朱砂', prep: '', dose: [{ unit: '分', value: 2 }], doseNote: '', raw: '砂(二分)' })
  }
  const laifu = byName.get('一味莱菔子汤')
  if (laifu !== undefined) {
    laifu.composition = [{ herb: '莱菔子', prep: '生熟各半', dose: [{ unit: '两', value: 2 }], doseNote: '生者一两、熟者一两', raw: '莱菔子(生者一两，熟者一两)' }]
  }
  const congbai = byName.get('通结用葱白熨法')
  if (congbai !== undefined) {
    congbai.composition = [
      { herb: '葱白', prep: '', dose: [{ unit: '斤', value: 4 }], doseNote: '', raw: '大葱白(四斤)' },
      { herb: '醋', prep: '干米', dose: [], doseNote: '多备待用', raw: '干米醋(多备待用)' }
    ]
  }
  // 牙疳散：原文直接列组成，没有「治…」句
  const yagan = byName.get('牙疳散')
  if (yagan !== undefined && yagan.zhuzhi === '') yagan.zhuzhi = '治牙疳，牙龈腐化疼痛。'
  const sousou = byName.get('搜风汤')
  if (sousou !== undefined && sousou.zhuzhi === '') sousou.zhuzhi = '治中风。'
}

// 排除纯外治/手法条目（不是方剂），并按「篇+方名」全局去重
const METHOD_ONLY = new Set(['治痰点天突穴法', '牙疳敷藤黄法'])
const byKey = new Map()
for (const f of formulas) {
  if (METHOD_ONLY.has(f.name)) continue
  const key = `${f.sectionNo}:${f.name}`
  const existing = byKey.get(key)
  if (existing === undefined || f.composition.length > existing.composition.length) byKey.set(key, f)
}
const finalFormulas = [...byKey.values()]

const payload = {
  book: '医学衷中参西录',
  author: '张锡纯',
  sections: sections.map((s) => ({ no: s.no, name: s.name })),
  formulas: finalFormulas,
  drugs
}
writeFileSync(OUT, JSON.stringify(payload, null, 2), 'utf8')

// ── 诊断 ────────────────────────────────────────────────────
const noComp = finalFormulas.filter((f) => f.composition.length === 0)
console.log(`医方：${finalFormulas.length} 首；有组成：${finalFormulas.length - noComp.length}；无组成：${noComp.length}`)
for (const f of noComp) console.log(`  无组成：${f.sectionNo}·${f.section}·${f.name}｜${f.zhuzhi.slice(0, 70)}`)
const compCounts = finalFormulas.map((f) => f.composition.length).filter((n) => n > 0)
console.log(`组成药味：最少 ${Math.min(...compCounts)}，最多 ${Math.max(...compCounts)}，平均 ${(compCounts.reduce((a, b) => a + b, 0) / compCounts.length).toFixed(1)}`)
console.log(`药物（单方）：${drugs.length} 味`)
const odd = finalFormulas.filter((f) => f.composition.some((p) => p.dose.length === 0 && p.doseNote === ''))
console.log(`剂量为空：${odd.length} 首`)
console.log(`写入 ${OUT}`)
