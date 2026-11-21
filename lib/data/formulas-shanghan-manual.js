// 宋本《伤寒论》补遗 · 手工补录并校准（组成王付方药无法自动解析的 12 首）
//
// 与 formulas-shanghan-song.js 的自动生成条目不同：这里的方证指标是人工判读的，
// 不标 autoPattern（不降权）。原文取康平本，按宋本篇名引用、不标条号。

export const SHANGHAN_MANUAL_FORMULAS = [
  {
    id: 'guizhi_xinjia_tang_sh',
    name: '桂枝新加汤',
    alias: '桂枝加芍药生姜各一两人参三两新加汤',
    source: '《伤寒论·辨太阳病脉证并治》',
    six: '太阳',
    doseBasis: 'modern',
    composition: [
      { herb: '桂枝', text: '9g' },
      { herb: '芍药', text: '12g' },
      { herb: '甘草', text: '6g', prep: '炙' },
      { herb: '人参', text: '9g' },
      { herb: '生姜', text: '12g' },
      { herb: '大枣', count: 12, unit: '枚' }
    ],
    decoction: '上六味，以水一斗二升，煮取三升，去滓，温服一升。',
    pattern: ['发汗后身疼痛', '脉沉迟', '汗出多', '乏力'],
    indicators: [
      { id: 'body_ache', w: 3 },
      { id: 'pulse_deep', w: 3 },
      { id: 'spontaneous_sweat', w: 2 },
      { id: 'fatigue', w: 2 },
      { id: 'palpitation', w: 1 },
      { id: 'cold_limbs', w: 1 }
    ],
    contra: [
      { id: 'no_sweat', w: 2 },
      { id: 'pulse_tight', w: 2 },
      { id: 'fever', w: 1 }
    ],
    clauses: [
      {
        ref: '《伤寒论·辨太阳病脉证并治》',
        text: '发汗后，身疼痛，脉沉迟者，桂枝加芍药生姜各一两人参三两新加汤主之。'
      }
    ],
    modern: { terms: ['Guizhi Xinjia Tang'], conditions: ['postpartum pain', 'chronic fatigue'] },
    safety: ['表实无汗者不宜', '温热病、里热盛者禁用']
  },
  {
    id: 'houpo_shengjiang_banxia_gancao_renshen_tang_sh',
    name: '厚朴生姜半夏甘草人参汤',
    source: '《伤寒论·辨太阳病脉证并治》',
    six: '太阳',
    doseBasis: 'modern',
    composition: [
      { herb: '厚朴', text: '24g', prep: '炙，去皮' },
      { herb: '生姜', text: '24g', prep: '切' },
      { herb: '半夏', text: '9g', prep: '洗' },
      { herb: '甘草', text: '6g', prep: '炙' },
      { herb: '人参', text: '3g' }
    ],
    decoction: '上五味，以水一斗，煮取三升，去滓，温服一升，日三服。',
    pattern: ['发汗后腹胀满', '按之不痛', '食少', '倦怠'],
    indicators: [
      { id: 'abdominal_fullness', w: 3 },
      { id: 'poor_appetite', w: 2 },
      { id: 'fatigue', w: 2 },
      { id: 'belching', w: 1 },
      { id: 'nausea', w: 1 },
      { id: 'loose_stool', w: 1 }
    ],
    contra: [
      { id: 'rigidity', w: 2 },
      { id: 'constipation', w: 2 },
      { id: 'fever', w: 1 }
    ],
    clauses: [
      {
        ref: '《伤寒论·辨太阳病脉证并治》',
        text: '发汗后，腹胀满者，厚朴生姜半夏甘草人参汤主之。'
      }
    ],
    modern: { terms: ['Houpo Shengjiang Banxia Gancao Renshen Tang'], conditions: ['postoperative bloating', 'functional dyspepsia'] },
    safety: ['实胀（拒按、便秘）不宜', '孕妇慎用半夏']
  },
  {
    id: 'daxianxiong_wan_sh',
    name: '大陷胸丸',
    source: '《伤寒论·辨太阳病脉证并治》',
    six: '太阳',
    doseBasis: 'ratio',
    composition: [
      { herb: '大黄', text: '半斤' },
      { herb: '葶苈子', text: '半升', prep: '熬' },
      { herb: '芒硝', text: '半升' },
      { herb: '杏仁', text: '半升', prep: '去皮尖，熬黑' },
      { herb: '甘遂', text: '一钱匕' },
      { herb: '白蜜', text: '二合' }
    ],
    decoction: '上四味，捣筛二味，内杏仁、芒硝，合研如脂，和散，取如弹丸一枚；别捣甘遂末一钱匕、白蜜二合、水二升，煮取一升，温顿服之，一宿乃下。',
    pattern: ['结胸', '项亦强', '如柔痉状', '胸中硬满', '喘满'],
    indicators: [
      { id: 'chest_oppression', w: 3 },
      { id: 'rigidity', w: 3 },
      { id: 'stiff_neck', w: 2 },
      { id: 'wheezing', w: 2 },
      { id: 'constipation', w: 2 }
    ],
    contra: [
      { id: 'pulse_weak', w: 3 },
      { id: 'cold_limbs', w: 2 },
      { id: 'loose_stool', w: 2 }
    ],
    clauses: [
      {
        ref: '《伤寒论·辨太阳病脉证并治》',
        text: '病发于阳，而反下之，热入因作结胸……结胸者，项亦强，如柔痉状，下之则和，宜大陷胸丸。'
      }
    ],
    modern: { terms: ['Daxianxiong Wan'], conditions: ['pleural effusion', 'acute pancreatitis'] },
    safety: ['峻下逐水：甘遂有毒，孕妇、体虚者禁用', '须医师处方与监护，中病即止', '胸痛喘满须先排除心梗与气胸']
  },
  {
    id: 'sanwu_baishu_san_sh',
    name: '三物白散',
    alias: '白散',
    source: '《伤寒论·辨太阳病脉证并治》',
    six: '太阳',
    doseBasis: 'ratio',
    composition: [
      { herb: '桔梗', text: '三分' },
      { herb: '巴豆', text: '一分', prep: '去皮心，熬黑，研如脂' },
      { herb: '贝母', text: '三分' }
    ],
    decoction: '上三味，为散，内巴豆，更于臼中杵之，以白饮和服。强人半钱匕，羸者减之。病在膈上必吐，在膈下必利。',
    pattern: ['寒实结胸', '无热证', '胸胁满硬', '大便不通'],
    indicators: [
      { id: 'chest_oppression', w: 3 },
      { id: 'constipation', w: 3 },
      { id: 'chill_body', w: 2 },
      { id: 'hypochondriac', w: 2 },
      { id: 'no_fever', w: 0 }
    ].filter((i) => i.w > 0),
    contra: [
      { id: 'fever', w: 3 },
      { id: 'pulse_weak', w: 3 },
      { id: 'loose_stool', w: 2 }
    ],
    clauses: [
      {
        ref: '《伤寒论·辨太阳病脉证并治》',
        text: '寒实结胸，无热证者，与三物小陷胸汤，白散亦可服。'
      }
    ],
    modern: { terms: ['Sanwu Baishu San'], conditions: ['intestinal obstruction'] },
    safety: ['巴豆大毒、峻下：孕妇与体虚者禁用，绝不可自行服用', '须医师处方，中病即止', '吐利过度需立即就医']
  },
  {
    id: 'mijian_dao_sh',
    name: '蜜煎导',
    alias: '蜜煎导法',
    source: '《伤寒论·辨阳明病脉证并治》',
    six: '阳明',
    doseBasis: 'ratio',
    composition: [{ herb: '食蜜', text: '七合' }],
    decoction: '上一味，于铜器内微火煎，当须凝如饴状，搅之勿令焦著，欲可丸，并手捻作挺，令头锐，大如指，长二寸许，当热时急作，冷则硬。以内谷道中，以手急抱，欲大便时乃去之。（外用导法）',
    pattern: ['大便硬', '欲大便不得', '津亏肠燥', '小便自利'],
    indicators: [
      { id: 'constipation', w: 3 },
      { id: 'hard_stool', w: 3 },
      { id: 'dry_mouth', w: 1 },
      { id: 'fatigue', w: 1 }
    ],
    contra: [
      { id: 'diarrhea', w: 3 },
      { id: 'bleeding', w: 2 }
    ],
    clauses: [
      {
        ref: '《伤寒论·辨阳明病脉证并治》',
        text: '阳明病，自汗出，若发汗，小便自利者，此为津液内竭，虽硬不可攻之，当须自欲大便，宜蜜煎导而通之。'
      }
    ],
    modern: { terms: ['Mijian Dao'], conditions: ['constipation'] },
    safety: ['外用导法，禁止内服', '肛门术后、肛裂出血者慎用', '习惯性便秘需查因，不宜长期依赖']
  },
  {
    id: 'banxia_san_ji_tang_sh',
    name: '半夏散及汤',
    source: '《伤寒论·辨少阴病脉证并治》',
    six: '少阴',
    doseBasis: 'ratio',
    composition: [
      { herb: '半夏', text: '等分', prep: '洗' },
      { herb: '桂枝', text: '等分', prep: '去皮' },
      { herb: '甘草', text: '等分', prep: '炙' }
    ],
    decoction: '上三味，等分，各别捣筛已，合治之，白饮和服方寸匕，日三服。若不能散服者，以水一升，煎七沸，内散两方寸匕，更煮三沸，下火令小冷，少少咽之。',
    pattern: ['咽中痛', '咽部不利', '痰涎多', '恶寒'],
    indicators: [
      { id: 'sore_throat', w: 3 },
      { id: 'white_sputum', w: 2 },
      { id: 'chill_body', w: 2 },
      { id: 'aversion_cold', w: 1 },
      { id: 'cough', w: 1 }
    ],
    contra: [
      { id: 'thirst_cold', w: 2 },
      { id: 'tongue_red', w: 2 },
      { id: 'yellow_sputum', w: 2 }
    ],
    clauses: [
      {
        ref: '《伤寒论·辨少阴病脉证并治》',
        text: '少阴病，咽中痛，半夏散及汤主之。'
      }
    ],
    modern: { terms: ['Banxia San Ji Tang'], conditions: ['pharyngitis', 'laryngitis'] },
    safety: ['咽喉红肿灼热（实热）者禁用', '半夏制用，孕妇慎用', '咽痛伴呼吸困难须立即急诊']
  },
  {
    id: 'zhufu_tang_sh',
    name: '猪肤汤',
    source: '《伤寒论·辨少阴病脉证并治》',
    six: '少阴',
    doseBasis: 'modern',
    composition: [
      { herb: '猪肤', text: '48g' },
      { herb: '白蜜', text: '30g' },
      { herb: '白粉', text: '15g', prep: '米粉' }
    ],
    decoction: '上一味，以水一斗，煮取五升，去滓，加白蜜一升、白粉五合，熬香，和令相得，温分六服。',
    pattern: ['下利咽痛', '胸满心烦', '咽干'],
    indicators: [
      { id: 'sore_throat', w: 3 },
      { id: 'dry_mouth', w: 2 },
      { id: 'irritability', w: 2 },
      { id: 'diarrhea', w: 2 },
      { id: 'chest_oppression', w: 1 },
      { id: 'insomnia', w: 1 }
    ],
    contra: [
      { id: 'yellow_sputum', w: 2 },
      { id: 'fever', w: 1 }
    ],
    clauses: [
      {
        ref: '《伤寒论·辨少阴病脉证并治》',
        text: '少阴病，下利咽痛，胸满心烦，猪肤汤主之。'
      }
    ],
    modern: { terms: ['Zhufu Tang'], conditions: ['pharyngitis', 'dry throat'] },
    safety: ['湿热、痰热咽痛不宜', '糖尿病者慎用（含白蜜、米粉）']
  },
  {
    id: 'danggui_sini_jia_wuzhuyu_shengjiang_tang_sh',
    name: '当归四逆加吴茱萸生姜汤',
    source: '《伤寒论·辨厥阴病脉证并治》',
    six: '厥阴',
    doseBasis: 'modern',
    composition: [
      { herb: '当归', text: '9g' },
      { herb: '桂枝', text: '9g' },
      { herb: '芍药', text: '9g' },
      { herb: '细辛', text: '9g' },
      { herb: '甘草', text: '6g', prep: '炙' },
      { herb: '通草', text: '6g' },
      { herb: '大枣', count: 25, unit: '枚' },
      { herb: '吴茱萸', text: '6g' },
      { herb: '生姜', text: '24g' }
    ],
    decoction: '上九味，以水六升、清酒六升和，煮取五升，去滓，温分五服。',
    pattern: ['手足厥寒', '脉细欲绝', '内有久寒', '少腹冷痛', '呕吐涎沫'],
    indicators: [
      { id: 'cold_limbs', w: 3 },
      { id: 'pulse_thin', w: 3 },
      { id: 'chill_body', w: 2 },
      { id: 'vomiting', w: 2 },
      { id: 'lower_abdomen', w: 2 },
      { id: 'numbness', w: 1 },
      { id: 'dysmenorrhea', w: 2 }
    ],
    contra: [
      { id: 'pulse_rapid', w: 1 },
      { id: 'thirst_cold', w: 1 },
      { id: 'fever', w: 1 }
    ],
    clauses: [
      {
        ref: '《伤寒论·辨厥阴病脉证并治》',
        text: '手足厥寒，脉细欲绝者，当归四逆汤主之。若其人内有久寒者，宜当归四逆加吴茱萸生姜汤。'
      }
    ],
    modern: { terms: ['Danggui Sini Jia Wuzhuyu Shengjiang Tang'], conditions: ['Raynaud disease', 'dysmenorrhea'] },
    safety: ['吴茱萸有小毒，用量不宜大', '细辛宜久煎并减量', '热厥（胸腹灼热）禁用']
  },
  {
    id: 'ganjiang_huangqin_huanglian_renshen_tang_sh',
    name: '干姜黄芩黄连人参汤',
    source: '《伤寒论·辨厥阴病脉证并治》',
    six: '厥阴',
    doseBasis: 'modern',
    composition: [
      { herb: '干姜', text: '9g' },
      { herb: '黄芩', text: '9g' },
      { herb: '黄连', text: '9g' },
      { herb: '人参', text: '9g' }
    ],
    decoction: '上四味，以水六升，煮取二升，去滓，分温再服。',
    pattern: ['食入口即吐', '寒热错杂', '心下痞', '下利'],
    indicators: [
      { id: 'vomiting', w: 3 },
      { id: 'epigastric_distention', w: 2 },
      { id: 'diarrhea', w: 2 },
      { id: 'nausea', w: 2 },
      { id: 'cold_limbs', w: 1 },
      { id: 'irritability', w: 1 }
    ],
    contra: [
      { id: 'cold_limbs', w: 1 },
      { id: 'loose_stool', w: 1 }
    ],
    clauses: [
      {
        ref: '《伤寒论·辨厥阴病脉证并治》',
        text: '伤寒本自寒下，医复吐下之，寒格更逆吐下，若食入口即吐，干姜黄芩黄连人参汤主之。'
      }
    ],
    modern: { terms: ['Ganjiang Huangqin Huanglian Renshen Tang'], conditions: ['gastritis', 'pyloric stenosis'] },
    safety: ['黄连苦寒，脾胃虚寒者慎用', '食入即吐需排除幽门梗阻', '孕妇慎用']
  },
  {
    id: 'guizhi_jia_dahuang_tang_sh',
    name: '桂枝加大黄汤',
    source: '《伤寒论·辨太阴病脉证并治》',
    six: '太阴',
    doseBasis: 'modern',
    composition: [
      { herb: '桂枝', text: '9g' },
      { herb: '大黄', text: '6g' },
      { herb: '芍药', text: '18g' },
      { herb: '生姜', text: '9g' },
      { herb: '甘草', text: '6g', prep: '炙' },
      { herb: '大枣', count: 12, unit: '枚' }
    ],
    decoction: '上六味，以水七升，煮取三升，去滓，温服一升，日三服。',
    pattern: ['腹满大实痛', '拒按', '大便不通', '脉沉实'],
    indicators: [
      { id: 'abdominal_pain', w: 3 },
      { id: 'abdominal_fullness', w: 3 },
      { id: 'constipation', w: 2 },
      { id: 'rigidity', w: 1 },
      { id: 'fever', w: 1 }
    ],
    contra: [
      { id: 'diarrhea', w: 3 },
      { id: 'pulse_weak', w: 2 },
      { id: 'cold_limbs', w: 1 }
    ],
    clauses: [
      {
        ref: '《伤寒论·辨太阴病脉证并治》',
        text: '本太阳病，医反下之，因尔腹满时痛者，属太阴也，桂枝加芍药汤主之；大实痛者，桂枝加大黄汤主之。'
      }
    ],
    modern: { terms: ['Guizhi Jia Dahuang Tang'], conditions: ['abdominal pain', 'constipation'] },
    safety: ['孕妇禁用', '虚寒腹痛禁用', '中病即止']
  },
  {
    id: 'muli_zexie_san_sh',
    name: '牡蛎泽泻散',
    source: '《伤寒论·辨阴阳易差后劳复病脉证并治》',
    six: '差后',
    doseBasis: 'ratio',
    composition: [
      { herb: '牡蛎', text: '等分', prep: '熬' },
      { herb: '泽泻', text: '等分' },
      { herb: '蜀漆', text: '等分', prep: '暖水洗去腥' },
      { herb: '葶苈子', text: '等分', prep: '熬' },
      { herb: '商陆根', text: '等分', prep: '熬' },
      { herb: '海藻', text: '等分', prep: '洗去咸' },
      { herb: '栝蒌根', text: '等分' }
    ],
    decoction: '上七味，异捣，下筛为散，更于臼中治之，白饮和服方寸匕，日三服。小便利，止后服。',
    pattern: ['大病瘥后', '腰以下肿', '小便不利', '水气不行'],
    indicators: [
      { id: 'edema', w: 3 },
      { id: 'difficult_urine', w: 3 },
      { id: 'heavy_body', w: 1 },
      { id: 'fatigue', w: 1 },
      { id: 'thirst', w: 1 }
    ],
    contra: [
      { id: 'pulse_weak', w: 2 },
      { id: 'clear_urine', w: 2 }
    ],
    clauses: [
      {
        ref: '《伤寒论·辨阴阳易差后劳复病脉证并治》',
        text: '大病瘥后，从腰以下有水气者，牡蛎泽泻散主之。'
      }
    ],
    modern: { terms: ['Muli Zexie San'], conditions: ['edema', 'nephrotic syndrome'] },
    safety: ['逐水之剂：商陆、蜀漆有毒，孕妇与体虚者禁用', '须医师处方，小便利即止', '水肿须查明心肾功能']
  }

  ,
  {
    id: 'shengjiang_xiexin_tang_sh',
    name: '生姜泻心汤',
    source: '《伤寒论·辨太阳病脉证并治》',
    six: '太阳',
    doseBasis: 'modern',
    composition: [
      { herb: '生姜', text: '12g', prep: '切' },
      { herb: '甘草', text: '9g', prep: '炙' },
      { herb: '人参', text: '9g' },
      { herb: '干姜', text: '3g' },
      { herb: '黄芩', text: '9g' },
      { herb: '半夏', text: '9g', prep: '洗' },
      { herb: '黄连', text: '3g' },
      { herb: '大枣', count: 12, unit: '枚' }
    ],
    decoction: '上八味，以水一斗，煮取六升，去滓，再煎取三升，温服一升，日三服。',
    pattern: ['心下痞硬', '干噫食臭', '胁下有水气', '腹中雷鸣下利'],
    indicators: [
      { id: 'epigastric_distention', w: 3 },
      { id: 'belching', w: 3 },
      { id: 'borborygmus', w: 3 },
      { id: 'diarrhea', w: 2 },
      { id: 'nausea', w: 1 },
      { id: 'poor_appetite', w: 1 }
    ],
    contra: [{ id: 'constipation', w: 2 }, { id: 'cold_limbs', w: 1 }],
    clauses: [
      {
        ref: '《伤寒论·辨太阳病脉证并治》',
        text: '伤寒汗出解之后，胃中不和，心下痞硬，干噫食臭，胁下有水气，腹中雷鸣下利者，生姜泻心汤主之。'
      }
    ],
    modern: { terms: ['Shengjiang Xiexin Tang'], conditions: ['gastritis', 'functional dyspepsia'] },
    safety: ['气滞食积之痞满非本方所宜', '孕妇慎用半夏']
  },
  {
    id: 'chishizhi_yuyuliang_tang_sh',
    name: '赤石脂禹余粮汤',
    source: '《伤寒论·辨太阳病脉证并治》',
    six: '太阳',
    doseBasis: 'modern',
    composition: [
      { herb: '赤石脂', text: '48g', prep: '碎' },
      { herb: '禹余粮', text: '48g', prep: '碎' }
    ],
    decoction: '上二味，以水六升，煮取二升，去滓，分温三服。',
    pattern: ['下利不止', '滑脱不禁', '心下痞硬', '服泻心汤不愈'],
    indicators: [
      { id: 'diarrhea', w: 3 },
      { id: 'loose_stool', w: 2 },
      { id: 'epigastric_distention', w: 1 },
      { id: 'fatigue', w: 1 }
    ],
    contra: [{ id: 'constipation', w: 3 }, { id: 'fever', w: 1 }, { id: 'mucus_stool', w: 1 }],
    clauses: [
      {
        ref: '《伤寒论·辨太阳病脉证并治》',
        text: '伤寒服汤药，下利不止，心下痞硬，服泻心汤已，复以他药下之，利不止，医以理中与之，利益甚。理中者，理中焦，此利在下焦，赤石脂禹余粮汤主之。'
      }
    ],
    modern: { terms: ['Chishizhi Yuyuliang Tang'], conditions: ['chronic diarrhea', 'irritable bowel syndrome'] },
    safety: ['湿热积滞之下利禁用（当先祛邪）', '矿物药质重，需包煎', '久泻须查因，排除器质性疾病']
  },
  {
    id: 'guizhi_renshen_tang_sh',
    name: '桂枝人参汤',
    source: '《伤寒论·辨太阳病脉证并治》',
    six: '太阳',
    doseBasis: 'modern',
    composition: [
      { herb: '桂枝', text: '12g', prep: '别切' },
      { herb: '甘草', text: '12g', prep: '炙' },
      { herb: '白术', text: '9g' },
      { herb: '人参', text: '9g' },
      { herb: '干姜', text: '9g' }
    ],
    decoction: '上五味，以水九升，先煮四味，取五升，内桂，更煮取三升，去滓，温服一升，日再夜一服。',
    pattern: ['协热而利', '利下不止', '心下痞硬', '表里不解'],
    indicators: [
      { id: 'diarrhea', w: 3 },
      { id: 'epigastric_distention', w: 3 },
      { id: 'chill_body', w: 2 },
      { id: 'poor_appetite', w: 1 },
      { id: 'fever', w: 1 }
    ],
    contra: [{ id: 'mucus_stool', w: 2 }, { id: 'constipation', w: 2 }],
    clauses: [
      {
        ref: '《伤寒论·辨太阳病脉证并治》',
        text: '太阳病，外证未除，而数下之，遂协热而利，利下不止，心下痞硬，表里不解者，桂枝人参汤主之。'
      }
    ],
    modern: { terms: ['Guizhi Renshen Tang'], conditions: ['chronic diarrhea', 'gastritis'] },
    safety: ['湿热下利禁用', '桂枝后下以存其气']
  },
  {
    id: 'huangqin_jia_banxia_shengjiang_tang_sh',
    name: '黄芩加半夏生姜汤',
    source: '《伤寒论·辨太阳病脉证并治》',
    six: '太阳',
    doseBasis: 'modern',
    composition: [
      { herb: '黄芩', text: '9g' },
      { herb: '芍药', text: '6g' },
      { herb: '甘草', text: '6g', prep: '炙' },
      { herb: '大枣', count: 12, unit: '枚' },
      { herb: '半夏', text: '9g', prep: '洗' },
      { herb: '生姜', text: '6g' }
    ],
    decoction: '上六味，以水一斗，煮取三升，去滓，温服一升，日再夜一服。',
    pattern: ['下利', '呕', '腹痛', '脉数'],
    indicators: [
      { id: 'diarrhea', w: 3 },
      { id: 'vomiting', w: 3 },
      { id: 'abdominal_pain', w: 2 },
      { id: 'fever', w: 1 },
      { id: 'pulse_rapid', w: 1 }
    ],
    contra: [{ id: 'cold_limbs', w: 2 }, { id: 'clear_urine', w: 1 }],
    clauses: [
      {
        ref: '《伤寒论·辨太阳病脉证并治》',
        text: '太阳与少阳合病，自下利者，与黄芩汤；若呕者，黄芩加半夏生姜汤主之。'
      }
    ],
    modern: { terms: ['Huangqin Jia Banxia Shengjiang Tang'], conditions: ['gastroenteritis', 'diarrhea'] },
    safety: ['虚寒下利禁用', '孕妇慎用半夏']
  }
]
