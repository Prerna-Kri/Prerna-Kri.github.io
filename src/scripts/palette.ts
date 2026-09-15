/**
 * Hand-rolled Command Palette Controller per §9.
 * Fast fuzzy search over /search-index.json with zero dependencies,
 * keyboard trapping, arrow navigation, and built-in actions.
 */

interface SearchItem {
  id: string;
  title: string;
  category: 'page' | 'publication' | 'project' | 'post' | 'action';
  url: string;
  description?: string;
  actionId?: 'toggle-theme' | 'copy-email' | 'download-cv';
}

function scoreItem(item: SearchItem, query: string): number {
  const q = query.toLowerCase().trim();
  if (!q) return 1;
  const target = `${item.title} ${item.description || ''} ${item.category}`.toLowerCase();

  // Exact match bonus
  if (target === q) return 100;
  if (item.title.toLowerCase().startsWith(q)) return 80;
  if (target.includes(q)) return 60;

  // Fuzzy sequential character match
  let qIdx = 0;
  let score = 0;
  for (let i = 0; i < target.length && qIdx < q.length; i++) {
    if (target[i] === q[qIdx]) {
      score += 2;
      qIdx++;
    }
  }
  return qIdx === q.length ? score : 0;
}

export function initCommandPalette(): void {
  const modal = document.getElementById('command-palette-modal');
  const input = document.getElementById('command-palette-input') as HTMLInputElement | null;
  const resultsContainer = document.getElementById('command-palette-results');
  const liveRegion = document.getElementById('command-palette-live');
  const backdrop = document.getElementById('command-palette-backdrop');
  const triggers = document.querySelectorAll<HTMLElement>('[data-command-palette-trigger]');

  if (!modal || !input || !resultsContainer) return;

  let searchData: SearchItem[] = [];
  let selectedIndex = 0;
  let filteredResults: SearchItem[] = [];
  let lastFocusedElement: HTMLElement | null = null;

  async function loadSearchIndex() {
    if (searchData.length > 0) return;
    try {
      const baseUrl = (document.documentElement.dataset.baseUrl || '/').replace(/\/+$/, '');
      const url = `${baseUrl}/search-index.json`;
      const res = await fetch(url);
      if (res.ok) {
        searchData = await res.json();
      }
    } catch {
      // Fallback items if offline/fetch failure
      searchData = [
        { id: '1', title: 'Research Pillars', category: 'page', url: '/research' },
        { id: '2', title: 'Publications', category: 'page', url: '/publications' },
        { id: '3', title: 'Projects', category: 'page', url: '/projects' },
        { id: '4', title: 'Curriculum Vitae', category: 'page', url: '/cv' },
        { id: '5', title: 'Copy Email', category: 'action', url: '#', actionId: 'copy-email' },
        { id: '6', title: 'Toggle Theme', category: 'action', url: '#', actionId: 'toggle-theme' },
      ];
    }
  }

  function renderResults() {
    const q = input?.value || '';
    filteredResults = searchData
      .map((item) => ({ item, score: scoreItem(item, q) }))
      .filter((r) => r.score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, 10)
      .map((r) => r.item);

    selectedIndex = 0;

    if (filteredResults.length === 0) {
      resultsContainer!.innerHTML = `
        <div class="py-8 text-center text-xs text-[var(--text-muted)] font-mono">
          No matching entries found for "${q}"
        </div>
      `;
      if (liveRegion) liveRegion.textContent = 'No results found.';
      return;
    }

    if (liveRegion) {
      liveRegion.textContent = `${filteredResults.length} results available. Use arrow keys to navigate.`;
    }

    resultsContainer!.innerHTML = filteredResults
      .map((item, idx) => {
        const isSelected = idx === selectedIndex;
        return `
        <li
          id="palette-item-${idx}"
          role="option"
          aria-selected="${isSelected}"
          data-index="${idx}"
          class="palette-result-item flex items-center justify-between p-3 rounded-[4px] cursor-pointer text-xs font-mono transition-colors ${
            isSelected
              ? 'bg-[var(--bg-surface)] text-[var(--text-heading)] border border-[var(--accent-signal)]/40'
              : 'text-[var(--text-body)] hover:bg-[var(--bg-surface)] border border-transparent'
          }"
        >
          <div class="flex flex-col gap-0.5 overflow-hidden text-left">
            <span class="font-medium truncate">${item.title}</span>
            ${item.description ? `<span class="text-[10px] text-[var(--text-muted)] truncate">${item.description}</span>` : ''}
          </div>
          <span class="ml-2 text-[10px] uppercase px-1.5 py-0.5 rounded border border-[var(--border-subtle)] bg-[var(--bg-well)] text-[var(--text-muted)] shrink-0">
            ${item.category}
          </span>
        </li>
      `;
      })
      .join('');

    attachItemClickListeners();
  }

  function updateSelection() {
    const items = resultsContainer!.querySelectorAll('.palette-result-item');
    items.forEach((item, idx) => {
      if (idx === selectedIndex) {
        item.setAttribute('aria-selected', 'true');
        item.classList.add('bg-[var(--bg-surface)]', 'border-[var(--accent-signal)]/40');
        item.classList.remove('border-transparent');
        item.scrollIntoView({ block: 'nearest' });
      } else {
        item.setAttribute('aria-selected', 'false');
        item.classList.remove('bg-[var(--bg-surface)]', 'border-[var(--accent-signal)]/40');
        item.classList.add('border-transparent');
      }
    });
  }

  function executeItem(item: SearchItem) {
    if (item.category === 'action') {
      if (item.actionId === 'toggle-theme') {
        const toggleBtn = document.querySelector<HTMLButtonElement>('[data-theme-toggle]');
        toggleBtn?.click();
      } else if (item.actionId === 'copy-email') {
        navigator.clipboard.writeText('prerna26@iiserb.ac.in');
        alert('Email copied: prerna26@iiserb.ac.in');
      } else if (item.actionId === 'download-cv') {
        const baseUrl = (document.documentElement.dataset.baseUrl || '/').replace(/\/+$/, '');
        window.open(`${baseUrl}/cv.pdf`, '_blank');
      }
      closePalette();
    } else {
      closePalette();
      window.location.href = item.url;
    }
  }

  function attachItemClickListeners() {
    const items = resultsContainer!.querySelectorAll('.palette-result-item');
    items.forEach((item) => {
      item.addEventListener('click', () => {
        const idx = parseInt(item.getAttribute('data-index') || '0', 10);
        const target = filteredResults[idx];
        if (target) executeItem(target);
      });
    });
  }

  function openPalette() {
    lastFocusedElement = document.activeElement as HTMLElement;
    modal!.classList.remove('hidden');
    modal!.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
    loadSearchIndex().then(() => {
      renderResults();
      input?.focus();
    });
  }

  function closePalette() {
    modal!.classList.add('hidden');
    modal!.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
    if (input) input.value = '';
    if (lastFocusedElement) lastFocusedElement.focus();
  }

  // Keyboard shortcut listeners: ⌘K, Ctrl+K, or "/"
  window.addEventListener('keydown', (e) => {
    if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
      e.preventDefault();
      if (modal.classList.contains('hidden')) {
        openPalette();
      } else {
        closePalette();
      }
    } else if (e.key === '/' && modal.classList.contains('hidden')) {
      const activeTag = document.activeElement?.tagName.toLowerCase();
      if (activeTag !== 'input' && activeTag !== 'textarea') {
        e.preventDefault();
        openPalette();
      }
    } else if (!modal.classList.contains('hidden')) {
      if (e.key === 'Escape') {
        e.preventDefault();
        closePalette();
      } else if (e.key === 'ArrowDown') {
        e.preventDefault();
        if (filteredResults.length > 0) {
          selectedIndex = (selectedIndex + 1) % filteredResults.length;
          updateSelection();
        }
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        if (filteredResults.length > 0) {
          selectedIndex = (selectedIndex - 1 + filteredResults.length) % filteredResults.length;
          updateSelection();
        }
      } else if (e.key === 'Enter') {
        e.preventDefault();
        const selected = filteredResults[selectedIndex];
        if (selected) executeItem(selected);
      }
    }
  });

  triggers.forEach((btn) => btn.addEventListener('click', openPalette));
  backdrop?.addEventListener('click', closePalette);
  input?.addEventListener('input', () => renderResults());
}
