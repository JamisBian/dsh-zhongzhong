// 《医学衷中参西录·药物》单方的人工校准
//
// 药物篇每味药是一篇「本草+医案+单方用法」，自动抽取主治句容易被医案带偏。
// 这里逐味给出：
//   summary     一句话主治（患者能读懂）
//   indicators  方证指标（3–6 条，至少 1 条 w=3）
//   usage       单方用法（原书主用法）
//   safety      额外安全提示（毒性/保护药材等）
//
// 键是标准药名（lib/data/herbs.js 归一后的名字）。

export const DANFANG_CALIBRATION = {
  石膏: {
    summary: '清阳明胃腑实热：壮热、烦渴、汗出、脉洪大；亦治胃热呕吐、头痛、牙痛。',
    indicators: [{ id: 'fever', w: 3 }, { id: 'thirst_cold', w: 3 }, { id: 'profuse_sweat', w: 2 }, { id: 'pulse_surging', w: 2 }, { id: 'headache', w: 1 }, { id: 'toothache', w: 1 }],
    usage: '生用轧细，水煎分次温服；热退即止，脾胃虚寒者慎用。'
  },
  人参: {
    summary: '大补元气，补脾益肺，生津安神：气虚欲脱、脾肺气虚、津伤口渴、心悸失眠。',
    indicators: [{ id: 'fatigue', w: 3 }, { id: 'breath_faint', w: 2 }, { id: 'poor_appetite', w: 2 }, { id: 'palpitation', w: 2 }, { id: 'insomnia', w: 1 }, { id: 'spontaneous_sweat', w: 1 }],
    usage: '另炖兑服，或研末冲服；实证、热证慎用。'
  },
  西洋参: {
    summary: '补气养阴、清火生津：气阴两虚、虚热烦渴、口干乏力。',
    indicators: [{ id: 'fatigue', w: 3 }, { id: 'dry_mouth', w: 3 }, { id: 'heat_chest', w: 2 }, { id: 'thirst', w: 2 }],
    usage: '另炖或含服；中阳衰微、寒湿中阻者慎用。'
  },
  黄芪: {
    summary: '补气升阳、固表止汗、利水消肿、托疮生肌：大气下陷、自汗、水肿、疮疡不敛。',
    indicators: [{ id: 'qi_sinking', w: 3 }, { id: 'spontaneous_sweat', w: 3 }, { id: 'edema', w: 2 }, { id: 'fatigue', w: 2 }, { id: 'ulcer', w: 1 }, { id: 'difficult_urine', w: 1 }],
    usage: '生用或蜜炙，水煎温服；实证、阴虚阳亢者慎用。'
  },
  山萸肉: {
    summary: '收敛元气、固涩滑脱：大汗欲脱、遗精、尿频、崩漏。',
    indicators: [{ id: 'spontaneous_sweat', w: 3 }, { id: 'breath_faint', w: 2 }, { id: 'spermatorrhea', w: 2 }, { id: 'enuresis', w: 2 }, { id: 'metrorrhagia', w: 1 }],
    usage: '去净核，煎汤或入丸散；命门火炽、湿热者慎用。'
  },
  白术: {
    summary: '健脾益气、燥湿利水、止汗安胎：脾虚泄泻、水肿、自汗、胎动不安。',
    indicators: [{ id: 'diarrhea', w: 3 }, { id: 'poor_appetite', w: 3 }, { id: 'edema', w: 2 }, { id: 'spontaneous_sweat', w: 2 }, { id: 'fatigue', w: 1 }],
    usage: '生用或炒用，水煎温服；阴虚内热、津液亏耗者慎用。'
  },
  赭石: {
    summary: '镇逆平肝、降痰止呕、凉血止血：呕吐嗳气、喘逆、吐血衄血、眩晕。',
    indicators: [{ id: 'vomiting', w: 3 }, { id: 'qi_rush_up', w: 3 }, { id: 'hematemesis', w: 2 }, { id: 'wheezing', w: 2 }, { id: 'dizziness', w: 1 }],
    usage: '轧细先煎，水煎温服；孕妇慎用，宜先煎。'
  },
  山药: {
    summary: '补脾养胃、生津益肺、补肾涩精：脾虚泄泻、肺虚咳喘、消渴、遗精带下。',
    indicators: [{ id: 'diarrhea', w: 3 }, { id: 'cough', w: 2 }, { id: 'polydipsia', w: 2 }, { id: 'poor_appetite', w: 2 }, { id: 'spermatorrhea', w: 1 }, { id: 'leukorrhea', w: 1 }],
    usage: '生用煮汁或轧细煮粥；湿盛中满、有积滞者慎用。'
  },
  生地黄: {
    summary: '清热凉血、养阴生津：热入营血、吐血衄血、阴虚发热、消渴。',
    indicators: [{ id: 'fever', w: 3 }, { id: 'hematemesis', w: 3 }, { id: 'epistaxis', w: 2 }, { id: 'dry_mouth', w: 2 }, { id: 'polydipsia', w: 1 }],
    usage: '鲜用或干用，水煎温服；脾虚便溏者慎用。'
  },
  甘草: {
    summary: '补脾益气、清热解毒、调和诸药：脾虚、心悸、咳嗽、疮疡、药毒。',
    indicators: [{ id: 'fatigue', w: 2 }, { id: 'palpitation', w: 2 }, { id: 'cough', w: 2 }, { id: 'poor_appetite', w: 2 }, { id: 'carbuncle', w: 1 }],
    usage: '生用或蜜炙，水煎温服；长期大剂量可致水钠潴留。'
  },
  朱砂: {
    summary: '清心镇惊、安神解毒：心悸失眠、惊风癫痫、疮疡。',
    indicators: [{ id: 'palpitation', w: 3 }, { id: 'insomnia', w: 3 }, { id: 'anxiety', w: 2 }, { id: 'convulsion', w: 1 }],
    usage: '研细冲服或入丸散，不入煎剂；不可久服过量。',
    safety: ['朱砂含汞，有毒，不宜久服、过量；肝肾功能不全者慎用。']
  },
  鸦胆子: {
    summary: '清热解毒、截疟止痢、腐蚀赘疣：热性赤痢、疟疾、疮疡。',
    indicators: [{ id: 'dysentery', w: 3 }, { id: 'malaria', w: 2 }, { id: 'bloody_stool', w: 2 }, { id: 'carbuncle', w: 1 }],
    usage: '去壳取仁，囫囵吞服或装胶囊，不可嚼碎；孕妇、胃肠溃疡者慎用。',
    safety: ['鸦胆子有毒，须去壳取仁、囫囵吞服；不可嚼碎。']
  },
  龙骨: {
    summary: '镇惊安神、敛汗固精、止血涩肠：心悸失眠、自汗盗汗、遗精、崩漏。',
    indicators: [{ id: 'palpitation', w: 3 }, { id: 'insomnia', w: 2 }, { id: 'spontaneous_sweat', w: 2 }, { id: 'spermatorrhea', w: 2 }, { id: 'metrorrhagia', w: 1 }],
    usage: '生用或煅用，先煎；湿热积滞者慎用。'
  },
  牡蛎: {
    summary: '重镇安神、潜阳补阴、软坚散结、收敛固涩：眩晕、瘰疬、自汗、遗精、崩漏。',
    indicators: [{ id: 'dizziness', w: 3 }, { id: 'scrofula', w: 3 }, { id: 'spontaneous_sweat', w: 2 }, { id: 'spermatorrhea', w: 2 }, { id: 'metrorrhagia', w: 1 }],
    usage: '生用先煎，或煅用；虚寒者慎用。'
  },
  石决明: {
    summary: '平肝潜阳、清肝明目：头痛眩晕、目赤翳障、视物昏花。',
    indicators: [{ id: 'dizziness', w: 3 }, { id: 'eye_red_pain', w: 2 }, { id: 'blurred_vision', w: 2 }, { id: 'headache', w: 1 }],
    usage: '打碎先煎；脾胃虚寒者慎用。'
  },
  玄参: {
    summary: '清热凉血、滋阴降火、解毒散结：温病热入营血、咽喉肿痛、瘰疬、消渴。',
    indicators: [{ id: 'fever', w: 3 }, { id: 'sore_throat', w: 3 }, { id: 'dry_mouth', w: 2 }, { id: 'scrofula', w: 1 }, { id: 'polydipsia', w: 1 }],
    usage: '水煎温服；脾胃虚寒、便溏者慎用。'
  },
  当归: {
    summary: '补血活血、调经止痛、润肠通便：血虚、月经不调、痛经、疮疡、便秘。',
    indicators: [{ id: 'menstrual', w: 3 }, { id: 'dysmenorrhea', w: 2 }, { id: 'constipation', w: 2 }, { id: 'fatigue', w: 2 }, { id: 'carbuncle', w: 1 }],
    usage: '水煎温服，或入丸散；孕妇、便溏者慎用。'
  },
  白芍: {
    summary: '养血调经、敛阴止汗、柔肝止痛：月经不调、自汗盗汗、胁痛、腹痛。',
    indicators: [{ id: 'menstrual', w: 3 }, { id: 'spontaneous_sweat', w: 2 }, { id: 'hypochondriac', w: 2 }, { id: 'abdominal_pain', w: 2 }, { id: 'dysmenorrhea', w: 1 }],
    usage: '生用或炒用，水煎温服；虚寒腹痛、泄泻者慎用。'
  },
  川芎: {
    summary: '活血行气、祛风止痛：月经不调、痛经、头痛、胸胁疼痛。',
    indicators: [{ id: 'headache', w: 3 }, { id: 'dysmenorrhea', w: 3 }, { id: 'menstrual', w: 2 }, { id: 'chest_pain', w: 1 }, { id: 'joint_pain', w: 1 }],
    usage: '水煎温服；孕妇、阴虚火旺、月经过多者慎用。'
  },
  大黄: {
    summary: '泻下攻积、清热泻火、凉血解毒、逐瘀通经：便秘、积滞、吐血衄血、疮疡、经闭。',
    indicators: [{ id: 'constipation', w: 3 }, { id: 'hard_stool', w: 3 }, { id: 'hematemesis', w: 2 }, { id: 'carbuncle', w: 1 }, { id: 'amenorrhea', w: 1 }],
    usage: '生用后下或泡服，中病即止；孕妇禁用。'
  },
  朴硝: {
    summary: '泻下通便、润燥软坚、清热消肿：便秘、燥结、疮肿。',
    indicators: [{ id: 'constipation', w: 3 }, { id: 'hard_stool', w: 3 }, { id: 'carbuncle', w: 1 }],
    usage: '冲服或烊化，不宜久煎；孕妇禁用。'
  },
  硝石: {
    summary: '破坚散积、利尿泻下、解毒消肿：砂淋、便秘、疮肿。',
    indicators: [{ id: 'stone_urine', w: 3 }, { id: 'constipation', w: 2 }, { id: 'carbuncle', w: 1 }],
    usage: '研末冲服或入丸散，剂量从严；孕妇禁用。'
  },
  厚朴: {
    summary: '燥湿消痰、下气除满：胸腹满闷、呕吐、便秘、痰饮。',
    indicators: [{ id: 'abdominal_fullness', w: 3 }, { id: 'chest_fullness', w: 3 }, { id: 'vomiting', w: 2 }, { id: 'constipation', w: 1 }],
    usage: '水煎温服；孕妇、气虚者慎用。'
  },
  麻黄: {
    summary: '发汗解表、宣肺平喘、利水消肿：风寒表实、咳嗽气喘、水肿。',
    indicators: [{ id: 'no_sweat', w: 3 }, { id: 'aversion_cold', w: 3 }, { id: 'wheezing', w: 2 }, { id: 'edema', w: 2 }, { id: 'cough', w: 1 }],
    usage: '先煎去上沫，得汗即止；高血压、心脏病、甲亢、失眠者慎用。'
  },
  柴胡: {
    summary: '解表退热、疏肝解郁、升举阳气：寒热往来、胸胁苦满、口苦、大气下陷。',
    indicators: [{ id: 'alternating', w: 3 }, { id: 'hypochondriac', w: 3 }, { id: 'bitter_mouth', w: 2 }, { id: 'fever', w: 2 }, { id: 'qi_sinking', w: 1 }],
    usage: '水煎温服；真阴亏损、肝阳上亢者慎用。'
  },
  桂枝: {
    summary: '发汗解肌、温通经脉、助阳化气：风寒表虚、胸痹、心悸、经闭、水肿。',
    indicators: [{ id: 'aversion_wind', w: 3 }, { id: 'spontaneous_sweat', w: 2 }, { id: 'palpitation', w: 2 }, { id: 'chest_pain', w: 1 }, { id: 'amenorrhea', w: 1 }],
    usage: '水煎温服；温热病、血热出血、阴虚火旺者慎用。'
  },
  三七: {
    summary: '化瘀止血、活血定痛：吐血衄血、崩漏、跌打损伤、疮疡。',
    indicators: [{ id: 'hematemesis', w: 3 }, { id: 'metrorrhagia', w: 2 }, { id: 'trauma', w: 2 }, { id: 'hemoptysis', w: 2 }, { id: 'carbuncle', w: 1 }],
    usage: '研末冲服或入丸散；孕妇慎用。'
  },
  滑石: {
    summary: '利尿通淋、清热解暑、祛湿敛疮：小便不利、淋证、暑湿、泄泻。',
    indicators: [{ id: 'difficult_urine', w: 3 }, { id: 'strangury', w: 2 }, { id: 'diarrhea', w: 2 }, { id: 'thirst', w: 1 }],
    usage: '飞滑石包煎，或入丸散；孕妇、脾虚滑泄者慎用。'
  },
  牛膝: {
    summary: '逐瘀通经、补肝肾、强筋骨、利尿通淋、引血下行：经闭、痛经、腰膝酸痛、头痛眩晕、尿血。',
    indicators: [{ id: 'amenorrhea', w: 3 }, { id: 'leg_pain', w: 2 }, { id: 'dizziness', w: 2 }, { id: 'hematuria', w: 1 }, { id: 'back_ache', w: 1 }],
    usage: '水煎温服；孕妇禁用，梦遗滑精者慎用。'
  },
  远志: {
    summary: '安神益智、祛痰开窍、消散痈肿：失眠健忘、痰多咳嗽、疮疡。',
    indicators: [{ id: 'insomnia', w: 3 }, { id: 'forgetfulness', w: 3 }, { id: 'phlegm_rattle', w: 2 }, { id: 'carbuncle', w: 1 }],
    usage: '水煎温服或入丸散；实火、痰热者慎用。'
  },
  龙胆草: {
    summary: '清热燥湿、泻肝胆火：目赤、胁痛、口苦、带下、惊风。',
    indicators: [{ id: 'eye_red_pain', w: 3 }, { id: 'bitter_mouth', w: 3 }, { id: 'hypochondriac', w: 2 }, { id: 'leukorrhea', w: 1 }, { id: 'convulsion', w: 1 }],
    usage: '水煎温服；脾胃虚寒者慎用，不宜久服。'
  },
  半夏: {
    summary: '燥湿化痰、降逆止呕、消痞散结：呕吐、痰多、胸脘痞闷、梅核气。',
    indicators: [{ id: 'vomiting', w: 3 }, { id: 'nausea', w: 3 }, { id: 'phlegm_rattle', w: 2 }, { id: 'chest_fullness', w: 2 }, { id: 'throat_globus', w: 1 }],
    usage: '宜用制品，水煎温服；生半夏有毒，孕妇慎用。'
  },
  瓜蒌: {
    summary: '清热化痰、宽胸散结、润肠通便：胸痹、结胸、痰热咳嗽、乳痈、便秘。',
    indicators: [{ id: 'chest_pain', w: 3 }, { id: 'phlegm_rattle', w: 2 }, { id: 'cough', w: 2 }, { id: 'mastitis', w: 2 }, { id: 'constipation', w: 1 }],
    usage: '打碎水煎，或入丸散；脾胃虚寒、便溏者慎用。'
  },
  天花粉: {
    summary: '清热泻火、生津止渴、消肿排脓：消渴、热病烦渴、疮疡。',
    indicators: [{ id: 'polydipsia', w: 3 }, { id: 'thirst', w: 3 }, { id: 'carbuncle', w: 1 }],
    usage: '水煎温服；脾胃虚寒、孕妇慎用。'
  },
  干姜: {
    summary: '温中散寒、回阳通脉、温肺化饮：脘腹冷痛、呕吐、泄泻、寒饮咳喘。',
    indicators: [{ id: 'chill_body', w: 3 }, { id: 'vomiting', w: 2 }, { id: 'diarrhea', w: 2 }, { id: 'cough', w: 2 }, { id: 'cold_limbs', w: 1 }],
    usage: '水煎温服；阴虚内热、血热出血者慎用。'
  },
  生姜: {
    summary: '解表散寒、温中止呕、化痰止咳：风寒感冒、呕吐、痰多。',
    indicators: [{ id: 'aversion_cold', w: 2 }, { id: 'vomiting', w: 3 }, { id: 'nausea', w: 2 }, { id: 'cough', w: 1 }],
    usage: '切片水煎或捣汁服；阴虚内热者慎用。'
  },
  附子: {
    summary: '回阳救逆、补火助阳、散寒止痛：亡阳厥逆、阳虚畏寒、寒湿痹痛。',
    indicators: [{ id: 'cold_limbs', w: 3 }, { id: 'chill_body', w: 3 }, { id: 'diarrhea', w: 2 }, { id: 'joint_pain', w: 1 }, { id: 'breath_faint', w: 1 }],
    usage: '必须用炮制品，先煎 30–60 分钟至口尝无麻感；不可与半夏、瓜蒌、贝母、白蔹、白及同用。',
    safety: ['附子有毒，须炮制并先煎；出现口舌麻木、心悸立即停药就医。']
  },
  乌头: {
    summary: '祛风除湿、温经止痛：寒湿痹痛、心腹冷痛。',
    indicators: [{ id: 'joint_pain', w: 3 }, { id: 'cold_limbs', w: 2 }, { id: 'abdominal_pain', w: 2 }],
    usage: '必须炮制、先煎久煎，剂量从严；不可与半夏、瓜蒌、贝母、白蔹、白及同用。',
    safety: ['乌头类有大毒，必须炮制、先煎、久煎。']
  },
  天雄: {
    summary: '补火助阳、散寒止痛：阳虚畏寒、寒湿痹痛。',
    indicators: [{ id: 'chill_body', w: 3 }, { id: 'cold_limbs', w: 2 }, { id: 'joint_pain', w: 2 }],
    usage: '须炮制，剂量从严；孕妇禁用。',
    safety: ['天雄为附子类，有毒，须炮制并严格控制剂量。']
  },
  肉桂: {
    summary: '补火助阳、引火归元、散寒止痛、温通经脉：畏寒肢冷、腰膝冷痛、痛经、虚阳上浮。',
    indicators: [{ id: 'chill_body', w: 3 }, { id: 'cold_limbs', w: 3 }, { id: 'dysmenorrhea', w: 2 }, { id: 'back_ache', w: 2 }],
    usage: '后下或研末冲服；阴虚火旺、血热出血者禁用，孕妇慎用。'
  },
  知母: {
    summary: '清热泻火、滋阴润燥：高热烦渴、肺热咳嗽、骨蒸潮热、便秘。',
    indicators: [{ id: 'fever', w: 3 }, { id: 'thirst', w: 3 }, { id: 'cough', w: 2 }, { id: 'bone_steaming', w: 2 }, { id: 'constipation', w: 1 }],
    usage: '水煎温服；脾虚便溏者慎用。'
  },
  天冬: {
    summary: '养阴润燥、清肺生津：肺燥干咳、劳嗽痰血、消渴、肠燥便秘。',
    indicators: [{ id: 'dry_cough', w: 3 }, { id: 'cough', w: 2 }, { id: 'polydipsia', w: 2 }, { id: 'constipation', w: 1 }, { id: 'blood_sputum', w: 1 }],
    usage: '水煎温服或熬膏；脾胃虚寒、便溏者慎用。'
  },
  麦冬: {
    summary: '养阴生津、润肺清心：肺燥干咳、劳嗽、心烦失眠、消渴。',
    indicators: [{ id: 'dry_cough', w: 3 }, { id: 'dry_mouth', w: 3 }, { id: 'insomnia', w: 1 }, { id: 'polydipsia', w: 1 }],
    usage: '去心水煎，或入丸散；脾胃虚寒者慎用。'
  },
  黄连: {
    summary: '清热燥湿、泻火解毒：湿热痞满、呕吐、泻痢、目赤、疮疡。',
    indicators: [{ id: 'diarrhea', w: 3 }, { id: 'vomiting', w: 2 }, { id: 'eye_red_pain', w: 2 }, { id: 'carbuncle', w: 1 }, { id: 'restlessness', w: 1 }],
    usage: '水煎温服或入丸散；苦寒败胃，不宜久服。'
  },
  黄芩: {
    summary: '清热燥湿、泻火解毒、安胎：肺热咳嗽、湿热泻痢、黄疸、胎动。',
    indicators: [{ id: 'fever', w: 3 }, { id: 'cough', w: 2 }, { id: 'diarrhea', w: 2 }, { id: 'jaundice', w: 1 }, { id: 'dysentery', w: 1 }],
    usage: '水煎温服；脾胃虚寒者慎用。'
  },
  白茅根: {
    summary: '凉血止血、清热利尿：吐血衄血、尿血、水肿、热淋。',
    indicators: [{ id: 'hematuria', w: 3 }, { id: 'epistaxis', w: 3 }, { id: 'edema', w: 2 }, { id: 'difficult_urine', w: 2 }, { id: 'fever', w: 1 }],
    usage: '鲜用尤佳，煎汤频饮；脾胃虚寒、尿多者慎用。'
  },
  芦根: {
    summary: '清热泻火、生津止渴、除烦止呕：热病烦渴、胃热呕吐、肺热咳嗽。',
    indicators: [{ id: 'fever', w: 3 }, { id: 'thirst', w: 3 }, { id: 'vomiting', w: 1 }, { id: 'cough', w: 1 }],
    usage: '鲜用或干用，水煎温服；脾胃虚寒者慎用。'
  },
  小蓟: {
    summary: '凉血止血、散瘀解毒消痈：血热吐血、尿血、崩漏、疮疡。',
    indicators: [{ id: 'hematuria', w: 3 }, { id: 'hematemesis', w: 2 }, { id: 'metrorrhagia', w: 2 }, { id: 'carbuncle', w: 1 }],
    usage: '鲜用捣汁或水煎；脾胃虚寒者慎用。'
  },
  麦芽: {
    summary: '行气消食、健脾开胃、回乳消胀：食积、脘腹胀满、乳汁郁积。',
    indicators: [{ id: 'poor_appetite', w: 3 }, { id: 'abdominal_fullness', w: 3 }, { id: 'mastitis', w: 1 }],
    usage: '生用或炒用，水煎温服；哺乳期需通乳者慎用。'
  },
  茵陈: {
    summary: '清利湿热、利胆退黄：黄疸、小便不利、湿温。',
    indicators: [{ id: 'jaundice', w: 3 }, { id: 'difficult_urine', w: 2 }, { id: 'fever', w: 1 }],
    usage: '水煎温服；虚寒黄疸者慎用。'
  },
  莱菔子: {
    summary: '消食除胀、降气化痰：食积腹胀、咳嗽痰多。',
    indicators: [{ id: 'abdominal_fullness', w: 3 }, { id: 'phlegm_rattle', w: 3 }, { id: 'cough', w: 2 }, { id: 'poor_appetite', w: 1 }],
    usage: '生用或炒用，打碎水煎；气虚者慎用。'
  },
  枸杞子: {
    summary: '滋补肝肾、益精明目：腰膝酸软、眩晕耳鸣、视物昏花、消渴。',
    indicators: [{ id: 'back_ache', w: 3 }, { id: 'dizziness', w: 2 }, { id: 'blurred_vision', w: 2 }, { id: 'polydipsia', w: 1 }],
    usage: '煎汤、泡服或入丸散；脾虚便溏者慎用。'
  },
  地骨皮: {
    summary: '凉血除蒸、清肺降火：骨蒸潮热、肺热咳嗽、吐血衄血、消渴。',
    indicators: [{ id: 'bone_steaming', w: 3 }, { id: 'tidal_fever', w: 3 }, { id: 'cough', w: 2 }, { id: 'hemoptysis', w: 1 }, { id: 'polydipsia', w: 1 }],
    usage: '水煎温服；脾胃虚寒者慎用。'
  },
  海螵蛸: {
    summary: '收敛止血、涩精止带、制酸止痛：崩漏、带下、遗精、胃痛吞酸。',
    indicators: [{ id: 'metrorrhagia', w: 3 }, { id: 'leukorrhea', w: 3 }, { id: 'spermatorrhea', w: 2 }, { id: 'acid_reflux', w: 2 }],
    usage: '打碎先煎或研末冲服；湿热积滞者慎用。'
  },
  茜草: {
    summary: '凉血化瘀止血、通经：吐血衄血、崩漏、经闭、跌打损伤。',
    indicators: [{ id: 'metrorrhagia', w: 3 }, { id: 'amenorrhea', w: 2 }, { id: 'hematemesis', w: 1 }, { id: 'trauma', w: 1 }],
    usage: '水煎温服；孕妇慎用。'
  },
  罂粟壳: {
    summary: '敛肺涩肠、止痛：久咳、久泻、久痢、脱肛、遗精。',
    indicators: [{ id: 'cough', w: 3 }, { id: 'chronic_diarrhea', w: 3 }, { id: 'dysentery', w: 2 }, { id: 'spermatorrhea', w: 1 }],
    usage: '蜜炙水煎或入丸散，剂量从严；孕妇、儿童禁用，不可久服。',
    safety: ['罂粟壳含阿片类成分，有成瘾性；孕妇、儿童禁用。']
  },
  竹茹: {
    summary: '清热化痰、除烦止呕：痰热咳嗽、胃热呕吐、吐血衄血。',
    indicators: [{ id: 'vomiting', w: 3 }, { id: 'phlegm_rattle', w: 2 }, { id: 'hematemesis', w: 2 }, { id: 'restlessness', w: 1 }],
    usage: '水煎温服；脾胃虚寒者慎用。'
  },
  沙参: {
    summary: '养阴清肺、益胃生津：肺燥干咳、劳嗽痰血、胃阴不足。',
    indicators: [{ id: 'dry_cough', w: 3 }, { id: 'dry_mouth', w: 2 }, { id: 'poor_appetite', w: 1 }, { id: 'blood_sputum', w: 1 }],
    usage: '水煎温服；虚寒证慎用。'
  },
  连翘: {
    summary: '清热解毒、消肿散结、疏散风热：疮疡、瘰疬、风热感冒、温病。',
    indicators: [{ id: 'carbuncle', w: 3 }, { id: 'scrofula', w: 2 }, { id: 'fever', w: 2 }, { id: 'sore_throat', w: 1 }],
    usage: '水煎温服；脾胃虚寒者慎用。'
  },
  川楝子: {
    summary: '疏肝泄热、行气止痛、杀虫：胁痛、脘腹胀痛、疝气、虫积。',
    indicators: [{ id: 'hypochondriac', w: 3 }, { id: 'abdominal_pain', w: 2 }, { id: 'qi_depression', w: 2 }],
    usage: '打碎水煎；有小毒，剂量从严，孕妇慎用。'
  },
  薄荷: {
    summary: '疏散风热、清利头目、利咽透疹、疏肝行气：风热感冒、头痛目赤、咽喉肿痛、麻疹。',
    indicators: [{ id: 'fever', w: 2 }, { id: 'headache', w: 2 }, { id: 'sore_throat', w: 2 }, { id: 'measles', w: 1 }, { id: 'itching', w: 1 }],
    usage: '后下，水煎温服；体虚多汗者慎用。'
  },
  茯苓: {
    summary: '利水渗湿、健脾宁心：水肿、小便不利、痰饮、泄泻、心悸失眠。',
    indicators: [{ id: 'edema', w: 3 }, { id: 'difficult_urine', w: 2 }, { id: 'diarrhea', w: 2 }, { id: 'palpitation', w: 1 }, { id: 'insomnia', w: 1 }],
    usage: '水煎温服或入丸散；虚寒精滑者慎用。'
  },
  茯神: {
    summary: '宁心安神：心悸失眠、健忘。',
    indicators: [{ id: 'insomnia', w: 3 }, { id: 'palpitation', w: 3 }, { id: 'forgetfulness', w: 2 }],
    usage: '水煎温服；虚寒精滑者慎用。'
  },
  木通: {
    summary: '利尿通淋、清心除烦、通经下乳：小便不利、淋证、口疮、乳汁不通。',
    indicators: [{ id: 'difficult_urine', w: 3 }, { id: 'strangury', w: 2 }, { id: 'oral_ulcer', w: 1 }, { id: 'low_milk', w: 1 }],
    usage: '水煎温服；肾功能不全者慎用，关木通含马兜铃酸，禁用。'
  },
  蒲黄: {
    summary: '止血化瘀、通淋：吐血衄血、崩漏、尿血、心腹疼痛。',
    indicators: [{ id: 'metrorrhagia', w: 3 }, { id: 'hematuria', w: 2 }, { id: 'hematemesis', w: 2 }, { id: 'abdominal_pain', w: 1 }],
    usage: '生用或炒炭，包煎；孕妇慎用。'
  },
  三棱: {
    summary: '破血行气、消积止痛：癥瘕、经闭、食积胀痛。',
    indicators: [{ id: 'mass_abdomen', w: 3 }, { id: 'amenorrhea', w: 3 }, { id: 'abdominal_fullness', w: 2 }],
    usage: '醋制水煎；孕妇禁用，月经过多者慎用。'
  },
  莪术: {
    summary: '破血行气、消积止痛：癥瘕、经闭、食积胀痛。',
    indicators: [{ id: 'mass_abdomen', w: 3 }, { id: 'amenorrhea', w: 3 }, { id: 'abdominal_pain', w: 2 }],
    usage: '醋制水煎；孕妇禁用，月经过多者慎用。'
  },
  乳香: {
    summary: '活血定痛、消肿生肌：跌打损伤、疮疡、心腹疼痛、痛经。',
    indicators: [{ id: 'joint_pain', w: 3 }, { id: 'carbuncle', w: 2 }, { id: 'abdominal_pain', w: 2 }, { id: 'dysmenorrhea', w: 1 }],
    usage: '炒去油，入丸散或水煎；孕妇、胃弱者慎用。'
  },
  没药: {
    summary: '散瘀定痛、消肿生肌：跌打损伤、疮疡、心腹疼痛、痛经。',
    indicators: [{ id: 'joint_pain', w: 3 }, { id: 'carbuncle', w: 2 }, { id: 'abdominal_pain', w: 2 }, { id: 'dysmenorrhea', w: 1 }],
    usage: '炒去油，入丸散或水煎；孕妇、胃弱者慎用。'
  },
  常山: {
    summary: '涌吐痰涎、截疟：疟疾、痰饮。',
    indicators: [{ id: 'malaria', w: 3 }, { id: 'phlegm_rattle', w: 1 }],
    usage: '酒炒水煎，剂量从严；体虚者慎用。'
  },
  山楂: {
    summary: '消食健胃、行气散瘀、化浊降脂：食积、脘腹胀痛、泻痢、瘀血经闭。',
    indicators: [{ id: 'poor_appetite', w: 3 }, { id: 'abdominal_fullness', w: 2 }, { id: 'dysentery', w: 1 }, { id: 'amenorrhea', w: 1 }],
    usage: '生用或炒用，水煎温服；胃酸过多、孕妇慎用。'
  },
  石榴: {
    summary: '涩肠止泻、止血、驱虫：久泻久痢、便血、崩漏、虫积。',
    indicators: [{ id: 'chronic_diarrhea', w: 3 }, { id: 'hematochezia', w: 2 }, { id: 'metrorrhagia', w: 1 }],
    usage: '酸石榴连皮捣烂煎服；有实邪者慎用。'
  },
  龙眼肉: {
    summary: '补益心脾、养血安神：心悸怔忡、失眠健忘、血虚萎黄。',
    indicators: [{ id: 'palpitation', w: 3 }, { id: 'insomnia', w: 3 }, { id: 'forgetfulness', w: 2 }, { id: 'fatigue', w: 1 }],
    usage: '煎汤或蒸服；湿盛中满、痰火者慎用。'
  },
  柏子仁: {
    summary: '养心安神、润肠通便：心悸失眠、肠燥便秘。',
    indicators: [{ id: 'palpitation', w: 3 }, { id: 'insomnia', w: 3 }, { id: 'constipation', w: 2 }],
    usage: '打碎水煎或入丸散；便溏者慎用。'
  },
  大枣: {
    summary: '补中益气、养血安神：脾虚食少、乏力、失眠、调和诸药。',
    indicators: [{ id: 'poor_appetite', w: 3 }, { id: 'fatigue', w: 2 }, { id: 'insomnia', w: 1 }],
    usage: '擘开水煎；糖尿病、湿盛腹胀者慎用。'
  },
  核桃仁: {
    summary: '补肾、温肺、润肠：腰膝酸软、虚寒喘咳、肠燥便秘。',
    indicators: [{ id: 'back_ache', w: 3 }, { id: 'wheezing', w: 2 }, { id: 'constipation', w: 2 }, { id: 'spermatorrhea', w: 1 }],
    usage: '生食、嚼服或入丸散；便溏者慎用。'
  },
  五味子: {
    summary: '收敛固涩、益气生津、补肾宁心：久咳虚喘、自汗盗汗、遗精、久泻、心悸失眠。',
    indicators: [{ id: 'cough', w: 3 }, { id: 'spontaneous_sweat', w: 2 }, { id: 'spermatorrhea', w: 2 }, { id: 'chronic_diarrhea', w: 1 }, { id: 'insomnia', w: 1 }],
    usage: '打碎水煎或入丸散；表邪未解、实热者慎用。'
  },
  萆薢: {
    summary: '利湿浊、祛风湿：膏淋、白浊、带下、风湿痹痛。',
    indicators: [{ id: 'milky_urine', w: 3 }, { id: 'strangury', w: 2 }, { id: 'leukorrhea', w: 2 }, { id: 'joint_pain', w: 1 }],
    usage: '水煎温服；肾阴亏虚者慎用。'
  },
  鸡内金: {
    summary: '健胃消食、涩精止遗、通淋化石：食积、遗精、砂淋、癥瘕。',
    indicators: [{ id: 'poor_appetite', w: 3 }, { id: 'abdominal_fullness', w: 2 }, { id: 'stone_urine', w: 2 }, { id: 'spermatorrhea', w: 1 }, { id: 'mass_abdomen', w: 1 }],
    usage: '生用研末冲服或入丸散；无积滞者不宜久服。'
  },
  穿山甲: {
    summary: '活血消癥、通经下乳、消肿排脓：癥瘕、经闭、乳汁不通、疮疡。',
    indicators: [{ id: 'mass_abdomen', w: 3 }, { id: 'low_milk', w: 2 }, { id: 'carbuncle', w: 2 }, { id: 'amenorrhea', w: 1 }],
    usage: '炮制后研末或水煎；孕妇禁用。',
    safety: ['穿山甲为保护动物药材，现代多不用，可以皂角刺、王不留行等替代。']
  },
  蜈蚣: {
    summary: '息风镇痉、通络止痛、攻毒散结：抽搐、中风口眼歪斜、疮疡、头痛。',
    indicators: [{ id: 'convulsion', w: 3 }, { id: 'facial_paralysis', w: 2 }, { id: 'carbuncle', w: 2 }, { id: 'headache', w: 1 }],
    usage: '去头足，研末或水煎，剂量从严；孕妇禁用。',
    safety: ['蜈蚣有毒，剂量从严；孕妇禁用。']
  },
  水蛭: {
    summary: '破血通经、逐瘀消癥：经闭、癥瘕、跌打损伤。',
    indicators: [{ id: 'amenorrhea', w: 3 }, { id: 'mass_abdomen', w: 3 }, { id: 'trauma', w: 1 }],
    usage: '生用研末冲服或入丸散，剂量从严；孕妇、出血倾向者禁用。',
    safety: ['水蛭破血逐瘀，孕妇、出血倾向、抗凝治疗者禁用。']
  },
  全蝎: {
    summary: '息风镇痉、通络止痛、攻毒散结：抽搐、中风口眼歪斜、疮疡、头痛。',
    indicators: [{ id: 'convulsion', w: 3 }, { id: 'facial_paralysis', w: 3 }, { id: 'carbuncle', w: 1 }, { id: 'headache', w: 1 }],
    usage: '研末冲服或水煎，剂量从严；孕妇禁用。',
    safety: ['全蝎有毒，剂量从严；孕妇禁用。']
  },
  蝉蜕: {
    summary: '疏散风热、利咽透疹、明目退翳、解痉：风热感冒、咽喉肿痛、麻疹、目翳、惊风。',
    indicators: [{ id: 'fever', w: 2 }, { id: 'sore_throat', w: 2 }, { id: 'eye_cloudiness', w: 2 }, { id: 'measles', w: 1 }, { id: 'convulsion', w: 1 }],
    usage: '去足土，水煎温服；孕妇慎用。'
  },
  羚羊角: {
    summary: '平肝息风、清肝明目、散血解毒：高热惊痫、抽搐、目赤、温病发斑。',
    indicators: [{ id: 'fever', w: 3 }, { id: 'convulsion', w: 2 }, { id: 'eye_red_pain', w: 1 }, { id: 'purpura', w: 1 }],
    usage: '另煎兑服或研末冲服；孕妇慎用。',
    safety: ['羚羊角为保护动物药材，现代多以山羊角代用。']
  },
  血余炭: {
    summary: '收敛止血、化瘀、利尿：吐血、衄血、尿血、崩漏、小便不利。',
    indicators: [{ id: 'hematemesis', w: 3 }, { id: 'hematuria', w: 2 }, { id: 'metrorrhagia', w: 2 }],
    usage: '研末冲服或入丸散；孕妇慎用。'
  },
  人指甲: {
    summary: '止血、利尿、明目、催生：鼻衄、尿血、目翳、难产。',
    indicators: [{ id: 'epistaxis', w: 3 }, { id: 'eye_cloudiness', w: 2 }, { id: 'hematuria', w: 1 }, { id: 'dystocia', w: 1 }],
    usage: '炮焦研末，吹鼻或冲服；现代多不用。',
    safety: ['人指甲须炮焦研末，注意卫生与来源。']
  }
}
