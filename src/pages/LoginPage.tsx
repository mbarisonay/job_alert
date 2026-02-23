import { useState } from "react";
import type { FormEvent } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useParticles } from "@/hooks/useParticles";
import { BriefcaseBusiness, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

export function LoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  useParticles("particles-login");

  function onSubmit(e: FormEvent): void {
    e.preventDefault();
    navigate("/jobs");
  }

  return (
    <div className="relative min-h-screen bg-slate-950">
      {/* Partikül arka plan - tam ekran, mouse etkileşimli */}
      <div
        id="particles-login"
        className="absolute inset-0 z-0"
      />

      {/* Header */}
      <header className="relative z-20 border-b border-slate-800/50 bg-slate-950/60 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
          <Link to="/" className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-900">
              <Sparkles className="h-4 w-4 text-emerald-400" />
            </div>
            <span className="text-sm font-semibold tracking-tight text-slate-100">
              AI Job Aggregator
            </span>
          </Link>
          <nav className="flex items-center gap-3 text-xs">
            <NavItem to="/">Ana Sayfa</NavItem>
            <NavItem to="/jobs">
              <BriefcaseBusiness className="mr-1.5 h-3.5 w-3.5" />
              İş Ara
            </NavItem>
            <NavItem to="/login">Giriş</NavItem>
            <NavItem to="/register">Kayıt Ol</NavItem>
          </nav>
        </div>
      </header>

      {/* Form - ortada */}
      <div className="relative z-10 flex min-h-[calc(100vh-3.5rem)] items-center justify-center px-4">
        <div className="w-full max-w-md">
          <Card className="border-slate-700/50 bg-slate-900/80 backdrop-blur-sm">
            <CardHeader>
              <CardTitle>Giriş Yap</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={onSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm text-slate-300">E-posta</label>
                  <input
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    type="email"
                    required
                    className="mt-1 w-full rounded-md border-0 bg-slate-800/60 px-3 py-2 text-sm text-slate-100 outline-none placeholder:text-slate-500"
                  />
                </div>
                <div>
                  <label className="block text-sm text-slate-300">Parola</label>
                  <input
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    type="password"
                    required
                    minLength={6}
                    className="mt-1 w-full rounded-md border-0 bg-slate-800/60 px-3 py-2 text-sm text-slate-100 outline-none placeholder:text-slate-500"
                  />
                </div>
                <div className="flex items-center justify-between">
                  <Link to="/forgot" className="text-sm text-slate-400 hover:underline">
                    Şifremi unuttum
                  </Link>
                  <Button type="submit" size="sm">
                    Giriş
                  </Button>
                </div>
                <p className="text-center text-sm text-slate-400">
                  Hesabın yok mu?{" "}
                  <Link to="/register" className="text-emerald-400 hover:underline">
                    Kayıt ol
                  </Link>
                </p>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

type NavItemProps = {
  to: string;
  children: React.ReactNode;
};

function NavItem({ to, children }: NavItemProps) {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        cn(
          "inline-flex items-center rounded-full px-3 py-1 text-xs font-medium text-slate-300 transition hover:bg-slate-900 hover:text-slate-50",
          isActive && "bg-slate-100 text-slate-950",
        )
      }>
      {children}
    </NavLink>
  );
}
