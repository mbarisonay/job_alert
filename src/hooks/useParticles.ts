import { useEffect, useRef } from "react";

const PARTICLES_CONFIG = {
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
    detect_on: "window",
    events: {
      onhover: { enable: true, mode: "repulse" },
      onclick: { enable: true, mode: "push" },
      resize: true,
    },
    modes: {
      grab: { distance: 400, line_linked: { opacity: 1 } },
      bubble: { distance: 400, size: 40, duration: 2, opacity: 8, speed: 3 },
      repulse: { distance: 200, duration: 0.4 },
      push: { particles_nb: 4 },
      remove: { particles_nb: 2 },
    },
  },
  retina_detect: true,
};

type ParticlesWindow = typeof window & {
  particlesJS?: (tagId: string, config: unknown) => void;
  pJSDom?: Array<{ pJS: { fn: { vendors: { destroypJS: () => void } } } }>;
};

export function useParticles(containerId: string) {
  const initialized = useRef(false);

  useEffect(() => {
    const win = window as ParticlesWindow;

    if (initialized.current) return;

    const el = document.getElementById(containerId);
    if (!el) return;

    const timer = setTimeout(() => {
      if (typeof win.particlesJS === "function") {
        initialized.current = true;
        win.particlesJS(containerId, PARTICLES_CONFIG);
      }
    }, 50);

    return () => {
      clearTimeout(timer);
    };
  }, [containerId]);

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
