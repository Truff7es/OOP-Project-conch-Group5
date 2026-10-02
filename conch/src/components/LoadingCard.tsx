import { useEffect, useRef } from 'react'
import type { CSSProperties } from 'react'

import fetchLoadSound from '../assets/sfx/fetchload.wav'
import fetchDoneSound from '../assets/sfx/fetchdone.wav'

interface LoadingCardProps {
  status: 'fetching' | 'done'
}

export default function LoadingCard({ status }: LoadingCardProps) {
  const isDone = status === 'done'

  const fetchLoadAudio = useRef<HTMLAudioElement | null>(null)
  const fetchDoneAudio = useRef<HTMLAudioElement | null>(null)

  useEffect(() => {
    const loadAudio = new Audio(fetchLoadSound)
    const doneAudio = new Audio(fetchDoneSound)

    loadAudio.preload = 'auto'
    doneAudio.preload = 'auto'

    fetchLoadAudio.current = loadAudio
    fetchDoneAudio.current = doneAudio

    return () => {
      // Stop the fetching sound when the component unmounts.
      loadAudio.pause()
      loadAudio.currentTime = 0

      // Do NOT stop doneAudio.
      // It should be allowed to finish naturally.
      fetchLoadAudio.current = null
      fetchDoneAudio.current = null
    }
  }, [])

  useEffect(() => {
    if (status === 'fetching') {
      const audio = fetchLoadAudio.current

      if (!audio) return

      audio.currentTime = 0

      audio.play().catch((error) => {
        console.warn('Fetch loading audio playback prevented:', error)
      })
    }

    if (status === 'done') {
      const loadAudio = fetchLoadAudio.current

      if (loadAudio) {
        loadAudio.pause()
        loadAudio.currentTime = 0
      }

      const doneAudio = fetchDoneAudio.current

      if (!doneAudio) return

      doneAudio.currentTime = 0

      doneAudio.play().catch((error) => {
        console.warn('Fetch done audio playback prevented:', error)
      })
    }
  }, [status])

  return (
    <>
      <style>
        {`
          @keyframes fetchCardFadeIn {
            from {
              opacity: 0;
              transform: translateY(8px);
            }

            to {
              opacity: 1;
              transform: translateY(0);
            }
          }

          @keyframes fetchCardFadeOut {
            from {
              opacity: 1;
              transform: translateY(0);
            }

            to {
              opacity: 0;
              transform: translateY(-8px);
            }
          }

          @keyframes fetchNotchPulse {
            0%,
            12.5% {
              transform:
                rotate(var(--angle))
                translateY(-20px)
                scale(0.7);
              opacity: 0.35;
            }

            37.5% {
              transform:
                rotate(var(--angle))
                translateY(-20px)
                scale(1.35);
              opacity: 1;
            }

            50%,
            100% {
              transform:
                rotate(var(--angle))
                translateY(-20px)
                scale(0.7);
              opacity: 0.35;
            }
          }

          .fetch-card-enter {
            animation: fetchCardFadeIn 1s ease-in-out forwards;
          }

          .fetch-card-exit {
            animation: fetchCardFadeOut 1s ease-in-out forwards;
          }

          .fetch-notch {
            animation: fetchNotchPulse 1.28s ease-in-out infinite both;
            animation-delay: calc(var(--i) * 0.16s);
          }
        `}
      </style>

      <div
        className={`w-full max-w-2xl ${
          isDone ? 'fetch-card-exit' : 'fetch-card-enter'
        }`}
      >
        <div className="flex min-h-32 flex-col items-center justify-center gap-6 rounded-2xl bg-light-bar p-6 transition-colors dark:bg-dark-bar">
          {!isDone && (
            <div className="relative h-14 w-14 text-light-text dark:text-dark-text">
              {Array.from({ length: 8 }, (_, index) => {
                const notchStyle = {
                  '--i': index,
                  '--angle': `${index * 45}deg`,
                } as CSSProperties

                return (
                  <span
                    key={index}
                    className="fetch-notch absolute left-1/2 top-1/2 -ml-1 -mt-1 h-2 w-2 rounded-full bg-current"
                    style={notchStyle}
                  />
                )
              })}
            </div>
          )}

          <div className="text-center font-mono">
            <div className="text-lg font-bold text-light-text dark:text-dark-text">
              {isDone ? 'Done!' : 'Fetching.'}
            </div>

            {!isDone && (
              <div className="mt-1 text-sm text-light-text/60 dark:text-dark-text/60">
                Do not close tab
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  )
}