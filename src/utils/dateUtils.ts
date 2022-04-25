export function millisToDays(millis) {
  return Math.floor(millis / 1000 / 86400);
}

export function dateFrom(asString: string): Date {
  return new Date(Date.parse(asString));
}
export function dateAsMillis(date) {
  return date.getTime();
}

export function daysAsMillis(days) {
  return days * 86400 * 1000;
}
