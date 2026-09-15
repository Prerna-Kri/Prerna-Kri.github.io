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
const COLOR_SIGNAL = { r: 71, g: 223, b: 198 }; // #47DFC6
const COLOR_PULSE = { r: 124, g: 107, b: 255 }; // #7C6BFF

interface Point {
  // Initial uniform noise coordinates
  noiseX: number;
  noiseY: number;
  // Converged cluster target coordinates
  targetX: number;
  targetY: number;
  // Current render coordinates
  currentX: number;
  currentY: number;
  // Repulsion displacement offsets
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

function interpolateColor(t: number, alpha: number): string {
  const r = Math.round(COLOR_SIGNAL.r + (COLOR_PULSE.r - COLOR_SIGNAL.r) * t);
  const g = Math.round(COLOR_SIGNAL.g + (COLOR_PULSE.g - COLOR_SIGNAL.g) * t);
  const b = Math.round(COLOR_SIGNAL.b + (COLOR_PULSE.b - COLOR_SIGNAL.b) * t);
  return `rgba(${r}, ${g}, ${b}, ${alpha.toFixed(3)})`;
}

// Box-Muller transform for 2D Gaussian cluster generation
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
    // 4 well-separated cluster centers across the canvas
    clusterCenters = [
      { x: width * 0.28, y: height * 0.42 },
      { x: width * 0.72, y: height * 0.38 },
      { x: width * 0.38, y: height * 0.75 },
      { x: width * 0.68, y: height * 0.78 },
    ];

    points = [];
    const clusterStdDev = Math.min(width, height) * 0.11;

    for (let i = 0; i < POINT_COUNT; i++) {
      const cluster = i % CLUSTER_COUNT;
      const center = clusterCenters[cluster]!;

      const noiseX = Math.random() * width;
      const noiseY = Math.random() * height;

      const targetX = randomGaussian(center.x, clusterStdDev);
      const targetY = randomGaussian(center.y, clusterStdDev);

      const tColor = cluster / (CLUSTER_COUNT - 1);
      const radius = 1.2 + Math.random() * 0.8; // 1.2 - 2.0px per §6.1
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
        colorStr: interpolateColor(tColor, 0.85),
        stagger,
        noisePhase: Math.random() * Math.PI * 2,
      });
    }
  }

  function renderStaticFrame() {
    ctx!.clearRect(0, 0, width, height);

    // Draw connecting graph lines between nearest clusters at 8% opacity
    drawConnectingLines(1.0);

    // Draw points at target locations
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
    // Draw ~40 thin lines between clusters 0 and 1
    ctx!.lineWidth = 0.75;

    for (let i = 0; i < GRAPH_LINE_COUNT; i++) {
      const pA = points[i * 2]!;
      const pB = points[i * 2 + 1]!;
      if (!pA || !pB) continue;

      const alpha = 0.08 * graphAlpha;
      ctx!.strokeStyle = `rgba(71, 223, 198, ${alpha.toFixed(3)})`;
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

    // Calculate Graph line opacity cycle (6s period per §6.1)
    const graphCycle = (elapsed % GRAPH_CYCLE_DURATION) / GRAPH_CYCLE_DURATION;
    const graphAlpha = Math.sin(graphCycle * Math.PI);
    if (elapsed > PHASE1_DURATION + PHASE2_DURATION) {
      drawConnectingLines(graphAlpha);
    }

    // Update and draw points
    for (let i = 0; i < points.length; i++) {
      const p = points[i]!;

      if (elapsed < PHASE1_DURATION) {
        // Phase 1 (0-400ms): uniform noise, opacity 0 -> 0.9
        p.currentX = p.noiseX;
        p.currentY = p.noiseY;
      } else {
        // Phase 2 (400-2400ms): relax into 4 Gaussian clusters
        const pointElapsed = Math.max(0, elapsed - PHASE1_DURATION - p.stagger);
        const progress = Math.min(1, pointElapsed / (PHASE2_DURATION - p.stagger));
        const eased = easeOutExpo(progress);

        p.currentX = p.noiseX + (p.targetX - p.noiseX) * eased;
        p.currentY = p.noiseY + (p.targetY - p.noiseY) * eased;

        // Phase 3: Steady state subtle 2D noise drift (<= 0.25px per frame)
        if (progress >= 1) {
          p.noisePhase += 0.02;
          p.currentX += Math.cos(p.noisePhase) * 0.2;
          p.currentY += Math.sin(p.noisePhase) * 0.2;
        }
      }

      // Pointer Repulsion (Soft repulsion within 130px radius, quadratic falloff)
      if (!isTouchDevice && mouseX > 0 && mouseY > 0) {
        const dx = p.currentX + p.offsetX - mouseX;
        const dy = p.currentY + p.offsetY - mouseY;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < REPULSION_RADIUS && dist > 0) {
          const force = Math.pow(1 - dist / REPULSION_RADIUS, 2) * 14;
          p.offsetX += (dx / dist) * force;
          p.offsetY += (dy / dist) * force;
        }
      }

      // Ease repulsion offsets back over 900ms
      p.offsetX *= 0.92;
      p.offsetY *= 0.92;

      ctx!.beginPath();
      ctx!.arc(p.currentX + p.offsetX, p.currentY + p.offsetY, p.radius, 0, Math.PI * 2);
      ctx!.fillStyle = p.colorStr;
      ctx!.fill();
    }

    animationFrameId = requestAnimationFrame(loop);
  }

  function onMouseMove(e: MouseEvent) {
    if (isTouchDevice) return;
    const rect = canvas!.getBoundingClientRect();
    mouseX = e.clientX - rect.left;
    mouseY = e.clientY - rect.top;
  }

  function onMouseLeave() {
    mouseX = -9999;
    mouseY = -9999;
  }

  // IntersectionObserver to pause when offscreen per §6.1
  const observer = new IntersectionObserver(
    (entries) => {
      const entry = entries[0];
      isVisible = !!entry?.isIntersecting;
      if (isVisible && isTabActive && !animationFrameId && !isReducedMotion) {
        lastFrameTime = performance.now();
        animationFrameId = requestAnimationFrame(loop);
      }
    },
    { threshold: 0.1 },
  );

  observer.observe(canvas);

  // Pause on visibility change
  function onVisibilityChange() {
    isTabActive = !document.hidden;
    if (isTabActive && isVisible && !animationFrameId && !isReducedMotion) {
      lastFrameTime = performance.now();
      animationFrameId = requestAnimationFrame(loop);
    }
  }

  document.addEventListener('visibilitychange', onVisibilityChange);
  window.addEventListener('resize', resize);
  canvas.addEventListener('mousemove', onMouseMove);
  canvas.addEventListener('mouseleave', onMouseLeave);

  resize();

  if (!isReducedMotion) {
    animationFrameId = requestAnimationFrame(loop);
  }

  // Cleanup handler
  return () => {
    observer.disconnect();
    document.removeEventListener('visibilitychange', onVisibilityChange);
    window.removeEventListener('resize', resize);
    canvas.removeEventListener('mousemove', onMouseMove);
    canvas.removeEventListener('mouseleave', onMouseLeave);
    if (animationFrameId) cancelAnimationFrame(animationFrameId);
  };
}
