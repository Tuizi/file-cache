/**
 * Returns the number of seconds until the end of the current day.
 * @returns The number of seconds until the end of the current day.
 */
export function endOfDay(): number {
  const now = new Date();
  const endOfDay = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate(),
    23,
    59,
    59,
    999
  );
  return Math.round((endOfDay.getTime() - now.getTime()) / 1000);
}

/**
 * Returns the number of seconds in the given number of days.
 * @param numDays The number of days.
 * @returns The number of seconds in the given number of days.
 */
export function days(numDays: number): number {
  return hours(24) * numDays;
}

/**
 * Returns the number of seconds in the given number of hours.
 * @param numHours The number of hours.
 * @returns The number of seconds in the given number of hours.
 */
export function hours(numHours: number): number {
  return minutes(60) * numHours;
}

/**
 * Returns the number of seconds in the given number of minutes.
 * @param numMinutes The number of minutes.
 * @returns The number of seconds in the given number of minutes.
 */
export function minutes(numMinutes: number): number {
  return numMinutes * 60;
}
