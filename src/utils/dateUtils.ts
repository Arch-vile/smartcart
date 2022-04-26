export function millisToDays(millis: number): number {
  return Math.floor(millis / 1000 / 86400);
}

export function dateFrom(asString: string): Date {
  return new Date(Date.parse(asString));
}
export function dateAsMillis(date: Date): number {
  return date.getTime();
}

export function daysAsMillis(days: number): number {
  return days * 86400 * 1000;
}
