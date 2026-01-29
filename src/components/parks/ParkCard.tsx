// src/components/parks/ParkCard.tsx

import { Link } from 'react-router-dom'
import type { Park } from '../../lib/types'

interface ParkCardProps {
  park: Park
}

export default function ParkCard({ park }: ParkCardProps) {
  return (
    <Link
      to={`/parks/${park.id}`}
      className="group relative block overflow-hidden rounded-2xl border border-park-purple/10 bg-white/90 backdrop-blur p-7 shadow-md transition-all duration-300 hover:-translate-y-1.5 hover:shadow-xl hover:shadow-park-purple/10"
    >
      <div className="absolute inset-0 bg-gradient-to-br from-park-soft/40 via-transparent to-park-gold/5 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
      {/* Sparkle on hover */}
      <span className="absolute top-3 right-3 text-park-gold text-sm opacity-0 group-hover:opacity-100 transition-opacity animate-twinkle">&#10022;</span>

      <div className="flex items-start justify-between gap-4">
        <div className="relative">
          <span className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-park-purple/10 to-park-soft text-xl">
            🏰
          </span>
          <h2 className="mt-4 text-xl font-bold text-park-blue transition-colors group-hover:text-park-purple" style={{ fontFamily: 'var(--font-display)' }}>
            {park.name}
          </h2>
          <p className="text-park-slate/60 mt-2 flex items-center gap-1.5 text-sm">
            <span>📍</span>
            {park.location}
          </p>
        </div>
        <span className="relative text-park-purple opacity-0 transition-all group-hover:opacity-100 group-hover:translate-x-1 text-xl mt-2">
          &rarr;
        </span>
      </div>
    </Link>
  )
}
