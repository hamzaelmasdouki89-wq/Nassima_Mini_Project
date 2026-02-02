import { motion } from 'framer-motion'
import Avatar from './Avatar'

export default function CommentItem({ comment }) {
  const fullName = `${comment?.prenom || ''} ${comment?.nom || ''}`.trim()

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -6 }}
      transition={{ duration: 0.18 }}
      className="d-flex gap-2"
    >
      <Avatar name={fullName} avatarUrl={comment?.avatar} size="sm" />
      <div className="flex-grow-1">
        <div className="d-flex align-items-center justify-content-between">
          <div className="fw-semibold" style={{ fontSize: 14 }}>
            {fullName || 'User'}
          </div>
          <div className="text-secondary" style={{ fontSize: 12 }}>
            {comment?.createdAt ? new Date(comment.createdAt).toLocaleString() : ''}
          </div>
        </div>
        <div style={{ fontSize: 14 }}>{comment?.content}</div>
      </div>
    </motion.div>
  )
}
