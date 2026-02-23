import { useState, useEffect } from "react";
import type { FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AppLayout } from "@/components/layout/AppLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

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
      // TODO: call registration API
      // simulate network
      await new Promise((r) => setTimeout(r, 700));
      navigate("/jobs");
    } catch (err) {
      setError("Kayıt sırasında bir hata oluştu.");
    } finally {
      setLoading(false);
    }
  }
  declare global {
    interface Window {
      particlesJS?: (tagId: string, config: unknown) => void
    }
  }

  useEffect(() => {
    if (typeof window.particlesJS !== 'undefined') {
      window.particlesJS('particles-js', {
        particles: {
          number: { value: 80, density: { enable: true, value_area: 800 } },
          color: { value: "#ffffff" },
          shape: { type: "circle", stroke: { width: 0, color: "#000000" }, polygon: { nb_sides: 5 } },
          opacity: { value: 0.5, random: false, anim: { enable: false, speed: 1, opacity_min: 0.1, sync: false } },
          size: { value: 3, random: true, anim: { enable: false, speed: 40, size_min: 0.1, sync: false } },
          line_linked: { enable: true, distance: 150, color: "#ffffff", opacity: 0.4, width: 1 },
          move: { enable: true, speed: 6, direction: "none", random: false, straight: false, out_mode: "out", bounce: false, attract: { enable: false, rotateX: 600, rotateY: 1200 } },
        },
        interactivity: {
          detect_on: "canvas",
          events: { onhover: { enable: true, mode: "repulse" }, onclick: { enable: true, mode: "push" }, resize: true },
          modes: { grab: { distance: 400, line_linked: { opacity: 1 } }, bubble: { distance: 400, size: 40, duration: 2, opacity: 8, speed: 3 }, repulse: { distance: 200, duration: 0.4 }, push: { particles_nb: 4 }, remove: { particles_nb: 2 } },
        },
        retina_detect: true,
      })
    } else {
      console.warn('particlesJS is not defined. The background animation may not work.')
    }
  }, [])

  return (
    <AppLayout>
      <div className="relative mx-auto max-w-md">
        <div id="particles-js" className="absolute inset-0 -z-10" />
        <div className="relative z-10">
          <Card className="mt-16">
          <CardHeader>
            <CardTitle>Kayıt Ol</CardTitle>
          </CardHeader>

          <CardContent>
            <form onSubmit={onSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm text-slate-300">Ad</label>
                  <input
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    type="text"
                    required
                    className="mt-1 w-full rounded-md border-0 bg-slate-800/60 px-3 py-2 text-sm text-slate-100 outline-none placeholder:text-slate-500"
                  />
                </div>
                <div>
                  <label className="block text-sm text-slate-300">Soyad</label>
                  <input
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    type="text"
                    required
                    className="mt-1 w-full rounded-md border-0 bg-slate-800/60 px-3 py-2 text-sm text-slate-100 outline-none placeholder:text-slate-500"
                  />
                </div>
              </div>

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
                <label className="block text-sm text-slate-300">
                  Telefon numarası
                </label>
                <input
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  type="tel"
                  placeholder="5xx xxx xx xx"
                  className="mt-1 w-full rounded-md border-0 bg-slate-800/60 px-3 py-2 text-sm text-slate-100 outline-none placeholder:text-slate-500"
                />
              </div>

              <div>
                <label className="block text-sm text-slate-300">
                  Doğum tarihi
                </label>
                <input
                  value={dob}
                  onChange={(e) => setDob(e.target.value)}
                  type="date"
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

              <div>
                <label className="block text-sm text-slate-300">
                  Parola (Tekrar)
                </label>
                <input
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  type="password"
                  required
                  minLength={6}
                  className="mt-1 w-full rounded-md border-0 bg-slate-800/60 px-3 py-2 text-sm text-slate-100 outline-none placeholder:text-slate-500"
                />
              </div>

              <div className="flex items-center gap-2">
                <input
                  id="accept"
                  type="checkbox"
                  checked={acceptTerms}
                  onChange={(e) => setAcceptTerms(e.target.checked)}
                  className="h-4 w-4 rounded border-slate-700 bg-slate-900 text-emerald-400"
                />
                <label htmlFor="accept" className="text-sm text-slate-300">
                  Hizmet şartlarını ve gizlilik politikasını kabul ediyorum
                </label>
              </div>

              {error && (
                <div
                  className="rounded-md bg-rose-900/40 p-2 text-sm text-rose-300"
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

              <p className="text-center text-sm text-slate-400">
                Zaten üyeyim?{" "}
                <Link to="/login" className="text-emerald-400 hover:underline">
                  Giriş yap
                </Link>
              </p>
            </form>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
}
