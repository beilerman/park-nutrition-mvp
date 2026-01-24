// src/pages/Home.tsx

import { useParks } from '../lib/queries'
import ParkList from '../components/parks/ParkList'

export default function Home() {
  const { data: parks = [], isLoading, error } = useParks()

  if (error) {
    return (
      <div className="text-red-600">
        Error loading parks: {error.message}
      </div>
    )
  }

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-900 mb-6">
        Select a Park
      </h1>
      <ParkList parks={parks} isLoading={isLoading} />
    </div>
  )
}
