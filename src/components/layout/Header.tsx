// src/components/layout/Header.tsx

import { Link, useNavigate } from 'react-router-dom'
import { useState } from 'react'

export default function Header() {
  const [searchQuery, setSearchQuery] = useState('')
  const navigate = useNavigate()

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`)
    }
  }

  return (
    <header className="bg-park-blue shadow-lg">
      <div className="max-w-7xl mx-auto px-6 py-5 flex items-center justify-between gap-6">
        <Link to="/" className="flex items-center gap-2 group">
          <span className="text-2xl">🏰</span>
          <span className="text-xl font-bold text-white group-hover:text-park-gold transition-colors">
            Park Nutrition
          </span>
        </Link>

        <form onSubmit={handleSearch} className="flex-1 max-w-lg">
          <div className="relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-park-slate/50">
              🔍
            </span>
            <input
              type="search"
              placeholder="Search menu items..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-11 pr-4 py-2.5 bg-park-soft rounded-full focus:outline-none focus:ring-2 focus:ring-park-gold focus:bg-white transition-all placeholder:text-park-slate/50"
            />
          </div>
        </form>

        <nav className="flex items-center gap-6">
          <Link
            to="/"
            className="text-white hover:text-park-gold transition-colors font-medium relative after:absolute after:bottom-0 after:left-0 after:w-0 after:h-0.5 after:bg-park-gold hover:after:w-full after:transition-all"
          >
            Parks
          </Link>
        </nav>
      </div>
    </header>
  )
}
