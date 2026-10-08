export function asset(name: string): string {
  return `${import.meta.env.BASE_URL}assets/${name}`
}
