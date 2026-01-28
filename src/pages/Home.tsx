// src/pages/Home.tsx

import { Link } from 'react-router-dom'
import { useParks, useStats } from '../lib/queries'
import ParkList from '../components/parks/ParkList'

function formatCount(count: number): string {
  if (count >= 1000) {
    return `${(count / 1000).toFixed(1)}k+`
  }
  return String(count)
}

const FEATURES = [
  {
    icon: '🔍',
    title: 'Search & Compare',
    description: 'Find menu items across every restaurant and compare nutrition side by side.',
  },
  {
    icon: '⚠️',
    title: 'Allergen Alerts',
    description: 'Filter out dishes that contain your allergens so you can dine with confidence.',
  },
  {
    icon: '📊',
    title: 'Nutrition at a Glance',
    description: 'Calories, macros, and confidence scores for every item — all in one place.',
  },
]

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
    <div className="space-y-16">
      {/* Hero Section */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-park-blue via-park-blue/90 to-park-gold/70 px-8 py-14 md:px-14 md:py-20 text-white shadow-2xl animate-gradient">
        {/* Decorative orbs */}
        <div className="absolute -top-32 -right-20 h-72 w-72 rounded-full bg-park-gold/20 blur-3xl animate-pulse-soft" />
        <div className="absolute -bottom-32 -left-10 h-64 w-64 rounded-full bg-white/10 blur-3xl animate-pulse-soft" style={{ animationDelay: '2s' }} />
        <div className="absolute top-1/2 right-1/4 h-40 w-40 rounded-full bg-park-cream/10 blur-3xl animate-pulse-soft" style={{ animationDelay: '3s' }} />

        <div className="relative flex flex-col gap-10 lg:flex-row lg:items-center lg:justify-between">
          <div className="max-w-2xl animate-fade-in-up">
            <p className="inline-flex items-center gap-2 rounded-full bg-white/15 px-4 py-1.5 text-sm font-semibold uppercase tracking-wider backdrop-blur-sm border border-white/10">
              Park Nutrition Made Simple
            </p>
            <h1 className="mt-6 text-4xl font-extrabold leading-tight md:text-5xl lg:text-6xl tracking-tight">
              Eat smarter.
              <br />
              <span className="text-park-gold">Play harder.</span>
            </h1>
            <p className="mt-5 text-lg md:text-xl text-white/80 leading-relaxed max-w-lg">
              Explore restaurants, compare menu items, and build a day of magical meals with clarity and confidence.
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              <Link
                to="/search"
                className="group relative inline-flex items-center gap-2 rounded-full bg-white px-7 py-3.5 text-sm font-bold text-park-blue shadow-lg shadow-black/10 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-park-gold/20"
              >
                Start searching
                <span className="transition-transform duration-200 group-hover:translate-x-0.5">&rarr;</span>
              </Link>
              <a
                href="#parks"
                className="rounded-full border-2 border-white/30 px-7 py-3.5 text-sm font-bold text-white transition-all duration-200 hover:bg-white/15 hover:border-white/50 backdrop-blur-sm"
              >
                Browse parks
              </a>
            </div>
          </div>

          {/* Stats grid */}
          <div className="grid grid-cols-2 gap-4 text-left animate-fade-in-up stagger-2">
            {[
              { label: 'Parks', value: parks.length || '-', icon: '🎡' },
              { label: 'Menu items', value: stats ? formatCount(stats.menuItemCount) : '-', icon: '🍽️' },
              { label: 'Allergens tracked', value: stats?.allergenTypesCount ?? '-', icon: '🛡️' },
              { label: 'Updated weekly', value: 'Yes', icon: '🔄' },
            ].map((stat, i) => (
              <div
                key={stat.label}
                className={`rounded-2xl bg-white/10 backdrop-blur-sm border border-white/10 p-5 text-white/90 shadow-lg transition-all duration-300 hover:bg-white/20 hover:-translate-y-0.5 stagger-${i + 1}`}
              >
                <span className="text-2xl">{stat.icon}</span>
                <p className="mt-2 text-xs uppercase tracking-widest text-white/60 font-medium">{stat.label}</p>
                <p className="mt-1 text-3xl font-extrabold">{stat.value}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Features Section */}
      <section className="space-y-8">
        <div className="text-center animate-fade-in-up">
          <p className="text-sm font-bold uppercase tracking-widest text-park-gold">Why Park Nutrition?</p>
          <h2 className="mt-2 text-3xl md:text-4xl font-extrabold text-park-blue">
            Everything you need to dine smart
          </h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {FEATURES.map((feature, i) => (
            <div
              key={feature.title}
              className={`group relative overflow-hidden rounded-2xl bg-white border border-park-soft/60 p-8 shadow-sm transition-all duration-300 hover:shadow-xl hover:-translate-y-1 animate-fade-in-up stagger-${i + 1}`}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-park-gold/5 to-park-blue/5 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
              <div className="relative">
                <span className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-park-soft text-2xl shadow-sm">
                  {feature.icon}
                </span>
                <h3 className="mt-5 text-lg font-bold text-park-blue">{feature.title}</h3>
                <p className="mt-2 text-park-slate/70 leading-relaxed">{feature.description}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Parks Section */}
      <section id="parks" className="space-y-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div className="animate-fade-in-up">
            <p className="text-sm font-bold uppercase tracking-widest text-park-gold">
              Plan your day
            </p>
            <h2 className="mt-1 text-3xl md:text-4xl font-extrabold text-park-blue">
              Select a Park
            </h2>
          </div>
          <div className="rounded-full border border-park-soft bg-white/80 backdrop-blur-sm px-5 py-2.5 text-sm text-park-slate/70 shadow-sm">
            Tip: Filter by calories or allergens once you enter a park.
          </div>
        </div>
        <ParkList parks={parks} isLoading={isLoading} />
      </section>
    </div>
  )
}
