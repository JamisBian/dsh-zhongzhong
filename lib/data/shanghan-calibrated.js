// 宋本伤寒补遗方的人工校准（34 首）
//
// 这些方原先由王付【主治】自动推导指标（autoPattern: true，得分打 85 折），
// 但自动推导抓不到鉴别性的主线，会把「舌苔白」这类当成主症、也分不开同族方。
// 本文件逐方重写：主症 w=3、兼症 w=2、或然 w=1，并补相反见症。
//
// 依据：王付【主治】的中医病证描述 + 《仲圣方证合一要诀》的一句话方证。

export const SHANGHAN_CALIBRATION = {
  // ── 太阳 ────────────────────────────────────────────
  桂枝去芍药汤_sh: {
    indicators: [
      { id: 'chest_oppression', w: 3 },
      { id: 'aversion_wind', w: 3 },
      { id: 'spontaneous_sweat', w: 2 },
      { id: 'fever', w: 2 },
      { id: 'pulse_rapid', w: 2 },
      { id: 'aversion_cold', w: 1 }
    ],
    contra: [{ id: 'no_sweat', w: 2 }, { id: 'pulse_tight', w: 2 }]
  },
  桂枝去芍药加附子汤_sh: {
    indicators: [
      { id: 'cold_limbs', w: 3 },
      { id: 'chest_oppression', w: 3 },
      { id: 'pulse_weak', w: 3 },
      { id: 'aversion_wind', w: 2 },
      { id: 'spontaneous_sweat', w: 2 },
      { id: 'chill_body', w: 1 }
    ],
    contra: [{ id: 'no_sweat', w: 1 }, { id: 'fever', w: 1 }]
  },
  桂枝麻黄各半汤_sh: {
    indicators: [
      { id: 'face_red', w: 3 },
      { id: 'itching', w: 3 },
      { id: 'fever', w: 3 },
      { id: 'no_sweat', w: 2 },
      { id: 'aversion_cold', w: 2 },
      { id: 'headache', w: 1 }
    ],
    contra: [{ id: 'profuse_sweat', w: 2 }, { id: 'pulse_weak', w: 1 }]
  },
  桂枝二麻黄一汤_sh: {
    indicators: [
      { id: 'fever', w: 3 },
      { id: 'aversion_cold', w: 3 },
      { id: 'alternating', w: 3 },
      { id: 'spontaneous_sweat', w: 2 },
      { id: 'pulse_float', w: 1 },
      { id: 'headache', w: 1 }
    ],
    contra: [{ id: 'profuse_sweat', w: 2 }, { id: 'pulse_deep', w: 1 }]
  },
  桂枝二越婢一汤_sh: {
    indicators: [
      { id: 'fever', w: 3 },
      { id: 'thirst', w: 3 },
      { id: 'aversion_cold', w: 2 },
      { id: 'irritability', w: 2 },
      { id: 'dry_mouth', w: 1 },
      { id: 'pulse_float', w: 1 }
    ],
    contra: [{ id: 'cold_limbs', w: 2 }, { id: 'clear_urine', w: 1 }]
  },
  桂枝去桂加茯苓白术汤_sh: {
    indicators: [
      { id: 'epigastric_distention', w: 3 },
      { id: 'difficult_urine', w: 3 },
      { id: 'fever', w: 2 },
      { id: 'no_sweat', w: 2 },
      { id: 'headache', w: 1 },
      { id: 'loose_stool', w: 1 }
    ],
    contra: [{ id: 'profuse_sweat', w: 1 }, { id: 'thirst_cold', w: 1 }]
  },
  葛根加半夏汤_sh: {
    indicators: [
      { id: 'stiff_neck', w: 3 },
      { id: 'vomiting', w: 3 },
      { id: 'no_sweat', w: 2 },
      { id: 'aversion_cold', w: 2 },
      { id: 'fever', w: 1 },
      { id: 'diarrhea', w: 1 }
    ],
    contra: [{ id: 'spontaneous_sweat', w: 2 }, { id: 'pulse_weak', w: 1 }]
  },
  干姜附子汤_sh: {
    indicators: [
      { id: 'cold_limbs', w: 3 },
      { id: 'restlessness', w: 3 },
      { id: 'pulse_weak', w: 3 },
      { id: 'diarrhea', w: 2 },
      { id: 'chill_body', w: 2 },
      { id: 'lethargy', w: 1 }
    ],
    contra: [{ id: 'fever', w: 2 }, { id: 'thirst_cold', w: 2 }]
  },
  桂枝甘草汤_sh: {
    indicators: [
      { id: 'palpitation', w: 3 },
      { id: 'chest_oppression', w: 2 },
      { id: 'pulse_rapid', w: 2 },
      { id: 'spontaneous_sweat', w: 1 },
      { id: 'insomnia', w: 1 }
    ],
    contra: [{ id: 'cold_limbs', w: 1 }, { id: 'fever', w: 1 }]
  },
  芍药甘草附子汤_sh: {
    indicators: [
      { id: 'spasm', w: 3 },
      { id: 'cold_limbs', w: 3 },
      { id: 'pulse_weak', w: 2 },
      { id: 'chill_body', w: 1 },
      { id: 'joint_pain', w: 1 }
    ],
    contra: [{ id: 'fever', w: 2 }, { id: 'thirst_cold', w: 1 }]
  },
  茯苓四逆汤_sh: {
    indicators: [
      { id: 'cold_limbs', w: 3 },
      { id: 'restlessness', w: 3 },
      { id: 'pulse_weak', w: 3 },
      { id: 'diarrhea', w: 2 },
      { id: 'palpitation', w: 1 },
      { id: 'chill_body', w: 1 }
    ],
    contra: [{ id: 'fever', w: 2 }, { id: 'thirst_cold', w: 2 }]
  },
  茯苓甘草汤_sh: {
    indicators: [
      { id: 'palpitation', w: 3 },
      { id: 'thirst_no_drink', w: 3 },
      { id: 'difficult_urine', w: 2 },
      { id: 'epigastric_distention', w: 2 },
      { id: 'vomiting', w: 1 }
    ],
    contra: [{ id: 'thirst_cold', w: 2 }, { id: 'dry_mouth', w: 1 }]
  },
  栀子甘草豉汤_sh: {
    indicators: [
      { id: 'restlessness', w: 3 },
      { id: 'insomnia', w: 3 },
      { id: 'fatigue', w: 2 },
      { id: 'chest_oppression', w: 1 }
    ],
    contra: [{ id: 'cold_limbs', w: 1 }, { id: 'loose_stool', w: 2 }]
  },
  栀子生姜豉汤_sh: {
    indicators: [
      { id: 'vomiting', w: 3 },
      { id: 'restlessness', w: 3 },
      { id: 'nausea', w: 2 },
      { id: 'insomnia', w: 2 }
    ],
    contra: [{ id: 'cold_limbs', w: 1 }, { id: 'loose_stool', w: 2 }]
  },
  栀子干姜汤_sh: {
    indicators: [
      { id: 'diarrhea', w: 3 },
      { id: 'restlessness', w: 3 },
      { id: 'fever', w: 2 },
      { id: 'irritability', w: 2 },
      { id: 'chill_body', w: 2 }
    ],
    contra: [{ id: 'constipation', w: 2 }, { id: 'cold_limbs', w: 1 }]
  },
  大陷胸汤_sh: {
    indicators: [
      { id: 'epigastric_pain', w: 3 },
      { id: 'rigidity', w: 3 },
      { id: 'chest_oppression', w: 3 },
      { id: 'pulse_deep', w: 2 },
      { id: 'pulse_tight', w: 2 },
      { id: 'constipation', w: 2 },
      { id: 'spontaneous_sweat', w: 1 }
    ],
    contra: [
      { id: 'pulse_weak', w: 3 },
      { id: 'cold_limbs', w: 2 },
      { id: 'loose_stool', w: 2 }
    ]
  },
  柴胡加芒硝汤_sh: {
    indicators: [
      { id: 'hypochondriac', w: 3 },
      { id: 'tidal_fever', w: 3 },
      { id: 'constipation', w: 2 },
      { id: 'bitter_mouth', w: 1 },
      { id: 'dry_mouth', w: 1 },
      { id: 'irritability', w: 1 }
    ],
    contra: [{ id: 'diarrhea', w: 2 }, { id: 'cold_limbs', w: 2 }]
  },
  桂枝甘草龙骨牡蛎汤_sh: {
    indicators: [
      { id: 'restlessness', w: 3 },
      { id: 'palpitation', w: 3 },
      { id: 'insomnia', w: 2 },
      { id: 'spontaneous_sweat', w: 2 },
      { id: 'chest_oppression', w: 1 }
    ],
    contra: [{ id: 'fever', w: 1 }, { id: 'thirst_cold', w: 1 }]
  },
  抵当汤_sh: {
    indicators: [
      { id: 'lower_abdomen', w: 3 },
      { id: 'restlessness', w: 3 },
      { id: 'mass_abdomen', w: 2 },
      { id: 'clear_urine', w: 2 },
      { id: 'tongue_purple', w: 2 },
      { id: 'delirium', w: 1 }
    ],
    contra: [{ id: 'bleeding', w: 3 }, { id: 'pulse_weak', w: 2 }]
  },
  抵当丸_sh: {
    indicators: [
      { id: 'lower_abdomen', w: 3 },
      { id: 'mass_abdomen', w: 2 },
      { id: 'tongue_purple', w: 2 },
      { id: 'difficult_urine', w: 1 },
      { id: 'menstrual', w: 1 }
    ],
    contra: [{ id: 'bleeding', w: 3 }, { id: 'pulse_weak', w: 2 }]
  },
  文蛤散_sh: {
    indicators: [
      { id: 'thirst', w: 3 },
      { id: 'fever', w: 2 },
      { id: 'dark_urine', w: 1 },
      { id: 'itching', w: 1 }
    ],
    contra: [{ id: 'thirst_no_drink', w: 2 }, { id: 'cold_limbs', w: 1 }]
  },

  // ── 少阴 ────────────────────────────────────────────
  通脉四逆汤_sh: {
    indicators: [
      { id: 'cold_limbs', w: 3 },
      { id: 'pulse_weak', w: 3 },
      { id: 'diarrhea', w: 3 },
      { id: 'face_red', w: 2 },
      { id: 'chill_body', w: 2 },
      { id: 'vomiting', w: 1 }
    ],
    contra: [{ id: 'thirst_cold', w: 1 }, { id: 'tongue_red', w: 1 }]
  },
  白通汤_sh: {
    indicators: [
      { id: 'diarrhea', w: 3 },
      { id: 'cold_limbs', w: 3 },
      { id: 'pulse_weak', w: 3 },
      { id: 'face_red', w: 2 },
      { id: 'difficult_urine', w: 1 }
    ],
    contra: [{ id: 'thirst_cold', w: 1 }, { id: 'tongue_red', w: 1 }]
  },
  白通加猪胆汁汤_sh: {
    indicators: [
      { id: 'diarrhea', w: 3 },
      { id: 'cold_limbs', w: 3 },
      { id: 'pulse_weak', w: 3 },
      { id: 'dry_heave', w: 2 },
      { id: 'restlessness', w: 1 }
    ],
    contra: [{ id: 'thirst_cold', w: 1 }, { id: 'tongue_red', w: 1 }]
  },
  附子汤_sh: {
    indicators: [
      { id: 'body_ache', w: 3 },
      { id: 'joint_pain', w: 3 },
      { id: 'cold_limbs', w: 2 },
      { id: 'back_ache', w: 2 },
      { id: 'chill_body', w: 2 },
      { id: 'pulse_deep', w: 2 }
    ],
    contra: [{ id: 'fever', w: 2 }, { id: 'thirst_cold', w: 1 }]
  },
  桃花汤_sh: {
    indicators: [
      { id: 'diarrhea', w: 3 },
      { id: 'mucus_stool', w: 3 },
      { id: 'abdominal_pain', w: 2 },
      { id: 'clear_urine', w: 1 },
      { id: 'tongue_pale', w: 1 },
      { id: 'pulse_slow', w: 1 }
    ],
    contra: [{ id: 'fever', w: 2 }, { id: 'dark_urine', w: 1 }, { id: 'thirst_cold', w: 1 }]
  },
  甘草汤_sh: {
    indicators: [
      { id: 'sore_throat', w: 3 },
      { id: 'dry_mouth', w: 2 },
      { id: 'tongue_red', w: 1 }
    ],
    contra: [{ id: 'cold_limbs', w: 1 }, { id: 'white_sputum', w: 1 }]
  },
  苦酒汤_sh: {
    indicators: [
      { id: 'sore_throat', w: 3 },
      { id: 'yellow_sputum', w: 2 },
      { id: 'dry_mouth', w: 1 },
      { id: 'tongue_red', w: 1 }
    ],
    contra: [{ id: 'cold_limbs', w: 1 }, { id: 'white_sputum', w: 1 }]
  },
  桔梗汤_sh: {
    indicators: [
      { id: 'cough', w: 3 },
      { id: 'yellow_sputum', w: 3 },
      { id: 'sore_throat', w: 2 },
      { id: 'chest_oppression', w: 1 },
      { id: 'pulse_rapid', w: 1 }
    ],
    contra: [{ id: 'white_sputum', w: 2 }, { id: 'cold_limbs', w: 1 }]
  },

  // ── 厥阴 / 太阴 / 霍乱 / 差后 ─────────────────────────
  麻黄升麻汤_sh: {
    indicators: [
      { id: 'sore_throat', w: 3 },
      { id: 'diarrhea', w: 3 },
      { id: 'cold_limbs', w: 2 },
      { id: 'yellow_sputum', w: 2 },
      { id: 'dry_mouth', w: 1 },
      { id: 'pulse_deep', w: 1 }
    ],
    contra: [{ id: 'fever', w: 1 }, { id: 'pulse_surging', w: 1 }]
  },
  桂枝加芍药汤_sh: {
    indicators: [
      { id: 'abdominal_pain', w: 3 },
      { id: 'abdominal_fullness', w: 3 },
      { id: 'diarrhea', w: 1 },
      { id: 'pulse_wiry', w: 1 },
      { id: 'poor_appetite', w: 1 }
    ],
    contra: [{ id: 'rigidity', w: 2 }, { id: 'constipation', w: 2 }]
  },
  四逆加人参汤_sh: {
    indicators: [
      { id: 'cold_limbs', w: 3 },
      { id: 'pulse_weak', w: 3 },
      { id: 'diarrhea', w: 2 },
      { id: 'fatigue', w: 2 },
      { id: 'chill_body', w: 1 }
    ],
    contra: [{ id: 'fever', w: 2 }, { id: 'thirst_cold', w: 1 }]
  },
  通脉四逆加猪胆汁汤_sh: {
    indicators: [
      { id: 'cold_limbs', w: 3 },
      { id: 'pulse_weak', w: 3 },
      { id: 'vomiting', w: 2 },
      { id: 'diarrhea', w: 2 },
      { id: 'spasm', w: 1 },
      { id: 'spontaneous_sweat', w: 1 }
    ],
    contra: [{ id: 'fever', w: 2 }, { id: 'thirst_cold', w: 1 }]
  },
  枳实栀子豉汤_sh: {
    indicators: [
      { id: 'restlessness', w: 3 },
      { id: 'abdominal_fullness', w: 2 },
      { id: 'fever', w: 2 },
      { id: 'insomnia', w: 1 },
      { id: 'poor_appetite', w: 1 }
    ],
    contra: [{ id: 'cold_limbs', w: 2 }, { id: 'loose_stool', w: 2 }]
  }
}
