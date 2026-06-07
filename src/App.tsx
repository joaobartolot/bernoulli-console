import { useState } from 'react'
import { AlertsPanel } from './components/dashboard/AlertsPanel'
import { DashboardShell } from './components/dashboard/DashboardShell'
import {
  ErrorBanner,
  LoadingState,
} from './components/dashboard/FeedbackStates'
import { LiveStatus } from './components/dashboard/LiveStatus'
import { ProcessOverview } from './components/dashboard/ProcessOverview'
import {
  ProductionSummary,
  ProductionTotals,
  YearlyProduction,
} from './components/dashboard/ProductionCards'
import {
  DailyProductionChart,
  DistributionChart,
  TrendChart,
} from './components/dashboard/ProductionCharts'
import { RecentEvents } from './components/dashboard/RecentEvents'
import { TopBar } from './components/dashboard/TopBar'
import { useDashboardTelemetry } from './hooks/useDashboardTelemetry'

function App() {
  const [refreshIntervalSeconds, setRefreshIntervalSeconds] = useState(10)
  const [selectedDate, setSelectedDate] = useState(() => new Date())
  const { dashboard, isLoading, isRefreshing, error, lastLoadedAt, refresh } =
    useDashboardTelemetry(refreshIntervalSeconds, selectedDate)

  return (
    <DashboardShell
      header={
        <TopBar
          selectedDate={selectedDate}
          refreshIntervalSeconds={refreshIntervalSeconds}
          isRefreshing={isRefreshing}
          lastLoadedAt={lastLoadedAt}
          onRefresh={() => void refresh()}
          onRefreshIntervalChange={setRefreshIntervalSeconds}
          onDateChange={setSelectedDate}
        />
      }
    >
      {error ? <ErrorBanner message={error} /> : null}
      {isLoading ? <LoadingState /> : null}

      <section className="grid gap-3 xl:grid-cols-[minmax(0,2fr)_minmax(360px,1fr)]">
        <ProcessOverview dashboard={dashboard} />
        <LiveStatus dashboard={dashboard} lastLoadedAt={lastLoadedAt} />
      </section>

      <section className="grid gap-3 xl:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)]">
        <ProductionTotals
          title="Total Production"
          detail="Selected year"
          tanks={dashboard.tanks}
          valueKey="yearProduction"
        />
        <YearlyProduction
          tanks={dashboard.tanks}
          selectedYear={selectedDate.getFullYear()}
        />
      </section>

      <section className="grid gap-3 xl:grid-cols-[minmax(300px,0.75fr)_minmax(360px,0.8fr)_minmax(0,1.5fr)]">
        <DailyProductionChart data={dashboard.dailyProduction} />
        <DistributionChart dashboard={dashboard} />
        <TrendChart data={dashboard.monthlyProduction} />
      </section>

      <section className="grid gap-3 xl:grid-cols-[minmax(0,1.2fr)_minmax(360px,0.8fr)_minmax(300px,0.6fr)]">
        <RecentEvents dashboard={dashboard} />
        <ProductionSummary dashboard={dashboard} />
        <AlertsPanel dashboard={dashboard} />
      </section>
    </DashboardShell>
  )
}

export default App
