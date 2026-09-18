import type { CompanyProfile } from '@/lib/companyProfiles'

type FiscalYear = CompanyProfile['years'][number]
type Metric = 'revenueEur' | 'ebitEur'

const WIDTH = 420
const HEIGHT = 230
const PLOT = { left: 68, right: 16, top: 18, bottom: 34 }

function accessibleId(slug: string, metric: Metric) {
  return `company-chart-${slug}-${metric}`
}

export function CompanyProfileChart({
  years,
  slug,
  metric,
}: {
  years: FiscalYear[]
  slug: string
  metric: Metric
}) {
  const label = metric === 'revenueEur' ? 'Liikevaihto' : 'Liiketulos (EBIT)'
  const values = years.map((year) => year[metric])
  const plotWidth = WIDTH - PLOT.left - PLOT.right
  const plotHeight = HEIGHT - PLOT.top - PLOT.bottom
  let min = Math.min(0, ...values)
  let max = Math.max(0, ...values)

  if (min === max) {
    min = -1
    max = 1
  }

  const maximumMagnitude = Math.max(Math.abs(min), Math.abs(max))
  const divisor = maximumMagnitude >= 1_000_000 ? 1_000_000 : maximumMagnitude >= 1_000 ? 1_000 : 1
  const unit = divisor === 1_000_000 ? 'M€' : divisor === 1_000 ? 'k€' : '€'
  const maximumFractionDigits = divisor === 1_000_000 ? 2 : divisor === 1_000 ? 1 : 0
  const axisValue = (value: number) =>
    `${new Intl.NumberFormat('fi-FI', { maximumFractionDigits }).format(value / divisor)} ${unit}`

  const y = (value: number) => PLOT.top + ((max - value) / (max - min)) * plotHeight
  const zeroY = y(0)
  const titleId = `${accessibleId(slug, metric)}-title`
  const descriptionId = `${accessibleId(slug, metric)}-description`
  const ticks = Array.from({ length: 5 }, (_, index) => min + ((max - min) * index) / 4)
  const slotWidth = plotWidth / Math.max(1, years.length)
  const barWidth = Math.min(58, slotWidth * 0.46)

  return (
    <section className="min-w-0 rounded-2xl border border-mist bg-white p-3 sm:p-6" aria-labelledby={titleId}>
      <div className="flex items-baseline justify-between gap-4">
        <h3 id={titleId} className="text-base font-medium text-charcoal">
          {label}
        </h3>
        <span className="text-xs text-steel">{unit}</span>
      </div>
      <div className="mt-4 overflow-x-auto">
        <svg
          className="h-auto w-full"
          viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
          role="img"
          aria-labelledby={`${titleId} ${descriptionId}`}
        >
          <title id={`${titleId}-svg`}>{label} tilikausittain</title>
          <desc id={descriptionId}>
            {label} on esitetty euroina tilikausittain. Negatiiviset arvot näkyvät nollalinjan alapuolella.
          </desc>
          {ticks.map((tick, index) => {
            const tickY = y(tick)
            return (
              <g key={index}>
                <line
                  x1={PLOT.left}
                  y1={tickY}
                  x2={WIDTH - PLOT.right}
                  y2={tickY}
                  stroke={tick === 0 ? '#9AA9A1' : '#E6ECE8'}
                  strokeWidth={tick === 0 ? 1.5 : 1}
                />
                <text
                  x={PLOT.left - 10}
                  y={tickY + 4}
                  textAnchor="end"
                  fill="#718078"
                  fontSize="16"
                >
                  {axisValue(tick)}
                </text>
              </g>
            )
          })}
          <line x1={PLOT.left} y1={zeroY} x2={WIDTH - PLOT.right} y2={zeroY} stroke="#526158" strokeWidth="1.5" />
          {years.map((year, index) => {
            const x = PLOT.left + slotWidth * (index + 0.5)
            const value = year[metric]
            const valueY = y(value)
            const rectY = Math.min(zeroY, valueY)
            const rectHeight = Math.max(2, Math.abs(zeroY - valueY))
            const color = value < 0 ? '#C8963E' : '#3D9E72'
            return (
              <g key={year.year}>
                <rect
                  x={x - barWidth / 2}
                  y={rectY}
                  width={barWidth}
                  height={rectHeight}
                  rx="6"
                  fill={color}
                />
                <text
                  x={x}
                  y={HEIGHT - 14}
                  textAnchor="middle"
                  fill="#526158"
                  fontSize="16"
                >
                  {year.year}
                </text>
              </g>
            )
          })}
        </svg>
      </div>
      <p className="mt-1 text-xs text-steel">Ilmoitetut tilikausiarvot · ei ennuste</p>
    </section>
  )
}
