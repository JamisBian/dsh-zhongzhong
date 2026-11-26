// 现代文献：改由 dsh-tcm-lit 的 tcm_lit_search 提供
import { test } from 'node:test'
import assert from 'node:assert/strict'

import { literatureQuery, normalizeLiteratureHits, literatureEvidence } from '../lib/engine/literature.js'
import { verify, evidenceText } from '../lib/engine/evidence.js'
import { normalizeCase } from '../lib/engine/case.js'
import { resolveFormula } from '../lib/data/index.js'
import { registerZhongzhongTools } from '../lib/tools.js'

const fakeSearch = (payload) => async (query) => ({ query, ...payload })

test('检索式：方名 + 本案主症，去掉括注', () => {
  const c = normalizeCase({ symptoms: ['头痛', '自汗'] })
  const query = literatureQuery(resolveFormula('桂枝汤'), c)
  assert.match(query, /^桂枝汤/)
  assert.match(query, /头痛|自汗/)
  assert.doesNotMatch(query, /（/)
  // 只带一个主症：两个主症会把题名/摘要检索收窄到 0 命中
  assert.equal(query.split(' ').length, 2)

  // 单方名后的「（单味）」不进入检索式
  const danfang = literatureQuery(resolveFormula('石膏（单味）'), normalizeCase({ symptoms: ['口渴'] }))
  assert.doesNotMatch(danfang, /单味/)
})

test('题录归一：去重、补 DOI 链接、丢弃空题名', () => {
  const hits = normalizeLiteratureHits({
    results: [
      { title: '桂枝汤治疗失眠的临床观察', authors: ['张三'], journal: '中医杂志', year: 2021, doi: '10.1234/ABC', cited: 7 },
      { title: '桂枝汤治疗失眠的临床观察', journal: '重复刊', year: 2021, doi: '10.1234/abc' },
      { title: '', journal: '空题名' },
      { title: '桂枝汤加减治疗不寐', journal: '中医临床研究', year: 2019 }
    ]
  })
  assert.equal(hits.length, 2)
  assert.equal(hits[0].url, 'https://doi.org/10.1234/ABC')
  assert.equal(hits[0].cited, 7)
  assert.equal(hits[1].doi, '')
})

test('方名 + 主症零命中时，自动放宽为方名检索', async () => {
  const c = normalizeCase({ symptoms: ['往来寒热（忽冷忽热）', '口苦'] })
  const calls = []
  const report = await literatureEvidence(resolveFormula('小柴胡汤'), c, {
    search: async (query) => {
      calls.push(query)
      if (query.includes(' ')) return { status: 'empty', source: 'openalex', total: 0, results: [] }
      return {
        status: 'ok',
        source: 'openalex',
        total: 1,
        results: [{ title: '小柴胡汤临床应用体会', journal: '中医杂志', year: 2020 }]
      }
    }
  })
  assert.equal(report.status, 'ok')
  assert.equal(report.hits.length, 1)
  assert.equal(report.query, '小柴胡汤')
  assert.match(report.note, /放宽/)
  assert.equal(calls.length, 2)
  assert.match(calls[0], /^小柴胡汤 /)
  assert.equal(calls[1], '小柴胡汤')
})

test('未注入 tcm_lit_search 时如实返回 unavailable，不伪造文献', async () => {
  const c = normalizeCase({ chief: '失眠', symptoms: ['失眠'] })
  const report = await literatureEvidence(resolveFormula('桂枝汤'), c, {})
  assert.equal(report.status, 'unavailable')
  assert.equal(report.hits.length, 0)
  assert.match(report.note, /dsh-tcm-lit/)
})

test('经典不命中、中文文献命中 → modern-only，且证据卡带刊名/年份/DOI', async () => {
  const c = normalizeCase({ patient: { name: '某', age: 40, sex: '女' }, chief: '失眠', symptoms: ['失眠'] })
  const report = await verify(c, resolveFormula('桂枝汤'), {
    literatureSearch: fakeSearch({
      status: 'ok',
      source: 'openalex',
      total: 2,
      results: [
        { title: '桂枝汤治疗失眠的临床观察', authors: ['张三'], journal: '中国中医药现代远程教育', year: 2021, doi: '10.1234/abc' },
        { title: '桂枝汤加减治疗不寐', journal: '中医临床研究', year: 2019 }
      ]
    })
  })
  assert.equal(report.verdict, 'modern-only')
  assert.equal(report.modern.status, 'ok')
  assert.equal(report.modern.hits.length, 2)
  assert.equal(report.modern.hits[0].doi, '10.1234/abc')
  assert.match(report.reason, /仅中文文献提及/)
  const text = evidenceText(report)
  assert.match(text, /现代文献（中文期刊 · dsh-tcm-lit）/)
  assert.match(text, /中国中医药现代远程教育/)
  assert.match(text, /DOI 10\.1234\/abc/)
  assert.doesNotMatch(text, /PMID/)
})

test('zhongzhong_evidence 自动调用 tcm_lit_search（宿主接线）', async () => {
  const tools = new Map()
  const ctx = {
    tools: {
      register: (definition) => tools.set(definition.name, definition),
      get: (name) => tools.get(name)
    },
    systemPrompt: { section: () => {} },
    effect: (run) => run(),
    get(service) {
      return this[service]
    }
  }
  registerZhongzhongTools(ctx)

  let seen
  tools.set('tcm_lit_search', {
    name: 'tcm_lit_search',
    async execute(args) {
      seen = args
      return {
        status: 'ok',
        source: 'openalex',
        total: 1,
        results: [{ title: '升陷汤治疗大气下陷的临床观察', journal: '中医杂志', year: 2020, doi: '10.1234/sxt' }]
      }
    }
  })

  const c = normalizeCase({
    patient: { name: '某', age: 52, sex: '男' },
    chief: '气短',
    symptoms: ['气短', '疲乏无力']
  })
  const definition = tools.get('zhongzhong_evidence')
  const value = await definition.execute(
    { case: c, formula: '升陷汤' },
    { callId: 'call-1', signal: new AbortController().signal, arguments: {} }
  )
  assert.equal(value.status, 'ok')
  assert.equal(value.modern.status, 'ok')
  assert.equal(value.modern.hits[0].doi, '10.1234/sxt')
  assert.match(seen.query, /升陷汤/)
  assert.equal(seen.chinese_only, true)
  assert.equal(seen.limit, 5)
})
