import { motion } from 'framer-motion'
import { useSelector } from 'react-redux'

import PostCard from '../components/PostCard'
import { approvedPostsSelector } from '../redux/requestsSlice'

export default function HomePage() {
  const posts = useSelector(approvedPostsSelector)

  return (
    <div className="container py-4">
      <div className="row justify-content-center">
        <div className="col-12 col-lg-8 col-xl-7">
          <div className="d-flex align-items-center justify-content-between mb-3">
            <h1 className="h4 mb-0">Accueil</h1>
            <span className="badge text-bg-light border">{posts.length} posts</span>
          </div>

          <motion.div
            initial="hidden"
            animate="show"
            variants={{
              hidden: { opacity: 0 },
              show: { opacity: 1, transition: { staggerChildren: 0.06 } },
            }}
            className="d-flex flex-column gap-3"
          >
            {posts.map((p) => (
              <motion.div key={p.id} variants={{ hidden: { opacity: 0, y: 8 }, show: { opacity: 1, y: 0 } }}>
                <PostCard post={p} />
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </div>
  )
}
