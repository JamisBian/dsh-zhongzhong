// 经方库 · 由后世注家方证补录的 5 首「无原文论治」的经方
//
// 天雄散、头风摩散、排脓散、排脓汤、蛇床子散在《金匮要略》里只有方名与组成，
// 没有论治文字，原先只能作为名录（verified:false）。现据王付《伤寒杂病论》方证
// 讲解的【主治】补出方证，升为可辨证方。
//
// 证据性质与仲景原文不同：clauses 引用的是注家方证，evidence 会标注
// 「后世注家方证」，开方时也按此提示，不冒充原文。

export const JINGUI_COMMENTARY_FORMULAS = [
  {
    id: 'tianxiong_san',
    name: '天雄散',
    source: '《金匮要略·血痹虚劳病脉证并治》',
    six: '杂病',
    doseBasis: 'modern',
    composition: [
      { herb: '天雄', text: '9g', prep: '炮' },
      { herb: '白术', text: '24g' },
      { herb: '桂枝', text: '18g' },
      { herb: '龙骨', text: '9g' }
    ],
    decoction: '上四味，杵为散，酒服半钱匕，日三服；不知，稍增之。现代：研末，每服 3g，日二次，温酒送服。',
    pattern: ['梦中失精', '腰酸腿软', '恶寒', '发脱齿动', '脉沉弱'],
    indicators: [
      { id: 'spermatorrhea', w: 3 },
      { id: 'back_ache', w: 3 },
      { id: 'chill_body', w: 2 },
      { id: 'cold_limbs', w: 2 },
      { id: 'pulse_deep', w: 2 },
      { id: 'dizziness', w: 1 },
      { id: 'forgetfulness', w: 1 },
      { id: 'tongue_pale', w: 1 }
    ],
    contra: [
      { id: 'hot_palms', w: 2 },
      { id: 'night_sweat', w: 1 },
      { id: 'thirst_cold', w: 1 }
    ],
    clauses: [
      {
        ref: '后世注家方证·王付【主治】天雄散',
        text: '肾阳虚失精证。梦中失精，或阳痿，或无梦失精，腰酸腿软，恶寒，发脱齿动，或健忘，或头晕，或耳鸣，舌淡、苔薄，脉沉弱。'
      }
    ],
    modern: { terms: ['Tianxiong San'], conditions: ['premature ejaculation', 'prostatitis', 'sexual dysfunction'] },
    safety: ['天雄为附子类，有毒，须炮制并严格控制剂量', '阴虚火旺、湿热下注之遗精禁用', '孕妇禁用']
  },
  {
    id: 'toufeng_mo_san',
    name: '头风摩散',
    source: '《金匮要略·中风历节病脉证并治》',
    six: '杂病',
    doseBasis: 'ratio',
    composition: [
      { herb: '大附子', text: '一枚', prep: '炮' },
      { herb: '盐', text: '等分' }
    ],
    decoction: '上二味为散，沐了，以方寸匕摩疾上，令药力行。（外用摩法，非内服）',
    pattern: ['头痛空痛', '受凉加重', '恶寒', '目眩', '脉沉或迟'],
    indicators: [
      { id: 'headache', w: 3 },
      { id: 'chill_body', w: 2 },
      { id: 'aversion_cold', w: 2 },
      { id: 'back_ache', w: 2 },
      { id: 'dizziness', w: 1 },
      { id: 'difficult_urine', w: 1 },
      { id: 'pulse_deep', w: 1 },
      { id: 'pulse_slow', w: 1 }
    ],
    contra: [
      { id: 'fever', w: 2 },
      { id: 'tongue_red', w: 1 },
      { id: 'thirst_cold', w: 1 }
    ],
    clauses: [
      {
        ref: '后世注家方证·王付【主治】头风摩散',
        text: '肾寒头痛证。头痛，或空痛，或受凉加重，或小便不利，汗出，或无汗，恶寒，或目眩，或腰背冷痛，舌淡、苔薄白，脉沉或迟。'
      }
    ],
    modern: { terms: ['Toufeng Mo San'], conditions: ['trigeminal neuralgia', 'migraine'] },
    safety: ['本方为外用摩法，禁止内服', '附子外用亦可经皮吸收，皮肤破损处禁用', '头痛突发剧烈或伴呕吐、肢瘫须立即急诊']
  },
  {
    id: 'paizhu_san',
    name: '排脓散',
    source: '《金匮要略·疮痈肠痈浸淫病脉证并治》',
    six: '杂病',
    doseBasis: 'modern',
    composition: [
      { herb: '枳实', text: '16g' },
      { herb: '芍药', text: '18g' },
      { herb: '桔梗', text: '6g' }
    ],
    decoction: '上三味，杵为散，取鸡子黄一枚，以药散与鸡黄相等，揉和令相得，饮和服之，日一服。现代：研末每服 6g，鸡子黄或米汤调服。',
    pattern: ['胃痛或胀', '欲呕', '吐物脓血腥臭', '舌红苔黄腻', '脉滑或弦数'],
    indicators: [
      { id: 'epigastric_pain', w: 3 },
      { id: 'vomiting', w: 3 },
      { id: 'nausea', w: 2 },
      { id: 'tongue_red', w: 2 },
      { id: 'coat_yellow_greasy', w: 2 },
      { id: 'pulse_slippery', w: 2 },
      { id: 'poor_appetite', w: 1 }
    ],
    contra: [
      { id: 'tongue_pale', w: 2 },
      { id: 'cold_limbs', w: 2 },
      { id: 'loose_stool', w: 1 }
    ],
    clauses: [
      {
        ref: '后世注家方证·王付【主治】排脓散',
        text: '胃痈热证。胃痛或胀，或欲呕，或吐物为脓血，或腥臭，大便不调，舌红、苔黄略腻，脉滑或弦数。'
      }
    ],
    modern: { terms: ['Paizhu San'], conditions: ['gastric ulcer', 'gastritis', 'lung abscess'] },
    safety: ['吐脓血、持续腹痛须先排除消化道出血与穿孔', '孕妇慎用枳实', '苦寒排脓之剂，虚寒者禁用']
  },
  {
    id: 'paizhu_tang',
    name: '排脓汤',
    source: '《金匮要略·疮痈肠痈浸淫病脉证并治》',
    six: '杂病',
    doseBasis: 'modern',
    composition: [
      { herb: '甘草', text: '6g' },
      { herb: '桔梗', text: '9g' },
      { herb: '生姜', text: '3g' },
      { herb: '大枣', count: 10, unit: '枚' }
    ],
    decoction: '上四味，以水三升，煮取一升，温服五合，日再服。',
    pattern: ['胃脘胀痛', '呕吐脓血', '喜温喜按', '舌淡苔白', '脉迟'],
    indicators: [
      { id: 'epigastric_pain', w: 3 },
      { id: 'vomiting', w: 3 },
      { id: 'poor_appetite', w: 2 },
      { id: 'chill_body', w: 2 },
      { id: 'tongue_pale', w: 2 },
      { id: 'loose_stool', w: 1 },
      { id: 'pulse_slow', w: 1 }
    ],
    contra: [
      { id: 'tongue_red', w: 2 },
      { id: 'coat_yellow_greasy', w: 2 },
      { id: 'fever', w: 1 }
    ],
    clauses: [
      {
        ref: '后世注家方证·王付【主治】排脓汤',
        text: '胃痈寒证。胃脘胀痛，呕吐脓血，喜温喜按，舌淡、苔白，脉迟。'
      }
    ],
    modern: { terms: ['Paizhu Tang'], conditions: ['gastric ulcer', 'chronic gastritis'] },
    safety: ['吐脓血须先就医明确病因', '甘草用量偏大，高血压、水肿者减量', '本方偏温，湿热壅盛者禁用']
  },
  {
    id: 'shechuangzi_san',
    name: '蛇床子散',
    source: '《金匮要略·妇人杂病脉证并治》',
    six: '杂病',
    doseBasis: 'ratio',
    composition: [
      { herb: '蛇床子仁', text: '适量' },
      { herb: '白粉', text: '少许' }
    ],
    decoction: '上一味，末之，以白粉少许和令相得，如枣大，绵裹内之，自然温。（外用坐药，非内服）',
    pattern: ['前阴瘙痒', '带下量多色白', '腰膝酸软', '舌淡苔薄', '脉迟'],
    indicators: [
      { id: 'leukorrhea', w: 3 },
      { id: 'itching', w: 3 },
      { id: 'chill_body', w: 2 },
      { id: 'back_ache', w: 1 },
      { id: 'tongue_pale', w: 1 },
      { id: 'pulse_slow', w: 1 }
    ],
    contra: [
      { id: 'dark_urine', w: 2 },
      { id: 'tongue_red', w: 1 },
      { id: 'coat_yellow_greasy', w: 1 }
    ],
    clauses: [
      {
        ref: '后世注家方证·王付【主治】蛇床子散',
        text: '寒湿下注证。前阴瘙痒，带下量多色白，腰膝酸软，或湿疹，或湿疮，或恶寒，舌淡、苔薄，脉迟。'
      },
      {
        ref: '《金匮要略·妇人杂病脉证并治》',
        text: '蛇床子散方，温阴中坐药。'
      }
    ],
    modern: { terms: ['Shechuangzi San'], conditions: ['vaginitis', 'candidiasis', 'pruritus vulvae'] },
    safety: ['本方为外用坐药，禁止内服', '带下异常须先查病原体（滴虫、真菌、细菌）', '孕期与外阴破损者慎用']
  }
]
