import { useState, useRef, useEffect } from 'react'
import pipSound from '../assets/sfx/pipsound.wav'

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
  const [highlightStyle, setHighlightStyle] = useState({ left: '0px', width: '0px' })
  const containerRef = useRef<HTMLDivElement>(null)
  const pillRefs = useRef<Record<string, HTMLButtonElement | null>>({})
  const pipSoundRef = useRef<HTMLAudioElement | null>(null)

  // Initialize audio on mount
  useEffect(() => {
    const audio = new Audio(pipSound)
    audio.volume = 0.5 // Set a reasonable volume
    pipSoundRef.current = audio
    
    return () => {
      audio.pause()
    }
  }, [])

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
    // Create a fresh audio element each time to avoid browser restrictions
    const audio = new Audio(pipSound)
    audio.volume = 0.5
    audio.play().catch(error => {
      console.warn('Audio play failed:', error)
    })
  }

  return (
    <div className="flex flex-col items-center gap-2">
      <div
        className="relative bg-light-bar dark:bg-dark-bar rounded-[18px] px-4 py-[0.35rem] flex items-center justify-center gap-[0.35rem] overflow-hidden"
        ref={containerRef}
      >
        <div
          className="absolute top-1/2 -translate-y-1/2 h-[70%] bg-white/25 rounded-full pointer-events-none z-0 transition-[left,width] duration-150 ease-out"
          style={highlightStyle}
        />
        {options.map((option, index) => (
          <button
            key={option}
            ref={(el) => { pillRefs.current[option] = el }}
            type="button"
            className="relative z-10 inline-flex items-center justify-center gap-1 border-none rounded-full bg-transparent px-3 py-[0.55rem] min-h-9 text-xs font-mono text-light-text/80 dark:text-dark-text/80 lowercase cursor-pointer transition-colors hover:opacity-50"
            onClick={() => {
              playSound()
              onSelect(option)
            }}
            aria-pressed={selected === option}
          >
            {icons?.[index] && <span className="material-symbols-outlined text-[15px]">{icons[index]}</span>}
            <span>{option}</span>
          </button>
        ))}
      </div>
      <span className="bar-title text-s text-neutral-400 font-mono">
        {label}
      </span>
    </div>
  )
}
