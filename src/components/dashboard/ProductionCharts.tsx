import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import type { DashboardTelemetry, ProductionPoint } from '../../types/dashboard'
import { formatLiters } from '../../utils/format'
import { DashboardPanel } from './DashboardPanel'
import { tankSeries } from './dashboardStyles'
import { TankLegend } from './ProductionCards'

export function DailyProductionChart({ data }: { data: ProductionPoint[] }) {
  const bars = tankSeries.map((series) => ({
    name: series.name,
    value: data[0]?.[series.key as keyof ProductionPoint] as number,
    fill: series.stroke,
  }))

  return (
    <DashboardPanel title="Daily Production" detail="Selected day">
      <div className="h-52">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={bars}
            margin={{ top: 8, right: 8, bottom: 0, left: -8 }}
          >
            <CartesianGrid stroke="var(--chart-grid)" vertical={false} />
            <XAxis dataKey="name" tickLine={false} axisLine={false} />
            <YAxis
              tickLine={false}
              axisLine={false}
              tickFormatter={shortLiters}
            />
            <Tooltip formatter={(value) => formatLiters(Number(value))} />
            <Bar dataKey="value" radius={[4, 4, 0, 0]}>
              {bars.map((entry) => (
                <Cell key={entry.name} fill={entry.fill} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </DashboardPanel>
  )
}

export function DistributionChart({
  dashboard,
}: {
  dashboard: DashboardTelemetry
}) {
  return (
    <DashboardPanel title="Production Distribution" detail="Selected year">
      <div className="grid items-center gap-4 md:grid-cols-[1fr_0.9fr]">
        <div className="h-52">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={dashboard.productionShare}
                dataKey="value"
                nameKey="name"
                innerRadius="42%"
                outerRadius="82%"
              >
                {dashboard.productionShare.map((entry) => (
                  <Cell key={entry.name} fill={entry.fill} />
                ))}
              </Pie>
              <Tooltip formatter={(value) => formatLiters(Number(value))} />
            </PieChart>
          </ResponsiveContainer>
        </div>
        <TankLegend dashboard={dashboard} />
      </div>
    </DashboardPanel>
  )
}

export function TrendChart({ data }: { data: ProductionPoint[] }) {
  return (
    <DashboardPanel title="Production Trend" detail="All tanks">
      <div className="h-52">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={data}
            margin={{ top: 8, right: 16, bottom: 0, left: -8 }}
          >
            <CartesianGrid stroke="var(--chart-grid)" vertical={false} />
            <XAxis dataKey="label" tickLine={false} axisLine={false} />
            <YAxis
              tickLine={false}
              axisLine={false}
              tickFormatter={shortLiters}
            />
            <Tooltip formatter={(value) => formatLiters(Number(value))} />
            <Legend />
            {tankSeries.map((series) => (
              <Line
                key={series.key}
                type="monotone"
                dataKey={series.key}
                name={series.name}
                stroke={series.stroke}
                strokeWidth={2}
                dot={{ r: 2 }}
              />
            ))}
          </LineChart>
        </ResponsiveContainer>
      </div>
    </DashboardPanel>
  )
}

function shortLiters(value: number): string {
  if (value >= 1000) {
    return `${Math.round(value / 1000)}K`
  }

  return String(value)
}
