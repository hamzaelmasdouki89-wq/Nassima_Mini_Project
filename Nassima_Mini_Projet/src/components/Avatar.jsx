import { useEffect, useMemo, useState } from 'react'

const DEFAULT_AVATAR_URL = 'https://ui-avatars.com/api/?name=User&background=random&color=fff'

const sizeToPx = {
  sm: 36,
  md: 48,
  lg: 96,
}

const buildUiAvatarUrl = (name) => {
  const trimmed = String(name || '').trim()
  const safeName = trimmed || 'User'
  return `https://ui-avatars.com/api/?name=${encodeURIComponent(safeName)}&background=random&color=fff`
}

export default function Avatar({ name, avatarUrl, size = 'md' }) {
  const fallbackUrl = useMemo(() => buildUiAvatarUrl(name), [name])

  const initialSrc = useMemo(() => {
    const url = String(avatarUrl || '').trim()
    return url ? url : fallbackUrl
  }, [avatarUrl, fallbackUrl])

  const [src, setSrc] = useState(initialSrc)

  useEffect(() => {
    setSrc(initialSrc)
  }, [initialSrc])

  const px = sizeToPx[size] || sizeToPx.md

  const handleError = () => {
    if (src === fallbackUrl || src === DEFAULT_AVATAR_URL) return
    setSrc(fallbackUrl || DEFAULT_AVATAR_URL)
  }

  return (
    <img
      src={src || DEFAULT_AVATAR_URL}
      alt="avatar"
      className="rounded-circle border"
      width={px}
      height={px}
      style={{ objectFit: 'cover', flexShrink: 0 }}
      onError={handleError}
      loading="lazy"
    />
  )
}
