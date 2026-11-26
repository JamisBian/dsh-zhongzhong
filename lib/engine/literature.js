// 现代文献检索：交给 dsh-tcm-lit 的 tcm_lit_search
//
// 本插件不再直连 PubMed：中医临床报道、方证研究以中文期刊为主，
// 由 dsh-tcm-lit（OpenAlex 中文库 + Crossref 兜底）提供题录。
//
// 这一层只做三件事：
//   1. 把「方名 + 本案主症」拼成中文检索式；
//   2. 调用宿主注入的 search（tools.js 接到 tcm_lit_search）；
//   3. 把题录归一成证据卡要的形状，并缓存 6 小时。
//
// 没装 dsh-tcm-lit 时如实返回 unavailable，绝不伪造文献。

import { labelOf } from '../data/symptoms.js'
import { scoreFormula } from './match.js'

const CACHE = new Map()
const CACHE_TTL = 6 * 60 * 60 * 1000
const DEFAULT_TIMEOUT_MS = 30_000
const MAX_HITS = 5

/** 去掉括注和多余空白，检索式才干净。 */
function cleanTerm(value) {
  return String(value ?? '')
    .replace(/（[^）]*）/g, '')
    .replace(/\([^)]*\)/g, '')
    .replace(/\s+/g, ' ')
    .trim()
}

/**
 * 中文检索式：方名 + 本案命中权重最高的 1 个主症。
 * 例：「桂枝汤 自汗」「升陷汤 短气」。
 * 只带一个主症是实测结论：两个主症会把题名/摘要检索收得太窄（0 命中），
 * 真查不到时 literatureEvidence 还会自动放宽为方名检索。
 * @param {object} formula
 * @param {object} caseData
 * @returns {string}
 */
export function literatureQuery(formula, caseData) {
  if (formula === undefined || formula === null) return ''
  const terms = [cleanTerm(formula?.name)]
  const entry = caseData === undefined || caseData === null ? undefined : scoreFormula(caseData, formula)
  for (const item of entry?.matched ?? []) {
    if (!Number.isFinite(item?.w) || item.w < 2) continue
    const label = cleanTerm(labelOf(item.id))
    if (label === '') continue
    terms.push(label)
    break
  }
  return terms.filter((term) => term !== '').join(' ')
}

/**
 * tcm_lit_search 的题录 → 证据卡结构。
 * @param {any} payload
 */
export function normalizeLiteratureHits(payload) {
  const list = Array.isArray(payload?.results) ? payload.results : []
  const hits = []
  const seen = new Set()
  for (const work of list) {
    const title = cleanTerm(work?.title)
    if (title === '') continue
    const doi = String(work?.doi ?? '').trim()
    const key = doi === '' ? title : doi.toLowerCase()
    if (seen.has(key)) continue
    seen.add(key)
    const id = String(work?.id ?? '').trim()
    hits.push({
      title,
      authors: Array.isArray(work?.authors) ? work.authors.filter((name) => typeof name === 'string' && name !== '').slice(0, 3) : [],
      journal: cleanTerm(work?.journal),
      year: Number.isFinite(work?.year) ? work.year : '',
      doi,
      url: doi !== '' ? `https://doi.org/${doi}` : id !== '' ? `https://openalex.org/${id}` : '',
      cited: Number.isFinite(work?.cited) ? work.cited : 0
    })
    if (hits.length >= MAX_HITS) break
  }
  return hits
}

function sourceLabel(source) {
  if (source === 'openalex') return 'OpenAlex 中文库'
  if (source === 'crossref') return 'Crossref'
  return source === '' ? 'dsh-tcm-lit' : source
}

function messageOf(error) {
  if (error && typeof error === 'object' && typeof error.message === 'string') return error.message.slice(0, 120)
  return String(error).slice(0, 120)
}

/**
 * 给检索套一个外层超时：tcm-lit 内部已有重试，这里只防调用挂死。
 * @param {Promise<any>} promise
 * @param {number} timeoutMs
 * @param {AbortSignal | undefined} signal
 */
function withDeadline(promise, timeoutMs, signal) {
  if (signal?.aborted === true) return Promise.reject(new Error('检索已取消'))
  return new Promise((resolve, reject) => {
    let settled = false
    let timer
    const finish = (settle, value) => {
      if (settled) return
      settled = true
      clearTimeout(timer)
      signal?.removeEventListener?.('abort', onAbort)
      settle(value)
    }
    const onAbort = () => finish(reject, new Error('检索已取消'))
    timer = setTimeout(() => finish(reject, new Error(`检索超时（${Math.max(1, Math.round(timeoutMs / 1000))} 秒）`)), timeoutMs)
    signal?.addEventListener?.('abort', onAbort, { once: true })
    promise.then((value) => finish(resolve, value), (error) => finish(reject, error))
  })
}

/**
 * 中文期刊文献检索。
 * @param {object} formula
 * @param {object} caseData
 * @param {{search?: (query:string)=>Promise<any>, signal?:AbortSignal, timeoutMs?:number}} [options]
 */
export async function literatureEvidence(formula, caseData, options = {}) {
  const broad = cleanTerm(formula?.name)
  const query = literatureQuery(formula, caseData)
  if (query === '') {
    return { status: 'skipped', hits: [], total: 0, query, source: '', note: '未能生成中文检索式' }
  }

  const search = options.search
  if (typeof search !== 'function') {
    return {
      status: 'unavailable',
      hits: [],
      total: 0,
      query,
      source: '',
      note: '未启用 dsh-tcm-lit（tcm_lit_search），本次未检索中文文献；经典条文判定不受影响。'
    }
  }

  const key = `${formula.id}|${query}`
  const cached = CACHE.get(key)
  if (cached !== undefined && Date.now() - cached.at < CACHE_TTL) return cached.value

  const timeoutMs = Number.isFinite(options.timeoutMs) && options.timeoutMs > 0 ? options.timeoutMs : DEFAULT_TIMEOUT_MS
  const run = (text) => withDeadline(Promise.resolve(search(text)), timeoutMs, options.signal)
  try {
    let payload = await run(query)
    if (payload === null || typeof payload !== 'object') throw new Error('检索工具没有返回题录')
    if (payload.status === 'error') throw new Error(String(payload.message ?? '检索失败'))
    let hits = normalizeLiteratureHits(payload)
    let usedQuery = query
    let relaxed = false

    // 「方名 + 主症」查不到时，放宽成方名再查一次；两个主症会把检索收得太窄。
    if (hits.length === 0 && broad !== '' && broad !== query) {
      try {
        const fallback = await run(broad)
        if (fallback !== null && typeof fallback === 'object' && fallback.status !== 'error') {
          const fallbackHits = normalizeLiteratureHits(fallback)
          if (fallbackHits.length > 0) {
            payload = fallback
            hits = fallbackHits
            usedQuery = broad
            relaxed = true
          }
        }
      } catch {
        // 放宽检索也失败：保留「未检索到」的空结果，不把整次核查判成离线。
      }
    }

    const total = Number.isFinite(payload.total) ? payload.total : hits.length
    const source = String(payload.source ?? '')
    const value = {
      status: 'ok',
      hits,
      total,
      query: usedQuery,
      source,
      note:
        hits.length > 0
          ? `中文文献（${sourceLabel(source)}）命中 ${total} 篇，按相关度列 ${hits.length} 篇${relaxed ? '（已放宽为方名检索）' : ''}`
          : `中文文献（${sourceLabel(source)}）未检索到「${usedQuery}」相关报道`
    }
    // 只缓存有效命中；没装插件/网络失败时下次要能重新试。
    if (hits.length > 0) {
      CACHE.set(`${formula.id}|${usedQuery}`, { at: Date.now(), value })
      if (usedQuery !== query) CACHE.set(key, { at: Date.now(), value })
    }
    return value
  } catch (error) {
    return {
      status: 'offline',
      hits: [],
      total: 0,
      query,
      source: '',
      note: `中文文献检索失败（${messageOf(error)}），本次仅依据经典条文判断`
    }
  }
}
