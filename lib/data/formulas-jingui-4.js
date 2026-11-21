// 经方库 ·《金匮要略》续三：水气 / 黄疸 / 惊悸吐衄 / 呕吐哕下利

export const JINGUI_FORMULAS_4 = [
  // ── 水气病（续） ──────────────────────────────────────
  {
    id: 'guizhi_jia_huangqi_tang',
    name: '桂枝加黄芪汤',
    source: '《金匮要略·水气病脉证并治》',
    six: '杂病',
    composition: [
      { herb: '桂枝', liang: 3, prep: '去皮' },
      { herb: '芍药', liang: 3 },
      { herb: '甘草', liang: 2, prep: '炙' },
      { herb: '生姜', liang: 3, prep: '切' },
      { herb: '大枣', count: 12, unit: '枚', prep: '擘' },
      { herb: '黄芪', liang: 2 }
    ],
    decoction: '上六味，以水八升，煮取三升，温服一升，须臾，饮热稀粥一升余，以助药力，温覆取微汗；若不汗，更服。',
    pattern: ['黄汗', '身重', '汗出已辄轻', '腰以上必汗出', '腰以下无汗'],
    indicators: [
      { id: 'spontaneous_sweat', w: 3 },
      { id: 'heavy_body', w: 2 },
      { id: 'edema', w: 2 },
      { id: 'fatigue', w: 1 },
      { id: 'aversion_wind', w: 1 },
      { id: 'pulse_float', w: 1 }
    ],
    contra: [{ id: 'no_sweat', w: 1 }, { id: 'fever', w: 1 }],
    clauses: [
      {
        ref: '《金匮要略·水气病脉证并治》',
        text: '黄汗之病，两胫自冷；假令发热，此属历节。食已汗出，又身常暮盗汗出者，此劳气也。若汗出已反发热者，久久其身必甲错；发热不止者，必生恶疮。若身重，汗出已辄轻者，久久必身瞤，瞤即胸中痛，又从腰以上必汗出，下无汗，腰髋弛痛，如有物在皮中状，剧者不能食，身疼重，烦躁，小便不利，此为黄汗，桂枝加黄芪汤主之。'
      }
    ],
    modern: { terms: ['Guizhi Jia Huangqi Tang'], conditions: ['edema', 'chronic fatigue'] },
    safety: ['黄汗需与黄疸鉴别，必要时查肝功能', '阴虚火旺者慎用']
  },
  {
    id: 'huangqi_shaoyao_guizhi_kujiu_tang',
    name: '黄芪芍药桂枝苦酒汤',
    alias: '芪芍桂酒汤',
    source: '《金匮要略·水气病脉证并治》',
    six: '杂病',
    composition: [
      { herb: '黄芪', liang: 5 },
      { herb: '芍药', liang: 3 },
      { herb: '桂枝', liang: 3 },
      { herb: '苦酒', text: '一升', grams: '约 200ml（醋）' }
    ],
    decoction: '上三味，以苦酒一升、水七升相和，煮取三升，温服一升，当心烦，服至六七日乃解。若心烦不止者，以苦酒阻故也。',
    pattern: ['黄汗', '身体肿', '发热汗出而渴', '汗沾衣色正黄如柏汁'],
    indicators: [
      { id: 'spontaneous_sweat', w: 3 },
      { id: 'edema', w: 2 },
      { id: 'fever', w: 1 },
      { id: 'thirst', w: 1 },
      { id: 'fatigue', w: 1 }
    ],
    contra: [
      { id: 'no_sweat', w: 2 },
      { id: 'cold_limbs', w: 1 },
      { id: 'aversion_cold', w: 2 },
      { id: 'nasal', w: 2 },
      { id: 'headache', w: 1 }
    ],
    clauses: [
      {
        ref: '《金匮要略·水气病脉证并治》',
        text: '问曰：黄汗之为病，身体肿，发热汗出而渴，状如风水，汗沾衣，色正黄如柏汁，脉自沉，何从得之？师曰：以汗出入水中浴，水从汗孔入得之，宜芪芍桂酒汤主之。'
      }
    ],
    modern: { terms: ['Huangqi Shaoyao Guizhi Kujiu Tang'], conditions: ['edema', 'hyperhidrosis'] },
    safety: ['醋味酸收，胃酸过多、胃溃疡者慎用', '需与黄疸性肝炎鉴别']
  },
  {
    id: 'gancao_mahuang_tang',
    name: '甘草麻黄汤',
    source: '《金匮要略·水气病脉证并治》',
    six: '杂病',
    composition: [
      { herb: '甘草', liang: 2 },
      { herb: '麻黄', liang: 4, prep: '去节' }
    ],
    decoction: '上二味，以水五升，先煮麻黄，去上沫，内甘草，煮取三升，温服一升，重复汗出，不汗再服，慎风寒。',
    pattern: ['里水', '一身面目黄肿', '脉沉', '小便不利'],
    indicators: [
      { id: 'edema', w: 3 },
      { id: 'difficult_urine', w: 2 },
      { id: 'no_sweat', w: 2 },
      { id: 'pulse_deep', w: 2 },
      { id: 'heavy_body', w: 1 }
    ],
    contra: [{ id: 'spontaneous_sweat', w: 2 }, { id: 'pulse_weak', w: 2 }, { id: 'cold_limbs', w: 1 }],
    clauses: [
      {
        ref: '《金匮要略·水气病脉证并治》',
        text: '里水，越婢加术汤主之，甘草麻黄汤亦主之。'
      }
    ],
    modern: { terms: ['Gancao Mahuang Tang'], conditions: ['edema', 'nephritis'] },
    safety: ['麻黄发汗利水，高血压、心脏病者禁用或大减', '得汗即止，不可过汗', '水肿需查明病因']
  },
  {
    id: 'yuebi_jia_zhu_tang',
    name: '越婢加术汤',
    source: '《金匮要略·水气病脉证并治》',
    doseCap: { 麻黄: 9 },
    six: '杂病',
    composition: [
      { herb: '麻黄', liang: 6, prep: '去节' },
      { herb: '石膏', text: '半斤', grams: '24g', prep: '碎，绵裹' },
      { herb: '生姜', liang: 3, prep: '切' },
      { herb: '大枣', count: 15, unit: '枚', prep: '擘' },
      { herb: '甘草', liang: 2, prep: '炙' },
      { herb: '白术', liang: 4 }
    ],
    decoction: '上六味，以水六升，先煮麻黄，去上沫，内诸药，煮取三升，分温三服。恶风加附子一枚炮。',
    pattern: ['里水', '一身面目黄肿', '脉沉', '小便不利'],
    indicators: [
      { id: 'edema', w: 3 },
      { id: 'difficult_urine', w: 2 },
      { id: 'pulse_deep', w: 1 },
      { id: 'heavy_body', w: 1 },
      { id: 'thirst', w: 1 }
    ],
    contra: [{ id: 'pulse_weak', w: 2 }, { id: 'cold_limbs', w: 1 }],
    clauses: [
      {
        ref: '《金匮要略·水气病脉证并治》',
        text: '里水者，一身面目黄肿，其脉沉，小便不利，故令病水。假如小便自利，此亡津液，故令渴也。越婢加术汤主之。'
      }
    ],
    modern: { terms: ['Yuebi Jia Zhu Tang'], conditions: ['nephrotic syndrome', 'edema'] },
    safety: ['麻黄六两→18g，属大剂，高血压、心脏病者禁用', '得汗即止', '肾功能不全者须医师指导']
  },

  // ── 黄疸病（续） ──────────────────────────────────────
  {
    id: 'dahuang_xiaoshi_tang',
    name: '大黄硝石汤',
    source: '《金匮要略·黄疸病脉证并治》',
    six: '杂病',
    composition: [
      { herb: '大黄', liang: 4 },
      { herb: '黄柏', liang: 4 },
      { herb: '硝石', liang: 4 },
      { herb: '栀子', count: 15, unit: '枚' }
    ],
    decoction: '上四味，以水六升，煮取二升，去滓，内硝，更煮取一升，顿服。',
    pattern: ['黄疸腹满', '小便不利而赤', '自汗出', '表和里实'],
    indicators: [
      { id: 'jaundice', w: 3 },
      { id: 'abdominal_fullness', w: 2 },
      { id: 'dark_urine', w: 2 },
      { id: 'spontaneous_sweat', w: 1 },
      { id: 'constipation', w: 1 },
      { id: 'pulse_slippery', w: 1 }
    ],
    contra: [{ id: 'cold_limbs', w: 2 }, { id: 'tongue_pale', w: 1 }, { id: 'loose_stool', w: 2 }],
    clauses: [
      {
        ref: '《金匮要略·黄疸病脉证并治》',
        text: '黄疸腹满，小便不利而赤，自汗出，此为表和里实，当下之，宜大黄硝石汤。'
      }
    ],
    modern: { terms: ['Dahuang Xiaoshi Tang'], conditions: ['jaundice', 'cholecystitis'] },
    safety: ['硝石（火硝）为矿物药，须医师处方', '孕妇禁用', '阴黄、虚寒者禁用', '中病即止']
  },
  {
    id: 'xiaoshi_fanshi_san',
    name: '硝石矾石散',
    source: '《金匮要略·黄疸病脉证并治》',
    doseBasis: 'ratio',
    six: '杂病',
    composition: [
      { herb: '硝石', text: '等分', prep: '熬黄' },
      { herb: '矾石', text: '等分', prep: '烧' }
    ],
    decoction: '上二味，等分，捣为散，以大麦粥汁和服方寸匕，日三服。病随大小便去，小便正黄，大便正黑，是候也。',
    pattern: ['女劳疸', '日晡所发热而反恶寒', '少腹满', '身尽黄额上黑'],
    indicators: [
      { id: 'jaundice', w: 3 },
      { id: 'tidal_fever', w: 2 },
      { id: 'aversion_cold', w: 1 },
      { id: 'lower_abdomen', w: 1 },
      { id: 'dark_urine', w: 1 },
      { id: 'fatigue', w: 1 }
    ],
    contra: [{ id: 'loose_stool', w: 2 }, { id: 'pulse_weak', w: 1 }],
    clauses: [
      {
        ref: '《金匮要略·黄疸病脉证并治》',
        text: '黄家日晡所发热，而反恶寒，此为女劳得之。膀胱急，少腹满，身尽黄，额上黑，足下热，因作黑疸。其腹胀如水状，大便必黑，时溏，此女劳之病，非水也。腹满者难治，硝石矾石散主之。'
      }
    ],
    modern: { terms: ['Xiaoshi Fanshi San'], conditions: ['liver cirrhosis', 'jaundice'] },
    safety: ['硝石、矾石为矿物药，须医师处方，不可自行服用', '脾胃虚弱者慎用', '服药后大便色黑属药效，需与消化道出血鉴别']
  },

  // ── 惊悸吐衄下血（续） ────────────────────────────────
  {
    id: 'guizhi_jiuni_tang',
    name: '桂枝救逆汤',
    alias: '桂枝去芍药加蜀漆牡蛎龙骨救逆汤',
    source: '《金匮要略·惊悸吐衄下血胸满瘀血病脉证并治》',
    six: '杂病',
    composition: [
      { herb: '桂枝', liang: 3, prep: '去皮' },
      { herb: '甘草', liang: 2, prep: '炙' },
      { herb: '生姜', liang: 3, prep: '切' },
      { herb: '大枣', count: 12, unit: '枚', prep: '擘' },
      { herb: '牡蛎', liang: 5, prep: '熬' },
      { herb: '蜀漆', liang: 3, prep: '洗去腥' },
      { herb: '龙骨', liang: 4 }
    ],
    decoction: '上七味，以水一斗二升，先煮蜀漆，减二升，内诸药，煮取三升，去滓，温服一升。',
    pattern: ['惊狂', '卧起不安', '心悸', '火邪'],
    indicators: [
      { id: 'palpitation', w: 3 },
      { id: 'restlessness', w: 3 },
      { id: 'insomnia', w: 2 },
      { id: 'anxiety', w: 2 },
      { id: 'spontaneous_sweat', w: 1 }
    ],
    contra: [{ id: 'fever', w: 1 }, { id: 'thirst_cold', w: 1 }],
    clauses: [
      {
        ref: '《金匮要略·惊悸吐衄下血胸满瘀血病脉证并治》',
        text: '火邪者，桂枝去芍药加蜀漆牡蛎龙骨救逆汤主之。'
      }
    ],
    modern: { terms: ['Guizhi Jiuni Tang'], conditions: ['anxiety', 'palpitation', 'PTSD'] },
    safety: ['蜀漆（常山苗）有催吐作用，现代多不用或慎用', '孕妇禁用', '心悸持续需查心电图']
  },

  // ── 呕吐哕下利（续） ──────────────────────────────────
  {
    id: 'dabanxia_tang',
    name: '大半夏汤',
    source: '《金匮要略·呕吐哕下利病脉证并治》',
    six: '杂病',
    composition: [
      { herb: '半夏', text: '二升', grams: '约 24g', prep: '洗' },
      { herb: '人参', liang: 3 },
      { herb: '白蜜', text: '一升', grams: '约 30g' }
    ],
    decoction: '上三味，以水一斗二升，和蜜扬之二百四十遍，煮药取二升半，温服一升，余分再服。',
    pattern: ['胃反呕吐', '朝食暮吐', '暮食朝吐', '心下痞硬'],
    indicators: [
      { id: 'vomiting', w: 3 },
      { id: 'poor_appetite', w: 2 },
      { id: 'epigastric_distention', w: 2 },
      { id: 'constipation', w: 1 },
      { id: 'weight_loss', w: 1 },
      { id: 'fatigue', w: 1 }
    ],
    contra: [{ id: 'thirst_cold', w: 1 }, { id: 'yellow_sputum', w: 1 }],
    clauses: [
      {
        ref: '《金匮要略·呕吐哕下利病脉证并治》',
        text: '胃反呕吐者，大半夏汤主之。'
      }
    ],
    modern: { terms: ['Dabanxia Tang'], conditions: ['gastric outlet obstruction', 'vomiting'] },
    safety: ['半夏宜制用，孕妇慎用', '幽门梗阻、食管癌等需先明确诊断，不可单靠本方', '白蜜滋腻，湿热中阻者减量']
  },
  {
    id: 'fuling_zexie_tang',
    name: '茯苓泽泻汤',
    source: '《金匮要略·呕吐哕下利病脉证并治》',
    six: '杂病',
    composition: [
      { herb: '茯苓', text: '半斤', grams: '24g' },
      { herb: '泽泻', liang: 4 },
      { herb: '甘草', liang: 2 },
      { herb: '桂枝', liang: 2 },
      { herb: '白术', liang: 3 },
      { herb: '生姜', liang: 4 }
    ],
    decoction: '上六味，以水一斗，煮取三升，内泽泻，再煮取二升半，温服八合，日三服。',
    pattern: ['胃反', '吐而渴欲饮水', '心下停饮'],
    indicators: [
      { id: 'vomiting', w: 3 },
      { id: 'thirst', w: 3 },
      { id: 'dizziness', w: 1 },
      { id: 'epigastric_distention', w: 1 },
      { id: 'difficult_urine', w: 1 },
      { id: 'tongue_swollen', w: 1 }
    ],
    contra: [{ id: 'thirst_no_drink', w: 1 }, { id: 'yellow_sputum', w: 1 }],
    clauses: [
      {
        ref: '《金匮要略·呕吐哕下利病脉证并治》',
        text: '胃反，吐而渴欲饮水者，茯苓泽泻汤主之。'
      }
    ],
    modern: { terms: ['Fuling Zexie Tang'], conditions: ['vomiting', 'gastroparesis'] },
    safety: ['阴虚津伤者不宜', '泽泻久服伤阴']
  },
  {
    id: 'banxia_ganjiang_san',
    name: '半夏干姜散',
    source: '《金匮要略·呕吐哕下利病脉证并治》',
    doseBasis: 'ratio',
    six: '杂病',
    composition: [
      { herb: '半夏', text: '等分' },
      { herb: '干姜', text: '等分' }
    ],
    decoction: '上二味，杵为散，取方寸匕，浆水一升半，煎取七合，顿服之。现代：可作汤剂，半夏 9g、干姜 9g，水煎温服。',
    pattern: ['干呕', '吐逆', '吐涎沫', '中焦虚寒'],
    indicators: [
      { id: 'dry_heave', w: 3 },
      { id: 'vomiting', w: 2 },
      { id: 'saliva', w: 3 },
      { id: 'chill_body', w: 2 },
      { id: 'epigastric_pain', w: 1 }
    ],
    contra: [{ id: 'thirst_cold', w: 2 }, { id: 'yellow_sputum', w: 2 }],
    clauses: [
      {
        ref: '《金匮要略·呕吐哕下利病脉证并治》',
        text: '干呕，吐逆，吐涎沫，半夏干姜散主之。'
      }
    ],
    modern: { terms: ['Banxia Ganjiang San'], conditions: ['vomiting', 'gastritis'] },
    safety: ['胃热呕吐禁用', '半夏制用，孕妇慎用']
  },
  {
    id: 'jupi_tang',
    name: '橘皮汤',
    source: '《金匮要略·呕吐哕下利病脉证并治》',
    six: '杂病',
    composition: [
      { herb: '橘皮', liang: 4 },
      { herb: '生姜', text: '半斤', grams: '24g', prep: '切' }
    ],
    decoction: '上二味，以水七升，煮取三升，温服一升，下咽即愈。',
    pattern: ['干呕哕', '手足厥', '胃寒气逆'],
    indicators: [
      { id: 'hiccup', w: 3 },
      { id: 'dry_heave', w: 2 },
      { id: 'cold_limbs', w: 2 },
      { id: 'epigastric_distention', w: 1 }
    ],
    contra: [{ id: 'thirst_cold', w: 2 }, { id: 'fever', w: 1 }],
    clauses: [
      {
        ref: '《金匮要略·呕吐哕下利病脉证并治》',
        text: '干呕哕，若手足厥者，橘皮汤主之。'
      }
    ],
    modern: { terms: ['Jupi Tang'], conditions: ['hiccup', 'nausea'] },
    safety: ['胃热、阴虚者不宜', '呕哕持续不缓解需查因']
  }
]
