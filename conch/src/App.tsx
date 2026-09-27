import { useEffect, useRef, useState } from 'react'
import Navbar from './components/Navbar'
import FilterGroup from './components/FilterGroup'
import HeroInput from './components/HeroInput'
import QuestionCard from './components/QuestionCard'
import lightModeSound from './assets/sfx/lightmodereal.wav'
import darkModeSound from './assets/sfx/darkmodereal.wav'

type Theme = 'light' | 'dark'

const getInitialTheme = (): Theme => {
  if (typeof window === 'undefined') {
    return 'light'
  }

  const storedTheme = localStorage.getItem('theme')

  return storedTheme === 'dark' || storedTheme === 'light'
    ? storedTheme
    : 'light'
}

export default function App() {
  const [theme, setTheme] = useState<Theme>(getInitialTheme)
  const [difficulty, setDifficulty] = useState('easy')
  const [mode, setMode] = useState('all')
  const [questions, setQuestions] = useState('5')

  // Group audio instances into a single keyed ref map
  const soundsRef = useRef<Record<Theme, HTMLAudioElement> | null>(null)

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme)
    document.documentElement.classList.toggle('dark', theme === 'dark')
    localStorage.setItem('theme', theme)
  }, [theme])

  useEffect(() => {
    const audioMap: Record<Theme, HTMLAudioElement> = {
      light: new Audio(lightModeSound),
      dark: new Audio(darkModeSound),
    }

    Object.values(audioMap).forEach((audio) => {
      audio.preload = 'auto'
    })

    soundsRef.current = audioMap

    // Cleanup: pause audio on unmount to prevent leaks or orphaned playback
    return () => {
      if (soundsRef.current) {
        Object.values(soundsRef.current).forEach((audio) => audio.pause())
      }
    }
  }, [])

  const playThemeSound = (targetTheme: Theme) => {
    const audio = soundsRef.current?.[targetTheme]
    if (!audio) return

    audio.currentTime = 0
    audio.play().catch((error) => {
      console.warn('Audio playback prevented:', error)
    })
  }

  const toggleTheme = () => {
    const nextTheme: Theme = theme === 'light' ? 'dark' : 'light'
    setTheme(nextTheme)
    playThemeSound(nextTheme)
  }

  return (
<div className="min-h-screen bg-light-bg text-light-text dark:bg-dark-bg dark:text-dark-text flex items-start justify-center pt-4.5 pb-8">
  <div className="w-[70vw] max-w-[1200px] min-h-[70vh]">
        <Navbar
          theme={theme}
          onToggleTheme={toggleTheme}
        />

        <div className="flex justify-center gap-8 flex-wrap">
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
        
        <div className="flex flex-col justify-center items-center min-h-[60vh]">
          
          <HeroInput />
        </div>
      </div>
    </div>
  )
}