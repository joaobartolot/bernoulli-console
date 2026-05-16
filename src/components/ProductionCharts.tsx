import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import type { DashboardTelemetry } from '../types/dashboard'
import { formatLiters } from '../utils/format'
import { Card } from './Card'

type ProductionChartsProps = {
  dashboard: DashboardTelemetry
}

const chartMargin = { top: 8, right: 16, bottom: 0, left: 0 }
const tankBars = [
  { key: 'tank_1', name: 'Tank 1', fill: 'var(--chart-tank_1)' },
  { key: 'tank_2', name: 'Tank 2', fill: 'var(--chart-tank_2)' },
  { key: 'tank_3', name: 'Tank 3', fill: 'var(--chart-tank_3)' },
]

export function ProductionCharts({ dashboard }: ProductionChartsProps) {
  return (
    <div className="grid gap-5 xl:grid-cols-[minmax(0,1.35fr)_minmax(320px,0.65fr)]">
      <Card>
        <ChartHeader
          title="Daily Production"
          detail="Estimated liters from flow samples over the last 7 days"
        />
        <div className="mt-5 h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={dashboard.dailyProduction} margin={chartMargin}>
              <CartesianGrid stroke="var(--chart-grid)" vertical={false} />
              <XAxis dataKey="label" tickLine={false} axisLine={false} />
              <YAxis
                tickFormatter={(value) => `${Number(value).toFixed(0)} L`}
                tickLine={false}
                axisLine={false}
                width={64}
              />
              <Tooltip formatter={(value) => formatLiters(Number(value))} />
              <Legend />
              {tankBars.map((bar) => (
                <Bar
                  key={bar.key}
                  dataKey={bar.key}
                  name={bar.name}
                  fill={bar.fill}
                  radius={[4, 4, 0, 0]}
                />
              ))}
            </BarChart>
          </ResponsiveContainer>
        </div>
      </Card>

      <Card>
        <ChartHeader
          title="Production Share"
          detail="Current year estimated split by tank"
        />
        <div className="mt-5 h-80">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={dashboard.productionShare}
                dataKey="value"
                nameKey="name"
                innerRadius="58%"
                outerRadius="82%"
                paddingAngle={3}
              >
                {dashboard.productionShare.map((entry) => (
                  <Cell key={entry.name} fill={entry.fill} />
                ))}
              </Pie>
              <Tooltip formatter={(value) => formatLiters(Number(value))} />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </Card>

      <Card className="xl:col-span-2">
        <ChartHeader
          title="Monthly Overview"
          detail="Estimated production by tank for the current year"
        />
        <div className="mt-5 h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={dashboard.monthlyProduction} margin={chartMargin}>
              <CartesianGrid stroke="var(--chart-grid)" vertical={false} />
              <XAxis dataKey="label" tickLine={false} axisLine={false} />
              <YAxis
                tickFormatter={(value) => `${Number(value).toFixed(0)} L`}
                tickLine={false}
                axisLine={false}
                width={64}
              />
              <Tooltip formatter={(value) => formatLiters(Number(value))} />
              <Legend />
              {tankBars.map((bar) => (
                <Bar
                  key={bar.key}
                  dataKey={bar.key}
                  name={bar.name}
                  fill={bar.fill}
                  radius={[4, 4, 0, 0]}
                />
              ))}
            </BarChart>
          </ResponsiveContainer>
        </div>
      </Card>
    </div>
  )
}

type ChartHeaderProps = {
  title: string
  detail: string
}

function ChartHeader({ title, detail }: ChartHeaderProps) {
  return (
    <div>
      <h2 className="text-lg font-semibold text-dusk-200">{title}</h2>
      <p className="mt-1 text-sm text-dusk-500">{detail}</p>
    </div>
  )
}
