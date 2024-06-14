export function capitalize(s: string) {
  if (!s.length) return s;
  return `${s[0].toUpperCase()}${s.slice(1)}`;
}
