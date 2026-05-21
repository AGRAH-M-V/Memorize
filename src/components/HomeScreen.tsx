import { motion } from 'framer-motion'
import { DemoGrid } from './DemoGrid'
import styles from './HomeScreen.module.css'

interface HomeScreenProps {
  highScore: number
  onStart: () => void
}

export function HomeScreen({ highScore, onStart }: HomeScreenProps) {
  return (
    <motion.div
      className={styles.screen}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, scale: 0.98 }}
      transition={{ duration: 0.4 }}
    >
      <DemoGrid />

      <div className={styles.content}>
        <motion.div
          className={styles.logoWrap}
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.1, duration: 0.6 }}
        >
          <h1 className={styles.title}>MEMORIZE</h1>
          <motion.div
            className={styles.titleGlow}
            animate={{ opacity: [0.4, 0.8, 0.4] }}
            transition={{ duration: 3, repeat: Infinity }}
          />
          <p className={styles.subtitle}>
            Memorize the glow. Recall the pattern.
          </p>
        </motion.div>

        {highScore > 0 && (
          <motion.div
            className={styles.highScoreCard}
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.25 }}
          >
            <span className={styles.hsLabel}>Best Score</span>
            <span className={styles.hsValue}>{highScore.toLocaleString()}</span>
          </motion.div>
        )}

        <motion.button
          type="button"
          className={styles.startBtn}
          onClick={onStart}
          initial={{ y: 15, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.35, duration: 0.2 }}
        >
          <span className={styles.startBtnText}>Start Game</span>
        </motion.button>

        <motion.p
          className={styles.hint}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          Train your visual memory
        </motion.p>
      </div>
    </motion.div>
  )
}
