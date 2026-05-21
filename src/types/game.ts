export type Screen = 'home' | 'playing' | 'gameover'

export type GamePhase = 'preview' | 'hide' | 'input' | 'result'

export type TileVisualState =
  | 'idle'
  | 'preview'
  | 'correct'
  | 'wrong'
  | 'celebrate'

export interface DifficultyConfig {
  gridSize: number
  highlightCount: number
  previewMs: number
}

export interface GameStats {
  totalGames: number
  bestLevel: number
}

export interface RoundResult {
  pointsEarned: number
}

export interface GameSession {
  level: number
  score: number
  pattern: number[]
  selected: Set<number>
  phase: GamePhase
  inputStartedAt: number | null
  inputPhaseStartedAt: number | null
}
