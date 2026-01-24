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
      className="group relative block overflow-hidden rounded-2xl border border-park-soft/60 bg-white/80 p-6 shadow-md backdrop-blur transition-all duration-200 hover:-translate-y-1 hover:shadow-xl"
    >
      <div className="absolute inset-0 bg-gradient-to-br from-park-cream/40 via-transparent to-park-gold/10 opacity-0 transition-opacity duration-200 group-hover:opacity-100" />
      <div className="flex items-start justify-between gap-4">
        <div className="relative">
          <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-park-soft/60 text-lg">
            🎡
          </span>
          <h2 className="mt-4 text-xl font-bold text-park-blue transition-colors group-hover:text-park-gold">
            {park.name}
          </h2>
          <p className="text-park-slate/70 mt-2 flex items-center gap-1.5">
            <span>📍</span>
            {park.location}
          </p>
        </div>
        <span className="relative text-park-gold opacity-0 transition-opacity group-hover:opacity-100 text-xl">
          →
        </span>
      </div>
    </Link>
  )
}
