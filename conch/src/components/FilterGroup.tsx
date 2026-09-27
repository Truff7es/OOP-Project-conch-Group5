interface FilterGroupProps {
  label: string
  options: string[]
  icons?: string[] // Optional in case a filter has no icons
  selected: string
  onSelect: (option: string) => void
}

export default function FilterGroup({
  label,
  options,
  icons,
  selected,
  onSelect,
}: FilterGroupProps) {
  return (
    <div className="bar flex flex-col items-center gap-1">
      <div className="h-10 bars flex gap-2 bg-neutral-200 p-1 rounded-2xl pl-4 pr-4">
        {options.map((option, index) => {
          const icon = icons?.[index]

          return (
            <button
              key={option}
              onClick={() => onSelect(option)}
              className={`pill flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-mono transition cursor-pointer ${
                selected === option
                  ? 'text-black'
                  : 'text-neutral-400 hover:text-black'
              }`}
            >
              {icon && (
                <span className="material-symbols-outlined text-2xl">
                  {icon}
                </span>
              )}
              <span>{option}</span>
            </button>
          )
        })}
      </div>
      <span className="bar-title text-s text-neutral-400 font-mono">
        {label}
      </span>
    </div>
  )
}