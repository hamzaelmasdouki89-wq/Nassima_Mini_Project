import './App.css'

import { useSelector } from 'react-redux'

import AppRoutes from './routes/AppRoutes'
import { selectBackgroundColor } from './redux/authSlice'

function App() {
  const backgroundColor = useSelector(selectBackgroundColor)

  return (
    <div className="px-app" style={{ backgroundColor }}>
      <AppRoutes />
    </div>
  )
}

export default App
