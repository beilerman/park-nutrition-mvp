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
      className="block bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow"
    >
      <h2 className="text-xl font-semibold text-gray-900">{park.name}</h2>
      <p className="text-gray-600 mt-1">{park.location}</p>
    </Link>
  )
}
