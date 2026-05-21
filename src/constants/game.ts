export const STORAGE_KEYS = {
  highScore: 'memorize_high_score',
  stats: 'memorize_stats',
} as const

export const TIMING = {
  previewMs: 2000,
  hideMs: 1500,
  resultSuccessMs: 800,
  inputTimeoutMs: 6000,
} as const

export const SCORING = {
  pointsPerRound: 100,
} as const

export const THEME = {
  neon: '#7ED321',
  neonDim: '#5c9c18',
  bg: '#76C785',
  surface: '#1D8B9A',
  tileIdle: '#1D8B9A',
  error: '#FF4A4A',
} as const
