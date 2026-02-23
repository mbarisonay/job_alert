import type { PropsWithChildren } from 'react'
import { Link, NavLink } from 'react-router-dom'
import { BriefcaseBusiness, Sparkles } from 'lucide-react'
import { cn } from '@/lib/utils'

type AppLayoutProps = PropsWithChildren

export function AppLayout({ children }: AppLayoutProps) {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <header className="sticky top-0 z-20 border-b border-slate-800 bg-slate-950/80 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
          <Link to="/" className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-900">
              <Sparkles className="h-4 w-4 text-emerald-400" />
            </div>
            <div className="flex flex-col leading-tight">
              <span className="text-sm font-semibold tracking-tight">
                AI Job Aggregator
              </span>
              <span className="text-xs text-slate-400">Akıllı iş eşleştirme</span>
            </div>
          </Link>

          <nav className="flex items-center gap-4 text-sm">
            <NavItem to="/">Ana Sayfa</NavItem>
            <NavItem to="/jobs">
              <BriefcaseBusiness className="mr-1.5 h-3.5 w-3.5" />
              İş Ara
            </NavItem>
          </nav>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 py-6">{children}</main>
    </div>
  )
}

type NavItemProps = PropsWithChildren<{
  to: string
}>

function NavItem({ to, children }: NavItemProps) {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        cn(
          'inline-flex items-center rounded-full px-3 py-1 text-xs font-medium text-slate-300 transition hover:bg-slate-900 hover:text-slate-50',
          isActive && 'bg-slate-900 text-slate-50',
        )
      }
    >
      {children}
    </NavLink>
  )
}

