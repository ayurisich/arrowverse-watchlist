import { useState, useMemo, useCallback, useRef, useEffect } from 'react'
import episodesData from './episodes.json'
import './App.css'

const SERIES_LIST = [
  'Arrow',
  'The Flash',
  "DC's Legends of Tomorrow",
  'Supergirl',
  'Constantine',
  'Vixen',
  'Freedom Fighters: The Ray',
  'Batwoman',
  'Black Lightning',
  'Stargirl',
  'Superman & Lois',
]

const SERIES_CLASS = {
  'Arrow': 'arrow',
  'The Flash': 'flash',
  "DC's Legends of Tomorrow": 'legends',
  'Supergirl': 'supergirl',
  'Constantine': 'constantine',
  'Vixen': 'vixen',
  'Freedom Fighters: The Ray': 'freedom-fighters',
  'Batwoman': 'batwoman',
  'Black Lightning': 'black-lightning',
  'Stargirl': 'stargirl',
  'Superman & Lois': 'superman-and-lois',
}

function loadWatched() {
  try {
    const raw = localStorage.getItem('arrowverse-watched')
    return raw ? new Set(JSON.parse(raw)) : new Set()
  } catch {
    return new Set()
  }
}

function saveWatched(set) {
  localStorage.setItem('arrowverse-watched', JSON.stringify([...set]))
}

export default function App() {
  const [excludedSeries, setExcludedSeries] = useState(new Set())
  const [colorEnabled, setColorEnabled] = useState(true)
  const [darkMode, setDarkMode] = useState(false)
  const [watched, setWatched] = useState(loadWatched)
  const [showOnlyUnwatched, setShowOnlyUnwatched] = useState(false)
  const tableWrapRef = useRef(null)

  useEffect(() => {
    document.body.classList.toggle('dark-mode', darkMode)
  }, [darkMode])

  useEffect(() => {
    if (watched.size === 0) return
    const maxNum = Math.max(...watched)
    const row = document.querySelector(`tr[data-num="${maxNum}"]`)
    row?.scrollIntoView({ block: 'center' })
  }, [])

  const toggleExclude = useCallback((series) => {
    setExcludedSeries(prev => {
      const next = new Set(prev)
      if (next.has(series)) next.delete(series)
      else next.add(series)
      return next
    })
  }, [])

  const toggleWatched = useCallback((num) => {
    setWatched(prev => {
      const next = new Set(prev)
      if (next.has(num)) next.delete(num)
      else next.add(num)
      saveWatched(next)
      return next
    })
  }, [])

  const markAllWatched = useCallback(() => {
    if (!window.confirm('Mark all episodes as watched?')) return
    const allNums = new Set(episodesData.map(e => e.num))
    saveWatched(allNums)
    setWatched(allNums)
  }, [])

  const clearWatched = useCallback(() => {
    if (!window.confirm('Clear all watched progress?')) return
    saveWatched(new Set())
    setWatched(new Set())
  }, [])

  const filtered = useMemo(() => {
    let list = episodesData.filter(ep => {
      if (excludedSeries.has(ep.series)) return false
      if (showOnlyUnwatched && watched.has(ep.num)) return false
      return true
    })
    return list
  }, [excludedSeries, showOnlyUnwatched, watched])

  const watchedVisible = filtered.filter(ep => watched.has(ep.num)).length
  const pct = filtered.length > 0 ? Math.round((watchedVisible / filtered.length) * 100) : 0

  return (
    <div className="app">
      <nav className="navbar">
        <span className="navbar-brand">Arrowverse Episode Order</span>
        <div className="navbar-links">
          <a href="https://arrowverse.info" target="_blank" rel="noreferrer">Original Site</a>
          <a href="https://github.com/ayurisich/arrowverse-watchlist" target="_blank" rel="noreferrer">Project on Github</a>
        </div>
      </nav>

      <div className="controls-wrap">
        <div className="filter-row">
          <div className="series-filter">
            {SERIES_LIST.map(s => (
              <button
                key={s}
                className={`series-btn ${SERIES_CLASS[s]}${excludedSeries.has(s) ? ' excluded' : ''}`}
                onClick={() => toggleExclude(s)}
                title={excludedSeries.has(s) ? `Show ${s}` : `Hide ${s}`}
              >
                {s}
              </button>
            ))}
          </div>
        </div>

        <div className="toggle-row">
          <button className="toggle-link" onClick={() => { tableWrapRef.current.scrollTop = tableWrapRef.current.scrollHeight }}>END</button>
          <span className="sep">|</span>
          <button className="toggle-link" onClick={() => setColorEnabled(v => !v)}>
            {colorEnabled ? 'DISABLE COLOR' : 'ENABLE COLOR'}
          </button>
          <span className="sep">|</span>
          <button className="toggle-link" onClick={() => setDarkMode(v => !v)}>
            TOGGLE DARK MODE
          </button>
          <span className="sep">|</span>
          <button className="toggle-link" onClick={() => setShowOnlyUnwatched(v => !v)}>
            {showOnlyUnwatched ? 'SHOW ALL' : 'HIDE WATCHED'}
          </button>
        </div>

        <div className="progress-wrap">
          <div className="progress-track">
            <div className="progress-fill" style={{ width: `${pct}%` }} />
          </div>
          <span className="progress-label">{watchedVisible} / {filtered.length} watched ({pct}%)</span>
          <div className="progress-actions">
            <button className="small-btn" onClick={markAllWatched}>Mark all watched</button>
            <button className="small-btn" onClick={clearWatched}>Clear all</button>
          </div>
        </div>
      </div>

      <div className="table-wrap" ref={tableWrapRef}>
        <table id="episode-list" className="ep-table">
          <thead>
            <tr>
              <th className="col-num">#</th>
              <th className="col-watched">✓</th>
              <th className="col-series">Series</th>
              <th className="col-ep">Episode</th>
              <th className="col-name">Name</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((ep) => {
              const cls = SERIES_CLASS[ep.series] || ''
              const isWatched = watched.has(ep.num)
              return (
                <tr
                  key={ep.num}
                  data-num={ep.num}
                  className={`episode${colorEnabled ? ` ${cls}` : ''}${isWatched ? ' is-watched' : ''}`}
                >
                  <td className="col-num">{ep.num}</td>
                  <td className="col-watched">
                    <input
                      type="checkbox"
                      checked={isWatched}
                      onChange={() => toggleWatched(ep.num)}
                      aria-label={`Mark ${ep.name} as watched`}
                    />
                  </td>
                  <td className="col-series">{ep.series}</td>
                  <td className="col-ep">{ep.episode}</td>
                  <td className="col-name">{ep.name}</td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}
