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
    <header className="bg-gradient-to-r from-park-blue via-park-purple to-park-blue shadow-lg relative overflow-hidden">
      {/* Decorative stars */}
      <div className="absolute inset-0 pointer-events-none">
        <span className="absolute top-2 left-[10%] text-park-gold/40 text-xs animate-twinkle">&#10022;</span>
        <span className="absolute top-4 left-[30%] text-park-gold/30 text-[10px] animate-twinkle" style={{ animationDelay: '0.5s' }}>&#10022;</span>
        <span className="absolute top-1 right-[20%] text-park-gold/35 text-xs animate-twinkle" style={{ animationDelay: '1s' }}>&#10022;</span>
        <span className="absolute bottom-2 right-[40%] text-park-gold/25 text-[10px] animate-twinkle" style={{ animationDelay: '1.5s' }}>&#10022;</span>
        <span className="absolute top-3 right-[60%] text-park-gold/30 text-xs animate-twinkle" style={{ animationDelay: '0.7s' }}>&#10022;</span>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-5 flex items-center justify-between gap-6 relative">
        <Link to="/" className="flex items-center gap-3 group">
          <span className="text-3xl animate-float">🏰</span>
          <div className="flex flex-col">
            <span className="text-xl font-bold text-white group-hover:text-park-gold transition-colors" style={{ fontFamily: 'var(--font-display)' }}>
              Park Nutrition
            </span>
            <span className="text-[10px] uppercase tracking-[0.2em] text-park-gold/70 font-semibold">
              Magical Dining Guide
            </span>
          </div>
        </Link>

        <form onSubmit={handleSearch} className="flex-1 max-w-lg" role="search">
          <div className="relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-park-gold/60" aria-hidden="true">
              &#10022;
            </span>
            <label htmlFor="global-search" className="sr-only">
              Search menu items
            </label>
            <input
              id="global-search"
              type="search"
              placeholder="Search for magical meals..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              aria-label="Search menu items across all parks"
              className="w-full pl-11 pr-4 py-2.5 bg-white/10 backdrop-blur border border-white/20 rounded-full text-white placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-park-gold focus:bg-white/20 transition-all"
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
