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
    <header className="bg-white border-b border-gray-200 px-6 py-4">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
        <Link to="/" className="text-xl font-bold text-green-600">
          Park Nutrition
        </Link>

        <form onSubmit={handleSearch} className="flex-1 max-w-md">
          <input
            type="search"
            placeholder="Search menu items..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
          />
        </form>

        <nav className="flex items-center gap-4">
          <Link to="/" className="text-gray-600 hover:text-gray-900">
            Parks
          </Link>
        </nav>
      </div>
    </header>
  )
}
