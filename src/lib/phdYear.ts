/**
 * Computes human-readable PhD year string (e.g. "Year 1 of the PhD")
 * given a startedPhD string in YYYY-MM format.
 */
export function getPhdYearString(startedPhD: string, referenceDate: Date = new Date()): string {
  if (!startedPhD || startedPhD.includes('{{')) {
    return 'PhD Researcher';
  }

  const [yearStr, monthStr] = startedPhD.split('-');
  const startYear = parseInt(yearStr || '2026', 10);
  const startMonth = parseInt(monthStr || '1', 10) - 1;

  const currentYear = referenceDate.getFullYear();
  const currentMonth = referenceDate.getMonth();

  const diffMonths = (currentYear - startYear) * 12 + (currentMonth - startMonth);
  const yearNumber = Math.max(1, Math.floor(diffMonths / 12) + 1);

  return `Year ${yearNumber} of the PhD`;
}
