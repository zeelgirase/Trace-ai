export function isNonEmptyString(value) { return typeof value === 'string' && value.trim().length > 0; }
export function isIsoDate(value) { return typeof value === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(value) && !Number.isNaN(Date.parse(`${value}T00:00:00Z`)); }
export function validateDateRange(start, end) { const errors = []; if (!isIsoDate(start)) errors.push('Start date must use YYYY-MM-DD.'); if (!isIsoDate(end)) errors.push('End date must use YYYY-MM-DD.'); if (!errors.length && start > end) errors.push('Start date must be on or before end date.'); return errors; }
