// src/App.tsx

import { BrowserRouter, Routes, Route, Link } from 'react-router-dom'
import Layout from './components/layout/Layout'
import ErrorBoundary from './components/ErrorBoundary'
import Home from './pages/Home'
import Park from './pages/Park'
import Restaurant from './pages/Restaurant'
import MenuItem from './pages/MenuItem'
import Search from './pages/Search'

function NotFound() {
  return (
    <div className="bg-park-soft rounded-xl p-8 text-center">
      <span className="text-4xl mb-3 block">🗺️</span>
      <h1 className="text-2xl font-bold text-park-blue mb-2">Page Not Found</h1>
      <p className="text-park-slate/70 mb-4">The page you're looking for doesn't exist.</p>
      <Link to="/" className="text-park-blue hover:text-park-gold transition-colors font-medium">
        Back to Parks
      </Link>
    </div>
  )
}

function App() {
  return (
    <BrowserRouter>
      <Layout>
        <ErrorBoundary>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/parks/:parkId" element={<Park />} />
            <Route path="/restaurants/:id" element={<Restaurant />} />
            <Route path="/items/:id" element={<MenuItem />} />
            <Route path="/search" element={<Search />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </ErrorBoundary>
      </Layout>
    </BrowserRouter>
  )
}

export default App
