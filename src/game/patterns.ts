export function generatePattern(
  gridSize: number,
  count: number,
  previousPattern: number[] = []
): number[] {
  const total = gridSize * gridSize
  const maxAttempts = 50

  for (let attempt = 0; attempt < maxAttempts; attempt++) {
    const all = Array.from({ length: total }, (_, i) => i)
    shuffle(all)
    const pattern = all.slice(0, count).sort((a, b) => a - b)
    if (!patternsEqual(pattern, previousPattern)) {
      return pattern
    }
  }

  // Fallback (rarely needed): shuffle and slice again
  const all = Array.from({ length: total }, (_, i) => i)
  shuffle(all)
  return all.slice(0, count).sort((a, b) => a - b)
}

function patternsEqual(a: number[], b: number[]): boolean {
  if (a.length !== b.length) return false
  return a.every((v, i) => v === b[i])
}

function shuffle<T>(arr: T[]): void {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[arr[i], arr[j]] = [arr[j], arr[i]]
  }
}
