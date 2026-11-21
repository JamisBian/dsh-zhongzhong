// 《医学衷中参西录》方剂的人工校准
//
// 自动推导的方证指标只按主治文字里出现的症状词加权，遇到「治同前证」
// 「或兼…」这类写法会偏粗。这里对张锡纯最常用的方逐首校准：
//   · 原书明确点名的特征症 → w=3（每方至少 1–3 条）
//   · 病机相关、常见兼症 → w=2
//   · 或然症、体质倾向 → w=1
//   · 明确相反/禁用的情况 → contra
//
// 键是方名（与 data/zhongzhong-index.json 的 name 一致）。

export const ZHONGZHONG_CALIBRATION = {
  资生汤: {
    indicators: [
      { id: 'tuberculosis', w: 3 },
      { id: 'weight_loss', w: 3 },
      { id: 'poor_appetite', w: 3 },
      { id: 'cough', w: 2 },
      { id: 'wheezing', w: 2 },
      { id: 'fever', w: 2 },
      { id: 'amenorrhea', w: 2 },
      { id: 'pulse_deficient_rapid', w: 2 }
    ]
  },
  十全育真汤: {
    indicators: [
      { id: 'tuberculosis', w: 3 },
      { id: 'weight_loss', w: 3 },
      { id: 'spontaneous_sweat', w: 3 },
      { id: 'cough', w: 2 },
      { id: 'wheezing', w: 2 },
      { id: 'alternating', w: 2 },
      { id: 'dreamy_sleep', w: 1 },
      { id: 'spermatorrhea', w: 2 },
      { id: 'pulse_deficient_rapid', w: 2 }
    ]
  },
  醴泉饮: {
    indicators: [
      { id: 'tuberculosis', w: 3 },
      { id: 'fever', w: 2 },
      { id: 'cough', w: 3 },
      { id: 'wheezing', w: 2 },
      { id: 'pulse_rapid', w: 2 },
      { id: 'pulse_weak', w: 1 }
    ]
  },
  参麦汤: {
    indicators: [
      { id: 'tuberculosis', w: 3 },
      { id: 'cough', w: 3 },
      { id: 'wheezing', w: 2 },
      { id: 'phlegm_rattle', w: 2 },
      { id: 'dry_mouth', w: 1 }
    ]
  },
  一味薯蓣饮: {
    indicators: [
      { id: 'tuberculosis', w: 2 },
      { id: 'cough', w: 2 },
      { id: 'wheezing', w: 2 },
      { id: 'spontaneous_sweat', w: 2 },
      { id: 'palpitation', w: 2 },
      { id: 'diarrhea', w: 2 },
      { id: 'difficult_urine', w: 1 },
      { id: 'weight_loss', w: 2 }
    ]
  },
  珠玉二宝粥: {
    indicators: [
      { id: 'poor_appetite', w: 3 },
      { id: 'cough', w: 2 },
      { id: 'tuberculosis', w: 2 },
      { id: 'fever', w: 1 }
    ]
  },
  沃雪汤: {
    indicators: [
      { id: 'wheezing', w: 3 },
      { id: 'cough', w: 2 },
      { id: 'qi_sinking', w: 1 }
    ]
  },
  水晶桃: {
    indicators: [
      { id: 'cough', w: 2 },
      { id: 'wheezing', w: 2 },
      { id: 'back_ache', w: 2 },
      { id: 'fatigue', w: 2 }
    ]
  },
  既济汤: {
    indicators: [
      { id: 'breath_faint', w: 3 },
      { id: 'spontaneous_sweat', w: 3 },
      { id: 'spermatorrhea', w: 2 },
      { id: 'diarrhea', w: 2 },
      { id: 'enuresis', w: 2 },
      { id: 'wheezing', w: 1 }
    ]
  },
  来复汤: {
    indicators: [
      { id: 'spontaneous_sweat', w: 3 },
      { id: 'breath_faint', w: 3 },
      { id: 'alternating', w: 1 },
      { id: 'palpitation', w: 1 },
      { id: 'wheezing', w: 1 }
    ]
  },
  镇摄汤: {
    indicators: [
      { id: 'chest_fullness', w: 3 },
      { id: 'qi_rush_up', w: 3 },
      { id: 'pulse_wiry_long', w: 2 },
      { id: 'short_breath', w: 2 }
    ]
  },
  敦复汤: {
    indicators: [
      { id: 'cold_limbs', w: 3 },
      { id: 'chill_body', w: 3 },
      { id: 'diarrhea', w: 2 },
      { id: 'back_ache', w: 2 },
      { id: 'fatigue', w: 2 },
      { id: 'poor_appetite', w: 1 }
    ]
  },
  升陷汤: {
    indicators: [
      { id: 'qi_sinking', w: 3 },
      { id: 'breathing_effort', w: 3 },
      { id: 'short_breath', w: 3 },
      { id: 'fatigue', w: 3 },
      { id: 'pulse_weak', w: 2 },
      { id: 'palpitation', w: 1 }
    ]
  },
  回阳升陷汤: {
    indicators: [
      { id: 'qi_sinking', w: 3 },
      { id: 'chill_body', w: 3 },
      { id: 'cold_limbs', w: 2 },
      { id: 'breathing_effort', w: 2 },
      { id: 'palpitation', w: 1 }
    ]
  },
  理郁升陷汤: {
    indicators: [
      { id: 'qi_sinking', w: 3 },
      { id: 'qi_depression', w: 3 },
      { id: 'hypochondriac', w: 2 },
      { id: 'chest_fullness', w: 2 },
      { id: 'short_breath', w: 2 }
    ]
  },
  醒脾升陷汤: {
    indicators: [
      { id: 'qi_sinking', w: 3 },
      { id: 'enuresis', w: 3 },
      { id: 'poor_appetite', w: 2 },
      { id: 'fatigue', w: 2 },
      { id: 'diarrhea', w: 1 }
    ]
  },
  参赭镇气汤: {
    indicators: [
      { id: 'wheezing', w: 3 },
      { id: 'qi_rush_up', w: 3 },
      { id: 'orthopnea', w: 2 },
      { id: 'short_breath', w: 2 },
      { id: 'chest_fullness', w: 2 },
      { id: 'breath_faint', w: 1 }
    ]
  },
  薯蓣纳气汤: {
    indicators: [
      { id: 'wheezing', w: 3 },
      { id: 'qi_rush_up', w: 2 },
      { id: 'cough', w: 2 },
      { id: 'breath_faint', w: 2 },
      { id: 'hot_palms', w: 1 }
    ]
  },
  滋培汤: {
    indicators: [
      { id: 'wheezing', w: 3 },
      { id: 'cough', w: 2 },
      { id: 'poor_appetite', w: 2 },
      { id: 'weight_loss', w: 2 },
      { id: 'fatigue', w: 1 }
    ]
  },
  理饮汤: {
    indicators: [
      { id: 'phlegm_rattle', w: 3 },
      { id: 'chest_fullness', w: 3 },
      { id: 'short_breath', w: 2 },
      { id: 'dizziness', w: 2 },
      { id: 'palpitation', w: 1 },
      { id: 'pulse_deep_slow_weak', w: 2 }
    ]
  },
  理痰汤: {
    indicators: [
      { id: 'phlegm_rattle', w: 3 },
      { id: 'chest_fullness', w: 3 },
      { id: 'dizziness', w: 2 },
      { id: 'palpitation', w: 2 },
      { id: 'insomnia', w: 1 },
      { id: 'numbness', w: 1 }
    ]
  },
  龙蚝理痰汤: {
    indicators: [
      { id: 'phlegm_rattle', w: 3 },
      { id: 'mania', w: 2 },
      { id: 'palpitation', w: 2 },
      { id: 'insomnia', w: 2 },
      { id: 'restlessness', w: 2 }
    ]
  },
  健脾化痰丸: {
    indicators: [
      { id: 'phlegm_rattle', w: 2 },
      { id: 'poor_appetite', w: 2 },
      { id: 'abdominal_fullness', w: 2 },
      { id: 'fatigue', w: 1 }
    ]
  },
  期颐饼: {
    indicators: [
      { id: 'phlegm_rattle', w: 2 },
      { id: 'chest_fullness', w: 2 },
      { id: 'hypochondriac', w: 1 },
      { id: 'poor_appetite', w: 1 }
    ]
  },
  黄芪膏: {
    indicators: [
      { id: 'cough', w: 3 },
      { id: 'wheezing', w: 3 },
      { id: 'spontaneous_sweat', w: 1 },
      { id: 'tuberculosis', w: 1 }
    ]
  },
  清金益气汤: {
    indicators: [
      { id: 'tuberculosis', w: 3 },
      { id: 'cough', w: 3 },
      { id: 'hoarseness', w: 2 },
      { id: 'phlegm_rattle', w: 2 },
      { id: 'weight_loss', w: 2 }
    ]
  },
  清金解毒汤: {
    indicators: [
      { id: 'foul_sputum', w: 3 },
      { id: 'cough', w: 3 },
      { id: 'tuberculosis', w: 2 },
      { id: 'blood_sputum', w: 2 }
    ]
  },
  安肺宁嗽丸: {
    indicators: [
      { id: 'cough', w: 3 },
      { id: 'tuberculosis', w: 2 },
      { id: 'yellow_sputum', w: 1 }
    ]
  },
  清凉华盖饮: {
    indicators: [
      { id: 'foul_sputum', w: 3 },
      { id: 'chest_pain', w: 2 },
      { id: 'cough', w: 2 },
      { id: 'hypochondriac', w: 1 }
    ]
  },
  寒降汤: {
    indicators: [
      { id: 'hematemesis', w: 3 },
      { id: 'epistaxis', w: 3 },
      { id: 'vomiting', w: 2 },
      { id: 'pulse_surging', w: 2 },
      { id: 'pulse_slippery_forceful', w: 1 }
    ]
  },
  温降汤: {
    indicators: [
      { id: 'hematemesis', w: 3 },
      { id: 'epistaxis', w: 3 },
      { id: 'poor_appetite', w: 2 },
      { id: 'pulse_deep_slow_weak', w: 2 }
    ]
  },
  清降汤: {
    indicators: [
      { id: 'hematemesis', w: 3 },
      { id: 'epistaxis', w: 3 },
      { id: 'palpitation', w: 2 },
      { id: 'insomnia', w: 1 },
      { id: 'wheezing', w: 1 },
      { id: 'spontaneous_sweat', w: 1 }
    ]
  },
  保元寒降汤: {
    indicators: [
      { id: 'hematemesis', w: 3 },
      { id: 'wheezing', w: 2 },
      { id: 'breath_faint', w: 2 },
      { id: 'fatigue', w: 2 },
      { id: 'hemoptysis', w: 1 }
    ]
  },
  保元清降汤: {
    indicators: [
      { id: 'hematemesis', w: 3 },
      { id: 'qi_rush_up', w: 3 },
      { id: 'fatigue', w: 2 },
      { id: 'pulse_wiry_long', w: 1 }
    ]
  },
  秘红丹: {
    indicators: [
      { id: 'hematemesis', w: 3 },
      { id: 'epistaxis', w: 3 },
      { id: 'irritability', w: 2 }
    ]
  },
  二鲜饮: {
    indicators: [
      { id: 'blood_sputum', w: 3 },
      { id: 'hemoptysis', w: 2 },
      { id: 'tuberculosis', w: 1 }
    ]
  },
  三鲜饮: {
    indicators: [
      { id: 'blood_sputum', w: 3 },
      { id: 'hemoptysis', w: 2 },
      { id: 'fever', w: 1 }
    ]
  },
  化血丹: {
    indicators: [
      { id: 'hemoptysis', w: 3 },
      { id: 'hematemesis', w: 3 },
      { id: 'hematochezia', w: 2 },
      { id: 'hematuria', w: 2 }
    ]
  },
  补络补管汤: {
    indicators: [
      { id: 'hemoptysis', w: 3 },
      { id: 'hematemesis', w: 3 },
      { id: 'blood_sputum', w: 2 }
    ]
  },
  化瘀理膈丹: {
    indicators: [
      { id: 'blood_sputum', w: 3 },
      { id: 'short_breath', w: 2 },
      { id: 'hematemesis', w: 1 }
    ]
  },
  定心汤: {
    indicators: [
      { id: 'palpitation', w: 3 },
      { id: 'insomnia', w: 2 },
      { id: 'anxiety', w: 2 },
      { id: 'forgetfulness', w: 1 }
    ]
  },
  安魂汤: {
    indicators: [
      { id: 'insomnia', w: 3 },
      { id: 'palpitation', w: 3 },
      { id: 'anxiety', w: 2 },
      { id: 'phlegm_rattle', w: 1 }
    ]
  },
  荡痰汤: {
    indicators: [
      { id: 'mania', w: 3 },
      { id: 'phlegm_rattle', w: 3 },
      { id: 'constipation', w: 2 },
      { id: 'pulse_slippery_forceful', w: 2 },
      { id: 'restlessness', w: 1 }
    ]
  },
  荡痰加甘遂汤: {
    indicators: [
      { id: 'mania', w: 3 },
      { id: 'phlegm_rattle', w: 3 },
      { id: 'chest_fullness', w: 2 }
    ]
  },
  调气养神汤: {
    indicators: [
      { id: 'mania', w: 3 },
      { id: 'insomnia', w: 2 },
      { id: 'palpitation', w: 2 },
      { id: 'forgetfulness', w: 1 },
      { id: 'restlessness', w: 2 }
    ]
  },
  加味磁朱丸: {
    indicators: [
      { id: 'epilepsy', w: 3 },
      { id: 'convulsion', w: 2 },
      { id: 'dizziness', w: 2 },
      { id: 'tinnitus', w: 1 }
    ]
  },
  通变黑锡丹: {
    indicators: [
      { id: 'epilepsy', w: 3 },
      { id: 'convulsion', w: 2 }
    ]
  },
  一味铁养汤: {
    indicators: [
      { id: 'epilepsy', w: 3 },
      { id: 'dizziness', w: 2 },
      { id: 'headache', w: 2 },
      { id: 'hematemesis', w: 1 }
    ]
  },
  定风丹: {
    indicators: [
      { id: 'convulsion', w: 3 },
      { id: 'spasm', w: 3 }
    ]
  },
  镇风汤: {
    indicators: [
      { id: 'convulsion', w: 3 },
      { id: 'fever', w: 2 },
      { id: 'throat_swelling', w: 1 },
      { id: 'phlegm_rattle', w: 2 }
    ]
  },
  搜风汤: {
    indicators: [
      { id: 'stroke', w: 3 },
      { id: 'hemiplegia', w: 2 },
      { id: 'aphasia', w: 2 },
      { id: 'phlegm_rattle', w: 2 }
    ]
  },
  逐风汤: {
    indicators: [
      { id: 'convulsion', w: 3 },
      { id: 'trauma', w: 2 },
      { id: 'joint_pain', w: 1 },
      { id: 'spasm', w: 2 }
    ]
  },
  加味黄芪五物汤: {
    indicators: [
      { id: 'joint_pain', w: 3 },
      { id: 'numbness', w: 3 },
      { id: 'leg_pain', w: 2 },
      { id: 'arm_pain', w: 2 }
    ]
  },
  加味玉屏风散: {
    indicators: [
      { id: 'trauma', w: 3 },
      { id: 'stroke', w: 2 },
      { id: 'convulsion', w: 1 },
      { id: 'spontaneous_sweat', w: 1 }
    ]
  },
  镇肝熄风汤: {
    indicators: [
      { id: 'brain_hyperemia', w: 3 },
      { id: 'dizziness', w: 3 },
      { id: 'headache', w: 3 },
      { id: 'tinnitus', w: 2 },
      { id: 'hemiplegia', w: 2 },
      { id: 'facial_paralysis', w: 2 },
      { id: 'stroke', w: 2 },
      { id: 'pulse_wiry_long', w: 3 },
      { id: 'hot_palms', w: 1 },
      { id: 'chest_fullness', w: 1 }
    ]
  },
  加味补血汤: {
    indicators: [
      { id: 'atrophy', w: 3 },
      { id: 'hemiplegia', w: 2 },
      { id: 'dizziness', w: 2 },
      { id: 'head_heavy', w: 2 },
      { id: 'forgetfulness', w: 2 },
      { id: 'fatigue', w: 2 }
    ]
  },
  振颓汤: {
    indicators: [
      { id: 'atrophy', w: 3 },
      { id: 'fatigue', w: 3 },
      { id: 'leg_pain', w: 2 },
      { id: 'numbness', w: 1 }
    ]
  },
  振颓丸: {
    indicators: [
      { id: 'atrophy', w: 3 },
      { id: 'hemiplegia', w: 2 },
      { id: 'numbness', w: 2 },
      { id: 'joint_pain', w: 1 }
    ]
  },
  姜胶膏: {
    indicators: [
      { id: 'joint_pain', w: 3 },
      { id: 'numbness', w: 3 },
      { id: 'chill_body', w: 2 },
      { id: 'cold_limbs', w: 1 }
    ],
    route: 'external'
  },
  参赭培气汤: {
    indicators: [
      { id: 'dysphagia', w: 3 },
      { id: 'vomiting', w: 2 },
      { id: 'poor_appetite', w: 2 },
      { id: 'weight_loss', w: 1 },
      { id: 'qi_counterflow', w: 2 }
    ]
  },
  镇逆汤: {
    indicators: [
      { id: 'vomiting', w: 3 },
      { id: 'nausea', w: 2 },
      { id: 'qi_counterflow', w: 2 },
      { id: 'bitter_mouth', w: 1 }
    ]
  },
  薯蓣半夏粥: {
    indicators: [
      { id: 'vomiting', w: 3 },
      { id: 'qi_counterflow', w: 2 },
      { id: 'nausea', w: 2 }
    ]
  },
  急救回生丹: {
    indicators: [
      { id: 'cholera', w: 3 },
      { id: 'vomiting', w: 2 },
      { id: 'diarrhea', w: 2 },
      { id: 'dizziness', w: 1 }
    ]
  },
  卫生防疫宝丹: {
    indicators: [
      { id: 'cholera', w: 3 },
      { id: 'diarrhea', w: 2 },
      { id: 'vomiting', w: 2 }
    ]
  },
  急救回阳汤: {
    indicators: [
      { id: 'cholera', w: 3 },
      { id: 'cold_limbs', w: 3 },
      { id: 'breath_faint', w: 2 },
      { id: 'pulse_weak', w: 2 }
    ]
  },
  益脾饼: {
    indicators: [
      { id: 'diarrhea', w: 3 },
      { id: 'chronic_diarrhea', w: 3 },
      { id: 'poor_appetite', w: 3 }
    ]
  },
  扶中汤: {
    indicators: [
      { id: 'chronic_diarrhea', w: 3 },
      { id: 'fatigue', w: 3 },
      { id: 'weight_loss', w: 2 },
      { id: 'edema', w: 1 }
    ]
  },
  薯蓣粥: {
    indicators: [
      { id: 'diarrhea', w: 3 },
      { id: 'chronic_diarrhea', w: 3 },
      { id: 'poor_appetite', w: 2 },
      { id: 'cough', w: 1 },
      { id: 'difficult_urine', w: 1 }
    ]
  },
  薯蓣鸡子黄粥: {
    indicators: [
      { id: 'chronic_diarrhea', w: 3 },
      { id: 'diarrhea', w: 3 },
      { id: 'fecal_incontinence', w: 2 }
    ]
  },
  薯蓣芣苢汤: {
    indicators: [
      { id: 'difficult_urine', w: 3 },
      { id: 'diarrhea', w: 3 },
      { id: 'cough', w: 1 },
      { id: 'phlegm_rattle', w: 1 }
    ]
  },
  加味天水散: {
    indicators: [
      { id: 'diarrhea', w: 3 },
      { id: 'fever', w: 2 },
      { id: 'thirst', w: 2 },
      { id: 'difficult_urine', w: 2 }
    ]
  },
  加味四神丸: {
    indicators: [
      { id: 'chronic_diarrhea', w: 3 },
      { id: 'diarrhea', w: 3 },
      { id: 'chill_body', w: 2 },
      { id: 'abdominal_pain', w: 1 }
    ]
  },
  化滞汤: {
    indicators: [
      { id: 'dysentery', w: 3 },
      { id: 'tenesmus', w: 3 },
      { id: 'abdominal_pain', w: 2 },
      { id: 'bloody_stool', w: 1 }
    ]
  },
  燮理汤: {
    indicators: [
      { id: 'dysentery', w: 3 },
      { id: 'tenesmus', w: 2 },
      { id: 'bloody_stool', w: 1 },
      { id: 'fever', w: 1 }
    ]
  },
  解毒生化丹: {
    indicators: [
      { id: 'dysentery', w: 3 },
      { id: 'bloody_stool', w: 3 },
      { id: 'tenesmus', w: 2 },
      { id: 'abdominal_pain', w: 2 }
    ]
  },
  天水涤肠汤: {
    indicators: [
      { id: 'dysentery', w: 3 },
      { id: 'chronic_diarrhea', w: 2 },
      { id: 'fatigue', w: 2 },
      { id: 'bloody_stool', w: 1 }
    ]
  },
  通变白头翁汤: {
    indicators: [
      { id: 'dysentery', w: 3 },
      { id: 'tenesmus', w: 3 },
      { id: 'bloody_stool', w: 2 },
      { id: 'abdominal_pain', w: 1 }
    ]
  },
  三宝粥: {
    indicators: [
      { id: 'dysentery', w: 3 },
      { id: 'bloody_stool', w: 3 },
      { id: 'chronic_diarrhea', w: 2 }
    ]
  },
  通变白虎加人参汤: {
    indicators: [
      { id: 'dysentery', w: 3 },
      { id: 'fever', w: 3 },
      { id: 'thirst_cold', w: 2 },
      { id: 'pulse_surging', w: 2 }
    ]
  },
  硝菔通结汤: {
    indicators: [
      { id: 'constipation', w: 3 },
      { id: 'hard_stool', w: 3 },
      { id: 'abdominal_fullness', w: 2 },
      { id: 'fatigue', w: 1 }
    ]
  },
  赭遂攻结汤: {
    indicators: [
      { id: 'constipation', w: 3 },
      { id: 'hard_stool', w: 3 },
      { id: 'vomiting', w: 2 },
      { id: 'abdominal_fullness', w: 2 }
    ]
  },
  通结用葱白熨法: {
    indicators: [
      { id: 'constipation', w: 3 },
      { id: 'abdominal_fullness', w: 3 },
      { id: 'hard_stool', w: 2 }
    ],
    route: 'external'
  },
  玉液汤: {
    indicators: [
      { id: 'polydipsia', w: 3 },
      { id: 'polyuria', w: 3 },
      { id: 'sweet_urine', w: 2 },
      { id: 'thirst', w: 2 },
      { id: 'fatigue', w: 1 }
    ]
  },
  滋膵饮: {
    indicators: [
      { id: 'polydipsia', w: 3 },
      { id: 'polyuria', w: 3 },
      { id: 'sweet_urine', w: 2 },
      { id: 'weight_loss', w: 1 }
    ]
  },
  宣阳汤: {
    indicators: [
      { id: 'urinary_retention', w: 3 },
      { id: 'difficult_urine', w: 3 },
      { id: 'fatigue', w: 2 }
    ]
  },
  济阴汤: {
    indicators: [
      { id: 'urinary_retention', w: 3 },
      { id: 'difficult_urine', w: 3 },
      { id: 'dry_mouth', w: 1 }
    ]
  },
  白茅根汤: {
    indicators: [
      { id: 'urinary_retention', w: 3 },
      { id: 'edema', w: 3 },
      { id: 'difficult_urine', w: 2 }
    ]
  },
  温通汤: {
    indicators: [
      { id: 'urinary_retention', w: 3 },
      { id: 'cold_limbs', w: 2 },
      { id: 'chill_body', w: 2 }
    ]
  },
  加味苓桂术甘汤: {
    indicators: [
      { id: 'edema', w: 3 },
      { id: 'difficult_urine', w: 3 },
      { id: 'cold_limbs', w: 2 },
      { id: 'pulse_deep_slow_weak', w: 2 }
    ]
  },
  寒通汤: {
    indicators: [
      { id: 'urinary_retention', w: 3 },
      { id: 'strangury', w: 3 },
      { id: 'dark_urine', w: 2 }
    ]
  },
  升麻黄汤: {
    indicators: [
      { id: 'urinary_retention', w: 3 },
      { id: 'difficult_urine', w: 2 },
      { id: 'qi_sinking', w: 2 }
    ]
  },
  鸡胵汤: {
    indicators: [
      { id: 'ascites', w: 3 },
      { id: 'poor_appetite', w: 2 },
      { id: 'qi_depression', w: 2 }
    ]
  },
  鸡茅根汤: {
    indicators: [
      { id: 'ascites', w: 3 },
      { id: 'edema', w: 3 },
      { id: 'difficult_urine', w: 2 }
    ]
  },
  理血汤: {
    indicators: [
      { id: 'hematuria', w: 3 },
      { id: 'hematochezia', w: 3 },
      { id: 'strangury', w: 2 }
    ]
  },
  膏淋汤: {
    indicators: [
      { id: 'milky_urine', w: 3 },
      { id: 'strangury', w: 2 },
      { id: 'fatigue', w: 1 }
    ]
  },
  气淋汤: {
    indicators: [
      { id: 'qi_strangury', w: 3 },
      { id: 'strangury', w: 2 },
      { id: 'fatigue', w: 1 }
    ]
  },
  劳淋汤: {
    indicators: [
      { id: 'labor_strangury', w: 3 },
      { id: 'strangury', w: 2 },
      { id: 'fatigue', w: 2 }
    ]
  },
  砂淋丸: {
    indicators: [
      { id: 'stone_urine', w: 3 },
      { id: 'strangury', w: 2 }
    ]
  },
  寒淋汤: {
    indicators: [
      { id: 'cold_strangury', w: 3 },
      { id: 'strangury', w: 2 },
      { id: 'cold_limbs', w: 1 }
    ]
  },
  秘真丹: {
    indicators: [
      { id: 'milky_urine', w: 3 },
      { id: 'spermatorrhea', w: 3 },
      { id: 'strangury', w: 1 }
    ]
  },
  毒淋汤: {
    indicators: [
      { id: 'strangury', w: 3 },
      { id: 'milky_urine', w: 2 },
      { id: 'hematuria', w: 2 }
    ]
  },
  清毒二仙丹: {
    indicators: [
      { id: 'strangury', w: 3 },
      { id: 'syphilis', w: 2 }
    ]
  },
  鲜小蓟根汤: {
    indicators: [
      { id: 'hematuria', w: 3 },
      { id: 'strangury', w: 2 }
    ]
  },
  澄化汤: {
    indicators: [
      { id: 'frequent_urine', w: 3 },
      { id: 'milky_urine', w: 3 },
      { id: 'spermatorrhea', w: 2 },
      { id: 'cough', w: 1 }
    ]
  },
  清肾汤: {
    indicators: [
      { id: 'strangury', w: 3 },
      { id: 'milky_urine', w: 2 },
      { id: 'spermatorrhea', w: 2 },
      { id: 'frequent_urine', w: 2 }
    ]
  },
  舒和汤: {
    indicators: [
      { id: 'spermatorrhea', w: 3 },
      { id: 'milky_urine', w: 2 },
      { id: 'joint_pain', w: 1 }
    ]
  },
  麻黄加知母汤: {
    indicators: [
      { id: 'fever', w: 3 },
      { id: 'no_sweat', w: 3 },
      { id: 'aversion_cold', w: 2 },
      { id: 'pulse_float', w: 2 }
    ]
  },
  加味桂枝代粥汤: {
    indicators: [
      { id: 'spontaneous_sweat', w: 3 },
      { id: 'aversion_wind', w: 2 },
      { id: 'fever', w: 2 }
    ]
  },
  从龙汤: {
    indicators: [
      { id: 'wheezing', w: 3 },
      { id: 'cough', w: 3 },
      { id: 'phlegm_rattle', w: 2 }
    ]
  },
  馏水石膏饮: {
    indicators: [
      { id: 'chest_fullness', w: 3 },
      { id: 'wheezing', w: 3 },
      { id: 'fever', w: 2 },
      { id: 'pulse_floating_forceful', w: 2 }
    ]
  },
  通变大柴胡汤: {
    indicators: [
      { id: 'fever', w: 3 },
      { id: 'constipation', w: 3 },
      { id: 'hard_stool', w: 2 }
    ]
  },
  加味越婢加半夏汤: {
    indicators: [
      { id: 'cough', w: 3 },
      { id: 'wheezing', w: 3 },
      { id: 'phlegm_rattle', w: 2 }
    ]
  },
  清解汤: {
    indicators: [
      { id: 'fever', w: 3 },
      { id: 'headache', w: 2 },
      { id: 'body_ache', w: 2 },
      { id: 'no_sweat', w: 2 },
      { id: 'pulse_floating_slippery', w: 2 }
    ]
  },
  凉解汤: {
    indicators: [
      { id: 'fever', w: 3 },
      { id: 'pulse_surging', w: 2 },
      { id: 'pulse_float', w: 1 }
    ]
  },
  寒解汤: {
    indicators: [
      { id: 'fever', w: 3 },
      { id: 'thirst', w: 3 },
      { id: 'pulse_surging_slippery', w: 2 }
    ]
  },
  石膏阿斯匹林汤: {
    indicators: [
      { id: 'fever', w: 3 },
      { id: 'thirst', w: 2 }
    ]
  },
  和解汤: {
    indicators: [
      { id: 'fever', w: 3 },
      { id: 'spontaneous_sweat', w: 2 },
      { id: 'pulse_floating_slippery', w: 2 }
    ]
  },
  宣解汤: {
    indicators: [
      { id: 'fever', w: 2 },
      { id: 'difficult_urine', w: 3 },
      { id: 'dark_urine', w: 2 },
      { id: 'diarrhea', w: 2 }
    ]
  },
  滋阴宣解汤: {
    indicators: [
      { id: 'polydipsia', w: 3 },
      { id: 'diarrhea', w: 3 },
      { id: 'fever', w: 2 },
      { id: 'difficult_urine', w: 2 }
    ]
  },
  滋阴清燥汤: {
    indicators: [
      { id: 'fever', w: 2 },
      { id: 'cough', w: 2 },
      { id: 'wheezing', w: 2 },
      { id: 'pulse_deficient_rapid', w: 2 },
      { id: 'phlegm_rattle', w: 1 }
    ]
  },
  滋阴固下汤: {
    indicators: [
      { id: 'polydipsia', w: 3 },
      { id: 'diarrhea', w: 3 },
      { id: 'spontaneous_sweat', w: 1 },
      { id: 'palpitation', w: 1 }
    ]
  },
  犹龙汤: {
    indicators: [
      { id: 'chest_fullness', w: 3 },
      { id: 'restlessness', w: 2 },
      { id: 'wheezing', w: 2 },
      { id: 'hypochondriac', w: 1 }
    ]
  },
  仙露汤: {
    indicators: [
      { id: 'fever', w: 3 },
      { id: 'thirst', w: 3 },
      { id: 'pulse_surging', w: 2 }
    ]
  },
  石膏粳米汤: {
    indicators: [
      { id: 'fever', w: 3 },
      { id: 'thirst', w: 2 },
      { id: 'pulse_floating_forceful', w: 2 }
    ]
  },
  镇逆白虎汤: {
    indicators: [
      { id: 'fever', w: 3 },
      { id: 'thirst', w: 2 },
      { id: 'chest_fullness', w: 2 },
      { id: 'vomiting', w: 2 }
    ]
  },
  白虎加人参以山药代粳米汤: {
    indicators: [
      { id: 'fever', w: 3 },
      { id: 'polydipsia', w: 3 },
      { id: 'pulse_deficient_rapid', w: 2 },
      { id: 'fatigue', w: 2 }
    ]
  },
  宁嗽定喘饮: {
    indicators: [
      { id: 'cough', w: 3 },
      { id: 'wheezing', w: 3 },
      { id: 'breath_faint', w: 2 },
      { id: 'phlegm_rattle', w: 1 }
    ]
  },
  荡胸汤: {
    indicators: [
      { id: 'chest_fullness', w: 3 },
      { id: 'phlegm_rattle', w: 2 },
      { id: 'dysphagia', w: 2 },
      { id: 'constipation', w: 1 }
    ]
  },
  一味莱菔子汤: {
    indicators: [
      { id: 'chest_fullness', w: 3 },
      { id: 'dysphagia', w: 2 }
    ]
  },
  镇逆承气汤: {
    indicators: [
      { id: 'constipation', w: 3 },
      { id: 'vomiting', w: 3 },
      { id: 'abdominal_fullness', w: 2 }
    ]
  },
  青盂汤: {
    indicators: [
      { id: 'fever', w: 3 },
      { id: 'throat_swelling', w: 2 },
      { id: 'purpura', w: 2 },
      { id: 'headache', w: 1 }
    ]
  },
  护心至宝丹: {
    indicators: [
      { id: 'fever', w: 3 },
      { id: 'delirium', w: 3 },
      { id: 'mania', w: 2 }
    ]
  },
  清疹汤: {
    indicators: [
      { id: 'measles', w: 3 },
      { id: 'fever', w: 3 },
      { id: 'throat_swelling', w: 2 },
      { id: 'cough', w: 2 }
    ]
  },
  加味小柴胡汤: {
    indicators: [
      { id: 'malaria', w: 3 },
      { id: 'alternating', w: 2 },
      { id: 'hypochondriac', w: 1 },
      { id: 'pulse_wiry_weak', w: 2 }
    ]
  },
  升降汤: {
    indicators: [
      { id: 'qi_depression', w: 3 },
      { id: 'abdominal_fullness', w: 3 },
      { id: 'poor_appetite', w: 2 },
      { id: 'hypochondriac', w: 2 }
    ]
  },
  培脾舒肝汤: {
    indicators: [
      { id: 'qi_depression', w: 3 },
      { id: 'chest_fullness', w: 3 },
      { id: 'short_breath', w: 2 }
    ]
  },
  金铃泻肝汤: {
    indicators: [
      { id: 'hypochondriac', w: 3 },
      { id: 'chest_pain', w: 2 }
    ]
  },
  活络效灵丹: {
    indicators: [
      { id: 'joint_pain', w: 3 },
      { id: 'leg_pain', w: 3 },
      { id: 'arm_pain', w: 3 },
      { id: 'abdominal_pain', w: 2 },
      { id: 'mass_abdomen', w: 2 },
      { id: 'carbuncle', w: 1 },
      { id: 'chest_pain', w: 1 }
    ]
  },
  活络祛寒汤: {
    indicators: [
      { id: 'spasm', w: 3 },
      { id: 'cold_limbs', w: 2 },
      { id: 'joint_pain', w: 2 }
    ]
  },
  健运汤: {
    indicators: [
      { id: 'leg_pain', w: 3 },
      { id: 'arm_pain', w: 3 },
      { id: 'fatigue', w: 2 }
    ]
  },
  振中汤: {
    indicators: [
      { id: 'leg_pain', w: 3 },
      { id: 'back_ache', w: 3 },
      { id: 'poor_appetite', w: 2 }
    ]
  },
  曲直汤: {
    indicators: [
      { id: 'leg_pain', w: 3 },
      { id: 'hypochondriac', w: 1 },
      { id: 'pulse_wiry_weak', w: 2 }
    ]
  },
  玉烛汤: {
    indicators: [
      { id: 'alternating', w: 3 },
      { id: 'menstrual', w: 2 },
      { id: 'spontaneous_sweat', w: 2 },
      { id: 'fever', w: 1 }
    ]
  },
  理冲汤: {
    indicators: [
      { id: 'amenorrhea', w: 3 },
      { id: 'mass_abdomen', w: 3 },
      { id: 'infertility', w: 2 },
      { id: 'dysmenorrhea', w: 2 },
      { id: 'poor_appetite', w: 1 }
    ],
    contexts: ['menstruation']
  },
  理冲丸: {
    indicators: [
      { id: 'amenorrhea', w: 3 },
      { id: 'mass_abdomen', w: 3 },
      { id: 'dysmenorrhea', w: 1 }
    ],
    contexts: ['menstruation']
  },
  安冲汤: {
    indicators: [
      { id: 'menorrhagia', w: 3 },
      { id: 'metrorrhagia', w: 2 },
      { id: 'fatigue', w: 1 }
    ],
    contexts: ['menstruation']
  },
  固冲汤: {
    indicators: [
      { id: 'metrorrhagia', w: 3 },
      { id: 'menorrhagia', w: 2 },
      { id: 'fatigue', w: 2 },
      { id: 'pulse_weak', w: 2 },
      { id: 'tongue_pale', w: 1 }
    ],
    contexts: ['menstruation']
  },
  温冲汤: {
    indicators: [
      { id: 'infertility', w: 3 },
      { id: 'cold_limbs', w: 2 },
      { id: 'chill_body', w: 2 }
    ],
    contexts: ['menstruation']
  },
  清带汤: {
    indicators: [
      { id: 'leukorrhea', w: 3 },
      { id: 'bloody_leukorrhea', w: 3 }
    ],
    contexts: ['menstruation']
  },
  加味麦门冬汤: {
    indicators: [
      { id: 'vicarious_menstruation', w: 3 },
      { id: 'hemoptysis', w: 2 },
      { id: 'epistaxis', w: 2 }
    ],
    contexts: ['menstruation']
  },
  寿胎丸: {
    indicators: [
      { id: 'miscarriage', w: 3 },
      { id: 'back_ache', w: 1 },
      { id: 'fatigue', w: 1 }
    ],
    requires: ['pregnancy']
  },
  安胃饮: {
    indicators: [
      { id: 'morning_sickness', w: 3 },
      { id: 'vomiting', w: 3 },
      { id: 'nausea', w: 2 }
    ],
    requires: ['pregnancy']
  },
  大顺汤: {
    indicators: [
      { id: 'dystocia', w: 3 }
    ],
    requires: ['pregnancy']
  },
  和血熄风汤: {
    indicators: [
      { id: 'postpartum_convulsion', w: 3 },
      { id: 'convulsion', w: 3 },
      { id: 'spasm', w: 2 }
    ],
    contexts: ['postpartum']
  },
  滋阴清胃汤: {
    indicators: [
      { id: 'fever', w: 3 },
      { id: 'thirst', w: 2 },
      { id: 'constipation', w: 1 }
    ],
    contexts: ['postpartum']
  },
  滋乳汤: {
    indicators: [
      { id: 'low_milk', w: 3 },
      { id: 'fatigue', w: 2 },
      { id: 'poor_appetite', w: 1 }
    ],
    contexts: ['postpartum', 'lactation']
  },
  消乳汤: {
    indicators: [
      { id: 'mastitis', w: 3 },
      { id: 'carbuncle', w: 2 }
    ]
  },
  升肝舒郁汤: {
    indicators: [
      { id: 'uterine_prolapse', w: 3 },
      { id: 'qi_depression', w: 2 }
    ]
  },
  资生通脉汤: {
    indicators: [
      { id: 'amenorrhea', w: 3 },
      { id: 'poor_appetite', w: 3 },
      { id: 'tuberculosis', w: 2 },
      { id: 'fever', w: 2 },
      { id: 'cough', w: 1 }
    ],
    contexts: ['menstruation']
  },
  蒲公英汤: {
    indicators: [
      { id: 'eye_red_pain', w: 3 },
      { id: 'eye_cloudiness', w: 2 },
      { id: 'photophobia', w: 2 }
    ]
  },
  磨翳水: {
    indicators: [
      { id: 'eye_cloudiness', w: 3 },
      { id: 'eye_red_pain', w: 2 }
    ],
    route: 'external'
  },
  磨翳散: {
    indicators: [
      { id: 'eye_cloudiness', w: 3 },
      { id: 'eye_red_pain', w: 2 }
    ],
    route: 'external'
  },
  明目蓬硝水: {
    indicators: [
      { id: 'eye_red_pain', w: 3 },
      { id: 'eye_cloudiness', w: 2 }
    ],
    route: 'external'
  },
  清脑黄连膏: {
    indicators: [
      { id: 'eye_red_pain', w: 3 }
    ],
    route: 'external'
  },
  益瞳丸: {
    indicators: [
      { id: 'blurred_vision', w: 3 },
      { id: 'dizziness', w: 1 }
    ]
  },
  羊肝猪胆丸: {
    indicators: [
      { id: 'blurred_vision', w: 3 },
      { id: 'eye_red_pain', w: 1 }
    ]
  },
  咀华清喉丹: {
    indicators: [
      { id: 'throat_swelling', w: 3 },
      { id: 'sore_throat', w: 3 }
    ]
  },
  古方马乳饮: {
    indicators: [
      { id: 'gum_disease', w: 3 },
      { id: 'leg_pain', w: 2 },
      { id: 'edema', w: 1 }
    ]
  },
  牙疳散: {
    indicators: [
      { id: 'gum_disease', w: 3 },
      { id: 'gum_bleeding', w: 2 }
    ],
    route: 'external'
  },
  消瘰丸: {
    indicators: [
      { id: 'scrofula', w: 3 }
    ]
  },
  消瘰膏: {
    indicators: [
      { id: 'scrofula', w: 3 }
    ],
    route: 'external'
  },
  化腐生肌散: {
    indicators: [
      { id: 'ulcer', w: 3 },
      { id: 'scrofula', w: 2 }
    ],
    route: 'external'
  },
  内托生肌散: {
    indicators: [
      { id: 'ulcer', w: 3 },
      { id: 'carbuncle', w: 2 },
      { id: 'fatigue', w: 2 }
    ]
  },
  洗髓丹: {
    indicators: [
      { id: 'syphilis', w: 3 },
      { id: 'ulcer', w: 2 }
    ]
  }
}
