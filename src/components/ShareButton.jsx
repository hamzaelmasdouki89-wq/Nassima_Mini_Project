import { motion } from 'framer-motion'
import { useEffect, useMemo, useState } from 'react'

export default function ShareButton({ postId, disabled = false }) {
  const [open, setOpen] = useState(false)
  const [feedback, setFeedback] = useState('')

  const link = useMemo(() => {
    const origin = typeof window !== 'undefined' ? window.location.origin : ''
    return `${origin}/?post=${encodeURIComponent(postId)}`
  }, [postId])

  useEffect(() => {
    if (!feedback) return
    const t = setTimeout(() => setFeedback(''), 1500)
    return () => clearTimeout(t)
  }, [feedback])

  const copyToClipboard = async () => {
    try {
      if (navigator?.clipboard?.writeText) {
        await navigator.clipboard.writeText(link)
      } else {
        const input = document.createElement('input')
        input.value = link
        document.body.appendChild(input)
        input.select()
        document.execCommand('copy')
        document.body.removeChild(input)
      }
      setFeedback('Link copied')
    } catch (e) {
      setFeedback('Copy failed')
    }
    setOpen(false)
  }

  const shareNative = async () => {
    try {
      if (!navigator?.share) {
        setFeedback('Share not supported')
        return
      }
      await navigator.share({
        title: 'PX Post',
        text: 'Check out this post',
        url: link,
      })
      setFeedback('Shared')
    } catch (e) {
      setFeedback('Share canceled')
    }
    setOpen(false)
  }

  return (
    <div className="position-relative">
      <motion.button
        type="button"
        whileTap={{ scale: 0.95 }}
        className="btn btn-link px-0 text-decoration-none px-action"
        onClick={() => {
          if (disabled) return
          setOpen((v) => !v)
        }}
        disabled={disabled}
        aria-label="Share"
      >
        <span className="d-inline-flex align-items-center gap-2">
          <i className="bi bi-share px-action-icon" />
          <span className="px-action-count">Share</span>
        </span>
      </motion.button>

      {open && (
        <div className="dropdown-menu show px-share-menu">
          <button type="button" className="dropdown-item" onClick={copyToClipboard}>
            Copy link
          </button>
          <button type="button" className="dropdown-item" onClick={shareNative}>
            Share…
          </button>
        </div>
      )}

      {feedback && (
        <div className="px-share-feedback text-secondary" style={{ fontSize: 12 }}>
          {feedback}
        </div>
      )}
    </div>
  )
}
