import { useState } from "react";
import type { FormEvent } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useParticles } from "@/hooks/useParticles";
import { useThemeInit, useThemeStore } from "@/store/themeStore";
import { BriefcaseBusiness, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";
import { apiRequest } from "@/lib/api";

export function RegisterPage() {
  const navigate = useNavigate();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [dob, setDob] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { theme } = useThemeStore();

  useThemeInit();
  useParticles("particles-register", theme);

  async function onSubmit(e: FormEvent): Promise<void> {
    e.preventDefault();
    setError("");

    if (!acceptTerms) {
      setError("Lütfen hizmet şartlarını kabul edin.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Parolalar eşleşmiyor.");
      return;
    }

    setLoading(true);
    try {
      await apiRequest<unknown, {
        email: string;
        password: string;
        firstName: string;
        lastName: string;
        phone?: string;
        dateOfBirth?: string;
      }>("/api/auth/register", "POST", {
        email,
        password,
        firstName,
        lastName,
        phone: phone || undefined,
        dateOfBirth: dob || undefined,
      });

      navigate("/login");
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Kayıt sırasında bir hata oluştu.");
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="relative min-h-screen bg-slate-50 dark:bg-slate-950 transition-colors">
      {/* Partikül arka plan - tam ekran, mouse etkileşimli */}
      <div id="particles-register" className="absolute inset-0 z-0" />

      {/* Header */}
      <header className="relative z-20 border-b border-slate-200 dark:border-slate-800/50 bg-slate-50/40 dark:bg-slate-950/60 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
          <Link to="/" className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-200 dark:bg-slate-900">
              <Sparkles className="h-4 w-4 text-emerald-400" />
            </div>
            <span className="text-sm font-semibold tracking-tight text-slate-900 dark:text-slate-100">
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
      <div className="relative z-10 flex min-h-[calc(100vh-3.5rem)] items-center justify-center px-4 py-8">
        <div className="w-full max-w-md">
          <Card className="border-slate-300 dark:border-slate-700/50 bg-white/30 dark:bg-slate-900/80 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-slate-900 dark:text-slate-50">
                Kayıt Ol
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={onSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm text-slate-700 dark:text-slate-300">
                      Ad
                    </label>
                    <input
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      type="text"
                      required
                      className="mt-1 w-full rounded-md border border-slate-300 dark:border-0 bg-white/30 dark:bg-slate-800/60 px-3 py-2 text-sm text-slate-900 dark:text-slate-100 outline-none placeholder:text-slate-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-slate-700 dark:text-slate-300">
                      Soyad
                    </label>
                    <input
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      type="text"
                      required
                      className="mt-1 w-full rounded-md border border-slate-300 dark:border-0 bg-white/30 dark:bg-slate-800/60 px-3 py-2 text-sm text-slate-900 dark:text-slate-100 outline-none placeholder:text-slate-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm text-slate-700 dark:text-slate-300">
                    E-posta
                  </label>
                  <input
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    type="email"
                    required
                    className="mt-1 w-full rounded-md border border-slate-300 dark:border-0 bg-white/30 dark:bg-slate-800/60 px-3 py-2 text-sm text-slate-900 dark:text-slate-100 outline-none placeholder:text-slate-500"
                  />
                </div>

                <div>
                  <label className="block text-sm text-slate-700 dark:text-slate-300">
                    Telefon numarası
                  </label>
                  <input
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    type="tel"
                    placeholder="5xx xxx xx xx"
                    className="mt-1 w-full rounded-md border border-slate-300 dark:border-0 bg-white/30 dark:bg-slate-800/60 px-3 py-2 text-sm text-slate-900 dark:text-slate-100 outline-none placeholder:text-slate-500"
                  />
                </div>

                <div>
                  <label className="block text-sm text-slate-700 dark:text-slate-300">
                    Doğum tarihi
                  </label>
                  <input
                    value={dob}
                    onChange={(e) => setDob(e.target.value)}
                    type="date"
                    className="mt-1 w-full rounded-md border border-slate-300 dark:border-0 bg-white/30 dark:bg-slate-800/60 px-3 py-2 text-sm text-slate-900 dark:text-slate-100 outline-none placeholder:text-slate-500"
                  />
                </div>

                <div>
                  <label className="block text-sm text-slate-700 dark:text-slate-300">
                    Parola
                  </label>
                  <input
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    type="password"
                    required
                    minLength={6}
                    className="mt-1 w-full rounded-md border border-slate-300 dark:border-0 bg-white/30 dark:bg-slate-800/60 px-3 py-2 text-sm text-slate-900 dark:text-slate-100 outline-none placeholder:text-slate-500"
                  />
                </div>

                <div>
                  <label className="block text-sm text-slate-700 dark:text-slate-300">
                    Parola (Tekrar)
                  </label>
                  <input
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    type="password"
                    required
                    minLength={6}
                    className="mt-1 w-full rounded-md border border-slate-300 dark:border-0 bg-white/30 dark:bg-slate-800/60 px-3 py-2 text-sm text-slate-900 dark:text-slate-100 outline-none placeholder:text-slate-500"
                  />
                </div>

                <div className="flex items-center gap-2">
                  <input
                    id="accept"
                    type="checkbox"
                    checked={acceptTerms}
                    onChange={(e) => setAcceptTerms(e.target.checked)}
                    className="h-4 w-4 rounded border-slate-300 dark:border-slate-700 bg-white/30 dark:bg-slate-900 text-emerald-400"
                  />
                  <label
                    htmlFor="accept"
                    className="text-sm text-slate-700 dark:text-slate-300">
                    Hizmet şartlarını ve gizlilik politikasını kabul ediyorum
                  </label>
                </div>

                {error && (
                  <div
                    className="rounded-md bg-rose-100 dark:bg-rose-900/40 p-2 text-sm text-rose-700 dark:text-rose-300"
                    role="status"
                    aria-live="polite">
                    {error}
                  </div>
                )}

                <div className="flex items-center justify-between">
                  <div />
                  <Button
                    type="submit"
                    size="sm"
                    className={loading ? "opacity-70" : ""}
                    disabled={loading}>
                    {loading ? "Kayıt oluyor..." : "Kayıt Ol"}
                  </Button>
                </div>

                <p className="text-center text-sm text-slate-700 dark:text-slate-400">
                  Zaten üyeyim?{" "}
                  <Link
                    to="/login"
                    className="text-emerald-400 hover:underline">
                    Giriş yap
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
          "inline-flex items-center rounded-full px-3 py-1 text-xs font-medium text-slate-700 dark:text-slate-300 transition hover:bg-slate-200 dark:hover:bg-slate-900 hover:text-slate-900 dark:hover:text-slate-50",
          isActive &&
            "bg-slate-200 dark:bg-slate-100 text-slate-900 dark:text-slate-950",
        )
      }>
      {children}
    </NavLink>
  );
}
