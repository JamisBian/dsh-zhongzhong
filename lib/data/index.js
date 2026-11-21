// 方剂库索引（经方 + 《医学衷中参西录》方剂/单方）+ 用药安全提示

import { SUN_FORMULAS } from './formulas-sun.js'
import { YANGMING_SHAOYANG_FORMULAS } from './formulas-yangming-shaoyang.js'
import { YIN_AND_MISC_FORMULAS } from './formulas-yin-misc.js'
import { JINGUI_FORMULAS } from './formulas-jingui.js'
import { JINGUI_FORMULAS_2 } from './formulas-jingui-2.js'
import { JINGUI_FORMULAS_3 } from './formulas-jingui-3.js'
import { JINGUI_FORMULAS_4 } from './formulas-jingui-4.js'
import { JINGUI_FORMULAS_5 } from './formulas-jingui-5.js'
import { JINGUI_VERIFIED_FORMULAS } from './formulas-jingui-verified.js'
import { HANDBOOK_FORMULAS } from './formulas-handbook.js'
import { JINGUI_COMMENTARY_FORMULAS } from './formulas-jingui-commentary.js'
import { SHANGHAN_SONG_FORMULAS } from './formulas-shanghan-song.js'
import { SHANGHAN_MANUAL_FORMULAS } from './formulas-shanghan-manual.js'
import { HANDBOOK_CALIBRATION } from './handbook-calibrated.js'
import { SHANGHAN_CALIBRATION } from './shanghan-calibrated.js'
import { ZZ_FORMULAS_1 } from './formulas-zhongzhong-1.js'
import { ZZ_FORMULAS_2 } from './formulas-zhongzhong-2.js'
import { ZZ_FORMULAS_3 } from './formulas-zhongzhong-3.js'
import { ZZ_FORMULAS_4 } from './formulas-zhongzhong-4.js'
import { ZZ_DANFANG } from './danfang.js'
import { HERB_SAFETY as HERB_SAFETY_ZHONGZHONG } from './herbs.js'

/** 全部方剂。 */
// 同一 id 后出现的覆盖先出现的：名录条目由 formulas-jingui-verified.js 升为已核方。
const REGISTRY = new Map()
for (const formula of [
  ...SUN_FORMULAS,
  ...YANGMING_SHAOYANG_FORMULAS,
  ...YIN_AND_MISC_FORMULAS,
  ...JINGUI_FORMULAS,
  ...JINGUI_FORMULAS_2,
  ...JINGUI_FORMULAS_3,
  ...JINGUI_FORMULAS_4,
  ...JINGUI_FORMULAS_5,
  ...JINGUI_VERIFIED_FORMULAS,
  ...applyCalibration(HANDBOOK_FORMULAS),
  ...JINGUI_COMMENTARY_FORMULAS,
  ...applyCalibration(SHANGHAN_SONG_FORMULAS),
  ...SHANGHAN_MANUAL_FORMULAS,
  // 《医学衷中参西录》：张锡纯自拟方 + 药物篇单方
  ...ZZ_FORMULAS_1,
  ...ZZ_FORMULAS_2,
  ...ZZ_FORMULAS_3,
  ...ZZ_FORMULAS_4,
  ...ZZ_DANFANG
]) {
  REGISTRY.set(formula.id, formula)
}

export const FORMULAS = [...REGISTRY.values()]

/**
 * 用手工校准覆盖手册自动推导的方证指标，并去掉 autoPattern 的降权标记。
 * @param {object[]} formulas
 */
function applyCalibration(formulas) {
  return formulas.map((formula) => {
    const patch = HANDBOOK_CALIBRATION[formula.id] ?? SHANGHAN_CALIBRATION[formula.id]
    if (patch === undefined) return formula
    const { autoPattern, ...rest } = formula
    return { ...rest, ...patch }
  })
}

/** 篇名：优先 chapter，否则从 source 里截取。 */
export function chapterOf(formula) {
  if (typeof formula.chapter === 'string') return formula.chapter
  const m = /《金匮要略·([^》]+)》/.exec(formula.source ?? '')
  if (m !== null) return m[1]
  const t = /《伤寒论·([^》]+)》/.exec(formula.source ?? '')
  return t === null ? '' : t[1]
}

/** 是否已录入原文条文（B 档名录条目为 false）。 */
export function isVerified(formula) {
  return formula.verified !== false
}

const BY_ID = new Map(FORMULAS.map((f) => [f.id, f]))
const BY_NAME = new Map(FORMULAS.map((f) => [f.name, f]))
for (const f of FORMULAS) if (f.alias !== undefined) BY_NAME.set(f.alias, f)

/** 按 id 取方。 */
export function formulaById(id) {
  return BY_ID.get(id)
}

/**
 * 按名称 / 别名 / id 解析方剂；容忍「桂枝汤加减」「《伤寒论》桂枝汤」这类写法。
 * @returns 方剂对象或 undefined
 */
export function resolveFormula(raw) {
  if (typeof raw !== 'string') return undefined
  const text = raw.trim()
  if (text === '') return undefined
  if (BY_ID.has(text)) return BY_ID.get(text)
  if (BY_NAME.has(text)) return BY_NAME.get(text)
  // 药物篇单方：用户只写药名（「石膏」）时也解析到「石膏（单味）」
  if (BY_NAME.has(`${text}（单味）`)) return BY_NAME.get(`${text}（单味）`)
  for (const [name, formula] of BY_NAME) {
    if (text.includes(name)) return formula
  }
  return undefined
}

/** 六经分组（用于候选均衡展示）。 */
export const SIX_CHANNELS = ['太阳', '阳明', '少阳', '太阴', '少阴', '厥阴', '杂病', '衷中']

/** 金匮篇目顺序（22 篇）。 */
export const JINGUI_CHAPTERS = [
  '脏腑经络先后病',
  '痉湿暍病',
  '百合狐惑阴阳毒病',
  '疟病',
  '中风历节病',
  '血痹虚劳病',
  '肺痿肺痈咳嗽上气病',
  '奔豚气病',
  '胸痹心痛短气病',
  '腹满寒疝宿食病',
  '五脏风寒积聚病',
  '痰饮咳嗽病',
  '消渴小便不利淋病',
  '水气病',
  '黄疸病',
  '惊悸吐衄下血胸满瘀血病',
  '呕吐哕下利病',
  '疮痈肠痈浸淫病',
  '趺蹶手指臂肿转筋阴狐疝蛔虫病',
  '妇人妊娠病',
  '妇人产后病',
  '妇人杂病'
]

/**
 * 毒性 / 峻烈药的用药提示。
 * 命中即随处方笺一起输出，提醒剂量、炮制、煎法与禁忌。
 */
const JINGFANG_HERB_SAFETY = {
  麻黄: '麻黄含麻黄碱：高血压、冠心病、心律失常、甲亢、失眠者慎用；得汗即止。',
  细辛: '细辛需久煎；原方剂量折算后可能超过现代药典常用量（3g），临床宜减量并久煎。',
  附子: '附子有毒：必须使用炮制品并先煎 30–60 分钟至口尝无麻感；不可与半夏、瓜蒌、贝母、白蔹、白及同用。',
  生附子: '生附子有大毒，须炮制并先煎 60 分钟以上；出现口舌麻木、心悸立即停药就医。',
  半夏: '半夏宜用制半夏；生半夏有毒，需炮制。孕妇慎用。',
  大黄: '大黄峻下，孕妇禁用；体虚、无实热积滞者慎用；中病即止。',
  芒硝: '芒硝冲服或烊化，不宜久煎；孕妇禁用；脾虚便溏者慎用。',
  黄连: '黄连苦寒败胃，不宜久服；脾胃虚寒者慎用。',
  吴茱萸: '吴茱萸有小毒，用量不宜过大，宜洗后用；阴虚有热者禁用。',
  蜀椒: '蜀椒辛热有小毒，用量宜小；阴虚火旺者禁用。',
  铅丹: '铅丹有毒（含铅），现代多不用或以生铁落、磁石代之。',
  代赭石: '代赭石质重，孕妇慎用；宜先煎。',
  滑石: '滑石利水，孕妇慎用；脾虚滑泄者不宜。',
  桃仁: '桃仁活血，孕妇禁用；有出血倾向者慎用。',
  水蛭: '水蛭破血逐瘀，孕妇禁用；出血倾向者禁用。',
  甘草: '长期大剂量甘草可致水钠潴留、低血钾、血压升高；高血压、水肿者慎用。',
  阿胶: '阿胶滋腻碍胃，脾胃虚弱、便溏者慎用；宜烊化。',
  石膏: '石膏大寒，脾胃虚寒者慎用；用量宜中病即止。',
  粳米: '',
  大枣: '大枣甘温，糖尿病、湿盛腹胀者慎用。',
  饴糖: '',
  胶饴: '胶饴（饴糖）甘甜助湿，呕家、糖尿病、湿热中阻者不宜。'
}

/** 合并经方与衷中参西录的用药安全表。 */
export const HERB_SAFETY = { ...JINGFANG_HERB_SAFETY, ...HERB_SAFETY_ZHONGZHONG }

/** 方剂里出现的毒性 / 峻烈药提示（去重、去空）。 */
export function herbWarnings(formula) {
  const out = []
  for (const part of formula.composition) {
    const note = HERB_SAFETY[part.herb]
    if (typeof note === 'string' && note !== '' && !out.includes(note)) out.push(note)
  }
  return out
}
