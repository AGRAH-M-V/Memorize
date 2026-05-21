import { memo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { TIMING } from '../constants/game'
import styles from './HUD.module.css'

interface HUDProps {
  score: number
  highScore: number
  level: number
  phase: string
  previewMs: number
  attemptTimeMs: number
}

function formatTimer(ms: number) {
  const seconds = Math.floor(ms / 1000)
  const tenths = Math.floor((ms % 1000) / 100)
  return `${seconds}.${tenths}s`
}

const CoinIcon = () => (
  <svg viewBox="0 0 8 8" className={styles.icon} fill="#ffcc00">
    <path d="M2 1h4v1H2zm-1 1h6v1H1zm-1 1h8v2H0zm1 2h6v1H1zm2 1h4v1H2zm0-4h2v2H3z" />
  </svg>
)

const TrophyIcon = () => (
  <svg viewBox="0 0 8 8" className={styles.icon} fill="#ff77a8">
    <path d="M1 1h6v1H1zm0 1h6v1H1zm1 1h4v1H2zm2 1h1v2H4zm-1 2h3v1H3zm-2 1h6v1H1zm0 1h6v1H1z" />
  </svg>
)

function HUDInner({
  score,
  highScore,
  level,
  phase,
  previewMs,
  attemptTimeMs,
}: HUDProps) {
  const showPreviewTimer = phase === 'preview'
  const showAttemptTimer = phase === 'input'
  const timeLeftMs = Math.max(TIMING.inputTimeoutMs - attemptTimeMs, 0)

  return (
    <header className={styles.hud}>
      <div className={styles.topRow}>
        <motion.div
          className={styles.stat}
          key={score}
          initial={{ scale: 1.15 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.15 }}
        >
          <span className={styles.label}>
            <CoinIcon /> SCORE
          </span>
          <span className={styles.value}>{score.toLocaleString()}</span>
        </motion.div>

        <div className={styles.statCenter}>
          <span className={styles.levelBadge}>LVL {level}</span>
        </div>

        <div className={styles.statRight}>
          <span className={styles.label}>
            <TrophyIcon /> BEST
          </span>
          <span className={styles.valueMuted}>{highScore.toLocaleString()}</span>
        </div>
      </div>

      <div className={styles.timerArea}>
        <AnimatePresence mode="wait">
          {showPreviewTimer && (
            <motion.div
              key="preview"
              className={styles.timerWrap}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.1 }}
            >
              <div className={styles.progressBarBg}>
                <motion.div
                  className={styles.timer}
                  initial={{ scaleX: 1 }}
                  animate={{ scaleX: 0 }}
                  transition={{ duration: previewMs / 1000, ease: 'linear' }}
                  style={{ transformOrigin: 'left' }}
                />
              </div>
            </motion.div>
          )}

          {showAttemptTimer && (
            <motion.div
              key="attempt"
              className={styles.timerInfo}
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 4 }}
              transition={{ duration: 0.1 }}
            >
              <span className={styles.timerLabel}>TIME LIMIT</span>
              <span className={styles.timerValue}>{formatTimer(timeLeftMs)}</span>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </header>
  )
}

export const HUD = memo(HUDInner)
