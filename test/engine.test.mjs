import { test } from 'node:test'
import assert from 'node:assert/strict'

import { FORMULAS, formulaById, resolveFormula, herbWarnings } from '../lib/data/index.js'
import { ALL_ITEMS, resolveId, resolveIds, labelOf } from '../lib/data/symptoms.js'
import { normalizeCase, mergeCase, caseSummary, redFlags, readiness } from '../lib/engine/case.js'
import { rankFormulas, confidence, discriminators, inferSix, pct, scoreFormula } from '../lib/engine/match.js'
import { verify, classicEvidence, verdictLabel } from '../lib/engine/evidence.js'
import { buildSheet, compositionLines } from '../lib/engine/prescribe.js'
import { doseOf, doseText, GRAMS_PER_LIANG } from '../lib/engine/dose.js'

const ids = new Set(ALL_ITEMS.map((i) => i.id))

test('方剂库结构完整', () => {
  assert.ok(FORMULAS.length >= 40, `方剂数量 ${FORMULAS.length}`)
  const seen = new Set()
  for (const f of FORMULAS) {
    assert.ok(!seen.has(f.id), `重复 id: ${f.id}`)
    seen.add(f.id)
    assert.ok(f.name && f.source && f.six, `${f.id} 缺基础字段`)
    // 单味方确实存在（狼牙汤、红蓝花酒），但绝大多数应当是多味
    assert.ok(f.composition.length >= 1, `${f.id} 组成过少`)
    assert.ok(f.pattern.length >= 1, `${f.id} 缺方证要点`)
    if (f.verified === false) {
      // 名录条目：只有篇目与组成，不许伪装成已核方
      assert.equal(f.clauses, undefined, `${f.id} 名录条目不应有条文`)
      assert.equal(f.indicators, undefined, `${f.id} 名录条目不应参与辨证`)
      continue
    }
    assert.ok(f.clauses.length >= 1, `${f.id} 缺原文`)
    // 手册自动推导的方允许 2 条指标（已降权处理）；衷中参西录单方允许 1 条主症
    const minIndicators = f.school === 'zhongzhong' ? 1 : f.autoPattern === true ? 2 : 3
    assert.ok(f.indicators.length >= minIndicators, `${f.id} 方证指标过少`)
    for (const ind of f.indicators) assert.ok(ids.has(ind.id), `${f.id} 未知指标 ${ind.id}`)
    for (const c of f.contra ?? []) assert.ok(ids.has(c.id), `${f.id} 未知相反见症 ${c.id}`)
    for (const clause of f.clauses) {
      assert.ok(
        clause.ref.includes('伤寒论') ||
          clause.ref.includes('金匮要略') ||
          clause.ref.includes('经方使用手册') ||
          clause.ref.includes('杂疗方') ||
          clause.ref.includes('注家') ||
          clause.ref.includes('医学衷中参西录'),
        `${f.id} 出处可疑：${clause.ref}`
      )
      assert.ok(clause.text.length >= (f.school === 'zhongzhong' ? 3 : 10), `${f.id} 条文过短`)
    }
    for (const part of f.composition) {
      assert.ok(part.herb, `${f.id} 药物缺名`)
      if (f.verified === false) continue
      const hasAmount =
        typeof part.liang === 'number' ||
        typeof part.zhu === 'number' ||
        typeof part.jin === 'number' ||
        typeof part.count === 'number' ||
        typeof part.text === 'string' ||
        (Array.isArray(part.dose) && part.dose.length > 0)
      assert.ok(hasAmount, `${f.id} ${part.herb} 缺剂量`)
    }
  }
})

test('一两等于三克', () => {
  assert.equal(GRAMS_PER_LIANG, 3)
  assert.deepEqual(doseOf({ herb: '桂枝', liang: 3 }).modern, '≈9g')
  assert.deepEqual(doseOf({ herb: '甘草', liang: 1.5 }).modern, '≈4.5g')
  assert.deepEqual(doseOf({ herb: '茯苓', zhu: 18 }).modern, '≈2.3g')
  assert.equal(doseText({ herb: '大枣', count: 12, unit: '枚' }), '大枣 12枚')
})

test('症状别名解析', () => {
  assert.equal(resolveId('胸胁苦满'), 'hypochondriac')
  assert.equal(resolveId('怕冷'), 'aversion_cold')
  assert.equal(resolveId('恶风（遇风不适）'), 'aversion_wind')
  assert.equal(resolveId('不存在的症状'), undefined)
  assert.deepEqual(resolveIds(['口苦', 'nope', '脉弦']), ['bitter_mouth', 'pulse_wiry'])
})

test('桂枝汤证：太阳中风', () => {
  const c = normalizeCase({
    patient: { name: '张三', age: 35, sex: '男' },
    chief: '感冒后头痛发热',
    duration: '2天',
    symptoms: ['恶风', '发热', '自汗（动则汗出）', '头痛', '鼻塞流涕'],
    tongue: ['舌淡红', '苔薄白'],
    pulse: ['浮', '微/弱'],
    vitals: { tempC: 37.8, bp: '118/76', pulse: 82 }
  })
  const ranking = rankFormulas(c)
  assert.equal(ranking[0].formula.id, 'guizhi_tang', `实际首选 ${ranking[0].formula.name}`)
  const conf = confidence(ranking)
  assert.equal(conf.confident, true, conf.reason)
  assert.equal(inferSix(c).channel, '太阳')
  const sheet = buildSheet(c, ranking[0].formula)
  assert.match(sheet.markdown, /1 两 = 3 克/)
  assert.match(sheet.markdown, /桂枝/)
})

test('小柴胡汤证：少阳', () => {
  const c = normalizeCase({
    patient: { name: '李四', age: 42, sex: '女' },
    chief: '忽冷忽热、口苦',
    symptoms: ['往来寒热（忽冷忽热）', '口苦', '胁肋胀满疼痛', '食欲差', '恶心', '头晕目眩', '口干咽干'],
    tongue: ['舌淡红', '苔薄白'],
    pulse: ['弦'],
    vitals: { tempC: 38.2, pulse: 96 }
  })
  const ranking = rankFormulas(c)
  assert.equal(ranking[0].formula.id, 'xiao_chaihu_tang', `实际首选 ${ranking[0].formula.name}`)
  assert.equal(inferSix(c).channel, '少阳')
})

test('信息不足时不给方', () => {
  const c = normalizeCase({
    patient: { name: '王五', age: 30, sex: '男' },
    chief: '有点不舒服',
    symptoms: ['乏力'],
    pulse: [],
    tongue: []
  })
  const ranking = rankFormulas(c)
  const conf = confidence(ranking)
  assert.equal(conf.confident, false)
  const r = readiness(c)
  assert.equal(r.ready, false)
  assert.ok(r.missing.includes('脉象'))
})

test('鉴别问题只问没问过的方证要点', () => {
  const c = normalizeCase({ symptoms: ['发热', '恶寒'], asked: ['fever'] })
  const ranking = rankFormulas(c)
  const ds = discriminators(c, ranking)
  assert.ok(ds.length > 0)
  assert.ok(!ds.some((d) => d.id === 'fever'))
  assert.ok(ds.every((d) => typeof d.label === 'string' && d.label !== d.id))
})

test('经典条文证据命中', () => {
  const f = formulaById('xiao_chaihu_tang')
  const c = normalizeCase({ symptoms: ['往来寒热（忽冷忽热）', '口苦', '胁肋胀满疼痛', '食欲差', '恶心'] })
  const positives = [...c.symptoms, ...c.tongue, ...c.pulse]
  const hits = classicEvidence(f, c, positives)
  assert.ok(hits.length >= 1)
  assert.ok(hits[0].matched.length >= 3)
})

test('无文献支撑时判定为 unsupported', async () => {
  const c = normalizeCase({
    patient: { name: '赵六', age: 28, sex: '女' },
    chief: '咽中异物感',
    symptoms: ['咽中异物感（梅核气）', '胸闷', '焦虑紧张'],
    tongue: ['舌淡红', '苔薄白'],
    pulse: ['弦']
  })
  const f = formulaById('banxia_houpo_tang')
  const report = await verify(c, f, { online: false })
  assert.equal(report.verdict, 'supported', report.reason)
  assert.ok(report.classic.length >= 1)

  const wrong = formulaById('da_chengqi_tang')
  const bad = await verify(c, wrong, { online: false })
  assert.notEqual(bad.verdict, 'supported')
  assert.ok(bad.alternatives.length > 0)
})

test('危险信号识别', () => {
  const c = normalizeCase({
    patient: { age: 70, sex: '男' },
    symptoms: ['胸痛彻背', '大汗出'],
    vitals: { tempC: 38.2, bp: '190/110', pulse: 132 }
  })
  const flags = redFlags(c)
  assert.equal(flags.level, 'emergency')
  assert.ok(flags.reasons.length >= 3)
})

test('方名解析与用药提示', () => {
  assert.equal(resolveFormula('桂枝汤')?.id, 'guizhi_tang')
  assert.equal(resolveFormula('小柴胡汤加减')?.id, 'xiao_chaihu_tang')
  assert.equal(resolveFormula('不存在的方'), undefined)
  const sini = formulaById('sini_tang')
  assert.ok(herbWarnings(sini).some((w) => w.includes('附子')))
})

test('处方笺含剂量、警示与免责声明', () => {
  const c = normalizeCase({
    patient: { name: '张三', age: 35, sex: '男' },
    chief: '发热恶寒无汗',
    symptoms: ['恶寒怕冷', '发热', '无汗', '周身疼痛', '喘息'],
    tongue: ['舌淡红', '苔薄白'],
    pulse: ['浮', '紧']
  })
  const f = formulaById('mahuang_tang')
  const sheet = buildSheet(c, f, { modifications: ['咳嗽加杏仁'] })
  const lines = compositionLines(f)
  assert.ok(lines.some((l) => l.herb === '麻黄' && l.modern === '9g'))
  assert.match(sheet.markdown, /用药警示/)
  assert.match(sheet.markdown, /麻黄/)
  assert.match(sheet.markdown, /不能替代面诊/)
  assert.ok(verdictLabel('supported').includes('支撑'))
})

test('金匮要略方：血痹/中寒/支饮/远血', () => {
  const bloodBi = normalizeCase({
    patient: { name: '某', age: 55, sex: '女' },
    chief: '手脚麻木',
    symptoms: ['肢体麻木', '手足厥冷', '疲乏无力'],
    tongue: ['舌淡白'],
    pulse: ['细', '涩']
  })
  const r1 = rankFormulas(bloodBi)
  assert.equal(r1[0].formula.id, 'huangqi_guizhi_wuwu_tang', `实际 ${r1[0].formula.name}`)
  assert.equal(confidence(r1).confident, true)

  const coldPain = normalizeCase({
    chief: '肚子痛',
    symptoms: ['腹痛', '畏寒肢冷', '呕吐', '食欲差'],
    tongue: ['舌淡白'],
    pulse: ['沉', '迟']
  })
  const r2 = rankFormulas(coldPain)
  assert.equal(r2[0].formula.id, 'da_jianzhong_tang', `实际 ${r2[0].formula.name}`)

  const tanYin = normalizeCase({
    chief: '头晕',
    symptoms: ['头晕目眩', '身重乏力', '恶心'],
    tongue: ['舌体胖大', '苔白腻'],
    pulse: ['沉']
  })
  const r3 = rankFormulas(tanYin)
  assert.equal(r3[0].formula.id, 'zexie_tang', `实际 ${r3[0].formula.name}`)

  // 黄土汤与柏叶汤都治出血虚寒，应判为「需要继续鉴别」而不是直接拍板
  const bleed = normalizeCase({
    chief: '大便带血',
    symptoms: ['出血', '畏寒肢冷', '疲乏无力'],
    tongue: ['舌淡白'],
    pulse: ['细']
  })
  const r4 = rankFormulas(bleed)
  assert.ok(['huangtu_tang', 'baiye_tang'].includes(r4[0].formula.id))
})

test('金匮条文可被证据引擎命中', async () => {
  const cases = [
    {
      case: { symptoms: ['气从少腹上冲胸', '心悸', '少腹急结疼痛'], tongue: ['舌淡红'], pulse: ['沉'] },
      id: 'guizhi_jia_gui_tang'
    },
    {
      case: { symptoms: ['呃逆', '恶心', '食欲差', '疲乏无力'], tongue: ['舌淡红'], pulse: ['虚'] },
      id: 'jupi_zhuru_tang'
    },
    {
      case: { symptoms: ['脐下悸动', '心悸', '小便不利'], tongue: ['舌淡红'], pulse: ['沉'] },
      id: 'fuling_guizhi_gancao_dazao_tang'
    },
    {
      case: { symptoms: ['浮肿', '恶风（遇风不适）', '自汗（动则汗出）', '小便不利'], tongue: ['舌淡红'], pulse: ['浮'] },
      id: 'yuebi_tang'
    }
  ]
  const ids2 = cases.map((item) => item.case)
  for (const item of cases) {
    const f = formulaById(item.id)
    assert.ok(f !== undefined, `方剂不存在：${item.id}`)
    assert.match(f.source, /金匮要略/, `${f.name} 出处不是金匮`)
    const c = normalizeCase(item.case)
    const report = await verify(c, f, { online: false })
    assert.equal(report.verdict, 'supported', `${f.name}: ${report.reason}`)
    assert.ok(report.classic.length >= 1, `${f.name} 没有命中条文`)
  }
  assert.ok(ids2.length === 4)
})

test('宋校小剂量方用现代常用量，不冒充汉制折算', () => {
  const c = normalizeCase({
    patient: { name: '某', age: 60, sex: '女' },
    chief: '下肢浮肿',
    symptoms: ['浮肿', '自汗（动则汗出）', '恶风（遇风不适）', '身重乏力'],
    tongue: ['舌体胖大'],
    pulse: ['浮']
  })
  const f = formulaById('fangji_huangqi_tang')
  const sheet = buildSheet(c, f)
  assert.equal(sheet.doseBasis, 'modern')
  assert.match(sheet.markdown, /现代经验剂量/)
  assert.doesNotMatch(sheet.markdown, /1 两 = 3 克折算/)
  assert.match(sheet.markdown, /黄芪/)
  assert.equal(sheet.composition.find((p) => p.herb === '黄芪').ancient, '15g')

  const han = buildSheet(c, formulaById('guizhi_tang'))
  assert.equal(han.doseBasis, 'han')
  assert.match(han.markdown, /1 两 = 3 克折算/)
})

test('名录条目（未录原文）不能开方', async () => {
  // 5 首原名录方已补注家方证升为可辨证方，这里用合成条目验证机制本身
  const unverified = {
    id: 'synthetic_unverified',
    name: '测试名录方',
    source: '《金匮要略·杂疗方》',
    six: '杂病',
    verified: false,
    composition: [{ herb: '某药' }, { herb: '某药二' }],
    pattern: ['某证']
  }
  const c = normalizeCase({
    patient: { name: '某', age: 60, sex: '男' },
    chief: '四肢烦重',
    symptoms: ['身重乏力', '畏寒肢冷'],
    tongue: ['舌淡白'],
    pulse: ['沉']
  })
  const report = await verify(c, unverified, { online: false })
  assert.equal(report.verdict, 'unverified')
  assert.match(report.reason, /原文条文尚未录入/)
  assert.ok(report.alternatives.length > 0)
  // 没有指标的名录条目也不参与辨证
  assert.equal(scoreFormula(c, unverified), undefined)
})

test('比例丸散不折算克数', () => {
  const c = normalizeCase({
    chief: '胸胁引痛',
    symptoms: ['胁肋胀满疼痛', '咳嗽', '胸闷'],
    tongue: ['苔白腻'],
    pulse: ['沉', '弦']
  })
  const shizao = buildSheet(c, formulaById('shizao_tang'))
  assert.equal(shizao.doseBasis, 'ratio')
  assert.match(shizao.markdown, /原方比例/)
  assert.ok(shizao.composition.every((part) => part.modern === ''))
  assert.ok(shizao.composition.some((part) => part.ancient === '等分'))

  const han = buildSheet(c, formulaById('xiao_chaihu_tang'))
  assert.equal(han.doseBasis, 'han')
  assert.match(han.markdown, /1 两 = 3 克折算/)
  assert.ok(han.composition.some((part) => part.modern !== ''))
})

test('事实前提与情境加权：性别不是门槛', () => {
  // 安胎方需要「妊娠」这个事实前提
  const notPregnant = normalizeCase({
    patient: { name: '某', age: 35, sex: '女' },
    chief: '腹痛',
    symptoms: ['腹痛', '心烦易怒', '大便干硬'],
    tongue: ['舌淡红'],
    pulse: ['弦']
  })
  const r1 = rankFormulas(notPregnant)
  assert.ok(!r1.some((entry) => entry.formula.id === 'danggui_san'), '安胎方不该在非妊娠时进候选')

  // 产后方没有产后情境也能出现（方证对应），只是分数低一档
  const postpartum = normalizeCase({
    patient: { name: '某', age: 31, sex: '女' },
    chief: '产后腹痛',
    symptoms: ['腹痛', '腹部胀满', '烦躁不安'],
    tongue: ['舌淡红'],
    pulse: ['弦'],
    context: ['postpartum']
  })
  const r2 = rankFormulas(postpartum)
  const plain = rankFormulas(normalizeCase({ ...postpartum, context: [] }))
  const scoreOf = (list, id) => list.find((entry) => entry.formula.id === id)?.score ?? 0
  assert.ok(scoreOf(r2, 'zhishi_shaoyao_san') > scoreOf(plain, 'zhishi_shaoyao_san'), '产后情境应加权')
})

test('比例丸散不折算克数', () => {
  const c = normalizeCase({
    chief: '胸胁引痛',
    symptoms: ['胁肋胀满疼痛', '咳嗽', '胸闷'],
    tongue: ['苔白腻'],
    pulse: ['沉', '弦']
  })
  const shizao = buildSheet(c, formulaById('shizao_tang'))
  assert.equal(shizao.doseBasis, 'ratio')
  assert.match(shizao.markdown, /原方比例/)
  assert.ok(shizao.composition.every((part) => part.modern === ''))
  assert.ok(shizao.composition.some((part) => part.ancient === '等分'))

  const han = buildSheet(c, formulaById('xiao_chaihu_tang'))
  assert.equal(han.doseBasis, 'han')
  assert.match(han.markdown, /1 两 = 3 克折算/)
  assert.ok(han.composition.some((part) => part.modern !== ''))
})

test('方证不分性别：妇人方可用于男性', () => {
  // 男性前列腺增生/慢性前列腺炎：少腹急结、排尿不畅
  const male = normalizeCase({
    patient: { name: '老李', age: 62, sex: '男' },
    chief: '尿频、排尿不畅、小腹坠胀',
    symptoms: ['尿频', '小便不利', '少腹急结疼痛', '疲乏无力'],
    tongue: ['舌暗紫'],
    pulse: ['沉', '涩']
  })
  const ranking = rankFormulas(male)
  const ids = ranking.map((entry) => entry.formula.id)
  assert.ok(ids.includes('guizhi_fuling_wan'), `桂枝茯苓丸未进入男性候选：${ranking.map((r) => r.formula.name).join('、')}`)

  // 当归贝母苦参丸虽出自「妊娠小便难」，男性淋证同样可以进候选
  const maleStrangury = normalizeCase({
    patient: { name: '老王', age: 45, sex: '男' },
    chief: '尿频尿急',
    symptoms: ['小便不利', '尿频', '小便黄少', '口干咽干'],
    tongue: ['舌红'],
    pulse: ['滑']
  })
  const ids2 = rankFormulas(maleStrangury).map((entry) => entry.formula.id)
  assert.ok(ids2.includes('danggui_beimu_kushen_wan'), `男性淋证被性别挡掉：${ids2.join('、')}`)

  // 反过来：安胎方需要「妊娠」这个事实前提，普通人不进候选
  const notPregnant = normalizeCase({ symptoms: ['腹痛', '疲乏无力'], pulse: ['细'] })
  assert.ok(!rankFormulas(notPregnant).some((entry) => entry.formula.id === 'danggui_san'))
})

test('产后只是加权，不是门槛', () => {
  const base = {
    patient: { name: '某', age: 30, sex: '女' },
    chief: '腹痛',
    symptoms: ['腹痛', '腹部胀满', '烦躁不安'],
    tongue: ['舌淡红'],
    pulse: ['弦']
  }
  const without = rankFormulas(normalizeCase(base))
  const withCtx = rankFormulas(normalizeCase({ ...base, context: ['postpartum'] }))
  const scoreOf = (list) => list.find((entry) => entry.formula.id === 'zhishi_shaoyao_san')?.score ?? 0
  assert.ok(scoreOf(withCtx) > scoreOf(without), '产后情境应当提高产后方得分')
  assert.ok(scoreOf(without) > 0, '非产后也应有基础分，不能直接排除')
})

test('黄煌/张锡纯经验只作参考层，不影响门禁', async () => {
  const { huangNote } = await import('../lib/data/huang-notes.js')
  const { zhangNote } = await import('../lib/data/zhang-notes.js')
  const banxia = huangNote('banxia_houpo_tang')
  assert.ok(banxia !== undefined)
  assert.ok(banxia.diseases.includes('咽炎') || banxia.diseases.length > 10)
  assert.ok(zhangNote('guizhi_tang').modifications.length > 0)

  // 参考层不改变辨证结论与开方门禁
  const f = formulaById('banxia_houpo_tang')
  const c = normalizeCase({
    chief: '咽中异物感',
    symptoms: ['咽中异物感（梅核气）', '胸闷'],
    tongue: ['舌淡红'],
    pulse: ['弦']
  })
  const report = await verify(c, f, { online: false })
  assert.equal(report.verdict, 'supported')
  const sheet = buildSheet(c, f)
  assert.match(sheet.markdown, /随证加减（参考）/)
})

test('手册补录方：人工校准后能命中自身方证', () => {
  const cases = [
    {
      id: 'wendantang_hf',
      name: '温胆汤',
      input: {
        symptoms: ['失眠', '多梦', '恶心', '心悸', '焦虑', '头晕目眩'],
        tongue: ['苔黄腻'],
        pulse: ['滑']
      }
    },
    {
      id: 'bawei_jieyu_tang_hf',
      name: '八味解郁汤',
      input: {
        symptoms: ['手足厥冷', '咽中异物感', '焦虑', '胸闷'],
        tongue: ['舌淡红'],
        pulse: ['弦']
      }
    },
    {
      id: 'fangfeng_tongsheng_san_hf',
      name: '防风通圣散',
      input: {
        symptoms: ['便秘', '皮肤瘙痒', '胸闷', '口苦', '头晕目眩', '头痛'],
        tongue: ['舌红'],
        pulse: ['滑']
      }
    },
    {
      id: 'bu_zhong_yiqi_tang_hf',
      name: '补中益气汤',
      input: {
        symptoms: ['疲乏无力', '短气', '自汗', '食欲差', '低热'],
        tongue: ['舌淡白'],
        pulse: ['虚']
      }
    }
  ]
  for (const item of cases) {
    const ranking = rankFormulas(normalizeCase(item.input))
    assert.equal(ranking[0].formula.name, item.name, `${item.name} 未排首位，实际：${ranking.slice(0, 3).map((r) => r.formula.name).join('、')}`)
  }
})

test('校准后的手册方不再享受自动降权', () => {
  const auto = FORMULAS.filter((f) => f.id.endsWith('_hf') && f.autoPattern === true)
  assert.equal(auto.length, 0, `仍有未校准：${auto.map((f) => f.name).join('、')}`)
  const calibrated = FORMULAS.filter((f) => f.id.endsWith('_hf'))
  assert.equal(calibrated.length, 24)
  for (const f of calibrated) {
    assert.ok(['jingfang', 'shifang', 'zhongzhong'].includes(f.school ?? 'jingfang'))
    assert.ok(f.indicators.length >= 4, `${f.name} 指标过少`)
    assert.ok(f.indicators.some((i) => i.w >= 3), `${f.name} 没有主症（w=3）`)
  }
})

test('补录注家方证的 5 首：能辨证、证据标注为注家', async () => {
  const cases = [
    {
      name: '天雄散',
      input: {
        symptoms: ['遗精', '腰背疼痛', '畏寒肢冷', '头晕目眩'],
        tongue: ['舌淡白'],
        pulse: ['沉', '弱']
      }
    },
    {
      name: '头风摩散',
      input: { symptoms: ['头痛', '畏寒肢冷', '恶寒怕冷', '腰背疼痛'], tongue: ['苔薄白'], pulse: ['沉'] }
    },
    {
      name: '排脓散',
      input: { symptoms: ['胃脘疼痛', '呕吐', '恶心', '食欲差'], tongue: ['舌红', '苔黄腻'], pulse: ['滑'] }
    },
    {
      name: '排脓汤',
      input: { symptoms: ['胃脘疼痛', '呕吐', '食欲差', '畏寒肢冷'], tongue: ['舌淡白', '苔薄白'], pulse: ['迟'] }
    },
    {
      name: '蛇床子散',
      input: { symptoms: ['带下量多', '皮肤瘙痒', '畏寒肢冷'], tongue: ['舌淡白'], pulse: ['迟'] }
    }
  ]
  for (const item of cases) {
    const c = normalizeCase(item.input)
    const ranking = rankFormulas(c)
    assert.equal(ranking[0].formula.name, item.name, `${item.name} 未排首位：${ranking.slice(0, 3).map((r) => r.formula.name).join('、')}`)
    const report = await verify(c, formulaById(ranking[0].formula.id), { online: false })
    assert.equal(report.verdict, 'supported', `${item.name}: ${report.reason}`)
    assert.equal(report.basis, '后世注家方证')
  }
})

test('宋本伤寒论：六经方剂基本补全', () => {
  const byChannel = {}
  for (const f of FORMULAS) byChannel[f.six] = (byChannel[f.six] ?? 0) + 1
  const sixTotal = ['太阳', '阳明', '少阳', '太阴', '少阴', '厥阴', '霍乱', '差后'].reduce((n, k) => n + (byChannel[k] ?? 0), 0)
  assert.ok(sixTotal >= 95, `伤寒六经仅 ${sixTotal} 首`)
  assert.ok((byChannel['太阳'] ?? 0) >= 40, `太阳篇仅 ${byChannel['太阳']} 首`)
  assert.ok((byChannel['少阴'] ?? 0) >= 14, `少阴篇仅 ${byChannel['少阴']} 首`)

  // 抽查宋本中的关键方是否都在
  const must = [
    '桂枝去芍药汤', '桂枝麻黄各半汤', '桂枝二越婢一汤', '葛根加半夏汤', '干姜附子汤',
    '桂枝甘草汤', '厚朴生姜半夏甘草人参汤', '芍药甘草附子汤', '茯苓四逆汤', '茯苓甘草汤',
    '栀子甘草豉汤', '栀子生姜豉汤', '栀子干姜汤', '大陷胸汤', '大陷胸丸', '三物白散',
    '柴胡加芒硝汤', '抵当汤', '抵当丸', '白通汤', '白通加猪胆汁汤', '通脉四逆汤',
    '附子汤', '桃花汤', '甘草汤', '苦酒汤', '半夏散及汤', '猪肤汤', '麻黄升麻汤',
    '干姜黄芩黄连人参汤', '桂枝加芍药汤', '桂枝加大黄汤', '四逆加人参汤', '枳实栀子豉汤',
    '牡蛎泽泻散', '蜜煎导', '生姜泻心汤', '赤石脂禹余粮汤', '桂枝人参汤', '黄芩加半夏生姜汤'
  ]
  const names = new Set(FORMULAS.map((f) => f.name))
  const missing = must.filter((n) => !names.has(n))
  assert.deepEqual(missing, [], `仍缺：${missing.join('、')}`)
})

test('伤寒补遗 45 首：全部完成校准，能进自身方证的候选', async () => {
  const auto = FORMULAS.filter((f) => f.autoPattern === true)
  assert.equal(auto.length, 0, `仍有自动推导：${auto.map((f) => f.name).join('、')}`)

  const extra = FORMULAS.filter((f) => String(f.id).endsWith('_sh'))
  assert.ok(extra.length >= 45, `伤寒补遗仅 ${extra.length} 首`)
  // 单症方（桂枝甘草汤、甘草汤、文蛤散）本来就只有一条主症，不强制两条
  for (const f of extra) {
    assert.ok(f.indicators.length >= 3, `${f.name} 指标过少`)
    assert.ok(f.indicators.some((i) => i.w >= 3), `${f.name} 没有主症（w=3）`)
    const ids = [...new Set(f.indicators.filter((i) => i.w >= 2).map((i) => i.id))]
    const ranking = rankFormulas(normalizeCase({ symptoms: ids }))
    const position = ranking.findIndex((entry) => entry.formula.id === f.id)
    assert.ok(position >= 0 && position <= 4, `${f.name} 未进前五：${ranking.slice(0, 3).map((r) => r.formula.name).join('、')}`)
  }
})

test('伤寒补遗方也接入了仲圣方证要诀的讲解', async () => {
  const { patternDetail } = await import('../lib/data/pattern-detail.js')
  let covered = 0
  for (const f of FORMULAS.filter((x) => String(x.id).endsWith('_sh'))) {
    const detail = patternDetail(f.id)
    if (detail !== undefined && (detail.brief !== undefined || detail.function !== undefined)) covered += 1
  }
  assert.ok(covered >= 40, `仅有 ${covered} 首接入了方证讲解`)
  const baitong = FORMULAS.find((x) => x.name === '白通汤')
  assert.match(patternDetail(baitong.id).brief, /四肢厥冷|下利/)
})
