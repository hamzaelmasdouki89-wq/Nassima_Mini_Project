import { AnimatePresence, motion } from 'framer-motion'
import { Outlet, useLocation } from 'react-router-dom'

import Header from '../components/Header'
import Sidebar from '../components/Sidebar'
import Footer from '../components/Footer'

export default function AppLayout() {
  const location = useLocation()

  return (
    <div className="d-flex flex-column min-vh-100">
      <Header />

      <div className="container-fluid flex-grow-1">
        <div className="row">
          <div className="col-lg-3 col-xl-2 px-0">
            <Sidebar />
          </div>

          <main className="col px-0">
            <div className="px-main">
              <AnimatePresence mode="wait">
                <motion.div
                  key={location.pathname}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                >
                  <Outlet />
                </motion.div>
              </AnimatePresence>
            </div>
            <div className="d-lg-none" style={{ height: 56 }} />
          </main>
        </div>
      </div>

      <Footer />
    </div>
  )
}
