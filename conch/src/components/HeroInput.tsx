import { useState } from 'react'
import type { ChangeEvent } from 'react'

export default function HeroInput() {
  const [topic, setTopic] = useState('')
  const [selectedFile, setSelectedFile] = useState<File | null>(null)

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0])
    }
  }

  return (
    <section className="hero flex flex-col items-center justify-center gap-4 mt-20">
      <h1 className="text text-neutral-100 text-2xl md:text-3xl font-mono">
        What's today's topic?
      </h1>

      <div className="border border-neutral-100 rounded-2xl input-container relative flex items-center w-full max-w-lg">
        <input
          type="file"
          id="file-attachment"
          accept=".pdf, .docx, application/pdf, application/vnd.openxmlformats-officedocument.wordprocessingml.document"
          hidden
          onChange={handleFileChange}
        />

        <label
          htmlFor="file-attachment"
          className="attachment-btn cursor-pointer px-3 text-xl text-neutral-100"
          title={selectedFile ? selectedFile.name : "Attach PDF or DOCX"}
        >
          ＋
        </label>

        <input
          type="text"
          value={topic}
          onChange={(e) => setTopic(e.target.value)}
          className="topic-input text-neutral-100 w-full py-2 pr-3 focus:outline-none font-mono"
          placeholder="Type a topic..."
        />
      </div>

      {selectedFile && (
        <span className="text-xs text-neutral-500">
          Attached: {selectedFile.name}
        </span>
      )}
    </section>
  )
}