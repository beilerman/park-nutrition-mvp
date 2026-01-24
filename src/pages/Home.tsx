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
    <div className="space-y-12">
      {/* Hero Section */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-park-blue via-park-blue/90 to-park-gold/80 p-10 text-white shadow-2xl">
        <div className="absolute -top-24 -right-16 h-48 w-48 rounded-full bg-white/15 blur-3xl" />
        <div className="absolute -bottom-24 left-10 h-48 w-48 rounded-full bg-park-cream/30 blur-3xl" />
        <div className="relative flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">
          <div className="max-w-2xl">
            <p className="inline-flex items-center gap-2 rounded-full bg-white/20 px-4 py-1 text-sm font-semibold uppercase tracking-wider">
              ✨ Park Nutrition Made Simple
            </p>
            <h1 className="mt-4 text-4xl font-bold leading-tight md:text-5xl">
              Discover park dining that fits your goals.
            </h1>
            <p className="mt-4 text-lg text-white/85">
              Explore restaurants, compare menu items, and build a day of magical meals with clarity and confidence.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <a
                href="/search"
                className="rounded-full bg-white px-6 py-3 text-sm font-semibold text-park-blue shadow-lg shadow-white/25 transition hover:-translate-y-0.5 hover:bg-park-cream"
              >
                Start searching
              </a>
              <a
                href="#parks"
                className="rounded-full border border-white/40 px-6 py-3 text-sm font-semibold text-white transition hover:bg-white/15"
              >
                Browse parks
              </a>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4 text-left">
            {[
              { label: 'Parks', value: parks.length || '12+' },
              { label: 'Menu items', value: '1.2k+' },
              { label: 'Allergens tracked', value: '14' },
              { label: 'Updated weekly', value: 'Yes' },
            ].map((stat) => (
              <div
                key={stat.label}
                className="rounded-2xl bg-white/15 p-4 text-white/90 shadow-lg"
              >
                <p className="text-sm uppercase tracking-wide text-white/70">{stat.label}</p>
                <p className="mt-2 text-2xl font-semibold">{stat.value}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Parks Section */}
      <section id="parks" className="space-y-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-wide text-park-gold">
              Plan your day
            </p>
            <h2 className="text-3xl font-bold text-park-blue">
              Select a Park
            </h2>
          </div>
          <div className="rounded-full border border-park-soft bg-white/70 px-4 py-2 text-sm text-park-slate shadow-sm">
            Tip: Filter by calories or allergens once you enter a park.
          </div>
        </div>
        <ParkList parks={parks} isLoading={isLoading} />
      </section>
    </div>
  )
}
