interface QuestionCardProps {
  questionNumber?: number
  question: string
  choices: string[]
  selectedChoice: string | null
  onSelectChoice: (choice: string) => void
}

export default function QuestionCard({
  questionNumber = 1,
  question,
  choices,
  selectedChoice,
  onSelectChoice,
}: QuestionCardProps) {
  return (
    <div className="w-full max-w-3xl my-4">
      <div className="flex flex-col gap-4 bg-light-bar dark:bg-dark-bar border border-light-text/20 dark:border-dark-text/20 p-6 rounded-2xl shadow-sm transition-colors">
        <div className="text-sm font-mono uppercase tracking-wider text-light-text/70 dark:text-dark-text/70">
          Question {questionNumber}
        </div>
        <div className="font-bold text-xl text-light-text dark:text-dark-text">
          {question}
        </div>
        <div className="flex flex-col gap-3 pt-2">
          {choices.map((choice) => {
            const isSelected = selectedChoice === choice
            return (
              <button
                key={choice}
                type="button"
                onClick={() => onSelectChoice(choice)}
                className={`flex items-center gap-3 p-4 w-full rounded-xl transition-all cursor-pointer text-left wrap-break-word font-mono text-sm ${
                  isSelected
                    ? 'bg-white/40 dark:bg-black/40 text-light-text dark:text-dark-text font-semibold shadow-inner'
                    : 'bg-light-bg/60 dark:bg-dark-bg/60 text-light-text/90 dark:text-dark-text/90 hover:bg-white/20 dark:hover:bg-black/20'
                }`}
              >
                <div
                  className={`flex shrink-0 w-5 h-5 rounded-full border-2 border-light-text dark:border-dark-text transition-all ${
                    isSelected ? 'bg-light-text dark:bg-dark-text' : 'bg-transparent'
                  }`}
                />
                <span>{choice}</span>
              </button>
            )
          })}
        </div>
      </div>
    </div>
  )
}