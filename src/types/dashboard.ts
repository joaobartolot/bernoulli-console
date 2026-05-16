import type { TelemetryEvent, TelemetryQuality } from './telemetry'

export type TankId = 'tank_1' | 'tank_2' | 'tank_3'

export type TankConfig = {
  id: TankId
  name: string
  flowTag: string
  valveTag: string
}

export type ProductionPoint = {
  label: string
  tank_1: number
  tank_2: number
  tank_3: number
}

export type ProductionShare = {
  name: string
  value: number
  fill: string
}

export type TankSummary = {
  id: TankId
  name: string
  flowTag: string
  valveTag: string
  latestFlow: number | null
  valveOpen: boolean | null
  quality: TelemetryQuality | null
  lastEventTime: Date | null
  todayProduction: number
  monthProduction: number
  yearProduction: number
}

export type DashboardTelemetry = {
  events: TelemetryEvent[]
  pumpRunning: boolean | null
  pumpQuality: TelemetryQuality | null
  pumpLastEventTime: Date | null
  tanks: TankSummary[]
  dailyProduction: ProductionPoint[]
  monthlyProduction: ProductionPoint[]
  productionShare: ProductionShare[]
  totalYearProduction: number
  lastEventTime: Date | null
  hasFlowData: boolean
}
