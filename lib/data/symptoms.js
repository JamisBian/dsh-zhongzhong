// 症状 / 舌象 / 脉象 目录（经方问诊选项库）
//
// 每个条目：{ id, label, cat, aliases? }
//  - id      稳定 ASCII 标识，供辨证引擎匹配
//  - label   面向患者的选项文案（选填时原样显示）
//  - cat     分类，用于分批提问
//  - aliases 同义说法，供模型/自由文本回填时识别

/** 分类顺序＝问诊分段的顺序。 */
export const CATEGORIES = [
  { id: 'cold_heat', label: '寒热' },
  { id: 'sweat', label: '汗出' },
  { id: 'head_body', label: '头身' },
  { id: 'chest_abdomen', label: '胸腹' },
  { id: 'digestion', label: '饮食口味' },
  { id: 'stool_urine', label: '二便' },
  { id: 'sleep_mind', label: '睡眠情志' },
  { id: 'respiratory', label: '咳喘咽喉' },
  { id: 'other', label: '其他' },
  { id: 'zz_qi', label: '气机与呼吸（衷中参西）' },
  { id: 'zz_blood', label: '出血（衷中参西）' },
  { id: 'zz_women', label: '妇科（衷中参西）' },
  { id: 'zz_mind', label: '神志与中风（衷中参西）' },
  { id: 'zz_fluid', label: '消渴与淋浊（衷中参西）' },
  { id: 'zz_chest', label: '胸膈与五官（衷中参西）' },
  { id: 'zz_skin', label: '疮疡与皮肤（衷中参西）' },
  { id: 'zz_misc', label: '其他特征（衷中参西）' },
  { id: 'tongue', label: '舌象' },
  { id: 'pulse', label: '脉象' }
]

/** 主症（问诊清单）条目。 */
export const SYMPTOMS = [
  // 寒热
  { id: 'aversion_cold', label: '恶寒怕冷', cat: 'cold_heat', aliases: ['怕冷', '恶寒'] },
  { id: 'aversion_wind', label: '恶风（遇风不适）', cat: 'cold_heat', aliases: ['怕风', '恶风'] },
  { id: 'fever', label: '发热', cat: 'cold_heat', aliases: ['发烧', '身热', '低热', '壮热', '热病', '灼热', '高热'] },
  { id: 'no_fever', label: '不发热', cat: 'cold_heat' },
  { id: 'alternating', label: '往来寒热（忽冷忽热）', cat: 'cold_heat', aliases: ['忽冷忽热', '寒热往来'] },
  { id: 'tidal_fever', label: '潮热（定时发热）', cat: 'cold_heat', aliases: ['潮热'] },
  { id: 'cold_limbs', label: '手足厥冷', cat: 'cold_heat', aliases: ['手脚冰凉', '手足冷', '四逆', '手足逆冷', '四肢厥冷'] },
  { id: 'hot_palms', label: '手足心热', cat: 'cold_heat', aliases: ['五心烦热'] },
  { id: 'chill_body', label: '畏寒肢冷（全身怕冷）', cat: 'cold_heat', aliases: ['畏寒'] },
  { id: 'face_red', label: '面赤/颜面潮红', cat: 'cold_heat', aliases: ['面正赤', '面色赤', '两颧潮红', '面红'] },

  // 汗
  { id: 'no_sweat', label: '无汗', cat: 'sweat' },
  { id: 'spontaneous_sweat', label: '自汗（动则汗出）', cat: 'sweat', aliases: ['自汗', '汗出'] },
  { id: 'night_sweat', label: '盗汗（睡中汗出）', cat: 'sweat', aliases: ['盗汗'] },
  { id: 'profuse_sweat', label: '大汗出', cat: 'sweat', aliases: ['大汗'] },
  { id: 'sticky_sweat', label: '汗出黏腻', cat: 'sweat' },

  // 头身
  { id: 'headache', label: '头痛', cat: 'head_body', aliases: ['头疼'] },
  { id: 'dizziness', label: '头晕目眩', cat: 'head_body', aliases: ['头晕', '眩', '目眩', '眩晕', '头昏'] },
  { id: 'stiff_neck', label: '颈项强痛', cat: 'head_body', aliases: ['项强', '脖子僵'] },
  { id: 'body_ache', label: '周身疼痛', cat: 'head_body', aliases: ['身疼', '身体酸痛'] },
  { id: 'back_ache', label: '腰背疼痛', cat: 'head_body', aliases: ['腰痛', '腰酸'] },
  { id: 'joint_pain', label: '关节疼痛', cat: 'head_body', aliases: ['骨节疼痛', '关节痛', '痹痛', '寒湿痹痛'] },
  { id: 'heavy_body', label: '身重乏力', cat: 'head_body', aliases: ['身重', '一身尽重'] },
  { id: 'edema', label: '浮肿', cat: 'head_body', aliases: ['水肿', '面目浮肿'] },

  // 胸腹
  { id: 'chest_oppression', label: '胸闷', cat: 'chest_abdomen', aliases: ['胸满', '胸中窒'] },
  { id: 'chest_pain', label: '胸痛彻背', cat: 'chest_abdomen', aliases: ['心痛彻背', '胸痹'] },
  { id: 'palpitation', label: '心悸', cat: 'chest_abdomen', aliases: ['心动悸', '心慌', '怔忡', '心跳'] },
  { id: 'hypochondriac', label: '胁肋胀满疼痛', cat: 'chest_abdomen', aliases: ['胸胁苦满', '胁痛', '胁满', '胁肋胀满', '胁下满'] },
  { id: 'epigastric_distention', label: '心下（胃脘）痞满', cat: 'chest_abdomen', aliases: ['心下痞', '胃胀', '心下满'] },
  { id: 'epigastric_pain', label: '胃脘疼痛', cat: 'chest_abdomen', aliases: ['胃痛', '心下痛'] },
  { id: 'abdominal_pain', label: '腹痛', cat: 'chest_abdomen', aliases: ['腹中痛', '心腹冷痛', '腹中冷痛', '心腹痛'] },
  { id: 'lower_abdomen', label: '少腹急结疼痛', cat: 'chest_abdomen', aliases: ['少腹痛', '小腹痛'] },
  { id: 'abdominal_fullness', label: '腹部胀满', cat: 'chest_abdomen', aliases: ['腹满', '腹胀'] },
  { id: 'rigidity', label: '腹硬拒按', cat: 'chest_abdomen', aliases: ['拒按', '腹硬'] },
  { id: 'mass_abdomen', label: '腹中包块', cat: 'chest_abdomen', aliases: ['癥块', '痞块'] },
  { id: 'qi_rush', label: '气从少腹上冲胸', cat: 'chest_abdomen', aliases: ['气上冲胸', '奔豚', '气从少腹上至心'] },
  { id: 'lower_abdomen_throb', label: '脐下悸动', cat: 'chest_abdomen', aliases: ['脐下悸', '脐下跳动'] },

  // 饮食口味
  { id: 'bitter_mouth', label: '口苦', cat: 'digestion', aliases: ['口苦咽干'] },
  { id: 'dry_mouth', label: '口干咽干', cat: 'digestion', aliases: ['口干', '咽干', '口燥', '咽燥', '津伤口渴'] },
  { id: 'thirst', label: '口渴', cat: 'digestion', aliases: ['欲饮水', '烦渴', '口燥渴'] },
  { id: 'thirst_cold', label: '口渴喜冷饮', cat: 'digestion' },
  { id: 'thirst_no_drink', label: '口渴但不欲饮', cat: 'digestion', aliases: ['但欲漱水不欲咽'] },
  { id: 'nausea', label: '恶心', cat: 'digestion', aliases: ['泛恶'] },
  { id: 'vomiting', label: '呕吐', cat: 'digestion', aliases: ['呕'] },
  { id: 'dry_heave', label: '干呕', cat: 'digestion' },
  { id: 'belching', label: '嗳气（打嗝）', cat: 'digestion', aliases: ['噫气', '打嗝'] },
  { id: 'poor_appetite', label: '食欲差', cat: 'digestion', aliases: ['纳差', '不欲食', '默默不欲饮食', '食欲不振', '食欲减退', '不思饮食', '纳呆', '食少'] },
  { id: 'acid_reflux', label: '反酸烧心', cat: 'digestion', aliases: ['吞酸', '烧心'] },
  { id: 'no_taste', label: '口淡无味', cat: 'digestion' },
  { id: 'borborygmus', label: '肠鸣漉漉', cat: 'digestion', aliases: ['肠鸣', '腹中雷鸣'] },
  { id: 'saliva', label: '吐涎沫/口水多', cat: 'digestion', aliases: ['吐涎沫', '多涎唾', '涎沫'] },
  { id: 'hiccup', label: '呃逆（哕）', cat: 'digestion', aliases: ['哕逆', '打呃', '哕'] },

  // 二便
  { id: 'constipation', label: '便秘', cat: 'stool_urine', aliases: ['大便不通'] },
  { id: 'hard_stool', label: '大便干硬', cat: 'stool_urine', aliases: ['大便硬', '燥屎'] },
  { id: 'diarrhea', label: '腹泻', cat: 'stool_urine', aliases: ['下利', '泄泻'] },
  { id: 'loose_stool', label: '大便溏薄', cat: 'stool_urine', aliases: ['便溏'] },
  { id: 'mucus_stool', label: '大便黏液/脓血', cat: 'stool_urine', aliases: ['下重', '里急后重', '脓血'] },
  { id: 'dark_urine', label: '小便黄少', cat: 'stool_urine', aliases: ['尿黄'] },
  { id: 'clear_urine', label: '小便清长', cat: 'stool_urine', aliases: ['尿清'] },
  { id: 'frequent_urine', label: '尿频', cat: 'stool_urine' },
  { id: 'difficult_urine', label: '小便不利', cat: 'stool_urine', aliases: ['排尿不畅', '尿少'] },

  // 睡眠情志
  { id: 'insomnia', label: '失眠', cat: 'sleep_mind', aliases: ['不得眠', '不寐', '不得卧', '入睡难', '睡眠差', '难眠'] },
  { id: 'dreamy_sleep', label: '多梦', cat: 'sleep_mind' },
  { id: 'irritability', label: '心烦易怒', cat: 'sleep_mind', aliases: ['心烦', '易怒'] },
  { id: 'restlessness', label: '烦躁不安', cat: 'sleep_mind', aliases: ['烦躁'] },
  { id: 'depression', label: '情绪低落', cat: 'sleep_mind', aliases: ['喜悲伤欲哭', '脏躁'] },
  { id: 'anxiety', label: '焦虑紧张', cat: 'sleep_mind', aliases: ['焦虑', '紧张', '恐惧', '易惊', '担忧', '心神不宁'] },
  { id: 'forgetfulness', label: '健忘', cat: 'sleep_mind' },
  { id: 'lethargy', label: '嗜睡但欲寐', cat: 'sleep_mind', aliases: ['但欲寐', '嗜睡'] },
  { id: 'delirium', label: '神昏谵语', cat: 'sleep_mind', aliases: ['谵语', '神昏'] },

  // 咳喘咽喉
  { id: 'cough', label: '咳嗽', cat: 'respiratory', aliases: ['咳'] },
  { id: 'wheezing', label: '喘息', cat: 'respiratory', aliases: ['喘', '气喘'] },
  { id: 'white_sputum', label: '痰白清稀', cat: 'respiratory', aliases: ['痰稀', '清痰'] },
  { id: 'yellow_sputum', label: '痰黄黏稠', cat: 'respiratory', aliases: ['黄痰', '痰稠'] },
  { id: 'sore_throat', label: '咽痛', cat: 'respiratory', aliases: ['咽喉肿痛', '咽喉疼痛', '喉痹', '喉痛'] },
  { id: 'nasal', label: '鼻塞流涕', cat: 'respiratory', aliases: ['鼻鸣'] },
  { id: 'throat_globus', label: '咽中异物感（梅核气）', cat: 'respiratory', aliases: ['咽中如有炙脔', '梅核气'] },
  { id: 'short_breath', label: '短气（气不够用）', cat: 'respiratory', aliases: ['短气', '气短'] },
  { id: 'orthopnea', label: '喘不得平卧', cat: 'respiratory', aliases: ['喘不得卧', '不得平卧', '不能平卧', '倚息不得卧'] },

  // 其他
  { id: 'fatigue', label: '疲乏无力', cat: 'other', aliases: ['乏力', '少气', '神疲', '倦怠', '没力气'] },
  { id: 'weight_loss', label: '消瘦', cat: 'other', aliases: ['虚羸'] },
  { id: 'jaundice', label: '身目发黄', cat: 'other', aliases: ['黄疸', '身黄'] },
  { id: 'bleeding', label: '出血（衄血/便血/崩漏）', cat: 'other', aliases: ['衄血', '便血', '崩漏'] },
  { id: 'menstrual', label: '月经不调', cat: 'other', aliases: ['经期紊乱'] },
  { id: 'dysmenorrhea', label: '痛经', cat: 'other' },
  { id: 'leukorrhea', label: '带下量多', cat: 'other', aliases: ['带下'] },
  { id: 'numbness', label: '肢体麻木', cat: 'other' },
  { id: 'itching', label: '皮肤瘙痒', cat: 'other', aliases: ['瘙痒', '身痒', '皮肤痒', '疥癣'] },
  { id: 'spasm', label: '筋脉拘挛', cat: 'other', aliases: ['脚挛急', '抽筋', '抽动', '抽搐', '痉挛', '面肌痉挛', '小腿抽筋'] },
  { id: 'sore_limbs', label: '四肢酸疼', cat: 'other', aliases: ['肢节烦疼'] },
  { id: 'muscle_twitch', label: '肌肉跳动/筋惕肉瞤', cat: 'other', aliases: ['筋惕肉瞤', '肌肉跳动', '聂聂动'] },
  { id: 'spermatorrhea', label: '遗精/滑精', cat: 'other', aliases: ['失精', '梦交', '滑精', '遗精'] },

  // ── 《医学衷中参西录》特征症 ─────────────────────────────
  // 气机与呼吸
  { id: 'qi_sinking', label: '胸中大气下陷（气短不足以息）', cat: 'zz_qi', aliases: ['大气下陷', '气短不足以息', '胸中大气下陷', '气息将停', '大气虚陷'] },
  { id: 'breathing_effort', label: '努力呼吸/呼吸费力', cat: 'zz_qi', aliases: ['努力呼吸', '呼吸费力', '吸气困难', '气息不续', '气不接续'] },
  { id: 'breath_faint', label: '气息微弱', cat: 'zz_qi', aliases: ['气息微弱', '气息奄奄', '气息似甚不足'] },
  { id: 'qi_rush_up', label: '冲气上冲', cat: 'zz_qi', aliases: ['冲气上冲', '气上冲', '气逆上冲', '冲气上干', '气从少腹上冲'] },
  { id: 'qi_depression', label: '气郁/肝气郁结', cat: 'zz_qi', aliases: ['气郁', '肝气郁', '肝郁', '气分郁结', '木郁'] },
  { id: 'sighing', label: '善太息（常叹气）', cat: 'zz_qi', aliases: ['善太息', '太息', '长叹气'] },
  { id: 'abdominal_qi', label: '腹中气动/气窜', cat: 'zz_qi', aliases: ['腹中气动', '气窜', '腹中作响', '腹中动气'] },
  { id: 'chest_fullness', label: '胸膈满闷', cat: 'zz_qi', aliases: ['胸膈满闷', '胸次满闷', '胸中满闷', '胸满', '胸中窒'] },
  { id: 'qi_counterflow', label: '胃气上逆', cat: 'zz_qi', aliases: ['胃气上逆', '胃气不降', '气逆', '呕逆'] },

  // 出血
  { id: 'hemoptysis', label: '咳血', cat: 'zz_blood', aliases: ['咳血', '咯血', '咳嗽吐血', '咳血吐血'] },
  { id: 'blood_sputum', label: '痰中带血', cat: 'zz_blood', aliases: ['痰中带血', '痰血', '咳吐痰血', '痰中血'] },
  { id: 'hematemesis', label: '吐血', cat: 'zz_blood', aliases: ['吐血', '呕血', '吐衄'] },
  { id: 'epistaxis', label: '鼻衄', cat: 'zz_blood', aliases: ['鼻衄', '鼻出血', '衄血', '齿衄'] },
  { id: 'hematochezia', label: '便血', cat: 'zz_blood', aliases: ['便血', '大便下血', '下血', '二便下血'] },
  { id: 'hematuria', label: '尿血', cat: 'zz_blood', aliases: ['尿血', '溺血', '血淋', '小便下血'] },
  { id: 'metrorrhagia', label: '崩漏', cat: 'zz_blood', aliases: ['崩漏', '血崩', '漏下', '经行不止', '经水过多'] },
  { id: 'purpura', label: '肌衄/发斑', cat: 'zz_blood', aliases: ['肌衄', '发斑', '斑疹', '紫斑', '阳毒发斑'] },
  { id: 'gum_bleeding', label: '牙龈出血', cat: 'zz_blood', aliases: ['牙龈出血', '齿衄', '牙龈浮肿出血'] },

  // 妇科
  { id: 'amenorrhea', label: '经闭', cat: 'zz_women', aliases: ['经闭', '闭经', '月闭', '血枯', '月信不通', '月经不来', '经水不行'] },
  { id: 'menorrhagia', label: '经量过多', cat: 'zz_women', aliases: ['经水过多', '经行量多', '月经过多', '经水行时多'] },
  { id: 'bloody_leukorrhea', label: '赤白带下', cat: 'zz_women', aliases: ['赤白带下', '赤带', '白带', '带下赤白'] },
  { id: 'miscarriage', label: '滑胎', cat: 'zz_women', aliases: ['滑胎', '屡孕屡堕', '习惯性流产'] },
  { id: 'morning_sickness', label: '恶阻（妊娠呕吐）', cat: 'zz_women', aliases: ['恶阻', '妊娠呕吐', '怀妊呕吐', '妊吐'] },
  { id: 'dystocia', label: '难产', cat: 'zz_women', aliases: ['难产', '产难', '交骨不开', '产程不顺'] },
  { id: 'low_milk', label: '乳汁不足', cat: 'zz_women', aliases: ['少乳', '缺乳', '乳汁不下', '乳汁少'] },
  { id: 'mastitis', label: '乳痈', cat: 'zz_women', aliases: ['乳痈', '结乳肿疼', '乳腺炎', '乳肿'] },
  { id: 'uterine_prolapse', label: '阴挺', cat: 'zz_women', aliases: ['阴挺', '子宫脱垂'] },
  { id: 'vicarious_menstruation', label: '倒经', cat: 'zz_women', aliases: ['倒经', '经行吐衄', '经水逆行'] },
  { id: 'postpartum_convulsion', label: '产后发搐', cat: 'zz_women', aliases: ['产后发搐', '产后抽搐', '产后受风'] },
  { id: 'lochia', label: '恶露不尽', cat: 'zz_women', aliases: ['恶露不尽', '恶露不止', '产后恶露'] },
  { id: 'infertility', label: '不孕', cat: 'zz_women', aliases: ['不孕', '不育', '血海虚寒', '难以受孕'] },

  // 神志与中风
  { id: 'mania', label: '癫狂', cat: 'zz_mind', aliases: ['癫狂', '发狂', '精神错乱', '失心', '妄言妄见'] },
  { id: 'epilepsy', label: '痫风', cat: 'zz_mind', aliases: ['痫风', '癫痫', '羊痫风', '痫证'] },
  { id: 'convulsion', label: '抽搐/惊风', cat: 'zz_mind', aliases: ['抽搐', '惊风', '搐搦', '抽掣', '四肢抽搐', '螈', '急惊风', '慢脾风'] },
  { id: 'stroke', label: '中风/昏仆', cat: 'zz_mind', aliases: ['中风', '昏仆', '猝然昏倒', '不省人事', '类中风', '内中风'] },
  { id: 'hemiplegia', label: '半身不遂', cat: 'zz_mind', aliases: ['偏枯', '半身不遂', '肢体不遂', '偏瘫'] },
  { id: 'facial_paralysis', label: '口眼歪斜', cat: 'zz_mind', aliases: ['口眼歪斜', '口眼斜', '口僻'] },
  { id: 'aphasia', label: '言语謇涩', cat: 'zz_mind', aliases: ['言语謇涩', '言语不利', '失语', '言语不真'] },
  { id: 'atrophy', label: '肢体痿废', cat: 'zz_mind', aliases: ['痿废', '痿弱', '肢体痿软', '筋痿', '足不能行', '四肢无力'] },
  { id: 'tremor', label: '震颤', cat: 'zz_mind', aliases: ['颤振', '手抖', '震颤'] },
  { id: 'head_heavy', label: '头重', cat: 'zz_mind', aliases: ['头重', '头重脚轻', '头重目眩'] },
  { id: 'brain_hyperemia', label: '脑充血/头目胀痛', cat: 'zz_mind', aliases: ['脑充血', '头目胀痛', '脑中作疼', '目胀', '脑中发热'] },

  // 消渴与淋浊
  { id: 'polydipsia', label: '大渴多饮', cat: 'zz_fluid', aliases: ['大渴', '多饮', '渴欲饮水', '燥渴多饮', '嗜饮凉水'] },
  { id: 'polyuria', label: '多尿', cat: 'zz_fluid', aliases: ['小便频数', '尿多', '饮一溲一', '小便多'] },
  { id: 'sweet_urine', label: '尿甜', cat: 'zz_fluid', aliases: ['尿甜', '糖尿', '小便甜'] },
  { id: 'strangury', label: '小便涩痛', cat: 'zz_fluid', aliases: ['淋证', '小便疼涩', '溺管疼痛', '淋痛', '小便涩痛', '花柳毒淋'] },
  { id: 'milky_urine', label: '膏淋/白浊', cat: 'zz_fluid', aliases: ['膏淋', '白浊', '小便白浊', '遗精白浊'] },
  { id: 'stone_urine', label: '砂淋/石淋', cat: 'zz_fluid', aliases: ['砂淋', '石淋', '尿石'] },
  { id: 'qi_strangury', label: '气淋', cat: 'zz_fluid', aliases: ['气淋'] },
  { id: 'labor_strangury', label: '劳淋', cat: 'zz_fluid', aliases: ['劳淋'] },
  { id: 'cold_strangury', label: '寒淋', cat: 'zz_fluid', aliases: ['寒淋'] },
  { id: 'urinary_retention', label: '小便不通/癃闭', cat: 'zz_fluid', aliases: ['癃闭', '小便不通', '小便滴沥', '溺管闭塞', '转胞', '小便闭塞'] },
  { id: 'turbid_urine', label: '小便浑浊', cat: 'zz_fluid', aliases: ['小便浑浊', '尿浊', '小便赤涩'] },
  { id: 'enuresis', label: '遗尿/小便不禁', cat: 'zz_fluid', aliases: ['遗尿', '小便不禁', '小便失禁', '小便自遗'] },

  // 胸膈与五官
  { id: 'dysphagia', label: '噎膈（吞咽困难）', cat: 'zz_chest', aliases: ['噎膈', '膈食', '食不下', '饮食不下', '吞咽困难', '贲门狭窄'] },
  { id: 'regurgitation', label: '反胃', cat: 'zz_chest', aliases: ['反胃', '朝食暮吐', '暮食朝吐', '食入即吐'] },
  { id: 'phlegm_rattle', label: '痰涎壅盛', cat: 'zz_chest', aliases: ['痰涎壅盛', '痰涎壅滞', '喉中痰鸣', '痰多'] },
  { id: 'foul_sputum', label: '吐脓血/腥臭痰', cat: 'zz_chest', aliases: ['吐脓血', '脓血痰', '腥臭痰', '肺痈', '咳吐脓血'] },
  { id: 'tuberculosis', label: '肺痨', cat: 'zz_chest', aliases: ['肺痨', '肺结核', '劳瘵', '痨瘵', '肺劳'] },
  { id: 'hoarseness', label: '失音/声哑', cat: 'zz_chest', aliases: ['失音', '声哑', '音哑', '喉疼声哑', '不能出声'] },
  { id: 'throat_swelling', label: '咽喉肿痛', cat: 'zz_chest', aliases: ['咽喉肿疼', '咽喉肿痛', '喉痹', '喉痧', '乳蛾', '白喉', '咽喉不利'] },
  { id: 'toothache', label: '牙痛', cat: 'zz_chest', aliases: ['牙疼', '牙痛', '牙齿疼痛'] },
  { id: 'gum_disease', label: '牙疳/牙龈腐化', cat: 'zz_chest', aliases: ['牙疳', '走马牙疳', '牙龈腐化', '牙龈肿疼', '青腿牙疳'] },
  { id: 'eye_red_pain', label: '目赤肿痛', cat: 'zz_chest', aliases: ['目赤', '眼疾肿疼', '目睛胀疼', '目赤肿痛', '目疼连脑'] },
  { id: 'eye_cloudiness', label: '目翳/云翳', cat: 'zz_chest', aliases: ['目翳', '云翳', '翳障', '目生云翳', '翳遮睛'] },
  { id: 'photophobia', label: '羞明多泪', cat: 'zz_chest', aliases: ['羞明', '多泪', '羞明多泪', '畏光'] },
  { id: 'blurred_vision', label: '视物昏花', cat: 'zz_chest', aliases: ['视物昏花', '目昏', '瞳神散大', '视物乏力', '视物不真'] },
  { id: 'nasal_discharge', label: '鼻渊/浊涕', cat: 'zz_chest', aliases: ['鼻渊', '浊涕', '鼻流浊涕', '鼻塞'] },
  { id: 'oral_ulcer', label: '口疮', cat: 'zz_chest', aliases: ['口疮', '口腔溃疡', '口舌生疮'] },
  { id: 'scarlet_fever', label: '猩红热/烂喉痧', cat: 'zz_chest', aliases: ['猩红热', '烂喉痧', '痧疹'] },
  { id: 'measles', label: '麻疹/疹出不透', cat: 'zz_chest', aliases: ['麻疹', '疹出不利', '温疹', '痧疹', '斑疹'] },
  { id: 'tinnitus', label: '耳鸣', cat: 'zz_chest', aliases: ['耳鸣', '耳中鸣响'] },
  { id: 'deafness', label: '耳聋', cat: 'zz_chest', aliases: ['耳聋', '听力下降', '耳闭'] },

  // 疮疡与皮肤
  { id: 'scrofula', label: '瘰疬', cat: 'zz_skin', aliases: ['瘰疬', '瘰', '淋巴结核', '鼠疮'] },
  { id: 'carbuncle', label: '痈疽/疮疡', cat: 'zz_skin', aliases: ['痈疽', '疮疡', '疮毒', '红肿疮疡', '痈肿'] },
  { id: 'ulcer', label: '疮面溃烂/久不收口', cat: 'zz_skin', aliases: ['溃烂', '疮口不敛', '久不收口', '生肌不速', '疮面不愈'] },
  { id: 'syphilis', label: '杨梅疮', cat: 'zz_skin', aliases: ['杨梅疮', '梅毒', '花柳毒', '杨梅毒'] },
  { id: 'abscess', label: '内痈', cat: 'zz_skin', aliases: ['内痈', '肠痈', '脏腑内痈'] },
  { id: 'burn', label: '汤火伤', cat: 'zz_skin', aliases: ['汤火伤', '烧伤', '烫伤'] },
  { id: 'trauma', label: '外伤/金疮', cat: 'zz_skin', aliases: ['金疮', '破伤', '跌打损伤', '外伤'] },
  { id: 'goiter', label: '瘿瘤', cat: 'zz_skin', aliases: ['瘿瘤', '甲状腺肿大', '瘿'] },
  { id: 'hemorrhoid', label: '痔疮', cat: 'zz_skin', aliases: ['痔疮', '痔', '肛裂'] },
  { id: 'eczema', label: '湿疹/浸淫疮', cat: 'zz_skin', aliases: ['湿疹', '浸淫疮', '湿疮'] },
  { id: 'tinea', label: '癣/疥癣', cat: 'zz_skin', aliases: ['癣', '疥癣', '顽癣'] },

  // 其他特征
  { id: 'bone_steaming', label: '骨蒸', cat: 'zz_misc', aliases: ['骨蒸', '骨蒸劳热', '蒸热'] },
  { id: 'heat_chest', label: '心中烦热', cat: 'zz_misc', aliases: ['心中烦热', '胸中烦热', '上焦烦热', '心中热'] },
  { id: 'dry_cough', label: '干咳', cat: 'zz_misc', aliases: ['干咳', '咳逆', '干咳嗽'] },
  { id: 'leg_pain', label: '腿疼', cat: 'zz_misc', aliases: ['腿疼', '腿痛', '下肢疼痛'] },
  { id: 'arm_pain', label: '臂疼', cat: 'zz_misc', aliases: ['臂疼', '臂痛', '上肢疼痛'] },
  { id: 'ascites', label: '臌胀', cat: 'zz_misc', aliases: ['臌胀', '水臌', '气臌', '单腹胀', '腹大如鼓', '胀满'] },
  { id: 'malaria', label: '疟疾', cat: 'zz_misc', aliases: ['疟疾', '疟病', '寒热定时', '久疟'] },
  { id: 'cholera', label: '霍乱', cat: 'zz_misc', aliases: ['霍乱', '吐泻转筋', '痧证', '霍乱吐泻'] },
  { id: 'dysentery', label: '痢疾', cat: 'zz_misc', aliases: ['痢疾', '下痢', '下痢赤白', '赤白痢', '噤口痢', '热痢'] },
  { id: 'tenesmus', label: '里急后重', cat: 'zz_misc', aliases: ['里急后重', '下重', '后重'] },
  { id: 'bloody_stool', label: '下痢脓血', cat: 'zz_misc', aliases: ['脓血', '赤白冻', '便脓血', '下痢脓血'] },
  { id: 'chronic_diarrhea', label: '久泻', cat: 'zz_misc', aliases: ['久泻', '泄泻不止', '滑泻', '久痢'] },
  { id: 'fecal_incontinence', label: '大便滑泻/失禁', cat: 'zz_misc', aliases: ['大便滑泻', '滑泻', '大便不禁', '肠滑不固'] },
  { id: 'polyphagia', label: '多食易饥', cat: 'zz_misc', aliases: ['多食', '消谷善饥', '能食', '饮食增多'] }
]

/** 舌象（多选）。 */
export const TONGUE = [
  { id: 'tongue_pink', label: '舌淡红' },
  { id: 'tongue_pale', label: '舌淡白' },
  { id: 'tongue_red', label: '舌红' },
  { id: 'tongue_crimson', label: '舌绛红' },
  { id: 'tongue_purple', label: '舌暗紫' },
  { id: 'tongue_swollen', label: '舌体胖大' },
  { id: 'tongue_teeth', label: '舌边齿痕' },
  { id: 'coat_thin_white', label: '苔薄白' },
  { id: 'coat_white_greasy', label: '苔白腻' },
  { id: 'coat_yellow', label: '苔黄' },
  { id: 'coat_yellow_greasy', label: '苔黄腻' },
  { id: 'coat_none', label: '少苔/无苔' },
  { id: 'tongue_white_thick', label: '苔白厚' },
  { id: 'tongue_grey_slippery', label: '苔灰滑腻' },
  { id: 'tongue_red_dry', label: '舌红少津' },
  { id: 'tongue_pale_swollen', label: '舌淡胖' }
]

/** 脉象（多选）。 */
export const PULSE = [
  { id: 'pulse_float', label: '浮' },
  { id: 'pulse_deep', label: '沉' },
  { id: 'pulse_slow', label: '迟' },
  { id: 'pulse_rapid', label: '数' },
  { id: 'pulse_wiry', label: '弦' },
  { id: 'pulse_slippery', label: '滑' },
  { id: 'pulse_thin', label: '细' },
  { id: 'pulse_rough', label: '涩' },
  { id: 'pulse_tight', label: '紧' },
  { id: 'pulse_weak', label: '微/弱' },
  { id: 'pulse_deficient', label: '虚' },
  { id: 'pulse_surging', label: '洪大' },
  { id: 'pulse_knotted', label: '结代' },
  { id: 'pulse_wiry_long', label: '弦长有力' },
  { id: 'pulse_surging_slippery', label: '洪滑' },
  { id: 'pulse_deficient_rapid', label: '虚数' },
  { id: 'pulse_deep_slow_weak', label: '沉迟微弱' },
  { id: 'pulse_floating_slippery', label: '浮滑' },
  { id: 'pulse_soft', label: '濡弱' },
  { id: 'pulse_hollow', label: '芤' },
  { id: 'pulse_leather', label: '革' },
  { id: 'pulse_minute', label: '微细' },
  { id: 'pulse_irregular', label: '参伍不调' },
  { id: 'pulse_floating_forceful', label: '浮而有力' },
  { id: 'pulse_wiry_weak', label: '弦而无力' },
  { id: 'pulse_slippery_forceful', label: '滑实' },
  { id: 'pulse_deep_wiry', label: '沉弦' }
]

/** 全部可选条目（主症 + 舌 + 脉）。 */
export const ALL_ITEMS = [...SYMPTOMS, ...TONGUE, ...PULSE]

const BY_ID = new Map(ALL_ITEMS.map((item) => [item.id, item]))

/** 同义说法 → id（含 label 自身）。 */
const BY_ALIAS = new Map()
for (const item of ALL_ITEMS) {
  BY_ALIAS.set(item.label, item.id)
  // 「咽中异物感（梅核气）」这类带括注的标签，去掉括注也能命中
  const bare = item.label.replace(/（[^）]*）/g, '').replace(/\([^)]*\)/g, '').trim()
  if (bare !== '') BY_ALIAS.set(bare, item.id)
  for (const alias of item.aliases ?? []) BY_ALIAS.set(alias, item.id)
}

/** 取条目。 */
export function item(id) {
  return BY_ID.get(id)
}

/** 取展示文案；未知 id 原样返回。 */
export function labelOf(id) {
  return BY_ID.get(id)?.label ?? id
}

/**
 * 把用户/模型给的标签或 id 统一成 id。
 * 容忍去掉括注、空白与全半角差异；无法识别时返回 undefined。
 */
export function resolveId(raw) {
  if (typeof raw !== 'string') return undefined
  const text = raw.trim()
  if (text === '') return undefined
  if (BY_ID.has(text)) return text
  const bare = text.replace(/（[^）]*）/g, '').replace(/\([^)]*\)/g, '').trim()
  if (BY_ID.has(bare)) return bare
  if (BY_ALIAS.has(bare)) return BY_ALIAS.get(bare)
  if (BY_ALIAS.has(text)) return BY_ALIAS.get(text)
  // 「脉弦」「舌淡红」这类带前缀的写法
  if (bare.startsWith('脉') && BY_ALIAS.has(bare.slice(1))) return BY_ALIAS.get(bare.slice(1))
  if (bare.startsWith('舌') && BY_ALIAS.has(bare.slice(1))) return BY_ALIAS.get(bare.slice(1))
  return undefined
}

/** 一组原始标签 → 去重后的 id 列表（无法识别的丢弃）。 */
export function resolveIds(list) {
  const out = []
  for (const raw of list ?? []) {
    const id = resolveId(raw)
    if (id !== undefined && !out.includes(id)) out.push(id)
  }
  return out
}

/**
 * 从一整段自由文本里识别症状（子串匹配，用于患者原话/补充说明）。
 * 只匹配长度 ≥2 的别名，避免「咳」「呕」这类单字造成噪声。
 * @param {string} text
 * @returns {string[]} 症状 id
 */
export function resolveIdsInText(text) {
  if (typeof text !== 'string' || text === '') return []
  const out = []
  for (const [alias, id] of BY_ALIAS) {
    if (alias.length < 2) continue
    if (text.includes(alias) && !out.includes(id)) out.push(id)
  }
  return out
}

/** 分类下的主症条目。 */
export function byCategory(cat) {
  return SYMPTOMS.filter((s) => s.cat === cat)
}
