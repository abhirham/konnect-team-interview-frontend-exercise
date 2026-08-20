// Shortens a developer's full name to "First L." for the compact version rows.
export function developerName(name: string): string {
  const [first, last = ''] = name.split(' ')

  if (!last) {
    return first
  }

  return `${first} ${last[0]}.`
}
