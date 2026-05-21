import { SCORING } from '../constants/game'
import type { RoundResult } from '../types/game'

export function calculateRoundScore(): RoundResult {
  return { pointsEarned: SCORING.pointsPerRound }
}
