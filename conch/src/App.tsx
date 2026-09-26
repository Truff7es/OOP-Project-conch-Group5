import { useEffect, useRef, useState } from 'react'
import Navbar from './components/Navbar'
import FilterGroup from './components/FilterGroup'
import HeroInput from './components/HeroInput'

const getInitialTheme = (): 'light' | 'dark' => {
  if (typeof window === 'undefined') {
    return 'light'
  }

  const storedTheme = localStorage.getItem('theme')
  return storedTheme === 'dark' || storedTheme === 'light' ? storedTheme : 'light'
}

export default function App() {
  const [theme, setTheme] = useState<'light' | 'dark'>(getInitialTheme)
  const [difficulty, setDifficulty] = useState('easy')
  const [mode, setMode] = useState('all')
  const [questions, setQuestions] = useState('5')

  const lightModeSoundRef = useRef<HTMLAudioElement | null>(null)
  const darkModeSoundRef = useRef<HTMLAudioElement | null>(null)

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme)
    localStorage.setItem('theme', theme)
  }, [theme])

  useEffect(() => {
    const lightAudio = new Audio('/assets/sfx/lightmodereal.wav')
    const darkAudio = new Audio('/assets/sfx/darkmodereal.wav')

    lightAudio.preload = 'auto'
    darkAudio.preload = 'auto'

    lightModeSoundRef.current = lightAudio
    darkModeSoundRef.current = darkAudio
  }, [])

  const playThemeSound = (audio: HTMLAudioElement | null) => {
    if (!audio) {
      return
    }

    audio.currentTime = 0
    audio.play().catch((error) => {
      console.warn('Audio playback prevented:', error)
    })
  }

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light'
    setTheme(newTheme)

    if (newTheme === 'dark') {
      playThemeSound(darkModeSoundRef.current)
    } else {
      playThemeSound(lightModeSoundRef.current)
    }
  }

  return (
    <div className="app-shell">
      <div className="app-frame">
        <Navbar theme={theme} onToggleTheme={toggleTheme} />

        <div className="subheader">
          <FilterGroup
            label="difficulty"
            options={['easy', 'normal', 'hard']}
            icons={['child_care', 'school', 'history_edu']}
            selected={difficulty}
            onSelect={setDifficulty}
          />
          <FilterGroup
            label="mode"
            options={['all', 'mc', 'true/false', 'fill-in']}
            icons={['apps', 'list_alt', 'rule', 'keyboard']}
            selected={mode}
            onSelect={setMode}
          />
          <FilterGroup
            label="questions"
            options={['5', '10', '20', 'custom']}
            icons={['', '', '', 'tune']}
            selected={questions}
            onSelect={setQuestions}
          />
        </div>

        <div className="hero">
          <HeroInput />
        </div>
      </div>
    </div>
  )
}