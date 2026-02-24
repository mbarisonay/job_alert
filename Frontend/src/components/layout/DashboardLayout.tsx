import { useState } from "react";
import { Link, NavLink, Outlet, useNavigate } from "react-router-dom";
import { useAuthStore } from "@/store/authStore";
import { ThemeToggle } from "@/components/ThemeToggle";
import { Button } from "@/components/ui/button";
import { Sheet } from "@/components/ui/sheet";
import { cn } from "@/lib/utils";
import {
  Bookmark,
  ClipboardList,
  FileText,
  LogOut,
  Menu,
  Settings,
  Sparkles,
  User,
  X,
} from "lucide-react";

const NAV_ITEMS = [
  { to: "/dashboard", label: "Önerilen İlanlar", icon: Sparkles },
  { to: "/dashboard/cv", label: "CV Analizi", icon: FileText },
  { to: "/dashboard/saved", label: "Kaydedilen İlanlar", icon: Bookmark },
  { to: "/dashboard/tracking", label: "Başvuru Takibim", icon: ClipboardList },
  { to: "/dashboard/settings", label: "Tercihler", icon: Settings },
  { to: "/dashboard/profile", label: "Profilim", icon: User },
];

export function DashboardLayout() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();

  function handleLogout() {
    logout();
    navigate("/login");
  }

  return (
    <div className="flex h-screen bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-slate-100 transition-colors">
      {/* Desktop sidebar */}
      <aside className="hidden lg:flex lg:w-64 lg:flex-col lg:border-r border-slate-200 dark:border-slate-800 bg-white/60 dark:bg-slate-950">
        <SidebarContent
          user={user}
          onLogout={handleLogout}
          onNavClick={() => {}}
        />
      </aside>

      {/* Mobile sheet */}
      <Sheet open={mobileOpen} onClose={() => setMobileOpen(false)}>
        <SidebarContent
          user={user}
          onLogout={handleLogout}
          onNavClick={() => setMobileOpen(false)}
          showClose
          onClose={() => setMobileOpen(false)}
        />
      </Sheet>

      {/* Main area */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Mobile topbar */}
        <header className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 bg-white/60 dark:bg-slate-950/80 backdrop-blur px-4 py-3 lg:hidden">
          <button
            type="button"
            onClick={() => setMobileOpen(true)}
            className="rounded-md p-1.5 text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
          >
            <Menu className="h-5 w-5" />
          </button>

          <Link to="/" className="flex items-center gap-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-slate-200 dark:bg-slate-900">
              <Sparkles className="h-3.5 w-3.5 text-emerald-400" />
            </div>
            <span className="text-sm font-semibold tracking-tight">
              AI Job Aggregator
            </span>
          </Link>

          <ThemeToggle />
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

type SidebarContentProps = {
  user: ReturnType<typeof useAuthStore>["user"];
  onLogout: () => void;
  onNavClick: () => void;
  showClose?: boolean;
  onClose?: () => void;
};

function SidebarContent({
  user,
  onLogout,
  onNavClick,
  showClose,
  onClose,
}: SidebarContentProps) {
  return (
    <div className="flex h-full flex-col">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 px-4 py-4">
        <Link to="/" className="flex items-center gap-2" onClick={onNavClick}>
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-200 dark:bg-slate-900">
            <Sparkles className="h-4 w-4 text-emerald-400" />
          </div>
          <div className="flex flex-col leading-tight">
            <span className="text-sm font-semibold tracking-tight">
              AI Job Aggregator
            </span>
            <span className="text-[11px] text-slate-500 dark:text-slate-400">
              Dashboard
            </span>
          </div>
        </Link>

        {showClose && (
          <button
            type="button"
            onClick={onClose}
            className="rounded-md p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
          >
            <X className="h-4 w-4" />
          </button>
        )}

        {!showClose && <ThemeToggle />}
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-1 overflow-y-auto px-3 py-4">
        {NAV_ITEMS.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            end={to === "/dashboard"}
            onClick={onNavClick}
            className={({ isActive }) =>
              cn(
                "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                isActive
                  ? "bg-slate-100 text-slate-900 dark:bg-slate-800 dark:text-white"
                  : "text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800/60 dark:hover:text-slate-100",
              )
            }
          >
            <Icon className="h-4 w-4 shrink-0" />
            {label}
          </NavLink>
        ))}
      </nav>

      {/* Footer: user + logout */}
      <div className="border-t border-slate-200 dark:border-slate-800 px-3 py-4 space-y-3">
        {user && (
          <Link
            to="/dashboard/profile"
            onClick={onNavClick}
            className="flex items-center gap-3 rounded-lg px-3 py-2 hover:bg-slate-100 dark:hover:bg-slate-800/60 transition-colors"
          >
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-500/10 text-xs font-semibold text-emerald-400 ring-1 ring-emerald-400/30">
              {user.firstName[0]}
              {user.lastName[0]}
            </div>
            <div className="flex flex-col leading-tight">
              <span className="text-sm font-medium text-slate-800 dark:text-slate-200">
                {user.firstName} {user.lastName}
              </span>
              <span className="text-[11px] text-slate-500 dark:text-slate-400 truncate max-w-[140px]">
                {user.email}
              </span>
            </div>
          </Link>
        )}

        <Button
          variant="ghost"
          size="sm"
          className="w-full justify-start gap-2 text-rose-600 hover:bg-rose-50 hover:text-rose-700 dark:text-rose-400 dark:hover:bg-rose-500/10 dark:hover:text-rose-300"
          onClick={() => {
            onNavClick();
            onLogout();
          }}
        >
          <LogOut className="h-4 w-4" />
          Çıkış Yap
        </Button>
      </div>
    </div>
  );
}
