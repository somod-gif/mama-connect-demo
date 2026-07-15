export function computePregnancyWeek(edd: string | null | undefined): number {
  if (!edd) return 0;
  const due = new Date(edd);
  const msRemaining = due.getTime() - Date.now();
  const totalWeeks = 40 - Math.round(msRemaining / (1000 * 60 * 60 * 24 * 7));
  return Math.max(1, Math.min(42, totalWeeks));
}
