import { useState, useRef, useEffect } from 'react'
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
  const pillRefs = useRef<Record<string, HTMLButtonElement | null>>({})

  const updateHighlight = () => {
    const selectedPill = pillRefs.current[selected]
    const container = containerRef.current

    if (selectedPill && container) {
      const { left: containerLeft } = container.getBoundingClientRect()
      const { left: pillLeft, width } = selectedPill.getBoundingClientRect()
      setHighlightStyle({ 
        left: `${pillLeft - containerLeft}px`, 
        width: `${width}px` 
      })
    }
  }

  useEffect(() => {
    document.fonts.ready?.then(() => requestAnimationFrame(updateHighlight))
  }, [selected])

  useEffect(() => {
    window.addEventListener('resize', updateHighlight)
    return () => window.removeEventListener('resize', updateHighlight)
  }, [selected])

  const playSound = () => {
    const audio = new Audio(pipSound)
    audio.volume = 0.5
    audio.play().catch((error) => {
      console.warn('Audio play failed:', error)
    })
  }

  return (
    <div className="flex flex-col items-center gap-2">
      <div
        className="relative bg-light-bar dark:bg-dark-bar rounded-full px-2 py-1 flex items-center justify-center gap-1 overflow-hidden transition-colors"
        ref={containerRef}
      >
        {/* Sliding active pill indicator */}
        <div
          className="absolute top-1/2 -translate-y-1/2 h-[75%] bg-white/40 dark:bg-black/30 rounded-full pointer-events-none z-0 transition-[left,width] duration-200 ease-out"
          style={highlightStyle}
        />

        {options.map((option, index) => {
          const isSelected = selected === option

          return (
            <button
              key={option}
              ref={(el) => { pillRefs.current[option] = el }}
              type="button"
              className={`relative z-10 inline-flex items-center justify-center gap-1.5 rounded-full px-3.5 py-2 text-xs font-mono cursor-pointer transition-all duration-150 ${
                isSelected
                  ? 'text-light-text dark:text-dark-text font-bold opacity-100 scale-105'
                  : 'text-light-text/60 dark:text-dark-text/60 hover:text-light-text dark:hover:text-dark-text opacity-75'
              }`}
              onClick={() => {
                playSound()
                onSelect(option)
              }}
              aria-pressed={isSelected}
            >
              {icons?.[index] && (
                <span className="material-symbols-outlined text-[16px]">
                  {icons[index]}
                </span>
              )}
              <span>{option}</span>
            </button>
          )
        })}
      </div>
      <span className="bar-title text-xs text-light-text/60 dark:text-dark-text/60 font-mono tracking-wider">
        {label}
      </span>
    </div>
  )
}