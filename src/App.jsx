import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import VendorDetail from './pages/VendorDetail'

function App() {
  return (
    <BrowserRouter basename="/weddingfinder">
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/vendor/:slug" element={<VendorDetail />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
