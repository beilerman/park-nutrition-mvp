// src/components/layout/Layout.tsx

import Header from './Header'

interface LayoutProps {
  children: React.ReactNode
}

export default function Layout({ children }: LayoutProps) {
  return (
    <div className="min-h-screen bg-park-cream">
      <Header />
      <main className="max-w-7xl mx-auto px-6 py-8">
        {children}
      </main>
      <footer className="border-t border-park-soft bg-park-cream/80 backdrop-blur">
        <div className="max-w-7xl mx-auto px-6 py-6 text-center">
          <p className="text-sm text-park-slate/50 flex items-center justify-center gap-2">
            <span className="text-park-gold">&#10022;</span>
            Where every meal is a little bit magical
            <span className="text-park-gold">&#10022;</span>
          </p>
        </div>
      </footer>
    </div>
  )
}
