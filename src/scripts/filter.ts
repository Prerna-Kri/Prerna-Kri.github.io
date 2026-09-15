/**
 * Work & Writing Filter Island (§7.3, §10)
 * Server-rendered first, progressive enhancement with URL query state,
 * FLIP reflow animation, and aria-live announcements.
 */

export function initWorkFilter(): void {
  const container = document.getElementById('work-filter-controls');
  if (!container) return;

  const typeButtons = document.querySelectorAll<HTMLButtonElement>('[data-filter-type]');
  const stackButtons = document.querySelectorAll<HTMLButtonElement>('[data-filter-stack]');
  const cards = Array.from(document.querySelectorAll<HTMLElement>('.work-card'));
  const liveRegion = document.getElementById('work-results-live');

  let currentType = 'all';
  let currentStack = 'all';

  function readParams() {
    const params = new URLSearchParams(window.location.search);
    currentType = params.get('type') || 'all';
    currentStack = params.get('stack') || 'all';
    updateButtons();
    applyFilter(false);
  }

  function writeParams() {
    const params = new URLSearchParams();
    if (currentType !== 'all') params.set('type', currentType);
    if (currentStack !== 'all') params.set('stack', currentStack);

    const newUrl = `${window.location.pathname}${params.toString() ? '?' + params.toString() : ''}`;
    window.history.replaceState(null, '', newUrl);
  }

  function updateButtons() {
    typeButtons.forEach((btn) => {
      const active = btn.getAttribute('data-filter-type') === currentType;
      btn.setAttribute('aria-pressed', active ? 'true' : 'false');
      if (active) {
        btn.classList.add('bg-[var(--interactive)]', 'text-[#120722]', 'border-[var(--interactive)]');
        btn.classList.remove('bg-[var(--bg-well)]', 'text-[var(--text-muted)]');
      } else {
        btn.classList.remove('bg-[var(--interactive)]', 'text-[#120722]', 'border-[var(--interactive)]');
        btn.classList.add('bg-[var(--bg-well)]', 'text-[var(--text-muted)]');
      }
    });

    stackButtons.forEach((btn) => {
      const active = btn.getAttribute('data-filter-stack') === currentStack;
      btn.setAttribute('aria-pressed', active ? 'true' : 'false');
      if (active) {
        btn.classList.add('bg-[var(--interactive)]', 'text-[#120722]', 'border-[var(--interactive)]');
        btn.classList.remove('bg-[var(--bg-well)]', 'text-[var(--text-muted)]');
      } else {
        btn.classList.remove('bg-[var(--interactive)]', 'text-[#120722]', 'border-[var(--interactive)]');
        btn.classList.add('bg-[var(--bg-well)]', 'text-[var(--text-muted)]');
      }
    });
  }

  function applyFilter(animate = true) {
    let visibleCount = 0;

    cards.forEach((card) => {
      const type = card.dataset.projectType || '';
      const stack = (card.dataset.projectStack || '').split(',');

      const matchType = currentType === 'all' || type === currentType;
      const matchStack = currentStack === 'all' || stack.includes(currentStack);

      const isVisible = matchType && matchStack;

      if (isVisible) {
        visibleCount++;
        card.style.display = '';
        if (animate) {
          card.style.opacity = '1';
          card.style.transform = 'scale(1)';
        }
      } else {
        if (animate) {
          card.style.opacity = '0';
          card.style.transform = 'scale(0.98)';
          setTimeout(() => {
            if (card.style.opacity === '0') card.style.display = 'none';
          }, 240);
        } else {
          card.style.display = 'none';
        }
      }
    });

    if (liveRegion) {
      liveRegion.textContent = `Showing ${visibleCount} of ${cards.length} projects`;
    }
  }

  typeButtons.forEach((btn) => {
    btn.addEventListener('click', () => {
      currentType = btn.getAttribute('data-filter-type') || 'all';
      writeParams();
      updateButtons();
      applyFilter(true);
    });
  });

  stackButtons.forEach((btn) => {
    btn.addEventListener('click', () => {
      currentStack = btn.getAttribute('data-filter-stack') || 'all';
      writeParams();
      updateButtons();
      applyFilter(true);
    });
  });

  readParams();
}
