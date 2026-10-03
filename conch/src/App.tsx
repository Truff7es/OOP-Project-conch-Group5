import { useEffect, useRef, useState } from 'react'

import Navbar from './components/Navbar'
import FilterGroup from './components/FilterGroup'
import HeroInput from './components/HeroInput'
import QuestionCard from './components/QuestionCard'
import LoadingCard from './components/LoadingCard'
import ResultsScreen from './components/ResultsScreen'

import lightModeSound from './assets/sfx/lightmodereal.wav'
import darkModeSound from './assets/sfx/darkmodereal.wav'

import { generateQuiz, type QuizQuestion } from './services/gemini'

type Theme = 'light' | 'dark'
type FetchPhase = 'idle' | 'fetching' | 'done'

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

  const [showResults, setShowResults] = useState(false)
  const [showQuestions, setShowQuestions] = useState(false)

  const [topic, setTopic] = useState('')
  const [answers, setAnswers] = useState<Record<number, string>>({})

  const [fetchPhase, setFetchPhase] =
    useState<FetchPhase>('idle')

  const transitionTimers = useRef<number[]>([])

  const soundsRef = useRef<Record<Theme, HTMLAudioElement> | null>(
    null
  )

  const questionSoundsRef = useRef<{
    back: HTMLAudioElement
    next: HTMLAudioElement
    select: HTMLAudioElement
  } | null>(null)

  const clearTransitionTimers = () => {
    transitionTimers.current.forEach((timer) => {
      window.clearTimeout(timer)
    })

    transitionTimers.current = []
  }

  useEffect(() => {
    return () => {
      clearTransitionTimers()
    }
  }, [])

  useEffect(() => {
    document.documentElement.setAttribute(
      'data-theme',
      theme
    )

    document.documentElement.classList.toggle(
      'dark',
      theme === 'dark'
    )

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

    const questionAudio = {
      back: new Audio(
        new URL('./assets/sfx/questback.wav', import.meta.url).href
      ),
      next: new Audio(
        new URL('./assets/sfx/questnext.wav', import.meta.url).href
      ),
      select: new Audio(
        new URL('./assets/sfx/questselect.wav', import.meta.url).href
      ),
    }

    Object.values(questionAudio).forEach((audio) => {
      audio.preload = 'auto'
    })

    questionSoundsRef.current = questionAudio

    return () => {
      Object.values(audioMap).forEach((audio) => {
        audio.pause()
      })

      Object.values(questionAudio).forEach((audio) => {
        audio.pause()
      })
    }
  }, [])

  const playThemeSound = (targetTheme: Theme) => {
    const audio = soundsRef.current?.[targetTheme]

    if (!audio) return

    audio.currentTime = 0

    audio.play().catch((error) => {
      console.warn(
        'Audio playback prevented:',
        error
      )
    })
  }

  const playQuestionSound = (
    type: 'back' | 'next' | 'select'
  ) => {
    const audio = questionSoundsRef.current?.[type]

    if (!audio) return

    audio.currentTime = 0

    audio.play().catch((error) => {
      console.warn(
        'Question audio playback prevented:',
        error
      )
    })
  }

  const toggleTheme = () => {
    const nextTheme: Theme =
      theme === 'light' ? 'dark' : 'light'

    setTheme(nextTheme)
    playThemeSound(nextTheme)
  }

  const handleSelectChoice = (choice: string) => {
    setAnswers((prev) => ({
      ...prev,
      [currentIndex]: choice,
    }))

    playQuestionSound('select')
  }

  const handleNext = () => {
    if (currentIndex < questions.length - 1) {
      playQuestionSound('next')

      setCurrentIndex((prev) => prev + 1)
    }
  }

  const handlePrev = () => {
    if (currentIndex > 0) {
      playQuestionSound('back')

      setCurrentIndex((prev) => prev - 1)
    }
  }

  const handleGenerate = async () => {
    clearTransitionTimers()

    setLoading(true)
    setShowQuestions(false)
    setShowResults(false)
    setFetchPhase('fetching')

    const fetchStart = performance.now()

    try {
      console.log('waiting for response')

      const requestedCount =
        questioncount === 'custom'
          ? 5
          : Number(questioncount)

      const data = await generateQuiz(
        topic,
        requestedCount,
        difficulty
      )

      console.log(data)

      setQuestions(data)
      setAnswers({})
      setCurrentIndex(0)

      const elapsed =
        performance.now() - fetchStart

      const remaining = Math.max(
        0,
        5000 - elapsed
      )

      const doneTimer = window.setTimeout(() => {
        setFetchPhase('done')

        const exitTimer = window.setTimeout(() => {
          setShowQuestions(true)
          setLoading(false)
          setFetchPhase('idle')
        }, 1000)

        transitionTimers.current.push(exitTimer)
      }, remaining)

      transitionTimers.current.push(doneTimer)
    } catch (err) {
      console.error(
        'Quiz generation failed:',
        err
      )

      setFetchPhase('idle')
      setLoading(false)
      setShowQuestions(false)
      setShowResults(false)
    }
  }

  const handleFinish = () => {
    setShowQuestions(false)
    setShowResults(true)
  }

  const currentQuestion =
    questions[currentIndex]

  return (
    <div className="min-h-screen bg-light-bg text-light-text dark:bg-dark-bg dark:text-dark-text flex items-start justify-center pt-4.5 pb-8 font-mono transition-colors">
      <div className="w-[70vw] max-w-300 min-h-[70vh]">
        <Navbar
          theme={theme}
          onToggleTheme={toggleTheme}
        />

        <div className="flex justify-center gap-8 flex-wrap">
          <FilterGroup
            label="difficulty"
            options={['easy', 'normal', 'hard']}
            icons={[
              'child_care',
              'school',
              'history_edu',
            ]}
            selected={difficulty}
            onSelect={setDifficulty}
          />

          <FilterGroup
            label="mode"
            options={[
              'all',
              'mc',
              'true/false',
              'checkbox',
              'fill-in',
            ]}
            icons={[
              'apps',
              'list_alt',
              'flaky',
              'check_box',
              'keyboard',
            ]}
            selected={mode}
            onSelect={setMode}
          />

          <FilterGroup
            label="questions"
            options={[
              '5',
              '10',
              '20',
              'custom',
            ]}
            icons={[
              '',
              '',
              '',
              'tune',
            ]}
            selected={questioncount}
            onSelect={setQuestioncount}
          />
        </div>

        <div className="flex flex-col justify-center items-center min-h-[60vh]">
          {fetchPhase !== 'idle' &&
            !showQuestions &&
            !showResults && (
              <LoadingCard status={fetchPhase} />
            )}

          {showQuestions && currentQuestion && (
            <div className="w-full flex justify-center animate-question-reveal">
              <QuestionCard
                id={currentQuestion.id}
                question={currentQuestion.question}
                choices={currentQuestion.choices}
                selectedChoice={
                  answers[currentIndex]
                }
                onSelectChoice={
                  handleSelectChoice
                }
                onNext={handleNext}
                onPrev={handlePrev}
                onFinish={handleFinish}
                isFirstQuestion={
                  currentIndex === 0
                }
                isLastQuestion={
                  currentIndex ===
                  questions.length - 1
                }
              />
            </div>
          )}

          {showResults && (
            <div className="w-full flex justify-center animate-question-reveal">
              <ResultsScreen
                questions={questions}
                answers={answers}
              />
            </div>
          )}

          {!loading &&
            fetchPhase === 'idle' &&
            !showQuestions &&
            !showResults &&
            !currentQuestion && (
              <HeroInput
                value={topic}
                onChange={setTopic}
                onSubmit={handleGenerate}
                disabled={loading}
              />
            )}
        </div>
      </div>
    </div>
  )
}