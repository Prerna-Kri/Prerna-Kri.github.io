/**
 * Client island for CopyButton per §6.2 & §9.
 * Handles copying text to clipboard, visual label transition, and timeout revert.
 * Supports direct text or target DOM selector for single or multiple elements.
 */
export function initCopyButtons(): void {
  const copyButtons = document.querySelectorAll<HTMLButtonElement>('[data-copy-button]');

  copyButtons.forEach((btn) => {
    if (btn.dataset.copyInitialized) return;
    btn.dataset.copyInitialized = 'true';

    btn.addEventListener('click', async (e) => {
      e.stopPropagation();

      let textToCopy = btn.getAttribute('data-copy-text') || '';
      const targetSelector = btn.getAttribute('data-copy-target');

      if (targetSelector) {
        const targetElements = document.querySelectorAll(targetSelector);
        if (targetElements.length > 1) {
          textToCopy = Array.from(targetElements)
            .map((el) => el.textContent?.trim())
            .filter(Boolean)
            .join('\n\n');
        } else if (targetElements.length === 1) {
          const el = targetElements[0]!;
          textToCopy = el.textContent || (el as HTMLInputElement).value || '';
        }
      }

      if (!textToCopy) return;

      try {
        await navigator.clipboard.writeText(textToCopy.trim());
        const originalLabel = btn.querySelector('.copy-label')?.textContent || 'Copy';
        const labelEl = btn.querySelector('.copy-label');
        const defaultIcon = btn.querySelector('.copy-icon-default');
        const successIcon = btn.querySelector('.copy-icon-success');

        if (labelEl) labelEl.textContent = 'Copied';
        if (defaultIcon) defaultIcon.classList.add('hidden');
        if (successIcon) successIcon.classList.remove('hidden');
        btn.classList.add('border-[var(--accent-signal)]', 'text-[var(--accent-signal)]');

        setTimeout(() => {
          if (labelEl) labelEl.textContent = originalLabel;
          if (defaultIcon) defaultIcon.classList.remove('hidden');
          if (successIcon) successIcon.classList.add('hidden');
          btn.classList.remove('border-[var(--accent-signal)]', 'text-[var(--accent-signal)]');
        }, 1600);
      } catch (err) {
        console.error('Failed to copy text', err);
      }
    });
  });
}
