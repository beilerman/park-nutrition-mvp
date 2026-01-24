// src/pages/Home.tsx

import { useParks } from '../lib/queries'
import ParkList from '../components/parks/ParkList'

export default function Home() {
  const { data: parks = [], isLoading, error } = useParks()

  if (error) {
    return (
      <div className="bg-park-red/10 border border-park-red/20 rounded-xl p-6 text-park-red">
        Error loading parks: {error.message}
      </div>
    )
  }

  return (
    <div>
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-park-blue to-park-blue/80 rounded-2xl p-8 mb-8 text-white">
        <h1 className="text-4xl font-bold mb-3">
          Discover Park Dining
        </h1>
        <p className="text-white/80 text-lg max-w-xl">
          Find nutrition info for your favorite theme park foods. Make informed choices while enjoying the magic.
        </p>
      </div>

      {/* Parks Section */}
      <h2 className="text-2xl font-bold text-park-blue mb-6">
        Select a Park
      </h2>
      <ParkList parks={parks} isLoading={isLoading} />
    </div>
  )
}
