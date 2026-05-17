const MS_PER_DAY = 24 * 60 * 60 * 1000;

function parseDateOnly(value: string) {
  const [year, month, day] = value.split("-").map(Number);

  if (!year || !month || !day) {
    return null;
  }

  return new Date(Date.UTC(year, month - 1, day));
}

export function getCurrentIsoTimestamp() {
  return new Date().toISOString();
}

export function toDateOnlyString(date: Date) {
  return date.toISOString().slice(0, 10);
}

export function isDateOnOrBefore(date: string, compareDate: string) {
  const parsedDate = parseDateOnly(date);
  const parsedCompareDate = parseDateOnly(compareDate);

  if (!parsedDate || !parsedCompareDate) {
    return false;
  }

  return parsedDate.getTime() <= parsedCompareDate.getTime();
}

export function differenceInCalendarDays(fromDate: string, toDate: string) {
  const from = parseDateOnly(fromDate);
  const to = parseDateOnly(toDate);

  if (!from || !to) {
    return 0;
  }

  return Math.round((to.getTime() - from.getTime()) / MS_PER_DAY);
}
