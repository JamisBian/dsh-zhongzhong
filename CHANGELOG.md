# Changelog

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
