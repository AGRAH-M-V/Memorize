import { memo, useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import styles from './DemoGrid.module.css'

const DEMO_SIZE = 3
const DEMO_INDICES = [0, 4, 7, 2, 6]

function DemoGridInner() {
  const [active, setActive] = useState<number[]>([])

  useEffect(() => {
    let step = 0
    const run = () => {
      const count = 2 + (step % 3)
      const shuffled = [...DEMO_INDICES].sort(() => Math.random() - 0.5)
      setActive(shuffled.slice(0, count))
      step++
    }
    run()
    const id = setInterval(run, 2200)
    return () => clearInterval(id)
  }, [])

  return (
    <div className={styles.wrapper}>
      <div className={styles.grid}>
        {Array.from({ length: DEMO_SIZE * DEMO_SIZE }, (_, i) => (
          <motion.div
            key={i}
            className={styles.tile}
            animate={
              active.includes(i)
                ? {
                    backgroundColor: '#ffec27',
                  }
                : {
                    backgroundColor: '#2a2b3d',
                  }
            }
            transition={{ duration: 0.15 }}
          />
        ))}
      </div>
      <AnimatePresence>
        {active.length > 0 && (
          <motion.div
            className={styles.glow}
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.15 }}
            exit={{ opacity: 0 }}
          />
        )}
      </AnimatePresence>
    </div>
  )
}

export const DemoGrid = memo(DemoGridInner)
