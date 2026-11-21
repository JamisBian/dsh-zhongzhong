// 经方库 · 太阳病篇
//
// 剂量记录原方度量：liang=两，zhu=铢，jin=斤，count+unit=枚/个/片；
// 无法折算的写 text（如「半升」「三合」）。克数由 engine/dose.js 按
// GRAMS_PER_LIANG（默认 1两=3g）统一折算，数据里不写克数。

export const SUN_FORMULAS = [
  {
    id: 'guizhi_tang',
    name: '桂枝汤',
    alias: '阳旦汤',
    source: '《伤寒论·辨太阳病脉证并治上》',
    six: '太阳',
    composition: [
      { herb: '桂枝', liang: 3, prep: '去皮' },
      { herb: '芍药', liang: 3 },
      { herb: '甘草', liang: 2, prep: '炙' },
      { herb: '生姜', liang: 3, prep: '切' },
      { herb: '大枣', count: 12, unit: '枚', prep: '擘' }
    ],
    decoction:
      '上五味，以水七升，微火煮取三升，去滓，适寒温，服一升。服已须臾，啜热稀粥一升余，以助药力；温覆令一时许，遍身漐漐微似有汗者益佳，不可令如水流漓。现代：水煎二次，取汁约 400ml，分二次温服，服后啜热稀粥、盖被取微汗。',
    pattern: ['头痛', '发热', '汗出', '恶风', '鼻鸣干呕', '脉浮缓或浮弱'],
    indicators: [
      { id: 'aversion_wind', w: 3 },
      { id: 'aversion_cold', w: 1 },
      { id: 'fever', w: 2 },
      { id: 'spontaneous_sweat', w: 3 },
      { id: 'headache', w: 2 },
      { id: 'nasal', w: 1 },
      { id: 'dry_heave', w: 1 },
      { id: 'pulse_float', w: 2 },
      { id: 'pulse_weak', w: 1 }
    ],
    contra: [
      { id: 'no_sweat', w: 2 },
      { id: 'pulse_tight', w: 2 },
      { id: 'thirst_cold', w: 2 },
      { id: 'yellow_sputum', w: 1 },
      { id: 'alternating', w: 2 },
      { id: 'bitter_mouth', w: 1 },
      { id: 'hypochondriac', w: 1 }
    ],
    clauses: [
      {
        ref: '《伤寒论·辨太阳病脉证并治上》第12条',
        text: '太阳中风，阳浮而阴弱，阳浮者，热自发，阴弱者，汗自出，啬啬恶寒，淅淅恶风，翕翕发热，鼻鸣干呕者，桂枝汤主之。'
      },
      {
        ref: '《伤寒论·辨太阳病脉证并治上》第13条',
        text: '太阳病，头痛发热，汗出恶风，桂枝汤主之。'
      }
    ],
    modern: {
      terms: ['Guizhi Tang', 'Keishi-to', 'Gui Zhi Tang'],
      conditions: ['common cold', 'influenza', 'fever']
    },
    safety: ['表实无汗、脉浮紧者禁用', '温病初起、里热炽盛者禁用', '服后忌生冷、油腻']
  },
  {
    id: 'guizhi_jia_gegen_tang',
    name: '桂枝加葛根汤',
    source: '《伤寒论·辨太阳病脉证并治上》',
    six: '太阳',
    composition: [
      { herb: '葛根', liang: 4 },
      { herb: '桂枝', liang: 3, prep: '去皮' },
      { herb: '芍药', liang: 3 },
      { herb: '甘草', liang: 2, prep: '炙' },
      { herb: '生姜', liang: 3, prep: '切' },
      { herb: '大枣', count: 12, unit: '枚', prep: '擘' }
    ],
    decoction: '上六味，以水一斗，先煮葛根，减二升，内诸药，煮取三升，去滓，温服一升。现代：水煎二次，取汁 400ml，分二次温服。',
    pattern: ['项背强几几', '汗出', '恶风', '发热'],
    indicators: [
      { id: 'stiff_neck', w: 3 },
      { id: 'aversion_wind', w: 2 },
      { id: 'spontaneous_sweat', w: 2 },
      { id: 'fever', w: 1 },
      { id: 'headache', w: 1 },
      { id: 'pulse_float', w: 1 }
    ],
    contra: [{ id: 'no_sweat', w: 2 }],
    clauses: [
      {
        ref: '《伤寒论·辨太阳病脉证并治上》第14条',
        text: '太阳病，项背强几几，反汗出恶风者，桂枝加葛根汤主之。'
      }
    ],
    modern: { terms: ['Guizhi Jia Gegen Tang', 'Kakkonto'], conditions: ['neck pain', 'stiff neck', 'common cold'] },
    safety: ['无汗表实者不宜']
  },
  {
    id: 'mahuang_tang',
    name: '麻黄汤',
    source: '《伤寒论·辨太阳病脉证并治中》',
    six: '太阳',
    composition: [
      { herb: '麻黄', liang: 3, prep: '去节' },
      { herb: '桂枝', liang: 2, prep: '去皮' },
      { herb: '甘草', liang: 1, prep: '炙' },
      { herb: '杏仁', count: 70, unit: '个', prep: '去皮尖' }
    ],
    decoction:
      '上四味，以水九升，先煮麻黄，减二升，去上沫，内诸药，煮取二升半，去滓，温服八合。覆取微似汗，不须啜粥，余如桂枝法将息。现代：水煎二次，取汁 300ml，分二次温服，取微汗。',
    pattern: ['恶寒发热', '无汗而喘', '身疼腰痛', '骨节疼痛', '脉浮紧'],
    indicators: [
      { id: 'no_sweat', w: 3 },
      { id: 'aversion_cold', w: 3 },
      { id: 'fever', w: 3 },
      { id: 'body_ache', w: 2 },
      { id: 'joint_pain', w: 2 },
      { id: 'wheezing', w: 2 },
      { id: 'headache', w: 2 },
      { id: 'pulse_float', w: 2 },
      { id: 'pulse_tight', w: 2 }
    ],
    contra: [
      { id: 'spontaneous_sweat', w: 3 },
      { id: 'night_sweat', w: 2 },
      { id: 'pulse_weak', w: 2 },
      { id: 'cold_limbs', w: 1 }
    ],
    clauses: [
      {
        ref: '《伤寒论·辨太阳病脉证并治中》第35条',
        text: '太阳病，头痛发热，身疼腰痛，骨节疼痛，恶风无汗而喘者，麻黄汤主之。'
      }
    ],
    modern: { terms: ['Mahuang Tang', 'Ma Huang Tang', 'Ephedra Decoction'], conditions: ['common cold', 'influenza', 'asthma'] },
    safety: [
      '麻黄含麻黄碱：高血压、冠心病、心律失常、甲亢、失眠者慎用或禁用',
      '表虚自汗、脉微弱者禁用',
      '得汗即止，不可过汗'
    ]
  },
  {
    id: 'gegen_tang',
    name: '葛根汤',
    source: '《伤寒论·辨太阳病脉证并治中》',
    six: '太阳',
    composition: [
      { herb: '葛根', liang: 4 },
      { herb: '麻黄', liang: 3, prep: '去节' },
      { herb: '桂枝', liang: 2, prep: '去皮' },
      { herb: '芍药', liang: 2 },
      { herb: '甘草', liang: 2, prep: '炙' },
      { herb: '生姜', liang: 3, prep: '切' },
      { herb: '大枣', count: 12, unit: '枚', prep: '擘' }
    ],
    decoction: '上七味，以水一斗，先煮麻黄、葛根，减二升，去白沫，内诸药，煮取三升，去滓，温服一升。现代：水煎二次，取汁 400ml，分二次温服。',
    pattern: ['项背强几几', '无汗恶风', '发热', '或下利'],
    indicators: [
      { id: 'stiff_neck', w: 3 },
      { id: 'no_sweat', w: 2 },
      { id: 'aversion_cold', w: 2 },
      { id: 'fever', w: 2 },
      { id: 'body_ache', w: 1 },
      { id: 'diarrhea', w: 1 },
      { id: 'pulse_float', w: 1 },
      { id: 'pulse_tight', w: 1 }
    ],
    contra: [{ id: 'spontaneous_sweat', w: 2 }, { id: 'pulse_weak', w: 1 }],
    clauses: [
      {
        ref: '《伤寒论·辨太阳病脉证并治中》第31条',
        text: '太阳病，项背强几几，无汗恶风，葛根汤主之。'
      },
      {
        ref: '《伤寒论·辨太阳病脉证并治中》第32条',
        text: '太阳与阳明合病者，必自下利，葛根汤主之。'
      }
    ],
    modern: { terms: ['Gegen Tang', 'Kakkonto'], conditions: ['neck stiffness', 'common cold', 'diarrhea'] },
    safety: ['同麻黄汤：高血压、心脏病者慎用麻黄']
  },
  {
    id: 'da_qinglong_tang',
    name: '大青龙汤',
    source: '《伤寒论·辨太阳病脉证并治中》',
    doseCap: { 麻黄: 9 },
    six: '太阳',
    composition: [
      { herb: '麻黄', liang: 6, prep: '去节' },
      { herb: '桂枝', liang: 2, prep: '去皮' },
      { herb: '甘草', liang: 2, prep: '炙' },
      { herb: '杏仁', count: 40, unit: '个', prep: '去皮尖' },
      { herb: '生姜', liang: 3, prep: '切' },
      { herb: '大枣', count: 10, unit: '枚', prep: '擘' },
      { herb: '石膏', text: '如鸡子大', grams: '约 30g', prep: '碎' }
    ],
    decoction: '上七味，以水九升，先煮麻黄，减二升，去上沫，内诸药，煮取三升，去滓，温服一升，取微似汗。汗出多者，温粉粉之；一服汗者，停后服。',
    pattern: ['发热恶寒', '身疼痛', '不汗出而烦躁', '脉浮紧'],
    indicators: [
      { id: 'fever', w: 3 },
      { id: 'aversion_cold', w: 3 },
      { id: 'no_sweat', w: 3 },
      { id: 'restlessness', w: 3 },
      { id: 'body_ache', w: 2 },
      { id: 'pulse_float', w: 2 },
      { id: 'pulse_tight', w: 2 },
      { id: 'thirst', w: 1 }
    ],
    contra: [{ id: 'spontaneous_sweat', w: 3 }, { id: 'pulse_weak', w: 3 }],
    clauses: [
      {
        ref: '《伤寒论·辨太阳病脉证并治中》第38条',
        text: '太阳中风，脉浮紧，发热恶寒，身疼痛，不汗出而烦躁者，大青龙汤主之。若脉微弱，汗出恶风者，不可服之；服之则厥逆，筋惕肉瞤，此为逆也。'
      }
    ],
    modern: { terms: ['Da Qing Long Tang', 'Dai-seiryu-to'], conditions: ['influenza', 'high fever'] },
    safety: [
      '麻黄六两≈18g，为汉代峻汗之量，现代临床宜减至 6–9g 并随证调整',
      '发汗峻剂，体虚、心悸、高血压者禁用',
      '一服汗出即停后服，过汗可致亡阳'
    ]
  },
  {
    id: 'xiao_qinglong_tang',
    name: '小青龙汤',
    source: '《伤寒论·辨太阳病脉证并治中》',
    six: '太阳',
    composition: [
      { herb: '麻黄', liang: 3, prep: '去节' },
      { herb: '芍药', liang: 3 },
      { herb: '细辛', liang: 3 },
      { herb: '干姜', liang: 3 },
      { herb: '甘草', liang: 3, prep: '炙' },
      { herb: '桂枝', liang: 3, prep: '去皮' },
      { herb: '五味子', text: '半升', grams: '约 9g' },
      { herb: '半夏', text: '半升', grams: '约 9g', prep: '洗' }
    ],
    decoction: '上八味，以水一斗，先煮麻黄，减二升，去上沫，内诸药，煮取三升，去滓，温服一升。现代：水煎二次，取汁 400ml，分三次温服。',
    pattern: ['咳喘', '痰白清稀', '恶寒', '无汗', '干呕', '脉浮紧'],
    indicators: [
      { id: 'cough', w: 3 },
      { id: 'white_sputum', w: 3 },
      { id: 'wheezing', w: 2 },
      { id: 'aversion_cold', w: 2 },
      { id: 'no_sweat', w: 2 },
      { id: 'dry_heave', w: 2 },
      { id: 'nasal', w: 1 },
      { id: 'edema', w: 1 },
      { id: 'pulse_tight', w: 1 },
      { id: 'pulse_float', w: 1 }
    ],
    contra: [{ id: 'yellow_sputum', w: 2 }, { id: 'night_sweat', w: 1 }, { id: 'tongue_red', w: 1 }],
    clauses: [
      {
        ref: '《伤寒论·辨太阳病脉证并治中》第40条',
        text: '伤寒表不解，心下有水气，干呕发热而咳，或渴，或利，或噎，或小便不利、少腹满，或喘者，小青龙汤主之。'
      }
    ],
    modern: { terms: ['Xiao Qing Long Tang', 'Sho-seiryu-to'], conditions: ['asthma', 'cough', 'allergic rhinitis'] },
    safety: ['细辛原方三两→9g，超现代药典常用量，临床多减至 3g 并久煎', '干咳无痰、阴虚燥咳者禁用', '高血压者慎用麻黄']
  },
  {
    id: 'ma_xing_shi_gan_tang',
    name: '麻黄杏仁甘草石膏汤',
    alias: '麻杏石甘汤',
    source: '《伤寒论·辨太阳病脉证并治中》',
    six: '太阳',
    composition: [
      { herb: '麻黄', liang: 4, prep: '去节' },
      { herb: '杏仁', count: 50, unit: '个', prep: '去皮尖' },
      { herb: '甘草', liang: 2, prep: '炙' },
      { herb: '石膏', text: '半斤', grams: '24g', prep: '碎，绵裹' }
    ],
    decoction: '上四味，以水七升，煮麻黄，减二升，去上沫，内诸药，煮取二升，去滓，温服一升。',
    pattern: ['汗出而喘', '身热', '咳嗽', '痰黄', '脉数'],
    indicators: [
      { id: 'wheezing', w: 3 },
      { id: 'cough', w: 2 },
      { id: 'yellow_sputum', w: 2 },
      { id: 'fever', w: 2 },
      { id: 'spontaneous_sweat', w: 2 },
      { id: 'pulse_rapid', w: 2 },
      { id: 'thirst', w: 1 },
      { id: 'sore_throat', w: 1 }
    ],
    contra: [{ id: 'white_sputum', w: 2 }, { id: 'chill_body', w: 1 }],
    clauses: [
      {
        ref: '《伤寒论·辨太阳病脉证并治中》第63条',
        text: '发汗后，不可更行桂枝汤。汗出而喘，无大热者，可与麻黄杏仁甘草石膏汤。'
      }
    ],
    modern: { terms: ['Ma Xing Shi Gan Tang', 'Mao-kan-seki-kan-to'], conditions: ['pneumonia', 'asthma', 'bronchitis'] },
    safety: ['麻黄慎用于高血压、心脏病', '风寒咳喘、痰白清稀者不宜']
  },
  {
    id: 'guizhi_jia_houpo_xingzi_tang',
    name: '桂枝加厚朴杏子汤',
    source: '《伤寒论·辨太阳病脉证并治中》',
    six: '太阳',
    composition: [
      { herb: '桂枝', liang: 3, prep: '去皮' },
      { herb: '芍药', liang: 3 },
      { herb: '甘草', liang: 2, prep: '炙' },
      { herb: '生姜', liang: 3, prep: '切' },
      { herb: '大枣', count: 12, unit: '枚', prep: '擘' },
      { herb: '厚朴', liang: 2, prep: '炙，去皮' },
      { herb: '杏仁', count: 50, unit: '个', prep: '去皮尖' }
    ],
    decoction: '上七味，以水七升，微火煮取三升，去滓，温服一升，覆取微似汗。',
    pattern: ['素有喘疾', '汗出恶风', '喘息', '脉浮弱'],
    indicators: [
      { id: 'wheezing', w: 3 },
      { id: 'spontaneous_sweat', w: 2 },
      { id: 'aversion_wind', w: 2 },
      { id: 'cough', w: 2 },
      { id: 'white_sputum', w: 1 },
      { id: 'pulse_float', w: 1 }
    ],
    contra: [{ id: 'no_sweat', w: 1 }],
    clauses: [
      {
        ref: '《伤寒论·辨太阳病脉证并治中》第43条',
        text: '太阳病，下之微喘者，表未解故也，桂枝加厚朴杏子汤主之。'
      }
    ],
    modern: { terms: ['Guizhi Jia Houpo Xingzi Tang'], conditions: ['asthma', 'chronic cough'] },
    safety: ['痰热壅盛者不宜']
  },
  {
    id: 'wuling_san',
    name: '五苓散',
    source: '《伤寒论·辨太阳病脉证并治中》',
    doseBasis: 'ratio',
    six: '太阳',
    composition: [
      { herb: '猪苓', zhu: 18, prep: '去皮' },
      { herb: '泽泻', liang: 1.25 },
      { herb: '白术', zhu: 18 },
      { herb: '茯苓', zhu: 18 },
      { herb: '桂枝', liang: 0.5, prep: '去皮' }
    ],
    decoction: '上五味，捣为散，以白饮和服方寸匕，日三服，多饮暖水，汗出愈。现代：研细末，每服 6g，日三次，温水送服；亦可作汤剂水煎服。',
    pattern: ['小便不利', '渴欲饮水', '水入则吐', '微热', '脉浮'],
    indicators: [
      { id: 'difficult_urine', w: 3 },
      { id: 'thirst', w: 3 },
      { id: 'vomiting', w: 2 },
      { id: 'dizziness', w: 2 },
      { id: 'edema', w: 2 },
      { id: 'fever', w: 1 },
      { id: 'pulse_float', w: 1 }
    ],
    contra: [{ id: 'thirst_no_drink', w: 1 }],
    clauses: [
      {
        ref: '《伤寒论·辨太阳病脉证并治中》第71条',
        text: '太阳病，发汗后，大汗出，胃中干，烦躁不得眠，欲得饮水者，少少与饮之，令胃气和则愈。若脉浮，小便不利，微热消渴者，五苓散主之。'
      }
    ],
    modern: { terms: ['Wuling San', 'Gorei-san'], conditions: ['edema', 'urinary retention', 'diarrhea'] },
    safety: ['阴虚津伤、小便短赤而无水湿者不宜', '孕妇慎用']
  },
  {
    id: 'linggui_zhugan_tang',
    name: '苓桂术甘汤',
    source: '《伤寒论·辨太阳病脉证并治中》',
    six: '太阳',
    composition: [
      { herb: '茯苓', liang: 4 },
      { herb: '桂枝', liang: 3, prep: '去皮' },
      { herb: '白术', liang: 2 },
      { herb: '甘草', liang: 2, prep: '炙' }
    ],
    decoction: '上四味，以水六升，煮取三升，去滓，分温三服。',
    pattern: ['心下逆满', '气上冲胸', '起则头眩', '脉沉紧'],
    indicators: [
      { id: 'dizziness', w: 3 },
      { id: 'chest_oppression', w: 2 },
      { id: 'epigastric_distention', w: 2 },
      { id: 'palpitation', w: 2 },
      { id: 'edema', w: 1 },
      { id: 'loose_stool', w: 1 },
      { id: 'pulse_deep', w: 1 },
      { id: 'pulse_tight', w: 1 },
      { id: 'tongue_swollen', w: 1 },
      { id: 'coat_white_greasy', w: 1 }
    ],
    contra: [{ id: 'tongue_red', w: 1 }, { id: 'thirst_cold', w: 1 }],
    clauses: [
      {
        ref: '《伤寒论·辨太阳病脉证并治中》第67条',
        text: '伤寒，若吐若下后，心下逆满，气上冲胸，起则头眩，脉沉紧，发汗则动经，身为振振摇者，茯苓桂枝白术甘草汤主之。'
      }
    ],
    modern: { terms: ['Ling Gui Zhu Gan Tang', 'Ryokei-jutsukan-to'], conditions: ['Meniere disease', 'vertigo', 'palpitation'] },
    safety: ['阴虚火旺、湿热内盛者不宜']
  },
  {
    id: 'taohe_chengqi_tang',
    name: '桃核承气汤',
    source: '《伤寒论·辨太阳病脉证并治中》',
    six: '太阳',
    composition: [
      { herb: '桃仁', count: 50, unit: '个', prep: '去皮尖' },
      { herb: '大黄', liang: 4 },
      { herb: '桂枝', liang: 2, prep: '去皮' },
      { herb: '甘草', liang: 2, prep: '炙' },
      { herb: '芒硝', liang: 2 }
    ],
    decoction: '上五味，以水七升，煮取二升半，去滓，内芒硝，更上火微沸，下火，先食温服五合，日三服，当微利。',
    pattern: ['少腹急结', '其人如狂', '大便色黑', '经闭痛经'],
    indicators: [
      { id: 'lower_abdomen', w: 3 },
      { id: 'restlessness', w: 2 },
      { id: 'delirium', w: 2 },
      { id: 'constipation', w: 2 },
      { id: 'menstrual', w: 2 },
      { id: 'dysmenorrhea', w: 2 },
      { id: 'dark_urine', w: 1 }
    ],
    contra: [{ id: 'pulse_weak', w: 2 }, { id: 'cold_limbs', w: 1 }],
    clauses: [
      {
        ref: '《伤寒论·辨太阳病脉证并治中》第106条',
        text: '太阳病不解，热结膀胱，其人如狂，血自下，下者愈。其外不解者，尚未可攻，当先解其外；外解已，但少腹急结者，乃可攻之，宜桃核承气汤。'
      }
    ],
    modern: { terms: ['Taohe Chengqi Tang', 'Tokaku-joki-to'], conditions: ['dysmenorrhea', 'pelvic congestion'] },
    safety: ['孕妇禁用', '月经过多、有出血倾向者禁用', '体虚者慎用，中病即止']
  },
  {
    id: 'zhigancao_tang',
    name: '炙甘草汤',
    alias: '复脉汤',
    source: '《伤寒论·辨太阳病脉证并治下》',
    six: '太阳',
    composition: [
      { herb: '甘草', liang: 4, prep: '炙' },
      { herb: '生姜', liang: 3, prep: '切' },
      { herb: '人参', liang: 2 },
      { herb: '生地黄', text: '一斤', grams: '48g' },
      { herb: '桂枝', liang: 3, prep: '去皮' },
      { herb: '阿胶', liang: 2 },
      { herb: '麦门冬', text: '半升', grams: '约 9g', prep: '去心' },
      { herb: '麻仁', text: '半升', grams: '约 9g' },
      { herb: '大枣', count: 30, unit: '枚', prep: '擘' }
    ],
    decoction:
      '上九味，以清酒七升、水八升，先煮八味，取三升，去滓，内胶烊消尽，温服一升，日三服。现代：水煎（可加黄酒适量），阿胶烊化分服。',
    pattern: ['脉结代', '心动悸', '气短', '舌淡少苔'],
    indicators: [
      { id: 'pulse_knotted', w: 3 },
      { id: 'palpitation', w: 3 },
      { id: 'fatigue', w: 2 },
      { id: 'insomnia', w: 1 },
      { id: 'dry_mouth', w: 1 },
      { id: 'tongue_pale', w: 1 },
      { id: 'coat_none', w: 1 }
    ],
    contra: [{ id: 'coat_yellow_greasy', w: 1 }],
    clauses: [
      {
        ref: '《伤寒论·辨太阳病脉证并治下》第177条',
        text: '伤寒，脉结代，心动悸，炙甘草汤主之。'
      }
    ],
    modern: { terms: ['Zhi Gancao Tang', 'Shakanzoto'], conditions: ['arrhythmia', 'palpitation'] },
    safety: ['心衰、水肿明显者需医师调整', '脾胃虚寒、便溏者慎用生地、阿胶']
  }
]
