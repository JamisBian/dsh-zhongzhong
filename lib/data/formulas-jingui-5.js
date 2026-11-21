// 经方库 ·《金匮要略》续四：疮痈肠痈 / 趺蹶 / 妇人三篇 + 名录条目

export const JINGUI_FORMULAS_5 = [
  // ── 疮痈肠痈浸淫病 ────────────────────────────────────
  {
    id: 'yiyi_fuzi_baijiang_san',
    name: '薏苡附子败酱散',
    source: '《金匮要略·疮痈肠痈浸淫病脉证并治》',
    six: '杂病',
    doseBasis: 'ratio',
    composition: [
      { herb: '薏苡仁', text: '十分' },
      { herb: '附子', text: '二分', prep: '炮' },
      { herb: '败酱草', text: '五分' }
    ],
    decoction: '上三味，杵为末，取方寸匕，以水二升，煎减半，顿服，小便当下。现代：按 薏苡仁 30g、附子 6g、败酱草 15g 比例，水煎温服。',
    pattern: ['肠痈', '其身甲错', '腹皮急按之濡', '腹无积聚', '身无热脉数'],
    indicators: [
      { id: 'lower_abdomen', w: 3 },
      { id: 'abdominal_pain', w: 2 },
      { id: 'fever', w: 1 },
      { id: 'fatigue', w: 1 },
      { id: 'constipation', w: 1 },
      { id: 'pulse_rapid', w: 1 }
    ],
    contra: [{ id: 'rigidity', w: 2 }, { id: 'pulse_weak', w: 1 }],
    clauses: [
      {
        ref: '《金匮要略·疮痈肠痈浸淫病脉证并治》',
        text: '肠痈之为病，其身甲错，腹皮急，按之濡，如肿状，腹无积聚，身无热，脉数，此为肠内有痈脓，薏苡附子败酱散主之。'
      }
    ],
    modern: { terms: ['Yiyi Fuzi Baijiang San'], conditions: ['chronic appendicitis', 'pelvic inflammatory disease'] },
    safety: ['急性阑尾炎、腹膜炎须立即就医，不可自行服药', '附子炮制先煎', '孕妇慎用']
  },
  {
    id: 'wangbuliuxing_san',
    name: '王不留行散',
    source: '《金匮要略·疮痈肠痈浸淫病脉证并治》',
    requires: ['injury'],
    six: '杂病',
    doseBasis: 'ratio',
    composition: [
      { herb: '王不留行', text: '十分', prep: '八月八日采' },
      { herb: '蒴藋细叶', text: '十分', prep: '七月七日采' },
      { herb: '桑东南根白皮', text: '十分', prep: '三月三日采' },
      { herb: '甘草', text: '十八分' },
      { herb: '川椒', text: '三分', prep: '除目及闭口，去汗' },
      { herb: '黄芩', text: '二分' },
      { herb: '干姜', text: '二分' },
      { herb: '芍药', text: '二分' },
      { herb: '厚朴', text: '二分' }
    ],
    decoction: '上九味，桑根皮以上三味烧灰存性，勿令灰过，各别杵筛，合治之为散，服方寸匕。小疮即粉之，大疮但服之。产后亦可服。',
    pattern: ['金疮', '外伤出血', '疮口不敛'],
    indicators: [
      { id: 'bleeding', w: 3 },
      { id: 'joint_pain', w: 1 },
      { id: 'fatigue', w: 1 }
    ],
    contra: [{ id: 'fever', w: 1 }],
    clauses: [
      {
        ref: '《金匮要略·疮痈肠痈浸淫病脉证并治》',
        text: '病金疮，王不留行散主之。'
      }
    ],
    modern: { terms: ['Wangbuliuxing San'], conditions: ['wound healing', 'trauma'] },
    safety: ['外伤大出血须先压迫止血并就医', '孕妇慎用（活血）', '烧灰存性需专业炮制']
  },

  // ── 趺蹶手指臂肿转筋阴狐疝蛔虫病 ──────────────────────
  {
    id: 'gancao_fenmi_tang',
    name: '甘草粉蜜汤',
    source: '《金匮要略·趺蹶手指臂肿转筋阴狐疝蛔虫病脉证并治》',
    six: '杂病',
    composition: [
      { herb: '甘草', liang: 2 },
      { herb: '粉', liang: 1, prep: '铅粉（一作米粉）' },
      { herb: '蜜', liang: 4 }
    ],
    decoction: '上三味，以水三升，先煮甘草，取二升，去滓，内粉、蜜，搅令和，煎如薄粥，温服一升，差即止。',
    pattern: ['蛔虫', '吐涎', '心痛发作有时', '腹痛时作'],
    indicators: [
      { id: 'saliva', w: 2 },
      { id: 'abdominal_pain', w: 3 },
      { id: 'vomiting', w: 1 },
      { id: 'poor_appetite', w: 1 },
      { id: 'restlessness', w: 1 }
    ],
    contra: [{ id: 'bleeding', w: 1 }],
    clauses: [
      {
        ref: '《金匮要略·趺蹶手指臂肿转筋阴狐疝蛔虫病脉证并治》',
        text: '蛔虫之为病，令人吐涎，心痛发作有时，毒药不止，甘草粉蜜汤主之。'
      }
    ],
    modern: { terms: ['Gancao Fenmi Tang'], conditions: ['ascariasis', 'abdominal pain'] },
    safety: ['方中「粉」古有铅粉与米粉两说：铅粉有毒，现代多以米粉或驱虫药代之，切勿自行使用铅粉', '腹痛剧烈需排除急腹症', '孕妇慎用']
  },

  // ── 妇人妊娠病（续） ──────────────────────────────────
  {
    id: 'ganjiang_renshen_banxia_wan',
    name: '干姜人参半夏丸',
    source: '《金匮要略·妇人妊娠病脉证并治》',
    contexts: ['pregnancy'],
    six: '杂病',
    composition: [
      { herb: '干姜', liang: 1 },
      { herb: '人参', liang: 1 },
      { herb: '半夏', liang: 2 }
    ],
    decoction: '上三味，末之，以生姜汁糊为丸，如梧子大，饮服十丸，日三服。现代：可作汤剂，需医师指导。',
    pattern: ['妊娠呕吐不止', '胃虚寒饮', '口不渴'],
    indicators: [
      { id: 'vomiting', w: 3 },
      { id: 'nausea', w: 2 },
      { id: 'saliva', w: 2 },
      { id: 'poor_appetite', w: 1 },
      { id: 'chill_body', w: 1 }
    ],
    contra: [{ id: 'thirst_cold', w: 2 }, { id: 'yellow_sputum', w: 1 }],
    clauses: [
      {
        ref: '《金匮要略·妇人妊娠病脉证并治》',
        text: '妊娠呕吐不止，干姜人参半夏丸主之。'
      }
    ],
    modern: { terms: ['Ganjiang Renshen Banxia Wan'], conditions: ['hyperemesis gravidarum'] },
    safety: ['妊娠恶阻须先排除葡萄胎等病理情况', '半夏用于妊娠属「有故无殒」，须医师权衡', '剧吐脱水需补液']
  },
  {
    id: 'danggui_san',
    name: '当归散',
    source: '《金匮要略·妇人妊娠病脉证并治》',
    requires: ['pregnancy'],
    six: '杂病',
    doseBasis: 'ratio',
    composition: [
      { herb: '当归', text: '一斤' },
      { herb: '黄芩', text: '一斤' },
      { herb: '芍药', text: '一斤' },
      { herb: '川芎', text: '一斤' },
      { herb: '白术', text: '半斤' }
    ],
    decoction: '上五味，杵为散，酒饮服方寸匕，日再服。妊娠常服即易产，胎无疾苦。产后百病悉主之。现代：每服 6g，日二次，需医师指导。',
    pattern: ['妊娠养胎', '胎动不安', '气血不足兼有郁热'],
    indicators: [
      { id: 'menstrual', w: 2 },
      { id: 'fatigue', w: 2 },
      { id: 'abdominal_pain', w: 1 },
      { id: 'hot_palms', w: 1 },
      { id: 'irritability', w: 1 }
    ],
    contra: [{ id: 'bleeding', w: 2 }, { id: 'cold_limbs', w: 1 }],
    clauses: [
      {
        ref: '《金匮要略·妇人妊娠病脉证并治》',
        text: '妇人妊娠，宜常服当归散主之。'
      }
    ],
    modern: { terms: ['Danggui San'], conditions: ['threatened abortion', 'pregnancy'] },
    safety: ['孕期用药须产科与中医师共同评估', '有流产征象者先就医', '「常服」之说不可照搬，须辨证']
  },
  {
    id: 'baizhu_san',
    name: '白术散',
    source: '《金匮要略·妇人妊娠病脉证并治》',
    requires: ['pregnancy'],
    six: '杂病',
    doseBasis: 'ratio',
    composition: [
      { herb: '白术', text: '等分' },
      { herb: '川芎', text: '等分' },
      { herb: '蜀椒', text: '等分', prep: '去汗' },
      { herb: '牡蛎', text: '等分' }
    ],
    decoction: '上四味，杵为散，酒服一钱匕，日三服，夜一服。但苦痛加芍药；心下毒痛倍加川芎；心烦吐痛不能食饮，加细辛一两、半夏大者二十枚。',
    pattern: ['妊娠养胎', '胎寒腹痛', '白带清稀'],
    indicators: [
      { id: 'abdominal_pain', w: 2 },
      { id: 'leukorrhea', w: 2 },
      { id: 'chill_body', w: 2 },
      { id: 'edema', w: 1 },
      { id: 'poor_appetite', w: 1 }
    ],
    contra: [{ id: 'thirst_cold', w: 1 }, { id: 'bleeding', w: 1 }],
    clauses: [
      {
        ref: '《金匮要略·妇人妊娠病脉证并治》',
        text: '妊娠养胎，白术散主之。'
      }
    ],
    modern: { terms: ['Baizhu San'], conditions: ['pregnancy', 'vaginal discharge'] },
    safety: ['蜀椒辛热，阴虚有热者禁用', '孕期须医师指导', '带下量多需排除感染']
  },
  {
    id: 'kuizi_fuling_san',
    name: '葵子茯苓散',
    source: '《金匮要略·妇人妊娠病脉证并治》',
    requires: ['pregnancy'],
    six: '杂病',
    doseBasis: 'ratio',
    composition: [
      { herb: '葵子', text: '一斤' },
      { herb: '茯苓', liang: 3 }
    ],
    decoction: '上二味，杵为散，饮服方寸匕，日三服，小便利则愈。',
    pattern: ['妊娠有水气', '身重', '小便不利', '洒淅恶寒', '起即头眩'],
    indicators: [
      { id: 'edema', w: 3 },
      { id: 'difficult_urine', w: 3 },
      { id: 'heavy_body', w: 2 },
      { id: 'dizziness', w: 2 },
      { id: 'aversion_cold', w: 1 }
    ],
    contra: [{ id: 'bleeding', w: 2 }, { id: 'fatigue', w: 1 }],
    clauses: [
      {
        ref: '《金匮要略·妇人妊娠病脉证并治》',
        text: '妊娠有水气，身重，小便不利，洒淅恶寒，起即头眩，葵子茯苓散主之。'
      }
    ],
    modern: { terms: ['Kuizi Fuling San'], conditions: ['pregnancy edema', 'urinary retention'] },
    safety: ['葵子滑利，孕妇须在医师指导下使用', '妊娠水肿伴高血压、蛋白尿须警惕子痫前期，立即就医']
  },

  // ── 妇人产后病（续） ──────────────────────────────────
  {
    id: 'zhuye_tang',
    name: '竹叶汤',
    source: '《金匮要略·妇人产后病脉证并治》',
    contexts: ['postpartum'],
    six: '杂病',
    composition: [
      { herb: '竹叶', text: '一把', grams: '约 6g' },
      { herb: '葛根', liang: 3 },
      { herb: '防风', liang: 1 },
      { herb: '桔梗', liang: 1 },
      { herb: '桂枝', liang: 1 },
      { herb: '人参', liang: 1 },
      { herb: '甘草', liang: 1 },
      { herb: '附子', count: 1, unit: '枚', prep: '炮' },
      { herb: '生姜', liang: 5, prep: '切' },
      { herb: '大枣', count: 15, unit: '枚', prep: '擘' }
    ],
    decoction: '上十味，以水一斗，煮取二升半，分温三服，温覆使汗出。颈项强，用大附子一枚，破之如豆大，煎药扬去沫。呕者，加半夏半升洗。',
    pattern: ['产后中风', '发热', '面正赤', '喘而头痛'],
    indicators: [
      { id: 'fever', w: 3 },
      { id: 'face_red', w: 2 },
      { id: 'headache', w: 2 },
      { id: 'wheezing', w: 1 },
      { id: 'aversion_wind', w: 1 },
      { id: 'fatigue', w: 1 },
      { id: 'spontaneous_sweat', w: 1 }
    ],
    contra: [
      { id: 'thirst_cold', w: 2 },
      { id: 'constipation', w: 1 },
      { id: 'aversion_cold', w: 2 },
      { id: 'no_sweat', w: 2 },
      { id: 'pulse_tight', w: 1 }
    ],
    clauses: [
      {
        ref: '《金匮要略·妇人产后病脉证并治》',
        text: '产后中风，发热，面正赤，喘而头痛，竹叶汤主之。'
      }
    ],
    modern: { terms: ['Zhuye Tang'], conditions: ['postpartum infection', 'fever'] },
    safety: ['产后发热须先排除感染、血栓等急症', '附子炮制先煎', '哺乳期用药需评估']
  },
  {
    id: 'zhupi_da_wan',
    name: '竹皮大丸',
    source: '《金匮要略·妇人产后病脉证并治》',
    contexts: ['postpartum', 'lactation'],
    six: '杂病',
    doseBasis: 'ratio',
    composition: [
      { herb: '生竹茹', text: '二分' },
      { herb: '石膏', text: '二分' },
      { herb: '桂枝', text: '一分' },
      { herb: '甘草', text: '七分' },
      { herb: '白薇', text: '一分' }
    ],
    decoction: '上五味，末之，枣肉和丸弹子大，以饮服一丸，日三夜二服。有热者倍白薇；烦喘者加柏实一分。',
    pattern: ['产后虚烦', '呕逆', '乳中虚', '烦乱'],
    indicators: [
      { id: 'irritability', w: 3 },
      { id: 'restlessness', w: 2 },
      { id: 'nausea', w: 2 },
      { id: 'fatigue', w: 1 },
      { id: 'fever', w: 1 }
    ],
    contra: [{ id: 'cold_limbs', w: 1 }, { id: 'loose_stool', w: 1 }],
    clauses: [
      {
        ref: '《金匮要略·妇人产后病脉证并治》',
        text: '妇人乳中虚，烦乱呕逆，安中益气，竹皮大丸主之。'
      }
    ],
    modern: { terms: ['Zhupi Da Wan'], conditions: ['postpartum anxiety', 'nausea'] },
    safety: ['产后烦躁须排除产后抑郁与感染', '石膏大寒，脾胃虚寒者慎用']
  },
  {
    id: 'xiayuxue_tang',
    name: '下瘀血汤',
    source: '《金匮要略·妇人产后病脉证并治》',
    contexts: ['postpartum'],
    six: '杂病',
    composition: [
      { herb: '大黄', liang: 3 },
      { herb: '桃仁', count: 20, unit: '枚' },
      { herb: '䗪虫', count: 20, unit: '枚', prep: '熬，去足' }
    ],
    decoction: '上三味，末之，炼蜜和为四丸，以酒一升，煎一丸，取八合，顿服之，新血下如豚肝。',
    pattern: ['产后腹痛', '干血着脐下', '经水不利', '腹中有硬块'],
    indicators: [
      { id: 'lower_abdomen', w: 3 },
      { id: 'abdominal_pain', w: 2 },
      { id: 'menstrual', w: 2 },
      { id: 'mass_abdomen', w: 2 },
      { id: 'constipation', w: 1 }
    ],
    contra: [{ id: 'bleeding', w: 3 }, { id: 'pulse_weak', w: 2 }, { id: 'fatigue', w: 1 }],
    clauses: [
      {
        ref: '《金匮要略·妇人产后病脉证并治》',
        text: '产妇腹痛，法当以枳实芍药散，假令不愈者，此为腹中有干血着脐下，宜下瘀血汤主之；亦主经水不利。'
      }
    ],
    modern: { terms: ['Xiayuxue Tang'], conditions: ['postpartum hemorrhage retention', 'endometriosis'] },
    safety: ['破血逐瘀：孕妇禁用、产后大出血者禁用、体虚者慎用', '须在医师指导下使用']
  },
  {
    id: 'baitouweng_jia_gancao_ejiao_tang',
    name: '白头翁加甘草阿胶汤',
    source: '《金匮要略·妇人产后病脉证并治》',
    contexts: ['postpartum'],
    six: '杂病',
    composition: [
      { herb: '白头翁', liang: 2 },
      { herb: '甘草', liang: 2 },
      { herb: '阿胶', liang: 2 },
      { herb: '黄连', liang: 3 },
      { herb: '黄柏', liang: 3 },
      { herb: '秦皮', liang: 3 }
    ],
    decoction: '上六味，以水七升，煮取二升半，内胶令烊消，分温三服。',
    pattern: ['产后下利虚极', '热利下重', '便脓血', '阴血不足'],
    indicators: [
      { id: 'diarrhea', w: 3 },
      { id: 'mucus_stool', w: 2 },
      { id: 'fatigue', w: 2 },
      { id: 'fever', w: 1 },
      { id: 'thirst', w: 1 },
      { id: 'pulse_thin', w: 1 }
    ],
    contra: [{ id: 'cold_limbs', w: 2 }, { id: 'tongue_pale', w: 2 }],
    clauses: [
      {
        ref: '《金匮要略·妇人产后病脉证并治》',
        text: '产后下利虚极，白头翁加甘草阿胶汤主之。'
      }
    ],
    modern: { terms: ['Baitouweng Jia Gancao Ejiao Tang'], conditions: ['ulcerative colitis', 'postpartum diarrhea'] },
    safety: ['虚寒下利禁用', '阿胶烊化，脾虚便溏者慎用', '产后腹泻脱水需补液']
  },

  // ── 妇人杂病（续） ────────────────────────────────────
  {
    id: 'jiaoai_tang',
    name: '胶艾汤',
    alias: '芎归胶艾汤',
    source: '《金匮要略·妇人杂病脉证并治》',
    six: '杂病',
    composition: [
      { herb: '川芎', liang: 2 },
      { herb: '阿胶', liang: 2 },
      { herb: '甘草', liang: 2 },
      { herb: '艾叶', liang: 3 },
      { herb: '当归', liang: 3 },
      { herb: '芍药', liang: 4 },
      { herb: '干地黄', liang: 6 }
    ],
    decoction: '上七味，以水五升、清酒三升，合煮取三升，去滓，内胶令消尽，温服一升，日三服，不差更作。',
    pattern: ['漏下不止', '半产后下血不绝', '妊娠下血', '胞阻腹中痛'],
    indicators: [
      { id: 'bleeding', w: 3 },
      { id: 'menstrual', w: 3 },
      { id: 'abdominal_pain', w: 2 },
      { id: 'fatigue', w: 2 },
      { id: 'dizziness', w: 1 },
      { id: 'cold_limbs', w: 1 }
    ],
    contra: [{ id: 'fever', w: 1 }, { id: 'dark_urine', w: 1 }, { id: 'pulse_rapid', w: 1 }],
    clauses: [
      {
        ref: '《金匮要略·妇人杂病脉证并治》',
        text: '师曰：妇人有漏下者，有半产后因续下血都不绝者，有妊娠下血者。假令妊娠腹中痛，为胞阻，胶艾汤主之。'
      }
    ],
    modern: { terms: ['Jiaoai Tang'], conditions: ['threatened abortion', 'dysfunctional uterine bleeding'] },
    safety: ['阴道大量出血、妊娠腹痛须立即就医', '血热妄行者不宜', '阿胶滋腻，脾虚者减量']
  },
  {
    id: 'tuguaigen_san',
    name: '土瓜根散',
    source: '《金匮要略·妇人杂病脉证并治》',
    six: '杂病',
    doseBasis: 'ratio',
    composition: [
      { herb: '土瓜根', text: '等分' },
      { herb: '芍药', text: '等分' },
      { herb: '桂枝', text: '等分' },
      { herb: '䗪虫', text: '等分' }
    ],
    decoction: '上四味，杵为散，酒服方寸匕，日三服。',
    pattern: ['带下经水不利', '少腹满痛', '经一月再见'],
    indicators: [
      { id: 'menstrual', w: 3 },
      { id: 'lower_abdomen', w: 2 },
      { id: 'mass_abdomen', w: 1 },
      { id: 'dysmenorrhea', w: 2 }
    ],
    contra: [{ id: 'bleeding', w: 2 }, { id: 'fatigue', w: 1 }],
    clauses: [
      {
        ref: '《金匮要略·妇人杂病脉证并治》',
        text: '带下经水不利，少腹满痛，经一月再见者，土瓜根散主之。'
      }
    ],
    modern: { terms: ['Tuguaigen San'], conditions: ['dysmenorrhea', 'irregular menstruation'] },
    safety: ['孕妇禁用（含䗪虫、活血）', '经量多者慎用']
  },

  // ── 名录条目（待补原文） ──────────────────────────────
  {
    id: 'hou_shi_hei_san',
    name: '侯氏黑散',
    source: '《金匮要略·中风历节病脉证并治》',
    six: '杂病',
    verified: false,
    summary: '大风四肢烦重，心中恶寒不足',
    pattern: ['四肢烦重', '心中恶寒'],
    composition: [{ herb: '菊花' }, { herb: '白术' }, { herb: '细辛' }, { herb: '茯苓' }, { herb: '牡蛎' }, { herb: '桔梗' }, { herb: '防风' }, { herb: '人参' }, { herb: '砒石' }, { herb: '黄芩' }, { herb: '当归' }, { herb: '干姜' }, { herb: '川芎' }, { herb: '桂枝' }]
  },
  {
    id: 'fengyin_tang',
    name: '风引汤',
    source: '《金匮要略·中风历节病脉证并治》',
    six: '杂病',
    verified: false,
    summary: '除热瘫痫（大人风引，小儿惊痫）',
    pattern: ['热瘫痫', '惊痫'],
    composition: [{ herb: '大黄' }, { herb: '干姜' }, { herb: '龙骨' }, { herb: '桂枝' }, { herb: '甘草' }, { herb: '牡蛎' }, { herb: '寒水石' }, { herb: '滑石' }, { herb: '赤石脂' }, { herb: '白石脂' }, { herb: '紫石英' }, { herb: '石膏' }]
  },
  {
    id: 'toufeng_mo_san',
    name: '头风摩散',
    source: '《金匮要略·中风历节病脉证并治》',
    six: '杂病',
    verified: false,
    summary: '头风（外摩）',
    pattern: ['头风'],
    composition: [{ herb: '大附子' }, { herb: '盐' }]
  },
  {
    id: 'chihuan',
    name: '赤丸',
    source: '《金匮要略·腹满寒疝宿食病脉证并治》',
    six: '杂病',
    verified: false,
    summary: '寒气厥逆',
    pattern: ['寒气厥逆'],
    composition: [{ herb: '茯苓' }, { herb: '半夏' }, { herb: '乌头' }, { herb: '细辛' }]
  },
  {
    id: 'da_wutou_jian',
    name: '大乌头煎',
    source: '《金匮要略·腹满寒疝宿食病脉证并治》',
    six: '杂病',
    verified: false,
    summary: '寒疝绕脐痛，发则白汗出，手足厥冷',
    pattern: ['寒疝', '绕脐痛', '手足厥冷'],
    composition: [{ herb: '乌头' }, { herb: '蜜' }]
  },
  {
    id: 'wutou_guizhi_tang',
    name: '乌头桂枝汤',
    source: '《金匮要略·腹满寒疝宿食病脉证并治》',
    six: '杂病',
    verified: false,
    summary: '寒疝腹中痛，逆冷，手足不仁',
    pattern: ['寒疝', '腹中痛', '手足不仁'],
    composition: [{ herb: '乌头' }, { herb: '桂枝' }, { herb: '芍药' }, { herb: '甘草' }, { herb: '生姜' }, { herb: '大枣' }]
  },
  {
    id: 'zouma_tang',
    name: '走马汤',
    source: '《金匮要略·腹满寒疝宿食病脉证并治》附方',
    six: '杂病',
    verified: false,
    summary: '中恶，心痛腹胀，大便不通',
    pattern: ['心痛腹胀', '大便不通'],
    composition: [{ herb: '巴豆' }, { herb: '杏仁' }]
  },
  {
    id: 'paizhu_san',
    name: '排脓散',
    source: '《金匮要略·疮痈肠痈浸淫病脉证并治》附方',
    six: '杂病',
    verified: false,
    summary: '疮痈脓成',
    pattern: ['疮痈', '脓成'],
    composition: [{ herb: '枳实' }, { herb: '芍药' }, { herb: '桔梗' }]
  },
  {
    id: 'paizhu_tang',
    name: '排脓汤',
    source: '《金匮要略·疮痈肠痈浸淫病脉证并治》附方',
    six: '杂病',
    verified: false,
    summary: '疮痈脓成',
    pattern: ['疮痈', '脓成'],
    composition: [{ herb: '甘草' }, { herb: '桔梗' }, { herb: '生姜' }, { herb: '大枣' }]
  },
  {
    id: 'fan_shi_wan',
    name: '矾石丸',
    source: '《金匮要略·妇人杂病脉证并治》',
    six: '杂病',
    verified: false,
    summary: '妇人经水闭不利，下白物（外用纳阴）',
    pattern: ['经水不利', '下白物'],
    composition: [{ herb: '矾石' }, { herb: '杏仁' }]
  },
  {
    id: 'honglanhua_jiu',
    name: '红蓝花酒',
    source: '《金匮要略·妇人杂病脉证并治》',
    six: '杂病',
    verified: false,
    summary: '妇人六十二种风，腹中血气刺痛',
    pattern: ['腹中刺痛'],
    composition: [{ herb: '红蓝花' }, { herb: '酒' }]
  },
  {
    id: 'shechuangzi_san',
    name: '蛇床子散',
    source: '《金匮要略·妇人杂病脉证并治》',
    six: '杂病',
    verified: false,
    summary: '妇人阴寒（外用纳阴）',
    pattern: ['阴寒'],
    composition: [{ herb: '蛇床子' }, { herb: '白粉' }]
  },
  {
    id: 'langya_tang',
    name: '狼牙汤',
    source: '《金匮要略·妇人杂病脉证并治》',
    six: '杂病',
    verified: false,
    summary: '少阴脉滑而数，阴中蚀疮烂（外洗）',
    pattern: ['阴中蚀疮'],
    composition: [{ herb: '狼牙' }]
  },
  {
    id: 'gaofa_jian',
    name: '膏发煎',
    source: '《金匮要略·妇人杂病脉证并治》',
    six: '杂病',
    verified: false,
    summary: '胃气下泄，阴吹而正喧；亦治诸黄',
    pattern: ['阴吹', '黄疸'],
    composition: [{ herb: '猪膏' }, { herb: '乱发' }]
  },
  {
    id: 'sanwu_beiji_wan',
    name: '三物备急丸',
    source: '《金匮要略·杂疗方》',
    six: '杂病',
    verified: false,
    summary: '心腹诸卒暴百病，中恶客忤，心腹胀满刺痛',
    pattern: ['心腹胀满', '卒暴腹痛'],
    composition: [{ herb: '大黄' }, { herb: '干姜' }, { herb: '巴豆' }]
  }
]
