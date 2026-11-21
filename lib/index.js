// dsh-zhongzhong host half
//
// 中医衷中参西问诊插件：把「问诊 → 辨证 → 文献核查 → 开方」做成可执行的状态机。
// 方剂库 = 经方 + 《医学衷中参西录》自拟方 + 药物篇单方，统一打分与门禁。
// 依赖全部内联，不 import @deepseek-ai/* —— 插件装进 profile 后没有那套依赖。

import { registerZhongzhongTools } from './tools.js'
import { PROMPT, POINTER } from './prompt.js'

/** Cordis 插件名，必须与 cordis.patch.yml 中的行名一致。 */
export const name = 'dsh-zhongzhong'

/**
 * 必需：工具注册表、系统提示词。
 * 可选：userQuestions（没有它时工具退化为「返回问题清单让模型代问」）。
 */
export const inject = { required: ['tools', 'systemPrompt'], optional: ['userQuestions', 'skills'] }

/** 运行时技能名：用户可用 `/jingfang` 直接唤起。 */
export const SKILL_NAME = 'zhongzhong'

/** 提示词段落名与顺序（100–199 是工具指引区）。 */
export const SECTION = { name: 'zhongzhong:workflow', order: 120 }

/**
 * 插件配置（写在 profile 的 cordis.patch.yml 里，不随仓库发布）。
 *
 * @property {string} [overridePhrase] 医师强制开方口令：只有本机配置里设了，
 *   模型在 zhongzhong_prescribe 里带上同一句话才会放行，并强制加注「医师参考方」警示。
 *   仓库里不含任何口令，README 也不写——避免普通患者误用。
 * @property {boolean} [allowCombine] 是否允许合方，默认 true。
 *
 * @param {import('@deepseek-ai/cordis').Context} ctx
 * @param {{overridePhrase?: string, allowCombine?: boolean}} [config]
 */
export function apply(ctx, config = {}) {
  // 全局只留一句「什么时候该用」，完整流程放进技能，避免污染普通会话
  ctx.systemPrompt.section({
    name: SECTION.name,
    order: SECTION.order,
    text: POINTER
  })
  registerZhongzhongTools(ctx, config)

  // 用户可输入 /zhongzhong 唤起；模型也可在识别到中医诉求时自行加载
  const skills = typeof ctx.get === 'function' ? ctx.get('skills') : ctx.skills
  if (skills !== undefined && typeof skills.register === 'function') {
    ctx.effect(() =>
      skills.register({
        name: SKILL_NAME,
        description: '中医衷中参西接诊：先问诊（选项列表）→ 方证辨证（经方 + 衷中参西录方 + 单方）→ 文献核查 → 确认后开方；含守正答辩。用户提到中医、经方、张锡纯、衷中参西、身体不适、想开方时使用。',
        whenToUse: '中医问诊、经方辨证、张锡纯方、衷中参西录方、单方、方剂咨询、症状自查',
        content: PROMPT,
        invocation: { modelInvocable: true, userInvocable: true }
      })
    )
  }
}

export { registerZhongzhongTools }
