// 开方策略：高匹配度例外（>70%）与接近双选（<4%）
import { test } from 'node:test'
import assert from 'node:assert/strict'

import { highMatchException, closePrescriptionPair } from '../lib/engine/match.js'
import { verify, evidenceText } from '../lib/engine/evidence.js'
import { normalizeCase } from '../lib/engine/case.js'
import { resolveFormula } from '../lib/data/index.js'
import { registerZhongzhongTools } from '../lib/tools.js'

/** 温胆汤证：匹配度 84%，但条文/原书主治里没有这些词 → unsupported。 */
const wendantangCase = {
  patient: { name: '某', age: 45, sex: '女' },
  chief: '恶心头晕心悸多梦',
  symptoms: ['nausea', 'dizziness', 'palpitation', 'dreamy_sleep', 'chest_oppression', 'bitter_mouth']
}

/** 桂枝汤与加味桂枝代粥汤分差 0.7%：两方都 supported。 */
const closePairCase = {
  patient: { name: '某', age: 35, sex: '男' },
  chief: '头痛自汗恶风',
  symptoms: ['头痛', '自汗', '恶风', '发热', '鼻塞']
}

function makeHost(script = []) {
  const tools = new Map()
  const asked = []
  const ctx = {
    tools: {
      register: (definition) => tools.set(definition.name, definition),
      get: (name) => tools.get(name)
    },
    userQuestions: {
      async ask(request) {
        asked.push(request)
        const answer = script.shift()
        if (answer === undefined) throw Object.assign(new Error('cancelled'), { code: 'ASK_CANCELLED' })
        return { answers: answer }
      }
    },
    get(service) {
      return this[service]
    }
  }
  registerZhongzhongTools(ctx)
  return { ctx, tools, asked }
}

async function run(host, name, args) {
  const definition = host.tools.get(name)
  assert.ok(definition !== undefined, `工具未注册：${name}`)
  const call = { callId: 'c1', signal: new AbortController().signal, arguments: args }
  const value = await definition.execute(args, call)
  const text = definition.output.render(args, value).map((block) => block.text).join('\n')
  return { value, text }
}

test('高匹配度例外：排序第一且 >70% 才算，非第一不算', () => {
  const c = normalizeCase(wendantangCase)
  const wendan = highMatchException(c, resolveFormula('温胆汤'))
  assert.equal(wendan.eligible, true)
  assert.ok(wendan.score > 0.7)
  assert.equal(wendan.top.name, '温胆汤')

  const guizhi = highMatchException(c, resolveFormula('桂枝汤'))
  assert.equal(guizhi.eligible, false)
  assert.match(guizhi.reason, /不是/)
})

test('证据卡：unsupported 但高匹配时给出例外说明', async () => {
  const c = normalizeCase(wendantangCase)
  const report = await verify(c, resolveFormula('温胆汤'), { online: false })
  assert.equal(report.verdict, 'unsupported')
  assert.equal(report.highMatch.eligible, true)
  const text = evidenceText(report)
  assert.match(text, /高匹配度例外/)
  assert.match(text, /84%/)

  const host = makeHost([])
  const result = await run(host, 'zhongzhong_evidence', { case: c, formula: '温胆汤', online: false })
  assert.equal(result.value.high_match.eligible, true)
  assert.match(result.text, /可按高匹配度例外进入 zhongzhong_prescribe/)
})

test('高匹配度例外可以开方，但确认卡必须说明文献未支持', async () => {
  const host = makeHost([[{ id: 'confirm_prescribe', selected: ['确认开方'] }]])
  const c = normalizeCase(wendantangCase)
  const result = await run(host, 'zhongzhong_prescribe', { case: c, formula: '温胆汤', online: false })
  assert.equal(result.value.status, 'prescribed', result.value.message)
  assert.equal(result.value.high_match.eligible, true)
  assert.match(host.asked[0].questions[0].header, /高匹配度例外/)
  assert.match(host.asked[0].questions[0].question, /文献未支持/)
  assert.match(result.value.markdown, /高匹配度例外开方/)
  assert.match(result.value.markdown, /不属于文献支持开方/)
})

test('非最高匹配方不能走高匹配度例外', async () => {
  const host = makeHost([])
  const c = normalizeCase(wendantangCase)
  // 桂枝汤在本案匹配度很低，也不是排序第一：应被文献门槛拦住
  const result = await run(host, 'zhongzhong_prescribe', { case: c, formula: '桂枝汤', online: false })
  assert.equal(result.value.status, 'blocked', result.value.message)
})

test('接近双选：分差 <4% 时 differentiate 返回 pair，不再继续追问', async () => {
  const host = makeHost([])
  const c = normalizeCase(closePairCase)
  const result = await run(host, 'zhongzhong_differentiate', { case: c })
  assert.equal(result.value.status, 'decided', result.value.message)
  assert.ok(result.value.pair !== undefined)
  assert.equal(result.value.pair.gap < 4, true)
  assert.match(result.text, /接近双选/)
  assert.match(result.text, /不要同时服用/)
})

test('接近双选：prescribe 分别出两方处方，让患者二选一', async () => {
  const host = makeHost([])
  const c = normalizeCase(closePairCase)
  const result = await run(host, 'zhongzhong_prescribe', { case: c, formula: '桂枝汤', online: false })
  assert.equal(result.value.status, 'choose', result.value.message)
  assert.equal(result.value.candidates.length, 2)
  assert.ok(result.value.candidates.every((candidate) => candidate.sheet.markdown.includes('处方笺')))
  assert.match(result.value.markdown, /任选其一/)
  assert.match(result.value.markdown, /不要同时服用/)
  assert.equal(result.value.questions[0].id, 'choose_near_tie')
  assert.match(result.value.questions[0].question, /二选一/)
})

test('接近双选：两方都无文献支持但都 >70% 时，分别出方并逐方标注例外', async () => {
  const host = makeHost([])
  const c = normalizeCase({
    patient: { name: '某', age: 50, sex: '男' },
    chief: '胁胀咳嗽胸闷',
    symptoms: ['hypochondriac', 'cough', 'chest_oppression']
  })
  const result = await run(host, 'zhongzhong_prescribe', { case: c, formula: '十枣汤', online: false })
  assert.equal(result.value.status, 'choose', result.value.message)
  assert.equal(result.value.candidates.length, 2)
  assert.ok(result.value.candidates.every((candidate) => candidate.verdict === 'unsupported'))
  assert.ok(result.value.candidates.every((candidate) => candidate.sheet.markdown.includes('接近双选中的高匹配方')))
  assert.match(result.value.markdown, /不属于文献支持开方/)
})

test('closePrescriptionPair：严格 <4%、双方达到最低分、非外用', () => {
  const entry = (id, score, route) => ({
    formula: { id, name: id, six: '太阳', route },
    score,
    matched: [{ id: 'a' }, { id: 'b' }],
    keyHit: 1
  })
  assert.ok(closePrescriptionPair([entry('a', 0.72), entry('b', 0.7)]) !== undefined)
  // 正好 4% 不算「小于 4%」
  assert.equal(closePrescriptionPair([entry('a', 0.72), entry('b', 0.68)]), undefined)
  // 低于最低匹配度不算
  assert.equal(closePrescriptionPair([entry('a', 0.59), entry('b', 0.57)]), undefined)
  // 外用方不参与二选一
  assert.equal(closePrescriptionPair([entry('a', 0.72, 'external'), entry('b', 0.7)]), undefined)
})
