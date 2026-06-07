import { tankConfigs } from '../config/dashboard'
import type {
  DashboardTelemetry,
  ProductionPoint,
  RecentEvent,
  TankId,
  TankSummary,
} from '../types/dashboard'
import type { TelemetryEvent } from '../types/telemetry'
import { formatFlow, formatStatus } from './format'

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
  selectedDate = new Date(),
): DashboardTelemetry {
  const now = new Date()
  const dayStart = startOfDay(selectedDate)
  const dayEnd = minDate(addDays(dayStart, 1), now)
  const monthStart = startOfMonth(selectedDate)
  const monthEnd = minDate(addMonths(monthStart, 1), now)
  const yearStart = startOfYear(selectedDate)
  const yearEnd = minDate(addYears(yearStart, 1), now)
  const previousYearStart = addYears(yearStart, -1)
  const previousYearEnd = addYears(yearEnd, -1)
  const pump = latestEventByTag(events, 'pump')
  const tanks = tankConfigs.map((tank): TankSummary => {
    const latestFlowEvent = latestEventByTag(events, tank.flowTag)
    const latestValveEvent = latestEventByTag(events, tank.valveTag)
    const flowEvents = events.filter((event) => event.tag_name === tank.flowTag)
    const yearProduction = productionSince(flowEvents, yearStart, yearEnd)
    const previousYearProduction = productionSince(
      flowEvents,
      previousYearStart,
      previousYearEnd,
    )

    return {
      ...tank,
      latestFlow: latestFlowEvent ? toNumber(latestFlowEvent.value) : null,
      valveOpen: latestValveEvent ? toBoolean(latestValveEvent.value) : null,
      quality: latestFlowEvent?.quality ?? latestValveEvent?.quality ?? null,
      lastEventTime: latestFlowEvent ? eventTime(latestFlowEvent) : null,
      todayProduction: productionSince(flowEvents, dayStart, dayEnd),
      monthProduction: productionSince(flowEvents, monthStart, monthEnd),
      yearProduction,
      previousYearProduction,
      yearChangePercent: percentChange(yearProduction, previousYearProduction),
    }
  })

  const dailyProduction = [
    productionPoint('Selected day', events, dayStart, dayEnd),
  ]
  const monthlyProduction = buildMonthlyProduction(
    events,
    selectedDate,
    yearEnd,
  )
  const totalYearProduction = tanks.reduce(
    (total, tank) => total + tank.yearProduction,
    0,
  )
  const previousYearProduction = tanks.reduce(
    (total, tank) => total + tank.previousYearProduction,
    0,
  )
  const productionShare = tanks.map((tank) => ({
    name: tank.name,
    value: tank.yearProduction,
    fill: `var(--chart-${tank.id})`,
  }))
  const activeTank =
    tanks.find((tank) => tank.valveOpen && (tank.latestFlow ?? 0) > 0) ??
    tanks.find((tank) => tank.valveOpen) ??
    null
  const totalCurrentFlow = tanks.reduce(
    (total, tank) => total + Math.max(tank.latestFlow ?? 0, 0),
    0,
  )
  const alertCount = countAlerts(events, now)

  return {
    events,
    pumpRunning: pump ? toBoolean(pump.value) : null,
    pumpQuality: pump?.quality ?? null,
    pumpLastEventTime: pump ? eventTime(pump) : null,
    tanks,
    dailyProduction,
    monthlyProduction,
    productionShare,
    recentEvents: buildRecentEvents(events),
    activeTank,
    totalCurrentFlow,
    totalYearProduction,
    previousYearProduction,
    yearChangePercent: percentChange(
      totalYearProduction,
      previousYearProduction,
    ),
    lastEventTime: latestEventTime(events),
    hasFlowData: events.some((event) =>
      tankConfigs.some((tank) => tank.flowTag === event.tag_name),
    ),
    alertCount,
    healthStatus: alertCount > 0 ? 'warning' : 'normal',
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

function buildMonthlyProduction(
  events: TelemetryEvent[],
  selectedDate: Date,
  yearEnd: Date,
): ProductionPoint[] {
  return Array.from({ length: 12 }, (_, monthIndex) => {
    const month = new Date(selectedDate.getFullYear(), monthIndex, 1)
    const nextMonth = new Date(selectedDate.getFullYear(), monthIndex + 1, 1)
    return productionPoint(
      shortMonthLabel(month),
      events,
      month,
      minDate(nextMonth, yearEnd),
    )
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

function buildRecentEvents(events: TelemetryEvent[]): RecentEvent[] {
  return [...events]
    .sort(
      (left, right) => eventTime(right).getTime() - eventTime(left).getTime(),
    )
    .slice(0, 4)
    .map((event): RecentEvent => {
      const tank = tankConfigs.find(
        (config) =>
          config.flowTag === event.tag_name ||
          config.valveTag === event.tag_name,
      )

      return {
        id: event.event_id,
        time: eventTime(event),
        event: eventTitle(event, tank?.name),
        details: eventDetails(event, tank?.name),
        status:
          event.quality === 'GOOD'
            ? event.tag_name.includes('flow')
              ? 'Info'
              : 'Success'
            : 'Warning',
      }
    })
}

function eventTitle(event: TelemetryEvent, tankName?: string): string {
  if (event.tag_name === 'pump') {
    return toBoolean(event.value) ? 'Pump Started' : 'Pump Stopped'
  }

  if (event.tag_name.includes('valve')) {
    return `${tankName ?? 'Tank'} Valve ${toBoolean(event.value) ? 'Opened' : 'Closed'}`
  }

  if (event.tag_name.includes('flow')) {
    return `${tankName ?? 'Tank'} Flow Updated`
  }

  return event.tag_name
}

function eventDetails(event: TelemetryEvent, tankName?: string): string {
  if (event.tag_name === 'pump') {
    return `Pump status changed to ${formatStatus(toBoolean(event.value))}`
  }

  if (event.tag_name.includes('valve')) {
    return `${tankName ?? 'Tank'} valve is ${formatStatus(toBoolean(event.value))}`
  }

  if (event.tag_name.includes('flow')) {
    return `${tankName ?? 'Tank'} flow is ${formatFlow(toNumber(event.value))}`
  }

  return `Quality ${event.quality}`
}

function countAlerts(events: TelemetryEvent[], now: Date): number {
  const badQualityCount = events.filter(
    (event) => event.quality !== 'GOOD',
  ).length
  const latest = latestEventTime(events)
  const staleCount =
    latest && now.getTime() - latest.getTime() > 5 * 60 * 1000 ? 1 : 0

  return badQualityCount + staleCount
}

function percentChange(current: number, previous: number): number | null {
  if (previous <= 0) {
    return null
  }

  return ((current - previous) / previous) * 100
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

function addMonths(value: Date, months: number): Date {
  return new Date(value.getFullYear(), value.getMonth() + months, 1)
}

function addYears(value: Date, years: number): Date {
  return new Date(
    value.getFullYear() + years,
    value.getMonth(),
    value.getDate(),
  )
}

function minDate(left: Date, right: Date): Date {
  return left.getTime() < right.getTime() ? left : right
}

function shortMonthLabel(value: Date): string {
  return value.toLocaleDateString('en-US', { month: 'short' })
}
