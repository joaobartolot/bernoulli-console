import { tankConfigs } from '../config/dashboard'
import type {
  DashboardTelemetry,
  ProductionPoint,
  TankId,
  TankSummary,
} from '../types/dashboard'
import type { TelemetryEvent } from '../types/telemetry'

const tankIds: TankId[] = ['tank_1', 'tank_2', 'tank_3']
const maxSegmentMinutes = 5

export function eventTime(event: TelemetryEvent): Date {
  return new Date(event.source_timestamp ?? event.collected_at)
}

export function latestEventByTag(
  events: TelemetryEvent[],
  tagName: string,
): TelemetryEvent | null {
  return events
    .filter((event) => event.tag_name === tagName)
    .reduce<TelemetryEvent | null>((latest, event) => {
      if (!latest) {
        return event
      }

      return eventTime(event).getTime() > eventTime(latest).getTime()
        ? event
        : latest
    }, null)
}

export function toNumber(value: unknown): number | null {
  if (typeof value === 'number' && Number.isFinite(value)) {
    return value
  }

  if (typeof value === 'string') {
    const parsed = Number(value)
    return Number.isFinite(parsed) ? parsed : null
  }

  return null
}

export function toBoolean(value: unknown): boolean | null {
  if (typeof value === 'boolean') {
    return value
  }

  if (typeof value === 'number') {
    return value !== 0
  }

  if (typeof value === 'string') {
    if (value.toLowerCase() === 'true') {
      return true
    }

    if (value.toLowerCase() === 'false') {
      return false
    }
  }

  return null
}

export function buildDashboardTelemetry(
  events: TelemetryEvent[],
): DashboardTelemetry {
  const now = new Date()
  const pump = latestEventByTag(events, 'pump')
  const tanks = tankConfigs.map((tank): TankSummary => {
    const latestFlowEvent = latestEventByTag(events, tank.flowTag)
    const latestValveEvent = latestEventByTag(events, tank.valveTag)
    const flowEvents = events.filter((event) => event.tag_name === tank.flowTag)

    return {
      ...tank,
      latestFlow: latestFlowEvent ? toNumber(latestFlowEvent.value) : null,
      valveOpen: latestValveEvent ? toBoolean(latestValveEvent.value) : null,
      quality: latestFlowEvent?.quality ?? latestValveEvent?.quality ?? null,
      lastEventTime: latestFlowEvent ? eventTime(latestFlowEvent) : null,
      todayProduction: productionSince(flowEvents, startOfDay(now), now),
      monthProduction: productionSince(flowEvents, startOfMonth(now), now),
      yearProduction: productionSince(flowEvents, startOfYear(now), now),
    }
  })

  const dailyProduction = buildDailyProduction(events, now)
  const monthlyProduction = buildMonthlyProduction(events, now)
  const totalYearProduction = tanks.reduce(
    (total, tank) => total + tank.yearProduction,
    0,
  )
  const productionShare = tanks.map((tank) => ({
    name: tank.name,
    value: tank.yearProduction,
    fill: `var(--chart-${tank.id})`,
  }))

  return {
    events,
    pumpRunning: pump ? toBoolean(pump.value) : null,
    pumpQuality: pump?.quality ?? null,
    pumpLastEventTime: pump ? eventTime(pump) : null,
    tanks,
    dailyProduction,
    monthlyProduction,
    productionShare,
    totalYearProduction,
    lastEventTime: latestEventTime(events),
    hasFlowData: events.some((event) =>
      tankConfigs.some((tank) => tank.flowTag === event.tag_name),
    ),
  }
}

function productionSince(
  events: TelemetryEvent[],
  from: Date,
  to: Date,
): number {
  return productionBetween(events, from, to)
}

function productionBetween(
  events: TelemetryEvent[],
  from: Date,
  to: Date,
): number {
  const sorted = events
    .map((event) => ({ event, time: eventTime(event) }))
    .filter(({ time }) => time.getTime() <= to.getTime())
    .sort((left, right) => left.time.getTime() - right.time.getTime())

  let total = 0

  for (let index = 0; index < sorted.length; index += 1) {
    const current = sorted[index]
    const nextTime = sorted[index + 1]?.time ?? to
    const segmentStart = new Date(
      Math.max(current.time.getTime(), from.getTime()),
    )
    const segmentEnd = new Date(
      Math.min(nextTime.getTime(), to.getTime(), cappedEnd(current.time)),
    )

    if (segmentEnd.getTime() <= segmentStart.getTime()) {
      continue
    }

    const flow = toNumber(current.event.value)
    if (flow === null || flow <= 0) {
      continue
    }

    total += flow * minutesBetween(segmentStart, segmentEnd)
  }

  return total
}

function buildDailyProduction(
  events: TelemetryEvent[],
  now: Date,
): ProductionPoint[] {
  return Array.from({ length: 7 }, (_, offset) => {
    const day = addDays(startOfDay(now), offset - 6)
    const nextDay = addDays(day, 1)
    return productionPoint(shortDayLabel(day), events, day, nextDay)
  })
}

function buildMonthlyProduction(
  events: TelemetryEvent[],
  now: Date,
): ProductionPoint[] {
  return Array.from({ length: now.getMonth() + 1 }, (_, monthIndex) => {
    const month = new Date(now.getFullYear(), monthIndex, 1)
    const nextMonth = new Date(now.getFullYear(), monthIndex + 1, 1)
    return productionPoint(shortMonthLabel(month), events, month, nextMonth)
  })
}

function productionPoint(
  label: string,
  events: TelemetryEvent[],
  from: Date,
  to: Date,
): ProductionPoint {
  const point = emptyProductionPoint(label)

  for (const tank of tankConfigs) {
    const flowEvents = events.filter((event) => event.tag_name === tank.flowTag)
    point[tank.id] = productionBetween(flowEvents, from, to)
  }

  return point
}

function emptyProductionPoint(label: string): ProductionPoint {
  return tankIds.reduce<ProductionPoint>(
    (point, tankId) => ({ ...point, [tankId]: 0 }),
    { label, tank_1: 0, tank_2: 0, tank_3: 0 },
  )
}

function latestEventTime(events: TelemetryEvent[]): Date | null {
  return events.reduce<Date | null>((latest, event) => {
    const current = eventTime(event)
    return latest && latest.getTime() > current.getTime() ? latest : current
  }, null)
}

function cappedEnd(time: Date): number {
  return time.getTime() + maxSegmentMinutes * 60 * 1000
}

function minutesBetween(from: Date, to: Date): number {
  return (to.getTime() - from.getTime()) / 60_000
}

function startOfDay(value: Date): Date {
  return new Date(value.getFullYear(), value.getMonth(), value.getDate())
}

function startOfMonth(value: Date): Date {
  return new Date(value.getFullYear(), value.getMonth(), 1)
}

function startOfYear(value: Date): Date {
  return new Date(value.getFullYear(), 0, 1)
}

function addDays(value: Date, days: number): Date {
  return new Date(value.getFullYear(), value.getMonth(), value.getDate() + days)
}

function shortDayLabel(value: Date): string {
  return value.toLocaleDateString('en-US', { weekday: 'short' })
}

function shortMonthLabel(value: Date): string {
  return value.toLocaleDateString('en-US', { month: 'short' })
}
