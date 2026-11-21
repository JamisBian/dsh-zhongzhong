// 经方库 · 太阴 / 少阴 / 厥阴 及《金匮要略》杂病方

export const YIN_AND_MISC_FORMULAS = [
  // ── 太阴 ──────────────────────────────────────────────
  {
    id: 'lizhong_tang',
    name: '理中丸（汤）',
    alias: '人参汤',
    source: '《伤寒论·辨霍乱病脉证并治》',
    six: '太阴',
    composition: [
      { herb: '人参', liang: 3 },
      { herb: '干姜', liang: 3 },
      { herb: '甘草', liang: 3, prep: '炙' },
      { herb: '白术', liang: 3 }
    ],
    decoction: '上四味，捣筛，蜜和为丸，如鸡子黄许大，以沸汤数合和一丸，研碎，温服之，日三四服，夜二服。现代：水煎，分二次温服；或蜜丸每服 9g。',
    pattern: ['腹满而吐', '食不下', '自利益甚', '时腹自痛', '口不渴'],
    indicators: [
      { id: 'diarrhea', w: 3 },
      { id: 'loose_stool', w: 2 },
      { id: 'abdominal_pain', w: 2 },
      { id: 'vomiting', w: 2 },
      { id: 'poor_appetite', w: 2 },
      { id: 'chill_body', w: 2 },
      { id: 'cold_limbs', w: 1 },
      { id: 'clear_urine', w: 1 },
      { id: 'tongue_pale', w: 2 },
      { id: 'pulse_slow', w: 1 },
      { id: 'pulse_deep', w: 1 }
    ],
    contra: [{ id: 'thirst_cold', w: 2 }, { id: 'yellow_sputum', w: 1 }, { id: 'fever', w: 1 }],
    clauses: [
      {
        ref: '《伤寒论·辨霍乱病脉证并治》第386条',
        text: '霍乱，头痛发热，身疼痛，热多欲饮水者，五苓散主之；寒多不用水者，理中丸主之。'
      },
      {
        ref: '《伤寒论·辨太阴病脉证并治》第273条',
        text: '太阴之为病，腹满而吐，食不下，自利益甚，时腹自痛。若下之，必胸下结硬。'
      }
    ],
    modern: { terms: ['Lizhong Wan', 'Rikyu-to'], conditions: ['diarrhea', 'irritable bowel syndrome', 'gastritis'] },
    safety: ['湿热、实热证禁用', '阴虚津伤者慎用']
  },
  {
    id: 'xiao_jianzhong_tang',
    name: '小建中汤',
    source: '《伤寒论·辨太阳病脉证并治中》',
    six: '太阴',
    composition: [
      { herb: '桂枝', liang: 3, prep: '去皮' },
      { herb: '甘草', liang: 2, prep: '炙' },
      { herb: '大枣', count: 12, unit: '枚', prep: '擘' },
      { herb: '芍药', liang: 6 },
      { herb: '生姜', liang: 3, prep: '切' },
      { herb: '胶饴', text: '一升', grams: '约 30g' }
    ],
    decoction: '上六味，以水七升，煮取三升，去滓，内饴，更上微火消解，温服一升，日三服。呕家不可用建中汤，以甜故也。',
    pattern: ['腹中急痛', '喜温喜按', '心悸而烦', '虚劳里急'],
    indicators: [
      { id: 'abdominal_pain', w: 3 },
      { id: 'palpitation', w: 2 },
      { id: 'fatigue', w: 2 },
      { id: 'spasm', w: 2 },
      { id: 'poor_appetite', w: 1 },
      { id: 'weight_loss', w: 1 },
      { id: 'pulse_wiry', w: 1 },
      { id: 'pulse_thin', w: 1 }
    ],
    contra: [{ id: 'nausea', w: 1 }, { id: 'coat_yellow_greasy', w: 1 }],
    clauses: [
      {
        ref: '《伤寒论·辨太阳病脉证并治中》第100条',
        text: '伤寒，阳脉涩，阴脉弦，法当腹中急痛，先与小建中汤；不差者，小柴胡汤主之。'
      },
      {
        ref: '《伤寒论·辨太阳病脉证并治中》第102条',
        text: '伤寒二三日，心中悸而烦者，小建中汤主之。'
      }
    ],
    modern: { terms: ['Xiao Jianzhong Tang', 'Shokenchuto'], conditions: ['peptic ulcer', 'functional abdominal pain', 'malnutrition'] },
    safety: ['呕家、糖尿病患者慎用（含饴糖）', '湿热中阻者禁用']
  },
  {
    id: 'wuzhuyu_tang',
    name: '吴茱萸汤',
    source: '《伤寒论·辨阳明病脉证并治》',
    six: '太阴',
    composition: [
      { herb: '吴茱萸', text: '一升', grams: '约 9g', prep: '洗' },
      { herb: '人参', liang: 3 },
      { herb: '生姜', liang: 6, prep: '切' },
      { herb: '大枣', count: 12, unit: '枚', prep: '擘' }
    ],
    decoction: '上四味，以水七升，煮取二升，去滓，温服七合，日三服。',
    pattern: ['食谷欲呕', '干呕吐涎沫', '头痛', '手足逆冷', '烦躁欲死'],
    indicators: [
      { id: 'vomiting', w: 3 },
      { id: 'headache', w: 2 },
      { id: 'cold_limbs', w: 2 },
      { id: 'chill_body', w: 2 },
      { id: 'nausea', w: 2 },
      { id: 'dizziness', w: 1 },
      { id: 'diarrhea', w: 1 },
      { id: 'restlessness', w: 1 }
    ],
    contra: [{ id: 'thirst_cold', w: 1 }, { id: 'tongue_red', w: 1 }],
    clauses: [
      {
        ref: '《伤寒论·辨阳明病脉证并治》第243条',
        text: '食谷欲呕，属阳明也，吴茱萸汤主之。得汤反剧者，属上焦也。'
      },
      {
        ref: '《伤寒论·辨少阴病脉证并治》第309条',
        text: '少阴病，吐利，手足逆冷，烦躁欲死者，吴茱萸汤主之。'
      }
    ],
    modern: { terms: ['Wuzhuyu Tang', 'Goshuyu-to'], conditions: ['migraine', 'nausea', 'vertigo'] },
    safety: ['吴茱萸有小毒，用量不宜过大，宜洗后用', '胃热呕吐、肝阳上亢头痛禁用', '孕妇慎用']
  },

  // ── 少阴 ──────────────────────────────────────────────
  {
    id: 'sini_tang',
    name: '四逆汤',
    source: '《伤寒论·辨少阴病脉证并治》',
    six: '少阴',
    composition: [
      { herb: '附子', count: 1, unit: '枚', prep: '生用，去皮，破八片' },
      { herb: '干姜', liang: 1.5 },
      { herb: '甘草', liang: 2, prep: '炙' }
    ],
    decoction: '上三味，以水三升，煮取一升二合，去滓，分温再服。强人可大附子一枚、干姜三两。',
    pattern: ['四肢厥逆', '下利清谷', '恶寒蜷卧', '脉微欲绝'],
    indicators: [
      { id: 'cold_limbs', w: 3 },
      { id: 'diarrhea', w: 3 },
      { id: 'chill_body', w: 3 },
      { id: 'pulse_weak', w: 3 },
      { id: 'lethargy', w: 2 },
      { id: 'pulse_deep', w: 2 },
      { id: 'tongue_pale', w: 2 },
      { id: 'clear_urine', w: 1 },
      { id: 'vomiting', w: 1 }
    ],
    contra: [{ id: 'fever', w: 2 }, { id: 'thirst_cold', w: 2 }, { id: 'tongue_red', w: 2 }],
    clauses: [
      {
        ref: '《伤寒论·辨少阴病脉证并治》第323条',
        text: '少阴病，脉沉者，急温之，宜四逆汤。'
      }
    ],
    modern: { terms: ['Sini Tang', 'Shigyakuto'], conditions: ['septic shock', 'heart failure', 'hypothermia'] },
    safety: [
      '生附子有大毒：必须炮制并先煎 60 分钟以上，口尝无麻感方可服',
      '不可与半夏、瓜蒌、贝母、白蔹、白及同用（十八反）',
      '出现口舌麻木、心悸、恶心即停药就医',
      '本方为回阳救逆之剂，须在医师指导下使用'
    ]
  },
  {
    id: 'mahuang_fuzi_xixin_tang',
    name: '麻黄附子细辛汤',
    source: '《伤寒论·辨少阴病脉证并治》',
    six: '少阴',
    composition: [
      { herb: '麻黄', liang: 2, prep: '去节' },
      { herb: '细辛', liang: 2 },
      { herb: '附子', count: 1, unit: '枚', prep: '炮，去皮，破八片' }
    ],
    decoction: '上三味，以水一斗，先煮麻黄，减二升，去上沫，内诸药，煮取三升，去滓，温服一升，日三服。',
    pattern: ['始得之反发热', '脉沉', '恶寒', '但欲寐'],
    indicators: [
      { id: 'pulse_deep', w: 3 },
      { id: 'fever', w: 2 },
      { id: 'chill_body', w: 2 },
      { id: 'lethargy', w: 2 },
      { id: 'no_sweat', w: 1 },
      { id: 'cold_limbs', w: 1 },
      { id: 'fatigue', w: 1 },
      { id: 'tongue_pale', w: 1 }
    ],
    contra: [{ id: 'pulse_rapid', w: 2 }, { id: 'thirst_cold', w: 2 }],
    clauses: [
      {
        ref: '《伤寒论·辨少阴病脉证并治》第301条',
        text: '少阴病，始得之，反发热，脉沉者，麻黄附子细辛汤主之。'
      }
    ],
    modern: { terms: ['Mahuang Fuzi Xixin Tang', 'Mao-bushi-saishin-to'], conditions: ['common cold', 'bradycardia', 'allergic rhinitis'] },
    safety: ['附子先煎，细辛久煎（细辛用量不宜过大）', '高血压、心脏病者慎用麻黄', '阴虚火旺、痰热者禁用']
  },
  {
    id: 'zhenwu_tang',
    name: '真武汤',
    source: '《伤寒论·辨少阴病脉证并治》',
    six: '少阴',
    composition: [
      { herb: '茯苓', liang: 3 },
      { herb: '芍药', liang: 3 },
      { herb: '生姜', liang: 3, prep: '切' },
      { herb: '白术', liang: 2 },
      { herb: '附子', count: 1, unit: '枚', prep: '炮，去皮，破八片' }
    ],
    decoction: '上五味，以水八升，煮取三升，去滓，温服七合，日三服。',
    pattern: ['小便不利', '四肢沉重疼痛', '腹痛下利', '心悸头眩', '身瞤动'],
    indicators: [
      { id: 'edema', w: 2 },
      { id: 'difficult_urine', w: 2 },
      { id: 'dizziness', w: 2 },
      { id: 'chill_body', w: 2 },
      { id: 'cold_limbs', w: 2 },
      { id: 'diarrhea', w: 2 },
      { id: 'heavy_body', w: 2 },
      { id: 'palpitation', w: 1 },
      { id: 'lethargy', w: 1 },
      { id: 'pulse_deep', w: 2 },
      { id: 'tongue_pale', w: 2 },
      { id: 'tongue_swollen', w: 1 }
    ],
    contra: [{ id: 'thirst_cold', w: 2 }, { id: 'pulse_rapid', w: 1 }, { id: 'coat_yellow_greasy', w: 1 }],
    clauses: [
      {
        ref: '《伤寒论·辨少阴病脉证并治》第316条',
        text: '少阴病，二三日不已，至四五日，腹痛，小便不利，四肢沉重疼痛，自下利者，此为有水气，其人或咳，或小便利，或下利，或呕者，真武汤主之。'
      }
    ],
    modern: { terms: ['Zhenwu Tang', 'Shinbu-to'], conditions: ['heart failure', 'edema', 'chronic kidney disease'] },
    safety: ['附子需炮制、先煎 60 分钟以上', '阴虚内热、湿热壅盛者禁用', '孕妇慎用']
  },
  {
    id: 'huanglian_ejiao_tang',
    name: '黄连阿胶汤',
    source: '《伤寒论·辨少阴病脉证并治》',
    six: '少阴',
    composition: [
      { herb: '黄连', liang: 4 },
      { herb: '黄芩', liang: 2 },
      { herb: '芍药', liang: 2 },
      { herb: '鸡子黄', count: 2, unit: '枚' },
      { herb: '阿胶', liang: 3 }
    ],
    decoction: '上五味，以水六升，先煮三物，取二升，去滓，内胶烊尽，小冷，内鸡子黄，搅令相得，温服七合，日三服。',
    pattern: ['心中烦', '不得卧', '舌红少苔', '脉细数'],
    indicators: [
      { id: 'insomnia', w: 3 },
      { id: 'irritability', w: 3 },
      { id: 'restlessness', w: 2 },
      { id: 'dry_mouth', w: 2 },
      { id: 'hot_palms', w: 2 },
      { id: 'tongue_red', w: 2 },
      { id: 'pulse_thin', w: 2 },
      { id: 'pulse_rapid', w: 2 },
      { id: 'coat_none', w: 1 }
    ],
    contra: [{ id: 'tongue_pale', w: 2 }, { id: 'loose_stool', w: 1 }, { id: 'chill_body', w: 1 }],
    clauses: [
      {
        ref: '《伤寒论·辨少阴病脉证并治》第303条',
        text: '少阴病，得之二三日以上，心中烦，不得卧，黄连阿胶汤主之。'
      }
    ],
    modern: { terms: ['Huanglian Ejiao Tang'], conditions: ['insomnia', 'anxiety', 'menopausal syndrome'] },
    safety: ['脾胃虚寒、便溏者禁用', '黄连苦寒，不宜久服', '阿胶滋腻，消化不良者慎用']
  },
  {
    id: 'zhuling_tang',
    name: '猪苓汤',
    source: '《伤寒论·辨阳明病脉证并治》',
    six: '少阴',
    composition: [
      { herb: '猪苓', liang: 1, prep: '去皮' },
      { herb: '茯苓', liang: 1 },
      { herb: '泽泻', liang: 1 },
      { herb: '阿胶', liang: 1 },
      { herb: '滑石', liang: 1, prep: '碎' }
    ],
    decoction: '上五味，以水四升，先煮四味，取二升，去滓，内阿胶烊消，温服七合，日三服。',
    pattern: ['小便不利', '发热口渴', '心烦不眠', '或下利'],
    indicators: [
      { id: 'difficult_urine', w: 3 },
      { id: 'thirst', w: 2 },
      { id: 'insomnia', w: 2 },
      { id: 'irritability', w: 2 },
      { id: 'dark_urine', w: 2 },
      { id: 'fever', w: 1 },
      { id: 'vomiting', w: 1 },
      { id: 'pulse_float', w: 1 }
    ],
    contra: [{ id: 'cold_limbs', w: 1 }, { id: 'clear_urine', w: 1 }],
    clauses: [
      {
        ref: '《伤寒论·辨阳明病脉证并治》第223条',
        text: '若脉浮发热，渴欲饮水，小便不利者，猪苓汤主之。'
      },
      {
        ref: '《伤寒论·辨少阴病脉证并治》第319条',
        text: '少阴病，下利六七日，咳而呕渴，心烦不得眠者，猪苓汤主之。'
      }
    ],
    modern: { terms: ['Zhuling Tang', 'Chorei-to'], conditions: ['urinary tract infection', 'urolithiasis'] },
    safety: ['阴虚而无水湿者不宜', '孕妇慎用滑石']
  },

  // ── 厥阴 ──────────────────────────────────────────────
  {
    id: 'wumei_wan',
    name: '乌梅丸',
    source: '《伤寒论·辨厥阴病脉证并治》',
    doseBasis: 'ratio',
    six: '厥阴',
    composition: [
      { herb: '乌梅', count: 300, unit: '枚' },
      { herb: '细辛', liang: 6 },
      { herb: '干姜', liang: 10 },
      { herb: '黄连', text: '一斤', grams: '48g' },
      { herb: '当归', liang: 4 },
      { herb: '附子', liang: 6, prep: '炮，去皮' },
      { herb: '蜀椒', liang: 4, prep: '出汗' },
      { herb: '桂枝', liang: 6, prep: '去皮' },
      { herb: '人参', liang: 6 },
      { herb: '黄柏', liang: 6 }
    ],
    decoction: '上十味，异捣筛，合治之，以苦酒渍乌梅一宿，去核，蒸之五斗米下，饭熟，捣成泥，和药令相得，内臼中，与蜜杵二千下，丸如梧桐子大，先食饮服十丸，日三服，稍加至二十丸。现代：作丸或水煎服，需医师指导。',
    pattern: ['蛔厥', '腹痛时作', '手足厥冷', '久利不止', '寒热错杂'],
    indicators: [
      { id: 'cold_limbs', w: 2 },
      { id: 'diarrhea', w: 2 },
      { id: 'abdominal_pain', w: 2 },
      { id: 'vomiting', w: 2 },
      { id: 'restlessness', w: 1 },
      { id: 'alternating', w: 1 },
      { id: 'fatigue', w: 1 }
    ],
    contra: [{ id: 'fever', w: 1 }, { id: 'thirst_cold', w: 1 }],
    clauses: [
      {
        ref: '《伤寒论·辨厥阴病脉证并治》第338条',
        text: '伤寒脉微而厥，至七八日肤冷，其人躁无暂安时者，此为脏厥，非蛔厥也。蛔厥者，其人当吐蛔……乌梅丸主之。又主久利。'
      }
    ],
    modern: { terms: ['Wumei Wan', 'Ubaigan'], conditions: ['irritable bowel syndrome', 'chronic diarrhea', 'biliary colic'] },
    safety: ['含附子、细辛、蜀椒，毒性药需严格炮制与剂量控制', '孕妇禁用', '须在医师指导下使用']
  },
  {
    id: 'danggui_sini_tang',
    name: '当归四逆汤',
    source: '《伤寒论·辨厥阴病脉证并治》',
    six: '厥阴',
    composition: [
      { herb: '当归', liang: 3 },
      { herb: '桂枝', liang: 3, prep: '去皮' },
      { herb: '芍药', liang: 3 },
      { herb: '细辛', liang: 3 },
      { herb: '甘草', liang: 2, prep: '炙' },
      { herb: '通草', liang: 2 },
      { herb: '大枣', count: 25, unit: '枚', prep: '擘' }
    ],
    decoction: '上七味，以水八升，煮取三升，去滓，温服一升，日三服。',
    pattern: ['手足厥寒', '脉细欲绝', '肢端麻木', '寒凝痛经'],
    indicators: [
      { id: 'cold_limbs', w: 3 },
      { id: 'pulse_thin', w: 3 },
      { id: 'numbness', w: 2 },
      { id: 'dysmenorrhea', w: 2 },
      { id: 'joint_pain', w: 1 },
      { id: 'chill_body', w: 1 },
      { id: 'tongue_pale', w: 1 }
    ],
    contra: [{ id: 'pulse_rapid', w: 1 }, { id: 'thirst_cold', w: 1 }],
    clauses: [
      {
        ref: '《伤寒论·辨厥阴病脉证并治》第351条',
        text: '手足厥寒，脉细欲绝者，当归四逆汤主之。'
      }
    ],
    modern: { terms: ['Danggui Sini Tang', 'Toki-shigyakuto'], conditions: ['Raynaud disease', 'dysmenorrhea', 'diabetic neuropathy'] },
    safety: ['细辛久煎，用量不宜过大', '热厥（胸腹灼热、口渴）禁用']
  },
  {
    id: 'baitouweng_tang',
    name: '白头翁汤',
    source: '《伤寒论·辨厥阴病脉证并治》',
    six: '厥阴',
    composition: [
      { herb: '白头翁', liang: 2 },
      { herb: '黄柏', liang: 3 },
      { herb: '黄连', liang: 3 },
      { herb: '秦皮', liang: 3 }
    ],
    decoction: '上四味，以水七升，煮取二升，去滓，温服一升。不愈，更服一升。',
    pattern: ['热利下重', '下利欲饮水', '大便脓血', '腹痛里急'],
    indicators: [
      { id: 'diarrhea', w: 3 },
      { id: 'mucus_stool', w: 3 },
      { id: 'fever', w: 2 },
      { id: 'thirst', w: 1 },
      { id: 'dark_urine', w: 1 },
      { id: 'pulse_rapid', w: 1 },
      { id: 'tongue_red', w: 1 },
      { id: 'coat_yellow', w: 1 }
    ],
    contra: [{ id: 'cold_limbs', w: 2 }, { id: 'tongue_pale', w: 2 }, { id: 'clear_urine', w: 1 }],
    clauses: [
      {
        ref: '《伤寒论·辨厥阴病脉证并治》第371条',
        text: '热利下重者，白头翁汤主之。'
      }
    ],
    modern: { terms: ['Baitouweng Tang', 'Hakuto-o-to'], conditions: ['ulcerative colitis', 'bacillary dysentery'] },
    safety: ['虚寒下利禁用', '苦寒败胃，中病即止', '孕妇慎用']
  },

  // ── 杂病（《金匮要略》） ───────────────────────────────
  {
    id: 'suanzaoren_tang',
    name: '酸枣仁汤',
    source: '《金匮要略·血痹虚劳病脉证并治》',
    six: '杂病',
    composition: [
      { herb: '酸枣仁', text: '二升', grams: '约 30g' },
      { herb: '甘草', liang: 1 },
      { herb: '知母', liang: 2 },
      { herb: '茯苓', liang: 2 },
      { herb: '川芎', liang: 2 }
    ],
    decoction: '上五味，以水八升，煮酸枣仁得六升，内诸药，煮取三升，分温三服。',
    pattern: ['虚烦不得眠', '心悸盗汗', '头目眩晕', '咽干口燥'],
    indicators: [
      { id: 'insomnia', w: 3 },
      { id: 'restlessness', w: 2 },
      { id: 'palpitation', w: 1 },
      { id: 'night_sweat', w: 1 },
      { id: 'dizziness', w: 1 },
      { id: 'fatigue', w: 1 },
      { id: 'pulse_thin', w: 1 }
    ],
    contra: [{ id: 'coat_yellow_greasy', w: 1 }],
    clauses: [
      {
        ref: '《金匮要略·血痹虚劳病脉证并治》',
        text: '虚劳虚烦不得眠，酸枣仁汤主之。'
      }
    ],
    modern: { terms: ['Suanzaoren Tang', 'Sansoninto'], conditions: ['insomnia', 'anxiety'] },
    safety: ['痰热、食积所致的失眠不宜', '孕妇慎用川芎']
  },
  {
    id: 'ganmai_dazao_tang',
    name: '甘麦大枣汤',
    source: '《金匮要略·妇人杂病脉证并治》',
    six: '杂病',
    composition: [
      { herb: '甘草', liang: 3 },
      { herb: '小麦', text: '一升', grams: '约 30g' },
      { herb: '大枣', count: 10, unit: '枚' }
    ],
    decoction: '上三味，以水六升，煮取三升，温分三服。亦补脾气。',
    pattern: ['喜悲伤欲哭', '象如神灵所作', '数欠伸', '脏躁'],
    indicators: [
      { id: 'depression', w: 3 },
      { id: 'anxiety', w: 2 },
      { id: 'insomnia', w: 1 },
      { id: 'irritability', w: 1 },
      { id: 'fatigue', w: 1 }
    ],
    contra: [{ id: 'coat_yellow_greasy', w: 1 }],
    clauses: [
      {
        ref: '《金匮要略·妇人杂病脉证并治》',
        text: '妇人脏躁，喜悲伤欲哭，象如神灵所作，数欠伸，甘麦大枣汤主之。'
      }
    ],
    modern: { terms: ['Ganmai Dazao Tang', 'Kanbaku-taiso-to'], conditions: ['depression', 'menopausal syndrome', 'anxiety'] },
    safety: ['痰火扰心者不宜', '糖尿病者慎用（含大枣、小麦）']
  },
  {
    id: 'banxia_houpo_tang',
    name: '半夏厚朴汤',
    source: '《金匮要略·妇人杂病脉证并治》',
    six: '杂病',
    composition: [
      { herb: '半夏', text: '一升', grams: '约 12g', prep: '洗' },
      { herb: '厚朴', liang: 3 },
      { herb: '茯苓', liang: 4 },
      { herb: '生姜', liang: 5, prep: '切' },
      { herb: '苏叶', liang: 2 }
    ],
    decoction: '上五味，以水七升，煮取四升，分温四服，日三夜一服。',
    pattern: ['咽中如有炙脔', '咯之不出咽之不下', '胸胁满闷', '梅核气'],
    indicators: [
      { id: 'throat_globus', w: 3 },
      { id: 'chest_oppression', w: 2 },
      { id: 'nausea', w: 1 },
      { id: 'anxiety', w: 1 },
      { id: 'cough', w: 1 },
      { id: 'belching', w: 1 }
    ],
    contra: [{ id: 'thirst_cold', w: 1 }, { id: 'tongue_red', w: 1 }],
    clauses: [
      {
        ref: '《金匮要略·妇人杂病脉证并治》',
        text: '妇人咽中如有炙脔，半夏厚朴汤主之。'
      }
    ],
    modern: { terms: ['Banxia Houpo Tang', 'Hange-koboku-to'], conditions: ['globus hystericus', 'anxiety', 'gastroesophageal reflux'] },
    safety: ['阴虚津伤、咽干少津者慎用', '孕妇慎用半夏']
  },
  {
    id: 'guizhi_fuling_wan',
    name: '桂枝茯苓丸',
    source: '《金匮要略·妇人妊娠病脉证并治》',
    doseBasis: 'ratio',
    six: '杂病',
    composition: [
      { herb: '桂枝', liang: 1 },
      { herb: '茯苓', liang: 1 },
      { herb: '牡丹皮', liang: 1 },
      { herb: '桃仁', liang: 1, prep: '去皮尖，熬' },
      { herb: '芍药', liang: 1 }
    ],
    decoction: '上五味，末之，炼蜜和丸，如兔屎大，每日食前服一丸，不知，加至三丸。现代：每服 6–9g，日 1–2 次。',
    pattern: ['少腹癥块', '按之痛', '经行腹痛', '漏下不止'],
    indicators: [
      { id: 'lower_abdomen', w: 3 },
      { id: 'mass_abdomen', w: 2 },
      { id: 'tongue_purple', w: 2 },
      { id: 'pulse_rough', w: 1 },
      { id: 'dysmenorrhea', w: 1 },
      { id: 'menstrual', w: 1 },
      { id: 'difficult_urine', w: 1 },
      { id: 'frequent_urine', w: 1 },
      { id: 'bleeding', w: 1 }
    ],
    contra: [{ id: 'pulse_weak', w: 1 }, { id: 'bleeding', w: 1 }],
    clauses: [
      {
        ref: '《金匮要略·妇人妊娠病脉证并治》',
        text: '妇人宿有癥病，经断未及三月，而得漏下不止，胎动在脐上者，为癥痼害……所以血不止者，其癥不去故也，当下其癥，桂枝茯苓丸主之。'
      }
    ],
    modern: {
      terms: ['Guizhi Fuling Wan', 'Keishi-bukuryo-gan'],
      conditions: ['uterine fibroids', 'endometriosis', 'dysmenorrhea', 'prostatitis', 'benign prostatic hyperplasia']
    },
    safety: ['孕妇禁用（活血化瘀）', '月经过多、有出血倾向者慎用', '男科用于前列腺增生/慢性前列腺炎时同样按方证加减']
  },
  {
    id: 'danggui_shaoyao_san',
    name: '当归芍药散',
    source: '《金匮要略·妇人妊娠病脉证并治》',
    six: '杂病',
    composition: [
      { herb: '当归', liang: 3 },
      { herb: '芍药', text: '一斤', grams: '48g' },
      { herb: '茯苓', liang: 4 },
      { herb: '白术', liang: 4 },
      { herb: '泽泻', text: '半斤', grams: '24g' },
      { herb: '川芎', liang: 3 }
    ],
    decoction: '上六味，杵为散，取方寸匕，酒和，日三服。现代：研末每服 6g，或水煎分二次温服。',
    pattern: ['腹中㽲痛', '妊娠腹痛', '小便不利', '足跗浮肿', '头眩'],
    indicators: [
      { id: 'abdominal_pain', w: 3 },
      { id: 'edema', w: 2 },
      { id: 'dizziness', w: 2 },
      { id: 'difficult_urine', w: 2 },
      { id: 'menstrual', w: 1 },
      { id: 'fatigue', w: 1 },
      { id: 'tongue_swollen', w: 1 }
    ],
    contra: [{ id: 'bleeding', w: 1 }],
    clauses: [
      {
        ref: '《金匮要略·妇人妊娠病脉证并治》',
        text: '妇人怀妊，腹中㽲痛，当归芍药散主之。'
      },
      {
        ref: '《金匮要略·妇人杂病脉证并治》',
        text: '妇人腹中诸疾痛，当归芍药散主之。'
      }
    ],
    modern: { terms: ['Danggui Shaoyao San', 'Toki-shakuyaku-san'], conditions: ['dysmenorrhea', 'edema', 'pregnancy'] },
    safety: ['孕妇须在医师指导下使用', '阴虚血热者慎用']
  },
  {
    id: 'wenjing_tang',
    name: '温经汤',
    source: '《金匮要略·妇人杂病脉证并治》',
    six: '杂病',
    composition: [
      { herb: '吴茱萸', liang: 3 },
      { herb: '当归', liang: 2 },
      { herb: '川芎', liang: 2 },
      { herb: '芍药', liang: 2 },
      { herb: '人参', liang: 2 },
      { herb: '桂枝', liang: 2 },
      { herb: '阿胶', liang: 2 },
      { herb: '牡丹皮', liang: 2, prep: '去心' },
      { herb: '生姜', liang: 2 },
      { herb: '甘草', liang: 2 },
      { herb: '半夏', text: '半升', grams: '约 9g' },
      { herb: '麦门冬', text: '一升', grams: '约 15g', prep: '去心' }
    ],
    decoction: '上十二味，以水一斗，煮取三升，分温三服。',
    pattern: ['月经不调', '少腹寒痛', '手掌烦热', '唇口干燥', '久不受孕'],
    indicators: [
      { id: 'menstrual', w: 3 },
      { id: 'dysmenorrhea', w: 3 },
      { id: 'cold_limbs', w: 2 },
      { id: 'hot_palms', w: 2 },
      { id: 'lower_abdomen', w: 2 },
      { id: 'dry_mouth', w: 1 },
      { id: 'insomnia', w: 1 }
    ],
    contra: [{ id: 'fever', w: 1 }, { id: 'bleeding', w: 1 }],
    clauses: [
      {
        ref: '《金匮要略·妇人杂病脉证并治》',
        text: '妇人年五十所，病下利数十日不止，暮即发热，少腹里急，腹满，手掌烦热，唇口干燥，何也？……此病属带下……当以温经汤主之。'
      }
    ],
    modern: { terms: ['Wenjing Tang', 'Unkei-to'], conditions: ['menopausal syndrome', 'dysmenorrhea', 'infertility'] },
    safety: ['孕妇禁用', '阴虚火旺、实热证禁用', '含吴茱萸，用量不宜过大']
  },
  {
    id: 'shenqi_wan',
    name: '肾气丸',
    alias: '金匮肾气丸',
    source: '《金匮要略·血痹虚劳病脉证并治》',
    six: '杂病',
    composition: [
      { herb: '干地黄', liang: 8 },
      { herb: '山药', liang: 4 },
      { herb: '山茱萸', liang: 4 },
      { herb: '泽泻', liang: 3 },
      { herb: '茯苓', liang: 3 },
      { herb: '牡丹皮', liang: 3 },
      { herb: '桂枝', liang: 1 },
      { herb: '附子', liang: 1, prep: '炮' }
    ],
    decoction: '上八味，末之，炼蜜和丸梧子大，酒下十五丸，加至二十五丸，日再服。现代：每服 6–9g，日二次，淡盐汤送下。',
    pattern: ['腰痛脚软', '少腹拘急', '小便不利或频数', '畏寒'],
    indicators: [
      { id: 'back_ache', w: 3 },
      { id: 'frequent_urine', w: 3 },
      { id: 'difficult_urine', w: 2 },
      { id: 'fatigue', w: 2 },
      { id: 'cold_limbs', w: 1 },
      { id: 'edema', w: 1 },
      { id: 'tongue_pale', w: 1 },
      { id: 'pulse_deep', w: 1 }
    ],
    contra: [{ id: 'thirst_cold', w: 1 }, { id: 'tongue_red', w: 1 }],
    clauses: [
      {
        ref: '《金匮要略·血痹虚劳病脉证并治》',
        text: '虚劳腰痛，少腹拘急，小便不利者，八味肾气丸主之。'
      }
    ],
    modern: { terms: ['Jinkui Shenqi Wan', 'Hachi-mi-jio-gan'], conditions: ['chronic kidney disease', 'benign prostatic hyperplasia', 'diabetes'] },
    safety: ['阴虚火旺、湿热下注者禁用', '感冒发热期间停服', '含附子，需炮制']
  },
  {
    id: 'maimendong_tang',
    name: '麦门冬汤',
    source: '《金匮要略·肺痿肺痈咳嗽上气病脉证并治》',
    six: '杂病',
    composition: [
      { herb: '麦门冬', text: '七升', grams: '约 42g' },
      { herb: '半夏', text: '一升', grams: '约 12g' },
      { herb: '人参', liang: 2 },
      { herb: '甘草', liang: 2 },
      { herb: '粳米', text: '三合', grams: '约 15g' },
      { herb: '大枣', count: 12, unit: '枚' }
    ],
    decoction: '上六味，以水一斗二升，煮取六升，温服一升，日三夜一服。',
    pattern: ['火逆上气', '咽喉不利', '咳唾涎沫', '口干少痰'],
    indicators: [
      { id: 'cough', w: 2 },
      { id: 'sore_throat', w: 2 },
      { id: 'dry_mouth', w: 2 },
      { id: 'yellow_sputum', w: 1 },
      { id: 'wheezing', w: 1 },
      { id: 'thirst', w: 1 },
      { id: 'fatigue', w: 1 },
      { id: 'coat_none', w: 1 }
    ],
    contra: [{ id: 'white_sputum', w: 1 }, { id: 'coat_white_greasy', w: 1 }],
    clauses: [
      {
        ref: '《金匮要略·肺痿肺痈咳嗽上气病脉证并治》',
        text: '火逆上气，咽喉不利，止逆下气者，麦门冬汤主之。'
      }
    ],
    modern: { terms: ['Maimendong Tang', 'Bakumondo-to'], conditions: ['chronic cough', 'sicca syndrome', 'pharyngitis'] },
    safety: ['痰湿壅盛、痰白量多者不宜', '脾胃虚寒者慎用']
  },
  {
    id: 'shaoyao_gancao_tang',
    name: '芍药甘草汤',
    source: '《伤寒论·辨太阳病脉证并治上》',
    six: '太阳',
    composition: [
      { herb: '芍药', liang: 4 },
      { herb: '甘草', liang: 4, prep: '炙' }
    ],
    decoction: '上二味，以水三升，煮取一升五合，去滓，分温再服。',
    pattern: ['脚挛急', '筋脉拘挛', '腹中急痛'],
    indicators: [
      { id: 'spasm', w: 3 },
      { id: 'abdominal_pain', w: 2 },
      { id: 'numbness', w: 1 },
      { id: 'joint_pain', w: 1 }
    ],
    contra: [{ id: 'edema', w: 1 }],
    clauses: [
      {
        ref: '《伤寒论·辨太阳病脉证并治上》第29条',
        text: '……若厥愈足温者，更作芍药甘草汤与之，其脚即伸。'
      }
    ],
    modern: { terms: ['Shaoyao Gancao Tang', 'Shakuyaku-kanzo-to'], conditions: ['muscle cramps', 'pain', 'restless legs syndrome'] },
    safety: ['长期大剂量甘草可致水钠潴留、低血钾、血压升高', '高血压、水肿、低钾者慎用', '孕妇慎用']
  },
  {
    id: 'gualou_xiebai_banxia_tang',
    name: '瓜蒌薤白半夏汤',
    source: '《金匮要略·胸痹心痛短气病脉证并治》',
    six: '杂病',
    composition: [
      { herb: '瓜蒌实', count: 1, unit: '枚' },
      { herb: '薤白', liang: 3 },
      { herb: '半夏', text: '半升', grams: '约 9g' },
      { herb: '白酒', text: '一斗', grams: '适量（现代多以黄酒代之）' }
    ],
    decoction: '上四味，同煮，取四升，温服一升，日三服。',
    pattern: ['胸痹不得卧', '心痛彻背', '痰多气短'],
    indicators: [
      { id: 'chest_pain', w: 3 },
      { id: 'chest_oppression', w: 3 },
      { id: 'cough', w: 1 },
      { id: 'white_sputum', w: 1 },
      { id: 'wheezing', w: 1 }
    ],
    contra: [{ id: 'bleeding', w: 1 }],
    clauses: [
      {
        ref: '《金匮要略·胸痹心痛短气病脉证并治》',
        text: '胸痹不得卧，心痛彻背者，栝蒌薤白半夏汤主之。'
      }
    ],
    modern: { terms: ['Gualou Xiebai Banxia Tang'], conditions: ['coronary heart disease', 'angina'] },
    safety: ['胸痛剧烈、持续不缓解者须立即急诊，不可依赖本方', '孕妇慎用', '胃弱者白酒宜减']
  },
  {
    id: 'dahuang_mudan_tang',
    name: '大黄牡丹汤',
    source: '《金匮要略·疮痈肠痈浸淫病脉证并治》',
    six: '杂病',
    composition: [
      { herb: '大黄', liang: 4 },
      { herb: '牡丹皮', liang: 1 },
      { herb: '桃仁', count: 50, unit: '个' },
      { herb: '冬瓜子', text: '半升', grams: '约 15g' },
      { herb: '芒硝', text: '三合', grams: '约 9g' }
    ],
    decoction: '上五味，以水六升，煮取一升，去滓，内芒硝，再煎沸，顿服之。有脓当下；如无脓，当下血。',
    pattern: ['少腹肿痞', '按之即痛', '右少腹压痛', '发热恶寒自汗'],
    indicators: [
      { id: 'lower_abdomen', w: 3 },
      { id: 'abdominal_pain', w: 3 },
      { id: 'rigidity', w: 2 },
      { id: 'fever', w: 2 },
      { id: 'constipation', w: 2 },
      { id: 'nausea', w: 1 }
    ],
    contra: [{ id: 'pulse_weak', w: 2 }, { id: 'cold_limbs', w: 1 }],
    clauses: [
      {
        ref: '《金匮要略·疮痈肠痈浸淫病脉证并治》',
        text: '肠痈者，少腹肿痞，按之即痛如淋，小便自调，时时发热，自汗出，复恶寒，其脉迟紧者，脓未成，可下之，当有血。'
      }
    ],
    modern: { terms: ['Dahuang Mudan Tang'], conditions: ['appendicitis', 'pelvic inflammatory disease'] },
    safety: ['急性阑尾炎等急腹症必须及时就医，不可自行服药延误手术时机', '孕妇禁用', '体虚者慎用']
  }
]
