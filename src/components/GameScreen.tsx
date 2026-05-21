import { motion, AnimatePresence } from 'framer-motion'
import type { DifficultyConfig, GameSession, TileVisualState } from '../types/game'
import { HUD } from './HUD'
import { MemoryGrid } from './MemoryGrid'
import styles from './GameScreen.module.css'

interface GameScreenProps {
  session: GameSession
  difficulty: DifficultyConfig
  highScore: number
  statusText: string
  lastPoints: number
  rewardText: string | null
  attemptTimeMs: number
  roundSuccess: boolean
  canInteract: boolean
  getTileState: (index: number) => TileVisualState
  onSelect: (index: number) => void
}

export function GameScreen({
  session,
  difficulty,
  highScore,
  statusText,
  attemptTimeMs,
  canInteract,
  getTileState,
  onSelect,
}: GameScreenProps) {
  const progress =
    session.phase === 'input' && session.pattern.length > 0
      ? `${session.selected.size} / ${session.pattern.length}`
      : null

  return (
    <motion.div
      className={styles.screen}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.35 }}
    >
      <HUD
        score={session.score}
        highScore={highScore}
        level={session.level}
        phase={session.phase}
        previewMs={difficulty.previewMs}
        attemptTimeMs={attemptTimeMs}
      />

      <main className={styles.main}>


        <MemoryGrid
          gridSize={difficulty.gridSize}
          getTileState={getTileState}
          canInteract={canInteract}
          onSelect={onSelect}
        />
      </main>

      <footer className={styles.footer}>
        <AnimatePresence mode="wait">
          <motion.p
            key={statusText}
            className={styles.status}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2 }}
          >
            {statusText}
          </motion.p>
        </AnimatePresence>

        {progress && (
          <motion.span
            className={styles.progress}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            {progress}
          </motion.span>
        )}
      </footer>
    </motion.div>
  )
}
