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
    <section className="hero-section">
      <h1>What's today's topic?</h1>

      <div className="input-shell">
        <input
          type="file"
          id="file-attachment"
          accept=".pdf, .docx, application/pdf, application/vnd.openxmlformats-officedocument.wordprocessingml.document"
          hidden
          onChange={handleFileChange}
        />

        <label htmlFor="file-attachment" className="attachment-btn" title={selectedFile ? selectedFile.name : 'Attach PDF or DOCX'}>
          ＋
        </label>

        <div className="topic-input-wrapper">
          <input
            type="text"
            value={topic}
            onChange={handleChange}
            className="topic-input"
            placeholder={isFocused || topic ? '' : 'Type a topic...'}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
          />
          <div className="deleted-chars-container">
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

      {selectedFile && <span className="file-status">Attached: {selectedFile.name}</span>}
    </section>
  )
}