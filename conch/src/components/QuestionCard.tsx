import type { QuestionType } from '../services/gemini'

interface QuestionCardProps {
  id: number
  type: QuestionType
  question: string
  choices: string[]
  selectedChoice?: string
  onSelectChoice: (choice: string) => void
  onNext: () => void
  onPrev: () => void
  isFirstQuestion: boolean
  isLastQuestion: boolean
}

const typeLabels: Record<QuestionType, string> = {
  mc: 'Multiple Choice',
  'true/false': 'True or False',
  checkbox: 'Checkbox',
  'fill-in': 'Fill-in',
}

export default function QuestionCard({
  id,
  type,
  question,
  choices,
  selectedChoice,
  onSelectChoice,
  onNext,
  onPrev,
  isFirstQuestion,
  isLastQuestion,
}: QuestionCardProps) {
  const selected = selectedChoice?.split('|') ?? []

  const toggleChoice = (choice: string) => {
    onSelectChoice(
      selected.includes(choice)
        ? selected.filter((item) => item !== choice).join('|')
        : [...selected, choice].join('|')
    )
  }

  return (
    <div className="w-full max-w-2xl">
      <div className="flex flex-col gap-4 bg-light-bar dark:bg-dark-bar p-6 rounded-2xl transition-colors">
        <div className="text-sm text-light-text/70 dark:text-dark-text/70">
          Question {id} - {typeLabels[type]}
        </div>

        <div className="font-bold text-xl text-light-text dark:text-dark-text">
          {question}
        </div>

        {type === 'fill-in' ? (
          <input
            type="text"
            value={selectedChoice ?? ''}
            onChange={(e) => onSelectChoice(e.target.value)}
            placeholder="Type your answer..."
            className="w-full p-4 rounded-2xl bg-light-bg dark:bg-dark-bg outline-none text-light-text dark:text-dark-text font-mono"
          />
        ) : (
          <div className="flex flex-col gap-3">
            {choices.map((choice) => {
              const isSelected = selected.includes(choice)

              return (
                <button
                  key={choice}
                  type="button"
                  onClick={() =>
                    type === 'checkbox'
                      ? toggleChoice(choice)
                      : onSelectChoice(choice)
                  }
                  className={`flex items-center gap-3 p-4 w-full rounded-2xl bg-light-bg dark:bg-dark-bg text-left text-light-text dark:text-dark-text transition-opacity ${
                    isSelected ? '' : 'hover:opacity-90'
                  }`}
                >
                  <div
                    className={`w-5 h-5 shrink-0 border-2 border-light-text dark:border-dark-text ${
                      type === 'checkbox' ? 'rounded-md' : 'rounded-full'
                    } ${
                      isSelected ? 'bg-light-text dark:bg-dark-text' : ''
                    }`}
                  />

                  <span>{choice}</span>
                </button>
              )
            })}
          </div>
        )}

        <div className="flex justify-end gap-3 mt-2">
          <button
            type="button"
            disabled={isFirstQuestion}
            onClick={onPrev}
            className={`px-4 py-2 rounded-xl bg-light-bg dark:bg-dark-bg text-light-text dark:text-dark-text ${
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
            className={`px-4 py-2 rounded-xl bg-light-text dark:bg-dark-text text-light-bg dark:text-dark-bg font-bold ${
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
