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
      className="group block bg-white rounded-xl shadow-md border-l-4 border-park-gold p-6 hover:shadow-xl hover:-translate-y-1 transition-all duration-200"
    >
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-park-blue group-hover:text-park-gold transition-colors">
            {park.name}
          </h2>
          <p className="text-park-slate/70 mt-2 flex items-center gap-1.5">
            <span>📍</span>
            {park.location}
          </p>
        </div>
        <span className="text-park-gold opacity-0 group-hover:opacity-100 transition-opacity text-xl">
          →
        </span>
      </div>
    </Link>
  )
}
