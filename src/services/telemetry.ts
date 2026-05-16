import { apiBaseUrl } from '../config/dashboard'
import type { TelemetryEvent, TelemetryHistoryQuery } from '../types/telemetry'

export async function fetchTelemetryHistory(
  query: TelemetryHistoryQuery,
  signal?: AbortSignal,
): Promise<TelemetryEvent[]> {
  const params = new URLSearchParams({ gateway_id: query.gatewayId })

  if (query.tagName) {
    params.set('tag_name', query.tagName)
  }

  if (query.from) {
    params.set('from', query.from)
  }

  if (query.to) {
    params.set('to', query.to)
  }

  if (query.limit) {
    params.set('limit', String(query.limit))
  }

  const response = await fetch(
    `${apiBaseUrl.replace(/\/$/, '')}/telemetry/history?${params.toString()}`,
    { signal },
  )

  if (!response.ok) {
    throw new Error(`Telemetry request failed with status ${response.status}`)
  }

  return response.json() as Promise<TelemetryEvent[]>
}
