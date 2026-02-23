import { FormEvent, useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AppLayout } from "@/components/layout/AppLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export function LoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  function onSubmit(e: FormEvent): void {
    e.preventDefault();
    // TODO: hook up real auth. For now simulate success.
    navigate("/jobs");
  }

  declare global {
    interface Window {
      particlesJS?: (tagId: string, config: unknown) => void;
    }
  }

  useEffect(() => {
    // Check if particlesJS is available on window
    if (typeof window.particlesJS !== "undefined") {
      window.particlesJS("particles-js", {
        particles: {
          number: { value: 80, density: { enable: true, value_area: 800 } },
          color: { value: "#ffffff" },
          shape: {
            type: "circle",
            stroke: { width: 0, color: "#000000" },
            polygon: { nb_sides: 5 },
          },
          opacity: {
            value: 0.5,
            random: false,
            anim: { enable: false, speed: 1, opacity_min: 0.1, sync: false },
          },
          size: {
            value: 3,
            random: true,
            anim: { enable: false, speed: 40, size_min: 0.1, sync: false },
          },
          line_linked: {
            enable: true,
            distance: 150,
            color: "#ffffff",
            opacity: 0.4,
            width: 1,
          },
          move: {
            enable: true,
            speed: 6,
            direction: "none",
            random: false,
            straight: false,
            out_mode: "out",
            bounce: false,
            attract: { enable: false, rotateX: 600, rotateY: 1200 },
          },
        },
        interactivity: {
          detect_on: "canvas",
          events: {
            onhover: { enable: true, mode: "repulse" },
            onclick: { enable: true, mode: "push" },
            resize: true,
          },
          modes: {
            grab: { distance: 400, line_linked: { opacity: 1 } },
            bubble: {
              distance: 400,
              size: 40,
              duration: 2,
              opacity: 8,
              speed: 3,
            },
            repulse: { distance: 200, duration: 0.4 },
            push: { particles_nb: 4 },
            remove: { particles_nb: 2 },
          },
        },
        retina_detect: true,
      });
    } else {
      console.warn(
        "particlesJS is not defined. The background animation may not work.",
      );
    }
  }, []);

  return (
    <AppLayout>
      <div className="relative mx-auto max-w-md">
        <div id="particles-js" className="absolute inset-0 -z-10" />
        <div className="relative z-10">
          <Card className="mt-16">
            <CardHeader>
              <CardTitle>Giriş Yap</CardTitle>
            </CardHeader>

            <CardContent>
              <form onSubmit={onSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm text-slate-300">
                    E-posta
                  </label>
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
                  <Link
                    to="/forgot"
                    className="text-sm text-slate-400 hover:underline">
                    Şifremi unuttum
                  </Link>
                  <Button type="submit" size="sm">
                    Giriş
                  </Button>
                </div>

                <p className="text-center text-sm text-slate-400">
                  Hesabın yok mu?{" "}
                  <Link
                    to="/register"
                    className="text-emerald-400 hover:underline">
                    Kayıt ol
                  </Link>
                </p>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </AppLayout>
  );
}
