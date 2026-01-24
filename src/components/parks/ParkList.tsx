// src/components/parks/ParkList.tsx

import ParkCard from './ParkCard'
import type { Park } from '../../lib/types'

interface ParkListProps {
  parks: Park[]
  isLoading: boolean
}

export default function ParkList({ parks, isLoading }: ParkListProps) {
  if (isLoading) {
    return <div className="text-gray-500">Loading parks...</div>
  }

  if (parks.length === 0) {
    return <div className="text-gray-500">No parks found.</div>
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {parks.map((park) => (
        <ParkCard key={park.id} park={park} />
      ))}
    </div>
  )
}
