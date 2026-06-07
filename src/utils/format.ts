const litersFormatter = new Intl.NumberFormat('en-US', {
  maximumFractionDigits: 0,
})

const flowFormatter = new Intl.NumberFormat('en-US', {
  maximumFractionDigits: 1,
})

const percentFormatter = new Intl.NumberFormat('en-US', {
  maximumFractionDigits: 1,
  signDisplay: 'exceptZero',
})

const timeFormatter = new Intl.DateTimeFormat('en-US', {
  month: 'short',
  day: '2-digit',
  hour: '2-digit',
  minute: '2-digit',
})

const clockFormatter = new Intl.DateTimeFormat('en-US', {
  hour: '2-digit',
  minute: '2-digit',
  second: '2-digit',
})

const dateInputFormatter = new Intl.DateTimeFormat('en-CA', {
  year: 'numeric',
  month: '2-digit',
  day: '2-digit',
})

export function formatLiters(value: number): string {
  return `${litersFormatter.format(value)} L`
}

export function formatFlow(value: number | null): string {
  if (value === null) {
    return 'No data'
  }

  return `${flowFormatter.format(value)} L/min`
}

export function formatTimestamp(value: Date | null): string {
  if (!value) {
    return 'No samples'
  }

  return timeFormatter.format(value)
}

export function formatClock(value: Date | null): string {
  if (!value) {
    return 'No samples'
  }

  return clockFormatter.format(value)
}

export function formatDateInput(value: Date): string {
  return dateInputFormatter.format(value)
}

export function formatPercentChange(
  value: number | null,
  previousYear: number,
): string {
  if (value === null) {
    return `No ${previousYear} data`
  }

  return `${percentFormatter.format(value)}% vs ${previousYear}`
}

export function formatStatus(value: boolean | null): string {
  if (value === null) {
    return 'Unknown'
  }

  return value ? 'On' : 'Off'
}
