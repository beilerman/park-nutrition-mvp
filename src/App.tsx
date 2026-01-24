// src/App.tsx

import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Layout from './components/layout/Layout'
import ErrorBoundary from './components/ErrorBoundary'
import Home from './pages/Home'
import Park from './pages/Park'
import Restaurant from './pages/Restaurant'
import MenuItem from './pages/MenuItem'
import Search from './pages/Search'

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
          </Routes>
        </ErrorBoundary>
      </Layout>
    </BrowserRouter>
  )
}

export default App
