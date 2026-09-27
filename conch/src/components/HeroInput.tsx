import { useState, useRef, useEffect } from 'react'
import type { ChangeEvent } from 'react'
import typeSound from '../assets/sfx/type.wav'
import typeBackSound from '../assets/sfx/typeback.wav'

export default function HeroInput() {
  const [topic, setTopic] = useState('')
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [deletedChars, setDeletedChars] = useState<Array<{ char: string; index: number; id: number }>>([])
  const [isFocused, setIsFocused] = useState(false)
  const typeSoundRef = useRef<HTMLAudioElement | null>(null)
  const typeBackSoundRef = useRef<HTMLAudioElement | null>(null)

  useEffect(() => {
    const typeAudio = new Audio(typeSound)
    const typeBackAudio = new Audio(typeBackSound)
    typeAudio.preload = 'auto'
    typeBackAudio.preload = 'auto'
    typeSoundRef.current = typeAudio
    typeBackSoundRef.current = typeBackAudio
  }, [])

  const playSound = (audio: HTMLAudioElement | null) => {
    if (!audio) return
    audio.currentTime = 0
    audio.play().catch((error) => {
      console.warn('Audio playback prevented:', error)
    })
  }

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] ?? null
    setSelectedFile(file)
  }

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const newTopic = event.target.value
    const oldLength = topic.length

    if (newTopic.length < oldLength) {
      const deletedCount = oldLength - newTopic.length
      playSound(typeBackSoundRef.current)

      const newDeletedChars: Array<{ char: string; index: number; id: number }> = []
      for (let i = 0; i < deletedCount; i++) {
        const deletedIndex = newTopic.length + i
        newDeletedChars.push({
          char: topic[deletedIndex],
          index: deletedIndex,
          id: Date.now() + Math.random(),
        })
      }

      setDeletedChars((prev) => [...prev, ...newDeletedChars])

      setTimeout(() => {
        setDeletedChars((prev) =>
          prev.filter((c) => !newDeletedChars.some((nc) => nc.id === c.id))
        )
      }, 400)
    } else if (newTopic.length > oldLength) {
      playSound(typeSoundRef.current)
    }

    setTopic(newTopic)
  }

  return (
    <section className="w-full max-w-[700px] flex flex-col items-center justify-center gap-5 pt-12">
      <h1 className="m-0 text-[clamp(2rem,2vw+1.2rem,3rem)] leading-tight text-light-text dark:text-dark-text text-center font-mono">
        What's today's topic?
      </h1>

      <div className="w-full flex items-center gap-3 border border-light-text/35 dark:border-dark-text/35 rounded-full bg-light-bar dark:bg-dark-bar p-[0.6rem_0.9rem_0.6rem_0.5rem] transition-colors">
        <input
          type="file"
          id="file-attachment"
          accept=".pdf, .docx, application/pdf, application/vnd.openxmlformats-officedocument.wordprocessingml.document"
          hidden
          onChange={handleFileChange}
        />

        <label
          htmlFor="file-attachment"
          className="flex-shrink-0 w-10 h-10 rounded-full bg-transparent text-light-text dark:text-dark-text text-2xl grid place-items-center cursor-pointer select-none transition-opacity hover:opacity-70"
          title={selectedFile ? selectedFile.name : 'Attach PDF or DOCX'}
        >
          ＋
        </label>

        <div className="flex-1 relative overflow-hidden">
          <input
            type="text"
            value={topic}
            onChange={handleChange}
            className="w-full border-none bg-transparent text-light-text dark:text-dark-text text-lg leading-[1.4] px-1 py-2 outline-none font-mono"
            placeholder={isFocused || topic ? '' : 'Type a topic...'}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            spellCheck="false"
          />
          <div className="absolute top-0 left-0 w-full h-full pointer-events-none z-0">
            {deletedChars.map((item) => (
              <div
                key={item.id}
                className="deleted-char"
                style={
                  {
                    '--char-index': item.index,
                    '--random-x-offset': (Math.random() - 0.5) * 8,
                  } as React.CSSProperties
                }
              >
                {item.char}
              </div>
            ))}
          </div>
        </div>
      </div>

      {selectedFile && (
        <span className="inline-flex items-center justify-center min-h-5 text-light-text/80 dark:text-dark-text/80 text-sm">
          Attached: {selectedFile.name}
        </span>
      )}
    </section>
  )
}
