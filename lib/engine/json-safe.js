// 工具返回值出口清洗：宿主要求「无损 JSON」
//
// 宿主会对工具返回值做一次 JSON 往返校验：序列化再解析后必须与原值严格相等。
// 只要对象里出现 undefined 键（序列化时被丢掉）、NaN/Infinity（变成 null），
// 校验就会失败，整个工具调用报 `value is not lossless JSON`，患者看不到任何结果。
// 这里在出口统一深清洗一次，避免某个分支多带一个 undefined 就把工具打挂。

/**
 * 深度清洗为可无损 JSON 往返的普通对象/数组。
 * - undefined 属性：丢弃（数组里的 undefined 转 null，保持下标不塌陷）
 * - NaN / ±Infinity：转 null
 * - BigInt：安全范围内转 number，否则转字符串
 * - Date：转 ISO 字符串
 * - 循环引用：转 '[Circular]'
 * @param {any} value
 * @returns {any}
 */
export function jsonSafe(value, seen = new WeakSet()) {
  if (value === null) return null

  const type = typeof value
  if (type === 'string' || type === 'boolean') return value
  if (type === 'number') return Number.isFinite(value) ? value : null
  if (type === 'bigint') {
    return value <= BigInt(Number.MAX_SAFE_INTEGER) && value >= BigInt(Number.MIN_SAFE_INTEGER)
      ? Number(value)
      : value.toString()
  }
  if (type === 'undefined' || type === 'function' || type === 'symbol') return undefined
  if (type !== 'object') return undefined

  if (seen.has(value)) return '[Circular]'
  seen.add(value)

  if (value instanceof Date) {
    seen.delete(value)
    return Number.isNaN(value.getTime()) ? null : value.toISOString()
  }

  if (Array.isArray(value)) {
    const list = value.map((item) => {
      const next = jsonSafe(item, seen)
      return next === undefined ? null : next
    })
    seen.delete(value)
    return list
  }

  if (value instanceof Map) {
    const out = {}
    for (const [key, item] of value) {
      const next = jsonSafe(item, seen)
      if (next !== undefined) out[String(key)] = next
    }
    seen.delete(value)
    return out
  }

  if (value instanceof Set) {
    const list = [...value].map((item) => {
      const next = jsonSafe(item, seen)
      return next === undefined ? null : next
    })
    seen.delete(value)
    return list
  }

  const out = {}
  for (const key of Object.keys(value)) {
    const next = jsonSafe(value[key], seen)
    if (next !== undefined) out[key] = next
  }
  seen.delete(value)
  return out
}
