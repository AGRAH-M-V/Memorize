import { useCallback, useEffect, useRef, useState } from 'react'
import { TIMING } from '../constants/game'
import { getDifficulty } from '../game/difficulty'
import { generatePattern } from '../game/patterns'
import { calculateRoundScore } from '../game/scoring'
import type {
  DifficultyConfig,
  GameSession,
  Screen,
  TileVisualState,
} from '../types/game'
import { getHighScore, saveHighScore, updateStats } from '../utils/storage'

const INITIAL_SESSION: GameSession = {
  level: 1,
  score: 0,
  pattern: [],
  selected: new Set(),
  phase: 'preview',
  inputStartedAt: null,
  inputPhaseStartedAt: null,
}

export interface GameOverData {
  score: number
  highScore: number
  isNewHighScore: boolean
  level: number
}

export function useGame() {
  const [screen, setScreen] = useState<Screen>('home')
  const [session, setSession] = useState<GameSession>(INITIAL_SESSION)
  const [difficulty, setDifficulty] = useState<DifficultyConfig>(
    getDifficulty(1)
  )
  const [highScore, setHighScore] = useState(getHighScore)
  const [statusText, setStatusText] = useState('Watch the pattern…')
  const [gameOverData, setGameOverData] = useState<GameOverData | null>(null)
  const [lastPoints, setLastPoints] = useState(0)
  const [attemptTimeMs, setAttemptTimeMs] = useState(0)
  const [roundSuccess, setRoundSuccess] = useState(false)
  const [rewardText, setRewardText] = useState<string | null>(null)
  const [feedback, setFeedback] = useState<'success' | 'error' | null>(null)

  const previousPattern = useRef<number[]>([])
  const timers = useRef<ReturnType<typeof setTimeout>[]>([])
  const [roundTick, setRoundTick] = useState(0)
  const roundId = useRef(0)
  const sessionRef = useRef(session)
  sessionRef.current = session

  const clearTimers = useCallback(() => {
    timers.current.forEach(clearTimeout)
    timers.current = []
  }, [])

  const schedule = useCallback((fn: () => void, ms: number) => {
    const id = setTimeout(fn, ms)
    timers.current.push(id)
  }, [])

  const startRound = useCallback((level: number, prevPattern: number[] = []) => {
    roundId.current += 1
    setRoundTick((t) => t + 1)
    const diff = getDifficulty(level)
    const pattern = generatePattern(
      diff.gridSize,
      diff.highlightCount,
      prevPattern
    )
    previousPattern.current = pattern
    setDifficulty(diff)
    setRoundSuccess(false)
    setRewardText(null)
    setFeedback(null)
    setLastPoints(0)
    setSession({
      level,
      score: sessionRef.current.score,
      pattern,
      selected: new Set(),
      phase: 'preview',
      inputStartedAt: null,
      inputPhaseStartedAt: null,
    })
    setStatusText('Watch the pattern…')
  }, [])

  const startGame = useCallback(() => {
    clearTimers()
    setGameOverData(null)
    const initialSession = { ...INITIAL_SESSION }
    setSession(initialSession)
    sessionRef.current = initialSession
    setScreen('playing')
    startRound(1)
  }, [clearTimers, startRound])

  const endGame = useCallback(
    (finalSession: GameSession) => {
      clearTimers()
      const prevHigh = getHighScore()
      const newHigh = saveHighScore(finalSession.score)
      setHighScore(newHigh)
      updateStats(finalSession.level)
      setGameOverData({
        score: finalSession.score,
        highScore: newHigh,
        isNewHighScore: finalSession.score > prevHigh,
        level: finalSession.level,
      })
      setScreen('gameover')
    },
    [clearTimers]
  )

  const completeRound = useCallback(
    (current: GameSession) => {
      const result = calculateRoundScore()
      const rewardLabels = ['Perfect!', 'Awesome!', 'Brilliant!', 'Flawless!', 'Legendary!']
      const rewardIndex = Math.min(rewardLabels.length - 1, Math.floor(current.level / 3))
      const reward = rewardLabels[rewardIndex] || rewardLabels[0]

      setLastPoints(result.pointsEarned)
      setRoundSuccess(true)
      setRewardText(reward)
      setFeedback('success')
      setStatusText('Next round…')

      const updated: GameSession = {
        ...current,
        score: current.score + result.pointsEarned,
        phase: 'result',
      }

      setSession(updated)

      schedule(() => {
        startRound(updated.level + 1, previousPattern.current)
      }, TIMING.resultSuccessMs)
    },
    [schedule, startRound]
  )

  const selectTile = useCallback(
    (index: number) => {
      const current = sessionRef.current
      if (current.phase !== 'input') return
      if (current.selected.has(index)) return

      const nextSelected = new Set(current.selected)
      nextSelected.add(index)

      if (!current.pattern.includes(index)) {
        const failed: GameSession = {
          ...current,
          selected: nextSelected,
          phase: 'result',
        }
        setSession(failed)
        setFeedback('error')
        setStatusText('Wrong tile!')
        schedule(() => endGame(failed), 600)
        return
      }

      const updated: GameSession = {
        ...current,
        selected: nextSelected,
        inputStartedAt: current.inputStartedAt ?? performance.now(),
      }

      if (nextSelected.size === current.pattern.length) {
        completeRound(updated)
      } else {
        setSession(updated)
      }
    },
    [completeRound, endGame, schedule]
  )

  // Phase timers keyed by roundId only — do NOT depend on session.phase,
  // or cleanup cancels the input timer when preview→hide fires.
  useEffect(() => {
    if (screen !== 'playing') return

    const thisRound = roundId.current
    const previewMs = difficulty.previewMs

    const hideTimer = setTimeout(() => {
      if (roundId.current !== thisRound) return
      setSession((s) => ({ ...s, phase: 'hide' }))
      setStatusText('Memorize…')
    }, previewMs)

    const inputTimer = setTimeout(() => {
      if (roundId.current !== thisRound) return
      setSession((s) => ({
        ...s,
        phase: 'input',
        inputPhaseStartedAt: performance.now(),
      }))
      setStatusText('Tap the tiles you remember')
    }, previewMs + TIMING.hideMs)

    return () => {
      clearTimeout(hideTimer)
      clearTimeout(inputTimer)
    }
  }, [screen, roundTick, difficulty.previewMs])

  useEffect(() => {
    if (screen !== 'playing') return
    if (session.phase !== 'input') {
      setAttemptTimeMs(0)
      return
    }

    const start = performance.now()
    setAttemptTimeMs(0)

    const intervalId = setInterval(() => {
      setAttemptTimeMs(Math.round(performance.now() - start))
    }, 100)
    const timeoutId = setTimeout(() => {
      if (session.phase !== 'input') return
      setAttemptTimeMs(TIMING.inputTimeoutMs)
      setFeedback('error')
      setStatusText("Time's up!")
      const failedSession: GameSession = {
        ...sessionRef.current,
        phase: 'result'
      }
      setSession(failedSession)
      schedule(() => endGame(failedSession), 600)
    }, TIMING.inputTimeoutMs)

    timers.current.push(intervalId)
    timers.current.push(timeoutId)

    return () => {
      clearInterval(intervalId)
      clearTimeout(timeoutId)
    }
  }, [screen, session.phase, endGame, schedule])

  useEffect(() => () => clearTimers(), [clearTimers])

  const getTileState = useCallback(
    (index: number): TileVisualState => {
      const { phase, pattern, selected } = session

      if (phase === 'preview' && pattern.includes(index)) return 'preview'

      if (selected.has(index)) {
        return pattern.includes(index) ? 'correct' : 'wrong'
      }

      if (phase === 'result' && roundSuccess && pattern.includes(index)) {
        return 'celebrate'
      }

      return 'idle'
    },
    [session, roundSuccess]
  )

  const canInteract = session.phase === 'input'

  const goHome = useCallback(() => {
    clearTimers()
    setScreen('home')
    setGameOverData(null)
  }, [clearTimers])

  const restart = useCallback(() => {
    startGame()
  }, [startGame])

  return {
    screen,
    session,
    difficulty,
    highScore,
    statusText,
    gameOverData,
    lastPoints,
    attemptTimeMs,
    roundSuccess,
    rewardText,
    canInteract,
    getTileState,
    selectTile,
    startGame,
    restart,
    goHome,
    feedback,
  }
}
