// 经方库 · 由《金匮要略》原文补录的「已核方」
//
// 这些方原先只有名录（verified:false）。原文里有「论」（主治/脉证）的，才能升为
// A 档；只有方名与组成、没有论治文字的（天雄散、头风摩散、排脓散、排脓汤、
// 蛇床子散）继续留在名录里，不参与辨证、不给开方。
//
// 同 id 的条目在本文件里覆盖前面文件中的名录条目（见 data/index.js 的合并逻辑）。

export const JINGUI_VERIFIED_FORMULAS = [
  {
    id: 'biejia_jian_wan',
    name: '鳖甲煎丸',
    source: '《金匮要略·疟病脉证并治》',
    six: '杂病',
    doseBasis: 'ratio',
    composition: [
      { herb: '鳖甲', text: '十二分', prep: '炙' },
      { herb: '乌扇', text: '三分', prep: '烧' },
      { herb: '黄芩', text: '三分' },
      { herb: '柴胡', text: '六分' },
      { herb: '鼠妇', text: '三分', prep: '熬' },
      { herb: '干姜', text: '三分' },
      { herb: '大黄', text: '三分' },
      { herb: '芍药', text: '五分' },
      { herb: '桂枝', text: '三分' },
      { herb: '葶苈', text: '一分', prep: '熬' },
      { herb: '石韦', text: '三分', prep: '去毛' },
      { herb: '厚朴', text: '三分' },
      { herb: '牡丹', text: '五分', prep: '去心' },
      { herb: '瞿麦', text: '二分' },
      { herb: '紫葳', text: '三分' },
      { herb: '半夏', text: '一分' },
      { herb: '人参', text: '一分' },
      { herb: '䗪虫', text: '五分', prep: '熬' },
      { herb: '阿胶', text: '三分', prep: '炙' },
      { herb: '蜂窝', text: '四分', prep: '炙' },
      { herb: '赤硝', text: '十二分' },
      { herb: '蜣螂', text: '六分', prep: '熬' },
      { herb: '桃仁', text: '二分' }
    ],
    decoction:
      '上二十三味为末，取锻灶下灰一斗、清酒一斛五斗浸灰，候酒尽一半，着鳖甲于中煮令泛烂如胶漆，绞取汁，内诸药煎为丸，如梧子大，空心服七丸，日三服。',
    pattern: ['疟母', '胁下痞硬成块', '疟久不愈', '腹中癥瘕'],
    indicators: [
      { id: 'mass_abdomen', w: 3 },
      { id: 'hypochondriac', w: 3 },
      { id: 'fever', w: 1 },
      { id: 'weight_loss', w: 1 },
      { id: 'poor_appetite', w: 1 },
      { id: 'fatigue', w: 1 }
    ],
    contra: [{ id: 'bleeding', w: 2 }, { id: 'pulse_weak', w: 2 }],
    clauses: [
      {
        ref: '《金匮要略·疟病脉证并治》',
        text: '病疟，以月一日发，当以十五日愈；设不差，当月尽解；如其不差，当云何？师曰：此结为癥瘕，名曰疟母，急治之，宜鳖甲煎丸。'
      }
    ],
    modern: { terms: ['Biejia Jian Wan'], conditions: ['hepatosplenomegaly', 'liver fibrosis', 'malaria'] },
    safety: ['破血消癥之剂：孕妇禁用、出血倾向者禁用', '含虫类药与赤硝，须医师处方', '疟疾须规范抗疟治疗']
  },
  {
    id: 'shuyu_wan',
    name: '薯蓣丸',
    source: '《金匮要略·血痹虚劳病脉证并治》',
    six: '杂病',
    doseBasis: 'ratio',
    composition: [
      { herb: '薯蓣', text: '三十分' },
      { herb: '当归', text: '十分' },
      { herb: '桂枝', text: '十分' },
      { herb: '神曲', text: '十分' },
      { herb: '干地黄', text: '十分' },
      { herb: '豆黄卷', text: '十分' },
      { herb: '甘草', text: '二十八分' },
      { herb: '人参', text: '七分' },
      { herb: '川芎', text: '六分' },
      { herb: '芍药', text: '六分' },
      { herb: '白术', text: '六分' },
      { herb: '麦门冬', text: '六分' },
      { herb: '杏仁', text: '六分' },
      { herb: '柴胡', text: '五分' },
      { herb: '桔梗', text: '五分' },
      { herb: '茯苓', text: '五分' },
      { herb: '阿胶', text: '七分' },
      { herb: '干姜', text: '三分' },
      { herb: '白蔹', text: '二分' },
      { herb: '防风', text: '六分' },
      { herb: '大枣', text: '百枚', prep: '为膏' }
    ],
    decoction: '上二十一味，末之，炼蜜和丸，如弹子大，空腹酒服一丸，一百丸为剂。',
    pattern: ['虚劳诸不足', '风气百疾', '羸瘦', '易感外邪'],
    indicators: [
      { id: 'fatigue', w: 3 },
      { id: 'weight_loss', w: 3 },
      { id: 'poor_appetite', w: 2 },
      { id: 'dizziness', w: 1 },
      { id: 'palpitation', w: 1 },
      { id: 'night_sweat', w: 1 },
      { id: 'joint_pain', w: 1 }
    ],
    contra: [{ id: 'fever', w: 1 }, { id: 'coat_yellow_greasy', w: 2 }],
    clauses: [
      {
        ref: '《金匮要略·血痹虚劳病脉证并治》',
        text: '虚劳诸不足，风气百疾，薯蓣丸主之。'
      }
    ],
    modern: { terms: ['Shuyu Wan'], conditions: ['chronic fatigue', 'malnutrition', 'immunity'] },
    safety: ['滋补之剂，外感发热、湿热内盛时停服', '含阿胶、大枣，糖尿病与脾虚湿盛者慎用']
  },
  {
    id: 'hou_shi_hei_san',
    name: '侯氏黑散',
    source: '《金匮要略·中风历节病脉证并治》',
    six: '杂病',
    doseBasis: 'ratio',
    composition: [
      { herb: '菊花', text: '四十分' },
      { herb: '白术', text: '十分' },
      { herb: '细辛', text: '三分' },
      { herb: '茯苓', text: '三分' },
      { herb: '牡蛎', text: '三分' },
      { herb: '桔梗', text: '八分' },
      { herb: '防风', text: '十分' },
      { herb: '人参', text: '三分' },
      { herb: '矾石', text: '三分' },
      { herb: '黄芩', text: '五分' },
      { herb: '当归', text: '三分' },
      { herb: '干姜', text: '三分' },
      { herb: '川芎', text: '三分' },
      { herb: '桂枝', text: '三分' }
    ],
    decoction:
      '上十四味，杵为散，酒服方寸匕，日一服。初服二十日，温酒调服，禁一切鱼肉大蒜，常宜冷食，六十日止。',
    pattern: ['大风四肢烦重', '心中恶寒不足', '中风先兆'],
    indicators: [
      { id: 'heavy_body', w: 3 },
      { id: 'chill_body', w: 2 },
      { id: 'fatigue', w: 2 },
      { id: 'dizziness', w: 1 },
      { id: 'numbness', w: 1 },
      { id: 'sore_limbs', w: 1 }
    ],
    contra: [{ id: 'fever', w: 1 }, { id: 'thirst_cold', w: 1 }],
    clauses: [
      {
        ref: '《金匮要略·中风历节病脉证并治》',
        text: '侯氏黑散：治大风四肢烦重，心中恶寒不足者。'
      }
    ],
    modern: { terms: ['Hou Shi Hei San'], conditions: ['stroke', 'cerebral infarction'] },
    safety: ['含矾石（矿物药），须医师处方，不宜久服', '中风急性期（口眼歪斜、言语不清、肢体无力）须立即急诊', '孕妇禁用']
  },
  {
    id: 'fangji_dihuang_tang',
    name: '防己地黄汤',
    source: '《金匮要略·中风历节病脉证并治》',
    six: '杂病',
    doseBasis: 'modern',
    composition: [
      { herb: '防己', text: '3g' },
      { herb: '桂枝', text: '9g' },
      { herb: '防风', text: '9g' },
      { herb: '甘草', text: '6g' },
      { herb: '生地黄', text: '60g', prep: '捣汁或久煎' }
    ],
    decoction:
      '原方：防己一钱、桂枝三钱、防风三钱、甘草二钱，以酒一杯浸之一宿，绞取汁；生地黄二斤㕮咀，蒸之如斗米饭久，以铜器盛汁，更绞地黄汁，和，分再服。现代多作汤剂，生地黄重用。',
    pattern: ['病如狂状', '妄行独语不休', '无寒热', '其脉浮'],
    indicators: [
      { id: 'delirium', w: 3 },
      { id: 'restlessness', w: 3 },
      { id: 'insomnia', w: 2 },
      { id: 'irritability', w: 2 },
      { id: 'fever', w: 0.5 }
    ].filter((i) => i.w >= 1),
    contra: [{ id: 'cold_limbs', w: 1 }, { id: 'loose_stool', w: 2 }],
    clauses: [
      {
        ref: '《金匮要略·中风历节病脉证并治》',
        text: '防己地黄汤：治病如狂状，妄行，独语不休，无寒热，其脉浮。'
      }
    ],
    modern: { terms: ['Fangji Dihuang Tang'], conditions: ['psychosis', 'dementia', 'delirium'] },
    safety: ['精神行为异常须先排除器质性与药物因素，及时就医', '生地黄重用易致腹泻，脾虚者减量', '防己有肾毒性报道']
  },
  {
    id: 'da_wutou_jian',
    name: '大乌头煎',
    source: '《金匮要略·腹满寒疝宿食病脉证并治》',
    six: '杂病',
    doseBasis: 'ratio',
    composition: [
      { herb: '乌头', text: '五枚', prep: '大者，熬，去皮，不㕮咀' },
      { herb: '蜜', text: '二升' }
    ],
    decoction:
      '上以水三升煮取一升，去滓，内蜜二升，煎令水气尽，取二升。强人服七合，弱人服五合；不差，明日更服，不可一日再服。',
    pattern: ['寒疝绕脐痛', '发则白汗出', '手足厥冷', '脉沉紧'],
    indicators: [
      { id: 'abdominal_pain', w: 3 },
      { id: 'cold_limbs', w: 3 },
      { id: 'chill_body', w: 2 },
      { id: 'pulse_deep', w: 2 },
      { id: 'pulse_tight', w: 2 },
      { id: 'vomiting', w: 1 }
    ],
    contra: [{ id: 'fever', w: 2 }, { id: 'thirst_cold', w: 2 }, { id: 'pulse_rapid', w: 2 }],
    clauses: [
      {
        ref: '《金匮要略·腹满寒疝宿食病脉证并治》',
        text: '寒疝绕脐痛，若发则白汗出，手足厥冷，其脉沉紧者，大乌头煎主之。'
      }
    ],
    modern: { terms: ['Da Wutou Jian'], conditions: ['abdominal colic', 'acute pancreatitis'] },
    safety: [
      '乌头大毒：必须蜜煎、久煎，用量从严，且「不可一日再服」',
      '出现口舌麻木、心悸、呕吐、血压下降立即急诊',
      '孕妇禁用；现代临床多已弃用，改以制附子、干姜等替代'
    ]
  },
  {
    id: 'wutou_guizhi_tang',
    name: '乌头桂枝汤',
    source: '《金匮要略·腹满寒疝宿食病脉证并治》',
    six: '杂病',
    doseBasis: 'ratio',
    composition: [
      { herb: '乌头', text: '一味', prep: '蜜煎' },
      { herb: '桂枝汤', text: '五合', prep: '另煎' }
    ],
    decoction:
      '乌头一味，以蜜二斤煎减半，去滓，以桂枝汤五合解之，得一升后，初服二合；不知，即服三合；又不知，复加至五合。其知者，如醉状，得吐者，为中病。',
    pattern: ['寒疝腹中痛', '逆冷', '手足不仁', '身疼痛'],
    indicators: [
      { id: 'abdominal_pain', w: 3 },
      { id: 'cold_limbs', w: 3 },
      { id: 'numbness', w: 2 },
      { id: 'joint_pain', w: 2 },
      { id: 'chill_body', w: 1 }
    ],
    contra: [{ id: 'fever', w: 2 }, { id: 'thirst_cold', w: 2 }],
    clauses: [
      {
        ref: '《金匮要略·腹满寒疝宿食病脉证并治》',
        text: '寒疝腹中痛，逆冷，手足不仁，若身疼痛，灸刺诸药不能治，抵当乌头桂枝汤主之。'
      }
    ],
    modern: { terms: ['Wutou Guizhi Tang'], conditions: ['abdominal pain', 'arthralgia'] },
    safety: ['乌头大毒，须蜜煎久煎；「如醉状」即乌头碱反应，出现即停药', '孕妇禁用', '须在医师监护下使用']
  },
  {
    id: 'zouma_tang',
    name: '走马汤',
    source: '《金匮要略·腹满寒疝宿食病脉证并治》附方',
    six: '杂病',
    doseBasis: 'ratio',
    composition: [
      { herb: '巴豆', text: '二枚', prep: '去皮心，熬' },
      { herb: '杏仁', text: '二枚' }
    ],
    decoction: '上二味，以绵缠捶令碎，热汤二合，捻取白汁饮之，当下。老小量之。通治飞尸鬼击病。',
    pattern: ['中恶心痛腹胀', '大便不通', '卒暴发病'],
    indicators: [
      { id: 'abdominal_fullness', w: 3 },
      { id: 'constipation', w: 3 },
      { id: 'abdominal_pain', w: 2 },
      { id: 'vomiting', w: 1 }
    ],
    contra: [{ id: 'pulse_weak', w: 3 }, { id: 'diarrhea', w: 3 }, { id: 'fatigue', w: 2 }],
    clauses: [
      {
        ref: '《金匮要略·腹满寒疝宿食病脉证并治》附方',
        text: '走马汤：治中恶心痛腹胀，大便不通。'
      }
    ],
    modern: { terms: ['Zouma Tang'], conditions: ['acute intestinal obstruction', 'poisoning'] },
    safety: ['巴豆大毒、峻下：孕妇禁用，体虚者禁用，绝不可自行服用', '只可暂用，中病即止；须医师处方与监护']
  },
  {
    id: 'fan_shi_wan',
    name: '矾石丸',
    source: '《金匮要略·妇人杂病脉证并治》',
    six: '杂病',
    doseBasis: 'ratio',
    composition: [
      { herb: '矾石', text: '三分', prep: '烧' },
      { herb: '杏仁', text: '一分' }
    ],
    decoction: '上二味，末之，炼蜜和丸，枣核大，内脏中，剧者再内之。（外用纳阴，非内服）',
    pattern: ['经水闭不利', '中有干血', '下白物'],
    indicators: [
      { id: 'leukorrhea', w: 3 },
      { id: 'menstrual', w: 2 },
      { id: 'lower_abdomen', w: 1 }
    ],
    contra: [{ id: 'bleeding', w: 2 }],
    clauses: [
      {
        ref: '《金匮要略·妇人杂病脉证并治》',
        text: '妇人经水闭不利，脏坚癖不止，中有干血，下白物，矾石丸主之。'
      }
    ],
    modern: { terms: ['Fanshi Wan'], conditions: ['vaginitis', 'cervicitis'] },
    safety: ['本方为外用药，禁止内服', '矾石刺激性较强，黏膜破损者慎用', '带下量多需先查病原体']
  },
  {
    id: 'honglanhua_jiu',
    name: '红蓝花酒',
    source: '《金匮要略·妇人杂病脉证并治》',
    six: '杂病',
    composition: [
      { herb: '红蓝花', liang: 1 },
      { herb: '酒', text: '一大升', grams: '约 200ml' }
    ],
    decoction: '上一味，以酒一大升，煎减半，顿服一半，未止再服。',
    pattern: ['腹中血气刺痛', '妇人六十二种风', '痛处固定'],
    indicators: [
      { id: 'abdominal_pain', w: 3 },
      { id: 'dysmenorrhea', w: 2 },
      { id: 'lower_abdomen', w: 2 },
      { id: 'mass_abdomen', w: 1 }
    ],
    contra: [{ id: 'bleeding', w: 3 }, { id: 'pulse_weak', w: 1 }],
    clauses: [
      {
        ref: '《金匮要略·妇人杂病脉证并治》',
        text: '妇人六十二种风，及腹中血气刺痛，红蓝花酒主之。'
      }
    ],
    modern: { terms: ['Honglanhua Jiu'], conditions: ['dysmenorrhea', 'pelvic pain'] },
    safety: ['活血之剂，孕妇禁用、经量多者禁用', '含酒，肝病、胃病者慎用']
  },
  {
    id: 'langya_tang',
    name: '狼牙汤',
    source: '《金匮要略·妇人杂病脉证并治》',
    six: '杂病',
    composition: [{ herb: '狼牙', liang: 3 }],
    decoction: '上一味，以水四升，煮取半升，以绵缠筋如茧，浸汤沥阴中，日四遍。（外洗，非内服）',
    pattern: ['阴中生疮', '阴中蚀疮烂', '少阴脉滑而数'],
    indicators: [
      { id: 'leukorrhea', w: 2 },
      { id: 'sore_throat', w: 1 },
      { id: 'dark_urine', w: 1 }
    ],
    contra: [{ id: 'bleeding', w: 1 }],
    clauses: [
      {
        ref: '《金匮要略·妇人杂病脉证并治》',
        text: '少阴脉滑而数者，阴中即生疮，阴中蚀疮烂者，狼牙汤洗之。'
      }
    ],
    modern: { terms: ['Langya Tang'], conditions: ['vaginitis', 'vulvar ulcer'] },
    safety: ['外洗方，禁止内服；狼牙今多不备，常以苦参、蛇床子代之', '溃疡久不愈须排除恶变与性传播疾病']
  },
  {
    id: 'gaofa_jian',
    name: '膏发煎',
    alias: '猪膏发煎',
    source: '《金匮要略·黄疸病脉证并治》',
    six: '杂病',
    doseBasis: 'ratio',
    composition: [
      { herb: '猪膏', text: '半斤' },
      { herb: '乱发', text: '如鸡子大', prep: '三枚' }
    ],
    decoction: '上二味，和膏中煎之，发消药成，分再服。病从小便出。',
    pattern: ['诸黄', '阴吹而正喧', '大便干结'],
    indicators: [
      { id: 'jaundice', w: 3 },
      { id: 'constipation', w: 2 },
      { id: 'dry_mouth', w: 1 },
      { id: 'hard_stool', w: 1 }
    ],
    contra: [{ id: 'loose_stool', w: 2 }, { id: 'cold_limbs', w: 1 }],
    clauses: [
      {
        ref: '《金匮要略·黄疸病脉证并治》',
        text: '诸黄，猪膏发煎主之。'
      },
      {
        ref: '《金匮要略·妇人杂病脉证并治》',
        text: '胃气下泄，阴吹而正喧，此谷气之实也，膏发煎导之。'
      }
    ],
    modern: { terms: ['Gaofa Jian'], conditions: ['jaundice', 'constipation'] },
    safety: ['黄疸须查明病因（肝炎、胆道梗阻、溶血），不可单靠本方', '滋腻滑肠，脾虚便溏者禁用']
  },
  {
    id: 'sanwu_beiji_wan',
    name: '三物备急丸',
    source: '《金匮要略·杂疗方》',
    six: '杂病',
    composition: [
      { herb: '大黄', liang: 1 },
      { herb: '干姜', liang: 1 },
      { herb: '巴豆', liang: 1, prep: '去皮心，熬，研如脂' }
    ],
    decoction:
      '上药各须精新，先捣大黄、干姜为末，研巴豆内中，合治一千杵，用为散，蜜和丸亦佳，密器中贮之。主心腹诸卒暴百病，若中恶客忤，心腹胀满，卒痛如锥刺，气急口噤，以暖水苦酒服大豆许三四丸；不下，捧头起灌令下咽。',
    pattern: ['心腹胀满', '卒痛如锥刺', '气急口噤', '卒暴发病'],
    indicators: [
      { id: 'abdominal_pain', w: 3 },
      { id: 'abdominal_fullness', w: 3 },
      { id: 'constipation', w: 2 },
      { id: 'delirium', w: 1 }
    ],
    contra: [{ id: 'pulse_weak', w: 3 }, { id: 'diarrhea', w: 3 }, { id: 'bleeding', w: 2 }],
    clauses: [
      {
        ref: '《金匮要略·杂疗方》',
        text: '三物备急丸方：主心腹诸卒暴百病，若中恶客忤，心腹胀满，卒痛如锥刺，气急口噤，停尸卒死者。'
      }
    ],
    modern: { terms: ['Sanwu Beiji Wan'], conditions: ['acute abdomen', 'poisoning'] },
    safety: ['巴豆大毒、峻下：孕妇禁用，体虚者禁用，绝不可自行服用', '急腹症与中毒须立即急救，本方不能替代现代急救', '须医师处方并严密监护']
  },
  {
    id: 'chihuan',
    name: '赤丸',
    source: '《金匮要略·腹满寒疝宿食病脉证并治》',
    six: '杂病',
    composition: [
      { herb: '茯苓', liang: 4 },
      { herb: '乌头', liang: 2, prep: '炮' },
      { herb: '半夏', liang: 4, prep: '洗' },
      { herb: '细辛', liang: 1 }
    ],
    decoction:
      '上四味，末之，内真朱为色，炼蜜丸如麻子大，先食酒饮下三丸，日再夜一服；不知，稍增之，以知为度。',
    pattern: ['寒气厥逆', '腹痛', '呕吐', '手足冷'],
    indicators: [
      { id: 'cold_limbs', w: 3 },
      { id: 'abdominal_pain', w: 3 },
      { id: 'vomiting', w: 2 },
      { id: 'chill_body', w: 2 },
      { id: 'pulse_deep', w: 1 }
    ],
    contra: [{ id: 'fever', w: 2 }, { id: 'thirst_cold', w: 2 }],
    clauses: [
      {
        ref: '《金匮要略·腹满寒疝宿食病脉证并治》',
        text: '寒气厥逆，赤丸主之。'
      }
    ],
    modern: { terms: ['Chi Wan'], conditions: ['abdominal pain', 'hypothermia'] },
    safety: ['含乌头、半夏、细辛，毒性叠加，须严格炮制并小剂量起始', '孕妇禁用', '出现口麻心悸立即急诊']
  },
  {
    id: 'fengyin_tang',
    name: '风引汤',
    source: '《金匮要略·中风历节病脉证并治》',
    six: '杂病',
    doseBasis: 'ratio',
    composition: [
      { herb: '大黄', liang: 4 },
      { herb: '干姜', liang: 4 },
      { herb: '龙骨', liang: 4 },
      { herb: '桂枝', liang: 3 },
      { herb: '甘草', liang: 2 },
      { herb: '牡蛎', liang: 2 },
      { herb: '寒水石', liang: 6 },
      { herb: '滑石', liang: 6 },
      { herb: '赤石脂', liang: 6 },
      { herb: '白石脂', liang: 6 },
      { herb: '紫石英', liang: 6 },
      { herb: '石膏', liang: 6 }
    ],
    decoction:
      '上十二味，杵，粗筛，以韦囊盛之，取三指撮，井花水三升，煮三沸，温服一升。治大人风引，少小惊痫瘛疭，日数十发。',
    pattern: ['热瘫痫', '惊痫瘛疭', '日数十发'],
    indicators: [
      { id: 'spasm', w: 3 },
      { id: 'restlessness', w: 2 },
      { id: 'dizziness', w: 1 },
      { id: 'fever', w: 1 },
      { id: 'numbness', w: 1 }
    ],
    contra: [{ id: 'cold_limbs', w: 2 }, { id: 'pulse_weak', w: 1 }],
    clauses: [
      {
        ref: '《金匮要略·中风历节病脉证并治》',
        text: '风引汤：除热瘫痫。治大人风引，少小惊痫瘛疭，日数十发，医所不疗，除热方。'
      }
    ],
    modern: { terms: ['Fengyin Tang'], conditions: ['epilepsy', 'febrile seizure'] },
    safety: ['癫痫持续状态须立即急诊', '含大量矿物药，脾胃虚寒者慎用', '须医师处方']
  }
]
