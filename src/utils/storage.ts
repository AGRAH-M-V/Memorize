import { STORAGE_KEYS } from '../constants/game'

export function getHighScore(): number {
  try {
    return Number(localStorage.getItem(STORAGE_KEYS.highScore)) || 0
  } catch {
    return 0
  }
}

export function saveHighScore(score: number): number {
  const current = getHighScore()
  if (score > current) {
    localStorage.setItem(STORAGE_KEYS.highScore, String(score))
    return score
  }
  return current
}

export function updateStats(level: number): void {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.stats)
    let stats = { totalGames: 0, bestLevel: 0 }
    if (raw) {
      try {
        stats = JSON.parse(raw)
      } catch {
        /* ignore parse error */
      }
    }
    const updated = {
      totalGames: stats.totalGames + 1,
      bestLevel: Math.max(stats.bestLevel, level),
    }
    localStorage.setItem(STORAGE_KEYS.stats, JSON.stringify(updated))
  } catch {
    /* ignore */
  }
}
