export function pluralNoun(count: number, noun: string, verb?: string) {
  const plural = count != 1
  return `${count} ${noun}${plural ? "s" : ""}${
    verb ? " " + verb + (plural ? "" : "s") : ""
  }`
}
