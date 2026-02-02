import { motion } from 'framer-motion'
import { useMemo } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import { selectIsAuthenticated, selectUser } from '../redux/authSlice'
import { makeSelectIsLikedByUser, makeSelectLikesCountByPostId, toggleLike } from '../redux/likesSlice'

export default function LikeButton({ postId, disabled = false }) {
  const dispatch = useDispatch()
  const isAuthenticated = useSelector(selectIsAuthenticated)
  const user = useSelector(selectUser)

  const countSelector = useMemo(() => makeSelectLikesCountByPostId(postId), [postId])
  const likesCount = useSelector(countSelector)

  const isLikedSelector = useMemo(() => makeSelectIsLikedByUser(postId, user?.id), [postId, user?.id])
  const isLiked = useSelector(isLikedSelector)

  const handleToggle = () => {
    if (!isAuthenticated || disabled) return
    dispatch(toggleLike({ postId, userId: user.id }))
  }

  const isDisabled = disabled || !isAuthenticated

  return (
    <motion.button
      type="button"
      whileTap={!isDisabled ? { scale: 0.92 } : undefined}
      className={`btn btn-link px-0 text-decoration-none px-action ${isLiked ? 'px-action-liked' : ''}`}
      onClick={handleToggle}
      disabled={isDisabled}
      aria-label="Like"
    >
      <span className="d-inline-flex align-items-center gap-2">
        <i className={`bi ${isLiked ? 'bi-heart-fill' : 'bi-heart'} px-action-icon`} />
        <span className="px-action-count">{likesCount}</span>
      </span>
    </motion.button>
  )
}
