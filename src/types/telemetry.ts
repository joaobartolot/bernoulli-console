export type TelemetryValueType =
  | 'NULL'
  | 'NUMBER'
  | 'INTEGER'
  | 'BOOLEAN'
  | 'STRING'
  | 'ARRAY'
  | 'OBJECT'

export type TelemetryQuality = 'GOOD' | 'BAD' | 'UNCERTAIN'

export type TelemetryEvent = {
  event_id: string
  gateway_id: string
  tag_name: string
  node_id: string
  value: unknown
  value_type: TelemetryValueType
  quality: TelemetryQuality
  source_timestamp: string | null
  collected_at: string
}

export type TelemetryHistoryQuery = {
  gatewayId: string
  tagName?: string
  from?: string
  to?: string
  limit?: number
}
