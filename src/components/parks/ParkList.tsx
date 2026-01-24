// src/components/parks/ParkList.tsx

import ParkCard from './ParkCard'
import type { Park } from '../../lib/types'

interface ParkListProps {
  parks: Park[]
  isLoading: boolean
}

export default function ParkList({ parks, isLoading }: ParkListProps) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="bg-white rounded-xl shadow-md border-l-4 border-park-soft p-6 animate-pulse"
          >
            <div className="h-6 bg-park-soft rounded w-3/4 mb-3" />
            <div className="h-4 bg-park-soft rounded w-1/2" />
          </div>
        ))}
      </div>
    )
  }

  if (parks.length === 0) {
    return (
      <div className="bg-park-soft rounded-xl p-8 text-center">
        <span className="text-4xl mb-3 block">🎢</span>
        <p className="text-park-slate/70">No parks found. Check back soon!</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {parks.map((park) => (
        <ParkCard key={park.id} park={park} />
      ))}
    </div>
  )
}
