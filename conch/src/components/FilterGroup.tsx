interface FilterGroupProps {
  label: string
  options: string[]
  icons?: string[]
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
    <div className="bar-group">
      <div className="bar-pill-group">
        {options.map((option, index) => {
          const icon = icons?.[index]
          const isSelected = selected === option

          return (
            <button
              key={option}
              type="button"
              className={`pill ${isSelected ? 'is-active' : ''}`}
              onClick={() => onSelect(option)}
              aria-pressed={isSelected}
            >
              {icon ? <span className="material-symbols-outlined">{icon}</span> : null}
              <span>{option}</span>
            </button>
          )
        })}
      </div>
      <span className="bar-title">{label}</span>
    </div>
  )
}