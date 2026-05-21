import { AnimatePresence } from 'framer-motion'
import { useCallback } from 'react'
import { GameOverScreen } from './components/GameOverScreen'
import { GameScreen } from './components/GameScreen'
import { HomeScreen } from './components/HomeScreen'
import { ParticleBackground } from './components/ParticleBackground'
import { useGame } from './hooks/useGame'
import styles from './App.module.css'

function App() {
  const game = useGame()

  const handleStart = useCallback(() => {
    game.startGame()
  }, [game])

  const handleSelect = useCallback(
    (index: number) => {
      game.selectTile(index)
    },
    [game]
  )

  const handleRestart = useCallback(() => {
    game.restart()
  }, [game])

  return (
    <div className={styles.app}>
      <ParticleBackground />

      <AnimatePresence mode="wait">
        {game.screen === 'home' && (
          <HomeScreen
            key="home"
            highScore={game.highScore}
            onStart={handleStart}
          />
        )}

        {game.screen === 'playing' && (
          <GameScreen
            key="playing"
            session={game.session}
            difficulty={game.difficulty}
            highScore={game.highScore}
            statusText={game.statusText}
            lastPoints={game.lastPoints}
            rewardText={game.rewardText}
            roundSuccess={game.roundSuccess}
            attemptTimeMs={game.attemptTimeMs}
            canInteract={game.canInteract}
            getTileState={game.getTileState}
            onSelect={handleSelect}
          />
        )}

        {game.screen === 'gameover' && game.gameOverData && (
          <GameOverScreen
            key="gameover"
            data={game.gameOverData}
            onRestart={handleRestart}
            onHome={game.goHome}
          />
        )}
      </AnimatePresence>
    </div>
  )
}

export default App
