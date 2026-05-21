import { motion } from 'framer-motion'
import type { GameOverData } from '../hooks/useGame'
import { AnimatedScore } from './AnimatedScore'
import styles from './GameOverScreen.module.css'

interface GameOverScreenProps {
  data: GameOverData
  onRestart: () => void
  onHome: () => void
}

export function GameOverScreen({ data, onRestart, onHome }: GameOverScreenProps) {
  const handleShare = async () => {
    const text = `I scored ${data.score} on Memorize! Level ${data.level}. Can you beat me?`
    if (navigator.share) {
      try {
        await navigator.share({ title: 'Memorize', text })
      } catch {
        /* cancelled */
      }
    } else {
      await navigator.clipboard.writeText(text)
    }
  }

  return (
    <motion.div
      className={styles.screen}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4 }}
    >
      <motion.div
        className={styles.backdrop}
        initial={{ backdropFilter: 'blur(0px)' }}
        animate={{ backdropFilter: 'blur(16px)' }}
      />

      <motion.div
        className={styles.card}
        initial={{ scale: 0.85, opacity: 0, y: 30 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        transition={{ type: 'spring', stiffness: 300, damping: 28, delay: 0.1 }}
      >
        <h2 className={styles.heading}>Game Over</h2>

        {data.isNewHighScore && (
          <motion.span
            className={styles.newRecord}
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', delay: 0.4 }}
          >
            New High Score!
          </motion.span>
        )}

        <div className={styles.scoreBlock}>
          <span className={styles.scoreLabel}>Final Score</span>
          <AnimatedScore value={data.score} className={styles.scoreValue} />
        </div>

        <motion.div
          className={styles.stats}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          <div className={styles.statItem}>
            <span className={styles.statLabel}>Best</span>
            <span className={styles.statValue}>{data.highScore.toLocaleString()}</span>
          </div>
          <div className={styles.statItem}>
            <span className={styles.statLabel}>Level</span>
            <span className={styles.statValue}>{data.level}</span>
          </div>
        </motion.div>

        <div className={styles.actions}>
          <button
            type="button"
            className={styles.primaryBtn}
            onClick={onRestart}
          >
            Play Again
          </button>
          <button
            type="button"
            className={styles.secondaryBtn}
            onClick={handleShare}
          >
            Share Score
          </button>
          <button
            type="button"
            className={styles.homeBtn}
            onClick={onHome}
          >
            Back to Home
          </button>
        </div>
      </motion.div>
    </motion.div>
  )
}
