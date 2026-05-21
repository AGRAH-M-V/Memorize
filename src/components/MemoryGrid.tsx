import { memo, useCallback, useMemo } from 'react'
import { motion } from 'framer-motion'
import type { TileVisualState } from '../types/game'
import { Tile } from './Tile'
import styles from './MemoryGrid.module.css'

interface MemoryGridProps {
  gridSize: number
  getTileState: (index: number) => TileVisualState
  canInteract: boolean
  onSelect: (index: number) => void
}

function MemoryGridInner({
  gridSize,
  getTileState,
  canInteract,
  onSelect,
}: MemoryGridProps) {
  const total = gridSize * gridSize
  const indices = useMemo(
    () => Array.from({ length: total }, (_, i) => i),
    [total]
  )

  const handleSelect = useCallback(
    (index: number) => onSelect(index),
    [onSelect]
  )

  return (
    <motion.div
      className={styles.wrapper}
      key={gridSize}
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
    >
      <motion.div
        className={styles.grid}
        style={{
          gridTemplateColumns: `repeat(${gridSize}, 1fr)`,
        }}
      >
        {indices.map((i) => (
          <Tile
            key={i}
            index={i}
            state={getTileState(i)}
            disabled={!canInteract}
            onSelect={handleSelect}
          />
        ))}
      </motion.div>
    </motion.div>
  )
}

export const MemoryGrid = memo(MemoryGridInner)
