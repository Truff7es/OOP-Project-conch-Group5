import { useState } from 'react'

interface QuestionCardProps {
  id: number
  question: string
  choices: string[]
  selectedChoice?: string
  onSelectChoice: (choice: string) => void
  onNext: () => void
  onPrev: () => void
  onFinish: () => void
  isFirstQuestion: boolean
  isLastQuestion: boolean
}

export default function QuestionCard({
  id,
  question,
  choices,
  selectedChoice,
  onSelectChoice,
  onNext,
  onPrev,
  onFinish,
  isFirstQuestion,
  isLastQuestion,
}: QuestionCardProps) {
  const [showConfirm, setShowConfirm] =
    useState(false)

  const handleSubmitClick = () => {
    setShowConfirm(true)
  }

  const handleCancelSubmit = () => {
    setShowConfirm(false)
  }

  const handleConfirmSubmit = () => {
    setShowConfirm(false)
    onFinish()
  }

  return (
    <>
      <div className="w-full max-w-2xl">
        <div className="flex gap-4 flex-col bg-light-bar dark:bg-dark-bar p-6 rounded-2xl transition-colors shadow-sm">

          <div className="flex items-center justify-between">
            <div className="text-sm font-mono text-light-text/70 dark:text-dark-text/70">
              Question {id}
            </div>

            <div className="text-xs font-mono text-light-text/50 dark:text-dark-text/50">
              {isLastQuestion
                ? 'final question'
                : 'keep going'}
            </div>
          </div>

          <div className="font-bold text-xl text-light-text dark:text-dark-text">
            {question}
          </div>

          <div className="flex flex-col gap-3">
            {choices.map((choice) => {
              const isSelected =
                selectedChoice === choice

              return (
                <button
                  key={choice}
                  type="button"
                  onClick={() =>
                    onSelectChoice(choice)
                  }
                  className={`
                    flex items-center gap-3
                    p-4 w-full rounded-2xl
                    cursor-pointer text-left
                    transition-all duration-200
                    text-light-text dark:text-dark-text
                    ${
                      isSelected
                        ? 'bg-light-text/15 dark:bg-dark-text/15 ring-2 ring-light-text/40 dark:ring-dark-text/40'
                        : 'bg-light-bg dark:bg-dark-bg hover:opacity-85'
                    }
                  `}
                >
                  <div
                    className={`
                      flex justify-center items-center
                      w-5 h-5 shrink-0 rounded-full
                      border-2
                      border-light-text
                      dark:border-dark-text
                      transition-all duration-200
                      ${
                        isSelected
                          ? 'bg-light-text dark:bg-dark-text scale-110'
                          : ''
                      }
                    `}
                  />

                  <span className="flex-1">
                    {choice}
                  </span>

                  {isSelected && (
                    <span className="material-symbols-outlined text-lg">
                        check
                    </span>
                  )}
                </button>
              )
            })}
          </div>

          <div className="flex flex-row justify-between gap-3 mt-2">
            <button
              type="button"
              disabled={isFirstQuestion}
              onClick={onPrev}
              className={`
                px-4 py-2
                bg-light-bg dark:bg-dark-bg
                text-light-text dark:text-dark-text
                rounded-xl
                transition-all
                ${
                  isFirstQuestion
                    ? 'opacity-30 cursor-not-allowed'
                    : 'cursor-pointer hover:opacity-80'
                }
              `}
            >
              Previous
            </button>

            <div className="flex gap-3">
              {!isLastQuestion && (
                <button
                  type="button"
                  onClick={onNext}
                  className="
                    px-4 py-2
                    bg-light-text
                    text-light-bg
                    dark:bg-dark-text
                    dark:text-dark-bg
                    font-bold
                    rounded-xl
                    cursor-pointer
                    hover:opacity-90
                    transition-opacity
                  "
                >
                  Next
                </button>
              )}

              {isLastQuestion && (
                <button
                  type="button"
                  onClick={handleSubmitClick}
                  className="
                    px-5 py-2
                    bg-light-text
                    text-light-bg
                    dark:bg-dark-text
                    dark:text-dark-bg
                    font-bold
                    rounded-xl
                    cursor-pointer
                    hover:opacity-90
                    active:scale-[0.98]
                    transition-all
                  "
                >
                  Submit Quiz
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {showConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4 bg-black/25 backdrop-blur-sm">
          <div className="w-full max-w-md animate-confirmation-pop">
            <div className="bg-light-bg dark:bg-dark-bg rounded-3xl p-7 shadow-2xl border border-light-text/10 dark:border-dark-text/10">

              <div className="flex items-center justify-center mb-5">
                <div className="w-14 h-14 rounded-full bg-light-bar dark:bg-dark-bar flex items-center justify-center">
                  <span className="material-symbols-outlined text-3xl text-light-text dark:text-dark-text">
                    flag
                </span>
                </div>
              </div>

              <div className="text-center">
                <h2 className="text-xl font-bold text-light-text dark:text-dark-text">
                  Ready to submit?
                </h2>

                <p className="mt-3 text-sm leading-6 text-light-text/65 dark:text-dark-text/65">
                  You're on the last question.
                  Once you submit, your answers
                  will be finalized and you'll see
                  your results.
                </p>
              </div>

              <div className="mt-6 flex gap-3">
                <button
                  type="button"
                  onClick={handleCancelSubmit}
                  className="
                    flex-1
                    px-4 py-3
                    rounded-xl
                    bg-light-bar
                    dark:bg-dark-bar
                    text-light-text
                    dark:text-dark-text
                    font-bold
                    cursor-pointer
                    hover:opacity-80
                    transition-opacity
                  "
                >
                  Keep Reviewing
                </button>

                <button
                  type="button"
                  onClick={handleConfirmSubmit}
                  className="
                    flex-1
                    px-4 py-3
                    rounded-xl
                    bg-light-text
                    dark:bg-dark-text
                    text-light-bg
                    dark:text-dark-bg
                    font-bold
                    cursor-pointer
                    hover:opacity-90
                    transition-opacity
                  "
                >
                  Finalize
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
