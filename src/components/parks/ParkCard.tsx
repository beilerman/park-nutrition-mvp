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
      className="group relative block overflow-hidden rounded-2xl border border-park-soft/60 bg-white p-7 shadow-sm transition-all duration-300 hover:-translate-y-1.5 hover:shadow-xl hover:shadow-park-blue/8 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-park-gold"
    >
      {/* Hover gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-park-blue/5 via-transparent to-park-gold/10 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
      {/* Bottom accent bar */}
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-park-blue to-park-gold scale-x-0 transition-transform duration-300 origin-left group-hover:scale-x-100" />

      <div className="relative flex items-start justify-between gap-4">
        <div>
          <span className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-park-soft to-park-soft/50 text-xl shadow-sm">
            🎡
          </span>
          <h2 className="mt-4 text-xl font-bold text-park-blue transition-colors duration-200 group-hover:text-park-gold">
            {park.name}
          </h2>
          <p className="text-park-slate/60 mt-2 flex items-center gap-1.5 text-sm">
            <span>📍</span>
            {park.location}
          </p>
        </div>
        <span className="relative mt-1 flex h-8 w-8 items-center justify-center rounded-full bg-park-soft text-park-blue opacity-0 transition-all duration-200 group-hover:opacity-100 group-hover:bg-park-gold group-hover:text-white text-sm">
          &rarr;
        </span>
      </div>
    </Link>
  )
}
