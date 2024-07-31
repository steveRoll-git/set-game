export function random(min: number, max: number) {
  return min + Math.random() * (max - min)
}

export function randomInt(min: number, max: number) {
  return Math.floor(random(min, max))
}
