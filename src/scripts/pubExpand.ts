/**
 * Handles publication row expansion per §6.2 & §10.
 * Accessible disclosure widget with 0fr -> 1fr grid transition.
 */
export function initPubExpand(): void {
  const expandButtons = document.querySelectorAll<HTMLButtonElement>('.pub-expand-btn');

  expandButtons.forEach((btn) => {
    if (btn.dataset.expandInitialized) return;
    btn.dataset.expandInitialized = 'true';

    btn.addEventListener('click', () => {
      const isExpanded = btn.getAttribute('aria-expanded') === 'true';
      const targetId = btn.getAttribute('aria-controls');
      const target = targetId ? document.getElementById(targetId) : null;
      const icon = btn.querySelector('svg');

      if (!target) return;

      if (isExpanded) {
        btn.setAttribute('aria-expanded', 'false');
        target.classList.remove('grid-rows-[1fr]');
        target.classList.add('grid-rows-[0fr]');
        if (icon) icon.style.transform = 'rotate(0deg)';
        setTimeout(() => {
          if (btn.getAttribute('aria-expanded') === 'false') {
            target.setAttribute('hidden', '');
          }
        }, 320);
      } else {
        btn.setAttribute('aria-expanded', 'true');
        target.removeAttribute('hidden');
        // Force reflow
        void target.offsetHeight;
        target.classList.remove('grid-rows-[0fr]');
        target.classList.add('grid-rows-[1fr]');
        if (icon) icon.style.transform = 'rotate(180deg)';
      }
    });
  });
}
