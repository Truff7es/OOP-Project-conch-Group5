import { useEffect, useRef, useState } from 'react'
import Navbar from './components/Navbar'
import FilterGroup from './components/FilterGroup'
import HeroInput from './components/HeroInput'
import QuestionCard from './components/QuestionCard'
import lightModeSound from './assets/sfx/lightmodereal.wav'
import darkModeSound from './assets/sfx/darkmodereal.wav'
import { generateQuiz, type QuizQuestion } from './services/gemini'

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
  const [questioncount, setQuestioncount] = useState('5')
  const [questions, setQuestions] = useState<QuizQuestion[]>([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [loading, setLoading] = useState(false)
  const [topic, setTopic] = useState('')
  const [answers, setAnswers] = useState<Record<number, string>>({})
  
  const handleSelectChoice = (choice: string) => {
    setAnswers((prev) => ({
      ...prev,
      [currentIndex]: choice,
    }))
  } 

  const handleNext = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(currentIndex + 1)
    }
  }

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1)
    }
  }

  const handleGenerate = async () => {
    try {
      console.log("waiting for response");
      setLoading(true);
      const data = await generateQuiz(topic, 5, 'easy');
      console.log(data)
      setQuestions(data);
      setAnswers({});
      setCurrentIndex(0);
    } catch(err){
      console.error('Quiz generation failed: ', err);
    } finally {
      setLoading(false);
    }
  }

  const currentQuestion = questions[currentIndex];

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
    <div className="min-h-screen bg-light-bg text-light-text dark:bg-dark-bg dark:text-dark-text flex items-start justify-center pt-4.5 pb-8 font-mono">
      <div className="w-[70vw] max-w-300 min-h-[70vh]">
        <Navbar theme={theme} onToggleTheme={toggleTheme} />

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
            options={['all', 'mc', 'true/false', 'checkbox', 'fill-in']}
            icons={['apps', 'list_alt', 'flaky', 'check_box', 'keyboard']}
            selected={mode}
            onSelect={setMode}
          />

          <FilterGroup
            label="questions"
            options={['5', '10', '20', 'custom']}
            icons={['', '', '', 'tune']}
            selected={questioncount}
            onSelect={setQuestioncount}
          />
        </div>
        <div className="flex flex-col justify-center items-center min-h-[60vh]">
          {!loading && currentQuestion && (
            <>
              <QuestionCard
                id={currentQuestion.id}
                question={currentQuestion.question}
                choices={currentQuestion.choices}
                selectedChoice={answers[currentIndex]}
                onSelectChoice={handleSelectChoice}
                onNext={handleNext}
                onPrev={handlePrev}
              />
          </>
          )}
          {!loading && !currentQuestion && (
            <HeroInput
              value={topic}
              onChange={setTopic}
              onSubmit={handleGenerate}
              disabled={loading}
            />)}
        </div>
      </div>
    </div>
  )
}