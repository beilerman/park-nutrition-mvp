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
    <header className="bg-gradient-to-r from-park-blue to-park-blue/95 shadow-lg shadow-park-blue/10 sticky top-0 z-50 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between gap-6">
        <Link to="/" className="flex items-center gap-2.5 group shrink-0">
          <span className="text-2xl transition-transform duration-200 group-hover:scale-110">🏰</span>
          <div className="flex flex-col">
            <span className="text-lg font-extrabold text-white group-hover:text-park-gold transition-colors duration-200 leading-tight tracking-tight">
              Park Nutrition
            </span>
            <span className="text-[10px] font-semibold uppercase tracking-widest text-white/40">
              Eat smart, play hard
            </span>
          </div>
        </Link>

        <form onSubmit={handleSearch} className="flex-1 max-w-lg" role="search">
          <div className="relative group">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-park-slate/40 transition-colors group-focus-within:text-park-gold" aria-hidden="true">
              🔍
            </span>
            <label htmlFor="global-search" className="sr-only">
              Search menu items
            </label>
            <input
              id="global-search"
              type="search"
              placeholder="Search menu items..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              aria-label="Search menu items across all parks"
              className="w-full pl-11 pr-4 py-2.5 bg-white/10 border border-white/10 text-white rounded-full focus:outline-none focus:ring-2 focus:ring-park-gold/50 focus:bg-white focus:text-park-slate transition-all duration-200 placeholder:text-white/40 focus:placeholder:text-park-slate/40"
            />
          </div>
        </form>

        <nav className="flex items-center gap-6 shrink-0">
          <Link
            to="/"
            className="text-white/80 hover:text-park-gold transition-colors duration-200 font-semibold text-sm relative after:absolute after:-bottom-1 after:left-0 after:w-0 after:h-0.5 after:bg-park-gold after:rounded-full hover:after:w-full after:transition-all after:duration-200"
          >
            Parks
          </Link>
        </nav>
      </div>
    </header>
  )
}
