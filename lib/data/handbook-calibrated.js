// 手册补录方的人工校准（方证指标 / 相反见症）
//
// 这 24 首在 formulas-handbook.js 里是由脚本从手册文本自动推导指标的，
// 权重偏粗（`autoPattern: true`，得分打 85 折）。本文件用人工判读替换掉：
// 主症 w=3、兼症 w=2、或然症 w=1，并补上相反见症。
//
// 校准依据：手册的【方证提要】【原书方证】【体质要求】【适用疾病】，
// 以及原方在《伤寒论》《金匮要略》或原书中的主治。
// 校准后去掉 autoPattern，不再降权。

export const HANDBOOK_CALIBRATION = {
  // ── 后世方 / 经验方 ──────────────────────────────────
  补中益气汤_hf: {
    indicators: [
      { id: 'fatigue', w: 3 },
      { id: 'short_breath', w: 3 },
      { id: 'spontaneous_sweat', w: 2 },
      { id: 'poor_appetite', w: 2 },
      { id: 'loose_stool', w: 2 },
      { id: 'lethargy', w: 2 },
      { id: 'fever', w: 2 },
      { id: 'weight_loss', w: 1 },
      { id: 'dizziness', w: 1 }
    ],
    contra: [
      { id: 'thirst_cold', w: 2 },
      { id: 'constipation', w: 1 },
      { id: 'pulse_surging', w: 1 }
    ]
  },
  柴苓汤_hf: {
    indicators: [
      { id: 'fever', w: 3 },
      { id: 'diarrhea', w: 3 },
      { id: 'difficult_urine', w: 3 },
      { id: 'thirst', w: 2 },
      { id: 'nausea', w: 2 },
      { id: 'alternating', w: 2 },
      { id: 'abdominal_fullness', w: 1 },
      { id: 'edema', w: 1 },
      { id: 'poor_appetite', w: 1 }
    ],
    contra: [
      { id: 'cold_limbs', w: 2 },
      { id: 'clear_urine', w: 1 }
    ]
  },
  防风通圣散_hf: {
    indicators: [
      { id: 'constipation', w: 3 },
      { id: 'itching', w: 3 },
      { id: 'chest_oppression', w: 2 },
      { id: 'bitter_mouth', w: 2 },
      { id: 'dizziness', w: 2 },
      { id: 'headache', w: 2 },
      { id: 'tongue_red', w: 2 },
      { id: 'dark_urine', w: 1 },
      { id: 'nasal', w: 1 },
      { id: 'spasm', w: 1 }
    ],
    contra: [
      { id: 'pulse_weak', w: 2 },
      { id: 'cold_limbs', w: 2 },
      { id: 'loose_stool', w: 2 }
    ]
  },
  黄连解毒汤_hf: {
    indicators: [
      { id: 'restlessness', w: 3 },
      { id: 'insomnia', w: 3 },
      { id: 'irritability', w: 3 },
      { id: 'tongue_red', w: 3 },
      { id: 'dry_mouth', w: 2 },
      { id: 'bitter_mouth', w: 2 },
      { id: 'delirium', w: 2 },
      { id: 'dark_urine', w: 1 },
      { id: 'bleeding', w: 1 }
    ],
    contra: [
      { id: 'cold_limbs', w: 2 },
      { id: 'loose_stool', w: 2 },
      { id: 'tongue_pale', w: 2 }
    ]
  },
  荆芥连翘汤_hf: {
    indicators: [
      { id: 'sore_throat', w: 3 },
      { id: 'itching', w: 3 },
      { id: 'nasal', w: 2 },
      { id: 'headache', w: 2 },
      { id: 'tongue_red', w: 2 },
      { id: 'fever', w: 2 },
      { id: 'dizziness', w: 1 },
      { id: 'insomnia', w: 1 }
    ],
    contra: [
      { id: 'cold_limbs', w: 2 },
      { id: 'pulse_weak', w: 1 }
    ]
  },
  六君子汤_hf: {
    indicators: [
      { id: 'poor_appetite', w: 3 },
      { id: 'fatigue', w: 3 },
      { id: 'nausea', w: 2 },
      { id: 'vomiting', w: 2 },
      { id: 'loose_stool', w: 2 },
      { id: 'abdominal_fullness', w: 1 },
      { id: 'dizziness', w: 1 },
      { id: 'weight_loss', w: 1 }
    ],
    contra: [
      { id: 'coat_yellow_greasy', w: 1 },
      { id: 'thirst_cold', w: 1 }
    ]
  },
  生脉散_hf: {
    indicators: [
      { id: 'spontaneous_sweat', w: 3 },
      { id: 'short_breath', w: 3 },
      { id: 'fatigue', w: 3 },
      { id: 'pulse_weak', w: 2 },
      { id: 'dizziness', w: 2 },
      { id: 'thirst', w: 1 },
      { id: 'palpitation', w: 1 }
    ],
    contra: [
      { id: 'fever', w: 1 },
      { id: 'coat_yellow_greasy', w: 1 }
    ]
  },
  十全大补汤_hf: {
    indicators: [
      { id: 'fatigue', w: 3 },
      { id: 'weight_loss', w: 3 },
      { id: 'poor_appetite', w: 2 },
      { id: 'dizziness', w: 2 },
      { id: 'palpitation', w: 1 },
      { id: 'night_sweat', w: 1 },
      { id: 'tidal_fever', w: 1 },
      { id: 'cold_limbs', w: 1 },
      { id: 'spermatorrhea', w: 1 }
    ],
    contra: [
      { id: 'fever', w: 2 },
      { id: 'coat_yellow_greasy', w: 2 }
    ]
  },
  温胆汤_hf: {
    indicators: [
      { id: 'nausea', w: 3 },
      { id: 'dizziness', w: 3 },
      { id: 'palpitation', w: 3 },
      { id: 'insomnia', w: 3 },
      { id: 'anxiety', w: 3 },
      { id: 'dreamy_sleep', w: 2 },
      { id: 'vomiting', w: 2 },
      { id: 'chest_oppression', w: 1 },
      { id: 'bitter_mouth', w: 1 }
    ],
    contra: [
      { id: 'cold_limbs', w: 1 },
      { id: 'tongue_pale', w: 1 }
    ]
  },
  五积散_hf: {
    indicators: [
      { id: 'aversion_cold', w: 3 },
      { id: 'abdominal_fullness', w: 3 },
      { id: 'no_sweat', w: 2 },
      { id: 'vomiting', w: 2 },
      { id: 'nausea', w: 2 },
      { id: 'body_ache', w: 2 },
      { id: 'abdominal_pain', w: 1 },
      { id: 'edema', w: 1 },
      { id: 'menstrual', w: 1 },
      { id: 'alternating', w: 1 }
    ],
    contra: [
      { id: 'fever', w: 1 },
      { id: 'yellow_sputum', w: 1 }
    ]
  },
  茯苓饮_hf: {
    indicators: [
      { id: 'epigastric_distention', w: 3 },
      { id: 'poor_appetite', w: 3 },
      { id: 'chest_oppression', w: 2 },
      { id: 'nausea', w: 2 },
      { id: 'borborygmus', w: 1 },
      { id: 'vomiting', w: 1 },
      { id: 'dizziness', w: 1 }
    ],
    contra: [
      { id: 'thirst_cold', w: 1 },
      { id: 'tongue_red', w: 1 }
    ]
  },
  八味解郁汤_hf: {
    indicators: [
      { id: 'cold_limbs', w: 3 },
      { id: 'throat_globus', w: 3 },
      { id: 'anxiety', w: 3 },
      { id: 'chest_oppression', w: 2 },
      { id: 'nausea', w: 2 },
      { id: 'pulse_wiry', w: 2 },
      { id: 'abdominal_pain', w: 1 },
      { id: 'insomnia', w: 1 }
    ],
    contra: [
      { id: 'fever', w: 1 },
      { id: 'tongue_red', w: 1 }
    ]
  },
  八味除烦汤_hf: {
    indicators: [
      { id: 'chest_oppression', w: 3 },
      { id: 'restlessness', w: 3 },
      { id: 'abdominal_fullness', w: 3 },
      { id: 'irritability', w: 2 },
      { id: 'insomnia', w: 2 },
      { id: 'palpitation', w: 1 },
      { id: 'nausea', w: 1 }
    ],
    contra: [
      { id: 'cold_limbs', w: 1 },
      { id: 'pulse_weak', w: 1 }
    ]
  },
  八味活血汤_hf: {
    indicators: [
      { id: 'chest_pain', w: 3 },
      { id: 'cold_limbs', w: 3 },
      { id: 'tongue_purple', w: 3 },
      { id: 'headache', w: 2 },
      { id: 'insomnia', w: 2 },
      { id: 'dysmenorrhea', w: 2 },
      { id: 'spasm', w: 1 }
    ],
    contra: [
      { id: 'bleeding', w: 2 },
      { id: 'pulse_weak', w: 1 }
    ]
  },

  // ── 手册补录的经方 ────────────────────────────────────
  柴胡桂枝干姜汤_hf: {
    six: '少阳',
    indicators: [
      { id: 'hypochondriac', w: 3 },
      { id: 'alternating', w: 3 },
      { id: 'thirst', w: 3 },
      { id: 'dry_mouth', w: 2 },
      { id: 'difficult_urine', w: 2 },
      { id: 'spontaneous_sweat', w: 2 },
      { id: 'irritability', w: 2 },
      { id: 'palpitation', w: 1 },
      { id: 'poor_appetite', w: 1 },
      { id: 'diarrhea', w: 1 }
    ],
    contra: [
      { id: 'cold_limbs', w: 1 },
      { id: 'tongue_pale', w: 1 }
    ]
  },
  附子泻心汤_hf: {
    six: '太阳',
    indicators: [
      { id: 'epigastric_distention', w: 3 },
      { id: 'aversion_cold', w: 3 },
      { id: 'spontaneous_sweat', w: 2 },
      { id: 'lethargy', w: 2 },
      { id: 'cold_limbs', w: 1 },
      { id: 'restlessness', w: 1 }
    ],
    contra: [
      { id: 'fever', w: 1 },
      { id: 'thirst_cold', w: 1 }
    ]
  },
  桂枝加附子汤_hf: {
    six: '太阳',
    indicators: [
      { id: 'spontaneous_sweat', w: 3 },
      { id: 'aversion_wind', w: 3 },
      { id: 'pulse_weak', w: 2 },
      { id: 'difficult_urine', w: 2 },
      { id: 'spasm', w: 2 },
      { id: 'cold_limbs', w: 1 },
      { id: 'fatigue', w: 1 }
    ],
    contra: [
      { id: 'no_sweat', w: 2 },
      { id: 'fever', w: 1 }
    ]
  },
  黄芩汤_hf: {
    six: '少阳',
    indicators: [
      { id: 'diarrhea', w: 3 },
      { id: 'abdominal_pain', w: 3 },
      { id: 'fever', w: 2 },
      { id: 'pulse_rapid', w: 2 },
      { id: 'mucus_stool', w: 1 },
      { id: 'thirst', w: 1 },
      { id: 'irritability', w: 1 }
    ],
    contra: [
      { id: 'cold_limbs', w: 2 },
      { id: 'clear_urine', w: 1 }
    ]
  },
  麻黄连翘赤小豆汤_hf: {
    six: '阳明',
    indicators: [
      { id: 'itching', w: 3 },
      { id: 'edema', w: 3 },
      { id: 'fever', w: 2 },
      { id: 'jaundice', w: 2 },
      { id: 'dark_urine', w: 1 },
      { id: 'nasal', w: 1 }
    ],
    contra: [
      { id: 'cold_limbs', w: 1 },
      { id: 'clear_urine', w: 1 }
    ]
  },
  小陷胸汤_hf: {
    six: '太阳',
    indicators: [
      { id: 'epigastric_pain', w: 3 },
      { id: 'yellow_sputum', w: 3 },
      { id: 'chest_oppression', w: 2 },
      { id: 'constipation', w: 2 },
      { id: 'bitter_mouth', w: 1 },
      { id: 'coat_yellow_greasy', w: 1 }
    ],
    contra: [
      { id: 'white_sputum', w: 2 },
      { id: 'cold_limbs', w: 1 }
    ]
  },
  续命汤_hf: {
    six: '杂病',
    indicators: [
      { id: 'numbness', w: 3 },
      { id: 'spasm', w: 3 },
      { id: 'orthopnea', w: 2 },
      { id: 'wheezing', w: 2 },
      { id: 'edema', w: 1 },
      { id: 'fatigue', w: 1 },
      { id: 'dizziness', w: 1 }
    ],
    contra: [
      { id: 'fever', w: 2 },
      { id: 'yellow_sputum', w: 1 }
    ]
  },
  栀子柏皮汤_hf: {
    six: '阳明',
    indicators: [
      { id: 'jaundice', w: 3 },
      { id: 'fever', w: 3 },
      { id: 'restlessness', w: 2 },
      { id: 'dark_urine', w: 2 },
      { id: 'bitter_mouth', w: 1 },
      { id: 'tongue_red', w: 1 }
    ],
    contra: [
      { id: 'cold_limbs', w: 2 },
      { id: 'loose_stool', w: 1 }
    ]
  },
  栀子厚朴汤_hf: {
    six: '阳明',
    indicators: [
      { id: 'irritability', w: 3 },
      { id: 'abdominal_fullness', w: 3 },
      { id: 'chest_oppression', w: 2 },
      { id: 'insomnia', w: 2 },
      { id: 'restlessness', w: 2 }
    ],
    contra: [
      { id: 'cold_limbs', w: 1 },
      { id: 'loose_stool', w: 1 }
    ]
  },
  竹叶石膏汤_hf: {
    six: '差后',
    indicators: [
      { id: 'poor_appetite', w: 3 },
      { id: 'fatigue', w: 3 },
      { id: 'fever', w: 2 },
      { id: 'weight_loss', w: 2 },
      { id: 'thirst', w: 2 },
      { id: 'night_sweat', w: 1 },
      { id: 'dry_heave', w: 1 },
      { id: 'hiccup', w: 1 }
    ],
    contra: [
      { id: 'cold_limbs', w: 2 },
      { id: 'loose_stool', w: 1 }
    ]
  }
}
