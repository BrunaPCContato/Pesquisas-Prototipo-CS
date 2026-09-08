import { brand } from '../theme'

export type LikertDatum = { label: string; value: number }

type LikertChartProps = {
  data: LikertDatum[]
  yTitle?: string
  xTitle?: string
  color?: string
}

/**
 * Gráfico de colunas leve (escala Likert).
 * NOTA DS: gráficos não fazem parte do Ant DS core — componente próprio,
 * estilizado com os tokens de cor da CS. Substituível por @ant-design/plots.
 */
export default function LikertChart({
  data,
  yTitle = 'Quantidade de respostas',
  xTitle = 'Escala Likert',
  color = brand.chartBar,
}: LikertChartProps) {
  const maxValue = Math.max(1, ...data.map((d) => d.value))
  // Arredonda o topo do eixo para o próximo 0,5.
  const yMax = Math.ceil(maxValue * 2) / 2
  const ticks = Array.from({ length: yMax * 2 + 1 }, (_, i) => yMax - i / 2)

  const chartHeight = 300

  return (
    <div style={{ display: 'flex', gap: 12, paddingTop: 8 }}>
      {/* Eixo Y */}
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <div
          style={{
            writingMode: 'vertical-rl',
            transform: 'rotate(180deg)',
            color: brand.textMuted,
            fontSize: 13,
            paddingBottom: 24,
          }}
        >
          {yTitle}
        </div>
      </div>

      <div style={{ flex: 1, minWidth: 0 }}>
        {/* Área do gráfico */}
        <div style={{ display: 'flex' }}>
          {/* Ticks do eixo Y */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              height: chartHeight,
              textAlign: 'right',
              paddingRight: 8,
              color: brand.textMuted,
              fontSize: 12,
              fontVariantNumeric: 'tabular-nums',
            }}
          >
            {ticks.map((t) => (
              <span key={t}>{t.toFixed(1).replace('.', ',')}</span>
            ))}
          </div>

          {/* Grid + colunas */}
          <div style={{ position: 'relative', flex: 1, height: chartHeight }}>
            {/* Linhas de grade */}
            {ticks.map((t, i) => (
              <div
                key={t}
                style={{
                  position: 'absolute',
                  left: 0,
                  right: 0,
                  top: `${(i / (ticks.length - 1)) * 100}%`,
                  borderTop: `1px solid ${i === ticks.length - 1 ? '#bfbfbf' : '#f0f0f0'}`,
                }}
              />
            ))}

            {/* Colunas */}
            <div
              style={{
                position: 'absolute',
                inset: 0,
                display: 'flex',
                alignItems: 'flex-end',
              }}
            >
              {data.map((d) => (
                <div
                  key={d.label}
                  style={{
                    flex: 1,
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'flex-end',
                    height: '100%',
                  }}
                >
                  <div
                    title={`${d.label}: ${d.value}`}
                    style={{
                      width: 140,
                      maxWidth: '60%',
                      height: `${(d.value / yMax) * 100}%`,
                      background: color,
                      transition: 'height .3s ease',
                    }}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Rótulos do eixo X */}
        <div style={{ display: 'flex', paddingLeft: 40, marginTop: 8 }}>
          {data.map((d) => (
            <div
              key={d.label}
              style={{
                flex: 1,
                textAlign: 'center',
                color: brand.textMuted,
                fontSize: 13,
                paddingInline: 4,
              }}
            >
              {d.label}
            </div>
          ))}
        </div>

        {/* Título do eixo X */}
        <div
          style={{
            textAlign: 'center',
            color: brand.textMuted,
            fontSize: 13,
            marginTop: 8,
          }}
        >
          {xTitle}
        </div>
      </div>
    </div>
  )
}
