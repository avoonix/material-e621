export interface Range {
  min: number;
  max: number;
}

export function toWholeNumber(value: unknown, range: Range, fallback: number) {
  const number = Number(value);
  if (value === null || value === "" || !Number.isFinite(number)) {
    return fallback;
  }
  return Math.min(range.max, Math.max(range.min, Math.round(number)));
}
