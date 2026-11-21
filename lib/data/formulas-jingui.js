// 经方库 ·《金匮要略》杂病方（续）
//
// 与《伤寒论》方同一套数据结构。剂量仍按「1 两 = 3 克」折算；
// 少数宋校后剂量偏小、或本为散剂/丸剂的方，用 doseBasis:'modern' 标注，
// 组成直接列现代常用量，处方笺会据此换列头并注明，不冒充汉制原量。

export const JINGUI_FORMULAS = [
  // ── 痉湿暍病 ──────────────────────────────────────────
  {
    id: 'mahuang_jia_zhu_tang',
    name: '麻黄加术汤',
    source: '《金匮要略·痉湿暍病脉证并治》',
    six: '杂病',
    composition: [
      { herb: '麻黄', liang: 3, prep: '去节' },
      { herb: '桂枝', liang: 2, prep: '去皮' },
      { herb: '甘草', liang: 1, prep: '炙' },
      { herb: '杏仁', count: 70, unit: '个', prep: '去皮尖' },
      { herb: '白术', liang: 4 }
    ],
    decoction: '上五味，以水九升，先煮麻黄，减二升，去上沫，内诸药，煮取二升半，去滓，温服八合，覆取微似汗。',
    pattern: ['湿家身烦疼', '无汗', '恶寒', '脉浮紧'],
    indicators: [
      { id: 'body_ache', w: 3 },
      { id: 'no_sweat', w: 2 },
      { id: 'aversion_cold', w: 2 },
      { id: 'joint_pain', w: 2 },
      { id: 'heavy_body', w: 2 },
      { id: 'edema', w: 1 },
      { id: 'pulse_float', w: 1 },
      { id: 'pulse_tight', w: 1 }
    ],
    contra: [{ id: 'spontaneous_sweat', w: 2 }, { id: 'yellow_sputum', w: 1 }],
    clauses: [
      {
        ref: '《金匮要略·痉湿暍病脉证并治》',
        text: '湿家身烦疼，可与麻黄加术汤发其汗为宜，慎不可以火攻之。'
      }
    ],
    modern: { terms: ['Mahuang Jia Zhu Tang'], conditions: ['arthritis', 'common cold', 'fibromyalgia'] },
    safety: ['麻黄慎用于高血压、心脏病、失眠者', '得汗即止，不可过汗', '阴虚津亏者不宜']
  },
  {
    id: 'ma_xing_yi_gan_tang',
    name: '麻黄杏仁薏苡甘草汤',
    alias: '麻杏薏甘汤',
    source: '《金匮要略·痉湿暍病脉证并治》',
    six: '杂病',
    doseBasis: 'modern',
    composition: [
      { herb: '麻黄', text: '6g', prep: '去节，先煎去沫' },
      { herb: '杏仁', text: '9g', prep: '去皮尖' },
      { herb: '薏苡仁', text: '15g' },
      { herb: '甘草', text: '6g', prep: '炙' }
    ],
    decoction: '原方为「麻黄半两、甘草一两、薏苡仁半两、杏仁十个」，宋校剂量偏小；现代常用量如上方，水煎温服，取微汗，避风。',
    pattern: ['一身尽疼', '发热日晡所剧', '无汗', '身重'],
    indicators: [
      { id: 'body_ache', w: 3 },
      { id: 'tidal_fever', w: 2 },
      { id: 'heavy_body', w: 2 },
      { id: 'joint_pain', w: 2 },
      { id: 'no_sweat', w: 1 },
      { id: 'edema', w: 1 }
    ],
    contra: [{ id: 'profuse_sweat', w: 2 }, { id: 'cold_limbs', w: 1 }],
    clauses: [
      {
        ref: '《金匮要略·痉湿暍病脉证并治》',
        text: '病者一身尽疼，发热，日晡所剧者，名风湿。此病伤于汗出当风，或久伤取冷所致也，可与麻黄杏仁薏苡甘草汤。'
      }
    ],
    modern: { terms: ['Ma Xing Yi Gan Tang', 'Mao-to'], conditions: ['rheumatoid arthritis', 'common cold'] },
    safety: ['麻黄慎用于高血压、心脏病', '本方为微汗之剂，不可大汗']
  },
  {
    id: 'fangji_huangqi_tang',
    name: '防己黄芪汤',
    source: '《金匮要略·痉湿暍病脉证并治》',
    six: '杂病',
    doseBasis: 'modern',
    composition: [
      { herb: '防己', text: '9g' },
      { herb: '黄芪', text: '15g' },
      { herb: '白术', text: '9g' },
      { herb: '甘草', text: '6g', prep: '炙' },
      { herb: '生姜', text: '4片' },
      { herb: '大枣', count: 1, unit: '枚' }
    ],
    decoction: '原方「防己一两、甘草半两、白术七钱半、黄芪一两一分」，为宋校钱分制，量偏小；现代常用量如上方，水煎温服。服后当如虫行皮中，从腰下如冰，后坐被上，又以一被绕腰以下，温令微汗，差。',
    pattern: ['脉浮身重', '汗出恶风', '水肿', '关节疼痛'],
    indicators: [
      { id: 'edema', w: 2 },
      { id: 'spontaneous_sweat', w: 2 },
      { id: 'aversion_wind', w: 2 },
      { id: 'heavy_body', w: 2 },
      { id: 'joint_pain', w: 1 },
      { id: 'fatigue', w: 1 },
      { id: 'pulse_float', w: 2 },
      { id: 'difficult_urine', w: 1 },
      { id: 'tongue_swollen', w: 1 }
    ],
    contra: [{ id: 'no_sweat', w: 1 }, { id: 'pulse_rapid', w: 1 }],
    clauses: [
      {
        ref: '《金匮要略·痉湿暍病脉证并治》',
        text: '风湿，脉浮，身重，汗出恶风者，防己黄芪汤主之。'
      },
      {
        ref: '《金匮要略·水气病脉证并治》',
        text: '风水，脉浮身重，汗出恶风者，防己黄芪汤主之。'
      }
    ],
    modern: { terms: ['Fangji Huangqi Tang', 'Boi-ogi-to'], conditions: ['nephrotic syndrome', 'edema', 'obesity'] },
    safety: ['阴虚、湿热壅盛者不宜', '防己有肾毒性报道，肾功能不全者慎用且不宜久服']
  },
  {
    id: 'guizhi_fuzi_tang',
    name: '桂枝附子汤',
    source: '《金匮要略·痉湿暍病脉证并治》',
    six: '杂病',
    composition: [
      { herb: '桂枝', liang: 4, prep: '去皮' },
      { herb: '附子', count: 3, unit: '枚', prep: '炮，去皮，破八片' },
      { herb: '生姜', liang: 3, prep: '切' },
      { herb: '大枣', count: 12, unit: '枚', prep: '擘' },
      { herb: '甘草', liang: 2, prep: '炙' }
    ],
    decoction: '上五味，以水六升，煮取二升，去滓，分温三服。',
    pattern: ['身体疼烦', '不能自转侧', '脉浮虚而涩', '不呕不渴'],
    indicators: [
      { id: 'body_ache', w: 3 },
      { id: 'joint_pain', w: 2 },
      { id: 'aversion_cold', w: 2 },
      { id: 'chill_body', w: 2 },
      { id: 'pulse_float', w: 2 },
      { id: 'pulse_rough', w: 1 },
      { id: 'no_sweat', w: 1 }
    ],
    contra: [{ id: 'fever', w: 1 }, { id: 'thirst_cold', w: 2 }],
    clauses: [
      {
        ref: '《金匮要略·痉湿暍病脉证并治》',
        text: '伤寒八九日，风湿相搏，身体疼烦，不能自转侧，不呕不渴，脉浮虚而涩者，桂枝附子汤主之。'
      }
    ],
    modern: { terms: ['Guizhi Fuzi Tang'], conditions: ['rheumatoid arthritis', 'arthralgia'] },
    safety: ['附子需炮制并先煎 60 分钟以上', '不可与半夏、瓜蒌、贝母、白蔹、白及同用', '孕妇慎用']
  },

  // ── 血痹虚劳病 ────────────────────────────────────────
  {
    id: 'huangqi_guizhi_wuwu_tang',
    name: '黄芪桂枝五物汤',
    source: '《金匮要略·血痹虚劳病脉证并治》',
    six: '杂病',
    composition: [
      { herb: '黄芪', liang: 3 },
      { herb: '芍药', liang: 3 },
      { herb: '桂枝', liang: 3 },
      { herb: '生姜', liang: 6, prep: '切' },
      { herb: '大枣', count: 12, unit: '枚' }
    ],
    decoction: '上五味，以水六升，煮取二升，温服七合，日三服。',
    pattern: ['身体不仁', '如风痹状', '脉微涩', '肢端麻木'],
    indicators: [
      { id: 'numbness', w: 3 },
      { id: 'cold_limbs', w: 2 },
      { id: 'fatigue', w: 2 },
      { id: 'joint_pain', w: 1 },
      { id: 'pulse_thin', w: 1 },
      { id: 'pulse_rough', w: 1 },
      { id: 'tongue_pale', w: 1 }
    ],
    contra: [{ id: 'thirst_cold', w: 1 }, { id: 'pulse_rapid', w: 1 }],
    clauses: [
      {
        ref: '《金匮要略·血痹虚劳病脉证并治》',
        text: '血痹阴阳俱微，寸口关上微，尺中小紧，外证身体不仁，如风痹状，黄芪桂枝五物汤主之。'
      }
    ],
    modern: { terms: ['Huangqi Guizhi Wuwu Tang'], conditions: ['diabetic neuropathy', 'carpal tunnel syndrome', 'numbness'] },
    safety: ['阴虚火旺、实热者不宜', '孕妇慎用桂枝']
  },
  {
    id: 'guizhi_jia_longgu_muli_tang',
    name: '桂枝加龙骨牡蛎汤',
    source: '《金匮要略·血痹虚劳病脉证并治》',
    six: '杂病',
    composition: [
      { herb: '桂枝', liang: 3, prep: '去皮' },
      { herb: '芍药', liang: 3 },
      { herb: '生姜', liang: 3, prep: '切' },
      { herb: '甘草', liang: 2, prep: '炙' },
      { herb: '大枣', count: 12, unit: '枚', prep: '擘' },
      { herb: '龙骨', liang: 3 },
      { herb: '牡蛎', liang: 3, prep: '熬' }
    ],
    decoction: '上七味，以水七升，煮取三升，分温三服。',
    pattern: ['失精', '少腹弦急', '目眩发落', '脉芤动微紧', '梦交'],
    indicators: [
      { id: 'spermatorrhea', w: 3 },
      { id: 'lower_abdomen', w: 2 },
      { id: 'dizziness', w: 2 },
      { id: 'palpitation', w: 2 },
      { id: 'insomnia', w: 1 },
      { id: 'night_sweat', w: 1 },
      { id: 'fatigue', w: 1 },
      { id: 'anxiety', w: 1 }
    ],
    contra: [{ id: 'thirst_cold', w: 1 }, { id: 'constipation', w: 1 }],
    clauses: [
      {
        ref: '《金匮要略·血痹虚劳病脉证并治》',
        text: '夫失精家，少腹弦急，阴头寒，目眩，发落，脉极虚芤迟，为清谷亡血失精。脉得诸芤动微紧，男子失精，女子梦交，桂枝加龙骨牡蛎汤主之。'
      }
    ],
    modern: { terms: ['Guizhi Jia Longgu Muli Tang', 'Keishi-ka-ryukotsu-borei-to'], conditions: ['premature ejaculation', 'anxiety', 'insomnia'] },
    safety: ['湿热下注之遗精不宜', '龙骨牡蛎质重，宜先煎']
  },
  {
    id: 'huangqi_jianzhong_tang',
    name: '黄芪建中汤',
    source: '《金匮要略·血痹虚劳病脉证并治》',
    six: '杂病',
    composition: [
      { herb: '黄芪', liang: 1.5 },
      { herb: '桂枝', liang: 3, prep: '去皮' },
      { herb: '甘草', liang: 2, prep: '炙' },
      { herb: '大枣', count: 12, unit: '枚', prep: '擘' },
      { herb: '芍药', liang: 6 },
      { herb: '生姜', liang: 3, prep: '切' },
      { herb: '胶饴', text: '一升', grams: '约 30g' }
    ],
    decoction: '上七味，以水七升，煮取三升，去滓，内胶饴，更上微火消解，温服一升，日三服。',
    pattern: ['虚劳里急', '诸不足', '腹中痛喜温按', '自汗短气'],
    indicators: [
      { id: 'abdominal_pain', w: 3 },
      { id: 'fatigue', w: 3 },
      { id: 'spontaneous_sweat', w: 2 },
      { id: 'palpitation', w: 1 },
      { id: 'poor_appetite', w: 1 },
      { id: 'weight_loss', w: 1 },
      { id: 'short_breath', w: 1 },
      { id: 'tongue_pale', w: 1 }
    ],
    contra: [{ id: 'coat_yellow_greasy', w: 1 }, { id: 'nausea', w: 1 }],
    clauses: [
      {
        ref: '《金匮要略·血痹虚劳病脉证并治》',
        text: '虚劳里急，诸不足，黄芪建中汤主之。'
      }
    ],
    modern: { terms: ['Huangqi Jianzhong Tang'], conditions: ['peptic ulcer', 'chronic fatigue', 'malnutrition'] },
    safety: ['呕家、糖尿病患者慎用（含饴糖）', '湿热中阻者禁用', '黄芪升补，实证不宜']
  },

  // ── 肺痿肺痈咳嗽上气病 ────────────────────────────────
  {
    id: 'shegan_mahuang_tang',
    name: '射干麻黄汤',
    source: '《金匮要略·肺痿肺痈咳嗽上气病脉证并治》',
    six: '杂病',
    composition: [
      { herb: '射干', count: 13, unit: '枚' },
      { herb: '麻黄', liang: 4, prep: '去节' },
      { herb: '生姜', liang: 4, prep: '切' },
      { herb: '细辛', liang: 3 },
      { herb: '紫菀', liang: 3 },
      { herb: '款冬花', liang: 3 },
      { herb: '五味子', text: '半升', grams: '约 9g' },
      { herb: '大枣', count: 7, unit: '枚', prep: '擘' },
      { herb: '半夏', text: '半升', grams: '约 9g', prep: '洗' }
    ],
    decoction: '上九味，以水一斗二升，先煮麻黄两沸，去上沫，内诸药，煮取三升，分温三服。',
    pattern: ['咳而上气', '喉中水鸡声', '痰白', '胸满'],
    indicators: [
      { id: 'wheezing', w: 3 },
      { id: 'cough', w: 3 },
      { id: 'white_sputum', w: 2 },
      { id: 'chest_oppression', w: 1 },
      { id: 'nasal', w: 1 },
      { id: 'aversion_cold', w: 1 },
      { id: 'pulse_tight', w: 1 }
    ],
    contra: [{ id: 'yellow_sputum', w: 2 }, { id: 'thirst_cold', w: 1 }, { id: 'pulse_rapid', w: 1 }],
    clauses: [
      {
        ref: '《金匮要略·肺痿肺痈咳嗽上气病脉证并治》',
        text: '咳而上气，喉中水鸡声，射干麻黄汤主之。'
      }
    ],
    modern: { terms: ['Shegan Mahuang Tang', 'Shakan-mao-to'], conditions: ['asthma', 'bronchitis', 'wheezing'] },
    safety: ['细辛、麻黄用量偏大：细辛宜久煎并减量，麻黄慎用于高血压、心脏病', '痰热、阴虚燥咳者禁用']
  },
  {
    id: 'gancao_ganjiang_tang',
    name: '甘草干姜汤',
    source: '《金匮要略·肺痿肺痈咳嗽上气病脉证并治》',
    six: '杂病',
    composition: [
      { herb: '甘草', liang: 4, prep: '炙' },
      { herb: '干姜', liang: 2, prep: '炮' }
    ],
    decoction: '上二味，以水三升，煮取一升五合，去滓，分温再服。',
    pattern: ['肺痿吐涎沫', '不咳不渴', '遗尿小便数', '头眩'],
    indicators: [
      { id: 'saliva', w: 3 },
      { id: 'clear_urine', w: 2 },
      { id: 'frequent_urine', w: 2 },
      { id: 'dizziness', w: 1 },
      { id: 'chill_body', w: 2 },
      { id: 'cough', w: 1 },
      { id: 'tongue_pale', w: 1 }
    ],
    contra: [{ id: 'thirst_cold', w: 2 }, { id: 'yellow_sputum', w: 2 }, { id: 'tongue_red', w: 1 }],
    clauses: [
      {
        ref: '《金匮要略·肺痿肺痈咳嗽上气病脉证并治》',
        text: '肺痿吐涎沫而不咳者，其人不渴，必遗尿，小便数，所以然者，以上虚不能制下故也。此为肺中冷，必眩，多涎唾，甘草干姜汤以温之。'
      }
    ],
    modern: { terms: ['Gancao Ganjiang Tang'], conditions: ['chronic bronchitis', 'urinary frequency', 'hypothermia'] },
    safety: ['阴虚燥热、痰黄黏者禁用', '甘草久服可致水肿、低血钾，高血压者慎用']
  },
  {
    id: 'tingli_dazao_xiefei_tang',
    name: '葶苈大枣泻肺汤',
    source: '《金匮要略·肺痿肺痈咳嗽上气病脉证并治》',
    doseBasis: 'modern',
    six: '杂病',
    composition: [
      { herb: '葶苈子', text: '捣丸如弹子大', grams: '约 10g', prep: '熬令黄色' },
      { herb: '大枣', count: 12, unit: '枚', prep: '擘' }
    ],
    decoction: '上先以水三升，煮枣取二升，去枣，内葶苈，煮取一升，顿服。',
    pattern: ['喘不得卧', '胸满', '面目浮肿', '痰涎壅盛'],
    indicators: [
      { id: 'orthopnea', w: 3 },
      { id: 'wheezing', w: 2 },
      { id: 'chest_oppression', w: 2 },
      { id: 'edema', w: 2 },
      { id: 'cough', w: 1 },
      { id: 'yellow_sputum', w: 1 }
    ],
    contra: [{ id: 'pulse_weak', w: 2 }, { id: 'cold_limbs', w: 1 }, { id: 'fatigue', w: 1 }],
    clauses: [
      {
        ref: '《金匮要略·肺痿肺痈咳嗽上气病脉证并治》',
        text: '肺痈，喘不得卧，葶苈大枣泻肺汤主之。'
      }
    ],
    modern: { terms: ['Tingli Dazao Xiefei Tang'], conditions: ['pleural effusion', 'heart failure', 'pulmonary edema'] },
    safety: ['葶苈子峻泻肺水，体虚、脉弱者禁用', '中病即止，不可久服', '孕妇慎用']
  },

  // ── 奔豚气病 ──────────────────────────────────────────
  {
    id: 'guizhi_jia_gui_tang',
    name: '桂枝加桂汤',
    source: '《金匮要略·奔豚气病脉证并治》',
    six: '杂病',
    composition: [
      { herb: '桂枝', liang: 5, prep: '去皮' },
      { herb: '芍药', liang: 3 },
      { herb: '甘草', liang: 2, prep: '炙' },
      { herb: '生姜', liang: 3, prep: '切' },
      { herb: '大枣', count: 12, unit: '枚', prep: '擘' }
    ],
    decoction: '上五味，以水七升，微火煮取三升，去滓，温服一升。',
    pattern: ['气从少腹上冲心', '奔豚', '心悸', '腹痛'],
    indicators: [
      { id: 'qi_rush', w: 3 },
      { id: 'palpitation', w: 2 },
      { id: 'lower_abdomen', w: 2 },
      { id: 'anxiety', w: 2 },
      { id: 'cold_limbs', w: 1 },
      { id: 'dizziness', w: 1 },
      { id: 'pulse_deep', w: 1 }
    ],
    contra: [{ id: 'thirst_cold', w: 1 }, { id: 'yellow_sputum', w: 1 }],
    clauses: [
      {
        ref: '《金匮要略·奔豚气病脉证并治》',
        text: '发汗后，烧针令其汗，针处被寒，核起而赤者，必发奔豚，气从少腹上至心，灸其核上各一壮，与桂枝加桂汤主之。'
      }
    ],
    modern: { terms: ['Guizhi Jia Gui Tang'], conditions: ['panic attack', 'palpitation', 'anxiety'] },
    safety: ['本方桂枝用量偏大，温热助阳，阴虚火旺、血热者慎用']
  },
  {
    id: 'fuling_guizhi_gancao_dazao_tang',
    name: '茯苓桂枝甘草大枣汤',
    alias: '苓桂甘枣汤',
    source: '《金匮要略·奔豚气病脉证并治》',
    six: '杂病',
    composition: [
      { herb: '茯苓', text: '半斤', grams: '24g' },
      { herb: '桂枝', liang: 4, prep: '去皮' },
      { herb: '甘草', liang: 2, prep: '炙' },
      { herb: '大枣', count: 15, unit: '枚', prep: '擘' }
    ],
    decoction: '上四味，以甘澜水一斗，先煮茯苓，减二升，内诸药，煮取三升，去滓，温服一升，日三服。',
    pattern: ['脐下悸', '欲作奔豚', '心悸', '小便不利'],
    indicators: [
      { id: 'lower_abdomen_throb', w: 3 },
      { id: 'qi_rush', w: 2 },
      { id: 'palpitation', w: 2 },
      { id: 'difficult_urine', w: 1 },
      { id: 'dizziness', w: 1 },
      { id: 'pulse_deep', w: 1 }
    ],
    contra: [{ id: 'thirst_cold', w: 1 }, { id: 'night_sweat', w: 1 }],
    clauses: [
      {
        ref: '《金匮要略·奔豚气病脉证并治》',
        text: '发汗后，脐下悸者，欲作奔豚，茯苓桂枝甘草大枣汤主之。'
      }
    ],
    modern: { terms: ['Ling Gui Gan Zao Tang'], conditions: ['anxiety', 'palpitation'] },
    safety: ['阴虚火旺者不宜']
  },

  // ── 胸痹心痛短气病 ────────────────────────────────────
  {
    id: 'zhishi_xiebai_guizhi_tang',
    name: '枳实薤白桂枝汤',
    source: '《金匮要略·胸痹心痛短气病脉证并治》',
    six: '杂病',
    composition: [
      { herb: '枳实', count: 4, unit: '枚' },
      { herb: '厚朴', liang: 4 },
      { herb: '薤白', text: '半斤', grams: '24g' },
      { herb: '桂枝', liang: 1 },
      { herb: '栝蒌实', count: 1, unit: '枚', prep: '捣' }
    ],
    decoction: '上五味，以水五升，先煮枳实、厚朴，取二升，去滓，内诸药，煮数沸，分温三服。',
    pattern: ['胸痹心中痞气', '气结在胸', '胸满', '胁下逆抢心'],
    indicators: [
      { id: 'chest_pain', w: 3 },
      { id: 'chest_oppression', w: 3 },
      { id: 'hypochondriac', w: 2 },
      { id: 'short_breath', w: 2 },
      { id: 'belching', w: 1 },
      { id: 'epigastric_distention', w: 1 }
    ],
    contra: [{ id: 'pulse_weak', w: 1 }, { id: 'cold_limbs', w: 1 }],
    clauses: [
      {
        ref: '《金匮要略·胸痹心痛短气病脉证并治》',
        text: '胸痹心中痞气，气结在胸，胸满，胁下逆抢心，枳实薤白桂枝汤主之；人参汤亦主之。'
      }
    ],
    modern: { terms: ['Zhishi Xiebai Guizhi Tang'], conditions: ['angina', 'coronary heart disease'] },
    safety: ['胸痛持续不缓解者须立即急诊，不可依赖本方', '孕妇慎用', '气虚者不宜（当用人参汤）']
  },
  {
    id: 'yiyi_fuzi_san',
    name: '薏苡附子散',
    source: '《金匮要略·胸痹心痛短气病脉证并治》',
    six: '杂病',
    composition: [
      { herb: '薏苡仁', text: '十五两', grams: '45g' },
      { herb: '附子', text: '十枚', grams: '约 30g', prep: '大者，炮' }
    ],
    decoction: '上二味，杵为散，服方寸匕，日三服。现代：研末，每服 3–6g，日 2–3 次；亦可作汤剂。',
    pattern: ['胸痹缓急', '胸痛遇寒加重', '筋脉拘急'],
    indicators: [
      { id: 'chest_pain', w: 3 },
      { id: 'chill_body', w: 2 },
      { id: 'spasm', w: 1 },
      { id: 'joint_pain', w: 1 },
      { id: 'cold_limbs', w: 1 },
      { id: 'chest_oppression', w: 1 }
    ],
    contra: [{ id: 'fever', w: 1 }, { id: 'thirst_cold', w: 2 }],
    clauses: [
      {
        ref: '《金匮要略·胸痹心痛短气病脉证并治》',
        text: '胸痹缓急者，薏苡附子散主之。'
      }
    ],
    modern: { terms: ['Yiyi Fuzi San'], conditions: ['angina', 'arthritis'] },
    safety: ['附子有毒：必须炮制，作汤剂先煎 60 分钟以上', '孕妇禁用', '胸痛剧烈者须先排除心梗']
  },

  // ── 腹满寒疝宿食病 ────────────────────────────────────
  {
    id: 'da_jianzhong_tang',
    name: '大建中汤',
    source: '《金匮要略·腹满寒疝宿食病脉证并治》',
    six: '杂病',
    composition: [
      { herb: '蜀椒', text: '二合', grams: '约 6g', prep: '去汗' },
      { herb: '干姜', liang: 4 },
      { herb: '人参', liang: 2 },
      { herb: '胶饴', text: '一升', grams: '约 30g' }
    ],
    decoction: '上三味，以水四升，煮取二升，去滓，内胶饴一升，微火煎取一升半，分温再服；如一炊顷，可饮粥二升，后更服，当一日食糜，温覆之。',
    pattern: ['心胸中大寒痛', '呕不能饮食', '腹中寒', '上冲皮起', '痛不可触近'],
    indicators: [
      { id: 'abdominal_pain', w: 3 },
      { id: 'chill_body', w: 3 },
      { id: 'vomiting', w: 2 },
      { id: 'poor_appetite', w: 2 },
      { id: 'cold_limbs', w: 2 },
      { id: 'muscle_twitch', w: 1 },
      { id: 'tongue_pale', w: 1 },
      { id: 'pulse_deep', w: 1 },
      { id: 'pulse_slow', w: 1 }
    ],
    contra: [{ id: 'fever', w: 1 }, { id: 'thirst_cold', w: 2 }, { id: 'constipation', w: 1 }],
    clauses: [
      {
        ref: '《金匮要略·腹满寒疝宿食病脉证并治》',
        text: '心胸中大寒痛，呕不能饮食，腹中寒，上冲皮起，出见有头足，上下痛而不可触近，大建中汤主之。'
      }
    ],
    modern: { terms: ['Da Jianzhong Tang', 'Dai-kenchuto'], conditions: ['abdominal pain', 'ileus', 'gastrectomy syndrome'] },
    safety: ['蜀椒辛热有小毒，用量不宜大', '实热腹痛禁用', '糖尿病患者慎用饴糖']
  },
  {
    id: 'dahuang_fuzi_tang',
    name: '大黄附子汤',
    source: '《金匮要略·腹满寒疝宿食病脉证并治》',
    six: '杂病',
    composition: [
      { herb: '大黄', liang: 3 },
      { herb: '附子', count: 3, unit: '枚', prep: '炮' },
      { herb: '细辛', liang: 2 }
    ],
    decoction: '上三味，以水五升，煮取二升，分温三服；若强人煮取二升半，分温三服。服后如人行四五里，进一服。',
    pattern: ['胁下偏痛', '发热', '脉紧弦', '寒实内结', '大便不通'],
    indicators: [
      { id: 'hypochondriac', w: 3 },
      { id: 'abdominal_pain', w: 2 },
      { id: 'constipation', w: 2 },
      { id: 'cold_limbs', w: 2 },
      { id: 'chill_body', w: 1 },
      { id: 'pulse_tight', w: 2 },
      { id: 'pulse_wiry', w: 1 },
      { id: 'tongue_pale', w: 1 }
    ],
    contra: [{ id: 'pulse_rapid', w: 2 }, { id: 'thirst_cold', w: 1 }, { id: 'yellow_sputum', w: 1 }],
    clauses: [
      {
        ref: '《金匮要略·腹满寒疝宿食病脉证并治》',
        text: '胁下偏痛，发热，其脉紧弦，此寒也，以温药下之，宜大黄附子汤。'
      }
    ],
    modern: { terms: ['Dahuang Fuzi Tang'], conditions: ['acute pancreatitis', 'intestinal obstruction', 'renal colic'] },
    safety: ['附子先煎，细辛久煎', '孕妇禁用', '急腹症需先排除外科情况', '中病即止']
  },
  {
    id: 'danggui_shengjiang_yangrou_tang',
    name: '当归生姜羊肉汤',
    source: '《金匮要略·腹满寒疝宿食病脉证并治》',
    six: '杂病',
    composition: [
      { herb: '当归', liang: 3 },
      { herb: '生姜', liang: 5, prep: '切' },
      { herb: '羊肉', text: '一斤', grams: '约 240g' }
    ],
    decoction: '上三味，以水八升，煮取三升，温服七合，日三服。若寒多者加生姜成一斤；痛多而呕者加橘皮二两、白术一两。',
    pattern: ['寒疝腹中痛', '胁痛里急', '产后腹中㽲痛', '喜温喜按'],
    indicators: [
      { id: 'abdominal_pain', w: 3 },
      { id: 'chill_body', w: 2 },
      { id: 'cold_limbs', w: 2 },
      { id: 'lower_abdomen', w: 2 },
      { id: 'dysmenorrhea', w: 2 },
      { id: 'fatigue', w: 1 },
      { id: 'tongue_pale', w: 1 }
    ],
    contra: [{ id: 'fever', w: 1 }, { id: 'thirst_cold', w: 1 }, { id: 'coat_yellow_greasy', w: 1 }],
    clauses: [
      {
        ref: '《金匮要略·腹满寒疝宿食病脉证并治》',
        text: '寒疝腹中痛，及胁痛里急者，当归生姜羊肉汤主之。'
      },
      {
        ref: '《金匮要略·妇人产后病脉证并治》',
        text: '产后腹中㽲痛，当归生姜羊肉汤主之；并治腹中寒疝，虚劳不足。'
      }
    ],
    modern: { terms: ['Danggui Shengjiang Yangrou Tang'], conditions: ['dysmenorrhea', 'postpartum pain', 'anemia'] },
    safety: ['阴虚火旺、湿热内盛者不宜', '羊肉温补，发热期间停服']
  },

  // ── 痰饮咳嗽病 ────────────────────────────────────────
  {
    id: 'zexie_tang',
    name: '泽泻汤',
    source: '《金匮要略·痰饮咳嗽病脉证并治》',
    six: '杂病',
    composition: [
      { herb: '泽泻', liang: 5 },
      { herb: '白术', liang: 2 }
    ],
    decoction: '上二味，以水二升，煮取一升，分温再服。',
    pattern: ['心下有支饮', '其人苦冒眩', '头重如裹'],
    indicators: [
      { id: 'dizziness', w: 3 },
      { id: 'heavy_body', w: 2 },
      { id: 'chest_oppression', w: 1 },
      { id: 'nausea', w: 1 },
      { id: 'edema', w: 1 },
      { id: 'tongue_swollen', w: 1 },
      { id: 'coat_white_greasy', w: 1 }
    ],
    contra: [{ id: 'tongue_red', w: 1 }, { id: 'night_sweat', w: 1 }],
    clauses: [
      {
        ref: '《金匮要略·痰饮咳嗽病脉证并治》',
        text: '心下有支饮，其人苦冒眩，泽泻汤主之。'
      }
    ],
    modern: { terms: ['Zexie Tang'], conditions: ['Meniere disease', 'vertigo', 'hypertension'] },
    safety: ['阴虚阳亢之眩晕不宜', '泽泻久服可伤阴，不宜长期单用']
  },
  {
    id: 'xiao_banxia_tang',
    name: '小半夏汤',
    source: '《金匮要略·痰饮咳嗽病脉证并治》',
    six: '杂病',
    composition: [
      { herb: '半夏', text: '一升', grams: '约 12g', prep: '洗' },
      { herb: '生姜', text: '半斤', grams: '24g', prep: '切' }
    ],
    decoction: '上二味，以水七升，煮取一升半，分温再服。',
    pattern: ['呕而不渴', '心下有支饮', '呕吐清水痰涎', '眩晕'],
    indicators: [
      { id: 'vomiting', w: 3 },
      { id: 'nausea', w: 2 },
      { id: 'saliva', w: 2 },
      { id: 'dizziness', w: 1 },
      { id: 'poor_appetite', w: 1 },
      { id: 'thirst_no_drink', w: 1 }
    ],
    contra: [{ id: 'thirst_cold', w: 2 }, { id: 'dry_mouth', w: 1 }, { id: 'tongue_red', w: 1 }],
    clauses: [
      {
        ref: '《金匮要略·痰饮咳嗽病脉证并治》',
        text: '呕家本渴，渴者为欲解，今反不渴，心下有支饮故也，小半夏汤主之。'
      }
    ],
    modern: { terms: ['Xiao Banxia Tang'], conditions: ['nausea', 'vomiting', 'chemotherapy-induced nausea'] },
    safety: ['半夏宜用制品，孕妇慎用', '阴虚津伤、口渴者不宜']
  },
  {
    id: 'linggan_wuwei_jiangxin_tang',
    name: '苓甘五味姜辛汤',
    source: '《金匮要略·痰饮咳嗽病脉证并治》',
    six: '杂病',
    composition: [
      { herb: '茯苓', liang: 4 },
      { herb: '甘草', liang: 3 },
      { herb: '干姜', liang: 3 },
      { herb: '细辛', liang: 3 },
      { herb: '五味子', text: '半升', grams: '约 9g' }
    ],
    decoction: '上五味，以水八升，煮取三升，去滓，温服半升，日三服。',
    pattern: ['咳而胸满', '痰白清稀', '口不渴', '遇寒加重'],
    indicators: [
      { id: 'cough', w: 3 },
      { id: 'white_sputum', w: 3 },
      { id: 'chest_oppression', w: 1 },
      { id: 'chill_body', w: 1 },
      { id: 'saliva', w: 1 },
      { id: 'pulse_tight', w: 1 },
      { id: 'coat_white_greasy', w: 1 }
    ],
    contra: [{ id: 'yellow_sputum', w: 2 }, { id: 'thirst_cold', w: 1 }, { id: 'sore_throat', w: 1 }],
    clauses: [
      {
        ref: '《金匮要略·痰饮咳嗽病脉证并治》',
        text: '冲气即低，而反更咳，胸满者，用桂苓五味甘草汤去桂加干姜、细辛，以治其咳满。'
      }
    ],
    modern: { terms: ['Linggan Wuwei Jiangxin Tang'], conditions: ['chronic bronchitis', 'cough', 'asthma'] },
    safety: ['细辛原方三两→9g，超现代常用量，宜减至 3g 并久煎', '痰热、干咳无痰者禁用']
  },

  // ── 水气病 ────────────────────────────────────────────
  {
    id: 'yuebi_tang',
    name: '越婢汤',
    source: '《金匮要略·水气病脉证并治》',
    doseCap: { 麻黄: 9 },
    six: '杂病',
    composition: [
      { herb: '麻黄', liang: 6, prep: '去节' },
      { herb: '石膏', text: '半斤', grams: '24g', prep: '碎，绵裹' },
      { herb: '生姜', liang: 3, prep: '切' },
      { herb: '大枣', count: 15, unit: '枚', prep: '擘' },
      { herb: '甘草', liang: 2, prep: '炙' }
    ],
    decoction: '上五味，以水六升，先煮麻黄，去上沫，内诸药，煮取三升，分温三服。恶风者加附子一枚炮；风水加术四两。',
    pattern: ['一身悉肿', '恶风', '脉浮', '续自汗出', '无大热'],
    indicators: [
      { id: 'edema', w: 3 },
      { id: 'aversion_wind', w: 2 },
      { id: 'spontaneous_sweat', w: 2 },
      { id: 'pulse_float', w: 2 },
      { id: 'difficult_urine', w: 1 },
      { id: 'fever', w: 1 },
      { id: 'thirst', w: 1 }
    ],
    contra: [{ id: 'no_sweat', w: 1 }, { id: 'chill_body', w: 2 }, { id: 'cold_limbs', w: 1 }],
    clauses: [
      {
        ref: '《金匮要略·水气病脉证并治》',
        text: '风水恶风，一身悉肿，脉浮不渴，续自汗出，无大热，越婢汤主之。'
      }
    ],
    modern: { terms: ['Yuebi Tang', 'Eppi-to'], conditions: ['nephritic edema', 'nephrotic syndrome'] },
    safety: [
      '麻黄六两≈18g，现代临床宜减至 6–9g；高血压、心脏病者禁用或大减',
      '得汗即止，不可过汗',
      '阴虚、湿热者不宜'
    ]
  },
  {
    id: 'fangji_fuling_tang',
    name: '防己茯苓汤',
    source: '《金匮要略·水气病脉证并治》',
    six: '杂病',
    composition: [
      { herb: '防己', liang: 3 },
      { herb: '黄芪', liang: 3 },
      { herb: '桂枝', liang: 3 },
      { herb: '茯苓', liang: 6 },
      { herb: '甘草', liang: 2 }
    ],
    decoction: '上五味，以水六升，煮取二升，分温三服。',
    pattern: ['皮水四肢肿', '水气在皮肤中', '四肢聂聂动', '小便不利'],
    indicators: [
      { id: 'edema', w: 3 },
      { id: 'muscle_twitch', w: 2 },
      { id: 'difficult_urine', w: 2 },
      { id: 'heavy_body', w: 1 },
      { id: 'fatigue', w: 1 },
      { id: 'palpitation', w: 1 },
      { id: 'tongue_swollen', w: 1 }
    ],
    contra: [{ id: 'thirst_cold', w: 1 }, { id: 'night_sweat', w: 1 }],
    clauses: [
      {
        ref: '《金匮要略·水气病脉证并治》',
        text: '皮水为病，四肢肿，水气在皮肤中，四肢聂聂动者，防己茯苓汤主之。'
      }
    ],
    modern: { terms: ['Fangji Fuling Tang'], conditions: ['edema', 'heart failure', 'nephrotic syndrome'] },
    safety: ['防己有肾毒性报道，肾功能不全者慎用', '阴虚津亏者不宜']
  },

  // ── 黄疸病 ────────────────────────────────────────────
  {
    id: 'zhizi_dahuang_tang',
    name: '栀子大黄汤',
    source: '《金匮要略·黄疸病脉证并治》',
    six: '杂病',
    composition: [
      { herb: '栀子', count: 14, unit: '枚', prep: '擘' },
      { herb: '大黄', liang: 1 },
      { herb: '枳实', count: 5, unit: '枚', prep: '炙' },
      { herb: '香豉', text: '一升', grams: '约 12g', prep: '绵裹' }
    ],
    decoction: '上四味，以水六升，煮取二升，分温三服。',
    pattern: ['酒黄疸', '心中懊憹', '身黄', '小便不利', '腹满'],
    indicators: [
      { id: 'jaundice', w: 3 },
      { id: 'restlessness', w: 2 },
      { id: 'chest_oppression', w: 2 },
      { id: 'dark_urine', w: 2 },
      { id: 'abdominal_fullness', w: 1 },
      { id: 'thirst', w: 1 },
      { id: 'insomnia', w: 1 }
    ],
    contra: [{ id: 'cold_limbs', w: 2 }, { id: 'tongue_pale', w: 1 }, { id: 'loose_stool', w: 2 }],
    clauses: [
      {
        ref: '《金匮要略·黄疸病脉证并治》',
        text: '酒黄疸，心中懊憹或热痛，栀子大黄汤主之。'
      }
    ],
    modern: { terms: ['Zhizi Dahuang Tang'], conditions: ['alcoholic hepatitis', 'jaundice'] },
    safety: ['阴黄、虚寒者禁用', '孕妇禁用', '中病即止，防伤脾胃']
  },
  {
    id: 'yinchen_wuling_san',
    name: '茵陈五苓散',
    source: '《金匮要略·黄疸病脉证并治》',
    doseBasis: 'ratio',
    six: '杂病',
    composition: [
      { herb: '茵陈蒿', text: '十分', grams: '约 30g' },
      { herb: '五苓散', text: '五分', grams: '约 15g' }
    ],
    decoction: '上二物和，先食饮方寸匕，日三服。现代：茵陈 30g 煎汤，送服五苓散 6g，日二次；或合方水煎服。',
    pattern: ['黄疸', '小便不利', '湿重于热', '身重'],
    indicators: [
      { id: 'jaundice', w: 3 },
      { id: 'difficult_urine', w: 3 },
      { id: 'heavy_body', w: 2 },
      { id: 'thirst', w: 1 },
      { id: 'edema', w: 1 },
      { id: 'poor_appetite', w: 1 },
      { id: 'coat_white_greasy', w: 1 }
    ],
    contra: [{ id: 'cold_limbs', w: 1 }, { id: 'tongue_red', w: 1 }],
    clauses: [
      {
        ref: '《金匮要略·黄疸病脉证并治》',
        text: '黄疸病，茵陈五苓散主之。'
      }
    ],
    modern: { terms: ['Yinchen Wuling San'], conditions: ['jaundice', 'hepatitis', 'cholestasis'] },
    safety: ['阴黄（寒湿）不宜单用', '孕妇慎用']
  },

  // ── 惊悸吐衄下血胸满瘀血病 ────────────────────────────
  {
    id: 'huangtu_tang',
    name: '黄土汤',
    source: '《金匮要略·惊悸吐衄下血胸满瘀血病脉证并治》',
    six: '杂病',
    composition: [
      { herb: '甘草', liang: 3 },
      { herb: '干地黄', liang: 3 },
      { herb: '白术', liang: 3 },
      { herb: '附子', liang: 3, prep: '炮' },
      { herb: '阿胶', liang: 3 },
      { herb: '黄芩', liang: 3 },
      { herb: '灶心黄土', text: '半斤', grams: '约 30g（先煎取汤代水）' }
    ],
    decoction: '上七味，以水八升，煮取三升，分温二服。现代：灶心黄土先煎澄清，取上清液煎余药，阿胶烊化。',
    pattern: ['下血先便后血', '远血', '血色暗淡', '肢冷面白', '舌淡脉细'],
    indicators: [
      { id: 'bleeding', w: 3 },
      { id: 'chill_body', w: 2 },
      { id: 'cold_limbs', w: 2 },
      { id: 'fatigue', w: 2 },
      { id: 'loose_stool', w: 1 },
      { id: 'tongue_pale', w: 1 },
      { id: 'pulse_thin', w: 1 }
    ],
    contra: [{ id: 'fever', w: 1 }, { id: 'dark_urine', w: 1 }, { id: 'tongue_red', w: 1 }],
    clauses: [
      {
        ref: '《金匮要略·惊悸吐衄下血胸满瘀血病脉证并治》',
        text: '下血，先便后血，此远血也，黄土汤主之。'
      }
    ],
    modern: { terms: ['Huangtu Tang'], conditions: ['gastrointestinal bleeding', 'ulcerative colitis'] },
    safety: ['出血量大、面色苍白、血压下降者须立即急诊，不可自行服药', '附子先煎', '湿热出血禁用']
  },
  {
    id: 'xiexin_tang',
    name: '泻心汤',
    alias: '大黄黄连泻心汤',
    source: '《金匮要略·惊悸吐衄下血胸满瘀血病脉证并治》',
    six: '杂病',
    composition: [
      { herb: '大黄', liang: 2 },
      { herb: '黄连', liang: 1 },
      { herb: '黄芩', liang: 1 }
    ],
    decoction: '上三味，以水三升，煮取一升，顿服之。',
    pattern: ['吐血衄血', '心烦面赤', '便秘', '舌红脉数'],
    indicators: [
      { id: 'bleeding', w: 3 },
      { id: 'irritability', w: 2 },
      { id: 'constipation', w: 2 },
      { id: 'tongue_red', w: 2 },
      { id: 'pulse_rapid', w: 1 },
      { id: 'insomnia', w: 1 },
      { id: 'epigastric_pain', w: 1 }
    ],
    contra: [{ id: 'pulse_weak', w: 2 }, { id: 'cold_limbs', w: 2 }, { id: 'loose_stool', w: 2 }],
    clauses: [
      {
        ref: '《金匮要略·惊悸吐衄下血胸满瘀血病脉证并治》',
        text: '心气不足，吐血衄血，泻心汤主之。'
      }
    ],
    modern: { terms: ['Xiexin Tang'], conditions: ['upper gastrointestinal bleeding', 'hypertension', 'gastritis'] },
    safety: ['苦寒直折，虚寒出血禁用', '孕妇禁用', '中病即止，不可久服']
  },
  {
    id: 'baiye_tang',
    name: '柏叶汤',
    source: '《金匮要略·惊悸吐衄下血胸满瘀血病脉证并治》',
    six: '杂病',
    composition: [
      { herb: '柏叶', liang: 3 },
      { herb: '干姜', liang: 3 },
      { herb: '艾叶', text: '三把', grams: '约 9g' }
    ],
    decoction: '上三味，以水五升，取马通汁一升，合煮取一升，分温再服。现代：以童便或清水代马通汁，水煎温服。',
    pattern: ['吐血不止', '血色暗淡', '面色苍白', '畏寒'],
    indicators: [
      { id: 'bleeding', w: 3 },
      { id: 'chill_body', w: 2 },
      { id: 'cold_limbs', w: 2 },
      { id: 'fatigue', w: 1 },
      { id: 'tongue_pale', w: 1 },
      { id: 'pulse_weak', w: 1 }
    ],
    contra: [{ id: 'fever', w: 1 }, { id: 'tongue_red', w: 2 }, { id: 'pulse_rapid', w: 1 }],
    clauses: [
      {
        ref: '《金匮要略·惊悸吐衄下血胸满瘀血病脉证并治》',
        text: '吐血不止者，柏叶汤主之。'
      }
    ],
    modern: { terms: ['Baiye Tang'], conditions: ['hemoptysis', 'hematemesis'] },
    safety: ['大咯血、呕血须立即急诊', '阴虚火旺出血禁用', '马通汁现代多不用，可以童便或清水代之']
  },

  // ── 呕吐哕下利病 ──────────────────────────────────────
  {
    id: 'jupi_zhuru_tang',
    name: '橘皮竹茹汤',
    source: '《金匮要略·呕吐哕下利病脉证并治》',
    six: '杂病',
    composition: [
      { herb: '橘皮', text: '二升', grams: '约 12g' },
      { herb: '竹茹', text: '二升', grams: '约 12g' },
      { herb: '大枣', count: 30, unit: '枚', prep: '擘' },
      { herb: '生姜', text: '半斤', grams: '24g', prep: '切' },
      { herb: '甘草', liang: 5 },
      { herb: '人参', liang: 1 }
    ],
    decoction: '上六味，以水一斗，煮取三升，温服一升，日三服。',
    pattern: ['哕逆', '呃声低弱', '虚烦', '胃气上逆'],
    indicators: [
      { id: 'hiccup', w: 3 },
      { id: 'nausea', w: 2 },
      { id: 'fatigue', w: 1 },
      { id: 'irritability', w: 1 },
      { id: 'poor_appetite', w: 1 },
      { id: 'dry_mouth', w: 1 }
    ],
    contra: [{ id: 'cold_limbs', w: 1 }, { id: 'loose_stool', w: 1 }],
    clauses: [
      {
        ref: '《金匮要略·呕吐哕下利病脉证并治》',
        text: '哕逆者，橘皮竹茹汤主之。'
      }
    ],
    modern: { terms: ['Jupi Zhuru Tang'], conditions: ['hiccup', 'postoperative nausea'] },
    safety: ['虚寒呃逆不宜（当用丁香柿蒂类）', '甘草用量偏大，高血压、水肿者减量']
  },
  {
    id: 'dahuang_gancao_tang',
    name: '大黄甘草汤',
    source: '《金匮要略·呕吐哕下利病脉证并治》',
    six: '杂病',
    composition: [
      { herb: '大黄', liang: 4 },
      { herb: '甘草', liang: 1 }
    ],
    decoction: '上二味，以水三升，煮取一升，分温再服。',
    pattern: ['食已即吐', '便秘', '口臭', '胃肠积热'],
    indicators: [
      { id: 'vomiting', w: 3 },
      { id: 'constipation', w: 2 },
      { id: 'epigastric_pain', w: 1 },
      { id: 'thirst', w: 1 }
    ],
    contra: [{ id: 'loose_stool', w: 3 }, { id: 'cold_limbs', w: 2 }, { id: 'pulse_weak', w: 1 }],
    clauses: [
      {
        ref: '《金匮要略·呕吐哕下利病脉证并治》',
        text: '食已即吐者，大黄甘草汤主之。'
      }
    ],
    modern: { terms: ['Dahuang Gancao Tang'], conditions: ['vomiting', 'constipation', 'gastroparesis'] },
    safety: ['孕妇禁用', '虚寒呕吐禁用', '中病即止']
  },

  // ── 妇人妊娠 / 产后病 ─────────────────────────────────
  {
    id: 'danggui_beimu_kushen_wan',
    name: '当归贝母苦参丸',
    source: '《金匮要略·妇人妊娠病脉证并治》',
    contexts: ['pregnancy'],
    six: '杂病',
    composition: [
      { herb: '当归', liang: 4 },
      { herb: '贝母', liang: 4 },
      { herb: '苦参', liang: 4 }
    ],
    decoction: '上三味，末之，炼蜜丸如小豆大，饮服三丸，加至十丸。现代：每服 6g，日三次；亦可作汤剂。',
    pattern: ['妊娠小便难', '饮食如故', '尿频尿急', '下焦湿热'],
    indicators: [
      { id: 'difficult_urine', w: 3 },
      { id: 'frequent_urine', w: 2 },
      { id: 'dark_urine', w: 1 },
      { id: 'dry_mouth', w: 1 },
      { id: 'constipation', w: 1 }
    ],
    contra: [{ id: 'clear_urine', w: 2 }, { id: 'cold_limbs', w: 1 }],
    clauses: [
      {
        ref: '《金匮要略·妇人妊娠病脉证并治》',
        text: '妊娠，小便难，饮食如故，当归贝母苦参丸主之。'
      }
    ],
    modern: { terms: ['Danggui Beimu Kushen Wan'], conditions: ['urinary tract infection', 'pregnancy', 'urinary retention'] },
    safety: ['孕妇须在医师指导下使用（本方原为妊娠而设，但苦参苦寒，脾虚者慎）', '苦参苦寒败胃，不宜久服']
  },
  {
    id: 'zhishi_shaoyao_san',
    name: '枳实芍药散',
    source: '《金匮要略·妇人产后病脉证并治》',
    contexts: ['postpartum'],
    doseBasis: 'ratio',
    six: '杂病',
    composition: [
      { herb: '枳实', text: '等分', prep: '烧令黑，勿太过' },
      { herb: '芍药', text: '等分' }
    ],
    decoction: '上二味，杵为散，服方寸匕，日三服，并主痈脓，以麦粥下之。现代：研末，每服 6g，日三次，米汤送服；或水煎服。',
    pattern: ['产后腹痛', '烦满不得卧', '腹胀', '气血郁滞'],
    indicators: [
      { id: 'abdominal_pain', w: 3 },
      { id: 'abdominal_fullness', w: 2 },
      { id: 'restlessness', w: 2 },
      { id: 'insomnia', w: 1 },
      { id: 'lower_abdomen', w: 1 }
    ],
    contra: [{ id: 'bleeding', w: 1 }, { id: 'pulse_weak', w: 1 }],
    clauses: [
      {
        ref: '《金匮要略·妇人产后病脉证并治》',
        text: '产后腹痛，烦满不得卧，枳实芍药散主之。'
      }
    ],
    modern: { terms: ['Zhishi Shaoyao San'], conditions: ['postpartum pain', 'abdominal distension'] },
    safety: ['产后出血多、体虚者慎用', '孕妇慎用枳实']
  }
]
