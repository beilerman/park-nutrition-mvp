// src/App.tsx

import { lazy, Suspense } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Layout from './components/layout/Layout'
import ErrorBoundary from './components/ErrorBoundary'

const Home = lazy(() => import('./pages/Home'))
const Park = lazy(() => import('./pages/Park'))
const Restaurant = lazy(() => import('./pages/Restaurant'))
const MenuItem = lazy(() => import('./pages/MenuItem'))
const Search = lazy(() => import('./pages/Search'))

function NotFound() {
  return (
    <div className="text-center py-16">
      <span className="text-6xl block mb-4" aria-hidden="true">🗺️</span>
      <h1 className="text-3xl font-bold text-park-blue mb-2">Page not found</h1>
      <p className="text-park-slate/70 mb-6">The page you're looking for doesn't exist or has been moved.</p>
      <a
        href="/"
        className="inline-flex items-center gap-2 rounded-full bg-park-blue px-6 py-3 text-sm font-semibold text-white shadow-md hover:bg-park-blue/90 transition-colors"
      >
        Back to home
      </a>
    </div>
  )
}

function PageFallback() {
  return (
    <div className="flex items-center justify-center py-20">
      <div className="h-8 w-8 animate-spin rounded-full border-4 border-park-blue border-t-transparent" />
    </div>
  )
}

function App() {
  return (
    <BrowserRouter>
      <Layout>
        <ErrorBoundary>
          <Suspense fallback={<PageFallback />}>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/parks/:parkId" element={<Park />} />
              <Route path="/restaurants/:id" element={<Restaurant />} />
              <Route path="/items/:id" element={<MenuItem />} />
              <Route path="/search" element={<Search />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Suspense>
        </ErrorBoundary>
      </Layout>
    </BrowserRouter>
  )
}

export default App
