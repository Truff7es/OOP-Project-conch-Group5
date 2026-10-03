import type { QuizQuestion } from '../services/gemini'

interface ResultsScreenProps {
  questions: QuizQuestion[]
  answers: Record<number, string>
}

type QuestionWithAnswer = QuizQuestion & {
  correctAnswer?: string
  answer?: string
  correctOption?: string
}

export default function ResultsScreen({
  questions,
  answers,
}: ResultsScreenProps) {
  const getCorrectAnswer = (
    question: QuizQuestion
  ) => {
    const questionWithAnswer =
      question as QuestionWithAnswer

    return (
      questionWithAnswer.correctAnswer ??
      questionWithAnswer.answer ??
      questionWithAnswer.correctOption ??
      ''
    )
  }

  const score = questions.reduce(
    (total, question, index) => {
      const correctAnswer =
        getCorrectAnswer(question)

      const selectedAnswer =
        answers[index]

      return (
        total +
        (selectedAnswer === correctAnswer ? 1 : 0)
      )
    },
    0
  )

  const answered = questions.filter(
    (_, index) =>
      Boolean(answers[index])
  ).length

  const incorrect =
    answered - score

  const unanswered =
    questions.length - answered

  const percentage =
    questions.length > 0
      ? Math.round(
          (score / questions.length) * 100
        )
      : 0

  const getMessage = () => {
    if (percentage === 100) {
      return 'You got everything right!'
    }

    if (percentage >= 80) {
      return 'Great work! You really know your stuff.'
    }

    if (percentage >= 60) {
      return 'Nice work! A little more practice and you’ll be golden.'
    }

    if (percentage >= 40) {
      return 'Good effort! Keep practicing and you’ll get there.'
    }

    return 'Every attempt is a step forward. Give it another go!'
  }

  return (
    <div className="w-full max-w-3xl flex flex-col gap-5">

      <div className="results-hero bg-light-bar dark:bg-dark-bar rounded-3xl p-7 text-light-text dark:text-dark-text shadow-sm">

        <div className="text-center">
          <div className="text-xs uppercase tracking-[0.2em] font-bold opacity-50">
            Quiz complete
          </div>

          <div className="mt-3 text-6xl font-bold">
            {percentage}%
          </div>

          <div className="mt-2 text-sm opacity-65">
            {score} out of {questions.length} correct
          </div>

          <div className="mt-4 text-sm font-bold">
            {getMessage()}
          </div>
        </div>

        <div className="mt-7">
          <div className="flex justify-between text-xs font-bold opacity-55 mb-2">
            <span>Your score</span>
            <span>
              {score}/{questions.length}
            </span>
          </div>

          <div className="h-3 rounded-full bg-light-bg/70 dark:bg-dark-bg/60 overflow-hidden">
            <div
              className="h-full rounded-full bg-light-text dark:bg-dark-text transition-all duration-700"
              style={{
                width: `${percentage}%`,
              }}
            />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4">

        <div className="bg-light-bar dark:bg-dark-bar rounded-2xl p-5 text-center">
          <div className="text-2xl font-bold text-light-text dark:text-dark-text">
            {score}
          </div>

          <div className="mt-1 text-xs font-bold uppercase tracking-wider text-light-text/55 dark:text-dark-text/55">
            Correct
          </div>
        </div>

        <div className="bg-light-bar dark:bg-dark-bar rounded-2xl p-5 text-center">
          <div className="text-2xl font-bold text-light-text dark:text-dark-text">
            {incorrect}
          </div>

          <div className="mt-1 text-xs font-bold uppercase tracking-wider text-light-text/55 dark:text-dark-text/55">
            Incorrect
          </div>
        </div>

        <div className="bg-light-bar dark:bg-dark-bar rounded-2xl p-5 text-center">
          <div className="text-2xl font-bold text-light-text dark:text-dark-text">
            {unanswered}
          </div>

          <div className="mt-1 text-xs font-bold uppercase tracking-wider text-light-text/55 dark:text-dark-text/55">
            Unanswered
          </div>
        </div>

      </div>

      <div className="bg-light-bar dark:bg-dark-bar rounded-3xl p-6">

        <div className="flex items-center justify-between mb-5">
          <div>
            <div className="text-lg font-bold text-light-text dark:text-dark-text">
              Question review
            </div>

            <div className="text-xs mt-1 text-light-text/55 dark:text-dark-text/55">
              Here's how you did on each question.
            </div>
          </div>

          <div className="text-xs font-bold text-light-text/55 dark:text-dark-text/55">
            {answered}/{questions.length} answered
          </div>
        </div>

        <div className="flex flex-col gap-4">
          {questions.map(
            (question, index) => {
              const correctAnswer =
                getCorrectAnswer(question)

              const selectedAnswer =
                answers[index]

              const isCorrect =
                selectedAnswer ===
                correctAnswer

              const isUnanswered =
                !selectedAnswer

              return (
                <div
                  key={question.id}
                  className="
                    rounded-2xl
                    bg-light-bg
                    dark:bg-dark-bg
                    p-5
                    transition-colors
                  "
                >
                  <div className="flex items-start gap-3">

                    <div
                      className={`
                        w-9 h-9 shrink-0
                        rounded-full
                        flex items-center justify-center
                        font-bold
                        text-sm
                        ${
                          isCorrect
                            ? 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400'
                            : isUnanswered
                              ? 'bg-light-text/10 dark:bg-dark-text/10 text-light-text/50 dark:text-dark-text/50'
                              : 'bg-red-500/15 text-red-600 dark:text-red-400'
                        }
                      `}
                    >
                      {isCorrect
                        ? '✓'
                        : isUnanswered
                          ? '—'
                          : '×'}
                    </div>

                    <div className="flex-1 min-w-0">

                      <div className="text-xs font-bold uppercase tracking-wider text-light-text/45 dark:text-dark-text/45">
                        Question {question.id}
                      </div>

                      <div className="mt-1 font-bold text-light-text dark:text-dark-text">
                        {question.question}
                      </div>

                    </div>
                  </div>

                  <div className="mt-4 flex flex-col gap-2">

                    {question.choices.map(
                      (choice) => {
                        const isCorrectChoice =
                          choice ===
                          correctAnswer

                        const isSelectedChoice =
                          choice ===
                          selectedAnswer

                        let extraClass =
                          'bg-light-bar/50 dark:bg-dark-bar/50'

                        if (
                          isCorrectChoice
                        ) {
                          extraClass =
                            'bg-emerald-500/10 ring-1 ring-emerald-500/40'
                        } else if (
                          isSelectedChoice
                        ) {
                          extraClass =
                            'bg-red-500/10 ring-1 ring-red-500/40'
                        }

                        return (
                          <div
                            key={choice}
                            className={`
                              flex items-center
                              gap-3
                              rounded-xl
                              px-4 py-3
                              text-sm
                              text-light-text
                              dark:text-dark-text
                              ${extraClass}
                            `}
                          >
                            <div
                              className={`
                                w-3 h-3
                                rounded-full
                                border-2
                                shrink-0
                                ${
                                  isCorrectChoice
                                    ? 'border-emerald-500 bg-emerald-500'
                                    : isSelectedChoice
                                      ? 'border-red-500 bg-red-500'
                                      : 'border-light-text/30 dark:border-dark-text/30'
                                }
                              `}
                            />

                            <span className="flex-1">
                              {choice}
                            </span>

                            {isCorrectChoice && (
                              <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
                                Correct
                              </span>
                            )}

                            {isSelectedChoice &&
                              !isCorrectChoice && (
                                <span className="text-[10px] font-bold uppercase tracking-wider text-red-600 dark:text-red-400">
                                  Your answer
                                </span>
                              )}
                          </div>
                        )
                      }
                    )}

                    {isUnanswered && (
                      <div className="mt-1 text-xs font-mono text-light-text/45 dark:text-dark-text/45">
                        You didn't answer this question.
                      </div>
                    )}

                  </div>
                </div>
              )
            }
          )}
        </div>
      </div>
    </div>
  )
}