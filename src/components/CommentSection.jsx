import { AnimatePresence, motion } from 'framer-motion'
import { useMemo, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import { selectIsAuthenticated, selectUser } from '../redux/authSlice'
import { addComment, makeSelectCommentsByPostId } from '../redux/commentsSlice'
import Avatar from './Avatar'
import CommentItem from './CommentItem'

export default function CommentSection({ postId, isOpen }) {
  const dispatch = useDispatch()
  const isAuthenticated = useSelector(selectIsAuthenticated)
  const user = useSelector(selectUser)

  const fullName = `${user?.prenom || ''} ${user?.nom || ''}`.trim()

  const commentsSelector = useMemo(() => makeSelectCommentsByPostId(postId), [postId])
  const comments = useSelector(commentsSelector)

  const [content, setContent] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!isAuthenticated) return

    const trimmed = content.trim()
    if (!trimmed) return

    dispatch(
      addComment({
        postId,
        userId: user.id,
        nom: user.nom,
        prenom: user.prenom,
        avatar: user.avatar || user.photo,
        content: trimmed,
      }),
    )

    setContent('')
  }

  return (
    <AnimatePresence initial={false}>
      {isOpen && (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: 'auto', opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          transition={{ duration: 0.22 }}
          style={{ overflow: 'hidden' }}
          className="mt-3"
        >
          <div className="px-divider mb-3" />

          <div className="d-flex flex-column gap-3">
            {isAuthenticated ? (
              <form onSubmit={handleSubmit}>
                <div className="d-flex gap-2">
                  <Avatar name={fullName} avatarUrl={user?.avatar || user?.photo} size="sm" />
                  <div className="flex-grow-1">
                    <textarea
                      className="form-control"
                      rows={2}
                      value={content}
                      onChange={(e) => setContent(e.target.value)}
                      placeholder="Write a comment…"
                    />
                    <div className="d-flex justify-content-end mt-2">
                      <button type="submit" className="btn btn-sm btn-primary" disabled={!content.trim()}>
                        Comment
                      </button>
                    </div>
                  </div>
                </div>
              </form>
            ) : (
              <div className="alert alert-light border mb-0" role="alert">
                Login to add a comment.
              </div>
            )}

            <div className="d-flex flex-column gap-3">
              <AnimatePresence initial={false}>
                {comments.map((c) => (
                  <CommentItem key={c.id} comment={c} />
                ))}
              </AnimatePresence>

              {comments.length === 0 && <div className="text-secondary">No comments yet.</div>}
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
