import { AlertTriangle, CalendarDays, Power, RefreshCcw } from 'lucide-react'
import { useState } from 'react'
import { twMerge } from 'tailwind-merge'
import { DashboardHeader } from './components/DashboardHeader'
import { MetricCard } from './components/MetricCard'
import { ProductionCharts } from './components/ProductionCharts'
import { TankCard } from './components/TankCard'
import { useDashboardTelemetry } from './hooks/useDashboardTelemetry'
import { formatLiters, formatStatus, formatTimestamp } from './utils/format'

function App() {
  const [refreshIntervalSeconds, setRefreshIntervalSeconds] = useState(10)
  const { dashboard, isLoading, isRefreshing, error, lastLoadedAt, refresh } =
    useDashboardTelemetry(refreshIntervalSeconds)

  return (
    <div className="min-h-svh bg-bronze-900 text-dusk-300">
      <main className="mx-auto flex w-full max-w-7xl flex-col gap-6 px-5 py-6 sm:px-8 lg:px-10">
        <DashboardHeader
          refreshIntervalSeconds={refreshIntervalSeconds}
          isRefreshing={isRefreshing}
          lastLoadedAt={lastLoadedAt}
          onRefresh={() => void refresh()}
          onRefreshIntervalChange={setRefreshIntervalSeconds}
        />

        {error ? <ErrorBanner message={error} /> : null}
        {isLoading ? <LoadingState /> : null}

        <section className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
          <MetricCard
            title="Pump"
            value={formatStatus(dashboard.pumpRunning)}
            detail={`Last sample ${formatTimestamp(dashboard.pumpLastEventTime)}`}
            icon={Power}
            tone={dashboard.pumpRunning ? 'active' : 'neutral'}
          />
          <MetricCard
            title="Year Production"
            value={formatLiters(dashboard.totalYearProduction)}
            detail="Estimated from flow samples"
            icon={CalendarDays}
            tone="active"
          />
          <MetricCard
            title="Telemetry Quality"
            value={dashboard.pumpQuality ?? 'Unknown'}
            detail={`Last event ${formatTimestamp(dashboard.lastEventTime)}`}
            icon={RefreshCcw}
          />
          <MetricCard
            title="Flow Data"
            value={dashboard.hasFlowData ? 'Available' : 'Missing'}
            detail={`${dashboard.events.length} history events loaded`}
            icon={AlertTriangle}
            tone={dashboard.hasFlowData ? 'neutral' : 'warning'}
          />
        </section>

        <section className="grid gap-5 lg:grid-cols-3">
          {dashboard.tanks.map((tank) => (
            <TankCard key={tank.id} tank={tank} />
          ))}
        </section>

        <ProductionCharts dashboard={dashboard} />
      </main>
    </div>
  )
}

type ErrorBannerProps = {
  message: string
}

function ErrorBanner({ message }: ErrorBannerProps) {
  return (
    <div className="flex items-start gap-3 rounded-lg border border-rose-700 bg-rose-900 px-4 py-3 text-sm text-rose-300">
      <AlertTriangle className="mt-0.5 size-5 shrink-0" aria-hidden="true" />
      <div>
        <p className="font-semibold">Unable to load telemetry</p>
        <p className="mt-1 text-rose-400">{message}</p>
      </div>
    </div>
  )
}

function LoadingState() {
  return (
    <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
      {Array.from({ length: 4 }, (_, index) => (
        <div
          className={twMerge(
            'h-36 animate-pulse rounded-lg border border-bronze-800 bg-bronze-800',
          )}
          key={index}
        />
      ))}
    </div>
  )
}

export default App
