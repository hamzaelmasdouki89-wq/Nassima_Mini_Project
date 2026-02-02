import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'

export default function UnauthorizedPage() {
  return (
    <div className="container py-4">
      <div className="row justify-content-center">
        <div className="col-12 col-md-8 col-lg-6">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.25 }}
            className="px-card"
          >
            <h1 className="h4 mb-2">Unauthorized</h1>
            <div className="text-secondary">You do not have permission to access this page.</div>

            <div className="mt-3">
              <Link className="btn btn-primary" to="/">
                Go to home
              </Link>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}
