import { useRef, useState, useEffect } from 'react'
import pipSound from '../assets/sfx/pipsound.wav'

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
  const [highlightStyle, setHighlightStyle] = useState({ left: '0px', width: '0px' })
  const containerRef = useRef<HTMLDivElement>(null)
  const pillRefs = useRef<{ [key: string]: HTMLButtonElement | null }>({})
  const pipSoundRef = useRef<HTMLAudioElement | null>(null)

  // Initialize sound
  if (!pipSoundRef.current) {
    const audio = new Audio(pipSound)
    audio.preload = 'auto'
    pipSoundRef.current = audio
  }

  useEffect(() => {
    const selectedPill = pillRefs.current[selected]
    const container = containerRef.current

    if (selectedPill && container) {
      const containerRect = container.getBoundingClientRect()
      const pillRect = selectedPill.getBoundingClientRect()

      const left = pillRect.left - containerRect.left
      const width = pillRect.width

      setHighlightStyle({ left: `${left}px`, width: `${width}px` })
    }
  }, [selected])

  const handlePillClick = (option: string) => {
    // Play pip sound
    if (pipSoundRef.current) {
      pipSoundRef.current.currentTime = 0
      pipSoundRef.current.play().catch((error) => {
        console.warn('Audio playback prevented:', error)
      })
    }

    onSelect(option)
  }

  return (
    <div className="bar-group">
      <div className="bar-pill-group" ref={containerRef}>
        <div
          className="pill-highlight"
          style={{
            left: highlightStyle.left,
            width: highlightStyle.width,
          }}
        />
        {options.map((option, index) => {
          const icon = icons?.[index]
          const isSelected = selected === option

          return (
            <button
              key={option}
              ref={(el) => {
                if (el) pillRefs.current[option] = el
              }}
              type="button"
              className={`pill ${isSelected ? 'is-active' : ''}`}
              onClick={() => handlePillClick(option)}
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