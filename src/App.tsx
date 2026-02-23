import { Routes, Route } from 'react-router-dom'
import { LandingPage } from '@/pages/LandingPage'
import { JobSearchPage } from '@/pages/JobSearchPage'
import './index.css'

function App() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/jobs" element={<JobSearchPage />} />
    </Routes>
  )
}

export default App
