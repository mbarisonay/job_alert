import { useEffect, useRef } from "react";

type Theme = "light" | "dark";

const getParticlesConfig = (theme: Theme) => ({
  particles: {
    number: { value: 80, density: { enable: true, value_area: 800 } },
    color: { value: theme === "dark" ? "#ffffff" : "#1e293b" },
    shape: {
      type: "circle",
      stroke: { width: 0, color: "#000000" },
      polygon: { nb_sides: 5 },
    },
    opacity: {
      value: theme === "dark" ? 0.5 : 0.6,
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
      color: theme === "dark" ? "#ffffff" : "#94a3b8",
      opacity: theme === "dark" ? 0.4 : 0.3,
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
    detect_on: "window",
    events: {
      onhover: { enable: true, mode: "repulse" },
      onclick: { enable: true, mode: "push" },
      resize: true,
    },
    modes: {
      grab: { distance: 100, line_linked: { opacity: 1 } },
      bubble: { distance: 100, size: 40, duration: 1.2, opacity: 8, speed: 3 },
      repulse: { distance: 100, duration: 0.4 },
      push: { particles_nb: 4 },
      remove: { particles_nb: 2 },
    },
  },
  retina_detect: true,
});

type ParticlesWindow = typeof window & {
  particlesJS?: (tagId: string, config: unknown) => void;
  pJSDom?: Array<{ pJS: { fn: { vendors: { destroypJS: () => void } } } }>;
};

export function useParticles(containerId: string, theme: Theme = "dark") {
  const initialized = useRef(false);

  useEffect(() => {
    const win = window as ParticlesWindow;

    const el = document.getElementById(containerId);
    if (!el) return;

    // Destroy existing particles when theme changes
    if (win.pJSDom && win.pJSDom.length > 0) {
      try {
        for (let i = win.pJSDom.length - 1; i >= 0; i--) {
          win.pJSDom[i].pJS.fn.vendors.destroypJS();
        }
        win.pJSDom = [];
      } catch {
        // ignore
      }
    }

    initialized.current = false;

    const timer = setTimeout(() => {
      if (typeof win.particlesJS === "function") {
        initialized.current = true;
        win.particlesJS(containerId, getParticlesConfig(theme));
      }
    }, 50);

    return () => {
      clearTimeout(timer);
    };
  }, [containerId, theme]);

  useEffect(() => {
    return () => {
      const win = window as ParticlesWindow;
      if (win.pJSDom && win.pJSDom.length > 0) {
        try {
          for (let i = win.pJSDom.length - 1; i >= 0; i--) {
            win.pJSDom[i].pJS.fn.vendors.destroypJS();
          }
          win.pJSDom = [];
        } catch {
          // ignore
        }
      }
      initialized.current = false;
    };
  }, []);

  return null;
}
