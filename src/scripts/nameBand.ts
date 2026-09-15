/**
 * NameBand Island Script (§7.1, §10)
 * Handles:
 * 1. SVG Text auto-fitting via getBBox() + 2% padding
 * 2. Drifting plasma gradient loop along a 14s sine cycle (amp 0.12)
 * 3. 900-particle canvas clustering simulation with ease-out-expo and quadratic cursor repulsion
 * 4. prefers-reduced-motion and document visibility optimizations
 */

const RAMPS = [
  'rgba(255, 46, 139, 0.45)', // --plasma-1
  'rgba(255, 92, 77, 0.45)',  // --plasma-2
  'rgba(255, 158, 31, 0.45)', // --plasma-3
  'rgba(255, 216, 77, 0.45)', // --plasma-4
];

interface Point {
  initX: number;
  initY: number;
  targetX: number;
  targetY: number;
  x: number;
  y: number;
  radius: number;
  cluster: number;
  stagger: number; // 0..500ms
  driftSeed: number;
  vx: number;
  vy: number;
}

let activeCanvasRaf: number | null = null;
let activeGradRaf: number | null = null;

export function initNameBand(): void {
  // Cancel previous RAFs on page load / view transitions
  if (activeCanvasRaf) cancelAnimationFrame(activeCanvasRaf);
  if (activeGradRaf) cancelAnimationFrame(activeGradRaf);

  fitSvgText();
  window.addEventListener('resize', fitSvgText, { passive: true });

  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  initGradientDrift(prefersReduced);
  initCanvasPhysics(prefersReduced);
}

/**
 * Fits the SVG viewBox to the exact getBBox of rendered text plus 2% padding
 */
function fitSvgText(): void {
  const svg = document.getElementById('hero-name-svg') as SVGSVGElement | null;
  if (!svg) return;

  const isMobile = window.innerWidth < 640;
  const singleText = document.getElementById('hero-name-text-single') as SVGGraphicsElement | null;
  const stackedText = document.getElementById('hero-name-text-stacked') as SVGGraphicsElement | null;

  const activeText = isMobile ? stackedText : singleText;
  if (!activeText) return;

  try {
    const bbox = activeText.getBBox();
    if (bbox.width > 0 && bbox.height > 0) {
      const padX = bbox.width * 0.02;
      const padY = bbox.height * 0.02;
      const x = bbox.x - padX;
      const y = bbox.y - padY;
      const w = bbox.width + padX * 2;
      const h = bbox.height + padY * 2;

      svg.setAttribute('viewBox', `${x} ${y} ${w} ${h}`);
      svg.style.aspectRatio = `${w} / ${h}`;
    }
  } catch {
    // getBBox might fail if hidden
  }
}

/**
 * Slowly drifts the 4-stop spectral linearGradient stops along a 14s sine wave
 */
function initGradientDrift(reducedMotion: boolean): void {
  const stops = [
    document.getElementById('grad-stop-1') as SVGStopElement | null,
    document.getElementById('grad-stop-2') as SVGStopElement | null,
    document.getElementById('grad-stop-3') as SVGStopElement | null,
    document.getElementById('grad-stop-4') as SVGStopElement | null,
  ];

  if (!stops[0] || !stops[1] || !stops[2] || !stops[3] || reducedMotion) return;

  const baseOffsets = [0, 0.33, 0.66, 1.0];
  const CYCLE_MS = 14000;
  const AMPLITUDE = 0.12;
  let startTime = performance.now();

  function step(now: number) {
    if (document.hidden) {
      activeGradRaf = requestAnimationFrame(step);
      return;
    }

    const elapsed = (now - startTime) % CYCLE_MS;
    const phase = (elapsed / CYCLE_MS) * Math.PI * 2;
    const wave = Math.sin(phase) * AMPLITUDE;

    stops.forEach((stop, i) => {
      if (stop) {
        let offset = baseOffsets[i]! + wave;
        offset = Math.max(0, Math.min(1, offset));
        stop.setAttribute('offset', `${(offset * 100).toFixed(1)}%`);
      }
    });

    activeGradRaf = requestAnimationFrame(step);
  }

  activeGradRaf = requestAnimationFrame(step);
}

/**
 * 900-particle canvas clustering simulation (§7.1)
 */
function initCanvasPhysics(reducedMotion: boolean): void {
  const canvas = document.getElementById('plasma-hero-canvas') as HTMLCanvasElement | null;
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  let width = 0;
  let height = 0;
  const dpr = Math.min(window.devicePixelRatio || 1, 2);

  function resize() {
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    width = rect.width;
    height = rect.height;
    canvas.width = Math.floor(width * dpr);
    canvas.height = Math.floor(height * dpr);
    ctx?.scale(dpr, dpr);
  }

  resize();
  window.addEventListener('resize', resize, { passive: true });

  const POINT_COUNT = 900;
  const DURATION = 2200; // ms to relax
  const points: Point[] = [];

  // Generate 4 cluster centers
  const clusterCenters = [
    { x: 0.25, y: 0.35 },
    { x: 0.70, y: 0.28 },
    { x: 0.35, y: 0.72 },
    { x: 0.78, y: 0.68 },
  ];

  function gaussianRand(): number {
    let u = 0, v = 0;
    while (u === 0) u = Math.random();
    while (v === 0) v = Math.random();
    return Math.sqrt(-2.0 * Math.log(u)) * Math.cos(2.0 * Math.PI * v);
  }

  for (let i = 0; i < POINT_COUNT; i++) {
    const cluster = i % 4;
    const center = clusterCenters[cluster]!;

    // Uniform noise initial pos
    const initX = Math.random();
    const initY = Math.random();

    // Gaussian spread around cluster center (std dev ~0.08)
    const targetX = Math.min(1, Math.max(0, center.x + gaussianRand() * 0.08));
    const targetY = Math.min(1, Math.max(0, center.y + gaussianRand() * 0.08));

    points.push({
      initX,
      initY,
      targetX,
      targetY,
      x: reducedMotion ? targetX : initX,
      y: reducedMotion ? targetY : initY,
      radius: 1 + Math.random() * 1.2,
      cluster,
      stagger: Math.random() * 500,
      driftSeed: Math.random() * 1000,
      vx: 0,
      vy: 0,
    });
  }

  // Cursor repulsion state (pointer-fine only)
  const mouse = { x: -1000, y: -1000, active: false };
  const hasFinePointer = window.matchMedia('(pointer: fine)').matches;

  if (hasFinePointer && !reducedMotion) {
    window.addEventListener('mousemove', (e) => {
      const rect = canvas.getBoundingClientRect();
      if (
        e.clientX >= rect.left &&
        e.clientX <= rect.right &&
        e.clientY >= rect.top &&
        e.clientY <= rect.bottom
      ) {
        mouse.x = e.clientX - rect.left;
        mouse.y = e.clientY - rect.top;
        mouse.active = true;
      } else {
        mouse.active = false;
      }
    }, { passive: true });

    window.addEventListener('mouseleave', () => {
      mouse.active = false;
    });
  }

  // Ease-out-expo formula
  function easeOutExpo(t: number): number {
    return t === 1 ? 1 : 1 - Math.pow(2, -10 * t);
  }

  const startTime = performance.now();

  function render(now: number) {
    if (!ctx || document.hidden) {
      activeCanvasRaf = requestAnimationFrame(render);
      return;
    }

    ctx.clearRect(0, 0, width, height);

    const elapsed = now - startTime;

    // Draw points
    for (let i = 0; i < POINT_COUNT; i++) {
      const p = points[i]!;

      if (!reducedMotion) {
        // Transition from init to target with easeOutExpo + stagger
        const t = Math.max(0, Math.min(1, (elapsed - p.stagger) / DURATION));
        const eased = easeOutExpo(t);

        const baseX = (p.initX + (p.targetX - p.initX) * eased) * width;
        const baseY = (p.initY + (p.targetY - p.initY) * eased) * height;

        // Slow noise drift (<= 0.25px/frame)
        const driftAngle = (now * 0.0004) + p.driftSeed;
        const driftX = Math.cos(driftAngle) * 0.25;
        const driftY = Math.sin(driftAngle) * 0.25;

        let px = baseX + driftX;
        let py = baseY + driftY;

        // Cursor repulsion: quadratic falloff within 130px
        if (mouse.active) {
          const dx = px - mouse.x;
          const dy = py - mouse.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          const RADIUS = 130;
          if (dist < RADIUS && dist > 0.1) {
            const force = Math.pow((RADIUS - dist) / RADIUS, 2) * 24;
            p.vx += (dx / dist) * force;
            p.vy += (dy / dist) * force;
          }
        }

        // Dampen velocity over 900ms
        p.vx *= 0.92;
        p.vy *= 0.92;

        p.x = px + p.vx;
        p.y = py + p.vy;
      } else {
        p.x = p.targetX * width;
        p.y = p.targetY * height;
      }

      ctx.fillStyle = RAMPS[p.cluster]!;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
      ctx.fill();
    }

    // ~30 connecting lines between nearest neighbors (fade cycle 6s, 7% opacity)
    const lineCycle = (Math.sin(now * 0.001) + 1) * 0.5; // 0..1
    ctx.strokeStyle = `rgba(226, 216, 247, ${0.03 + lineCycle * 0.04})`;
    ctx.lineWidth = 0.75;

    ctx.beginPath();
    let linesDrawn = 0;
    for (let i = 0; i < 70 && linesDrawn < 32; i += 2) {
      const p1 = points[i]!;
      const p2 = points[(i + 1) % POINT_COUNT]!;
      const dx = p1.x - p2.x;
      const dy = p1.y - p2.y;
      const distSq = dx * dx + dy * dy;
      if (distSq < 10000) { // < 100px
        ctx.moveTo(p1.x, p1.y);
        ctx.lineTo(p2.x, p2.y);
        linesDrawn++;
      }
    }
    ctx.stroke();

    if (!reducedMotion) {
      activeCanvasRaf = requestAnimationFrame(render);
    }
  }

  activeCanvasRaf = requestAnimationFrame(render);
}
