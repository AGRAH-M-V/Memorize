import { memo, useCallback } from 'react'
import { motion } from 'framer-motion'
import type { TileVisualState } from '../types/game'
import styles from './Tile.module.css'

interface TileProps {
  index: number
  state: TileVisualState
  disabled: boolean
  onSelect: (index: number) => void
}

const stateClass: Record<TileVisualState, string> = {
  idle: styles.idle,
  preview: styles.preview,
  correct: styles.correct,
  wrong: styles.wrong,
  celebrate: styles.celebrate,
}

function TileInner({ index, state, disabled, onSelect }: TileProps) {
  const handleClick = useCallback(() => {
    if (!disabled) onSelect(index)
  }, [disabled, index, onSelect])

  const shake = state === 'wrong'

  return (
    <motion.button
      type="button"
      className={`${styles.tile} ${stateClass[state]}`}
      onClick={handleClick}
      disabled={disabled && state === 'idle'}
      aria-label={`Tile ${index + 1}`}
      animate={
        shake
          ? { x: [0, -6, 6, -4, 4, 0] }
          : state === 'preview'
            ? { scale: [1, 1.05, 1] }
            : state === 'celebrate'
              ? { scale: [1, 1.05, 1] }
              : { scale: 1, x: 0 }
      }
      transition={
        state === 'preview'
          ? { duration: 0.6, repeat: Infinity, ease: 'easeInOut' }
          : shake
            ? { duration: 0.3 }
            : { duration: 0.15 }
      }
    />
  )
}

export const Tile = memo(TileInner)
