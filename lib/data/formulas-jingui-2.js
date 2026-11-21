// 经方库 ·《金匮要略》续一：痉湿暍 / 百合狐惑阴阳毒 / 疟病 / 中风历节 / 血痹虚劳
//
// verified:false 的条目是「名录」——只有篇目、组成与主治大意，未录入原文条文，
// 不参与辨证、不能开方（evidence 返回 unverified）。补录原文后把 verified 去掉即可。

export const JINGUI_FORMULAS_2 = [
  // ── 痉湿暍病（续） ────────────────────────────────────
  {
    id: 'baizhu_fuzi_tang',
    name: '白术附子汤',
    source: '《金匮要略·痉湿暍病脉证并治》',
    six: '杂病',
    composition: [
      { herb: '附子', count: 3, unit: '枚', prep: '炮，去皮，破八片' },
      { herb: '白术', liang: 4 },
      { herb: '生姜', liang: 3, prep: '切' },
      { herb: '甘草', liang: 2, prep: '炙' },
      { herb: '大枣', count: 12, unit: '枚', prep: '擘' }
    ],
    decoction: '上五味，以水六升，煮取二升，去滓，分温三服。初一服，其人身如痹，半日许复服之，三服都尽，其人如冒状，勿怪。',
    pattern: ['身体疼烦', '大便坚', '小便自利', '脉浮虚而涩'],
    indicators: [
      { id: 'body_ache', w: 3 },
      { id: 'hard_stool', w: 2 },
      { id: 'clear_urine', w: 2 },
      { id: 'joint_pain', w: 1 },
      { id: 'chill_body', w: 1 },
      { id: 'pulse_float', w: 1 },
      { id: 'pulse_rough', w: 1 }
    ],
    contra: [{ id: 'thirst_cold', w: 2 }, { id: 'fever', w: 1 }],
    clauses: [
      {
        ref: '《金匮要略·痉湿暍病脉证并治》',
        text: '伤寒八九日，风湿相搏，身体疼烦，不能自转侧，不呕不渴，脉浮虚而涩者，桂枝附子汤主之；若大便坚，小便自利者，去桂加白术汤主之。'
      }
    ],
    modern: { terms: ['Baizhu Fuzi Tang'], conditions: ['arthritis', 'arthralgia'] },
    safety: ['附子需炮制并先煎 60 分钟以上', '孕妇慎用', '服后如冒状属药力反应，若心悸口麻立即停药']
  },
  {
    id: 'gancao_fuzi_tang',
    name: '甘草附子汤',
    source: '《金匮要略·痉湿暍病脉证并治》',
    six: '杂病',
    composition: [
      { herb: '甘草', liang: 2, prep: '炙' },
      { herb: '附子', count: 2, unit: '枚', prep: '炮，去皮' },
      { herb: '白术', liang: 2 },
      { herb: '桂枝', liang: 4, prep: '去皮' }
    ],
    decoction: '上四味，以水六升，煮取三升，去滓，温服一升，日三服。初服得微汗则解。',
    pattern: ['骨节疼烦', '掣痛不得屈伸', '汗出短气', '小便不利', '恶风不欲去衣'],
    indicators: [
      { id: 'joint_pain', w: 3 },
      { id: 'spasm', w: 2 },
      { id: 'spontaneous_sweat', w: 2 },
      { id: 'short_breath', w: 1 },
      { id: 'difficult_urine', w: 1 },
      { id: 'aversion_wind', w: 2 },
      { id: 'edema', w: 1 },
      { id: 'chill_body', w: 1 }
    ],
    contra: [{ id: 'fever', w: 1 }, { id: 'thirst_cold', w: 2 }],
    clauses: [
      {
        ref: '《金匮要略·痉湿暍病脉证并治》',
        text: '风湿相搏，骨节疼烦，掣痛不得屈伸，近之则痛剧，汗出短气，小便不利，恶风不欲去衣，或身微肿者，甘草附子汤主之。'
      }
    ],
    modern: { terms: ['Gancao Fuzi Tang'], conditions: ['rheumatoid arthritis', 'heart failure'] },
    safety: ['附子先煎，不可与半夏、瓜蒌、贝母、白蔹、白及同用', '汗出短气明显者需排除心衰，及时就医']
  },

  // ── 百合狐惑阴阳毒病 ──────────────────────────────────
  {
    id: 'baihe_dihuang_tang',
    name: '百合地黄汤',
    source: '《金匮要略·百合狐惑阴阳毒病脉证并治》',
    six: '杂病',
    composition: [
      { herb: '百合', count: 7, unit: '枚', prep: '擘' },
      { herb: '生地黄汁', text: '一升', grams: '约 30g（鲜地黄汁）' }
    ],
    decoction: '上以水洗百合，渍一宿，当白沫出，去其水，更以泉水二升，煎取一升，去滓，内地黄汁，煎取一升五合，分温再服。中病，勿更服。大便当如漆。',
    pattern: ['意欲食复不能食', '欲卧不能卧', '欲行不能行', '口苦小便赤', '脉微数'],
    indicators: [
      { id: 'insomnia', w: 2 },
      { id: 'depression', w: 3 },
      { id: 'fatigue', w: 2 },
      { id: 'bitter_mouth', w: 2 },
      { id: 'dark_urine', w: 1 },
      { id: 'poor_appetite', w: 2 },
      { id: 'anxiety', w: 1 },
      { id: 'pulse_rapid', w: 1 }
    ],
    contra: [{ id: 'loose_stool', w: 2 }, { id: 'cold_limbs', w: 1 }],
    clauses: [
      {
        ref: '《金匮要略·百合狐惑阴阳毒病脉证并治》',
        text: '百合病，不经吐、下、发汗，病形如初者，百合地黄汤主之。'
      }
    ],
    modern: { terms: ['Baihe Dihuang Tang'], conditions: ['depression', 'anxiety', 'insomnia'] },
    safety: ['生地黄滑肠，脾虚便溏者慎用', '服后大便色黑如漆属正常反应，若便血需停药就医']
  },
  {
    id: 'gancao_xiexin_tang',
    name: '甘草泻心汤',
    source: '《金匮要略·百合狐惑阴阳毒病脉证并治》',
    six: '杂病',
    composition: [
      { herb: '甘草', liang: 4, prep: '炙' },
      { herb: '黄芩', liang: 3 },
      { herb: '人参', liang: 3 },
      { herb: '干姜', liang: 3 },
      { herb: '黄连', liang: 1 },
      { herb: '大枣', count: 12, unit: '枚', prep: '擘' },
      { herb: '半夏', text: '半升', grams: '约 9g', prep: '洗' }
    ],
    decoction: '上七味，以水一斗，煮取六升，去滓，再煎取三升，温服一升，日三服。',
    pattern: ['状如伤寒', '默默欲眠', '目不得闭', '卧起不安', '不欲饮食', '恶闻食臭'],
    indicators: [
      { id: 'lethargy', w: 2 },
      { id: 'insomnia', w: 2 },
      { id: 'restlessness', w: 2 },
      { id: 'poor_appetite', w: 2 },
      { id: 'nausea', w: 1 },
      { id: 'sore_throat', w: 1 },
      { id: 'epigastric_distention', w: 2 },
      { id: 'diarrhea', w: 1 }
    ],
    contra: [{ id: 'cold_limbs', w: 1 }],
    clauses: [
      {
        ref: '《金匮要略·百合狐惑阴阳毒病脉证并治》',
        text: '狐惑之为病，状如伤寒，默默欲眠，目不得闭，卧起不安，蚀于喉为惑，蚀于阴为狐，不欲饮食，恶闻食臭，其面目乍赤、乍黑、乍白。蚀于上部则声喝，甘草泻心汤主之。'
      }
    ],
    modern: { terms: ['Gancao Xiexin Tang'], conditions: ['Behcet disease', 'oral ulcer', 'inflammatory bowel disease'] },
    safety: ['本方与《伤寒论》甘草泻心汤组成略异（此方有人参）', '甘草用量大，高血压、水肿者减量', '口腔/外阴溃烂需先排除其他疾病']
  },
  {
    id: 'shengma_biejia_tang',
    name: '升麻鳖甲汤',
    source: '《金匮要略·百合狐惑阴阳毒病脉证并治》',
    six: '杂病',
    composition: [
      { herb: '升麻', liang: 2 },
      { herb: '当归', liang: 1 },
      { herb: '蜀椒', liang: 1, prep: '炒去汗' },
      { herb: '甘草', liang: 2 },
      { herb: '鳖甲', text: '手指大一片', grams: '约 9g', prep: '炙' },
      { herb: '雄黄', text: '半两', grams: '约 1.5g', prep: '研' }
    ],
    decoction: '上六味，以水四升，煮取一升，顿服之，老小再服，取汗。',
    pattern: ['面赤斑斑如锦文', '咽喉痛', '唾脓血'],
    indicators: [
      { id: 'sore_throat', w: 3 },
      { id: 'fever', w: 2 },
      { id: 'bleeding', w: 1 },
      { id: 'yellow_sputum', w: 1 },
      { id: 'restlessness', w: 1 },
      { id: 'pulse_rapid', w: 1 }
    ],
    contra: [{ id: 'cold_limbs', w: 1 }, { id: 'pulse_weak', w: 1 }],
    clauses: [
      {
        ref: '《金匮要略·百合狐惑阴阳毒病脉证并治》',
        text: '阳毒之为病，面赤斑斑如锦文，咽喉痛，唾脓血，五日可治，七日不可治，升麻鳖甲汤主之。'
      }
    ],
    modern: { terms: ['Shengma Biejia Tang'], conditions: ['systemic lupus erythematosus', 'thrombocytopenia'] },
    safety: ['雄黄含砷，有毒，现代多不用或以他药代之，切勿自行服用', '蜀椒辛热，阴虚火旺者禁用', '孕妇禁用']
  },

  // ── 疟病 ──────────────────────────────────────────────
  {
    id: 'baihu_jia_guizhi_tang',
    name: '白虎加桂枝汤',
    source: '《金匮要略·疟病脉证并治》',
    six: '杂病',
    composition: [
      { herb: '知母', liang: 6 },
      { herb: '甘草', liang: 2, prep: '炙' },
      { herb: '石膏', text: '一斤', grams: '48g', prep: '碎，绵裹' },
      { herb: '粳米', text: '二合', grams: '约 10g' },
      { herb: '桂枝', liang: 3, prep: '去皮' }
    ],
    decoction: '上五味，以水一斗，煮米熟汤成，去滓，温服一升，日三服。',
    pattern: ['温疟', '身无寒但热', '骨节疼烦', '时呕', '脉如平'],
    indicators: [
      { id: 'fever', w: 3 },
      { id: 'joint_pain', w: 2 },
      { id: 'nausea', w: 1 },
      { id: 'thirst_cold', w: 2 },
      { id: 'profuse_sweat', w: 1 },
      { id: 'no_fever', w: 0 }
    ].filter((i) => i.w > 0),
    contra: [{ id: 'chill_body', w: 2 }, { id: 'pulse_weak', w: 1 }],
    clauses: [
      {
        ref: '《金匮要略·疟病脉证并治》',
        text: '温疟者，其脉如平，身无寒但热，骨节疼烦，时呕，白虎加桂枝汤主之。'
      }
    ],
    modern: { terms: ['Baihu Jia Guizhi Tang'], conditions: ['malaria', 'fever', 'arthritis'] },
    safety: ['表寒无汗者不宜', '石膏大寒，脾胃虚寒者慎用', '疟疾需规范抗疟治疗，本方不可替代']
  },

  // ── 中风历节病 ────────────────────────────────────────
  {
    id: 'guizhi_shaoyao_zhimu_tang',
    name: '桂枝芍药知母汤',
    source: '《金匮要略·中风历节病脉证并治》',
    six: '杂病',
    composition: [
      { herb: '桂枝', liang: 4, prep: '去皮' },
      { herb: '芍药', liang: 3 },
      { herb: '甘草', liang: 2, prep: '炙' },
      { herb: '麻黄', liang: 2, prep: '去节' },
      { herb: '生姜', liang: 5, prep: '切' },
      { herb: '白术', liang: 5 },
      { herb: '知母', liang: 4 },
      { herb: '防风', liang: 4 },
      { herb: '附子', count: 2, unit: '枚', prep: '炮' }
    ],
    decoction: '上九味，以水七升，煮取二升，温服七合，日三服。',
    pattern: ['诸肢节疼痛', '身体尪羸', '脚肿如脱', '头眩短气', '温温欲吐'],
    indicators: [
      { id: 'joint_pain', w: 3 },
      { id: 'edema', w: 2 },
      { id: 'dizziness', w: 1 },
      { id: 'short_breath', w: 1 },
      { id: 'nausea', w: 1 },
      { id: 'cold_limbs', w: 1 },
      { id: 'weight_loss', w: 1 },
      { id: 'pulse_deep', w: 1 }
    ],
    contra: [{ id: 'fever', w: 1 }, { id: 'thirst_cold', w: 1 }],
    clauses: [
      {
        ref: '《金匮要略·中风历节病脉证并治》',
        text: '诸肢节疼痛，身体尪羸，脚肿如脱，头眩短气，温温欲吐，桂枝芍药知母汤主之。'
      }
    ],
    modern: { terms: ['Guizhi Shaoyao Zhimu Tang'], conditions: ['rheumatoid arthritis', 'osteoarthritis'] },
    safety: ['附子炮制先煎；麻黄慎用于高血压、心脏病', '关节红肿灼热之湿热痹不宜']
  },
  {
    id: 'wutou_tang',
    name: '乌头汤',
    source: '《金匮要略·中风历节病脉证并治》',
    six: '杂病',
    composition: [
      { herb: '麻黄', liang: 3, prep: '去节' },
      { herb: '芍药', liang: 3 },
      { herb: '黄芪', liang: 3 },
      { herb: '甘草', liang: 3, prep: '炙' },
      { herb: '川乌', count: 5, unit: '枚', prep: '㕮咀，以蜜二升煎取一升，即出乌头' }
    ],
    decoction: '上五味，㕮咀四味，以水三升，煮取一升，去滓，内蜜煎中，更煎之，服七合。不知，尽服之。',
    pattern: ['历节疼痛', '不可屈伸', '痛处固定', '脉沉紧'],
    indicators: [
      { id: 'joint_pain', w: 3 },
      { id: 'spasm', w: 2 },
      { id: 'cold_limbs', w: 2 },
      { id: 'chill_body', w: 1 },
      { id: 'pulse_tight', w: 1 },
      { id: 'pulse_deep', w: 1 },
      { id: 'numbness', w: 1 }
    ],
    contra: [{ id: 'fever', w: 2 }, { id: 'pulse_rapid', w: 1 }, { id: 'thirst_cold', w: 1 }],
    clauses: [
      {
        ref: '《金匮要略·中风历节病脉证并治》',
        text: '病历节不可屈伸，疼痛，乌头汤主之。'
      }
    ],
    modern: { terms: ['Wutou Tang'], conditions: ['rheumatoid arthritis', 'sciatica'] },
    safety: [
      '乌头有大毒：必须用制川乌，先煎 1–2 小时，口尝无麻感方可服；不可与半夏、瓜蒌、贝母、白蔹、白及同用',
      '出现口舌麻木、心悸、呕吐立即停药急诊',
      '孕妇禁用；不可擅自加大剂量'
    ]
  },
  {
    id: 'dahuang_zhechong_wan',
    name: '大黄䗪虫丸',
    source: '《金匮要略·血痹虚劳病脉证并治》',
    doseBasis: 'ratio',
    six: '杂病',
    composition: [
      { herb: '大黄', text: '十分', grams: '约 30g', prep: '蒸' },
      { herb: '黄芩', liang: 2 },
      { herb: '甘草', liang: 3 },
      { herb: '桃仁', text: '一升', grams: '约 15g' },
      { herb: '杏仁', text: '一升', grams: '约 15g' },
      { herb: '芍药', liang: 4 },
      { herb: '干地黄', text: '十两', grams: '30g' },
      { herb: '干漆', liang: 1 },
      { herb: '虻虫', text: '一升', grams: '约 6g' },
      { herb: '水蛭', count: 100, unit: '枚' },
      { herb: '蛴螬', text: '一升', grams: '约 6g' },
      { herb: '䗪虫', text: '半升', grams: '约 6g' }
    ],
    decoction: '上十二味，末之，炼蜜和丸小豆大，酒饮服五丸，日三服。现代：每服 3–6g，日 1–2 次，需医师指导。',
    pattern: ['五劳虚极羸瘦', '腹满不能饮食', '肌肤甲错', '两目黯黑', '内有干血'],
    indicators: [
      { id: 'weight_loss', w: 3 },
      { id: 'abdominal_fullness', w: 2 },
      { id: 'poor_appetite', w: 2 },
      { id: 'tongue_purple', w: 2 },
      { id: 'menstrual', w: 2 },
      { id: 'mass_abdomen', w: 1 },
      { id: 'fatigue', w: 1 }
    ],
    contra: [{ id: 'bleeding', w: 3 }, { id: 'pulse_weak', w: 2 }, { id: 'loose_stool', w: 1 }],
    clauses: [
      {
        ref: '《金匮要略·血痹虚劳病脉证并治》',
        text: '五劳虚极羸瘦，腹满不能饮食，食伤、忧伤、饮伤、房室伤、饥伤、劳伤、经络营卫气伤，内有干血，肌肤甲错，两目黯黑。缓中补虚，大黄䗪虫丸主之。'
      }
    ],
    modern: { terms: ['Dahuang Zhechong Wan'], conditions: ['liver cirrhosis', 'uterine fibroids', 'endometriosis'] },
    safety: ['破血逐瘀之峻剂：孕妇禁用、出血倾向者禁用、体虚者慎用', '含虫类药，过敏体质慎用', '须在医师指导下使用']
  },

  // ── 名录条目（待补原文） ──────────────────────────────
  {
    id: 'biejia_jian_wan',
    name: '鳖甲煎丸',
    source: '《金匮要略·疟病脉证并治》',
    six: '杂病',
    verified: false,
    summary: '疟母（疟久不愈，胁下痞硬成块）',
    pattern: ['疟母', '胁下痞硬', '腹中包块'],
    composition: [
      { herb: '鳖甲' },
      { herb: '乌扇' },
      { herb: '黄芩' },
      { herb: '柴胡' },
      { herb: '鼠妇' },
      { herb: '干姜' },
      { herb: '大黄' },
      { herb: '桂枝' },
      { herb: '石韦' },
      { herb: '厚朴' },
      { herb: '紫葳' },
      { herb: '半夏' },
      { herb: '人参' },
      { herb: '䗪虫' },
      { herb: '阿胶' },
      { herb: '蜂窠' },
      { herb: '赤硝' },
      { herb: '蜣螂' },
      { herb: '桃仁' },
      { herb: '葶苈子' },
      { herb: '牡丹皮' },
      { herb: '芍药' },
      { herb: '瞿麦' }
    ]
  },
  {
    id: 'fangji_dihuang_tang',
    name: '防己地黄汤',
    source: '《金匮要略·中风历节病脉证并治》',
    six: '杂病',
    verified: false,
    summary: '中风（病如狂状，妄行，独语不休，无寒热）',
    pattern: ['如狂', '妄行独语', '无寒热'],
    composition: [
      { herb: '防己' },
      { herb: '桂枝' },
      { herb: '防风' },
      { herb: '甘草' },
      { herb: '生地黄' }
    ]
  },
  {
    id: 'shuyu_wan',
    name: '薯蓣丸',
    source: '《金匮要略·血痹虚劳病脉证并治》',
    six: '杂病',
    verified: false,
    summary: '虚劳诸不足，风气百疾',
    pattern: ['虚劳', '风气百疾', '羸瘦'],
    composition: [
      { herb: '薯蓣' },
      { herb: '当归' },
      { herb: '桂枝' },
      { herb: '干地黄' },
      { herb: '曲' },
      { herb: '大豆黄卷' },
      { herb: '甘草' },
      { herb: '人参' },
      { herb: '阿胶' },
      { herb: '川芎' },
      { herb: '芍药' },
      { herb: '白术' },
      { herb: '麦门冬' },
      { herb: '杏仁' },
      { herb: '柴胡' },
      { herb: '桔梗' },
      { herb: '茯苓' },
      { herb: '干姜' },
      { herb: '白蔹' },
      { herb: '防风' },
      { herb: '大枣' }
    ]
  },
  {
    id: 'tianxiong_san',
    name: '天雄散',
    source: '《金匮要略·血痹虚劳病脉证并治》',
    six: '杂病',
    verified: false,
    summary: '虚劳失精，腰膝冷痛',
    pattern: ['失精', '腰膝冷痛'],
    composition: [{ herb: '天雄' }, { herb: '白术' }, { herb: '桂枝' }, { herb: '龙骨' }]
  }
]
