/**
 * Motion runtime & magnetic CTA controller per §6.2.
 * Maximum 6px translation spring-eased, instantly disabled on reduced motion.
 */

export function initMagneticButtons(): void {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  if ('ontouchstart' in window || navigator.maxTouchPoints > 0) return;

  const magneticElements = document.querySelectorAll<HTMLElement>('[data-magnetic]');

  magneticElements.forEach((el) => {
    let bounds = el.getBoundingClientRect();

    function onMouseMove(e: MouseEvent) {
      bounds = el.getBoundingClientRect();
      const x = e.clientX - bounds.left - bounds.width / 2;
      const y = e.clientY - bounds.top - bounds.height / 2;

      // Max 6px translation per §6.2
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
