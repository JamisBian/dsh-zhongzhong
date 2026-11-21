// 生成《医学衷中参西录》方剂库与单方库
//
// 输入：data/zhongzhong-index.json（parse-zhongzhong.mjs 的产物）
// 输出：lib/data/formulas-zhongzhong-*.js、lib/data/danfang.js
//
// 方证指标来源：
//   1. 人工校准（lib/data/zhongzhong-calibrated.js）优先
//   2. 没有校准的方：按主治文字里出现的症状词自动加权
//      —— 首句主症 w=3/2，兼症或然症 w=1/2，脉舌 w=2
//   3. 仍不足 3 条时按篇目补兜底指标，保证每方至少有一个主症（w=3）
//
// 用法：node scripts/gen-zhongzhong.mjs

import { readFileSync, writeFileSync } from 'node:fs'
import { dirname, join, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { ALL_ITEMS, TONGUE, PULSE, labelOf } from '../lib/data/symptoms.js'
import { canonicalHerb } from '../lib/data/herbs.js'
import { ZHONGZHONG_CALIBRATION } from '../lib/data/zhongzhong-calibrated.js'
import { DANFANG_CALIBRATION } from '../lib/data/danfang-calibrated.js'

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const data = JSON.parse(readFileSync(join(root, 'data/zhongzhong-index.json'), 'utf8'))

// ── 篇目号：中文数字 → 序号 ────────────────────────────────
const CN_NUM = { 一: 1, 二: 2, 三: 3, 四: 4, 五: 5, 六: 6, 七: 7, 八: 8, 九: 9, 十: 10 }
function sectionNumber(text) {
  if (text === '十') return 10
  if (text.startsWith('十')) return 10 + (CN_NUM[text.slice(1)] ?? 0)
  if (text.endsWith('十')) return (CN_NUM[text[0]] ?? 0) * 10
  if (text.includes('十')) {
    const [a, b] = text.split('十')
    return (a === '' ? 1 : CN_NUM[a] ?? 0) * 10 + (b === '' ? 0 : CN_NUM[b] ?? 0)
  }
  return CN_NUM[text] ?? 0
}

// ── 关键词表 ───────────────────────────────────────────────
// 原书用词与问诊选项不完全一致，这里补一层「古语 → 症状 id」。
const EXTRA_KEYWORDS = {
  tuberculosis: ['劳瘵', '痨瘵', '肺痨', '肺劳', '肺结核', '虚劳', '劳热', '骨蒸'],
  weight_loss: ['羸弱', '羸瘦', '消瘦', '虚羸', '肌肉瘦削', '形体羸瘦', '身体羸弱'],
  poor_appetite: ['饮食减少', '饮食懒进', '不能饮食', '不能食', '食少', '纳呆', '不思饮食', '饮食不壮'],
  fatigue: ['少气', '气力不足', '神疲', '乏力', '身体软弱', '倦怠', '虚惫', '气弱', '精神短少'],
  fever: ['身热', '发热', '壮热', '灼热', '烧热', '肌肤烧热', '寒热'],
  cough: ['咳嗽', '咳逆', '咳', '嗽'],
  wheezing: ['喘促', '喘逆', '喘息', '喘', '上气', '迫促'],
  palpitation: ['怔忡', '心悸', '惊悸', '心中摇摇', '心跳'],
  insomnia: ['不寐', '不得眠', '不能睡', '失眠', '惊悸不眠'],
  forgetfulness: ['健忘', '善忘', '记忆减退'],
  dizziness: ['眩晕', '头眩', '目眩', '头晕', '冒眩', '眩'],
  headache: ['头疼', '头痛', '脑中作疼', '头目胀痛'],
  spontaneous_sweat: ['自汗', '汗出', '汗多', '虚汗'],
  night_sweat: ['盗汗', '夜间出汗', '睡中汗出'],
  alternating: ['寒热往来', '往来寒热', '先寒后热', '寒热不时', '乍寒乍热'],
  tidal_fever: ['潮热', '午后潮热', '日晡潮热', '蒸热'],
  hot_palms: ['手足心热', '五心烦热', '心中烦热', '上焦烦热'],
  dry_mouth: ['口干', '咽干', '口燥', '燥渴', '口渴'],
  thirst: ['口渴', '欲饮水', '大渴', '渴欲饮水', '嗜饮凉水'],
  poor_appetite2: [],
  nausea: ['恶心', '泛恶', '欲呕'],
  vomiting: ['呕吐', '呕逆', '吐', '食入即吐'],
  hiccup: ['呃逆', '哕', '打呃'],
  acid_reflux: ['吞酸', '嘈杂', '反酸'],
  abdominal_pain: ['腹疼', '腹痛', '腹中痛', '心腹疼痛', '少腹疼'],
  abdominal_fullness: ['胀满', '腹满', '腹胀', '痞胀', '满闷'],
  chest_fullness: ['胸膈满闷', '胸次满闷', '胸中满闷', '胸满', '胸中窒', '满闷短气'],
  chest_pain: ['胸疼', '胸痛', '心下疼', '心痛', '胁疼'],
  hypochondriac: ['胁下疼', '胁疼', '胁痛', '胸胁胀满', '胁下胀满', '胁下掀疼'],
  epigastric_distention: ['心下痞', '心下满', '胃脘痞', '脘闷', '胃胀'],
  epigastric_pain: ['胃脘疼', '胃疼', '胃痛', '心下疼'],
  constipation: ['大便燥结', '大便不通', '大便难', '燥结', '便秘', '大便多日不通'],
  hard_stool: ['大便硬', '燥屎', '大便干燥', '大便燥结'],
  diarrhea: ['泄泻', '下利', '泻', '滑泻', '便泻'],
  loose_stool: ['便溏', '大便不实'],
  chronic_diarrhea: ['久泻', '泄泻不止', '久痢', '滑泻'],
  fecal_incontinence: ['大便滑泻', '肠滑不固', '大便不禁', '滑泻不止'],
  dysentery: ['痢疾', '下痢', '痢', '噤口痢', '热痢', '赤白痢'],
  tenesmus: ['里急后重', '下重', '后重'],
  bloody_stool: ['脓血', '赤白', '便脓血', '下痢赤白', '脓血腥臭'],
  difficult_urine: ['小便不利', '小便难', '小便少', '溺少'],
  urinary_retention: ['小便不通', '癃闭', '小便滴沥', '溺管闭塞', '转胞', '小便闭塞'],
  frequent_urine: ['小便频数', '尿频', '小便多'],
  strangury: ['淋证', '小便疼涩', '溺管疼痛', '淋痛', '涩痛', '毒淋'],
  milky_urine: ['白浊', '膏淋', '小便白浊', '遗精白浊'],
  hematuria: ['溺血', '尿血', '血淋', '小便下血'],
  hematochezia: ['大便下血', '便血', '下血', '二便下血'],
  hematemesis: ['吐血', '呕血', '吐衄'],
  epistaxis: ['鼻衄', '衄血', '鼻出血'],
  hemoptysis: ['咳血', '咯血', '咳血吐血'],
  blood_sputum: ['痰中带血', '痰血', '咳吐痰血'],
  metrorrhagia: ['血崩', '崩漏', '漏下', '经行不止', '经水过多'],
  menorrhagia: ['经水过多', '经行量多', '月经过多'],
  amenorrhea: ['经闭', '闭经', '月闭', '血枯', '月信不通', '经水不行'],
  dysmenorrhea: ['经行腹痛', '痛经', '少腹寒'],
  leukorrhea: ['带下', '白带', '赤白带下'],
  bloody_leukorrhea: ['赤白带下', '赤带', '带下赤白'],
  miscarriage: ['滑胎', '屡孕屡堕'],
  morning_sickness: ['恶阻', '怀妊呕吐', '妊娠呕吐'],
  dystocia: ['难产', '产难', '交骨不开'],
  low_milk: ['少乳', '缺乳', '乳汁不下', '乳汁少'],
  mastitis: ['乳痈', '结乳肿疼', '乳肿'],
  uterine_prolapse: ['阴挺', '子宫脱垂'],
  vicarious_menstruation: ['倒经', '经行吐衄', '经水逆行'],
  postpartum_convulsion: ['产后发搐', '产后抽搐', '产后受风'],
  lochia: ['恶露不尽', '恶露不止'],
  infertility: ['不孕', '不育', '血海虚寒', '难以受孕'],
  qi_sinking: ['大气下陷', '气短不足以息', '胸中大气下陷', '气息将停'],
  breathing_effort: ['努力呼吸', '呼吸费力', '气息不续', '气不接续'],
  breath_faint: ['气息微弱', '气息奄奄', '气息似甚不足'],
  qi_rush_up: ['冲气上冲', '气上冲', '冲气上干', '气逆上冲'],
  qi_depression: ['气郁', '肝气郁', '肝郁', '气分郁结', '木郁'],
  sighing: ['善太息', '太息'],
  chest_fullness: ['胸膈满闷', '胸次满闷', '胸中满闷', '胸满', '胸中窒'],
  qi_counterflow: ['胃气上逆', '胃气不降', '气逆', '呕逆'],
  mania: ['癫狂', '发狂', '精神错乱', '失心', '妄言妄见'],
  epilepsy: ['痫风', '癫痫', '羊痫风'],
  convulsion: ['抽搐', '惊风', '搐搦', '抽掣', '螈', '急惊风', '慢脾风'],
  stroke: ['中风', '昏仆', '猝然昏倒', '不省人事', '类中风', '内中风'],
  hemiplegia: ['偏枯', '半身不遂', '肢体不遂', '偏瘫'],
  facial_paralysis: ['口眼歪斜', '口眼斜'],
  aphasia: ['言语謇涩', '言语不利', '失语'],
  atrophy: ['痿废', '痿弱', '肢体痿软', '筋痿', '足不能行'],
  tremor: ['颤振', '手抖', '震颤'],
  head_heavy: ['头重', '头重脚轻', '头重目眩'],
  brain_hyperemia: ['脑充血', '头目胀痛', '脑中作疼', '目胀'],
  polydipsia: ['大渴', '多饮', '渴欲饮水', '燥渴多饮', '嗜饮凉水', '消渴'],
  polyuria: ['小便频数', '尿多', '饮一溲一', '小便多'],
  sweet_urine: ['尿甜', '糖尿', '小便甜'],
  stone_urine: ['砂淋', '石淋'],
  qi_strangury: ['气淋'],
  labor_strangury: ['劳淋'],
  cold_strangury: ['寒淋'],
  enuresis: ['遗尿', '小便不禁', '小便失禁'],
  turbid_urine: ['小便浑浊', '尿浊', '小便赤涩'],
  dysphagia: ['噎膈', '膈食', '食不下', '饮食不下', '吞咽困难'],
  regurgitation: ['反胃', '朝食暮吐', '暮食朝吐'],
  phlegm_rattle: ['痰涎壅盛', '痰涎壅滞', '喉中痰鸣', '痰多', '痰涎'],
  foul_sputum: ['吐脓血', '脓血痰', '腥臭痰', '肺痈', '咳吐脓血'],
  hoarseness: ['失音', '声哑', '音哑', '喉疼声哑'],
  throat_swelling: ['咽喉肿疼', '咽喉肿痛', '喉痹', '喉痧', '乳蛾', '白喉', '咽喉不利'],
  toothache: ['牙疼', '牙痛'],
  gum_disease: ['牙疳', '走马牙疳', '牙龈腐化', '牙龈肿疼'],
  eye_red_pain: ['目赤', '眼疾肿疼', '目睛胀疼', '目赤肿痛', '目疼连脑'],
  eye_cloudiness: ['目翳', '云翳', '翳障', '目生云翳', '翳遮睛'],
  photophobia: ['羞明', '多泪', '羞明多泪'],
  blurred_vision: ['视物昏花', '目昏', '瞳神散大', '视物乏力'],
  nasal_discharge: ['鼻渊', '浊涕', '鼻流浊涕'],
  oral_ulcer: ['口疮', '口腔溃疡', '口舌生疮'],
  scarlet_fever: ['猩红热', '烂喉痧'],
  measles: ['麻疹', '疹出不利', '温疹', '痧疹', '斑疹'],
  tinnitus: ['耳鸣'],
  deafness: ['耳聋', '听力下降'],
  scrofula: ['瘰疬', '瘰', '淋巴结核', '鼠疮'],
  carbuncle: ['痈疽', '疮疡', '疮毒', '红肿疮疡', '痈肿'],
  ulcer: ['溃烂', '疮口不敛', '久不收口', '生肌不速', '疮面不愈'],
  syphilis: ['杨梅疮', '梅毒', '花柳毒', '杨梅毒'],
  abscess: ['内痈', '肠痈', '脏腑内痈'],
  burn: ['汤火伤', '烧伤', '烫伤'],
  trauma: ['金疮', '破伤', '跌打损伤', '外伤'],
  goiter: ['瘿瘤', '甲状腺肿大', '瘿'],
  hemorrhoid: ['痔疮', '痔'],
  eczema: ['湿疹', '浸淫疮', '湿疮'],
  tinea: ['癣', '疥癣', '顽癣'],
  bone_steaming: ['骨蒸', '骨蒸劳热', '蒸热'],
  heat_chest: ['心中烦热', '胸中烦热', '上焦烦热', '心中热'],
  dry_cough: ['干咳', '咳逆', '干咳嗽'],
  leg_pain: ['腿疼', '腿痛', '下肢疼痛'],
  arm_pain: ['臂疼', '臂痛', '上肢疼痛'],
  ascites: ['臌胀', '水臌', '气臌', '单腹胀', '腹大如鼓'],
  malaria: ['疟疾', '疟病', '寒热定时', '久疟'],
  cholera: ['霍乱', '吐泻转筋', '痧证'],
  polyphagia: ['多食', '消谷善饥', '能食', '饮食增多'],
  numbing: [],
  numbness: ['麻木', '不仁', '麻木不仁'],
  joint_pain: ['关节皆疼', '关节疼痛', '骨节疼痛', '历节疼', '肢节烦疼'],
  back_ache: ['腰疼', '腰痛', '腰膝酸疼', '腰膝疼痛'],
  body_ache: ['身疼', '周身疼痛', '身体酸痛'],
  edema: ['水肿', '浮肿', '肿满', '面目肿大'],
  jaundice: ['黄疸', '身黄', '发黄', '黄胆'],
  mass_abdomen: ['癥瘕', '瘕', '积聚', '痞块', '癖瘕'],
  lower_abdomen: ['少腹', '少腹疼', '少腹坠', '少腹急结'],
  rigidity: ['拒按', '腹硬', '按之硬'],
  qi_rush_up2: [],
  short_breath: ['短气', '气短', '气不够用'],
  orthopnea: ['喘不得卧', '不得卧', '倚息', '不能平卧'],
  restlessness: ['烦躁', '躁扰', '烦惊'],
  irritability: ['心烦', '易怒', '肝郁多怒'],
  anxiety: ['惊悸', '恐惧', '心神不宁', '易惊'],
  depression: ['悲伤欲哭', '脏躁', '情绪低落'],
  lethargy: ['但欲寐', '嗜卧', '精神萎靡'],
  delirium: ['谵语', '神昏', '妄言'],
  coma: [],
  bleeding: ['出血', '失血'],
  purpura: ['肌衄', '发斑', '斑疹', '紫斑'],
  gum_bleeding: ['牙龈出血', '齿衄'],
  tongue_pale: ['舌淡', '舌淡白'],
  tongue_red: ['舌红'],
  coat_yellow: ['苔黄'],
  coat_white_thick: ['苔白厚', '舌苔白厚'],
  coat_grey_slippery: ['苔灰滑腻', '舌苔灰色滑腻'],
  pulse_float: ['脉浮'],
  pulse_deep: ['脉沉'],
  pulse_slow: ['脉迟'],
  pulse_rapid: ['脉数'],
  pulse_wiry: ['脉弦'],
  pulse_slippery: ['脉滑'],
  pulse_thin: ['脉细'],
  pulse_rough: ['脉涩'],
  pulse_tight: ['脉紧'],
  pulse_weak: ['脉微', '脉弱', '脉微弱'],
  pulse_deficient: ['脉虚'],
  pulse_surging: ['脉洪'],
  pulse_knotted: ['脉结代', '结代'],
  pulse_wiry_long: ['脉弦长有力', '弦长有力'],
  pulse_surging_slippery: ['脉洪滑', '洪滑'],
  pulse_deficient_rapid: ['脉虚数', '虚数'],
  pulse_deep_slow_weak: ['脉沉迟微弱', '沉迟微弱', '脉微弱'],
  pulse_floating_slippery: ['脉浮滑', '浮滑'],
  pulse_soft: ['脉濡弱', '濡弱'],
  pulse_hollow: ['脉芤', '芤'],
  pulse_leather: ['脉革', '革脉'],
  pulse_minute: ['脉微细', '微细'],
  pulse_irregular: ['参伍不调', '脉参伍不调'],
  pulse_floating_forceful: ['脉浮而有力', '浮而有力'],
  pulse_wiry_weak: ['脉弦而无力', '弦而无力'],
  pulse_slippery_forceful: ['脉滑实', '滑实'],
  pulse_deep_wiry: ['脉沉弦', '沉弦']
}

// 把「带引号的篇目」之类噪声排除后，建立关键词 → id
const WORD_TO_ID = new Map()
for (const item of ALL_ITEMS) {
  const words = [item.label.replace(/（[^）]*）/g, ''), ...(item.aliases ?? []), ...(EXTRA_KEYWORDS[item.id] ?? [])]
  for (const word of words) {
    if (typeof word !== 'string' || word.length < 2) continue
    if (/\d/.test(word)) continue
    if (!WORD_TO_ID.has(word)) WORD_TO_ID.set(word, item.id)
  }
}
const WORDS = [...WORD_TO_ID.keys()].sort((a, b) => b.length - a.length || a.localeCompare(b, 'zh'))

/** 排除太平泛的词，避免每方都命中。 */
const GENERIC = new Set(['fever', 'cough', 'fatigue', 'poor_appetite', 'dizziness', 'headache', 'nausea', 'vomiting', 'diarrhea', 'constipation'])

function matchIds(text) {
  const out = []
  for (const word of WORDS) {
    if (text.includes(word)) {
      const id = WORD_TO_ID.get(word)
      if (id !== undefined && !out.includes(id)) out.push(id)
    }
  }
  return out
}

// 篇目兜底：文本里实在找不到症状时，至少给这组
const SECTION_FALLBACK = {
  治阴虚劳热方: ['tuberculosis', 'weight_loss', 'fever', 'cough'],
  治阳虚方: ['cold_limbs', 'chill_body', 'diarrhea', 'fatigue'],
  治大气下陷方: ['qi_sinking', 'breathing_effort', 'short_breath', 'fatigue'],
  治喘息方: ['wheezing', 'orthopnea', 'short_breath', 'cough'],
  治痰饮方: ['phlegm_rattle', 'chest_fullness', 'dizziness', 'nausea'],
  治肺病方: ['cough', 'tuberculosis', 'blood_sputum', 'hoarseness'],
  治吐衄方: ['hematemesis', 'epistaxis', 'hemoptysis', 'blood_sputum'],
  治心病方: ['palpitation', 'insomnia', 'anxiety', 'forgetfulness'],
  治癫狂方: ['mania', 'delirium', 'restlessness'],
  治痫风方: ['epilepsy', 'convulsion', 'dizziness'],
  治小儿风证方: ['convulsion', 'spasm', 'fever'],
  治内外中风方: ['stroke', 'hemiplegia', 'facial_paralysis', 'aphasia'],
  治肢体痿废方: ['atrophy', 'numbness', 'leg_pain'],
  治膈食方: ['dysphagia', 'vomiting', 'poor_appetite', 'weight_loss'],
  治呕吐方: ['vomiting', 'nausea', 'hiccup', 'qi_counterflow'],
  治霍乱方: ['cholera', 'vomiting', 'diarrhea', 'spasm'],
  治泄泻方: ['diarrhea', 'chronic_diarrhea', 'poor_appetite', 'fatigue'],
  治痢方: ['dysentery', 'tenesmus', 'bloody_stool', 'abdominal_pain'],
  治燥结方: ['constipation', 'hard_stool', 'abdominal_fullness'],
  治消渴方: ['polydipsia', 'polyuria', 'sweet_urine', 'fatigue'],
  治癃闭方: ['urinary_retention', 'difficult_urine', 'edema'],
  治淋浊方: ['strangury', 'milky_urine', 'hematuria', 'frequent_urine'],
  治伤寒方: ['fever', 'aversion_cold', 'no_sweat', 'pulse_float'],
  治温病方: ['fever', 'thirst', 'dry_mouth', 'pulse_rapid'],
  治伤寒温病同用方: ['fever', 'thirst', 'profuse_sweat', 'pulse_surging'],
  治瘟疫瘟疹方: ['fever', 'purpura', 'throat_swelling', 'measles'],
  治疟疾方: ['malaria', 'alternating', 'fever'],
  治气血郁滞肢体疼痛方: ['joint_pain', 'leg_pain', 'arm_pain', 'body_ache'],
  治女科方: ['menstrual', 'leukorrhea', 'amenorrhea', 'dysmenorrhea'],
  治眼科方: ['eye_red_pain', 'eye_cloudiness', 'photophobia', 'blurred_vision'],
  治咽喉方: ['throat_swelling', 'sore_throat', 'hoarseness'],
  治牙疳方: ['gum_disease', 'toothache', 'gum_bleeding'],
  治疮科方: ['carbuncle', 'scrofula', 'ulcer', 'syphilis']
}

function clampWeight(w) {
  return w >= 3 ? 3 : w === 2 ? 2 : 1
}

/** 自动推导指标。 */
function autoIndicators(zhuzhi, section) {
  const clauses = String(zhuzhi ?? '')
    .split(/[。；]/)
    .map((s) => s.trim())
    .filter((s) => s !== '')
  const found = new Map()
  const order = []
  let mainSeen = 0
  for (let index = 0; index < clauses.length; index += 1) {
    const clause = clauses[index]
    const ids = matchIds(clause)
    if (ids.length === 0) continue
    const soft = /或|兼|亦治|并治|又治|及/.test(clause)
    for (const id of ids) {
      let w
      if (index === 0) {
        mainSeen += 1
        w = mainSeen <= 3 ? 3 : 2
      } else {
        w = soft ? 1 : 2
      }
      if (!found.has(id)) order.push(id)
      const prev = found.get(id) ?? 0
      if (w > prev) found.set(id, w)
    }
  }
  // 脉舌：从原文里出现过的，补到 w=2
  for (const item of [...PULSE, ...TONGUE]) {
    const words = [item.label, ...(item.aliases ?? []), ...(EXTRA_KEYWORDS[item.id] ?? [])]
    if (words.some((word) => word.length >= 2 && String(zhuzhi ?? '').includes(word)) && !found.has(item.id)) {
      found.set(item.id, 2)
      order.push(item.id)
    }
  }
  let indicators = order
    .filter((id) => found.get(id) !== undefined)
    .map((id) => ({ id, w: clampWeight(found.get(id)) }))
  // 去掉过泛的（除非它本身就是主症）
  indicators = indicators.filter((ind) => !GENERIC.has(ind.id) || ind.w >= 2)
  indicators.sort((a, b) => b.w - a.w)
  indicators = indicators.slice(0, 10)
  const fallback = SECTION_FALLBACK[section] ?? ['fatigue', 'poor_appetite', 'dizziness']
  for (const id of fallback) {
    if (indicators.length >= 3) break
    if (!indicators.some((ind) => ind.id === id)) indicators.push({ id, w: indicators.length === 0 ? 3 : 2 })
  }
  while (indicators.length < 2) {
    const id = fallback[indicators.length % fallback.length]
    if (!indicators.some((ind) => ind.id === id)) indicators.push({ id, w: 1 })
    else break
  }
  if (!indicators.some((ind) => ind.w >= 3) && indicators.length > 0) indicators[0].w = 3
  return indicators
}

/** 校准 + 自动兜底。 */
function indicatorsFor(formula, calibration) {
  if (Array.isArray(calibration?.indicators) && calibration.indicators.length > 0) {
    const list = calibration.indicators.map((ind) => ({ id: ind.id, w: ind.w }))
    const fallback = SECTION_FALLBACK[formula.section] ?? ['fatigue', 'poor_appetite', 'dizziness']
    for (const id of fallback) {
      if (list.length >= 3) break
      if (!list.some((ind) => ind.id === id)) list.push({ id, w: 1 })
    }
    if (!list.some((ind) => ind.w >= 3)) list[0].w = 3
    return list
  }
  return autoIndicators(formula.zhuzhi, formula.section)
}

/** 方证要点：取主治短句。 */
function patternOf(formula, calibration) {
  if (Array.isArray(calibration?.pattern) && calibration.pattern.length > 0) return calibration.pattern
  const parts = String(formula.zhuzhi ?? '')
    .split(/[。；，、]/)
    .map((s) => s.trim().replace(/^治/, '').replace(/者$/, ''))
    .filter((s) => s.length >= 2 && s.length <= 28)
  const unique = [...new Set(parts)]
  if (unique.length === 0) return [String(formula.zhuzhi ?? '').replace(/^治/, '').trim() || formula.name]
  return unique.slice(0, 6)
}

/** 一句主诉摘要。 */
function briefOf(formula) {
  const first = String(formula.zhuzhi ?? '').split(/[。；]/)[0]?.trim() ?? ''
  const text = first.replace(/^治/, '') || formula.name
  return text.length > 60 ? `${text.slice(0, 60)}…` : text
}

const PREP_RE = /(去皮|去节|去核|去净核|去足|去翅|去油|去芦|去毛|去心|去粗皮|研细|研末|研|捣细|捣碎|捣|切片|切碎|切丝|锉碎|锉细|锉|洗净|酒炒|醋炙|醋制|煨|炮制|炮|水飞|另炖|另煎|冲服|包煎|后下|先煎|烊化|蜜炙|盐炒|土炒|麸炒|米炒|炒炭|煅|打碎|轧细|晒干|焙|生用|炒用|炒|炙|生|熟|清|鲜|净|真)/

/** 「炮制」列只保留短描述；长句（如无…代之、炒至…）不进处方笺。 */
function cleanPrep(prep) {
  if (typeof prep !== 'string') return ''
  const text = prep.trim()
  if (text === '') return ''
  if (text.length <= 6 && !/[，,。；;如可或用代之者]/.test(text)) return text
  const match = PREP_RE.exec(text)
  return match === null ? '' : match[0]
}

/** 组成 → 引擎格式。 */
function compositionOf(formula) {
  return formula.composition.map((part) => {
    const base = {
      herb: part.herb,
      prep: cleanPrep(part.prep),
      raw: part.raw ?? ''
    }
    if (Array.isArray(part.dose) && part.dose.length > 0) {
      if (part.dose.length === 1 && part.dose[0].unit === '等分') return { ...base, text: '等分' }
      return { ...base, dose: part.dose.map((d) => ({ unit: d.unit, value: d.value })), ...(part.doseNote === '' ? {} : { doseNote: part.doseNote }) }
    }
    return { ...base, text: part.doseNote === '' || part.doseNote === undefined ? '随证酌用' : part.doseNote }
  })
}

/** 煎服法：优先原书用法，其次从方论里找煎服句。 */
function decoctionOf(formula, external) {
  const candidates = [
    ...(typeof formula.usage === 'string' ? formula.usage.split(/[。；]/) : []),
    ...String(formula.explanation ?? '').split(/[。；]/)
  ]
    .map((item) => item.trim())
    .filter((item) => item.length >= 6)
    // 必须是「煎服法/用法」句，不能是方论、病机、医案、加减
    .filter((item) => /^(上[一二三四五六七八九十百]*[药味]|每服|水煎|用水[一二三四五六七八九十百两\d]|煎汤|共[一二三四五六七八九十]|为末|研|炼蜜|熬|点|敷|洗|熨|含化|作粥|煮|将|先|用其汤)/.test(item))
    .filter((item) => /煎|服|为末|研细|为丸|炼蜜|熬膏|点|敷|洗|熨|含化|送下|冲服|作粥|煮/.test(item))
    .filter((item) => !/《|此方|用此方|服此方|后因|间有|治验|一案|一人|一媪|一叟|来函|者，/.test(item))
  if (candidates.length > 0) return candidates[0].endsWith('。') ? candidates[0] : `${candidates[0]}。`
  return external
    ? '按原书用法外用（敷、洗、点、熨等），不可内服。'
    : '水煎服，分二次温服；张氏原方未注明具体煎法，用量与服法须由医师按证确定。'
}

const EXTERNAL = new Set([
  '姜胶膏',
  '通结用葱白熨法',
  '磨翳水',
  '磨翳散',
  '明目蓬硝水',
  '清脑黄连膏',
  '消瘰膏',
  '化腐生肌散',
  '牙疳散'
])

const MODERN_TERMS = {
  升陷汤: ['Shengxian Tang', 'Sheng Xian Tang'],
  镇肝熄风汤: ['Zhengan Xifeng Tang', 'Zhen Gan Xi Feng Tang'],
  玉液汤: ['Yuye Tang', 'Yu Ye Tang'],
  活络效灵丹: ['Huoluo Xiaoling Dan', 'Huo Luo Xiao Ling Dan'],
  固冲汤: ['Guchong Tang', 'Gu Chong Tang'],
  寿胎丸: ['Shoutai Wan', 'Shou Tai Wan'],
  资生汤: ['Zisheng Tang', 'Zi Sheng Tang'],
  定心汤: ['Dingxin Tang', 'Ding Xin Tang'],
  安魂汤: ['Anhun Tang', 'An Hun Tang'],
  消瘰丸: ['Xiaoluo Wan', 'Xiao Luo Wan'],
  理冲汤: ['Lichong Tang', 'Li Chong Tang'],
  温冲汤: ['Wenchong Tang', 'Wen Chong Tang'],
  清带汤: ['Qingdai Tang', 'Qing Dai Tang'],
  补络补管汤: ['Buluo Buguan Tang'],
  蒲公英汤: ['Pugongying Tang', 'Dandelion decoction'],
  麻黄加知母汤: ['Mahuang Jia Zhimu Tang'],
  参赭镇气汤: ['Shenzhe Zhenqi Tang'],
  参赭培气汤: ['Shenzhe Peiqi Tang'],
  硝菔通结汤: ['Xiaofu Tongjie Tang'],
  清解汤: ['Qingjie Tang'],
  凉解汤: ['Liangjie Tang'],
  寒解汤: ['Hanjie Tang'],
  和解汤: ['Hejie Tang'],
  宣解汤: ['Xuanjie Tang'],
  滋阴宣解汤: ['Ziyin Xuanjie Tang'],
  滋阴清燥汤: ['Ziyin Qingzao Tang'],
  滋阴固下汤: ['Ziyin Guxia Tang'],
  犹龙汤: ['Youlong Tang'],
  仙露汤: ['Xianlu Tang'],
  镇逆白虎汤: ['Zhenni Baihu Tang'],
  宁嗽定喘饮: ['Ningsou Dingchuan Yin'],
  荡胸汤: ['Dangxiong Tang'],
  镇逆承气汤: ['Zhenni Chengqi Tang'],
  青盂汤: ['Qingyu Tang'],
  护心至宝丹: ['Huxin Zhibao Dan'],
  清疹汤: ['Qingzhen Tang'],
  加味小柴胡汤: ['Jiawei Xiaochaihu Tang'],
  升降汤: ['Shengjiang Tang'],
  培脾舒肝汤: ['Peipi Shugan Tang'],
  金铃泻肝汤: ['Jinling Xiegan Tang'],
  活络祛寒汤: ['Huoluo Quhan Tang'],
  健运汤: ['Jianyun Tang'],
  振中汤: ['Zhenzhong Tang'],
  曲直汤: ['Quzhi Tang'],
  玉烛汤: ['Yuzhu Tang'],
  安冲汤: ['Anchong Tang'],
  加味麦门冬汤: ['Jiawei Maimendong Tang'],
  安胃饮: ['Anwei Yin'],
  大顺汤: ['Dashun Tang'],
  和血熄风汤: ['Hexue Xifeng Tang'],
  滋阴清胃汤: ['Ziyin Qingwei Tang'],
  滋乳汤: ['Ziru Tang'],
  消乳汤: ['Xiaoru Tang'],
  升肝舒郁汤: ['Shenggan Shuyu Tang'],
  资生通脉汤: ['Zisheng Tongmai Tang'],
  益瞳丸: ['Yitong Wan'],
  羊肝猪胆丸: ['Yanggan Zhudan Wan'],
  内托生肌散: ['Neituo Shengji San'],
  洗髓丹: ['Xisui Dan'],
  定风丹: ['Dingfeng Dan'],
  镇风汤: ['Zhenfeng Tang'],
  搜风汤: ['Soufeng Tang'],
  逐风汤: ['Zhufeng Tang'],
  加味黄芪五物汤: ['Jiawei Huangqi Wuwu Tang'],
  加味玉屏风散: ['Jiawei Yupingfeng San'],
  加味补血汤: ['Jiawei Buxue Tang'],
  振颓汤: ['Zhentui Tang'],
  振颓丸: ['Zhentui Wan'],
  薯蓣粥: ['Shuyu Zhou'],
  一味薯蓣饮: ['Yiwei Shuyu Yin'],
  珠玉二宝粥: ['Zhuyu Erbao Zhou'],
  水晶桃: ['Shuijing Tao'],
  既济汤: ['Jiji Tang'],
  来复汤: ['Laifu Tang'],
  镇摄汤: ['Zhenshe Tang'],
  敦复汤: ['Dunfu Tang'],
  回阳升陷汤: ['Huiyang Shengxian Tang'],
  理郁升陷汤: ['Liyu Shengxian Tang'],
  醒脾升陷汤: ['Xingpi Shengxian Tang'],
  薯蓣纳气汤: ['Shuyu Naqi Tang'],
  滋培汤: ['Zipei Tang'],
  理饮汤: ['Liyin Tang'],
  理痰汤: ['Litan Tang'],
  龙蚝理痰汤: ['Longhao Litan Tang'],
  健脾化痰丸: ['Jianpi Huatan Wan'],
  半夏白术天麻汤: [] // 占位：张氏书中另有加减法，不作为本方
}

// ── 生成方剂 ───────────────────────────────────────────────
const seqBySection = new Map()
const formulas = data.formulas.map((f) => {
  const secNo = sectionNumber(f.sectionNo)
  const seq = (seqBySection.get(secNo) ?? 0) + 1
  seqBySection.set(secNo, seq)
  const calibration = ZHONGZHONG_CALIBRATION[f.name]
  const route = calibration?.route ?? (EXTERNAL.has(f.name) ? 'external' : 'internal')
  const indicators = indicatorsFor(f, calibration)
  const composition = compositionOf(f)
  const id = `zz_${String(secNo).padStart(2, '0')}_${String(seq).padStart(2, '0')}`
  const source = `《医学衷中参西录·医方(${f.sectionNo})·${f.section}》`
  const kind = composition.length === 1 ? 'danfang' : 'formula'
  const modernTerms = MODERN_TERMS[f.name] ?? []
  const safety = route === 'external' ? ['本方为外用/外治方，不可内服。'] : []
  const formula = {
    id,
    name: f.name,
    ...(f.rawName !== f.name ? { alias: f.rawName } : {}),
    source,
    six: '衷中',
    school: 'zhongzhong',
    book: 'zhongzhong',
    kind,
    route,
    chapter: f.section,
    composition,
    decoction: decoctionOf(f, route === 'external').replace(/\t/g, ' ').replace(/\u3000+/g, ' '),
    pattern: patternOf(f, calibration),
    brief: briefOf(f),
    explanation: String(f.explanation ?? '').replace(/\t/g, ' ').replace(/^[　\s]+/, '').slice(0, 900),
    indicators,
    contra: calibration?.contra ?? [],
    ...(calibration?.requires === undefined ? {} : { requires: calibration.requires }),
    ...(calibration?.contexts === undefined ? {} : { contexts: calibration.contexts }),
    clauses: [{ ref: `${source}·${f.name}`, text: String(f.zhuzhi ?? '').trim().replace(/\t/g, ' ').replace(/\u3000+/g, ' ') }],
    modern: { terms: modernTerms, conditions: [] },
    doseSystem: 'qing',
    doseBasis: 'qing',
    safety,
    verified: true
  }
  return formula
})

// ── 生成单方（药物篇） ──────────────────────────────────────
const cleanSentence = (s) =>
  String(s)
    .replace(/^[　\s]+/, '')
    .replace(/^按[∶:]/, '')
    .trim()

function cleanIndications(drug) {
  const raw = Array.isArray(drug.indications) ? drug.indications : []
  const picked = raw
    .map(cleanSentence)
    .filter((s) => s.length >= 8 && s.length <= 220)
    .filter((s) => !/[×xX]{2}|来函|年[一二三四五六七八九十百]|岁|医案|一媪|一叟|一妇人|一童子|一孺子/.test(s))
    .filter((s) => /治|主|善|能/.test(s))
  const unique = [...new Set(picked)]
  if (unique.length > 0) return unique.slice(0, 4)
  const fallback = String(drug.text ?? '')
    .split(/[。；]/)
    .map(cleanSentence)
    .filter((s) => s.length >= 8 && s.length <= 200 && !/[×xX]{2}|来函|年[一二三四五六七八九十百]|岁/.test(s))
  return fallback.slice(0, 3)
}

function drugIndicators(drug, indications) {
  const text = `${indications.join('；')}；${String(drug.text ?? '').slice(0, 600)}`
  const found = matchIds(text)
  const list = found.slice(0, 8).map((id, index) => ({ id, w: index < 2 ? 3 : index < 5 ? 2 : 1 }))
  for (const id of ['fatigue', 'poor_appetite', 'dizziness']) {
    if (list.length >= 3) break
    if (!list.some((ind) => ind.id === id)) list.push({ id, w: 1 })
  }
  if (!list.some((ind) => ind.w >= 3)) list[0].w = 3
  return list
}

const danfang = data.drugs.map((drug, index) => {
  const canonical = canonicalHerb(drug.name)
  const herb = canonical?.herb ?? drug.name
  const cal = DANFANG_CALIBRATION[herb]
  const autoIndications = cleanIndications(drug)
  const indications = cal?.summary === undefined ? autoIndications : [cal.summary]
  const source = `《医学衷中参西录·药物·${herb}解》`
  const id = `df_${String(index + 1).padStart(2, '0')}`
  const usage = (drug.usage ?? []).map(cleanSentence).filter((s) => s.length >= 8).slice(0, 2).join(' ')
  const decoction = cal?.usage ?? (usage === '' ? '单味煎汤或研末服；用量随证，须由医师确定。' : usage)
  const clauseText = `${indications.join('')}${autoIndications.length > 0 ? autoIndications.slice(0, 2).join('') : ''}`.slice(0, 500)
  const pattern =
    cal?.summary === undefined
      ? indications.map((s) => s.replace(/^治/, '').slice(0, 26)).slice(0, 4)
      : cal.summary.split(/[：；，、]/).map((s) => s.trim()).filter((s) => s.length >= 2).slice(0, 4)
  const indicators = (cal?.indicators ?? drugIndicators(drug, indications)).map((ind) => ({ ...ind }))
  if (!indicators.some((ind) => ind.w >= 3) && indicators.length > 0) indicators[0].w = 3
  for (const id of ['fatigue', 'poor_appetite', 'dizziness']) {
    if (indicators.length >= 3) break
    if (!indicators.some((ind) => ind.id === id)) indicators.push({ id, w: 1 })
  }
  const safety = [...(cal?.safety ?? [])]
  return {
    id,
    name: `${herb}（单味）`,
    alias: `${herb}单方`,
    herb,
    source,
    six: '衷中',
    school: 'zhongzhong',
    book: 'zhongzhong',
    kind: 'danfang',
    bencao: true,
    route: 'internal',
    chapter: '药物',
    composition: [{ herb, prep: '', text: '随证酌用（单味）' }],
    decoction,
    pattern,
    brief: cal?.summary === undefined ? `${herb}单味` : cal.summary.slice(0, 60),
    explanation: String(drug.text ?? '').replace(/^[　\s]+/, '').slice(0, 900),
    indicators,
    contra: [],
    clauses: [{ ref: source, text: clauseText }],
    modern: { terms: [], conditions: [] },
    doseSystem: 'qing',
    doseBasis: 'qing',
    safety,
    verified: true
  }
})

// ── 输出 ───────────────────────────────────────────────────
const groups = [
  { file: 'formulas-zhongzhong-1.js', varName: 'ZZ_FORMULAS_1', sections: [1, 2, 3, 4, 5, 6, 7, 8] },
  { file: 'formulas-zhongzhong-2.js', varName: 'ZZ_FORMULAS_2', sections: [9, 10, 11, 12, 13, 14, 15, 16, 17] },
  { file: 'formulas-zhongzhong-3.js', varName: 'ZZ_FORMULAS_3', sections: [18, 19, 20, 21, 22, 23, 24, 25] },
  { file: 'formulas-zhongzhong-4.js', varName: 'ZZ_FORMULAS_4', sections: [26, 27, 28, 29, 30, 31, 32, 33] }
]
const sectionOf = (f) => Number(f.id.slice(3, 5))
for (const group of groups) {
  const list = formulas.filter((f) => group.sections.includes(sectionOf(f)))
  const body = `// 《医学衷中参西录》方剂（第 ${group.sections[0]}–${group.sections[group.sections.length - 1]} 篇）\n// 由 scripts/gen-zhongzhong.mjs 生成，请勿手改；校准请改 lib/data/zhongzhong-calibrated.js。\n\nexport const ${group.varName} = ${JSON.stringify(list, null, 2)}\n`
  writeFileSync(join(root, 'lib/data', group.file), body, 'utf8')
}
const danfangBody = `// 《医学衷中参西录》药物篇 · 单方\n// 由 scripts/gen-zhongzhong.mjs 生成，请勿手改。\n\nexport const ZZ_DANFANG = ${JSON.stringify(danfang, null, 2)}\n`
writeFileSync(join(root, 'lib/data/danfang.js'), danfangBody, 'utf8')

// ── 诊断 ───────────────────────────────────────────────────
const autoCount = formulas.filter((f) => ZHONGZHONG_CALIBRATION[f.name] === undefined).length
const unusedCalibration = Object.keys(ZHONGZHONG_CALIBRATION).filter((name) => !formulas.some((f) => f.name === name))
if (unusedCalibration.length > 0) console.log(`⚠️ 校准表里有未匹配方名：${unusedCalibration.join('、')}`)
const unusedDanfang = Object.keys(DANFANG_CALIBRATION).filter((name) => !danfang.some((f) => f.herb === name))
if (unusedDanfang.length > 0) console.log(`⚠️ 单方校准表里有未匹配药名：${unusedDanfang.join('、')}`)
const kindCount = formulas.filter((f) => f.kind === 'danfang').length
console.log(`方剂：${formulas.length} 首（人工校准 ${formulas.length - autoCount}，自动推导 ${autoCount}；单味方 ${kindCount}）`)
console.log(`单方：${danfang.length} 味`)
const bad = formulas.filter((f) => !Array.isArray(f.indicators) || f.indicators.length === 0)
if (bad.length > 0) console.log(`⚠️ 无指标：${bad.map((f) => f.name).join('、')}`)
const noKey = formulas.filter((f) => !f.indicators.some((i) => i.w >= 3))
if (noKey.length > 0) console.log(`⚠️ 无主症：${noKey.map((f) => f.name).join('、')}`)
console.log('输出：lib/data/formulas-zhongzhong-1..4.js、lib/data/danfang.js')
