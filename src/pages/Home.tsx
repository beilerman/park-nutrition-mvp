// src/pages/Home.tsx

import { useParks, useStats } from '../lib/queries'
import ParkList from '../components/parks/ParkList'

function formatCount(count: number): string {
  if (count >= 1000) {
    return `${(count / 1000).toFixed(1)}k+`
  }
  return String(count)
}

const STAT_ICONS = ['🏰', '🍽️', '⚠️', '✨']

export default function Home() {
  const { data: parks = [], isLoading, error } = useParks()
  const { data: stats } = useStats()

  if (error) {
    return (
      <div className="bg-park-red/10 border border-park-red/20 rounded-xl p-6 text-park-red">
        Error loading parks: {error.message}
      </div>
    )
  }

  return (
    <div className="space-y-14">
      {/* Hero Section */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-park-blue via-park-purple to-park-blue p-12 text-white shadow-2xl">
        {/* Magical decorative elements */}
        <div className="absolute -top-24 -right-16 h-64 w-64 rounded-full bg-park-gold/15 blur-3xl" />
        <div className="absolute -bottom-24 left-10 h-48 w-48 rounded-full bg-park-pink/20 blur-3xl" />
        <div className="absolute top-10 right-[20%] text-park-gold/30 text-2xl animate-twinkle">&#10022;</div>
        <div className="absolute bottom-16 left-[15%] text-park-gold/20 text-lg animate-twinkle" style={{ animationDelay: '1s' }}>&#10022;</div>
        <div className="absolute top-[40%] right-[10%] text-park-pink/20 text-sm animate-twinkle" style={{ animationDelay: '0.5s' }}>&#10022;</div>

        <div className="relative flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">
          <div className="max-w-2xl">
            <p className="inline-flex items-center gap-2 rounded-full bg-white/15 backdrop-blur px-5 py-1.5 text-sm font-semibold uppercase tracking-wider border border-white/10">
              <span className="animate-float inline-block">&#10022;</span> Where Nutrition Meets Magic
            </p>
            <h1 className="mt-5 text-4xl font-bold leading-tight md:text-5xl" style={{ fontFamily: 'var(--font-display)' }}>
              Discover enchanting dining for every adventure.
            </h1>
            <p className="mt-4 text-lg text-white/80 leading-relaxed">
              Explore restaurants, compare menu items, and build a day of magical meals — with all the nutrition details your heart desires.
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              <a
                href="/search"
                className="rounded-full bg-gradient-to-r from-park-gold to-park-gold/80 px-7 py-3 text-sm font-bold text-park-blue shadow-lg shadow-park-gold/25 transition-all hover:-translate-y-0.5 hover:shadow-xl hover:shadow-park-gold/30"
              >
                Start Exploring
              </a>
              <a
                href="#parks"
                className="rounded-full border-2 border-white/30 px-7 py-3 text-sm font-semibold text-white transition-all hover:bg-white/15 hover:border-white/50"
              >
                Browse Parks
              </a>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4 text-left">
            {[
              { label: 'Parks', value: parks.length || '-' },
              { label: 'Menu Items', value: stats ? formatCount(stats.menuItemCount) : '-' },
              { label: 'Allergens Tracked', value: stats?.allergenTypesCount ?? '-' },
              { label: 'Updated Weekly', value: 'Yes' },
            ].map((stat, i) => (
              <div
                key={stat.label}
                className="rounded-2xl bg-white/10 backdrop-blur border border-white/10 p-5 text-white/90 shadow-lg hover:bg-white/15 transition-colors"
              >
                <span className="text-2xl block mb-2">{STAT_ICONS[i]}</span>
                <p className="text-xs uppercase tracking-wider text-park-gold/80 font-semibold">{stat.label}</p>
                <p className="mt-1 text-2xl font-bold">{stat.value}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Parks Section */}
      <section id="parks" className="space-y-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm font-bold uppercase tracking-wider text-park-purple flex items-center gap-2">
              <span className="text-park-gold">&#10022;</span> Plan Your Day
            </p>
            <h2 className="text-3xl font-bold text-park-blue mt-1" style={{ fontFamily: 'var(--font-display)' }}>
              Select a Park
            </h2>
          </div>
          <div className="rounded-full border border-park-purple/20 bg-park-soft/50 backdrop-blur px-5 py-2.5 text-sm text-park-slate shadow-sm">
            Tip: Filter by calories or allergens once you enter a park.
          </div>
        </div>
        <ParkList parks={parks} isLoading={isLoading} />
      </section>
    </div>
  )
}
