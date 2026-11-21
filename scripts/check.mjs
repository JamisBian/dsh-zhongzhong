// 包结构自检：不依赖 dsh 运行时，验证「能被 Loader 当成双面插件」的最小条件。
// 用法：node scripts/check.mjs

import { readFileSync, existsSync } from 'node:fs'
import { dirname, join, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const pkgPath = join(root, 'package.json')
const problems = []
const ok = []

function check(condition, message) {
  if (condition) ok.push(message)
  else problems.push(message)
}

const pkg = JSON.parse(readFileSync(pkgPath, 'utf8'))

// 1. 包名与 bundle patch
check(typeof pkg.name === 'string' && pkg.name !== '', `包名：${pkg.name}`)
check(pkg.type === 'module', 'package.json 声明 type: module（host half 是 ESM）')

const patchRel = pkg.dsh?.bundle?.patch
check(typeof patchRel === 'string', 'dsh.bundle.patch 已声明')
const patchPath = patchRel === undefined ? '' : join(root, patchRel)
check(patchPath !== '' && existsSync(patchPath), `bundle patch 文件存在：${patchRel}`)
if (existsSync(patchPath)) {
  const patch = readFileSync(patchPath, 'utf8')
  check(patch.includes(`name: '${pkg.name}'`) || patch.includes(`name: "${pkg.name}"`), 'patch 里的行名等于包名（bare name）')
  check(patch.includes('insert:'), 'patch 使用 insert 列表')
}

// 2. 浏览器端
const clientRel = pkg.exports?.['./client']
check(typeof clientRel === 'string', 'exports["./client"] 已声明')
const clientPath = typeof clientRel === 'string' ? join(root, clientRel) : ''
check(clientPath !== '' && existsSync(clientPath), `client bundle 存在：${clientRel}`)
if (clientPath !== '' && existsSync(clientPath)) {
  const client = readFileSync(clientPath, 'utf8')
  check(client.includes('window.__ModuleLoader__.load('), 'client 走 window.__ModuleLoader__.load')
  check(new RegExp(`id:\\s*'${pkg.name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}'`).test(client), 'client bundle 的 id 等于包名')
  check(!/^\s*(import|export)\s/m.test(client), 'client 是 classic script（无顶层 import/export）')
  check(client.includes("ctx.slots.inject('tool.call.toolview'"), '注册了 tool.call.toolview 卡片')
  check(client.includes('phase'), '卡片读取 phase')
  check(client.includes('content'), '卡片读取 block.content')
}

// 3. 客户端元数据
const client = pkg.dsh?.client
check(client?.platform === 'web', 'dsh.client.platform 为 web')
check(Array.isArray(client?.inject) && client.inject.includes('@deepseek-ai/dsh-client-ui-tool'), 'dsh.client.inject 含 ui-tool')
check(Array.isArray(client?.inject) && client.inject.includes('@deepseek-ai/dsh-client-ui-renderer'), 'dsh.client.inject 含 ui-renderer')
check(client?.entry === undefined, '没有使用不存在的 dsh.client.entry 字段')

// 4. host half
const hostRel = pkg.main
check(typeof hostRel === 'string' && existsSync(join(root, hostRel)), `host 入口存在：${hostRel}`)
const host = readFileSync(join(root, hostRel), 'utf8')
check(/export const name\s*=/.test(host), 'host 导出 name')
check(/export (const )?inject/.test(host), 'host 导出 inject')
check(/export function apply|export const apply/.test(host), 'host 导出 apply')
check(!/from '@deepseek-ai\//.test(host), 'host 不依赖 @deepseek-ai/*（profile 里没有这些包）')

// 5. files 白名单
check(Array.isArray(pkg.files) && pkg.files.includes('lib'), 'files 含 lib（打包后 client.js 不会丢）')

console.log(ok.map((line) => `  ✔ ${line}`).join('\n'))
if (problems.length > 0) {
  console.log(problems.map((line) => `  ✘ ${line}`).join('\n'))
  console.error(`\n${problems.length} 项不通过`)
  process.exit(1)
}
console.log(`\n全部 ${ok.length} 项通过`)
