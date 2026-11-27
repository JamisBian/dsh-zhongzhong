// 回归：工具返回值必须是「无损 JSON」
//
// 宿主对工具返回值做 JSON 往返校验，序列化再解析后必须与原值严格相等。
// 曾经 zhongzhong_prescribe 成功出方时返回 `high_match: undefined`，
// undefined 键在往返后消失，导致开方工具在「能开方」这条路上必然报
// `value is not lossless JSON`（拒绝/报错分支反而不带该键，所以是绿的）。
import { test } from 'node:test'
import assert from 'node:assert/strict'

import { jsonSafe } from '../lib/engine/json-safe.js'
import { registerZhongzhongTools } from '../lib/tools.js'
import { normalizeCase } from '../lib/engine/case.js'

/** 宿主校验口径：JSON 往返后必须严格相等。 */
function assertLossless(value) {
  assert.deepStrictEqual(JSON.parse(JSON.stringify(value)), value)
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
  return definition.execute(args, call)
}

/** 理郁升陷汤证：原文 supported，走 status=prescribed。 */
const zhangzuiCase = normalizeCase({
  patient: { name: '某', age: 12, ageBand: '18岁以下', sex: '男' },
  chief: '嘴一直张着，使劲闭也能闭上，一会儿就累的不行。',
  duration: '半年以上',
  vitals: { tempC: 36.6, sbp: 120, dbp: 80, pulse: 75 },
  symptoms: [
    'face_red', 'tidal_fever', 'no_sweat', 'forgetfulness', 'insomnia', 'orthopnea', 'spasm',
    'breathing_effort', 'qi_sinking', 'qi_rush_up', 'qi_depression', 'abdominal_qi', 'aphasia',
    'atrophy', 'chest_fullness', 'sighing', 'hypochondriac'
  ],
  tongue: ['tongue_pink', 'coat_white_greasy'],
  pulse: ['pulse_slippery', 'pulse_rapid'],
  notes: '二便正常',
  allergy: '无已知过敏'
})

test('jsonSafe：丢掉 undefined 键、数组补 null、非有限数转 null', () => {
  const cleaned = jsonSafe({
    a: 1,
    b: undefined,
    c: NaN,
    d: Infinity,
    e: { f: undefined, g: 'x' },
    h: [1, undefined, NaN],
    i: null,
    j: new Date('2026-11-27T00:00:00.000Z')
  })
  assert.deepStrictEqual(cleaned, {
    a: 1,
    c: null,
    d: null,
    e: { g: 'x' },
    h: [1, null, null],
    i: null,
    j: '2026-11-27T00:00:00.000Z'
  })
  assertLossless(cleaned)
})

test('jsonSafe：循环引用不炸', () => {
  const node = { name: 'x' }
  node.self = node
  assert.deepStrictEqual(jsonSafe(node), { name: 'x', self: '[Circular]' })
})

test('prescribe 成功出方：返回值是无损 JSON，且不再带 high_match: undefined', async () => {
  const host = makeHost([[{ id: 'confirm_prescribe', selected: ['确认开方'] }]])
  const value = await run(host, 'zhongzhong_prescribe', { case: zhangzuiCase, formula: '理郁升陷汤', online: false })

  assert.equal(value.status, 'prescribed')
  assert.equal(value.sheet.formula.name, '理郁升陷汤')
  assert.ok(value.sheet.composition.length > 0)
  // 关键回归点：这个键要么是对象，要么不存在，绝不能是 undefined
  assert.ok(!('high_match' in value), '非例外开方时不应带 high_match 键')
  assertLossless(value)
})

test('prescribe 拒绝开方与「先看文献」分支：返回值同样无损', async () => {
  // 文献未通过 → blocked
  const blocked = await run(makeHost([]), 'zhongzhong_prescribe', { case: zhangzuiCase, formula: '升陷汤', online: false })
  assert.equal(blocked.status, 'blocked')
  assertLossless(blocked)

  // 选「先看文献依据」→ evidence_only
  const evidence = makeHost([[{ id: 'confirm_prescribe', selected: ['先看文献依据'] }]])
  const viewed = await run(evidence, 'zhongzhong_prescribe', { case: zhangzuiCase, formula: '理郁升陷汤', online: false })
  assert.equal(viewed.status, 'evidence_only')
  assert.ok(!('high_match' in viewed), '非例外开方时不应带 high_match 键')
  assertLossless(viewed)
})
