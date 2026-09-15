/**
 * Client island for Theme Toggle per §6 & §10.
 * Supports View Transitions crossfade and updates localStorage, meta theme-color, and color-scheme.
 */
export function initThemeToggle(): void {
  const toggleButtons = document.querySelectorAll<HTMLButtonElement>('[data-theme-toggle]');
  if (!toggleButtons.length) return;

  function updateTheme(newTheme: 'dark' | 'light'): void {
    const root = document.documentElement;
    const metaThemeColor = document.querySelector('meta[name="theme-color"]');
    const metaColorScheme = document.querySelector('meta[name="color-scheme"]');

    const execute = () => {
      root.setAttribute('data-theme', newTheme);
      localStorage.setItem('theme', newTheme);
      if (metaThemeColor) {
        metaThemeColor.setAttribute('content', newTheme === 'dark' ? '#120722' : '#FBF8FF');
      }
      if (metaColorScheme) {
        metaColorScheme.setAttribute('content', newTheme === 'dark' ? 'dark' : 'light');
      }
      toggleButtons.forEach((btn) => {
        btn.setAttribute('aria-label', `Switch to ${newTheme === 'dark' ? 'light' : 'dark'} theme`);
        btn.setAttribute('title', `Switch to ${newTheme === 'dark' ? 'light' : 'dark'} theme`);
      });
    };

    if (
      'startViewTransition' in document &&
      !window.matchMedia('(prefers-reduced-motion: reduce)').matches
    ) {
      document.startViewTransition(() => execute());
    } else {
      execute();
    }
  }

  toggleButtons.forEach((btn) => {
    btn.addEventListener('click', () => {
      const current = document.documentElement.getAttribute('data-theme') === 'light' ? 'light' : 'dark';
      const nextTheme = current === 'dark' ? 'light' : 'dark';
      updateTheme(nextTheme);
    });
  });
}
