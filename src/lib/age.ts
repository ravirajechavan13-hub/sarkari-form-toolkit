export type AgeResult = { years: number; months: number; days: number }

function dateValue(value: string) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value))
    throw new Error('Please enter both your date of birth and the cut-off date.')
  const parsed = new Date(`${value}T00:00:00Z`)
  if (!Number.isFinite(parsed.getTime()) || parsed.toISOString().slice(0, 10) !== value)
    throw new Error('Please enter a valid calendar date.')
  return parsed
}

export function calculateAge(birthDate: string, cutoffDate: string): AgeResult {
  const start = dateValue(birthDate),
    end = dateValue(cutoffDate)
  if (start > end) throw new Error('The cut-off date must be on or after your date of birth.')
  let months =
    (end.getUTCFullYear() - start.getUTCFullYear()) * 12 + end.getUTCMonth() - start.getUTCMonth()
  // Clamp anniversaries to the last calendar day for leap years and short months.
  const anniversary = (n: number) => {
    const last = new Date(Date.UTC(start.getUTCFullYear(), start.getUTCMonth() + n + 1, 0))
    return new Date(
      Date.UTC(
        last.getUTCFullYear(),
        last.getUTCMonth(),
        Math.min(start.getUTCDate(), last.getUTCDate()),
      ),
    )
  }
  if (anniversary(months) > end) months--
  const days = Math.floor((end.getTime() - anniversary(months).getTime()) / 86400000)
  return { years: Math.floor(months / 12), months: months % 12, days }
}
