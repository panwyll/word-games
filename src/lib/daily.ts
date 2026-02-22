/** Start date for computing daily puzzle indices. */
const EPOCH = new Date('2024-01-01').getTime();

export function getDailyIndex(listLength: number): number {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const days = Math.floor((today.getTime() - EPOCH) / (1000 * 60 * 60 * 24));
  return ((days % listLength) + listLength) % listLength;
}
