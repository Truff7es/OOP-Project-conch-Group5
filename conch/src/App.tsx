import { useState, useEffect } from 'react'
import Navbar from './components/Navbar'
import FilterGroup from './components/FilterGroup'
import HeroInput from './components/HeroInput'

export default function App() {
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    return (localStorage.getItem('theme') as 'light' | 'dark') || 'light'
  })

  const [difficulty, setDifficulty] = useState('easy')
  const [mode, setMode] = useState('all')
  const [questions, setQuestions] = useState('5')

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme)
    if (theme === 'dark') {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
    localStorage.setItem('theme', theme)
  }, [theme])

  const toggleTheme = () => {
    setTheme(prev => (prev === 'light' ? 'dark' : 'light'))
  }

  return (
    <div className="bg-neutral-800 pt-2 min-h-screen">
      <div className="bg w-3/5 mx-auto">
        <Navbar theme={theme} onToggleTheme={toggleTheme} />

        <div className="subheader flex justify-center gap-6 my-4">
          <FilterGroup
            label="difficulty"
            options={['easy', 'normal', 'academic']}
            icons={['child_care','school','history_edu']}
            selected={difficulty}
            onSelect={setDifficulty}
          />
          <FilterGroup
            label="mode"
            options={['all', 'mc', 't/f', 'fill-in']}
            icons={['apps','list_alt','rule','keyboard']}
            selected={mode}
            onSelect={setMode}
          />
          <FilterGroup
            label="questions"
            options={['5', '10', '20', 'custom']}
            icons={['','','','instant_mix']}
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