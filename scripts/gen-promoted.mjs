// 从《金匮要略》原文索引生成「已核方」的组成片段（供人工补方证）。
import { readFileSync } from 'node:fs'
const index = JSON.parse(readFileSync('data/jingui-index.json', 'utf8'))

const norm = (t) => t.replace(/黄耆|黄蓍/g, '黄芪').replace(/朮/g, '术').replace(/蚘/g, '蛔').replace(/栝蒌/g, '瓜蒌')
const clauses = index.chapters.flatMap((c) => c.clauses.filter((x) => x.text !== undefined).map((x) => ({ chapter: c.title, ...x })))

/** 把「鳖甲十二分（炙） 乌扇三分（烧）」拆成 [{herb,text,prep}] */
export function parseComposition(raw) {
  let text = norm(String(raw)).replace(/^[^：]*：/, '').trim()
  // 砍掉「上X味…」之后的煎服法
  const cut = text.search(/上[一二三四五六七八九十]+味/)
  if (cut > 0) text = text.slice(0, cut)
  const parts = []
  const pending = []
  const TOKEN = /^([\u4e00-\u9fa5]{1,6}?)((?:各)?[一二三四五六七八九十百千半\d]+(?:\.\d+)?(?:分|两|钱|铢|斤|升|合|枚|个|片|把|茎|具|条|寸|尺)?)(（[^）]*）)?$/
  for (const token of text.split(/\s+/).filter((t) => t !== '')) {
    const m = TOKEN.exec(token)
    if (m === null) {
      // 只有药名、没写剂量的，先挂起，等后面的「各X」
      if (/^[\u4e00-\u9fa5]{1,6}$/.test(token)) pending.push(token)
      continue
    }
    const herb = m[1]
    const amount = m[2]
    const prep = m[3] === undefined ? undefined : m[3].slice(1, -1)
    if (amount.startsWith('各')) {
      const shared = amount.slice(1)
      for (const name of pending) parts.push({ herb: name, text: shared })
      pending.length = 0
      parts.push({ herb, text: shared, ...(prep === undefined ? {} : { prep }) })
    } else {
      for (const name of pending) parts.push({ herb: name, text: amount })
      pending.length = 0
      parts.push({ herb, text: amount, ...(prep === undefined ? {} : { prep }) })
    }
  }
  return parts
}

export function compositionOf(name) {
  const hit = clauses.find((c) => c.composition.some((x) => norm(x.name) === norm(name)) || norm(c.text).includes(norm(name)))
  if (hit === undefined) return { chapter: '', raw: '', parts: [] }
  const at = hit.composition.findIndex((x) => norm(x.name) === norm(name))
  let raw = ''
  if (at >= 0) {
    const block = hit.composition[at]
    raw = block.text
    // 方名单独一行、组成另起若干行的情况
    if (raw.trim() === '') {
      for (let i = at + 1; i < hit.composition.length; i++) {
        const line = hit.composition[i].text
        if (/^上[一二三四五六七八九十]+味/.test(line)) break
        raw += line + ' '
      }
    }
  } else {
    raw = hit.composition.map((x) => x.text).join(' ')
  }
  return { chapter: hit.chapter, raw, parts: parseComposition(raw) }
}

if (process.argv[2] !== undefined) {
  const r = compositionOf(process.argv[2])
  console.log(r.chapter)
  console.log(r.raw.slice(0, 200))
  console.log(JSON.stringify(r.parts))
}
