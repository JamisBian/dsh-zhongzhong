// 经方库 ·《金匮要略》续二：肺痿肺痈 / 胸痹心痛 / 腹满寒疝 / 五脏风寒 / 痰饮 / 消渴

export const JINGUI_FORMULAS_3 = [
  // ── 肺痿肺痈咳嗽上气（续） ────────────────────────────
  {
    id: 'zaojia_wan',
    name: '皂荚丸',
    source: '《金匮要略·肺痿肺痈咳嗽上气病脉证并治》',
    doseBasis: 'ratio',
    six: '杂病',
    composition: [
      { herb: '皂荚', text: '八两', grams: '24g', prep: '刮去皮，酥炙' },
      { herb: '大枣', text: '枣膏', grams: '适量（和汤送服）' }
    ],
    decoction: '上一味，末之，蜜丸梧子大，以枣膏和汤服三丸，日三夜一服。现代：多入汤剂，皂荚 3–6g，需医师指导。',
    pattern: ['咳逆上气', '时时吐浊', '但坐不得眠'],
    indicators: [
      { id: 'cough', w: 3 },
      { id: 'orthopnea', w: 3 },
      { id: 'yellow_sputum', w: 1 },
      { id: 'wheezing', w: 2 },
      { id: 'chest_oppression', w: 1 }
    ],
    contra: [{ id: 'pulse_weak', w: 2 }, { id: 'fatigue', w: 1 }, { id: 'dry_mouth', w: 1 }],
    clauses: [
      {
        ref: '《金匮要略·肺痿肺痈咳嗽上气病脉证并治》',
        text: '咳逆上气，时时吐浊，但坐不得眠，皂荚丸主之。'
      }
    ],
    modern: { terms: ['Zaojia Wan'], conditions: ['asthma', 'bronchitis'] },
    safety: ['皂荚辛烈，刺激胃黏膜，胃炎、胃溃疡者慎用', '体虚、孕妇禁用', '中病即止，不可久服']
  },
  {
    id: 'houpo_mahuang_tang',
    name: '厚朴麻黄汤',
    source: '《金匮要略·肺痿肺痈咳嗽上气病脉证并治》',
    six: '杂病',
    composition: [
      { herb: '厚朴', liang: 5 },
      { herb: '麻黄', liang: 4, prep: '去节' },
      { herb: '石膏', text: '如鸡子大', grams: '约 30g', prep: '碎' },
      { herb: '杏仁', text: '半升', grams: '约 9g' },
      { herb: '半夏', text: '半升', grams: '约 9g', prep: '洗' },
      { herb: '干姜', liang: 2 },
      { herb: '细辛', liang: 2 },
      { herb: '小麦', text: '一升', grams: '约 30g' },
      { herb: '五味子', text: '半升', grams: '约 9g' }
    ],
    decoction: '上九味，以水一斗二升，先煮小麦熟，去滓，内诸药，煮取三升，温服一升，日三服。',
    pattern: ['咳而脉浮', '胸满', '烦躁', '痰涎壅盛'],
    indicators: [
      { id: 'cough', w: 3 },
      { id: 'chest_oppression', w: 2 },
      { id: 'wheezing', w: 2 },
      { id: 'white_sputum', w: 1 },
      { id: 'restlessness', w: 1 },
      { id: 'pulse_float', w: 2 }
    ],
    contra: [{ id: 'pulse_deep', w: 1 }, { id: 'yellow_sputum', w: 1 }],
    clauses: [
      {
        ref: '《金匮要略·肺痿肺痈咳嗽上气病脉证并治》',
        text: '咳而脉浮者，厚朴麻黄汤主之。'
      }
    ],
    modern: { terms: ['Houpo Mahuang Tang'], conditions: ['asthma', 'bronchitis'] },
    safety: ['麻黄、细辛用量偏大，高血压、心脏病者慎用；细辛宜久煎', '阴虚干咳者禁用']
  },
  {
    id: 'zeqi_tang',
    name: '泽漆汤',
    source: '《金匮要略·肺痿肺痈咳嗽上气病脉证并治》',
    six: '杂病',
    composition: [
      { herb: '半夏', text: '半升', grams: '约 9g', prep: '洗' },
      { herb: '紫参', text: '五两', grams: '15g' },
      { herb: '泽漆', text: '三斤', grams: '约 30g（先煎取汁）' },
      { herb: '生姜', liang: 5, prep: '切' },
      { herb: '白前', liang: 5 },
      { herb: '甘草', liang: 3 },
      { herb: '黄芩', liang: 3 },
      { herb: '人参', liang: 3 },
      { herb: '桂枝', liang: 3 }
    ],
    decoction: '上九味，㕮咀，内泽漆汁中，煮取五升，温服五合，至夜尽。',
    pattern: ['咳而脉沉', '水饮迫肺', '胸满', '身肿'],
    indicators: [
      { id: 'cough', w: 3 },
      { id: 'pulse_deep', w: 2 },
      { id: 'edema', w: 2 },
      { id: 'chest_oppression', w: 1 },
      { id: 'short_breath', w: 1 },
      { id: 'white_sputum', w: 1 }
    ],
    contra: [{ id: 'yellow_sputum', w: 1 }, { id: 'pulse_surging', w: 1 }],
    clauses: [
      {
        ref: '《金匮要略·肺痿肺痈咳嗽上气病脉证并治》',
        text: '咳而脉沉者，泽漆汤主之。'
      }
    ],
    modern: { terms: ['Zeqi Tang'], conditions: ['pleural effusion', 'lung cancer', 'chronic bronchitis'] },
    safety: ['泽漆有毒，需依法炮制并先煎取汁；孕妇禁用', '逐水之剂，体虚者慎用', '须在医师指导下使用']
  },
  {
    id: 'yuebi_jia_banxia_tang',
    name: '越婢加半夏汤',
    source: '《金匮要略·肺痿肺痈咳嗽上气病脉证并治》',
    doseCap: { 麻黄: 9 },
    six: '杂病',
    composition: [
      { herb: '麻黄', liang: 6, prep: '去节' },
      { herb: '石膏', text: '半斤', grams: '24g', prep: '碎，绵裹' },
      { herb: '生姜', liang: 3, prep: '切' },
      { herb: '大枣', count: 15, unit: '枚', prep: '擘' },
      { herb: '甘草', liang: 2, prep: '炙' },
      { herb: '半夏', text: '半升', grams: '约 9g', prep: '洗' }
    ],
    decoction: '上六味，以水六升，先煮麻黄，去上沫，内诸药，煮取三升，分温三服。',
    pattern: ['肺胀', '咳而上气', '其人喘', '目如脱状', '脉浮大'],
    indicators: [
      { id: 'wheezing', w: 3 },
      { id: 'cough', w: 3 },
      { id: 'pulse_float', w: 2 },
      { id: 'pulse_surging', w: 2 },
      { id: 'edema', w: 1 },
      { id: 'chest_oppression', w: 1 }
    ],
    contra: [{ id: 'pulse_weak', w: 2 }, { id: 'cold_limbs', w: 1 }, { id: 'white_sputum', w: 1 }],
    clauses: [
      {
        ref: '《金匮要略·肺痿肺痈咳嗽上气病脉证并治》',
        text: '咳而上气，此为肺胀，其人喘，目如脱状，脉浮大者，越婢加半夏汤主之。'
      }
    ],
    modern: { terms: ['Yuebi Jia Banxia Tang'], conditions: ['COPD', 'asthma'] },
    safety: [
      '麻黄六两≈18g，现代临床宜减至 6–9g；高血压、心脏病者禁用或大减',
      '肺胀急症（呼吸衰竭）须立即就医'
    ]
  },
  {
    id: 'xiao_qinglong_jia_shigao_tang',
    name: '小青龙加石膏汤',
    source: '《金匮要略·肺痿肺痈咳嗽上气病脉证并治》',
    six: '杂病',
    composition: [
      { herb: '麻黄', liang: 3, prep: '去节' },
      { herb: '芍药', liang: 3 },
      { herb: '桂枝', liang: 3 },
      { herb: '细辛', liang: 3 },
      { herb: '甘草', liang: 3 },
      { herb: '干姜', liang: 3 },
      { herb: '五味子', text: '半升', grams: '约 9g' },
      { herb: '半夏', text: '半升', grams: '约 9g', prep: '洗' },
      { herb: '石膏', liang: 2 }
    ],
    decoction: '上九味，以水一斗，先煮麻黄，去上沫，内诸药，煮取三升，强人服一升，羸者减之，日三服，小儿服四合。',
    pattern: ['肺胀', '咳而上气', '烦躁而喘', '脉浮'],
    indicators: [
      { id: 'cough', w: 3 },
      { id: 'wheezing', w: 2 },
      { id: 'restlessness', w: 3 },
      { id: 'white_sputum', w: 2 },
      { id: 'chest_oppression', w: 1 },
      { id: 'pulse_float', w: 1 },
      { id: 'thirst', w: 1 }
    ],
    contra: [{ id: 'yellow_sputum', w: 1 }, { id: 'night_sweat', w: 1 }],
    clauses: [
      {
        ref: '《金匮要略·肺痿肺痈咳嗽上气病脉证并治》',
        text: '肺胀，咳而上气，烦躁而喘，脉浮者，心下有水，小青龙加石膏汤主之。'
      }
    ],
    modern: { terms: ['Xiao Qinglong Jia Shigao Tang'], conditions: ['asthma', 'COPD'] },
    safety: ['细辛用量偏大，宜久煎并减量', '高血压者慎用麻黄', '阴虚燥咳禁用']
  },
  {
    id: 'qianjin_weijing_tang',
    name: '千金苇茎汤',
    alias: '苇茎汤',
    source: '《金匮要略·肺痿肺痈咳嗽上气病脉证并治》附方',
    six: '杂病',
    composition: [
      { herb: '苇茎', text: '二升', grams: '约 30g' },
      { herb: '薏苡仁', text: '半升', grams: '约 15g' },
      { herb: '桃仁', count: 50, unit: '个' },
      { herb: '瓜瓣', text: '半升', grams: '约 15g（冬瓜子）' }
    ],
    decoction: '上四味，以水一斗，先煮苇茎得五升，去滓，内诸药，煮取二升，服一升，再服，当吐如脓。',
    pattern: ['肺痈', '咳有微热', '烦满', '胸中甲错', '咳吐脓血'],
    indicators: [
      { id: 'cough', w: 3 },
      { id: 'yellow_sputum', w: 3 },
      { id: 'fever', w: 2 },
      { id: 'chest_oppression', w: 1 },
      { id: 'thirst', w: 1 },
      { id: 'pulse_rapid', w: 1 }
    ],
    contra: [{ id: 'white_sputum', w: 2 }, { id: 'cold_limbs', w: 1 }],
    clauses: [
      {
        ref: '《金匮要略·肺痿肺痈咳嗽上气病脉证并治》附方《千金》苇茎汤',
        text: '治咳有微热，烦满，胸中甲错，是为肺痈。'
      }
    ],
    modern: { terms: ['Qianjin Weijing Tang'], conditions: ['lung abscess', 'bronchiectasis', 'pneumonia'] },
    safety: ['肺痈（肺脓肿）须中西医结合，不可单靠本方', '孕妇慎用桃仁', '脾胃虚寒者慎用']
  },

  // ── 胸痹心痛短气（续） ────────────────────────────────
  {
    id: 'gualou_xiebai_baijiu_tang',
    name: '栝蒌薤白白酒汤',
    source: '《金匮要略·胸痹心痛短气病脉证并治》',
    six: '杂病',
    composition: [
      { herb: '栝蒌实', count: 1, unit: '枚', prep: '捣' },
      { herb: '薤白', text: '半斤', grams: '24g' },
      { herb: '白酒', text: '七升', grams: '适量（现代多以黄酒代之）' }
    ],
    decoction: '上三味，同煮，取二升，分温再服。',
    pattern: ['胸痹', '喘息咳唾', '胸背痛', '短气', '寸口脉沉而迟'],
    indicators: [
      { id: 'chest_pain', w: 3 },
      { id: 'chest_oppression', w: 3 },
      { id: 'short_breath', w: 2 },
      { id: 'cough', w: 1 },
      { id: 'white_sputum', w: 1 }
    ],
    contra: [{ id: 'bleeding', w: 1 }, { id: 'thirst_cold', w: 1 }],
    clauses: [
      {
        ref: '《金匮要略·胸痹心痛短气病脉证并治》',
        text: '胸痹之病，喘息咳唾，胸背痛，短气，寸口脉沉而迟，关上小紧数，栝蒌薤白白酒汤主之。'
      }
    ],
    modern: { terms: ['Gualou Xiebai Baijiu Tang'], conditions: ['angina', 'coronary heart disease'] },
    safety: ['胸痛持续不缓解须立即急诊', '胃弱者白酒减量或不用', '孕妇慎用']
  },
  {
    id: 'juzhi_jiang_tang',
    name: '橘枳姜汤',
    source: '《金匮要略·胸痹心痛短气病脉证并治》',
    six: '杂病',
    composition: [
      { herb: '橘皮', text: '一斤', grams: '30g' },
      { herb: '枳实', liang: 3 },
      { herb: '生姜', text: '半斤', grams: '24g', prep: '切' }
    ],
    decoction: '上三味，以水五升，煮取二升，分温再服。',
    pattern: ['胸痹', '胸中气塞', '短气'],
    indicators: [
      { id: 'chest_oppression', w: 3 },
      { id: 'short_breath', w: 2 },
      { id: 'belching', w: 1 },
      { id: 'epigastric_distention', w: 1 }
    ],
    contra: [{ id: 'thirst_cold', w: 1 }, { id: 'bleeding', w: 1 }],
    clauses: [
      {
        ref: '《金匮要略·胸痹心痛短气病脉证并治》',
        text: '胸痹，胸中气塞，短气，茯苓杏仁甘草汤主之；橘枳姜汤亦主之。'
      }
    ],
    modern: { terms: ['Ju Zhi Jiang Tang'], conditions: ['angina', 'functional chest tightness'] },
    safety: ['气滞偏实者宜，气虚短气者不宜', '孕妇慎用枳实']
  },
  {
    id: 'fuling_xingren_gancao_tang',
    name: '茯苓杏仁甘草汤',
    source: '《金匮要略·胸痹心痛短气病脉证并治》',
    six: '杂病',
    composition: [
      { herb: '茯苓', liang: 3 },
      { herb: '杏仁', count: 50, unit: '个' },
      { herb: '甘草', liang: 1 }
    ],
    decoction: '上三味，以水一斗，煮取五升，温服一升，日三服。不差，更服。',
    pattern: ['胸痹', '胸中气塞', '短气', '咳逆'],
    indicators: [
      { id: 'chest_oppression', w: 3 },
      { id: 'short_breath', w: 2 },
      { id: 'cough', w: 1 },
      { id: 'palpitation', w: 1 },
      { id: 'edema', w: 1 }
    ],
    contra: [{ id: 'dry_mouth', w: 1 }, { id: 'night_sweat', w: 1 }],
    clauses: [
      {
        ref: '《金匮要略·胸痹心痛短气病脉证并治》',
        text: '胸痹，胸中气塞，短气，茯苓杏仁甘草汤主之；橘枳姜汤亦主之。'
      }
    ],
    modern: { terms: ['Fuling Xingren Gancao Tang'], conditions: ['angina', 'palpitation'] },
    safety: ['饮停偏重者宜，气滞偏实者用橘枳姜汤']
  },
  {
    id: 'guizhi_shengjiang_zhishi_tang',
    name: '桂枝生姜枳实汤',
    source: '《金匮要略·胸痹心痛短气病脉证并治》',
    six: '杂病',
    composition: [
      { herb: '桂枝', liang: 3 },
      { herb: '生姜', liang: 3 },
      { herb: '枳实', count: 5, unit: '枚' }
    ],
    decoction: '上三味，以水六升，煮取三升，分温三服。',
    pattern: ['心中痞', '诸逆心悬痛', '气逆上冲'],
    indicators: [
      { id: 'epigastric_distention', w: 3 },
      { id: 'chest_pain', w: 2 },
      { id: 'qi_rush', w: 2 },
      { id: 'belching', w: 1 }
    ],
    contra: [{ id: 'thirst_cold', w: 1 }],
    clauses: [
      {
        ref: '《金匮要略·胸痹心痛短气病脉证并治》',
        text: '心中痞，诸逆心悬痛，桂枝生姜枳实汤主之。'
      }
    ],
    modern: { terms: ['Guizhi Shengjiang Zhishi Tang'], conditions: ['angina', 'gastritis'] },
    safety: ['阴虚火旺者不宜']
  },
  {
    id: 'wutou_chishizhi_wan',
    name: '乌头赤石脂丸',
    source: '《金匮要略·胸痹心痛短气病脉证并治》',
    doseBasis: 'ratio',
    six: '杂病',
    composition: [
      { herb: '蜀椒', liang: 1 },
      { herb: '乌头', text: '一分', grams: '约 1.5g', prep: '炮' },
      { herb: '附子', liang: 0.5, prep: '炮' },
      { herb: '干姜', liang: 1 },
      { herb: '赤石脂', liang: 1 }
    ],
    decoction: '上五味，末之，蜜丸如梧子大，先食服一丸，日三服。不知，稍加服。',
    pattern: ['心痛彻背', '背痛彻心', '遇寒剧发'],
    indicators: [
      { id: 'chest_pain', w: 3 },
      { id: 'chill_body', w: 2 },
      { id: 'cold_limbs', w: 2 },
      { id: 'chest_oppression', w: 1 },
      { id: 'pulse_tight', w: 1 }
    ],
    contra: [{ id: 'fever', w: 2 }, { id: 'thirst_cold', w: 2 }, { id: 'tongue_red', w: 1 }],
    clauses: [
      {
        ref: '《金匮要略·胸痹心痛短气病脉证并治》',
        text: '心痛彻背，背痛彻心，乌头赤石脂丸主之。'
      }
    ],
    modern: { terms: ['Wutou Chishizhi Wan'], conditions: ['angina', 'myocardial infarction'] },
    safety: [
      '乌头、附子同用，毒性叠加，必须严格炮制并小剂量起始；出现口麻心悸立即急诊',
      '心梗胸痛须立即拨打 120，不可依赖本方',
      '孕妇禁用'
    ]
  },

  // ── 腹满寒疝宿食（续） ────────────────────────────────
  {
    id: 'houpo_qi_wu_tang',
    name: '厚朴七物汤',
    source: '《金匮要略·腹满寒疝宿食病脉证并治》',
    six: '杂病',
    composition: [
      { herb: '厚朴', text: '半斤', grams: '24g' },
      { herb: '甘草', liang: 3 },
      { herb: '大黄', liang: 3 },
      { herb: '大枣', count: 10, unit: '枚' },
      { herb: '枳实', count: 5, unit: '枚' },
      { herb: '桂枝', liang: 2 },
      { herb: '生姜', liang: 5 }
    ],
    decoction: '上七味，以水一斗，煮取四升，温服八合，日三服。呕者加半夏五合；下利去大黄；寒多者加生姜至半斤。',
    pattern: ['腹满', '发热十日', '脉浮而数', '饮食如故'],
    indicators: [
      { id: 'abdominal_fullness', w: 3 },
      { id: 'fever', w: 2 },
      { id: 'constipation', w: 2 },
      { id: 'pulse_float', w: 1 },
      { id: 'pulse_rapid', w: 1 }
    ],
    contra: [{ id: 'diarrhea', w: 2 }, { id: 'cold_limbs', w: 1 }],
    clauses: [
      {
        ref: '《金匮要略·腹满寒疝宿食病脉证并治》',
        text: '病腹满，发热十日，脉浮而数，饮食如故，厚朴七物汤主之。'
      }
    ],
    modern: { terms: ['Houpo Qi Wu Tang'], conditions: ['constipation', 'postoperative ileus'] },
    safety: ['孕妇禁用', '表里同病，里实不甚者慎用']
  },
  {
    id: 'houpo_sanwu_tang',
    name: '厚朴三物汤',
    source: '《金匮要略·腹满寒疝宿食病脉证并治》',
    six: '杂病',
    composition: [
      { herb: '厚朴', text: '八两', grams: '24g' },
      { herb: '大黄', liang: 4 },
      { herb: '枳实', count: 5, unit: '枚' }
    ],
    decoction: '上三味，以水一斗二升，先煮二味，取五升，内大黄，煮取三升，温服一升，以利为度。',
    pattern: ['痛而闭', '腹满', '大便不通'],
    indicators: [
      { id: 'abdominal_pain', w: 3 },
      { id: 'constipation', w: 3 },
      { id: 'abdominal_fullness', w: 2 },
      { id: 'pulse_slippery', w: 1 }
    ],
    contra: [{ id: 'diarrhea', w: 3 }, { id: 'pulse_weak', w: 2 }],
    clauses: [
      {
        ref: '《金匮要略·腹满寒疝宿食病脉证并治》',
        text: '痛而闭者，厚朴三物汤主之。'
      }
    ],
    modern: { terms: ['Houpo Sanwu Tang'], conditions: ['constipation', 'intestinal obstruction'] },
    safety: ['孕妇禁用', '得利即止', '肠梗阻须先排除外科情况']
  },
  {
    id: 'fuzi_jingmi_tang',
    name: '附子粳米汤',
    source: '《金匮要略·腹满寒疝宿食病脉证并治》',
    six: '杂病',
    composition: [
      { herb: '附子', count: 1, unit: '枚', prep: '炮' },
      { herb: '半夏', text: '半升', grams: '约 9g' },
      { herb: '甘草', liang: 1 },
      { herb: '大枣', count: 10, unit: '枚' },
      { herb: '粳米', text: '半升', grams: '约 15g' }
    ],
    decoction: '上五味，以水八升，煮米熟汤成，去滓，温服一升，日三服。',
    pattern: ['腹中寒气', '雷鸣切痛', '胸胁逆满', '呕吐'],
    indicators: [
      { id: 'abdominal_pain', w: 3 },
      { id: 'borborygmus', w: 3 },
      { id: 'vomiting', w: 2 },
      { id: 'chill_body', w: 2 },
      { id: 'hypochondriac', w: 1 },
      { id: 'cold_limbs', w: 1 }
    ],
    contra: [{ id: 'fever', w: 1 }, { id: 'thirst_cold', w: 2 }],
    clauses: [
      {
        ref: '《金匮要略·腹满寒疝宿食病脉证并治》',
        text: '腹中寒气，雷鸣切痛，胸胁逆满，呕吐，附子粳米汤主之。'
      }
    ],
    modern: { terms: ['Fuzi Jingmi Tang'], conditions: ['abdominal pain', 'gastroenteritis'] },
    safety: ['附子炮制先煎 60 分钟以上', '孕妇慎用半夏、附子', '急腹症须先就医']
  },
  {
    id: 'xuanfuhua_tang',
    name: '旋覆花汤',
    source: '《金匮要略·五脏风寒积聚病脉证并治》',
    six: '杂病',
    composition: [
      { herb: '旋覆花', liang: 3 },
      { herb: '葱', count: 14, unit: '茎' },
      { herb: '新绛', text: '少许', grams: '约 3g（可用茜草代之）' }
    ],
    decoction: '上三味，以水三升，煮取一升，顿服。',
    pattern: ['肝着', '常欲蹈其胸上', '但欲饮热', '胸胁痞闷'],
    indicators: [
      { id: 'chest_oppression', w: 3 },
      { id: 'hypochondriac', w: 2 },
      { id: 'thirst', w: 1 },
      { id: 'belching', w: 1 },
      { id: 'chest_pain', w: 1 }
    ],
    contra: [{ id: 'bleeding', w: 1 }],
    clauses: [
      {
        ref: '《金匮要略·五脏风寒积聚病脉证并治》',
        text: '肝着，其人常欲蹈其胸上，先未苦时，但欲饮热，旋覆花汤主之。'
      }
    ],
    modern: { terms: ['Xuanfuhua Tang'], conditions: ['liver disease', 'chest tightness'] },
    safety: ['旋覆花有绒毛，需包煎', '孕妇慎用']
  },
  {
    id: 'ganjiang_lingzhu_tang',
    name: '甘姜苓术汤',
    alias: '肾着汤',
    source: '《金匮要略·五脏风寒积聚病脉证并治》',
    six: '杂病',
    composition: [
      { herb: '甘草', liang: 2 },
      { herb: '白术', liang: 2 },
      { herb: '干姜', liang: 4 },
      { herb: '茯苓', liang: 4 }
    ],
    decoction: '上四味，以水五升，煮取三升，分温三服，腰中即温。',
    pattern: ['身体重', '腰中冷', '如坐水中', '腰以下冷痛', '小便自利'],
    indicators: [
      { id: 'back_ache', w: 3 },
      { id: 'heavy_body', w: 3 },
      { id: 'chill_body', w: 2 },
      { id: 'clear_urine', w: 1 },
      { id: 'edema', w: 1 },
      { id: 'tongue_pale', w: 1 },
      { id: 'coat_white_greasy', w: 1 }
    ],
    contra: [{ id: 'thirst_cold', w: 2 }, { id: 'tongue_red', w: 1 }],
    clauses: [
      {
        ref: '《金匮要略·五脏风寒积聚病脉证并治》',
        text: '肾着之病，其人身体重，腰中冷，如坐水中，形如水状，反不渴，小便自利，饮食如故，病属下焦，身劳汗出，衣里冷湿，久久得之，腰以下冷痛，腹重如带五千钱，甘姜苓术汤主之。'
      }
    ],
    modern: { terms: ['Ganjiang Lingzhu Tang'], conditions: ['low back pain', 'lumbago'] },
    safety: ['湿热腰痛不宜', '阴虚者慎用']
  },

  // ── 痰饮咳嗽（续） ────────────────────────────────────
  {
    id: 'shizao_tang',
    name: '十枣汤',
    source: '《金匮要略·痰饮咳嗽病脉证并治》',
    doseBasis: 'ratio',
    six: '杂病',
    composition: [
      { herb: '芫花', text: '等分', prep: '熬' },
      { herb: '甘遂', text: '等分' },
      { herb: '大戟', text: '等分' },
      { herb: '大枣', count: 10, unit: '枚', prep: '肥者，擘' }
    ],
    decoction: '上三味，捣筛，以水一升五合，先煮肥大枣十枚，取八合，去滓，内药末，强人服一钱匕，羸人服半钱，平旦温服之；不下者，明日更加半钱。得快下后，糜粥自养。',
    pattern: ['悬饮', '咳唾胸胁引痛', '脉沉而弦', '心下痞硬满'],
    indicators: [
      { id: 'hypochondriac', w: 3 },
      { id: 'cough', w: 2 },
      { id: 'chest_oppression', w: 2 },
      { id: 'pulse_deep', w: 2 },
      { id: 'pulse_wiry', w: 1 },
      { id: 'short_breath', w: 1 }
    ],
    contra: [{ id: 'pulse_weak', w: 3 }, { id: 'fatigue', w: 2 }, { id: 'cold_limbs', w: 2 }],
    clauses: [
      {
        ref: '《金匮要略·痰饮咳嗽病脉证并治》',
        text: '脉沉而弦者，悬饮内痛。病悬饮者，十枣汤主之。'
      }
    ],
    modern: { terms: ['Shizao Tang'], conditions: ['pleural effusion', 'ascites'] },
    safety: [
      '峻下逐水之猛剂：芫花、甘遂、大戟均有毒，必须严格控量，孕妇、体虚、心肾功能不全者禁用',
      '只可暂用，中病即止；服药期间观察电解质与尿量',
      '必须由医师处方与监护，绝不可自行服用'
    ]
  },
  {
    id: 'mufangji_tang',
    name: '木防己汤',
    source: '《金匮要略·痰饮咳嗽病脉证并治》',
    six: '杂病',
    composition: [
      { herb: '木防己', liang: 3 },
      { herb: '石膏', text: '十二枚鸡子大', grams: '约 30g', prep: '碎' },
      { herb: '桂枝', liang: 2 },
      { herb: '人参', liang: 4 }
    ],
    decoction: '上四味，以水六升，煮取二升，分温再服。虚者即愈；实者三日复发，复与不愈者，宜木防己汤去石膏加茯苓芒硝汤主之。',
    pattern: ['膈间支饮', '喘满', '心下痞坚', '面色黧黑', '脉沉紧'],
    indicators: [
      { id: 'wheezing', w: 3 },
      { id: 'chest_oppression', w: 2 },
      { id: 'epigastric_distention', w: 2 },
      { id: 'edema', w: 1 },
      { id: 'short_breath', w: 2 },
      { id: 'pulse_deep', w: 1 },
      { id: 'pulse_tight', w: 1 }
    ],
    contra: [{ id: 'pulse_weak', w: 1 }, { id: 'cold_limbs', w: 1 }],
    clauses: [
      {
        ref: '《金匮要略·痰饮咳嗽病脉证并治》',
        text: '膈间支饮，其人喘满，心下痞坚，面色黧黑，其脉沉紧，得之数十日，医吐下之不愈，木防己汤主之。'
      }
    ],
    modern: { terms: ['Mufangji Tang'], conditions: ['heart failure', 'pleural effusion'] },
    safety: ['防己有肾毒性报道，肾功能不全者慎用', '心衰喘满需规范抗心衰治疗', '石膏大寒，脾胃虚寒者慎用']
  },
  {
    id: 'jijiaolihuang_wan',
    name: '己椒苈黄丸',
    alias: '防己椒目葶苈大黄丸',
    source: '《金匮要略·痰饮咳嗽病脉证并治》',
    doseBasis: 'han',
    six: '杂病',
    composition: [
      { herb: '防己', liang: 1 },
      { herb: '椒目', liang: 1 },
      { herb: '葶苈子', liang: 1, prep: '熬' },
      { herb: '大黄', liang: 1 }
    ],
    decoction: '上四味，末之，蜜丸如梧子大，先食饮服一丸，日三服，稍增，口中有津液。渴者加芒硝半两。',
    pattern: ['腹满', '口舌干燥', '肠间有水气', '小便不利'],
    indicators: [
      { id: 'abdominal_fullness', w: 3 },
      { id: 'dry_mouth', w: 2 },
      { id: 'borborygmus', w: 2 },
      { id: 'difficult_urine', w: 1 },
      { id: 'constipation', w: 1 }
    ],
    contra: [{ id: 'pulse_weak', w: 2 }, { id: 'loose_stool', w: 1 }],
    clauses: [
      {
        ref: '《金匮要略·痰饮咳嗽病脉证并治》',
        text: '腹满，口舌干燥，此肠间有水气，己椒苈黄丸主之。'
      }
    ],
    modern: { terms: ['Jijiaolihuang Wan'], conditions: ['ascites', 'intestinal obstruction'] },
    safety: ['攻逐之剂，体虚、孕妇禁用', '防己肾毒性，肾功能不全者慎用']
  },
  {
    id: 'guiling_wuwei_gancao_tang',
    name: '桂苓五味甘草汤',
    source: '《金匮要略·痰饮咳嗽病脉证并治》',
    six: '杂病',
    composition: [
      { herb: '茯苓', liang: 4 },
      { herb: '桂枝', liang: 4, prep: '去皮' },
      { herb: '甘草', liang: 3, prep: '炙' },
      { herb: '五味子', text: '半升', grams: '约 9g' }
    ],
    decoction: '上四味，以水八升，煮取三升，去滓，分温三服。',
    pattern: ['气从小腹上冲胸咽', '手足厥逆', '面翕热如醉', '小便难'],
    indicators: [
      { id: 'qi_rush', w: 3 },
      { id: 'cold_limbs', w: 2 },
      { id: 'hot_palms', w: 1 },
      { id: 'difficult_urine', w: 1 },
      { id: 'dizziness', w: 1 }
    ],
    contra: [{ id: 'thirst_cold', w: 1 }],
    clauses: [
      {
        ref: '《金匮要略·痰饮咳嗽病脉证并治》',
        text: '青龙汤下已，多唾口燥，寸脉沉，尺脉微，手足厥逆，气从小腹上冲胸咽，手足痹，其面翕热如醉状，因复下流阴股，小便难，时复冒者，与茯苓桂枝五味甘草汤，治其气冲。'
      }
    ],
    modern: { terms: ['Guiling Wuwei Gancao Tang'], conditions: ['anxiety', 'palpitation'] },
    safety: ['须在医师指导下使用', '阴虚火旺者不宜']
  },
  {
    id: 'gualou_qumai_wan',
    name: '栝蒌瞿麦丸',
    source: '《金匮要略·消渴小便不利淋病脉证并治》',
    six: '杂病',
    composition: [
      { herb: '栝蒌根', liang: 2 },
      { herb: '茯苓', liang: 3 },
      { herb: '薯蓣', liang: 3 },
      { herb: '附子', count: 1, unit: '枚', prep: '炮' },
      { herb: '瞿麦', liang: 1 }
    ],
    decoction: '上五味，末之，炼蜜丸梧子大，饮服三丸，日三服。不知，增至七八丸，以小便利，腹中温为知。',
    pattern: ['小便不利', '有水气', '其人若渴', '腹中冷'],
    indicators: [
      { id: 'difficult_urine', w: 3 },
      { id: 'thirst', w: 2 },
      { id: 'edema', w: 2 },
      { id: 'cold_limbs', w: 1 },
      { id: 'clear_urine', w: 1 },
      { id: 'fatigue', w: 1 }
    ],
    contra: [{ id: 'dark_urine', w: 1 }, { id: 'tongue_red', w: 1 }],
    clauses: [
      {
        ref: '《金匮要略·消渴小便不利淋病脉证并治》',
        text: '小便不利者，有水气，其人若渴，栝蒌瞿麦丸主之。'
      }
    ],
    modern: { terms: ['Gualou Qumai Wan'], conditions: ['diabetes', 'benign prostatic hyperplasia'] },
    safety: ['附子炮制，需医师指导', '湿热淋证不宜']
  }
]
