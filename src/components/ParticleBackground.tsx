import { memo, useMemo } from 'react'
import { motion } from 'framer-motion'
import styles from './ParticleBackground.module.css'

interface Particle {
  id: number
  x: number
  y: number
  size: number
  duration: number
  delay: number
  color: string
}

const RETRO_COLORS = ['#29adff', '#ffec27', '#ff77a8', '#00e436']

function ParticleBackgroundInner() {
  const particles = useMemo<Particle[]>(() => {
    return Array.from({ length: 20 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: 4 + Math.random() * 6, // Block size
      duration: 6 + Math.random() * 8,
      delay: Math.random() * 5,
      color: RETRO_COLORS[i % RETRO_COLORS.length],
    }))
  }, [])

  return (
    <motion.div
      className={styles.bg}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1 }}
    >
      <div className={styles.gridOverlay} />
      <div className={styles.scanlines} />
      {particles.map((p) => (
        <motion.span
          key={p.id}
          className={styles.particle}
          style={{
            left: `${p.x}%`,
            top: `${p.y}%`,
            width: p.size,
            height: p.size,
            backgroundColor: p.color,
          }}
          animate={{
            opacity: [0.1, 0.7, 0.1],
            scale: [1, 1.3, 1],
            y: [0, -40, 0],
          }}
          transition={{
            duration: p.duration,
            delay: p.delay,
            repeat: Infinity,
            ease: 'linear',
          }}
        />
      ))}
    </motion.div>
  )
}

export const ParticleBackground = memo(ParticleBackgroundInner)
