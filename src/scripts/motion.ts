/**
 * Motion Runtime (§3.2, §5, §10)
 * Integrates:
 * 1. Lenis smooth scroll (disabled on reduced motion)
 * 2. Section rule active opacity tracking via IntersectionObserver
 * 3. Magnetic pull on primary actions (max 6px, spring-eased, fine-pointer only)
 */
import Lenis from 'lenis';

let lenisInstance: Lenis | null = null;
let sectionObserver: IntersectionObserver | null = null;

export function initMotion(): void {
  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // 1. Lenis setup (§3.2, §5.3)
  if (!prefersReduced) {
    if (!lenisInstance) {
      lenisInstance = new Lenis({
        duration: 1.1,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      });

      function raf(time: number) {
        lenisInstance?.raf(time);
        requestAnimationFrame(raf);
      }
      requestAnimationFrame(raf);
    }
  } else if (lenisInstance) {
    lenisInstance.destroy();
    lenisInstance = null;
  }

  // 2. Section rule active indicator (§5.2)
  initSectionRules();

  // 3. Magnetic pull (§5.2)
  initMagneticButtons(prefersReduced);
}

function initSectionRules(): void {
  if (sectionObserver) {
    sectionObserver.disconnect();
  }

  const sections = document.querySelectorAll<HTMLElement>('section[id]');
  if (sections.length === 0) return;

  sectionObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        const id = entry.target.id;
        const rule = document.querySelector<HTMLElement>(`#rule-for-${id}`) ||
                     entry.target.previousElementSibling as HTMLElement | null;

        if (rule && rule.classList.contains('section-rule')) {
          if (entry.isIntersecting) {
            rule.classList.add('is-active');
          } else {
            rule.classList.remove('is-active');
          }
        }
      });
    },
    {
      rootMargin: '-20% 0px -40% 0px',
      threshold: 0.1,
    }
  );

  sections.forEach((sec) => sectionObserver?.observe(sec));
}

function initMagneticButtons(prefersReduced: boolean): void {
  if (prefersReduced) return;
  if (!window.matchMedia('(pointer: fine)').matches) return;

  const magneticElements = document.querySelectorAll<HTMLElement>('[data-magnetic]');

  magneticElements.forEach((el) => {
    let bounds = el.getBoundingClientRect();

    function onMouseMove(e: MouseEvent) {
      bounds = el.getBoundingClientRect();
      const x = e.clientX - bounds.left - bounds.width / 2;
      const y = e.clientY - bounds.top - bounds.height / 2;

      // Max 6px translation per §5.2
      const maxTrans = 6;
      const transX = Math.max(-maxTrans, Math.min(maxTrans, x * 0.2));
      const transY = Math.max(-maxTrans, Math.min(maxTrans, y * 0.2));

      el.style.transform = `translate3d(${transX.toFixed(2)}px, ${transY.toFixed(2)}px, 0)`;
      el.style.transition = 'transform 100ms ease-out';
    }

    function onMouseLeave() {
      el.style.transform = 'translate3d(0px, 0px, 0)';
      el.style.transition = 'transform 400ms cubic-bezier(0.16, 1, 0.3, 1)';
    }

    el.addEventListener('mousemove', onMouseMove);
    el.addEventListener('mouseleave', onMouseLeave);
  });
}
