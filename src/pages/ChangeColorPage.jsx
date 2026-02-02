import { useDispatch, useSelector } from 'react-redux'
import { motion } from 'framer-motion'

import { selectUser, updatePreferredColor } from '../redux/authSlice'

export default function ChangeColorPage() {
  const user = useSelector(selectUser)
  const dispatch = useDispatch()

  const handleChange = (e) => {
    dispatch(updatePreferredColor(e.target.value))
  }

  return (
    <div className="container py-4">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.25 }}
        className="px-card"
      >
        <h1 className="h4 mb-2">Change Color</h1>
        <p className="text-secondary mb-3">
          This color is applied as the background of the whole application.
        </p>

        <div className="row g-3 align-items-center">
          <div className="col-12 col-md-4">
            <label className="form-label" htmlFor="color">
              Preferred color
            </label>
            <input
              id="color"
              type="color"
              className="form-control form-control-color w-100"
              value={user?.couleur || '#ffffff'}
              onChange={handleChange}
            />
          </div>
          <div className="col-12 col-md-8">
            <div className="px-card" style={{ background: user?.couleur || '#ffffff' }}>
              <div className="fw-semibold">Preview</div>
              <div className="text-secondary" style={{ fontSize: 14 }}>
                Your selected color: {user?.couleur}
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  )
}
