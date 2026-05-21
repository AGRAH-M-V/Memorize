import { TIMING } from '../constants/game'
import type { DifficultyConfig } from '../types/game'

export function getDifficulty(level: number): DifficultyConfig {
  if (level <= 2) {
    return { gridSize: 3, highlightCount: 2, previewMs: TIMING.previewMs }
  }
  if (level <= 4) {
    return { gridSize: 3, highlightCount: 3, previewMs: TIMING.previewMs }
  }
  if (level <= 6) {
    return { gridSize: 4, highlightCount: 4, previewMs: TIMING.previewMs }
  }
  if (level <= 8) {
    return { gridSize: 4, highlightCount: 5, previewMs: TIMING.previewMs }
  }
  if (level <= 10) {
    return { gridSize: 4, highlightCount: 6, previewMs: TIMING.previewMs }
  }

  const extra = level - 11
  const gridSize = 5
  const highlightCount = Math.min(6 + Math.floor(extra / 2), 12)

  return { gridSize, highlightCount, previewMs: TIMING.previewMs }
}
