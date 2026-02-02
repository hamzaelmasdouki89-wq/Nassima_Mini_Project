import { motion } from 'framer-motion'
import { useMemo, useState } from 'react'
import { useSelector } from 'react-redux'

import { selectIsAuthenticated, selectUser } from '../redux/authSlice'
import { makeSelectCommentsCountByPostId } from '../redux/commentsSlice'
import Avatar from './Avatar'
import LikeButton from './LikeButton'
import CommentSection from './CommentSection'
import ShareButton from './ShareButton'

export default function PostCard({ post }) {
  const isAuthenticated = useSelector(selectIsAuthenticated)
  const user = useSelector(selectUser)

  const isApproved = post?.status === 'APPROVED'
  const canInteract = Boolean(isAuthenticated && isApproved)

  const commentsCountSelector = useMemo(() => makeSelectCommentsCountByPostId(post.id), [post.id])
  const commentsCount = useSelector(commentsCountSelector)

  const [isCommentsOpen, setIsCommentsOpen] = useState(false)

  const authorName = `${post?.prenom || ''} ${post?.nom || ''}`.trim()
  const dateLabel = post?.approvedAt ? new Date(post.approvedAt).toLocaleString() : ''

  const toggleComments = () => {
    if (!canInteract) return
    setIsCommentsOpen((v) => !v)
  }

  return (
    <motion.div whileHover={{ y: -1 }} transition={{ duration: 0.12 }} className="px-card">
      <div className="d-flex gap-3">
        <Avatar name={authorName} avatarUrl={post?.avatar} size="md" />

        <div className="flex-grow-1">
          <div className="d-flex align-items-center justify-content-between gap-2">
            <div className="d-flex align-items-center gap-2 flex-wrap">
              <div className="fw-semibold">{authorName}</div>
              <div className="text-secondary" style={{ fontSize: 13 }}>
                @{post?.pseudo}
              </div>
              <div className="text-secondary" style={{ fontSize: 13 }}>
                · Approved {dateLabel}
              </div>
            </div>
            {user?.admin && <span className="badge text-bg-light border">Admin</span>}
          </div>

          <div className="mt-2">
            <div className="fw-semibold" style={{ fontSize: 15 }}>
              {post?.title}
            </div>
            <div className="text-secondary" style={{ fontSize: 15, whiteSpace: 'pre-wrap' }}>
              {post?.description}
            </div>
          </div>

          <div className="d-flex align-items-center justify-content-between mt-3">
            <div className="d-flex align-items-center gap-4">
              <LikeButton postId={post.id} disabled={!canInteract} />

              <motion.button
                type="button"
                whileTap={canInteract ? { scale: 0.95 } : undefined}
                className="btn btn-link px-0 text-decoration-none px-action"
                onClick={toggleComments}
                disabled={!canInteract}
                aria-label="Comments"
              >
                <span className="d-inline-flex align-items-center gap-2">
                  <i className="bi bi-chat px-action-icon" />
                  <span className="px-action-count">{commentsCount}</span>
                </span>
              </motion.button>

              <ShareButton postId={post.id} disabled={!canInteract} />
            </div>

            {!canInteract && (
              <div className="text-secondary" style={{ fontSize: 12 }}>
                {isApproved ? 'Login to interact' : 'Not available'}
              </div>
            )}
          </div>

          <CommentSection postId={post.id} isOpen={isCommentsOpen} />
        </div>
      </div>
    </motion.div>
  )
}
