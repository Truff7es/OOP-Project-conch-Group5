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

  if (!pipSoundRef.current) {
    const audio = new Audio(pipSound)
    audio.preload = 'auto'
    pipSoundRef.current = audio
  }

  const updateHighlight = (optionToHighlight: string) => {
    const selectedPill = pillRefs.current[optionToHighlight]
    const container = containerRef.current

    if (selectedPill && container) {
      const containerRect = container.getBoundingClientRect()
      const pillRect = selectedPill.getBoundingClientRect()

      const left = pillRect.left - containerRect.left
      const width = pillRect.width

      setHighlightStyle({ left: `${left}px`, width: `${width}px` })
    }
  }

  useEffect(() => {
    // Wait for fonts to load
    if (document.fonts && document.fonts.ready) {
      document.fonts.ready.then(() => {
        requestAnimationFrame(() => {
          updateHighlight(selected)
        })
      })
    } else {
      // Fallback if fonts API not available
      const frameId = requestAnimationFrame(() => {
        updateHighlight(selected)
      })
      return () => cancelAnimationFrame(frameId)
    }
  }, [selected])

  // Also update on window resize
  useEffect(() => {
    let frameId: number
    
    const handleResize = () => {
      frameId = requestAnimationFrame(() => {
        updateHighlight(selected)
      })
    }

    window.addEventListener('resize', handleResize)
    return () => {
      window.removeEventListener('resize', handleResize)
      cancelAnimationFrame(frameId)
    }
  }, [selected])

  const handlePillClick = (option: string) => {
    if (pipSoundRef.current) {
      pipSoundRef.current.currentTime = 0
      pipSoundRef.current.play().catch((error) => {
        console.warn('Audio playback prevented:', error)
      })
    }

    onSelect(option)
  }

  return (
    <div className="flex flex-col items-center gap-2">
      <div
        className="relative bg-light-bar dark:bg-dark-bar rounded-[18px] px-4 py-[0.35rem] flex items-center justify-center gap-[0.35rem] overflow-hidden"
        ref={containerRef}
      >
        <div
          className="absolute top-1/2 -translate-y-1/2 h-[70%] bg-white/25 rounded-full pointer-events-none z-0 transition-[left,width] duration-150 ease-out"
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
              className="relative z-10 inline-flex items-center justify-center gap-1 border-none rounded-full bg-transparent px-3 py-[0.55rem] min-h-9 text-xs font-mono text-light-text/80 dark:text-dark-text/80 lowercase cursor-pointer transition-colors hover:opacity-50"
              onClick={() => handlePillClick(option)}
              aria-pressed={isSelected}
            >
              {icon ? <span className="material-symbols-outlined text-[15px]">{icon}</span> : null}
              <span>{option}</span>
            </button>
          )
        })}
      </div>
      <span className="text-light-text/70 dark:text-dark-text/70 text-xs lowercase">{label}</span>
    </div>
  )
}