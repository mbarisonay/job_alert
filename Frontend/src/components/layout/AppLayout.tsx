import type { PropsWithChildren } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/ThemeToggle";
import { useAuthStore } from "@/store/authStore";
import { BriefcaseBusiness, LogOut, Sparkles, User } from "lucide-react";
import { cn } from "@/lib/utils";

type AppLayoutProps = PropsWithChildren;

export function AppLayout({ children }: AppLayoutProps) {
  const { isAuthenticated, user, logout } = useAuthStore();
  const navigate = useNavigate();

  function handleLogout() {
    logout();
    navigate("/login");
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-slate-100 transition-colors">
      <header className="sticky top-0 z-20 border-b border-slate-200 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-950/80 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
          <Link to="/" className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-200 dark:bg-slate-900">
              <Sparkles className="h-4 w-4 text-emerald-400" />
            </div>
            <div className="flex flex-col leading-tight">
              <span className="text-sm font-semibold tracking-tight">
                AI Job Aggregator
              </span>
              <span className="text-xs text-slate-500 dark:text-slate-400">
                Akıllı iş eşleştirme
              </span>
            </div>
          </Link>

          <nav className="flex items-center gap-4 text-sm">
            <NavItem to="/">Ana Sayfa</NavItem>
            <NavItem to="/jobs">
              <BriefcaseBusiness className="mr-1.5 h-3.5 w-3.5" />
              İş Ara
            </NavItem>

            <div className="ml-4 flex items-center gap-2">
              <ThemeToggle />

              {isAuthenticated ? (
                <>
                  <Link to="/dashboard">
                    <Button variant="ghost" size="sm" className="gap-1.5">
                      <User className="h-3.5 w-3.5" />
                      <span className="hidden sm:inline">
                        {user?.firstName ?? "Dashboard"}
                      </span>
                    </Button>
                  </Link>
                  <Button
                    variant="outline"
                    size="sm"
                    className="gap-1.5"
                    onClick={handleLogout}
                  >
                    <LogOut className="h-3.5 w-3.5" />
                    <span className="hidden sm:inline">Çıkış</span>
                  </Button>
                </>
              ) : (
                <>
                  <Link to="/login">
                    <Button variant="ghost" size="sm">
                      Giriş
                    </Button>
                  </Link>
                  <Link to="/register">
                    <Button variant="default" size="sm">
                      Kayıt Ol
                    </Button>
                  </Link>
                </>
              )}
            </div>
          </nav>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 py-6">{children}</main>
    </div>
  );
}

type NavItemProps = PropsWithChildren<{
  to: string;
}>;

function NavItem({ to, children }: NavItemProps) {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        cn(
          "inline-flex items-center rounded-full px-3 py-1 text-xs font-medium text-slate-600 dark:text-slate-300 transition hover:bg-slate-200 dark:hover:bg-slate-900 hover:text-slate-900 dark:hover:text-slate-50",
          isActive &&
            "bg-slate-200 dark:bg-slate-900 text-slate-900 dark:text-slate-50",
        )
      }
    >
      {children}
    </NavLink>
  );
}
