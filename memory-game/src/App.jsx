import { useEffect, useMemo, useRef, useState } from 'react'
import './App.css'

const EMOJIS = ['🍎','🍌','🍇','🍓','🍑','🥝','🍍','🥥']

function shuffle(array) {
  const arr = array.slice()
  for (let i = arr.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[arr[i], arr[j]] = [arr[j], arr[i]]
  }
  return arr
}

function createDeck() {
  const base = EMOJIS.map((emoji, idx) => ({ id: `a-${idx}`, emoji }))
  const pairs = base.map((c, i) => ({ id: `b-${i}`, emoji: c.emoji }))
  const deck = shuffle([...base, ...pairs]).map((card, idx) => ({
    key: `${card.id}-${idx}`,
    emoji: card.emoji,
    flipped: false,
    matched: false,
  }))
  return deck
}

function useTimer(isRunning) {
  const [seconds, setSeconds] = useState(0)
  useEffect(() => {
    if (!isRunning) return
    const id = setInterval(() => setSeconds((s) => s + 1), 1000)
    return () => clearInterval(id)
  }, [isRunning])
  return [seconds, setSeconds]
}

function App() {
  const [deck, setDeck] = useState(() => createDeck())
  const [first, setFirst] = useState(null)
  const [second, setSecond] = useState(null)
  const [isBusy, setIsBusy] = useState(false)
  const [moves, setMoves] = useState(0)
  const [running, setRunning] = useState(false)
  const [seconds, setSeconds] = useTimer(running)
  const [mismatchPair, setMismatchPair] = useState(null)
  const [isShuffling, setIsShuffling] = useState(false)
  const bestKey = 'memory_game_best_seconds'
  const best = useMemo(() => {
    const v = localStorage.getItem(bestKey)
    return v ? parseInt(v, 10) : null
  }, [])
  const bestRef = useRef(best)

  useEffect(() => {
    const allMatched = deck.every((c) => c.matched)
    if (allMatched && deck.length > 0) {
      setRunning(false)
      if (bestRef.current == null || seconds < bestRef.current) {
        localStorage.setItem(bestKey, String(seconds))
        bestRef.current = seconds
      }
    }
  }, [deck, seconds])

  function resetGame() {
    setIsShuffling(true)
    setDeck(createDeck())
    setFirst(null)
    setSecond(null)
    setMoves(0)
    setSeconds(0)
    setRunning(false)
    setMismatchPair(null)
    setTimeout(() => setIsShuffling(false), 700)
  }

  function flipCard(index) {
    if (isBusy) return
    const card = deck[index]
    if (card.flipped || card.matched) return
    if (!running) setRunning(true)

    const newDeck = deck.slice()
    newDeck[index] = { ...card, flipped: true }
    setDeck(newDeck)

    if (first == null) {
      setFirst(index)
      return
    }

    if (second == null) {
      setSecond(index)
      setIsBusy(true)
      setMoves((m) => m + 1)

      setTimeout(() => {
        const f = newDeck[first]
        const s = newDeck[index]
        if (f.emoji === s.emoji) {
          const updated = newDeck.map((c, i) =>
            i === first || i === index ? { ...c, matched: true } : c
          )
          setDeck(updated)
        } else {
          setMismatchPair([first, index])
          const reverted = newDeck.map((c, i) =>
            i === first || i === index ? { ...c, flipped: false } : c
          )
          setDeck(reverted)
        }
        setFirst(null)
        setSecond(null)
        setIsBusy(false)
        setTimeout(() => setMismatchPair(null), 350)
      }, 600)
    }
  }

  const unmatchedLeft = deck.filter((c) => !c.matched).length
  const bestSeconds = bestRef.current
  const allMatched = deck.length > 0 && deck.every((c) => c.matched)
  const confettiPieces = useMemo(() => Array.from({ length: 40 }, (_, i) => i), [])

  return (
    <div className="app">
      <header className="app-header">
        <h1>Memory Game</h1>
        <div className="stats">
          <div><span className="label">Moves:</span> {moves}</div>
          <div><span className="label">Time:</span> {seconds}s</div>
          <div><span className="label">Left:</span> {unmatchedLeft}</div>
          <div className="best">
            <span className="label">Best:</span> {bestSeconds != null ? `${bestSeconds}s` : '—'}
          </div>
        </div>
        <div className="actions">
          <button className="btn-primary new-game" onClick={resetGame} disabled={isBusy}>
            <span className="btn-glow" />
            <span className="btn-label">New Game</span>
          </button>
        </div>
      </header>

      <main className={`board ${isShuffling ? 'shuffling' : ''}`} aria-label="Memory board">
        {deck.map((card, index) => {
          const isMismatch = mismatchPair && (mismatchPair[0] === index || mismatchPair[1] === index)
          const cls = `card ${card.flipped || card.matched ? 'flipped' : ''} ${card.matched ? 'matched' : ''} ${isMismatch ? 'mismatch' : ''}`
          return (
            <button
              key={card.key}
              className={cls}
              onClick={() => flipCard(index)}
              disabled={isBusy || card.matched}
              aria-label={card.flipped || card.matched ? `Card ${card.emoji}` : 'Hidden card'}
              style={{ animationDelay: `${index * 40}ms` }}
              onMouseMove={(e) => {
                const el = e.currentTarget
                const rect = el.getBoundingClientRect()
                const px = (e.clientX - rect.left) / rect.width
                const py = (e.clientY - rect.top) / rect.height
                const ry = (px - 0.5) * 12
                const rx = (0.5 - py) * 12
                el.style.setProperty('--rx', `${rx.toFixed(2)}deg`)
                el.style.setProperty('--ry', `${ry.toFixed(2)}deg`)
                el.style.setProperty('--gx', `${px * 100}%`)
                el.style.setProperty('--gy', `${py * 100}%`)
              }}
              onMouseLeave={(e) => {
                const el = e.currentTarget
                el.style.setProperty('--rx', '0deg')
                el.style.setProperty('--ry', '0deg')
                el.style.setProperty('--gx', '50%')
                el.style.setProperty('--gy', '50%')
              }}
            >
              <span className="card-inner">
                <span className="card-front">{card.emoji}</span>
                <span className="card-back">?</span>
              </span>
            </button>
          )
        })}
      </main>

      <footer className="footer">
        <small>Match all pairs to win. Emojis are randomly shuffled each game.</small>
      </footer>

      {allMatched && (
        <div className="win-overlay" role="dialog" aria-live="polite">
          <div className="win-card">
            <h2>You win! 🎉</h2>
            <p>Time: {seconds}s • Moves: {moves}</p>
            <div className="overlay-actions">
              <button onClick={resetGame}>Play Again</button>
            </div>
          </div>
          <div className="confetti">
            {confettiPieces.map((i) => (
              <span key={i} style={{ left: `${(i * 97) % 100}%`, animationDelay: `${(i % 10) * 120}ms` }} />
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export default App
