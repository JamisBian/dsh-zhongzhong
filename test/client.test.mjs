// 客户端 bundle 自检：在没有浏览器的环境里验证注册形状与卡片渲染。
import { test } from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { runInNewContext } from 'node:vm'

/**
 * 载入 classic script：用 vm 新建一个只有 window 的上下文，
 * 与浏览器里「把 bundle 当脚本执行」一致（不经过 Node 的模块缓存）。
 */
function loadBundle() {
  let captured
  const sandbox = {
    window: { __ModuleLoader__: { load: (registration) => (captured = registration) } },
    console
  }
  const source = readFileSync(new URL('../lib/client.js', import.meta.url), 'utf8')
  runInNewContext(source, sandbox, { filename: 'lib/client.js' })
  assert.ok(captured !== undefined, '没有调用 window.__ModuleLoader__.load')
  return captured
}

/** 够用的假 React（把 children 放进 props.children，与 React 一致）。 */
const fakeReact = {
  createElement: (type, props, ...children) => {
    const merged = { ...(props ?? {}) }
    if (children.length === 1) merged.children = children[0]
    else if (children.length > 1) merged.children = children
    return { type, props: merged }
  },
  useState: (initial) => [initial, () => {}]
}

/** 文本节点收集。 */
function flatten(node) {
  if (node === null || node === undefined || node === false) return ''
  if (typeof node === 'string' || typeof node === 'number') return String(node)
  if (Array.isArray(node)) return node.map(flatten).join(' ')
  if (typeof node.type === 'function') return flatten(node.type(node.props ?? {}))
  return [String(node.type), flatten(node.props?.children)].join(' ')
}

/** 渲染后的元素类型集合（函数组件会被展开）。 */
function types(node, out = new Set()) {
  if (node === null || node === undefined || typeof node === 'string' || typeof node === 'number') return out
  if (Array.isArray(node)) {
    for (const child of node) types(child, out)
    return out
  }
  if (typeof node.type === 'function') return types(node.type(node.props ?? {}), out)
  out.add(String(node.type))
  types(node.props?.children, out)
  return out
}

function argsOf(map) {
  return {
    text: (key) => (key in map ? map[key] : undefined),
    value: (key) => (key in map ? map[key] : undefined),
    complete: () => true
  }
}

function resultBlock(toolName, argsMap, text) {
  return {
    kind: 'tool-result',
    callId: 'c1',
    name: toolName,
    args: argsOf(argsMap),
    call: { name: toolName, argsRaw: '{}' },
    content: [{ type: 'text', text }],
    isError: false,
    subCalls: []
  }
}

test('client bundle 注册全部工具卡片', () => {
  const registration = loadBundle()
  assert.equal(registration.id, 'dsh-zhongzhong')
  const plugin = registration.factory((spec) => {
    if (spec === 'react') return fakeReact
    throw new Error('unexpected require: ' + spec)
  })
  assert.deepEqual(Array.from(plugin.inject), ['slots'])

  const registered = []
  plugin.apply({
    slots: {
      inject: (name, cb) => {
        assert.equal(name, 'tool.call.toolview')
        cb()
      },
      register: (options, Component) => registered.push({ options, Component })
    }
  })

  assert.deepEqual(
    Array.from(registered.map((r) => r.options.key)).sort(),
    [
      'zhongzhong_consult',
      'zhongzhong_differentiate',
      'zhongzhong_discuss',
      'zhongzhong_evidence',
      'zhongzhong_export',
      'zhongzhong_formula',
      'zhongzhong_prescribe'
    ]
  )
  assert.ok(registered.every((r) => r.options.name === 'tool.call.toolview'))
})

test('三个 phase 都能渲染', () => {
  const registration = loadBundle()
  const plugin = registration.factory(() => fakeReact)
  const registered = []
  plugin.apply({
    slots: { inject: (_n, cb) => cb(), register: (options, Component) => registered.push({ options, Component }) }
  })
  const card = registered.find((r) => r.options.key === 'zhongzhong_consult').Component
  for (const phase of ['preparing', 'start', 'result']) {
    const element = card({
      toolName: 'zhongzhong_consult',
      phase,
      callId: 'c1',
      block:
        phase === 'result'
          ? resultBlock('zhongzhong_consult', { stage: 'intake' }, '## 问诊 · 一般资料与主诉（已完成）\n陈小明，男，38岁')
          : { callId: 'c1', name: 'zhongzhong_consult', args: argsOf({ stage: 'intake' }), argsRaw: '{}', subCalls: [] }
    })
    const text = flatten(element)
    assert.match(text, /衷中/)
    assert.match(text, /问诊/)
  }
})

test('special 阶段卡片显示「衷中参西特征症」', () => {
  const registration = loadBundle()
  const plugin = registration.factory(() => fakeReact)
  const registered = []
  plugin.apply({
    slots: { inject: (_n, cb) => cb(), register: (options, Component) => registered.push({ options, Component }) }
  })
  const card = registered.find((r) => r.options.key === 'zhongzhong_consult').Component
  const element = card({
    toolName: 'zhongzhong_consult',
    phase: 'start',
    callId: 'c-zz',
    block: { callId: 'c-zz', name: 'zhongzhong_consult', args: argsOf({ stage: 'special' }), argsRaw: '{}', subCalls: [] }
  })
  const text = flatten(element)
  assert.match(text, /衷中参西特征症/)
  assert.match(text, /第 5 \/ 5 步/)
})

test('处方笺渲染 Markdown 表格与免责声明', () => {
  const registration = loadBundle()
  const plugin = registration.factory(() => fakeReact)
  const registered = []
  plugin.apply({
    slots: { inject: (_n, cb) => cb(), register: (options, Component) => registered.push({ options, Component }) }
  })
  const card = registered.find((r) => r.options.key === 'zhongzhong_prescribe').Component
  const sheet = [
    '# 桂枝汤 处方笺',
    '',
    '## 病历摘要',
    '> 张三，男，35岁',
    '',
    '## 处方',
    '| 药物 | 原方用量 | 折算 | 炮制 |',
    '| --- | --- | --- | --- |',
    '| 桂枝 | 三两 | 9g | 去皮 |',
    '',
    '> 原方剂量按 1 两 = 3 克折算',
    '',
    '---',
    '本处方仅供中医师参考，不能替代面诊。'
  ].join('\n')

  const element = card({
    toolName: 'zhongzhong_prescribe',
    phase: 'result',
    callId: 'c1',
    block: resultBlock('zhongzhong_prescribe', { formula: '桂枝汤' }, sheet)
  })
  const text = flatten(element)
  assert.match(text, /处方笺/)
  assert.match(text, /桂枝/)
  assert.match(text, /9g/)
  assert.match(text, /1 两 = 3 克/)
  assert.match(text, /不能替代面诊/)
  // 表格被解析为 table 元素
  assert.ok(types(element).has('table'), '没有渲染表格')
  // 判定徽标
  assert.match(flatten(element), /处方/)
})

test('文献核查卡片显示判定徽标', () => {
  const registration = loadBundle()
  const plugin = registration.factory(() => fakeReact)
  const registered = []
  plugin.apply({
    slots: { inject: (_n, cb) => cb(), register: (options, Component) => registered.push({ options, Component }) }
  })
  const card = registered.find((r) => r.options.key === 'zhongzhong_evidence').Component
  const evidence = ['## 文献核查：桂枝汤', '结论：**有文献支撑**（方证覆盖度 78%）', '### 经典原文', '- 《伤寒论》第12条：…桂枝汤主之。'].join('\n')
  const ok = flatten(
    card({
      toolName: 'zhongzhong_evidence',
      phase: 'result',
      callId: 'c1',
      block: resultBlock('zhongzhong_evidence', { formula: '桂枝汤' }, evidence)
    })
  )
  assert.match(ok, /有文献支撑/)

  const bad = flatten(
    card({
      toolName: 'zhongzhong_evidence',
      phase: 'result',
      callId: 'c2',
      block: resultBlock('zhongzhong_evidence', { formula: '四逆汤' }, '## 文献核查：四逆汤\n结论：**无文献支撑**（方证覆盖度 12%）')
    })
  )
  assert.match(bad, /无文献支撑/)
})

test('失败结果渲染失败态', () => {
  const registration = loadBundle()
  const plugin = registration.factory(() => fakeReact)
  const registered = []
  plugin.apply({
    slots: { inject: (_n, cb) => cb(), register: (options, Component) => registered.push({ options, Component }) }
  })
  const card = registered.find((r) => r.options.key === 'zhongzhong_differentiate').Component
  const element = card({
    toolName: 'zhongzhong_differentiate',
    phase: 'result',
    callId: 'c1',
    block: { ...resultBlock('zhongzhong_differentiate', {}, ''), isError: true, error: { name: 'Error', code: 'X' } }
  })
  assert.match(flatten(element), /失败/)
})

test('病案导出卡片：能从结果里取出路径并给出复制按钮', () => {
  const registration = loadBundle()
  const plugin = registration.factory(() => fakeReact)
  const registered = []
  plugin.apply({
    slots: { inject: (_n, cb) => cb(), register: (options, Component) => registered.push({ options, Component }) }
  })
  const card = registered.find((r) => r.options.key === 'zhongzhong_export').Component
  const body = [
    '## 病案已导出',
    '',
    '- 文件：`/home/bian/中医病案/2026-11-20-张三.md`',
    '- ⚠️ 含个人健康信息，请妥善保管'
  ].join('\n')
  const element = card({
    toolName: 'zhongzhong_export',
    phase: 'result',
    block: resultBlock('zhongzhong_export', { filename: '2026-11-20-张三.md' }, body)
  })
  const text = flatten(element)
  assert.match(text, /复制文件路径/, '导出卡片没有出现复制按钮')
  assert.match(text, /2026-11-20-张三\.md/)

  // 没有路径时不渲染按钮
  const plain = card({
    toolName: 'zhongzhong_export',
    phase: 'result',
    block: resultBlock('zhongzhong_export', {}, '## 导出失败\n\n磁盘只读')
  })
  assert.doesNotMatch(flatten(plain), /复制文件路径/)
})
