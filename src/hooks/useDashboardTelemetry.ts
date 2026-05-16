import { useCallback, useEffect, useMemo, useState } from 'react'
import { gatewayId } from '../config/dashboard'
import { fetchTelemetryHistory } from '../services/telemetry'
import type { DashboardTelemetry } from '../types/dashboard'
import type { TelemetryEvent } from '../types/telemetry'
import { buildDashboardTelemetry } from '../utils/telemetry'

type DashboardTelemetryState = {
  dashboard: DashboardTelemetry
  isLoading: boolean
  isRefreshing: boolean
  error: string | null
  lastLoadedAt: Date | null
  refresh: () => Promise<void>
}

const historyLimit = 5000

export function useDashboardTelemetry(
  refreshIntervalSeconds: number,
): DashboardTelemetryState {
  const [events, setEvents] = useState<TelemetryEvent[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [lastLoadedAt, setLastLoadedAt] = useState<Date | null>(null)

  const loadTelemetry = useCallback(async (signal?: AbortSignal) => {
    setIsRefreshing(true)

    try {
      const from = new Date(new Date().getFullYear(), 0, 1).toISOString()
      const history = await fetchTelemetryHistory(
        {
          gatewayId,
          from,
          limit: historyLimit,
        },
        signal,
      )

      setEvents(history)
      setError(null)
      setLastLoadedAt(new Date())
    } catch (loadError) {
      if (signal?.aborted) {
        return
      }

      setError(
        loadError instanceof Error
          ? loadError.message
          : 'Telemetry request failed',
      )
    } finally {
      if (!signal?.aborted) {
        setIsLoading(false)
        setIsRefreshing(false)
      }
    }
  }, [])

  useEffect(() => {
    const controller = new AbortController()
    const timeout = window.setTimeout(() => {
      void loadTelemetry(controller.signal)
    }, 0)

    return () => {
      window.clearTimeout(timeout)
      controller.abort()
    }
  }, [loadTelemetry])

  useEffect(() => {
    if (refreshIntervalSeconds <= 0) {
      return undefined
    }

    const interval = window.setInterval(() => {
      void loadTelemetry()
    }, refreshIntervalSeconds * 1000)

    return () => window.clearInterval(interval)
  }, [loadTelemetry, refreshIntervalSeconds])

  const dashboard = useMemo(() => buildDashboardTelemetry(events), [events])

  return {
    dashboard,
    isLoading,
    isRefreshing,
    error,
    lastLoadedAt,
    refresh: () => loadTelemetry(),
  }
}
