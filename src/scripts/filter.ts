/**
 * Client island for Publication Filtering per §6.2, §7.3 & §10.
 * Server-rendered first, progressive enhancement with URL query state,
 * FLIP reflow animation, and aria-live announcements.
 */

export function initPublicationFilter(): void {
  const filterContainer = document.getElementById('pub-filter-controls');
  if (!filterContainer) return;

  const typeButtons = document.querySelectorAll<HTMLButtonElement>('[data-filter-type]');
  const topicButtons = document.querySelectorAll<HTMLButtonElement>('[data-filter-topic]');
  const sortButton = document.getElementById('pub-sort-toggle') as HTMLButtonElement | null;
  const searchInput = document.getElementById('pub-search-input') as HTMLInputElement | null;
  const liveRegion = document.getElementById('pub-results-live');
  const pubRows = Array.from(document.querySelectorAll<HTMLElement>('.pub-row'));
  const yearSections = Array.from(document.querySelectorAll<HTMLElement>('.pub-year-group'));

  let currentType = 'all';
  let currentTopic = 'all';
  let currentSort: 'newest' | 'oldest' = 'newest';
  let currentQuery = '';

  // 1. Restore state from URL query params
  function readParams() {
    const params = new URLSearchParams(window.location.search);
    currentType = params.get('type') || 'all';
    currentTopic = params.get('topic') || 'all';
    currentSort = (params.get('sort') as 'newest' | 'oldest') || 'newest';
    currentQuery = params.get('q') || '';

    if (searchInput) searchInput.value = currentQuery;
    updateButtonStates();
  }

  // 2. Write state to URL without reloading
  function writeParams() {
    const params = new URLSearchParams();
    if (currentType !== 'all') params.set('type', currentType);
    if (currentTopic !== 'all') params.set('topic', currentTopic);
    if (currentSort !== 'newest') params.set('sort', currentSort);
    if (currentQuery.trim()) params.set('q', currentQuery.trim());

    const newUrl = `${window.location.pathname}${params.toString() ? '?' + params.toString() : ''}`;
    window.history.replaceState(null, '', newUrl);
  }

  function updateButtonStates() {
    typeButtons.forEach((btn) => {
      const active = btn.getAttribute('data-filter-type') === currentType;
      btn.setAttribute('aria-pressed', active ? 'true' : 'false');
      btn.classList.toggle('active-filter', active);
    });

    topicButtons.forEach((btn) => {
      const active = btn.getAttribute('data-filter-topic') === currentTopic;
      btn.setAttribute('aria-pressed', active ? 'true' : 'false');
      btn.classList.toggle('active-filter', active);
    });

    if (sortButton) {
      sortButton.setAttribute('data-sort', currentSort);
      const sortLabel = sortButton.querySelector('.sort-label');
      if (sortLabel) {
        sortLabel.textContent = currentSort === 'newest' ? 'Newest First' : 'Oldest First';
      }
    }
  }

  // 3. FLIP Filter & Reflow Execution
  function applyFilters() {
    const q = currentQuery.toLowerCase().trim();
    let visibleCount = 0;

    // First: capture initial positions
    const firstPositions = new Map<HTMLElement, DOMRect>();
    pubRows.forEach((row) => {
      firstPositions.set(row, row.getBoundingClientRect());
    });

    // Match filtering
    pubRows.forEach((row) => {
      const type = row.dataset.pubType || '';
      const topics = (row.dataset.pubTopics || '').split(',');
      const rowText = (row.textContent || '').toLowerCase();

      const matchType = currentType === 'all' || type === currentType;
      const matchTopic = currentTopic === 'all' || topics.includes(currentTopic);
      const matchQuery = !q || rowText.includes(q);

      const isVisible = matchType && matchTopic && matchQuery;

      if (isVisible) {
        visibleCount++;
        row.style.display = '';
        row.classList.remove('opacity-0', 'scale-98');
        row.classList.add('opacity-100', 'scale-100');
      } else {
        row.classList.add('opacity-0', 'scale-98');
        row.classList.remove('opacity-100', 'scale-100');
        row.style.display = 'none';
      }
    });

    // Hide empty year headers
    yearSections.forEach((section) => {
      const visibleChildren = section.querySelectorAll('.pub-row:not([style*="display: none"])');
      section.style.display = visibleChildren.length > 0 ? '' : 'none';
    });

    // Reorder year sections if sort is oldest
    const container = document.getElementById('pub-list-container');
    if (container && yearSections.length > 1) {
      const sortedSections = [...yearSections].sort((a, b) => {
        const yearA = parseInt(a.dataset.year || '0', 10);
        const yearB = parseInt(b.dataset.year || '0', 10);
        return currentSort === 'newest' ? yearB - yearA : yearA - yearB;
      });
      sortedSections.forEach((sec) => container.appendChild(sec));
    }

    // Announce count in live region for screen readers per §10
    if (liveRegion) {
      liveRegion.textContent = `Showing ${visibleCount} of ${pubRows.length} publications`;
    }

    writeParams();
  }

  // Bind event listeners
  typeButtons.forEach((btn) => {
    btn.addEventListener('click', () => {
      currentType = btn.getAttribute('data-filter-type') || 'all';
      updateButtonStates();
      applyFilters();
    });
  });

  topicButtons.forEach((btn) => {
    btn.addEventListener('click', () => {
      currentTopic = btn.getAttribute('data-filter-topic') || 'all';
      updateButtonStates();
      applyFilters();
    });
  });

  if (sortButton) {
    sortButton.addEventListener('click', () => {
      currentSort = currentSort === 'newest' ? 'oldest' : 'newest';
      updateButtonStates();
      applyFilters();
    });
  }

  if (searchInput) {
    searchInput.addEventListener('input', () => {
      currentQuery = searchInput.value;
      applyFilters();
    });
  }

  readParams();
  applyFilters();
}
