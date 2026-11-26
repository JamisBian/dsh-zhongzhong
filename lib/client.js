// dsh-zhongzhong 客户端卡片
//
// 手写 classic script（无需构建）：把 7 个衷中参西工具的行渲染成中文卡片
// —— 问诊进度、辨证排序、文献核查、方剂详情、处方笺。
//
// 契约（实测自 App 内 asar）：
//   · id 必须等于包名 dsh-zhongzhong
//   · 结果文本在 block.content: ContentBlock[]，参数用 block.args 懒读
//   · slot 名 tool.call.toolview，key 为工具 wire name
window.__ModuleLoader__.load({
  id: 'dsh-zhongzhong',
  factory(require) {
    const React = require('react')
    const h = React.createElement

    const COLOR = {
      fg: 'var(--dsw-alias-label-primary, #1f2328)',
      fg2: 'var(--dsw-alias-label-secondary, #57606a)',
      fg3: 'var(--dsw-alias-label-tertiary, #8b949e)',
      border: 'var(--dsw-alias-border-l2, rgba(128,128,128,.28))',
      bg: 'var(--dsw-alias-bg-layer-1, rgba(127,127,127,.06))',
      bg2: 'var(--dsw-alias-bg-layer-2, rgba(127,127,127,.12))',
      ok: 'var(--dsw-alias-state-success-primary, #1a7f37)',
      okBg: 'var(--dsw-alias-state-success-bg, rgba(26,127,55,.12))',
      warn: 'var(--dsw-alias-state-warning-primary, #9a6700)',
      err: 'var(--dsw-alias-state-error-primary, #cf222e)',
      brand: 'var(--dsw-alias-brand-primary, #8a5a2b)'
    }

    /** 结果内容拍平：ContentBlock[] → 文本。 */
    function resultText(block) {
      if (block === null || block === undefined || !Array.isArray(block.content)) return ''
      const parts = []
      for (const item of block.content) {
        if (item === null || item === undefined) continue
        if (item.type === 'text') parts.push(String(item.text ?? ''))
        else parts.push(JSON.stringify(item))
      }
      return parts.join('\n')
    }

    /** 安全读参数字符串。 */
    function argText(args, key) {
      if (args === null || args === undefined) return ''
      try {
        const value = args.text(key)
        return typeof value === 'string' ? value : ''
      } catch (err) {
        return ''
      }
    }

    // ── 极简 Markdown 渲染（只覆盖本插件自己产出的语法） ─────────────
    function inline(text, keyBase) {
      const nodes = []
      const re = /(\*\*[^*]+\*\*|`[^`]+`)/g
      let last = 0
      let match
      let i = 0
      while ((match = re.exec(text)) !== null) {
        if (match.index > last) nodes.push(text.slice(last, match.index))
        const token = match[0]
        if (token.startsWith('**')) {
          nodes.push(h('strong', { key: keyBase + '-b' + i++ }, token.slice(2, -2)))
        } else {
          nodes.push(
            h(
              'code',
              {
                key: keyBase + '-c' + i++,
                style: {
                  fontFamily: 'var(--ds-font-family-code, ui-monospace, monospace)',
                  fontSize: '0.92em',
                  padding: '1px 5px',
                  borderRadius: 4,
                  background: COLOR.bg2
                }
              },
              token.slice(1, -1)
            )
          )
        }
        last = match.index + token.length
      }
      if (last < text.length) nodes.push(text.slice(last))
      return nodes
    }

    function markdown(text) {
      if (typeof text !== 'string' || text.trim() === '') return null
      const lines = text.split('\n')
      const blocks = []
      let para = []
      let list = null
      let quote = null
      let table = null
      let key = 0

      const flushPara = () => {
        if (para.length === 0) return
        blocks.push(h('p', { key: 'p' + key++, style: { margin: '6px 0', lineHeight: 1.7 } }, inline(para.join(' '), 'p' + key)))
        para = []
      }
      const flushList = () => {
        if (list === null) return
        blocks.push(
          h(
            'ul',
            { key: 'u' + key++, style: { margin: '6px 0', paddingLeft: 18, lineHeight: 1.7 } },
            list.map((item, index) => h('li', { key: 'li' + index, style: { margin: '2px 0' } }, inline(item, 'li' + index)))
          )
        )
        list = null
      }
      const flushQuote = () => {
        if (quote === null) return
        blocks.push(
          h(
            'blockquote',
            {
              key: 'q' + key++,
              style: {
                margin: '8px 0',
                padding: '6px 10px',
                borderLeft: '3px solid ' + COLOR.brand,
                background: COLOR.bg2,
                borderRadius: '0 6px 6px 0',
                color: COLOR.fg2,
                lineHeight: 1.7
              }
            },
            quote.map((line, index) => h('div', { key: 'ql' + index }, inline(line, 'ql' + index)))
          )
        )
        quote = null
      }
      const flushTable = () => {
        if (table === null) return
        const rows = table.rows
        const header = rows.length > 0 ? rows[0] : []
        const body = rows.slice(1)
        blocks.push(
          h(
            'div',
            { key: 't' + key++, style: { overflowX: 'auto', margin: '8px 0' } },
            h(
              'table',
              { style: { borderCollapse: 'collapse', width: '100%', fontSize: '0.95em' } },
              h(
                'thead',
                null,
                h(
                  'tr',
                  null,
                  header.map((cell, index) =>
                    h(
                      'th',
                      {
                        key: 'th' + index,
                        style: {
                          textAlign: 'left',
                          padding: '5px 8px',
                          borderBottom: '1px solid ' + COLOR.border,
                          color: COLOR.fg2,
                          fontWeight: 600,
                          whiteSpace: 'nowrap'
                        }
                      },
                      inline(cell, 'th' + index)
                    )
                  )
                )
              ),
              h(
                'tbody',
                null,
                body.map((row, rowIndex) =>
                  h(
                    'tr',
                    { key: 'tr' + rowIndex },
                    row.map((cell, cellIndex) =>
                      h(
                        'td',
                        {
                          key: 'td' + cellIndex,
                          style: { padding: '5px 8px', borderBottom: '1px solid ' + COLOR.border, verticalAlign: 'top' }
                        },
                        inline(cell, 'td' + rowIndex + '-' + cellIndex)
                      )
                    )
                  )
                )
              )
            )
          )
        )
        table = null
      }
      const flushAll = () => {
        flushPara()
        flushList()
        flushQuote()
        flushTable()
      }

      for (const raw of lines) {
        const line = raw.replace(/\s+$/, '')
        if (line.trim() === '') {
          flushAll()
          continue
        }
        if (/^\s*---+\s*$/.test(line)) {
          flushAll()
          blocks.push(h('hr', { key: 'hr' + key++, style: { border: 0, borderTop: '1px solid ' + COLOR.border, margin: '10px 0' } }))
          continue
        }
        const heading = /^(#{1,3})\s+(.*)$/.exec(line)
        if (heading !== null) {
          flushAll()
          const level = heading[1].length
          blocks.push(
            h(
              level === 1 ? 'h2' : level === 2 ? 'h3' : 'h4',
              {
                key: 'h' + key++,
                style: {
                  margin: level === 1 ? '4px 0 8px' : '12px 0 6px',
                  fontSize: level === 1 ? 16 : level === 2 ? 14.5 : 13.5,
                  fontWeight: 700,
                  color: COLOR.fg
                }
              },
              inline(heading[2], 'h' + key)
            )
          )
          continue
        }
        if (/^\|.*\|$/.test(line)) {
          flushPara()
          flushList()
          flushQuote()
          if (/^\|[\s:|-]+\|$/.test(line)) continue
          const cells = line.slice(1, -1).split('|').map((cell) => cell.trim())
          if (table === null) table = { rows: [] }
          table.rows.push(cells)
          continue
        }
        if (/^\s*[-*]\s+/.test(line)) {
          flushPara()
          flushQuote()
          flushTable()
          if (list === null) list = []
          list.push(line.replace(/^\s*[-*]\s+/, ''))
          continue
        }
        if (/^\s*>\s?/.test(line)) {
          flushPara()
          flushList()
          flushTable()
          if (quote === null) quote = []
          quote.push(line.replace(/^\s*>\s?/, ''))
          continue
        }
        flushList()
        flushQuote()
        flushTable()
        para.push(line)
      }
      flushAll()
      return h('div', { style: { color: COLOR.fg } }, blocks)
    }

    // ── 卡片外框 ───────────────────────────────────────────────
    function Chip(props) {
      return h(
        'span',
        {
          style: {
            flex: '0 0 auto',
            fontSize: 11,
            padding: '1px 7px',
            borderRadius: 999,
            lineHeight: '18px',
            color: props.color ?? COLOR.fg2,
            background: props.background ?? COLOR.bg2,
            border: '1px solid ' + (props.border ?? COLOR.border)
          }
        },
        props.children
      )
    }

    /** 把文本写进剪贴板：优先 navigator.clipboard，退化到 execCommand。 */
    function copyText(text) {
      try {
        if (navigator !== undefined && navigator.clipboard !== undefined) {
          navigator.clipboard.writeText(text)
          return true
        }
      } catch {
        /* 落到下面的兜底 */
      }
      try {
        const area = document.createElement('textarea')
        area.value = text
        area.style.position = 'fixed'
        area.style.opacity = '0'
        document.body.appendChild(area)
        area.select()
        const ok = document.execCommand('copy')
        document.body.removeChild(area)
        return ok
      } catch {
        return false
      }
    }

    /** 病案导出卡片底部：一键复制文件路径。 */
    function CopyPathButton(props) {
      const [copied, setCopied] = React.useState(false)
      const filePath = props.path
      if (filePath === undefined || filePath === '') return null
      return h(
        'button',
        {
          type: 'button',
          onClick: () => {
            if (copyText(filePath)) setCopied(true)
          },
          title: filePath,
          style: {
            marginTop: 8,
            padding: '4px 10px',
            borderRadius: 8,
            border: '1px solid ' + (copied ? COLOR.ok : COLOR.border),
            background: copied ? COLOR.okBg : COLOR.bg2,
            color: copied ? COLOR.ok : COLOR.fg2,
            cursor: 'pointer',
            fontSize: 12
          }
        },
        copied ? '已复制路径' : '复制文件路径'
      )
    }

    function phaseChip(phase, failed) {
      if (phase === 'preparing') return h(Chip, null, '准备中')
      if (phase === 'start') return h(Chip, null, '接诊中')
      if (failed === true) return h(Chip, { color: COLOR.err, border: COLOR.err }, '失败')
      return h(Chip, { color: COLOR.ok, border: COLOR.ok }, '完成')
    }

    /** 从文本里挑一个状态徽标（文献判定 / 危险信号 / 拒绝开方）。 */
    function verdictChip(text) {
      if (typeof text !== 'string') return null
      if (text.includes('需要立即就医')) return h(Chip, { color: '#fff', background: COLOR.err, border: COLOR.err }, '需急诊')
      if (/这一点需要修正/.test(text)) return h(Chip, { color: COLOR.warn, border: COLOR.warn }, '已修正')
      if (/我的判断不变/.test(text)) return h(Chip, { color: COLOR.ok, border: COLOR.ok }, '维持原判')
      if (/结论：\*\*有文献支撑\*\*/.test(text)) return h(Chip, { color: COLOR.ok, border: COLOR.ok }, '有文献支撑')
      if (/结论：\*\*证据不足\*\*/.test(text)) return h(Chip, { color: COLOR.warn, border: COLOR.warn }, '证据不足')
      if (/结论：\*\*无文献支撑\*\*/.test(text)) return h(Chip, { color: COLOR.err, border: COLOR.err }, '无文献支撑')
      if (/结论：\*\*仅有现代研究\*\*/.test(text)) return h(Chip, { color: COLOR.warn, border: COLOR.warn }, '仅现代研究')
      if (text.includes('不能开方')) return h(Chip, { color: COLOR.err, border: COLOR.err }, '拦截')
      if (text.includes('尚不能定方')) return h(Chip, { color: COLOR.warn, border: COLOR.warn }, '需继续问')
      if (text.includes('## 病案已导出')) return h(Chip, { color: COLOR.ok, border: COLOR.ok }, '已存档')
      if (text.includes('## 导出失败')) return h(Chip, { color: COLOR.err, border: COLOR.err }, '导出失败')
      if (text.includes('# ') && (text.includes('处方笺') || text.includes('外用方'))) return h(Chip, { color: COLOR.brand, border: COLOR.brand }, text.includes('外用方') ? '外用' : '处方')
      return null
    }

    function Card(props) {
      const { phase, block, toolName } = props
      const args = block === undefined ? undefined : block.args
      const settled = phase === 'result'
      const failed = settled && block.isError === true
      const body = settled ? resultText(block) : ''
      const [open, setOpen] = React.useState(true)
      const stage = argText(args, 'stage')
      const title = props.title(args)
      const badge = settled ? verdictChip(body) : null
      const long = body.length > 900
      const shown = long && !open ? body.slice(0, 320) + '…' : body

      return h(
        'div',
        {
          'data-tool': toolName,
          'data-phase': phase,
          style: {
            margin: '6px 0',
            border: '1px solid ' + COLOR.border,
            borderRadius: 10,
            background: COLOR.bg,
            padding: '10px 12px',
            fontSize: 'var(--dsh-content-font-size-secondary, 13px)',
            color: COLOR.fg
          }
        },
        h(
          'div',
          { style: { display: 'flex', alignItems: 'center', gap: 8, minHeight: 22 } },
          h('span', { style: { color: COLOR.brand, fontWeight: 700, fontSize: 13 } }, '衷中'),
          h('span', { style: { fontWeight: 600 } }, title),
          h('span', { style: { flex: '1 1 auto' } }),
          badge,
          phaseChip(phase, failed)
        ),
        props.subtitle !== undefined && props.subtitle(args) !== '' ? h('div', { style: { color: COLOR.fg3, fontSize: 12, marginTop: 2 } }, props.subtitle(args)) : null,
        settled && body !== ''
          ? h(
              'div',
              { style: { marginTop: 8 } },
              markdown(shown),
              long
                ? h(
                    'button',
                    {
                      type: 'button',
                      onClick: () => setOpen((value) => !value),
                      style: {
                        marginTop: 6,
                        border: 'none',
                        background: 'none',
                        padding: 0,
                        color: COLOR.brand,
                        cursor: 'pointer',
                        fontSize: 12
                      }
                    },
                    open ? '收起' : '展开全文'
                  )
                : null
            )
          : phase === 'start'
            ? h('div', { style: { color: COLOR.fg3, fontSize: 12, marginTop: 6 } }, '正在与患者交互…')
            : null,
        settled && props.footer !== undefined ? props.footer(body) : null
      )
    }

    const STAGE_LABEL = {
      intake: '一般资料与主诉',
      symptoms: '主症（上）',
      symptoms2: '主症（下）',
      signs: '客观指标与舌脉',
      special: '衷中参西特征症'
    }

    const views = {
      zhongzhong_consult: {
        title: (args) => {
          const stage = argText(args, 'stage')
          return '问诊 · ' + (STAGE_LABEL[stage] ?? stage ?? '')
        },
        subtitle: (args) => {
          const stage = argText(args, 'stage')
          const order = ['intake', 'symptoms', 'symptoms2', 'signs', 'special']
          const index = order.indexOf(stage)
          if (index < 0) return ''
          return '第 ' + (index + 1) + ' / ' + order.length + ' 步'
        }
      },
      zhongzhong_differentiate: {
        title: () => '辨证',
        subtitle: () => '先问清，再定方'
      },
      zhongzhong_evidence: {
        title: () => '文献核查',
        subtitle: () => '原文/原书主治 + 中文文献'
      },
      zhongzhong_formula: {
        title: () => '方剂详情',
        subtitle: (args) => argText(args, 'name')
      },
      zhongzhong_prescribe: {
        title: () => '处方笺',
        subtitle: (args) => argText(args, 'formula') + (argText(args, 'modifications') === '' ? '' : '（含加减）')
      },
      zhongzhong_discuss: {
        title: () => '医患沟通',
        subtitle: (args) => argText(args, 'formula')
      },
      zhongzhong_export: {
        title: () => '病案导出',
        subtitle: (args) => {
          const name = argText(args, 'filename')
          return name === '' ? '病历 + 辨证 + 处方笺' : name
        },
        // 从结果文本里取出「文件：`/path`」，给一个一键复制按钮
        footer: (body) => {
          const match = /文件：`([^`]+)`/.exec(body)
          return match === null ? null : h(CopyPathButton, { path: match[1] })
        }
      }
    }

    function makeView(toolName, spec) {
      return function JingfangCard(props) {
        return h(Card, {
          ...props,
          toolName,
          title: spec.title,
          subtitle: spec.subtitle,
          footer: spec.footer
        })
      }
    }

    return {
      inject: ['slots'],
      apply(ctx) {
        for (const [toolName, spec] of Object.entries(views)) {
          const Component = makeView(toolName, spec)
          ctx.slots.inject('tool.call.toolview', () =>
            ctx.slots.register({ name: 'tool.call.toolview', key: toolName }, Component)
          )
        }
      }
    }
  }
})
