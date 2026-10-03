interface QuestionCardProps {
  id: number
  question: string
  choices: string[]
  selectedChoice?: string
  onSelectChoice: (choice: string) => void
  onNext: () => void
  onPrev: () => void
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
  isFirstQuestion,
  isLastQuestion,
}: QuestionCardProps) {
  return (
    <div className="w-full max-w-2xl">
      <div className="flex gap-4 flex-col bg-light-bar dark:bg-dark-bar p-6 rounded-2xl transition-colors">
        <div className="text-sm font-mono text-light-text/70 dark:text-dark-text/70">
          Question {id}
        </div>

        <div className="font-bold text-xl text-light-text dark:text-dark-text">
          {question}
        </div>

        <div className="flex flex-col gap-3">
          {choices.map((choice) => {
            const isSelected = selectedChoice === choice

            return (
              <button
                key={choice}
                type="button"
                onClick={() => onSelectChoice(choice)}
                className="flex items-center gap-3 p-4 w-full rounded-2xl bg-light-bg dark:bg-dark-bg cursor-pointer text-left transition-colors text-light-text dark:text-dark-text hover:opacity-90"
              >
                <div
                  className={`flex justify-center w-5 h-5 shrink-0 rounded-full border-2 border-light-text dark:border-dark-text transition-all ${
                    isSelected ? 'bg-light-text dark:bg-dark-text' : ''
                  }`}
                />

                <span>{choice}</span>
              </button>
            )
          })}
        </div>

        <div className="flex flex-row justify-end gap-3 mt-2">
          <button
            type="button"
            disabled={isFirstQuestion}
            onClick={onPrev}
            className={`px-4 py-2 rounded-xl transition-opacity bg-light-bg dark:bg-dark-bg text-light-text dark:text-dark-text ${
              isFirstQuestion
                ? 'opacity-30 cursor-not-allowed'
                : 'cursor-pointer hover:opacity-80'
            }`}
          >
            Previous
          </button>

          <button
            type="button"
            disabled={isLastQuestion}
            onClick={onNext}
            className={`px-4 py-2 font-bold rounded-xl transition-opacity bg-light-text text-light-bg dark:bg-dark-text dark:text-dark-bg ${
              isLastQuestion
                ? 'opacity-30 cursor-not-allowed'
                : 'cursor-pointer hover:opacity-90'
            }`}
          >
            Next
          </button>
        </div>
      </div>
    </div>
  )
}