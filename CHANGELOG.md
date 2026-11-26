# Changelog

## 0.2.0

- feat: **高匹配度例外**：当前排序第一、方证匹配度 **>70%** 的方，即使 `zhongzhong_evidence` 不是 `supported`，也可进入 `zhongzhong_prescribe` 开方。确认卡与处方笺强制标注「高匹配度例外 / 不属于文献支持开方」，仍须患者确认；急诊红旗、妊娠/基础病禁忌、毒性药警示不放宽。
- feat: **接近双选**：前两方分差 **<4%**（均达到最低匹配度、非外用方）时，`zhongzhong_differentiate` 返回 `pair`，`zhongzhong_prescribe` 返回 `status=choose`，`candidates` 分别给出两方处方笺，由患者二选一；明确提示不可同时服用。
- feat: 接近双选中只有一方过门槛时只出该方并说明原因；两方都不过门槛时仍拒绝开方。
- test: 新增 `test/policy.test.mjs`（8 项）：高匹配例外、非第一不算、例外开方标注、接近双选 differentiate/prescribe、双方无文献但 >70% 的双选、4% 边界与外用方排除。

## 0.1.3

- feat: 现代文献检索从 PubMed 改为 [dsh-tcm-lit](https://github.com/JamisBian/dsh-tcm-lit) 的 `tcm_lit_search`：用「方名 + 本案主症」查中文期刊题录，证据卡显示题名/刊名/年份/DOI；检索式按病例生成，结果缓存 6 小时。
- refactor: 新增 `lib/engine/literature.js`（检索式、题录归一、30 秒外层超时、缓存）；`lib/engine/evidence.js` 不再直连 PubMed，`zhongzhong_evidence` / `zhongzhong_prescribe` / `zhongzhong_discuss` 统一走宿主注入的 `tcm_lit_search`。
- fix: 未安装 dsh-tcm-lit 时证据卡如实返回 `unavailable`（「中文文献检索未启用」），不伪造文献，也不影响原文/原书主治的硬门槛。
- docs: 提示词、README、卡片副标题同步为「原文/原书主治 + 中文文献」；安装说明补 dsh-tcm-lit。
- test: 新增文献检索式、题录归一、插件不可用、modern-only 判定与端到端接线测试。

## 0.1.2

- fix: `inject` 写成 `{ required, optional }` 在 Cordis 4 里不生效——会被当成两个名叫 `required` / `optional` 的服务，fiber 永远 `pending`，Plugins 页显示「等待依赖」，`/zhongzhong` 不出现。改为服务名数组 `['tools', 'systemPrompt']`；`userQuestions` / `skills` 仍在运行时用 `ctx.get()` 与 `ctx.inject(['skills'])` 探测。
- fix: 技能注册对象补 `source: 'runtime'`。`skills.register()` 只校验 name/description/invocation，但真正加载技能时 `validateDefinition()` 要求 `source`/`provider`/`content` 都是字符串，缺了就会抛 `loaded skill "zhongzhong" source must be a string`（`inject` 修好后立刻暴露的下一个坑）。
- test: 导出契约断言 `inject` 是服务名数组，防止再写回对象形式；技能注册断言 `source: 'runtime'`。

## 0.1.1

- fix: `skills` 服务晚于 `tools`/`systemPrompt` 挂载时，`/zhongzhong` 不注册的问题；现在用 `ctx.inject(['skills'])` 等 skill 服务就绪后再注册。
- fix: 全局 POINTER 与技能注册绑定；技能没注册成功时不再注入「请加载 zhongzhong」的提示，避免 `/jingfang` 反而按衷中参西行事、`/zhongzhong` 却不存在。
- fix: 清掉 `lib/index.js` 里 `/jingfang` 的注释残留。
- test: 新增「skills 服务晚挂载仍注册 zhongzhong」与「技能未注册不挂 POINTER」测试。

## 0.1.0

- feat: 完整复刻 dsh-jingfang（经方 228 首、问诊/辨证/证据/处方/病案导出/合方/守正答辩）。
- feat: 追加《医学衷中参西录》医方 174 首、药物篇单方 87 味，统一打分、证据门槛与处方笺。
- feat: 第 5 阶段 `special` 衷中参西特征症；新增升陷汤类、冲脉不固类、淋浊类方族。
- feat: 汉制 1 两=3g 与清制 1 两=30g 双剂量体系；单方/外用方分别标注。
- test: 90 个测试通过。
