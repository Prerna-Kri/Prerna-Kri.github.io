/**
 * Hand-written 2D Canvas Hero Embedding Field per §6.1.
 * 1,400 points, 3-phase convergence, quadratic mouse repulsion,
 * reduced-motion static fallback, and lifecycle pausing.
 */

// Named constants (§15)
const POINT_COUNT = 1400;
const CLUSTER_COUNT = 4;
const PHASE1_DURATION = 400; // ms
const PHASE2_DURATION = 2000; // ms (Phase 2 runs 400ms -> 2400ms)
const MAX_STAGGER = 600; // ms
const REPULSION_RADIUS = 130; // px
const GRAPH_LINE_COUNT = 40;
const GRAPH_CYCLE_DURATION = 6000; // ms
const TARGET_FPS = 60;
const FRAME_INTERVAL = 1000 / TARGET_FPS;

// Color ramp tokens (§4.3)
const COLOR_SIGNAL_DARK = { r: 71, g: 223, b: 198 }; // #47DFC6
const COLOR_PULSE_DARK = { r: 124, g: 107, b: 255 }; // #7C6BFF

const COLOR_SIGNAL_LIGHT = { r: 14, g: 156, b: 134 }; // #0E9C86
const COLOR_PULSE_LIGHT = { r: 88, g: 71, b: 214 }; // #5847D6

interface Point {
  noiseX: number;
  noiseY: number;
  targetX: number;
  targetY: number;
  currentX: number;
  currentY: number;
  offsetX: number;
  offsetY: number;
  radius: number;
  cluster: number;
  colorStr: string;
  stagger: number;
  noisePhase: number;
}

function easeOutExpo(t: number): number {
  return t >= 1 ? 1 : 1 - Math.pow(2, -10 * t);
}

function interpolateColor(t: number, alpha: number, isLight = false): string {
  const cSignal = isLight ? COLOR_SIGNAL_LIGHT : COLOR_SIGNAL_DARK;
  const cPulse = isLight ? COLOR_PULSE_LIGHT : COLOR_PULSE_DARK;
  const r = Math.round(cSignal.r + (cPulse.r - cSignal.r) * t);
  const g = Math.round(cSignal.g + (cPulse.g - cSignal.g) * t);
  const b = Math.round(cSignal.b + (cPulse.b - cSignal.b) * t);
  return `rgba(${r}, ${g}, ${b}, ${alpha.toFixed(3)})`;
}

function randomGaussian(mean: number, stdDev: number): number {
  let u1 = 0;
  let u2 = 0;
  while (u1 === 0) u1 = Math.random();
  while (u2 === 0) u2 = Math.random();
  const z0 = Math.sqrt(-2.0 * Math.log(u1)) * Math.cos(2.0 * Math.PI * u2);
  return mean + z0 * stdDev;
}

export function initHeroField(canvasId = 'hero-canvas'): () => void {
  const canvas = document.getElementById(canvasId) as HTMLCanvasElement | null;
  if (!canvas) return () => {};

  const ctx = canvas.getContext('2d', { alpha: true });
  if (!ctx) return () => {};

  const isReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;

  let width = 0;
  let height = 0;
  let dpr = 1;
  let animationFrameId: number | null = null;
  let startTime: number | null = null;
  let isVisible = true;
  let isTabActive = !document.hidden;

  let mouseX = -9999;
  let mouseY = -9999;

  let points: Point[] = [];
  let clusterCenters: { x: number; y: number }[] = [];

  function isCurrentLight(): boolean {
    return document.documentElement.getAttribute('data-theme') === 'light';
  }

  function updatePointColors() {
    const light = isCurrentLight();
    for (let i = 0; i < points.length; i++) {
      const p = points[i]!;
      const tColor = p.cluster / (CLUSTER_COUNT - 1);
      p.colorStr = interpolateColor(tColor, light ? 0.75 : 0.85, light);
    }
  }

  function resize() {
    dpr = window.devicePixelRatio || 1;
    const rect = canvas!.getBoundingClientRect();
    width = rect.width;
    height = rect.height;

    canvas!.width = Math.floor(width * dpr);
    canvas!.height = Math.floor(height * dpr);
    ctx!.setTransform(dpr, 0, 0, dpr, 0, 0);

    generatePoints();

    if (isReducedMotion) {
      renderStaticFrame();
    }
  }

  function generatePoints() {
    // 4 Gaussian cluster centers framed aesthetically to not drown out left-aligned text
    clusterCenters = [
      { x: width * 0.48, y: height * 0.38 },
      { x: width * 0.78, y: height * 0.34 },
      { x: width * 0.54, y: height * 0.74 },
      { x: width * 0.82, y: height * 0.72 },
    ];

    points = [];
    const clusterStdDev = Math.min(width, height) * 0.105;
    const light = isCurrentLight();

    for (let i = 0; i < POINT_COUNT; i++) {
      const cluster = i % CLUSTER_COUNT;
      const center = clusterCenters[cluster]!;

      const noiseX = Math.random() * width;
      const noiseY = Math.random() * height;

      const targetX = randomGaussian(center.x, clusterStdDev);
      const targetY = randomGaussian(center.y, clusterStdDev);

      const tColor = cluster / (CLUSTER_COUNT - 1);
      const radius = 1.2 + Math.random() * 0.8;
      const stagger = (i / POINT_COUNT) * MAX_STAGGER;

      points.push({
        noiseX,
        noiseY,
        targetX,
        targetY,
        currentX: noiseX,
        currentY: noiseY,
        offsetX: 0,
        offsetY: 0,
        radius,
        cluster,
        colorStr: interpolateColor(tColor, light ? 0.75 : 0.85, light),
        stagger,
        noisePhase: Math.random() * Math.PI * 2,
      });
    }
  }

  function renderStaticFrame() {
    ctx!.clearRect(0, 0, width, height);
    drawConnectingLines(1.0);

    for (let i = 0; i < points.length; i++) {
      const p = points[i]!;
      ctx!.beginPath();
      ctx!.arc(p.targetX, p.targetY, p.radius, 0, Math.PI * 2);
      ctx!.fillStyle = p.colorStr;
      ctx!.fill();
    }
  }

  function drawConnectingLines(graphAlpha: number) {
    if (clusterCenters.length < 2) return;
    ctx!.lineWidth = 0.75;
    const light = isCurrentLight();
    const strokeR = light ? COLOR_SIGNAL_LIGHT.r : COLOR_SIGNAL_DARK.r;
    const strokeG = light ? COLOR_SIGNAL_LIGHT.g : COLOR_SIGNAL_DARK.g;
    const strokeB = light ? COLOR_SIGNAL_LIGHT.b : COLOR_SIGNAL_DARK.b;

    for (let i = 0; i < GRAPH_LINE_COUNT; i++) {
      const pA = points[i * 2]!;
      const pB = points[i * 2 + 1]!;
      if (!pA || !pB) continue;

      const alpha = 0.08 * graphAlpha;
      ctx!.strokeStyle = `rgba(${strokeR}, ${strokeG}, ${strokeB}, ${alpha.toFixed(3)})`;
      ctx!.beginPath();
      ctx!.moveTo(pA.currentX + pA.offsetX, pA.currentY + pA.offsetY);
      ctx!.lineTo(pB.currentX + pB.offsetX, pB.currentY + pB.offsetY);
      ctx!.stroke();
    }
  }

  let lastFrameTime = 0;

  function loop(currentTime: number) {
    if (!isVisible || !isTabActive) {
      animationFrameId = null;
      return;
    }

    if (!startTime) startTime = currentTime;
    const elapsed = currentTime - startTime;

    if (currentTime - lastFrameTime < FRAME_INTERVAL) {
      animationFrameId = requestAnimationFrame(loop);
      return;
    }
    lastFrameTime = currentTime;

    ctx!.clearRect(0, 0, width, height);

    // Phase 1 (0-400ms): Uniform noise fading in 0 -> 0.9
    // Phase 2 (400-2400ms): Progressive relaxation into 4 Gaussian clusters
    // Phase 3 (2400ms+): Steady-state 2D low-amplitude drift (<= 0.25px/frame)
    const isPhase1 = elapsed < PHASE1_DURATION;
    const isPhase2 = elapsed >= PHASE1_DURATION && elapsed < PHASE1_DURATION + PHASE2_DURATION;
    const isPhase3 = elapsed >= PHASE1_DURATION + PHASE2_DURATION;

    let globalOpacity = 1.0;
    if (isPhase1) {
      globalOpacity = Math.min(1, (elapsed / PHASE1_DURATION) * 0.9);
    }

    let graphAlpha = 0;
    if (isPhase3) {
      const cycleProgress = (elapsed % GRAPH_CYCLE_DURATION) / GRAPH_CYCLE_DURATION;
      graphAlpha = Math.sin(cycleProgress * Math.PI * 2) * 0.5 + 0.5;
      drawConnectingLines(graphAlpha);
    }

    ctx!.globalAlpha = globalOpacity;

    for (let i = 0; i < points.length; i++) {
      const p = points[i]!;

      if (isPhase1) {
        p.currentX = p.noiseX;
        p.currentY = p.noiseY;
      } else if (isPhase2) {
        const pointElapsed = Math.max(0, elapsed - PHASE1_DURATION - p.stagger);
        const pointDuration = PHASE2_DURATION - p.stagger;
        const rawT = Math.min(1, Math.max(0, pointElapsed / pointDuration));
        const easedT = easeOutExpo(rawT);

        p.currentX = p.noiseX + (p.targetX - p.noiseX) * easedT;
        p.currentY = p.noiseY + (p.targetY - p.noiseY) * easedT;
      } else {
        // Phase 3 steady-state drift (<= 0.25px per frame)
        const driftSpeed = 0.0015;
        p.noisePhase += driftSpeed;
        const driftX = Math.cos(p.noisePhase + i) * 0.22;
        const driftY = Math.sin(p.noisePhase + i * 1.5) * 0.22;
        p.currentX += driftX;
        p.currentY += driftY;

        // Keep inside bounds
        p.currentX = Math.max(10, Math.min(width - 10, p.currentX));
        p.currentY = Math.max(10, Math.min(height - 10, p.currentY));
      }

      // Pointer repulsion (within 130px radius, falling off quadratically, eases back over 900ms)
      if (!isTouchDevice && mouseX > 0 && mouseY > 0) {
        const dx = p.currentX - mouseX;
        const dy = p.currentY - mouseY;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < REPULSION_RADIUS && dist > 0) {
          const force = Math.pow(1 - dist / REPULSION_RADIUS, 2) * 28;
          const angle = Math.atan2(dy, dx);
          p.offsetX += Math.cos(angle) * force;
          p.offsetY += Math.sin(angle) * force;
        }
      }

      // Spring-decay offsets back to zero over ~900ms
      p.offsetX *= 0.94;
      p.offsetY *= 0.94;

      ctx!.beginPath();
      ctx!.arc(p.currentX + p.offsetX, p.currentY + p.offsetY, p.radius, 0, Math.PI * 2);
      ctx!.fillStyle = p.colorStr;
      ctx!.fill();
    }

    ctx!.globalAlpha = 1.0;
    animationFrameId = requestAnimationFrame(loop);
  }

  function handleMouseMove(e: MouseEvent) {
    if (isTouchDevice) return;
    const rect = canvas!.getBoundingClientRect();
    mouseX = e.clientX - rect.left;
    mouseY = e.clientY - rect.top;
  }

  function handleMouseLeave() {
    mouseX = -9999;
    mouseY = -9999;
  }

  function handleVisibilityChange() {
    isTabActive = !document.hidden;
    if (isTabActive && isVisible && !animationFrameId && !isReducedMotion) {
      lastFrameTime = performance.now();
      animationFrameId = requestAnimationFrame(loop);
    }
  }

  // IntersectionObserver to pause RAF loop when off-screen (§6.1)
  const observer = new IntersectionObserver(
    (entries) => {
      const entry = entries[0];
      isVisible = !!entry?.isIntersecting;
      if (isVisible && isTabActive && !animationFrameId && !isReducedMotion) {
        lastFrameTime = performance.now();
        animationFrameId = requestAnimationFrame(loop);
      }
    },
    { threshold: 0.05 },
  );

  // Theme observer to adjust point colors when theme toggles
  const themeObserver = new MutationObserver(() => {
    updatePointColors();
  });
  themeObserver.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });

  const resizeObserver = new ResizeObserver(() => {
    resize();
  });

  window.addEventListener('mousemove', handleMouseMove, { passive: true });
  window.addEventListener('mouseleave', handleMouseLeave, { passive: true });
  document.addEventListener('visibilitychange', handleVisibilityChange);
  observer.observe(canvas);
  resizeObserver.observe(canvas);

  resize();
  if (!isReducedMotion) {
    animationFrameId = requestAnimationFrame(loop);
  }

  return () => {
    if (animationFrameId) cancelAnimationFrame(animationFrameId);
    window.removeEventListener('mousemove', handleMouseMove);
    window.removeEventListener('mouseleave', handleMouseLeave);
    document.removeEventListener('visibilitychange', handleVisibilityChange);
    observer.disconnect();
    resizeObserver.disconnect();
    themeObserver.disconnect();
  };
}
