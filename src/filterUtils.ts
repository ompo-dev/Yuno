export function normalizeSearchQuery(value: string) {
  return value.trim().toLowerCase();
}

export function toggleFilterValue(values: string[], nextValue: string) {
  return values.includes(nextValue)
    ? values.filter((value) => value !== nextValue)
    : [...values, nextValue];
}
