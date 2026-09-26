import { useState } from 'react'
import type { ChangeEvent } from 'react'

export default function HeroInput() {
  const [topic, setTopic] = useState('')
  const [selectedFile, setSelectedFile] = useState<File | null>(null)

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] ?? null
    setSelectedFile(file)
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

        <input
          type="text"
          value={topic}
          onChange={(event) => setTopic(event.target.value)}
          className="topic-input"
          placeholder="Type a topic..."
        />
      </div>

      {selectedFile && <span className="file-status">Attached: {selectedFile.name}</span>}
    </section>
  )
}