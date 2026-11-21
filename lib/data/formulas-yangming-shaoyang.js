// 经方库 · 阳明病篇 / 少阳病篇

export const YANGMING_SHAOYANG_FORMULAS = [
  // ── 阳明 ──────────────────────────────────────────────
  {
    id: 'baihu_tang',
    name: '白虎汤',
    source: '《伤寒论·辨阳明病脉证并治》',
    six: '阳明',
    composition: [
      { herb: '石膏', text: '一斤', grams: '48g', prep: '碎，绵裹' },
      { herb: '知母', liang: 6 },
      { herb: '甘草', liang: 2, prep: '炙' },
      { herb: '粳米', text: '六合', grams: '约 30g' }
    ],
    decoction: '上四味，以水一斗，煮米熟汤成，去滓，温服一升，日三服。',
    pattern: ['大热', '大汗出', '大渴喜冷饮', '脉洪大'],
    indicators: [
      { id: 'fever', w: 3 },
      { id: 'profuse_sweat', w: 3 },
      { id: 'thirst_cold', w: 3 },
      { id: 'pulse_surging', w: 3 },
      { id: 'restlessness', w: 2 },
      { id: 'dry_mouth', w: 2 },
      { id: 'hard_stool', w: 1 }
    ],
    contra: [
      { id: 'chill_body', w: 2 },
      { id: 'pulse_weak', w: 2 },
      { id: 'loose_stool', w: 2 },
      { id: 'no_sweat', w: 1 }
    ],
    clauses: [
      {
        ref: '《伤寒论·辨阳明病脉证并治》第219条',
        text: '三阳合病，腹满身重，难以转侧，口不仁，面垢，谵语遗尿。发汗则谵语，下之则额上生汗、手足逆冷。若自汗出者，白虎汤主之。'
      }
    ],
    modern: { terms: ['Baihu Tang', 'Byakko-to'], conditions: ['high fever', 'diabetes', 'inflammation'] },
    safety: ['表证未解、无汗恶寒者禁用', '脾胃虚寒、脉微细者禁用', '石膏用量大，需中病即止']
  },
  {
    id: 'baihu_jia_renshen_tang',
    name: '白虎加人参汤',
    source: '《伤寒论·辨太阳病脉证并治上》',
    six: '阳明',
    composition: [
      { herb: '石膏', text: '一斤', grams: '48g', prep: '碎，绵裹' },
      { herb: '知母', liang: 6 },
      { herb: '甘草', liang: 2, prep: '炙' },
      { herb: '粳米', text: '六合', grams: '约 30g' },
      { herb: '人参', liang: 3 }
    ],
    decoction: '上五味，以水一斗，煮米熟汤成，去滓，温服一升，日三服。',
    pattern: ['大烦渴不解', '大汗出', '背微恶寒', '脉洪大而芤'],
    indicators: [
      { id: 'thirst_cold', w: 3 },
      { id: 'profuse_sweat', w: 3 },
      { id: 'fever', w: 2 },
      { id: 'fatigue', w: 2 },
      { id: 'dry_mouth', w: 2 },
      { id: 'pulse_surging', w: 2 },
      { id: 'weight_loss', w: 1 }
    ],
    contra: [{ id: 'chill_body', w: 1 }, { id: 'pulse_weak', w: 1 }],
    clauses: [
      {
        ref: '《伤寒论·辨太阳病脉证并治上》第26条',
        text: '服桂枝汤，大汗出后，大烦渴不解，脉洪大者，白虎加人参汤主之。'
      }
    ],
    modern: { terms: ['Baihu Jia Renshen Tang', 'Byakko-ka-ninjin-to'], conditions: ['diabetes', 'dehydration', 'high fever'] },
    safety: ['同白虎汤；津气两伤而热不甚者不宜']
  },
  {
    id: 'tiaowei_chengqi_tang',
    name: '调胃承气汤',
    source: '《伤寒论·辨阳明病脉证并治》',
    six: '阳明',
    composition: [
      { herb: '大黄', liang: 4, prep: '去皮，清酒洗' },
      { herb: '甘草', liang: 2, prep: '炙' },
      { herb: '芒硝', text: '半升', grams: '约 12g' }
    ],
    decoction: '上三味，以水三升，煮取一升，去滓，内芒硝，更上火微煮令沸，少少温服之。',
    pattern: ['蒸蒸发热', '心烦', '大便不通', '不吐不下'],
    indicators: [
      { id: 'tidal_fever', w: 2 },
      { id: 'fever', w: 2 },
      { id: 'constipation', w: 2 },
      { id: 'hard_stool', w: 2 },
      { id: 'restlessness', w: 1 },
      { id: 'dry_mouth', w: 1 },
      { id: 'pulse_slippery', w: 1 }
    ],
    contra: [{ id: 'diarrhea', w: 3 }, { id: 'loose_stool', w: 2 }, { id: 'pulse_weak', w: 1 }],
    clauses: [
      {
        ref: '《伤寒论·辨太阳病脉证并治中》第248条',
        text: '太阳病三日，发汗不解，蒸蒸发热者，属胃也，调胃承气汤主之。'
      }
    ],
    modern: { terms: ['Tiaowei Chengqi Tang'], conditions: ['constipation', 'fever'] },
    safety: ['孕妇禁用', '气虚、津亏便秘者不宜', '中病即止，不可久服']
  },
  {
    id: 'xiao_chengqi_tang',
    name: '小承气汤',
    source: '《伤寒论·辨阳明病脉证并治》',
    six: '阳明',
    composition: [
      { herb: '大黄', liang: 4, prep: '酒洗' },
      { herb: '厚朴', liang: 2, prep: '炙，去皮' },
      { herb: '枳实', count: 3, unit: '枚', prep: '大者，炙' }
    ],
    decoction: '上三味，以水四升，煮取一升二合，去滓，分温二服。初服汤当更衣，不尔者尽饮之；若更衣者，勿服之。',
    pattern: ['大便硬', '腹大满不通', '潮热', '谵语'],
    indicators: [
      { id: 'constipation', w: 3 },
      { id: 'hard_stool', w: 3 },
      { id: 'abdominal_fullness', w: 2 },
      { id: 'delirium', w: 2 },
      { id: 'tidal_fever', w: 1 },
      { id: 'pulse_slippery', w: 1 }
    ],
    contra: [{ id: 'diarrhea', w: 3 }, { id: 'pulse_weak', w: 2 }],
    clauses: [
      {
        ref: '《伤寒论·辨阳明病脉证并治》第213条',
        text: '阳明病，其人多汗，以津液外出，胃中燥，大便必硬，硬则谵语，小承气汤主之。'
      }
    ],
    modern: { terms: ['Xiao Chengqi Tang'], conditions: ['constipation', 'postoperative ileus'] },
    safety: ['孕妇禁用', '无燥实者不可轻投', '得下即止']
  },
  {
    id: 'da_chengqi_tang',
    name: '大承气汤',
    source: '《伤寒论·辨阳明病脉证并治》',
    six: '阳明',
    composition: [
      { herb: '大黄', liang: 4, prep: '酒洗' },
      { herb: '厚朴', liang: 8, prep: '炙，去皮' },
      { herb: '枳实', count: 5, unit: '枚', prep: '炙' },
      { herb: '芒硝', text: '三合', grams: '约 9g' }
    ],
    decoction: '上四味，以水一斗，先煮二物，取五升，去滓，内大黄，更煮取二升，去滓，内芒硝，更上微火一两沸，分温再服。得下，余勿服。',
    pattern: ['痞满燥实', '腹硬满痛拒按', '潮热谵语', '大便不通'],
    indicators: [
      { id: 'constipation', w: 3 },
      { id: 'hard_stool', w: 3 },
      { id: 'rigidity', w: 3 },
      { id: 'abdominal_fullness', w: 3 },
      { id: 'abdominal_pain', w: 2 },
      { id: 'delirium', w: 3 },
      { id: 'tidal_fever', w: 3 },
      { id: 'profuse_sweat', w: 1 }
    ],
    contra: [{ id: 'diarrhea', w: 3 }, { id: 'pulse_weak', w: 3 }, { id: 'cold_limbs', w: 2 }],
    clauses: [
      {
        ref: '《伤寒论·辨阳明病脉证并治》第215条',
        text: '阳明病，谵语，有潮热，反不能食者，胃中必有燥屎五六枚也；若能食者，但硬耳。宜大承气汤下之。'
      }
    ],
    modern: { terms: ['Da Chengqi Tang'], conditions: ['intestinal obstruction', 'severe constipation', 'sepsis'] },
    safety: ['峻下攻积，孕妇、年老体弱、无燥屎者禁用', '得下即停，防伤津耗气', '肠梗阻、急腹症须先排除外科情况']
  },
  {
    id: 'maziren_wan',
    name: '麻子仁丸',
    alias: '脾约丸',
    source: '《伤寒论·辨阳明病脉证并治》',
    six: '阳明',
    composition: [
      { herb: '麻子仁', text: '二升', grams: '约 30g' },
      { herb: '芍药', text: '半斤', grams: '24g' },
      { herb: '枳实', text: '半斤', grams: '24g', prep: '炙' },
      { herb: '大黄', text: '一斤', grams: '48g', prep: '去皮' },
      { herb: '厚朴', text: '一尺', grams: '约 12g', prep: '炙，去皮' },
      { herb: '杏仁', text: '一升', grams: '约 15g', prep: '去皮尖，熬，别作脂' }
    ],
    decoction: '上六味，蜜和丸如梧桐子大，饮服十丸，日三服，渐加，以知为度。现代：炼蜜为丸，每服 9g，日 1–2 次。',
    pattern: ['大便硬', '小便数', '腹微满不痛', '趺阳脉浮而涩'],
    indicators: [
      { id: 'hard_stool', w: 3 },
      { id: 'constipation', w: 2 },
      { id: 'frequent_urine', w: 3 },
      { id: 'thirst', w: 1 },
      { id: 'abdominal_fullness', w: 1 }
    ],
    contra: [{ id: 'diarrhea', w: 3 }],
    clauses: [
      {
        ref: '《伤寒论·辨阳明病脉证并治》第247条',
        text: '趺阳脉浮而涩，浮则胃气强，涩则小便数，浮涩相搏，大便则硬，其脾为约，麻子仁丸主之。'
      }
    ],
    modern: { terms: ['Maziren Wan', 'Mashinin-gan'], conditions: ['constipation'] },
    safety: ['孕妇慎用', '津亏血少之便秘宜配合养阴']
  },
  {
    id: 'yinchenhao_tang',
    name: '茵陈蒿汤',
    source: '《伤寒论·辨阳明病脉证并治》',
    six: '阳明',
    composition: [
      { herb: '茵陈蒿', liang: 6 },
      { herb: '栀子', count: 14, unit: '枚', prep: '擘' },
      { herb: '大黄', liang: 2, prep: '去皮' }
    ],
    decoction: '上三味，以水一斗，先煮茵陈，减六升，内二味，煮取三升，去滓，分温三服。小便当利，尿如皂角汁状，色正赤，一宿腹减，黄从小便去也。',
    pattern: ['身目俱黄如橘子色', '小便不利', '但头汗出', '渴引水浆'],
    indicators: [
      { id: 'jaundice', w: 3 },
      { id: 'dark_urine', w: 3 },
      { id: 'fever', w: 2 },
      { id: 'difficult_urine', w: 2 },
      { id: 'thirst', w: 1 },
      { id: 'constipation', w: 1 },
      { id: 'chest_oppression', w: 1 },
      { id: 'coat_yellow_greasy', w: 1 }
    ],
    contra: [{ id: 'cold_limbs', w: 1 }, { id: 'tongue_pale', w: 1 }],
    clauses: [
      {
        ref: '《伤寒论·辨阳明病脉证并治》第236条',
        text: '阳明病，发热汗出者，此为热越，不能发黄也。但头汗出，身无汗，剂颈而还，小便不利，渴引水浆者，此为瘀热在里，身必发黄，茵陈蒿汤主之。'
      }
    ],
    modern: { terms: ['Yinchenhao Tang', 'Inchinko-to'], conditions: ['jaundice', 'hepatitis', 'liver injury'] },
    safety: ['阴黄（寒湿）禁用', '孕妇慎用', '大黄后下或减量可缓泻']
  },
  {
    id: 'zhizi_chi_tang',
    name: '栀子豉汤',
    source: '《伤寒论·辨太阳病脉证并治中》',
    six: '阳明',
    composition: [
      { herb: '栀子', count: 14, unit: '枚', prep: '擘' },
      { herb: '香豉', text: '四合', grams: '约 12g', prep: '绵裹' }
    ],
    decoction: '上二味，以水四升，先煮栀子，得二升半，内豉，煮取一升半，去滓，分为二服，温进一服。得吐者，止后服。',
    pattern: ['虚烦不得眠', '心中懊憹', '反复颠倒', '胸中窒'],
    indicators: [
      { id: 'insomnia', w: 3 },
      { id: 'restlessness', w: 3 },
      { id: 'chest_oppression', w: 2 },
      { id: 'irritability', w: 2 },
      { id: 'fever', w: 1 },
      { id: 'tongue_red', w: 1 }
    ],
    contra: [{ id: 'loose_stool', w: 2 }, { id: 'chill_body', w: 1 }],
    clauses: [
      {
        ref: '《伤寒论·辨太阳病脉证并治中》第76条',
        text: '发汗后，水药不得入口为逆，若更发汗，必吐下不止。发汗吐下后，虚烦不得眠，若剧者，必反复颠倒，心中懊憹，栀子豉汤主之。'
      }
    ],
    modern: { terms: ['Zhizi Chi Tang', 'Shishi-to'], conditions: ['insomnia', 'anxiety', 'esophagitis'] },
    safety: ['脾胃虚寒、便溏者禁用', '原方有「得吐止后服」之说，今多不作吐剂使用']
  },
  {
    id: 'gegen_huangqin_huanglian_tang',
    name: '葛根黄芩黄连汤',
    alias: '葛根芩连汤',
    source: '《伤寒论·辨太阳病脉证并治中》',
    six: '阳明',
    composition: [
      { herb: '葛根', text: '半斤', grams: '24g' },
      { herb: '甘草', liang: 2, prep: '炙' },
      { herb: '黄芩', liang: 3 },
      { herb: '黄连', liang: 3 }
    ],
    decoction: '上四味，以水八升，先煮葛根，减二升，内诸药，煮取二升，去滓，分温再服。',
    pattern: ['协热下利', '喘而汗出', '利遂不止', '脉促'],
    indicators: [
      { id: 'diarrhea', w: 3 },
      { id: 'fever', w: 2 },
      { id: 'wheezing', w: 2 },
      { id: 'spontaneous_sweat', w: 2 },
      { id: 'pulse_rapid', w: 2 },
      { id: 'thirst', w: 1 },
      { id: 'dark_urine', w: 1 },
      { id: 'coat_yellow', w: 1 }
    ],
    contra: [{ id: 'cold_limbs', w: 2 }, { id: 'clear_urine', w: 1 }],
    clauses: [
      {
        ref: '《伤寒论·辨太阳病脉证并治中》第34条',
        text: '太阳病，桂枝证，医反下之，利遂不止，脉促者，表未解也；喘而汗出者，葛根黄芩黄连汤主之。'
      }
    ],
    modern: { terms: ['Gegen Qinlian Tang'], conditions: ['diarrhea', 'colitis', 'infectious diarrhea'] },
    safety: ['虚寒下利禁用', '黄连苦寒，久服伤胃']
  },

  // ── 少阳 ──────────────────────────────────────────────
  {
    id: 'xiao_chaihu_tang',
    name: '小柴胡汤',
    source: '《伤寒论·辨太阳病脉证并治中》',
    six: '少阳',
    composition: [
      { herb: '柴胡', text: '半斤', grams: '24g' },
      { herb: '黄芩', liang: 3 },
      { herb: '人参', liang: 3 },
      { herb: '半夏', text: '半升', grams: '约 9g', prep: '洗' },
      { herb: '甘草', liang: 3, prep: '炙' },
      { herb: '生姜', liang: 3, prep: '切' },
      { herb: '大枣', count: 12, unit: '枚', prep: '擘' }
    ],
    decoction: '上七味，以水一斗二升，煮取六升，去滓，再煎取三升，温服一升，日三服。现代：水煎二次，取汁 400ml，分三次温服。',
    pattern: ['往来寒热', '胸胁苦满', '默默不欲饮食', '心烦喜呕', '口苦咽干目眩'],
    indicators: [
      { id: 'alternating', w: 3 },
      { id: 'hypochondriac', w: 3 },
      { id: 'bitter_mouth', w: 3 },
      { id: 'dry_mouth', w: 2 },
      { id: 'poor_appetite', w: 2 },
      { id: 'nausea', w: 2 },
      { id: 'vomiting', w: 2 },
      { id: 'dizziness', w: 2 },
      { id: 'fever', w: 1 },
      { id: 'irritability', w: 1 },
      { id: 'pulse_wiry', w: 2 }
    ],
    contra: [{ id: 'cold_limbs', w: 1 }, { id: 'tongue_pale', w: 1 }],
    clauses: [
      {
        ref: '《伤寒论·辨太阳病脉证并治中》第96条',
        text: '伤寒五六日，中风，往来寒热，胸胁苦满，嘿嘿不欲饮食，心烦喜呕，或胸中烦而不呕，或渴，或腹中痛，或胁下痞硬，或心下悸、小便不利，或不渴、身有微热，或咳者，小柴胡汤主之。'
      }
    ],
    modern: { terms: ['Xiao Chaihu Tang', 'Sho-saiko-to', 'Minor Bupleurum Decoction'], conditions: ['chronic hepatitis', 'fever', 'depression'] },
    safety: ['阴虚血少者慎用（柴胡升散）', '有报道小柴胡汤长期服用致间质性肺炎，需在医师指导下使用', '孕妇慎用']
  },
  {
    id: 'da_chaihu_tang',
    name: '大柴胡汤',
    source: '《伤寒论·辨太阳病脉证并治中》',
    six: '少阳',
    composition: [
      { herb: '柴胡', text: '半斤', grams: '24g' },
      { herb: '黄芩', liang: 3 },
      { herb: '芍药', liang: 3 },
      { herb: '半夏', text: '半升', grams: '约 9g', prep: '洗' },
      { herb: '生姜', liang: 5, prep: '切' },
      { herb: '枳实', count: 4, unit: '枚', prep: '炙' },
      { herb: '大枣', count: 12, unit: '枚', prep: '擘' },
      { herb: '大黄', liang: 2 }
    ],
    decoction: '上八味，以水一斗二升，煮取六升，去滓，再煎，温服一升，日三服。',
    pattern: ['心下急', '呕不止', '郁郁微烦', '大便不解', '胸胁苦满'],
    indicators: [
      { id: 'hypochondriac', w: 3 },
      { id: 'epigastric_pain', w: 3 },
      { id: 'vomiting', w: 2 },
      { id: 'constipation', w: 2 },
      { id: 'bitter_mouth', w: 2 },
      { id: 'irritability', w: 2 },
      { id: 'abdominal_fullness', w: 2 },
      { id: 'alternating', w: 1 },
      { id: 'pulse_wiry', w: 2 },
      { id: 'coat_yellow', w: 1 }
    ],
    contra: [{ id: 'diarrhea', w: 2 }, { id: 'pulse_weak', w: 2 }, { id: 'cold_limbs', w: 1 }],
    clauses: [
      {
        ref: '《伤寒论·辨太阳病脉证并治中》第103条',
        text: '太阳病，过经十余日，反二三下之，后四五日，柴胡证仍在者，先与小柴胡；呕不止，心下急，郁郁微烦者，为未解也，与大柴胡汤下之则愈。'
      }
    ],
    modern: { terms: ['Da Chaihu Tang', 'Dai-saiko-to'], conditions: ['cholecystitis', 'pancreatitis', 'constipation'] },
    safety: ['孕妇禁用', '虚寒、无实热积滞者禁用', '胆道梗阻、急腹症需先明确诊断']
  },
  {
    id: 'chaihu_guizhi_tang',
    name: '柴胡桂枝汤',
    source: '《伤寒论·辨太阳病脉证并治下》',
    six: '少阳',
    composition: [
      { herb: '桂枝', liang: 1.5, prep: '去皮' },
      { herb: '黄芩', liang: 1.5 },
      { herb: '人参', liang: 1.5 },
      { herb: '甘草', liang: 1, prep: '炙' },
      { herb: '半夏', text: '二合半', grams: '约 6g', prep: '洗' },
      { herb: '芍药', liang: 1.5 },
      { herb: '大枣', count: 6, unit: '枚', prep: '擘' },
      { herb: '生姜', liang: 1.5, prep: '切' },
      { herb: '柴胡', liang: 4 }
    ],
    decoction: '上九味，以水七升，煮取三升，去滓，温服一升。',
    pattern: ['发热微恶寒', '支节烦疼', '微呕', '心下支结'],
    indicators: [
      { id: 'joint_pain', w: 3 },
      { id: 'fever', w: 2 },
      { id: 'aversion_cold', w: 2 },
      { id: 'nausea', w: 2 },
      { id: 'epigastric_distention', w: 2 },
      { id: 'hypochondriac', w: 2 },
      { id: 'bitter_mouth', w: 1 },
      { id: 'pulse_wiry', w: 2 },
      { id: 'pulse_float', w: 1 }
    ],
    contra: [{ id: 'cold_limbs', w: 1 }],
    clauses: [
      {
        ref: '《伤寒论·辨太阳病脉证并治下》第146条',
        text: '伤寒六七日，发热，微恶寒，支节烦疼，微呕，心下支结，外证未去者，柴胡桂枝汤主之。'
      }
    ],
    modern: { terms: ['Chaihu Guizhi Tang', 'Saiko-keishi-to'], conditions: ['common cold', 'fibromyalgia', 'epilepsy'] },
    safety: ['同小柴胡汤；阴虚火旺者慎用']
  },
  {
    id: 'chaihu_jia_longgu_muli_tang',
    name: '柴胡加龙骨牡蛎汤',
    source: '《伤寒论·辨太阳病脉证并治中》',
    six: '少阳',
    composition: [
      { herb: '柴胡', liang: 4 },
      { herb: '龙骨', liang: 1.5 },
      { herb: '黄芩', liang: 1.5 },
      { herb: '生姜', liang: 1.5, prep: '切' },
      { herb: '铅丹', liang: 1.5 },
      { herb: '人参', liang: 1.5 },
      { herb: '桂枝', liang: 1.5, prep: '去皮' },
      { herb: '茯苓', liang: 1.5 },
      { herb: '半夏', text: '二合半', grams: '约 6g', prep: '洗' },
      { herb: '大黄', liang: 2 },
      { herb: '牡蛎', liang: 1.5, prep: '熬' },
      { herb: '大枣', count: 6, unit: '枚', prep: '擘' }
    ],
    decoction: '上十二味，以水八升，煮取四升，内大黄，切如棋子，更煮一两沸，去滓，温服一升。',
    pattern: ['胸满烦惊', '小便不利', '谵语', '一身尽重不可转侧'],
    indicators: [
      { id: 'chest_oppression', w: 3 },
      { id: 'anxiety', w: 3 },
      { id: 'palpitation', w: 2 },
      { id: 'insomnia', w: 2 },
      { id: 'dizziness', w: 2 },
      { id: 'heavy_body', w: 2 },
      { id: 'difficult_urine', w: 2 },
      { id: 'delirium', w: 1 },
      { id: 'hypochondriac', w: 1 }
    ],
    contra: [{ id: 'pulse_weak', w: 1 }, { id: 'cold_limbs', w: 1 }],
    clauses: [
      {
        ref: '《伤寒论·辨太阳病脉证并治中》第107条',
        text: '伤寒八九日，下之，胸满烦惊，小便不利，谵语，一身尽重，不可转侧者，柴胡加龙骨牡蛎汤主之。'
      }
    ],
    modern: { terms: ['Chaihu Jia Longgu Muli Tang', 'Saiko-ka-ryukotsu-borei-to'], conditions: ['depression', 'anxiety', 'insomnia', 'hypertension'] },
    safety: ['铅丹有毒，现代多以生铁落、磁石或珍珠母代之，或去而不用', '孕妇禁用', '需在医师指导下使用']
  },
  {
    id: 'sini_san',
    name: '四逆散',
    source: '《伤寒论·辨少阴病脉证并治》',
    six: '少阳',
    composition: [
      { herb: '甘草', liang: 1, prep: '炙' },
      { herb: '枳实', liang: 1, prep: '破，水渍，炙干' },
      { herb: '柴胡', liang: 1 },
      { herb: '芍药', liang: 1 }
    ],
    decoction: '上四味，捣筛，白饮和服方寸匕，日三服。现代：水煎，分二次温服。',
    pattern: ['手足不温', '胁痛', '腹中痛', '泄利下重', '脉弦'],
    indicators: [
      { id: 'cold_limbs', w: 3 },
      { id: 'hypochondriac', w: 2 },
      { id: 'abdominal_pain', w: 2 },
      { id: 'mucus_stool', w: 1 },
      { id: 'palpitation', w: 1 },
      { id: 'cough', w: 1 },
      { id: 'irritability', w: 1 },
      { id: 'pulse_wiry', w: 2 }
    ],
    contra: [{ id: 'pulse_weak', w: 1 }, { id: 'lethargy', w: 1 }],
    clauses: [
      {
        ref: '《伤寒论·辨少阴病脉证并治》第318条',
        text: '少阴病，四逆，其人或咳，或悸，或小便不利，或腹中痛，或泄利下重者，四逆散主之。'
      }
    ],
    modern: { terms: ['Sini San', 'Shigyakusan'], conditions: ['irritable bowel syndrome', 'depression', 'dysmenorrhea'] },
    safety: ['真阳衰微之四逆（脉微欲绝）禁用，当用四逆汤']
  },
  {
    id: 'banxia_xiexin_tang',
    name: '半夏泻心汤',
    source: '《伤寒论·辨太阳病脉证并治下》',
    six: '少阳',
    composition: [
      { herb: '半夏', text: '半升', grams: '约 9g', prep: '洗' },
      { herb: '黄芩', liang: 3 },
      { herb: '干姜', liang: 3 },
      { herb: '人参', liang: 3 },
      { herb: '甘草', liang: 3, prep: '炙' },
      { herb: '黄连', liang: 1 },
      { herb: '大枣', count: 12, unit: '枚', prep: '擘' }
    ],
    decoction: '上七味，以水一斗，煮取六升，去滓，再煎取三升，温服一升，日三服。',
    pattern: ['心下痞满不痛', '呕吐', '肠鸣下利', '寒热错杂'],
    indicators: [
      { id: 'epigastric_distention', w: 3 },
      { id: 'nausea', w: 2 },
      { id: 'vomiting', w: 2 },
      { id: 'diarrhea', w: 2 },
      { id: 'poor_appetite', w: 2 },
      { id: 'belching', w: 1 },
      { id: 'acid_reflux', w: 1 },
      { id: 'bitter_mouth', w: 1 },
      { id: 'pulse_wiry', w: 1 },
      { id: 'coat_yellow_greasy', w: 1 }
    ],
    contra: [{ id: 'epigastric_pain', w: 1 }, { id: 'cold_limbs', w: 1 }],
    clauses: [
      {
        ref: '《伤寒论·辨太阳病脉证并治下》第149条',
        text: '伤寒五六日，呕而发热者，柴胡汤证具，而以他药下之，柴胡证仍在者，复与柴胡汤……但满而不痛者，此为痞，柴胡不中与之，宜半夏泻心汤。'
      }
    ],
    modern: { terms: ['Banxia Xiexin Tang', 'Hange-shashin-to'], conditions: ['functional dyspepsia', 'gastritis', 'Helicobacter pylori'] },
    safety: ['气滞、食积之痞满非本方所宜', '孕妇慎用']
  },
  {
    id: 'huanglian_tang',
    name: '黄连汤',
    source: '《伤寒论·辨太阳病脉证并治下》',
    six: '少阳',
    composition: [
      { herb: '黄连', liang: 3 },
      { herb: '甘草', liang: 3, prep: '炙' },
      { herb: '干姜', liang: 3 },
      { herb: '桂枝', liang: 3, prep: '去皮' },
      { herb: '人参', liang: 2 },
      { herb: '半夏', text: '半升', grams: '约 9g', prep: '洗' },
      { herb: '大枣', count: 12, unit: '枚', prep: '擘' }
    ],
    decoction: '上七味，以水一斗，煮取六升，去滓，温服一升，日三服，夜二服。',
    pattern: ['胸中有热', '腹中痛', '欲呕吐', '上热下寒'],
    indicators: [
      { id: 'vomiting', w: 3 },
      { id: 'epigastric_pain', w: 2 },
      { id: 'abdominal_pain', w: 2 },
      { id: 'nausea', w: 2 },
      { id: 'irritability', w: 1 },
      { id: 'diarrhea', w: 1 },
      { id: 'cold_limbs', w: 1 }
    ],
    contra: [{ id: 'fever', w: 1 }],
    clauses: [
      {
        ref: '《伤寒论·辨太阳病脉证并治下》第173条',
        text: '伤寒，胸中有热，胃中有邪气，腹中痛，欲呕吐者，黄连汤主之。'
      }
    ],
    modern: { terms: ['Huanglian Tang', 'Oren-to'], conditions: ['gastritis', 'peptic ulcer'] },
    safety: ['纯热无寒者不宜', '黄连苦寒伤胃，中病即止']
  },
  {
    id: 'xuanfu_daizhe_tang',
    name: '旋覆代赭汤',
    source: '《伤寒论·辨太阳病脉证并治下》',
    six: '少阳',
    composition: [
      { herb: '旋覆花', liang: 3 },
      { herb: '人参', liang: 2 },
      { herb: '生姜', liang: 5, prep: '切' },
      { herb: '代赭石', liang: 1 },
      { herb: '甘草', liang: 3, prep: '炙' },
      { herb: '半夏', text: '半升', grams: '约 9g', prep: '洗' },
      { herb: '大枣', count: 12, unit: '枚', prep: '擘' }
    ],
    decoction: '上七味，以水一斗，煮取六升，去滓，再煎取三升，温服一升，日三服。',
    pattern: ['心下痞硬', '噫气不除', '呕吐', '纳差'],
    indicators: [
      { id: 'belching', w: 3 },
      { id: 'epigastric_distention', w: 3 },
      { id: 'nausea', w: 1 },
      { id: 'vomiting', w: 1 },
      { id: 'poor_appetite', w: 1 },
      { id: 'acid_reflux', w: 1 }
    ],
    contra: [{ id: 'pulse_weak', w: 1 }],
    clauses: [
      {
        ref: '《伤寒论·辨太阳病脉证并治下》第161条',
        text: '伤寒发汗，若吐若下，解后，心下痞硬，噫气不除者，旋覆代赭汤主之。'
      }
    ],
    modern: { terms: ['Xuanfu Daizhe Tang', 'Senpuku-daishato'], conditions: ['gastroesophageal reflux', 'hiccup'] },
    safety: ['代赭石质重，孕妇慎用', '旋覆花需包煎（有绒毛刺激咽喉）']
  }
]
