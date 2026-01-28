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
            </Routes>
          </Suspense>
        </ErrorBoundary>
      </Layout>
    </BrowserRouter>
  )
}

export default App
