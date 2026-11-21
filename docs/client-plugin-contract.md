# DSH 0.2.2-rc.5 第三方客户端插件（client plugin）契约

> 调研对象：运行中的 Windows 版 DeepSeek Harness 桌面 App（Wine）内打包的 dsh 运行时。
> 所有结论均来自该 asar 内的**实际字节**（源码 `src/`、构建产物 `lib/`、前端 dist、内嵌文档），不是推断。
> 少数无法从 asar 取得的部分（`@deepseek-ai/dsh-client-ui-slots` 包本体未随 App 发布）已显式标注为「推断/据文档」。

---

## 0. 证据路径约定 & 复现方法

| 记号 | 含义 |
|---|---|
| `ASAR` | `/home/bian/.wine/drive_c/users/bian/AppData/Local/Programs/DeepSeek Harness/resources/app.asar` |
| `asar:<p>` | asar 内部路径，例如 `asar:dsh/node_modules/@deepseek-ai/dsh-client-modules/src/index.ts` |

读取器（工作区已有）：

```js
const a = require('/home/bian/next/deepseek-harness-zhongyijingfang/.scratch/asar.js')
a.readText('dsh/node_modules/@deepseek-ai/dsh-client-modules/src/index.ts')
```

asar 根目录布局（已核对）：

```
package.json            # @deepseek-ai/dsh-desktop 0.2.2-rc.5, main=lib/main.js
lib/main.js             # Electron 主进程（82 万字节）
renderer/               # 欢迎页/更新页等
dsh/                    # dsh 运行时（@deepseek-ai/dsh-desktop-runtime 0.2.2-rc.5）
  desktop-runtime.json  # release.nodeVersion=24.21.0, pnpmVersion=11.28.5, platform=win32
  node_modules/@deepseek-ai/*   # 全部插件包（含被依赖包的 src/ 源码！）
node_modules/           # shell 自己的依赖
```

**关键事实：绝大多数 `@deepseek-ai/dsh-*` 包在 asar 里同时带 `src/`（TS/TSX 源码）和 `lib/`（tsdown 构建产物）**，所以本报告能引用到原始 TypeScript 类型定义。

真实桌面 profile 目录（已在盘上核对）：

```
/home/bian/.wine/drive_c/users/bian/.dsh/profiles/desktop/
  package.json          # dsh.profile.bundles: [dsh-base, dsh-web-app]
  cordis.yml            # []（只有注释：树由 patch 层组合）
  cordis.patch.yml      # 用户 patch 层
  pnpm-workspace.yaml   # packages: [.] / nodeLinker: hoisted / autoInstallPeers: false
  （当前没有 node_modules —— 尚未装任何第三方包）
```

---

## 1. 客户端插件如何被发现和加载

### 1.1 一句话结论

**一个包要成为「客户端插件」，必须同时满足三件事：**

1. 它在 profile 里被装成依赖，**并且**通过 bundle patch 变成了 Cordis Loader 的一行（row）；
2. 它的 `package.json` 里有 `dsh.client`，且 `platform === 'web'`；
3. 它的 `package.json` `exports["./client"]` 指向一个已存在的 bundle 文件。

宿主是在**扫描 Loader entries** 时顺带读 `package.json` 发现浏览器 bundle 的，**不看 `files`、不看目录约定、不读 `main`**。

### 1.2 发现链路（逐段证据）

```text
profile/package.json  dsh.profile.bundles: ["@deepseek-ai/dsh-base", "@deepseek-ai/dsh-web-app", "<你的 bundle>"]
        │  （每个 bundle 的 dsh.bundle.patch 依序叠加；再叠加 profile/cordis.patch.yml）
        ▼
cordis.patch.yml  - insert: [{ id: <row id>, name: "<包名或子路径>" }]
        │
        ▼
Cordis Loader 里出现一行 entry，entry.options.name = "<包名>"
        │
        ▼
ClientModuleRegistry（ctx.clientModules）扫描 ctx.loader.entries()
        │  对每个 entry：用 Loader 的解析器找到它的 package.json
        ▼
读 package.json → dsh.client? → platform === 'web'? → exports["./client"]?
        │
        ▼
WebBootEntry { id: <包名>, url: "plugins/??<包名>/client.js&rev=<rev>",
               rev, inject?, external?, immediately? }
        │
        ▼
window.__DSH_BOOT__ + <script> 注入 index.html；脚本 GET /plugins/... 拉取 bundle
```

扫描入口与生命周期（`asar:dsh/node_modules/@deepseek-ai/dsh-client-modules/src/index.ts:671-713`）：

```ts
constructor(ctx: Context) {
  super(ctx, 'clientModules')
  const { version } = createRequire(import.meta.url)('../package.json') as { version: string }
  const commit = process.env.DSH_CLIENT_COMMIT_HASH
  this.release = commit === undefined ? { version } : { version, commit }
  // 每个新 fiber（Loader 行构造/销毁）把 entry name 标脏
  ctx.on('internal/plugin', (fiber) => {
    const entryName = fiber.entry?.options.name
    if (entryName === undefined) return
    this.dirty.add(entryName)
    ...
  })
  // 激活时同步跑一遍（初始扫描 == 增量扫描的同一实现）
  for (const entry of ctx.loader.entries()) this.dirty.add(entry.options.name)
  this.composed = this.compose()
  const failures: Error[] = []
  this.flush(err => failures.push(err))
  if (failures.length > 0) throw new ClientPackageCompositionError(failures)

  const registerWebCarrier = (webCtx: Context): void => {
    webCtx.effect(
      () => webCtx.webServer.register({ kind: 'prefix', path: PLUGIN_ROUTE, resource: request => this.fetchBundle(request) }),
      'client-modules: bundle route',
    )
  }
  ctx.inject(['webServer'], registerWebCarrier)
  ctx.on('webserver/index-inject', (table) => { table.push(...bootInjections(this.composed)) })
}
```

### 1.3 `dsh.client` 的确切结构（**没有 `entry` 字段**）

类型权威（`asar:dsh/node_modules/@deepseek-ai/dsh-package-manifest/src/types.ts`，`DshClientManifest`）：

```ts
/** Client module declaration read by client-modules and the client build. */
export interface DshClientManifest {
  /** Client platform identifier; the Web consumer selects `web`. */
  platform: string
  /** Informational package-name dependencies, not Cordis service injection. */
  inject?: string[]
  /** Boot phase-one registration barrier; absent means the shared application batch. */
  immediately?: boolean
  /**
   * Exact module-table requests beyond the implicit client baseline, including
   * subpaths such as `<pkg>/client`; absent means baseline externals only.
   * Type-only imports are erased and create no module request.
   */
  external?: string[]
}
```

运行时校验器（`asar:dsh/node_modules/@deepseek-ai/dsh-client-modules/src/client/manifest.ts:173-201`）：

```ts
export function parseDshClient(pkgName: string, value: unknown): DshClientManifest | undefined {
  if (value === undefined) return undefined
  if (typeof value !== 'object' || value === null) {
    throw new Error(`client-modules: ${pkgName} has a non-object dsh.client declaration`)
  }
  const decl = value as Record<string, unknown>
  if (typeof decl.platform !== 'string') {
    throw new Error(`client-modules: ${pkgName} dsh.client.platform must be a string`)
  }
  const inject = optionalStringArray(pkgName, 'dsh.client.inject', decl.inject)
  const external = optionalStringArray(pkgName, 'dsh.client.external', decl.external)
  if (decl.immediately !== undefined && typeof decl.immediately !== 'boolean') {
    throw new Error(`client-modules: ${pkgName} dsh.client.immediately must be a boolean`)
  }
  return {
    platform: decl.platform,
    ...(inject !== undefined ? { inject } : {}),
    ...(external !== undefined ? { external } : {}),
    ...(decl.immediately !== undefined ? { immediately: decl.immediately } : {}),
  }
}
```

要点：

| 字段 | 必填 | 语义 |
|---|---|---|
| `platform` | ✅ | 必须**恰好** `"web"`；其它字符串合法但该行被当作非 Web 行丢弃（见 1.4） |
| `inject` | ❌ | **包名**依赖边（不是 Cordis 服务注入），用于「工厂到达顺序」和 Loader 端组合。见 §6 |
| `external` | ❌ | 精确的非基线模块请求（含子路径），见 §2.4 |
| `immediately` | ❌ | 布尔，stage-one 预取标记。**不决定脚本批次**（§1.6） |
| `entry` | — | **不存在**。bundle 路径由 `exports["./client"]` 决定 |

### 1.4 bundle 路径 = `exports["./client"]`

```ts
// asar:.../dsh-client-modules/src/index.ts:203-214
function clientExportOf(pkgName: string, exportsField: unknown): string | undefined {
  if (typeof exportsField !== 'object' || exportsField === null) return undefined
  const client = (exportsField as Record<string, unknown>)['./client']
  if (client === undefined) return undefined
  if (typeof client === 'string') return client
  if (typeof client === 'object' && client !== null) {
    const fallback = (client as Record<string, unknown>).default
    if (typeof fallback === 'string') return fallback
  }
  throw new Error(`client-modules: ${pkgName} exports["./client"] must be a string or an object with a string default`)
}
```

```ts
// asar:.../dsh-client-modules/src/index.ts:891-918
private resolveMeta(loaderName: string, baseUrl: string): ResolvedPkgMeta | null {
  const located = this.locatePkgJson(loaderName, baseUrl)
  if (located === undefined) {
    // Not a resolvable package root: loader builtins (cordis:include) and
    // subpath entries (…/gateway) land here — not a client row.
    return null
  }
  const { packageName, path: pkgPath } = located
  const pkg = JSON.parse(readFileSync(pkgPath, 'utf8')) as Record<string, unknown>
  const dsh = pkg.dsh
  const decl = parseDshClient(
    packageName,
    dsh !== null && typeof dsh === 'object' ? (dsh as Record<string, unknown>).client : undefined,
  )
  if (decl === undefined || decl.platform !== 'web') return null
  const clientRel = clientExportOf(packageName, pkg.exports)
  if (clientRel === undefined) {
    throw new Error(`client-modules: ${packageName} declares dsh.client but exports no "./client" bundle`)
  }
  const meta: PkgMeta = {
    clientPath: join(dirname(pkgPath), clientRel),
    manifestPath: pkgPath,
    ...(decl.inject !== undefined ? { inject: decl.inject } : {}),
    external: decl.external ?? [],
    immediately: decl.immediately === true,
  }
  return { packageName, meta }
}
```

由此得到三条硬约束：

1. `exports["./client"]` 是相对 `package.json` 所在目录的相对路径，文件**必须真实存在**，否则激活期抛错。
2. 该行必须是 **bare package specifier**（`@scope/name` 或 `name`）。子路径行（`pkg/gateway`）与 `cordis:*` 内置行不会被当成 client 行（`exactPackageSpecifier` 要求 scoped 正好两段、unscoped 无 `/` 无 `:`）。
3. 浏览器模块 id **就是解析出的包名**（`packageName`），不是 row id。

### 1.5 包同时必须有 Node 侧（host half）——哪怕空实现

client-modules 扫的是 Loader entries，所以包必须是可加载的 Cordis 插件。官方的纯 UI 包就是这样做的：

`asar:dsh/node_modules/@deepseek-ai/dsh-client-ui-skill/lib/index.js`（全文）：

```js
/**
* Skill reference plugin, node half. Pure UI plugin: the empty apply
* exists so the plugin appears in the host cordis.yml / Loader; the browser
* half ships via exports["./client"], discovered through the package.json
* dsh.client declaration.
*/
/** Host plugin body — no host-side behavior for this source plugin. */
function apply() {}
export { apply };
```

`dsh-client-ui-user-questions/lib/index.js` 同样只有 `function apply() {}`。

### 1.6 批次：bootstrap 只有一个包

`compose()`（`asar:.../src/index.ts:821-...`）里：

```ts
private compose(): WebBootGraph {
  const entries = orderByModuleGraph([...this.table.values()].map(record => record.entry))
  const bootstrap = PARSER_PRELOAD_IDS
    .map(id => this.table.get(id))
    .filter((record): record is WebPluginRecord => record !== undefined)
  const bootstrapIds = new Set(bootstrap.map(record => record.entry.id))
  const application = entries.filter(entry => !bootstrapIds.has(entry.id)) ...
```

```ts
/** Bootstrap package whose ordinary client bundle supplies the module-system implementation. */
const CLIENT_MODULES_ID = '@deepseek-ai/dsh-client-modules'
/** Dynamic bundles grouped into the parser bootstrap batch before the Vite shell. */
const PARSER_PRELOAD_IDS = [CLIENT_MODULES_ID] as const
```

**结论：`immediately: true` 不会把你的包放进 parser-blocking 的 bootstrap 批次**；bootstrap 批次永久保留给 `@deepseek-ai/dsh-client-modules`。你的包一定落在 `application` 批次（`<script-preload>` 预加载，不阻塞）。`immediately` 只是随 wire 传下去的 tier 标记（`WebBootEntry.immediately` → `BootPluginRow.immediately`）。实际 `entries.ts` 的 reconcile 对所有行一视同仁地 `prefetch` + `import`（`asar:.../src/client/entries.ts:225-240`）。

### 1.7 注入顺序（模块图）

`orderByModuleGraph`（`asar:.../src/index.ts:551-...`）按 `external` 做拓扑排序，注释写得很直白：

```ts
throw new Error(
  `client-modules: module graph cycle ${[...open.slice(cycleStart), entry.id].join(' -> ')} `
  + '— a requested package row must precede its consumers, and factory-form CJS cannot deliver partial exports',
)
```

自请求也会被拒：

```ts
throw new Error(
  `client-modules: "${entry.id}" requests module "${name}" that it answers itself `
  + '— a row must not declare its own package in dsh.client.external',
)
```

---

## 2. 浏览器端 bundle 的确切格式

### 2.1 结论：一段 classic script，只做一件事——注册工厂

**不是** ESM，**不是** IIFE 包裹的业务代码，**不需要** esbuild/tsc。宿主对字节**不做任何转换**（只剥掉尾部 `//# sourceMappingURL=` / `//# sourceURL=` 注释后拼接，见 `prepareSource`，`asar:.../src/index.ts:348-358`）。

加载方式是经典的 `<script>`（`asar:.../src/client/system.ts:15-29`）：

```ts
/** Default bundle-load hook: same-origin external classic script. */
const defaultLoadBundle = (url: string): Promise<void> => new Promise((resolve, reject) => {
  const el = document.createElement('script')
  el.async = true
  el.src = url
  ...
  document.head.append(el)
})
```

所以 bundle 里**不能出现静态 `import` / `export` 声明**（classic script 里直接 SyntaxError；动态 `import()` 表达式合法但没必要）。依赖一律通过 factory 的 `require(...)` 取得。

### 2.2 真实产物开头/结尾

`asar:dsh/node_modules/@deepseek-ai/dsh-client-ui-tool/lib/client.js`（151321 字节）：

开头（第 1 行就是注册）：

```js
window.__ModuleLoader__.load({id:`@deepseek-ai/dsh-client-ui-tool`,factory:require=>{var module={exports:{}};var exports=module.exports;Object.defineProperty(exports,Symbol.toStringTag,{value:`Module`});let react_jsx_runtime=require("react/jsx-runtime");let react=require("react");let _deepseek_ai_dsh_client_ui_primitives=require("@deepseek-ai/dsh-client-ui-primitives");...
```

结尾（导出 `apply` / `inject`，`module.exports` 即 factory 返回值）：

```js
... exports.apply=apply;exports.inject=inject;return module.exports}});
//# sourceMappingURL=client.js.map
```

`dsh-client-ui-skill/lib/client.js`（18857 字节）同构：`window.__ModuleLoader__.load({id:`@deepseek-ai/dsh-client-ui-skill`,factory:require=>{...` … `exports.apply=apply;exports.inject=inject;return module.exports}});`。

### 2.3 手写最小形态（App 内自带官方模板，**无需构建**）

`asar:dsh/node_modules/@deepseek-ai/dsh-agent-preset/skills/dsh-doc/templates/decoration/client.js`（全文）：

```js
window.__ModuleLoader__.load({
  id: '@local/my-decoration',
  factory(require) {
    const React = require('react');
    const h = React.createElement;
    function Decoration() {
      return h('svg', {
        viewBox: '0 0 64 64', width: 48, height: 48,
        'aria-hidden': true,
        style: { display: 'block', pointerEvents: 'none' },
      }, h('circle', { cx: 32, cy: 32, r: 24, fill: '#247bbf' }));
    }
    return {
      inject: ['slots'],
      apply(ctx) {
        ctx.slots.inject('conversation.composer.dock', () => ctx.slots.register({
          name: 'conversation.composer.dock', id: 'my-decoration', order: 5,
        }, Decoration));
      },
    };
  },
});
```

配套 `templates/decoration/index.js`：

```js
/** Host half of the decoration bundle; the Client module owns the rendering. */
export function apply() {}
```

配套 `templates/decoration/package.json`（节选）：

```json
{
  "name": "@local/my-decoration",
  "version": "1.0.0",
  "private": true,
  "type": "module",
  "exports": {
    ".": "./index.js",
    "./client": "./client.js",
    "./locale/*.json": "./locale/*.json",
    "./icon": "./icon.svg"
  },
  "files": ["index.js", "client.js", "cordis.patch.yml", "locale/*.json", "docs", "icon.svg"],
  "dsh": {
    "bundle": { "patch": "./cordis.patch.yml" },
    "client": {
      "platform": "web",
      "immediately": true,
      "inject": ["@deepseek-ai/dsh-client-ui-conversation"]
    }
  }
}
```

### 2.4 factory 的 `require` 能拿到什么

`asar:.../src/client/system.ts:326-351`：

```ts
private makeRequire(ownerId: string, edges: Set<string>): ClientBundleRequire {
  const require = (spec: string): unknown => {
    edges.add(spec)
    if (this.seed.has(spec)) return this.seed.get(spec)
    const id = stripClientSuffix(spec)
    const record = this.loadCache.get(id)
    if (record !== undefined) return record.exports
    if (this.factories.has(id)) return this.materialize(id).exports
    throw new Error(
      `client-modules: require("${spec}") missed the module table — not a platform seed word, not a materialized module, `
      + 'and no registered package factory (a build-time externals drift, or a dynamic dependency that did not arrive)',
    )
  }
  require.asset = (reference: string): string => this.resolveAsset(reference)
  require.async = async (spec: string): Promise<unknown> => { ... }
  return require
}
```

**解析顺序：seed（平台静态表）→ 已物化模块 → 已注册工厂（递归物化）→ 抛错。** 注意 seed 优先，插件无法影子替换 `react`。

平台静态表只有这 11 个 key（从运行中的前端 bundle 里抠出来的 `qJ()`，`asar:dsh/node_modules/@deepseek-ai/dsh-web-frontend/dist/assets/index-Ciz7DZxv.js`）：

```js
function qJ(){return{
  react: rS,
  "react/jsx-runtime": aS,
  "react-dom": fS,
  "react-dom/client": mS,
  "@deepseek-ai/cordis": jC,
  zod: tN,
  "@tanstack/react-virtual": cN,
  "@deepseek-ai/dsh-client-store": NN,
  "@deepseek-ai/dsh-client-ui-slots": RN,
  "@deepseek-ai/dsh-client-ui-primitives": DK,
  "@deepseek-ai/dsh-client-ui-dockkit": FJ
}}
```

> ⚠️ 注意：`@deepseek-ai/dsh-client-ui-slots`、`-primitives`、`-dockkit` **在 asar 里没有独立包目录**，它们是打进前端 dist 的静态模块。所以「import 不到包源码」不代表运行时 require 不到——**只要在表里就能 require**。

第二类可 require 的对象：**其它 client 包行**（`require('@deepseek-ai/dsh-client-ui-tool')` 或 `'.../client'`，`stripClientSuffix` 把两者归一）。这类请求必须写进 `dsh.client.external`（baseline 之外），否则组合期被拒；且被请求的包必须在图里（enabled）。

第三类：`require.asset('plugins/<pkg>/assets/<file>')`（包资产，需 `"./assets/*"` export）与 `require.async('./client.<name>.js')`（包内 chunk，仅 tsdown 产出的相对脚本）。

### 2.5 模块 id 的硬规则

* `id` **必须等于包名**。注册时会被 `stripClientSuffix` 归一（`asar:.../src/client/system.ts:166-180`）：

```ts
private register(registration: ClientBundleRegistration): void {
  const ownerId = stripClientSuffix(registration.id)
  if (registration.chunk !== undefined && !CLIENT_CHUNK.test(registration.chunk)) { ... }
  const id = registration.chunk === undefined ? ownerId : chunkId(ownerId, registration.chunk)
  if (this.bootstrapIds.has(id) || this.factories.has(id)) {
    const registrationName = registration.chunk === undefined ? registration.id : id
    throw new Error(`client-modules: duplicate factory registration for "${registrationName}" (bundle executed twice without invalidate?)`)
  }
  this.factories.set(id, { factory: registration.factory, rev: ... })
}
```

* 图里没有这个 id 的工厂 → 行永远「未注册」：

```ts
throw new Error(`client-modules: bundle ${url} loaded without registering "${id}" via __ModuleLoader__.load`)
```

* 同一脚本执行两次 → `duplicate factory registration`。所以 bundle 顶层**不要放副作用**（顶层只允许 `__ModuleLoader__.load(...)` 这一句），CSS 注入、事件监听都放进 `factory` 内部（首次物化时执行一次）。

### 2.6 factory 返回值 = 浏览器侧 Cordis 插件对象

`factory(require)` 返回的对象就是该模块的 `exports`，Cordis 的 Loader 会把它当插件：

```js
return {
  inject: ['slots'],          // 浏览器侧 Cordis 服务名（不是包名！）
  apply(ctx) { /* 注册 slot、ctx.effect(...) */ },
}
```

* `inject` 里写的是**服务名**（`slots`、`locale`、`remote`、`sessions`、`uiConversation`…），实测真实值：`dsh-client-ui-tool` → `['slots','remote','sessions']`；`dsh-client-ui-skill` → `['inputTriggers','sessions','slots','locale','remote','remote.skills','sidebarRight','uiConversation']`。
* 服务不可用时 fiber 停在 `pending`，页面 boot 审计会报 `pending (waiting for service: X)`。
* 资源注册应在 `apply` 内用 `ctx.effect(() => cleanup)` / `ctx.on(...)`，随插件卸载回收。

---

## 3. `ctx.slots` API

### 3.1 服务来源与前置条件

* `slots` 服务由 **`@deepseek-ai/dsh-client-ui-renderer`** 提供（`SlotRegistry extends Service`，`super(ctx, 'slots')`，见 `asar:dsh/node_modules/@deepseek-ai/dsh-client-ui-renderer/src/client/registry.ts:160`）。它**没有**随 asar 发布独立包，但其实现源码在 ui-renderer 里，可读。
* 你的浏览器模块必须 `inject: ['slots']`，否则 `ctx.slots` 不存在（fiber pending）。

### 3.2 `ctx.slots.inject(key, callback)`

签名（`asar:.../dsh-client-ui-renderer/src/client/registry.ts:194-271`）：

```ts
/**
 * Install an effect for each declaration lifetime of a slot. The callback
 * runs synchronously when the declaration already exists; otherwise it runs
 * inside the declaring `register()` call after the declaration is committed.
 * Collapse disposes the effect and a later declaration runs it again.
 * Callback effects are synchronous disposers; iterable effects install
 * transactionally and dispose in reverse order. The controller belongs to the
 * caller's fiber, so plugin unload cancels a pending wait and removes any
 * active contribution.
 *
 * @param key - declared SlotMap key to depend on.
 * @param callback - creates one disposer or an iterable of disposers.
 * @returns idempotent disposer for the wait and active effect.
 * @throws callback setup failures synchronously when the slot is already declared.
 */
inject(key: keyof SlotMap & string, callback: () => SlotInjectionEffect): () => void
```

`SlotInjectionEffect = (() => void) | Iterable<() => void, void, void>`。

语义要点（照抄实现行为）：

* **等待声明**：目标 slot 还没被任何人 declare 时，回调**不会跑**，也不报错——你的插件安静地什么都不做。
* 声明出现时**同步**跑回调；声明消失（owner 卸载 / disable）时执行回调返回的 disposer，再把登记项清掉；再次出现会再跑一次。
* 回调可以是 generator（`function*(){ yield ctx.slots.register(...); ... }`），事务式安装、逆序销毁。真实例子：`dsh-client-ui-cordis` 的 `ctx.slots.inject('tool.call.toolview', function* () { yield register(...); yield register(...) })`。
* `ctx.slots.inject` 本身返回一个 disposer。

### 3.3 `ctx.slots.register(options, Component)`

```ts
declare readonly register: SlotCore['register']   // asar:.../registry.ts:181
// 实现走 ctx.effect(() => this._register(options, component), 'slots.register()')
```

`SlotCore` 属于未随包发布的 `@deepseek-ai/dsh-client-ui-slots`，**精确的重载无法从 asar 取得**（标注：推断），但运行时擦除后的选项对象是完整的（`asar:.../registry.ts:84-97`）：

```ts
/** Type-erased options view the implementation works with (the typed overloads proved the shares). */
interface ErasedRegisterOptions {
  name: string
  children?: Record<string, SlotSpec<SlotEntryDef>>
  store?: StoreDecl
  inject?: (...args: never[]) => Record<string, unknown>
  key?: string
  id?: string
  order?: number
  label?: string
  /** Chain-slot routing selector (pure; the core validates presence for chain targets). */
  select?: (owner: never) => unknown
  /** Chain-slot explicit ordering override (ascending; registration order otherwise). */
  priority?: number
  /** Declared dictionary namespace (the renderer synthesizes the `t` seat from it). */
  locale?: string
  registrant?: string
}
```

按 cardinality 决定必填项（文档 + 全仓 300 处调用点统计一致）：

| slot kind | 必填 | 常用可选 |
|---|---|---|
| `single` | `name` | `priority`, `locale`, `inject`, `store`, `children` |
| `list` | `name` + `id` | `order`（升序，同序按注册顺序）, `priority`, `label`, `locale`, `inject` |
| `keyed` | `name` + `key` | `priority`（影子排名，越小越先/胜出）, `locale`, `inject`, `children` |
| `chain` | `name` + `id` + `select` | `priority`（选举顺序）, `locale`, `inject` |
| `hoc` | `name` + `id` | `key`（wildcard 无 key）, `order` |

实际调用点里出现过的键（统计自 asar 内所有 `src`）：`name` 300、`locale` 244、`inject` 151、`key` 147、`id` 95、`order` 50、`children` 40、`priority` 18、`label` 17、`store` 9、`select` 6。

`store` 的两种形态：共享实例（`StoreDecl`）与工厂（`store: createXxxStore` → 每次渲染 occurrence 铸造一个 handle）。

### 3.4 可用 slot 名（重点：`tool.call.toolview`）

全量树在 `asar:dsh/node_modules/@deepseek-ai/dsh/docs/subsystems/slots.md`（对话层级树 + 「Client inspect catalog」说明）。常用扩展位：

| slot | kind | scope | 声明者 |
|---|---|---|---|
| `tool.call.toolview` | keyed | session | `@deepseek-ai/dsh-client-ui-tool` |
| `conversation.chat.node` | keyed | session | `@deepseek-ai/dsh-client-ui-chat` |
| `conversation.composer` | chain | session | `@deepseek-ai/dsh-client-ui-conversation` |
| `conversation.composer.dock` | list | session | ui-conversation |
| `conversation.input.right` / `.left` / `.attachments` | list | session | ui-conversation |
| `conversation.session.header.actions` | list | session | ui-conversation |
| `conversation.user.text.node` | keyed | session | ui-conversation |
| `sidebar.panellist.actions` | list | root | ui-sidebar |
| `shell.overlay` | list | root | ui-layout |
| `plugins.item` / `plugins.bundle.config` / `plugins.row.config` / `plugins.detail.section` / `plugins.tab` / `plugins.add.actions` | 混合 | root | ui-plugin-manager |

> 不要往 `root` 注册（会顶掉整个 AppFrame，页面只剩你的组件）——`registry.ts:26-40` 的注释专门警告过。

`tool.call.toolview` 的 SlotMap 声明（`asar:dsh/node_modules/@deepseek-ai/dsh-client-ui-tool/src/client/contract/slots.ts:17-38`，原文）：

```ts
declare module '@deepseek-ai/dsh-client-ui-slots' {
  interface SlotMap {
    /**
     * Keyed Tool view dispatched by wire name, including custom tools.
     * Register with `key: '<tool name>'`; a typo never renders.
     * Occupied keys replace the view; unclaimed keys use the generic row. Owner
     * phase data includes `name` and lazy `args`; preparing arguments may be incomplete.
     */
    'tool.call.toolview': {
      kind: 'keyed'
      scope: 'session'
      owner: ToolCallOwnerProps
    }
    'tool.call.images': { kind: 'single'; scope: 'session'; owner: ToolImagesOwnerProps }
  }
}
```

它是**子 slot**：由 ui-tool 注册 `conversation.chat.node`（key=`tool-call`）时声明（`asar:dsh/node_modules/@deepseek-ai/dsh-client-ui-tool/src/client/apply.ts:24-43`）：

```ts
export const inject = ['slots', 'remote', 'sessions']

export function apply(ctx: ClientContext): void {
  ...
  ctx.slots.inject('conversation.chat.node', () => ctx.slots.register({
    name: 'conversation.chat.node',
    key: 'tool-call',
    locale: NS,
    children: {
      'tool.call.toolview': { kind: 'keyed', scope: 'session' },
    },
    inject: toolInject,
  }, ToolCallTree))
```

派发点（`asar:dsh/node_modules/@deepseek-ai/dsh-client-ui-tool/src/client/tool/ToolCallTree.tsx:45-59`）：

```tsx
return (
  <div className={css.callRow} data-chat-anchor-key={`call:${callId}`} data-chat-call-id={callId}>
    {autoReviewDenied
      ? renderFallback(owner)
      : renderSlot('tool.call.toolview', owner, {
        entryKey: toolName,
        fallback: renderFallback(owner),
      })}
    {children}
  </div>
)
```

`entryKey` 就是**工具 wire name**。且 `callName()`（同文件 15-17）：

```ts
function callName(call: ToolCallPhaseProps): string {
  return call.phase === 'result' ? call.block.call?.name ?? '' : call.block.name
}
```

⚠️ **坑**：结果阶段若 `tool/call` 事件落在已加载窗口之外，`block.call` 为 `null` → key 变成 `''` → 你的卡片不渲染，回退到通用行（`GenericToolCard`）。卡片必须容忍「不渲染」。

### 3.5 组件收到的 props 精确形状（TypeScript 原文）

`asar:dsh/node_modules/@deepseek-ai/dsh-client-ui-tool/src/client/contract/slots.ts:41-86`：

```ts
/** Standard owner currency supplied to every atomic Tool view. */
export interface ToolCallCommonProps {
  /** Stable Hook; each invocation owns its open state and subscribes to enclosing-Turn resets. */
  useDisclosure: UseDisclosure
  /** Call identity, stable across all stages. */
  callId: string
  /** Wire Tool name and keyed dispatch value. */
  toolName: string
  /** Session workspace root for relative summaries. */
  cwd?: string | undefined
  /** Host account home; POSIX home-rooted summaries display as `~`. */
  home?: string | undefined
  /** Open an argument path at its optional requested line. */
  openFile: (path: string, options?: OpenFileOptions) => void
  /** Chat-supplied, Gateway-authorized loader for durable images; Tool views do not manage attachment URLs. */
  loadImage: MessageImageLoader
  /** Inspect this call in the trajectory view when available. */
  inspect?: (() => void) | undefined
}

/** Stage-specific tool data; only start/result expose the dispatched call material. */
export type ToolCallPhaseProps =
  | { readonly phase: 'preparing'; readonly block: PreparingToolCall }
  | { readonly phase: 'start'; readonly block: StartedToolCall }
  | { readonly phase: 'result'; readonly block: ToolResultNode }

/** Common owner callbacks and the data admitted at the current tool stage. */
export type ToolCallOwnerProps = ToolCallCommonProps & ToolCallPhaseProps

/** Full props of a registered atomic Tool view. */
export type ToolCallViewProps = PropsRuntime<'tool.call.toolview'>

/** Existing argument/result business components exclude the preparation stage. */
export type StartedToolCallViewProps = Exclude<ToolCallViewProps, { readonly phase: 'preparing' }>
```

`PropsRuntime<K>` = 该 slot 的 owner props + scope 标准 props（`session` scope 下：`sessionId`、`useSession`、`useProjection`、`useAccess`、`useConversation`、`useInput`、`inputActions`、`useChat`）+ 跨 scope 的 `useSessions`/`useSessionStatus`/`useSessionRetainInfo`/`useSessionAccess`/`useWorkspaces`/`useWorkspaceAccess`/`useRemoteAccess`/`usePanelInfo` + 注册时 `store` 派生的 `useStore` + `inject` 工厂返回值 + `renderSlot`（声明了 children 才有）。

⚠️ **`t` 不在 `PropsRuntime` 里**。真实代码都自己拼（`PresentRow.tsx:8`、`bash-sample.tsx:22`）：

```ts
type PresentRowProps = ToolCallViewProps & PropsLocale<typeof NS>
type BashRowProps    = ToolCallViewProps & PropsLocale<'conversation'>
```

运行时 `t` 由注册选项 `locale: '<namespace>'` 合成；不声明 `locale` 就没有 `t`。

### 3.6 三种 phase 各带什么 block（原文）

`asar:dsh/node_modules/@deepseek-ai/dsh-client-ui-conversation/src/client/contract/records.ts:163-317`：

```ts
/** Identity and placement shared by tool preparation and dispatch. */
interface ToolCallHead {
  callId: string
  /** Parent Tool call for a PTC dispatch start; absent on a root Session call. */
  parentCallId?: string
  name: string
  turn: number
  step: number
  /** Unix epoch ms when this stage began. */
  time: number
  /** Child calls owned by this call, in dispatch order. */
  subCalls: readonly ToolCallBlock[]
  /** The argument view; see {@link ToolArgs}. */
  args: ToolArgs
}

/** A named model call whose complete arguments are not yet available to tool views. */
export interface PreparingToolCall extends ToolCallHead {
  readonly phase: 'preparing'
}

/** A dispatched tool call with complete arguments and no result yet. */
export interface StartedToolCall extends ToolCallHead {
  readonly phase: 'start'
  readonly argsRaw: string
}

/** A tool still preparing or awaiting its result. */
export type RunningToolCall = PreparingToolCall | StartedToolCall

/** One preparing, dispatched, or settled call, recursively owning its child calls. */
export type ToolCallBlock = RunningToolCall | ToolResultNode
```

```ts
/** A tool result paired (when in-window) with its call head. */
export interface ToolResultNode {
  kind: 'tool-result'
  seq: number
  /** Unix epoch ms from the tool/result session event. */
  time: number
  callId: string
  /** Parent Tool call for a PTC dispatch result; absent on a root Session result. */
  parentCallId?: string
  /** Wire tool name from the paired tool/call; empty when that call left the loaded window. */
  name: string
  /** The argument view of the paired call; see {@link ToolArgs}. */
  args: ToolArgs
  /** Call head backfilled from the in-window tool/call; null when window truncation left the call outside (card head shows callId). */
  call: { name: string; argsRaw: string } | null
  /** Unix epoch ms of the paired tool/call when the call is still in-window; used for call-row duration. */
  callTime: number | null
  content: readonly ContentBlock[]
  isError: boolean
  error?: { name: string; code: string; reason?: string }
  meta?: unknown
  /** Child calls owned by this call, in dispatch order. */
  subCalls: readonly ToolCallBlock[]
}
```

**区分阶段的惯用法**：`phase === 'result'` 等价于 `'kind' in block`（`ToolResultNode` 有 `kind: 'tool-result'`）。官方 `PresentRow.tsx:52-56`：

```ts
const settled = 'kind' in block
const state = !settled ? 'running' : block.error?.code === 'interrupted' ? 'stopped' : block.isError ? 'error' : 'ok'
const args = (settled ? block.call?.argsRaw : block.argsRaw) ?? ''
const output = settled ? block.content.map(item => item.type === 'text' ? item.text : JSON.stringify(item)).join('\n') : ''
const details = output || (settled && block.error ? `${block.error.name}: ${block.error.code}` : '')
```

### 3.7 结果内容怎么读

**读 `block.content`（`readonly ContentBlock[]`），不是 `result.content`，也没有 `blocks` 字段。** `ContentBlock` 是 merge-extensible 映射（`asar:dsh/node_modules/@deepseek-ai/dsh-llm/src/types.ts`）：

```ts
export interface ContentBlockMap {
  'text': TextBlock
  'reasoning': ReasoningBlock
  'image': ImageBlock
  'file': FileBlock
  'tool-call': ToolCallBlock
  'tool-addition': ToolAdditionBlock
  'tool-removal': ToolRemovalBlock
}
export type ContentBlock = ContentBlockMap[ContentBlockType]
```

官方唯一权威的「拍平结果文本」实现（`asar:dsh/node_modules/@deepseek-ai/dsh-client-ui-tool/src/client/tool/models/tool-call-model.ts`，`resultText`）：

```ts
export function resultText(node: ToolResultNode): string {
  const parts: string[] = []
  for (const block of node.content) {
    if (block.type === 'text') parts.push(block.text)
    else parts.push(JSON.stringify(block, null, 2))
  }
  if (parts.length === 0 && node.error !== undefined) {
    parts.push(`${node.error.name}: ${node.error.code}`)
  }
  return parts.join('\n')
}
```

它**没有从 `dsh-client-ui-tool/client` 导出**（该包 client index 只导出 `apply`/`inject` 和 8 个类型），所以第三方要在自己 bundle 里复制这 11 行。

其它可用字段：
* `block.isError` / `block.error.{name,code,reason}`：失败信息（`error.code === 'interrupted'` 表示被停止）。
* `block.meta`：工具自报的结构化元数据（`unknown`，需自己防守）。
* `block.subCalls`：PTC 子调用，递归同构。
* `block.seq` / `block.time` / `block.callTime`：排序与计时。

### 3.8 调用参数怎么懒读：`ToolArgs = PartialArguments`

三种 phase 都有 `args`（`ToolCallHead.args`）。它是**增量 JSON 扫描视图**，不是普通对象（`asar:dsh/node_modules/@deepseek-ai/dsh-util-values/src/partial-json.ts:76-...`）：

```ts
/**
 * Lazily scanned view of one JSON object's top-level fields, built from text
 * that may still be streaming or from an already parsed object. Nothing is
 * scanned until a reader asks; the view remembers every question it answered
 * and reports changed answers when the owner refreshes for publication.
 */
export class PartialArguments {
  static readonly EMPTY: PartialArguments
  static fromText(text: string): PartialArguments
  static fromObject(value: unknown): PartialArguments
  get isSealed(): boolean
  get invalid(): boolean
  append(fragment: string): void
  settle(text: string): PartialArguments
  refresh(): boolean
  closed(): boolean
  keys(): readonly string[]
  has(key: string): boolean
  complete(key: string): boolean
  stringLength(key: string, options?: LengthReadOptions): number | undefined   // {step?, offset?}
  stringExceeds(key: string, maxLength: number): boolean
  text(key: string): string | undefined          // 字符串字段（流式中返回已到达的前缀）
  textPrefix(key: string, maxLength: number): string | undefined
  value(key: string): JsonValue | undefined      // 已闭合的非字符串值；流式中为 undefined
}
```

契约（原文注释）：

* 「Every reader is total: an absent or differently typed field answers `undefined` (or `false`), never throws.」
* 「Read it during render or view construction, not into independent state keyed only by the args or block object identity.」

所以正确姿势是**每次渲染直接读**：

```js
const args = block.args
const path = args.text('path')            // 字符串
const n = args.value('limit')             // 数字/对象，闭包后才给
const streaming = !args.complete('path')  // 该字段还没闭合
```

---

## 4. 最小可运行示例：注册一个自定义工具卡片

目标：为工具 `my_tool` 提供卡片，读 `args.query`、结果文本，纯手写 JS + 内联样式，无构建。

### 4.1 目录

```text
my-tool-card/
  package.json
  cordis.patch.yml
  lib/index.js      # host half（空 apply）
  lib/client.js     # browser half（手写）
  locale/en.json    # 可选：GUI 显示元数据
  locale/zh.json    # 可选
  icon.svg          # 可选
```

### 4.2 `lib/client.js`（完整、可直接用）

```js
// dsh client plugin — 手写 classic script，无需构建。
// 1) id 必须严格等于 package.json 的 name。
// 2) 顶层只做注册；所有副作用放在 factory 内部（首次物化时执行一次）。
window.__ModuleLoader__.load({
  id: '@local/my-tool-card',
  factory(require) {
    const React = require('react')
    const h = React.createElement

    /** 结果内容拍平：ToolResultNode.content 是 ContentBlock[]。 */
    function resultText(block) {
      const parts = []
      for (const item of block.content) {
        if (item && item.type === 'text') parts.push(item.text)
        else parts.push(JSON.stringify(item, null, 2))
      }
      if (parts.length === 0 && block.error) parts.push(block.error.name + ': ' + block.error.code)
      return parts.join('\n')
    }

    /** 参数懒读：字符串用 text()，其它用 value()（闭合后才有值）。 */
    function argText(args, key) {
      const v = args.text(key)
      return v === undefined ? '' : v
    }

    function ToolCard(props) {
      // props = ToolCallOwnerProps + scope 标准 props；block 由 phase 收窄。
      const { toolName, block, phase } = props
      const args = block.args

      const query = argText(args, 'query')
      const summary = query || argText(args, 'path') || props.callId

      const settled = phase === 'result'
      const failed = settled && block.isError === true
      const output = settled ? resultText(block) : ''

      const [open, setOpen] = React.useState(false)

      const chip = phase === 'preparing' ? '准备中'
        : phase === 'start' ? '运行中'
        : failed ? '失败' : '完成'

      return h('div', {
        'data-tool': toolName,
        'data-phase': phase,
        style: {
          display: 'flex', flexDirection: 'column', gap: 4,
          padding: '6px 10px', borderRadius: 8,
          border: '1px solid var(--dsw-alias-border-l2)',
          background: 'var(--dsw-alias-bg-layer-1)',
          color: 'var(--dsw-alias-label-primary)',
          fontSize: 'var(--dsh-content-font-size-secondary, 13px)',
        },
      },
        h('button', {
          type: 'button',
          'aria-expanded': settled ? open : undefined,
          onClick: settled ? () => setOpen(v => !v) : undefined,
          style: {
            all: 'unset', display: 'flex', gap: 8, alignItems: 'baseline',
            minWidth: 0, cursor: settled ? 'pointer' : 'default',
          },
        },
          h('span', { style: { flex: 'none', color: 'var(--dsw-alias-label-secondary)' } }, 'my_tool'),
          h('span', {
            style: { flex: '1 1 auto', minWidth: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' },
          }, summary),
          h('span', {
            style: {
              flex: 'none',
              color: failed ? 'var(--dsw-alias-label-error)' : 'var(--dsw-alias-label-tertiary)',
            },
          }, chip),
        ),
        settled && open && h('pre', {
          style: {
            margin: 0, maxHeight: 240, overflow: 'auto',
            whiteSpace: 'pre-wrap', wordBreak: 'break-word',
            fontFamily: 'var(--ds-font-family-code)',
            color: failed ? 'var(--dsw-alias-label-error)' : undefined,
          },
        }, output || '(无输出)'),
      )
    }

    return {
      inject: ['slots'],
      apply(ctx) {
        // inject 等声明出现；register 的 key = 工具 wire name。
        ctx.slots.inject('tool.call.toolview', () => ctx.slots.register(
          { name: 'tool.call.toolview', key: 'my_tool' },
          ToolCard,
        ))
      },
    }
  },
})
```

要点复核：

* `React.createElement` 里 style 的 key 用 camelCase；CSS 变量走字符串值完全合法（`'var(--dsw-alias-...)'`）。
* `props.useDisclosure` 也能拿到现成的展开 hook（官方 `BashRow` 用它）；这里为演示自管 `useState`。
* 想加本地化：注册时加 `locale: 'myToolCard'`，并把类型（TS 时）写成 `ToolCallViewProps & PropsLocale<'myToolCard'>`，同时在包内提供 `locale/en.json`、`locale/zh.json` 的该命名空间。
* 想声明子 slot（例如挂 `tool.call.images`）就加 `children: { 'tool.call.images': { kind: 'single', scope: 'session' } }`——但同一子 slot 只能有一个条目声明它，重复会加载期抛错。

### 4.3 `package.json`

```json
{
  "name": "@local/my-tool-card",
  "version": "1.0.0",
  "private": true,
  "type": "module",
  "description": "Tool card for my_tool",
  "main": "lib/index.js",
  "exports": {
    ".": "./lib/index.js",
    "./client": "./lib/client.js",
    "./locale/*.json": "./locale/*.json",
    "./icon": "./icon.svg"
  },
  "files": [
    "lib/index.js",
    "lib/client.js",
    "cordis.patch.yml",
    "locale/*.json",
    "docs",
    "icon.svg"
  ],
  "dsh": {
    "bundle": { "patch": "./cordis.patch.yml" },
    "client": {
      "platform": "web",
      "inject": [
        "@deepseek-ai/dsh-client-ui-renderer",
        "@deepseek-ai/dsh-client-ui-tool"
      ]
    }
  }
}
```

`inject` 解释：`@deepseek-ai/dsh-client-ui-renderer` 提供 `slots` 服务；`@deepseek-ai/dsh-client-ui-tool` 声明并派发 `tool.call.toolview`。两者都已在 desktop 的 `dsh-web-app` 层里默认启用。

### 4.4 `cordis.patch.yml`

```yaml
- insert:
    - id: my-tool-card
      name: '@local/my-tool-card'
```

`name` 必须是**bare package specifier**（这里 `@local/my-tool-card`），`id` 随便取；client 行挂到 `name` 解析出的包上。

### 4.5 `lib/index.js`

```js
/** Host half: 空 apply 只为让包成为 Loader 的一行。 */
export function apply() {}
```

### 4.6 示例的自检（已跑通）

仓库里留了一份最小仿真 harness，把上面的 `client.js` 从文档里抠出来、用假 `window.__ModuleLoader__` + 假 `react` 跑：

```bash
node /home/bian/next/deepseek-harness-zhongyijingfang/.scratch/research/verify/harness.cjs
```

实测输出（2026-11-20）：

```text
id             = @local/my-tool-card
module exports = inject,apply | inject = ["slots"]
slots.inject   = tool.call.toolview
register       = {"name":"tool.call.toolview","key":"my_tool"} | component = function
phase preparing-> ok, summary from args.query = true
phase start    -> ok, summary from args.query = true
phase result   -> ok, summary from args.query = true

ALL CHECKS PASSED
```

它只能证明「注册形状 + 三 phase 渲染不抛错 + args 读取生效」，**不能**替代在真实页面里看到卡片。

### 4.7 安装与验证

```bash
# 方式 A（GUI，推荐）：Plugins → Add plugin → 填绝对路径 → Install → Enable now
# 方式 B（CLI）：先完全退出桌面 App（profile 有文件锁），再
dsh plugin --profile desktop add /abs/path/to/my-tool-card
```

验证：

1. Plugins 列表里出现 bundle 卡片与行，行状态 `active`；
2. 新开一个会话，调用 `my_tool`；
3. 页面 DevTools：`window.__DSH_BOOT__.entries.find(e => e.id === '@local/my-tool-card')` 应存在；
4. 失败时看 boot 审计（页面顶部「Failed to load plugins」/ 控制台 `web boot:` 日志）。

---

## 5. 样式：设计系统 / 原子组件 / 主题变量

### 5.1 可用的原子组件

`require('@deepseek-ai/dsh-client-ui-primitives')` 是**静态基线**（§2.4 的 seed 表里有），所以**任何 client plugin 都能免声明 require 它**，即使 asar 里没有这个包目录。

从全部插件源码统计出的高频导出（232 个不同名字，节选）：

| 类别 | 组件 / 工具 |
|---|---|
| 按钮/表单 | `Button`(86 次)、`Switch`、`Checkbox`、`Input`、`SegmentedControl`、`SegmentedTabs`、`InlineEditor`、`SettingsForm*`、`SettingsValueField`、`SettingsSecretField` |
| 浮层 | `Tooltip`(73)、`Menu`(37)、`MenuSurface`、`MenuGroup`、`MenuItemButton`、`HoverCard`、`HoverCardGroup`、`Modal`、`useModalLayer`、`closeTopModal`、`modalSelector` |
| 结构/展示 | `DisclosureRow`(13)、`Tag`、`Pill`、`StateDot`、`TextShimmer`、`AnimatedRows`、`PathLabel`、`FileTypeIcon`、`JsonBlock`、`JsonTree`、`CodeBlock`、`FenceCodeBlock`、`MarkdownText`、`TerminalBlock`、`DiffBlock`、`ReadBlock`、`SearchBlock`、`WebBlock`、`CommandText`、`ShortcutKeys`、`Toast` |
| 图标 | `IconChevronDownOutlineRegular`、`IconCloseOutlineRegular`、`IconCheckOutlineRegular`、`IconWarningOutlineRegular`、`IconSearchOutlineRegular`、`IconInspectOutlineRegular`、`IconApiOutlineRegular` …（200+ 个 `Icon*Regular` / `*Medium`，均接受 `{ size }`） |
| 工具函数 | `clsx` 不在此包（单独 dev 依赖），本包有 `writeClipboard`、`fileSizeText`、`fileExtension`、`classifyFileType`、`languageForPath`、`relativeTime`、`isMobileDevice`、`focusWithoutRing`、`useDismissOnOutsidePointer` |

另有 `require('@deepseek-ai/dsh-client-ui-dockkit')`（停靠/浮动布局）、`require('@deepseek-ai/dsh-client-store')`（store 原语）、`require('zod')`、`require('@tanstack/react-virtual')`、`require('@deepseek-ai/cordis')`。

### 5.2 主题变量（**全部是 CSS 自定义属性，运行时可读**）

`asar:dsh/node_modules/@deepseek-ai/dsh-web-frontend/dist/assets/index-CSAdOBx6.css` 里定义了 **71 个 `--dsw-alias-*`**、51 个 `--dsh-*`、3 个 `--ds-*`。常用：

```css
/* 文字 */
--dsw-alias-label-primary      --dsw-alias-label-secondary   --dsw-alias-label-tertiary
--dsw-alias-label-caption      --dsw-alias-label-dimmed      --dsw-alias-label-error
/* 背景/描边 */
--dsw-alias-bg-base            --dsw-alias-bg-layer-1        --dsw-alias-bg-layer-2
--dsw-alias-border-l1          --dsw-alias-border-l2         --dsw-alias-border-l3
--dsw-alias-interactive-bg-hover   --dsw-alias-interactive-bg-active
/* 状态 */
--dsw-alias-state-success-primary  --dsw-alias-state-error-primary
--dsw-alias-state-warn-primary     --dsw-alias-state-idle-primary
/* 品牌/交互 */
--dsw-alias-brand-primary      --dsw-alias-link              --dsw-alias-button-primary-fill
/* 排版轴（跟随设置里的内容字号） */
--dsh-content-font-size        --dsh-content-font-size-secondary
--dsh-content-font-delta       --ds-font-family-code
```

官方行样式就是这么写的（`ToolRow.module.css`）：

```css
.summary {
  font-size: var(--dsh-content-font-size-secondary, 13px);
  line-height: calc(24px + var(--dsh-content-font-delta, 0px));
}
.sep { background: var(--dsw-alias-label-caption); }
```

### 5.3 className 约定

* 编译产物的 CSS Modules 类名带 6 位 hash 前缀（如 `ZG377q_card`），**不可跨包复用**。
* 官方 bundle 的 CSS 注入形态（`dsh-client-ui-tool/lib/client.js`）：

```js
const tagId$6=`@deepseek-ai/dsh-client-ui-tool/AskQuestionCard.module.css`;
if(typeof document!==`undefined`&&document.querySelector(`style[data-plugin-css=`+JSON.stringify(tagId$6)+`]`)===null){
  const tag=document.createElement(`style`);
  tag.dataset.plugin=`@deepseek-ai/dsh-client-ui-tool`;
  tag.dataset.pluginCss=tagId$6;
  tag.textContent=css$6;
  document.head.appendChild(tag)
}
```

* 手写 JS 也可以照样干：在 `factory` 里往 `document.head` 塞 `<style>`。模块系统会**自动认领**物化期间新增的无 `data-plugin` 的 `<style>`（`system.ts:76-86` `claimStyles`），并在插件卸载/HMR 时清掉。
* 业务语义属性用 `data-*`（`data-tool`、`data-state`、`data-phase`、`data-expandable`），官方大量使用，便于调试与主题选择器。

### 5.4 纯内联 style 可行吗？

**可行，而且是最稳的方案。** 理由：

1. 组件是普通 React 组件，`style` prop 走 React 标准路径；
2. 主题 token 是纯 CSS 变量，`style={{ color: 'var(--dsw-alias-label-secondary)' }}` 直接生效（含亮/暗主题自动切换，因为变量在 `:root`/主题层被重写）；
3. 不依赖任何构建期 CSS Modules、不产生全局类名、卸载即消失（无泄漏）；
4. `ui-theme` 的 `ThemeRuntime` 负责 `--dsw-*` 注入，你不需要自己处理主题切换。

限制：`style` 里不能写伪类/媒体查询/`@media (hover)`。需要 hover/焦点态时，用 React 事件（`onMouseEnter`）或退回 5.3 的 `<style>` 注入。

---

## 6. 注入依赖（两层，别混）

| 层 | 位置 | 写什么 | 作用 |
|---|---|---|---|
| **包级** | `package.json` → `dsh.client.inject` | **包名**，如 `@deepseek-ai/dsh-client-ui-tool` | ① 模块图排序：被请求的行先到；② Loader 侧组合边（对方不 active，你这行 pending）；③ 工厂到达顺序 |
| **服务级** | `client.js` 里 `return { inject: [...] }` | **Cordis 服务名**，如 `slots`、`locale`、`remote`、`sessions` | 浏览器侧 fiber 等待服务就绪 |

### 6.1 要用 `ctx.slots`，必须注入什么

* 服务级：**必须** `inject: ['slots']`（否则 `ctx.slots` 不存在，fiber pending）。
* 包级：至少把 `@deepseek-ai/dsh-client-ui-renderer`（`slots` 的提供者）写进 `dsh.client.inject`；要注册别人的 slot，再把 **slot 声明者**的包名写进去。

真实范例（`asar:dsh/node_modules/@deepseek-ai/dsh-client-ui-user-questions/package.json`）：

```json
"dsh": {
  "client": {
    "inject": [
      "@deepseek-ai/dsh-api-remotes",
      "@deepseek-ai/dsh-api-session-controller",
      "@deepseek-ai/dsh-client-locale",
      "@deepseek-ai/dsh-client-ui-conversation",
      "@deepseek-ai/dsh-client-ui-renderer",
      "@deepseek-ai/dsh-client-ui-session",
      "@deepseek-ai/dsh-client-ui-chat"
    ],
    "platform": "web"
  }
}
```

`dsh-client-ui-action-cards` 的浏览器模块则是最精简的一档：`inject = ['slots','locale','remote']`。

### 6.2 加载顺序

1. 宿主把每个 row 的 `external` 做拓扑排序（`orderByModuleGraph`），被请求者在前；有环直接抛错。
2. 浏览器侧 `arriveGraphRow`（`system.ts:253-280`）先递归到达 `external` 依赖，再递归到达 `inject` 里的包，最后才取自己。
3. 依赖失败时错误会串成链（`system.ts:282-297`）：

```ts
throw new Error(
  `client-modules: "${consumerId}" not loaded because dependency "${dependency.id}" failed: ${describeError(error)}`,
  { cause: error },
)
```

4. Cordis 侧 fiber 再等服务（`inject` 数组），服务不来就 pending。

### 6.3 失败会怎样

* **包级组合失败**（`dsh.client` 非法、`exports["./client"]` 缺失、声明了但没有 bundle）：激活期抛 `ClientPackageCompositionError` → client-modules 自己是 FAILED → 整个 boot 审计报错（它是 shell 的 required 之一）。
* **单行脚本加载失败**：一条 combo 脚本 `<script>` 失败会**同一 URL 重试一次**；仍失败则对该行改走「单资源 combo URL」重试一次（每个缺失行最多 3 个请求）。批量脚本「加载成功但没注册我这行」不会重放（避免重复注册）。
* **fiber 失败/pending**：页面 boot 审计把失败按行列出；`@deepseek-ai/dsh-client-modules`、`-api-session-controller`、`-ui-renderer`、`-ui-layout`、`-ui-session`、`-ui-chat`、`-ui-sidebar` 这 7 个是 **required**，缺一个就整体报错；**你的第三方插件不在 required 集合里，失败只是警告**（`VJ` 常量，`asar:dsh/.../dist/assets/index-Ciz7DZxv.js`）：

```js
VJ=new Set(["@deepseek-ai/dsh-client-modules","@deepseek-ai/dsh-api-session-controller","@deepseek-ai/dsh-client-ui-renderer","@deepseek-ai/dsh-client-ui-layout","@deepseek-ai/dsh-client-ui-session","@deepseek-ai/dsh-client-ui-chat","@deepseek-ai/dsh-client-ui-sidebar"]);
```

* 页面端可在 Settings → Plugins → Plugin list 看到 page-local 同步失败并「retry」（Host enablement 不变）。

---

## 7. 安装路径、GUI 管理器、bundle 服务与 `files`

### 7.1 宿主如何服务 bundle：`/plugins`，**不是** `/api/client-modules`

路由注册（`asar:.../dsh-client-modules/src/index.ts:703-708`）：

```ts
webCtx.effect(
  () => webCtx.webServer.register({ kind: 'prefix', path: PLUGIN_ROUTE, resource: request => this.fetchBundle(request) }),
  'client-modules: bundle route',
)
```

```ts
const PLUGIN_ROUTE = '/plugins'
```

实际 URL 形态（`comboSearch` / `comboUrl` / `chunkUrl`，`src/index.ts:271-295`）：

```text
GET /plugins/??@scope/a/client.js,@scope/b/client.js&rev=<12hex>      # 组合脚本（1..N 个包）
GET /plugins/??@scope/a/client.js.map,@scope/b/client.js.map&rev=...  # 组合 source map
GET /plugins/<pkg>/client.<name>.js?rev=<rev>                         # 包内 chunk（tsdown 产物）
GET /plugins/<pkg>/assets/<path>                                      # 包图片资产（"./assets/*" export）
```

补充事实：

* 组合 URL 的 revision 来自 `mtimeMs/ctimeMs/size`（不哈希内容），≤ 3 KiB 一段，超出自动分段。
* 桌面 App 里页面 origin 是 `dsh-app://app`，`/plugins/*` 被主进程**转发**给本地 Host（带 cookie），并把 `cache-control` 改写成 `no-store`（`asar:lib/main.js`，`PLUGIN_BUNDLE_PATH = /^\/plugins\//u`）：

```js
/** Host routes whose responses carry immutable cache headers keyed by a per-process revision. */
const PLUGIN_BUNDLE_PATH = /^\/plugins\//u;
...
if (PLUGIN_BUNDLE_PATH.test(source.pathname)) outgoing.set("cache-control", "no-store");
```

* 全 asar 检索 `/api/client-modules` → **0 命中**；路径是旧的猜测。

### 7.2 GUI 插件管理器能从本地路径装

`@deepseek-ai/dsh-client-ui-plugin-manager`（asar 内 41 664 字节 README）明确：

> **Add plugin** takes a package name with an optional version, a Git address, a tarball, or **an absolute local path**.
> **Install a third-party plugin** — Closes the menu and opens the same dialog for a package name, Git repository, or **local directory**.

但有两条硬限制（同一 README「Known limitations」）：

> **Only bundles are managed** — a dependency without a bundle patch is refused before it installs; one the profile already holds is left off the page unless the profile selects it, and loading plain plugin modules stays a file operation.
> **One install at a time** — the dialog runs one pnpm command.

也就是说：**GUI 只装「bundle」**（`dsh.bundle.patch` 存在），纯 client-only 依赖会被拒装。装完要 **Enable now**（写 profile 的 layer 选择）。

### 7.3 CLI：`dsh plugin --profile desktop add <path>`

* `dsh` 的 `plugin` 子命令实现：`asar:dsh/node_modules/@deepseek-ai/dsh/src/plugin.ts`（`runPlugin`）。
* `--profile desktop` 是特例：**必须先跑过一次桌面 App**（初始化 profile），否则报

  > `Open DeepSeek Harness Desktop once to initialize its profile, then fully quit it before running dsh plugin --profile desktop.`

  并且走 `runProfilePnpm`（就是 profile 目录里的 pnpm），**不是** `runPluginCommand`；两者都会在成功后 reconcile：
* 安装完成后自动把「新增且声明了 `dsh.bundle`」的依赖 **push 进 `dsh.profile.bundles`**（`asar:dsh/node_modules/@deepseek-ai/dsh-plugin-manager/src/operations.ts`，`reconcile()`）：

```ts
for (const name of dependencies) {
  if (beforeDeps.has(name)) continue
  const metadata = bundleManifest(name, dir, anchor)
  if (metadata?.dsh?.bundle === undefined) {
    options.onOutput?.(`dsh: warning: ${name} declares no dsh.bundle — installed as a plain dependency, not a profile layer\n`, 'stderr')
    continue
  }
  ...
  if (!bundles.includes(name)) bundles.push(name)
}
```

⇒ **只 `pnpm add` 一个没有 `dsh.bundle` 的包，永远不会被扫描成 client 行**（没有 Loader 行 → client-modules 看不到它）。必须提供 `dsh.bundle.patch`，或手写进 `profiles/desktop/cordis.patch.yml`。

### 7.4 `files` 与 prebuilt `lib/client.js`

* 宿主**只读磁盘上的文件**，与 `files` 字段无关。
* `files` 只在 **打包/发布**（`pnpm pack` / npm publish）时决定进包内容。官方所有 client 包的 `files` 都显式列出：

```json
"files": [
  "locale/*.json",
  "lib/index.js",
  "lib/client.js",
  "lib/types/**/*.d.ts",
  "lib/types/**/*.d.ts.map",
  "lib/**/*.js.map",
  "src"
]
```

  **漏掉 `lib/client.js` 的后果**：本地 link 安装照常工作；一旦从 registry/tarball 安装就 404「declares dsh.client but exports no './client' bundle」。
* **本地目录安装是 link**，不经过 `files` 过滤 —— `host-plugin.md` 原文：

  > Local directory installation links the checkout instead, so check the files directly; `files` does not filter a linked directory.

* 顺带一条环境事实：desktop profile 的 `pnpm-workspace.yaml` 是 `nodeLinker: hoisted` + `autoInstallPeers: false`，所以**别指望 peer 被自动安装**。建议 host half 零 import（`export function apply() {}`），浏览器 half 只用静态表里的模块。

### 7.5 显示元数据（装完在 GUI 里好看）

`locale/en.json` + `locale/zh.json`：

```json
{ "meta": { "title": "My tool card", "description": "Custom card for my_tool.", "detail": "docs/DETAIL.md" } }
```

`icon.svg`（≤256 KiB，PNG/JPEG/WebP 也可），`exports` 加 `"./icon": "./icon.svg"` 与 `"./locale/*.json"`。

---

## 8. 速查清单（照着写代码时逐条打勾）

- [ ] `package.json` `name` 与 `client.js` 里 `id` **完全一致**
- [ ] `exports["./client"]` 存在且指向真实文件
- [ ] `dsh.client.platform === "web"`
- [ ] `dsh.bundle.patch` 存在，patch 里 `insert` 一行的 `name` 是 **bare 包名**
- [ ] `main`/`exports["."]` 指向 host half，导出 `apply`（可为空函数）
- [ ] `client.js` 是 classic script：无 `import`/`export`，顶层只有 `window.__ModuleLoader__.load({...})`
- [ ] `factory` 里 `return { inject: ['slots'], apply(ctx) {...} }`
- [ ] 用 `ctx.slots.inject(slot, () => ctx.slots.register({...}, Comp))`，不要裸 `register`
- [ ] keyed slot 用 `key`，list 用 `id`，不要混
- [ ] 组件按 `phase` 收窄 `block`；`'kind' in block` 判结果
- [ ] 结果文本从 `block.content` 拍平；参数从 `block.args` 懒读
- [ ] 不覆盖 `root`；不 append 到 `document.body`；不读别人的 DOM/stylesheet
- [ ] 资源用 `ctx.effect` 注册并返回清理；CSS 放 `<style>`（会自动随插件卸载）
- [ ] `files` 里列上 `lib/client.js`、`cordis.patch.yml`、`locale/*.json`、`icon.svg`

---

## 9. 明确未验证 / 边界

1. **`@deepseek-ai/dsh-client-ui-slots` 包本体未随 App 发布**（asar 里没有目录、没有任何 `.d.ts`），所以 `SlotCore.register` 的**精确 TS 重载签名**只能依据运行时擦除结构 + 官方文档 + 300 处调用点归纳，无法逐字引用。`PropsRuntime` 的精确展开同理，但 3.5 列的 owner props 与标准 props 是逐字/逐项可证的。
2. `immediately` 的真实消费点未在 `entries.ts` 里找到（该文件只做 `prefetch` 所有行）；报告按「advisory tier 标记，不影响批次」表述，并给出了反证（bootstrap 批次常量）。
3. 未做「真实页面内」运行时实操验证（本机 Host 需要认证 cookie，`curl http://127.0.0.1:39459/` 返回 401 `dsh web authentication required`；未在页面里注入过测试插件）。所有结论为静态证据，不含「已在页面看到渲染结果」的声明。
4. 若你的目标环境是**非 desktop 的 Web profile**（`dsh --profile web`），装包走 `runPluginCommand` 分支，行为与 7.3 描述一致，但 profile 目录不同（`$DSH_HOME/profiles/<name>`）。
