import { motion } from 'framer-motion'
import Avatar from './Avatar'

export default function RequestCard({ request, rightSlot }) {
  const fullName = `${request?.prenom || ''} ${request?.nom || ''}`.trim()

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{ duration: 0.18 }}
      className="px-card"
    >
      <div className="d-flex align-items-start justify-content-between gap-3">
        <div className="d-flex gap-3">
          <Avatar name={fullName} avatarUrl={request?.avatar} size="md" />
          <div>
            <div className="d-flex align-items-center gap-2 flex-wrap">
              <div className="fw-semibold">{fullName || 'User'}</div>
              <div className="text-secondary" style={{ fontSize: 13 }}>
                @{request?.pseudo || ''}
              </div>
              <span className="badge text-bg-light border">{request?.status}</span>
            </div>

            <div className="fw-semibold mt-2">{request?.title}</div>
            <div className="text-secondary" style={{ fontSize: 14 }}>
              {request?.description}
            </div>

            <div className="text-secondary mt-2" style={{ fontSize: 12 }}>
              Created: {request?.createdAt ? new Date(request.createdAt).toLocaleString() : ''}
            </div>
          </div>
        </div>

        {rightSlot ? <div className="text-end">{rightSlot}</div> : null}
      </div>
    </motion.div>
  )
}
