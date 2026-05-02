import type { AnimationItem } from 'lottie-web'
import { useEffect, useRef, useState } from 'react'

export function LottieAsset({
  src,
  className = '',
  ariaLabel,
  loop = true,
}: {
  src: string
  className?: string
  ariaLabel?: string
  loop?: boolean
}) {
  const containerRef = useRef<HTMLDivElement>(null)
  const animationRef = useRef<AnimationItem | null>(null)
  const [status, setStatus] = useState<'loading' | 'ready' | 'error'>('loading')

  useEffect(() => {
    const container = containerRef.current

    if (!container || !src) {
      setStatus('error')
      return
    }

    const animationContainer = container
    setStatus('loading')
    animationContainer.replaceChildren()
    animationRef.current?.destroy()
    let cancelled = false
    let animation: AnimationItem | null = null

    const handleReady = () => setStatus('ready')
    const handleError = () => setStatus('error')

    async function loadAnimation() {
      try {
        const { default: lottiePlayer } = await import('lottie-web/build/player/lottie_light')

        if (cancelled) return

        animation = lottiePlayer.loadAnimation({
          container: animationContainer,
          renderer: 'svg',
          loop,
          autoplay: true,
          path: src,
          rendererSettings: {
            preserveAspectRatio: 'xMidYMid meet',
            progressiveLoad: true,
          },
        })

        animationRef.current = animation
        animation.addEventListener('DOMLoaded', handleReady)
        animation.addEventListener('data_failed', handleError)
      } catch {
        if (!cancelled) {
          setStatus('error')
        }
      }
    }

    loadAnimation()

    return () => {
      cancelled = true
      animation?.removeEventListener('DOMLoaded', handleReady)
      animation?.removeEventListener('data_failed', handleError)
      animation?.destroy()
      if (animationRef.current === animation) {
        animationRef.current = null
      }
    }
  }, [loop, src])

  return (
    <div className={`lottie-asset ${className}`} role={ariaLabel ? 'img' : undefined} aria-label={ariaLabel}>
      <div className="lottie-canvas" ref={containerRef} />
      {status !== 'ready' ? (
        <span className={`lottie-status ${status === 'error' ? 'error' : ''}`}>
          {status === 'error' ? 'JSON не загрузился' : 'Lottie JSON'}
        </span>
      ) : null}
    </div>
  )
}
