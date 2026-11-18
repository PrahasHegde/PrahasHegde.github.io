import { useEffect, useRef } from 'react';
import { prefersReducedMotion } from '../lib/ui';

/**
 * A slowly rotating 3D "embedding space": points clustered by the five focus areas,
 * with faint links between near neighbours. Pure canvas 2D, pauses when off screen.
 */
const HUES = ['--c-agents', '--c-rag', '--c-eval', '--c-cv', '--c-data'];

type P = { x: number; y: number; z: number; c: number };

function makePoints(n: number): { pts: P[]; links: [number, number][] } {
  // deterministic PRNG so the cloud looks the same on every visit
  let s = 1234567;
  const rnd = () => ((s = (s * 16807) % 2147483647) / 2147483647);
  const gauss = () => { let u = 0, v = 0; while (!u) u = rnd(); while (!v) v = rnd(); return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v); };
  const centres = HUES.map((_, i) => {
    const phi = Math.acos(1 - (2 * (i + 0.5)) / HUES.length);
    const theta = Math.PI * (1 + Math.sqrt(5)) * i;
    return { x: Math.cos(theta) * Math.sin(phi), y: Math.cos(phi) * 0.8, z: Math.sin(theta) * Math.sin(phi) };
  });
  const pts: P[] = [];
  for (let i = 0; i < n; i++) {
    const c = i % centres.length;
    const k = centres[c];
    pts.push({ x: k.x + gauss() * 0.2, y: k.y + gauss() * 0.2, z: k.z + gauss() * 0.2, c });
  }
  const links: [number, number][] = [];
  pts.forEach((p, i) => {
    const near = pts
      .map((q, j) => ({ j, d: (p.x - q.x) ** 2 + (p.y - q.y) ** 2 + (p.z - q.z) ** 2 }))
      .filter((o) => o.j > i)
      .sort((a, b) => a.d - b.d)
      .slice(0, 2);
    near.forEach((o) => { if (o.d < 0.09) links.push([i, o.j]); });
  });
  return { pts, links };
}

export function EmbeddingField() {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current!;
    const ctx = canvas.getContext('2d')!;
    const small = window.innerWidth < 760;
    const { pts, links } = makePoints(small ? 90 : 170);
    const reduce = prefersReducedMotion();
    let colors: string[] = [];
    let ink = '#000';
    const readColors = () => {
      const cs = getComputedStyle(document.documentElement);
      colors = HUES.map((h) => cs.getPropertyValue(h).trim() || '#888');
      ink = cs.getPropertyValue('--ink').trim() || '#000';
    };
    readColors();
    const mo = new MutationObserver(readColors);
    mo.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });

    let w = 0, h = 0, dpr = 1;
    const resize = () => {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = canvas.clientWidth; h = canvas.clientHeight;
      canvas.width = w * dpr; canvas.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    window.addEventListener('resize', resize);

    let mx = 0, my = 0, tx = 0, ty = 0;
    const onMove = (e: PointerEvent) => { tx = (e.clientX / window.innerWidth - 0.5) * 0.6; ty = (e.clientY / window.innerHeight - 0.5) * 0.4; };
    window.addEventListener('pointermove', onMove, { passive: true });

    let angle = 0.6, raf = 0, visible = true, last = performance.now();
    const proj = new Array(pts.length);

    const draw = (now: number) => {
      const dt = Math.min(64, now - last); last = now;
      if (!reduce) angle += dt * 0.00006;
      mx += (tx - mx) * 0.04; my += (ty - my) * 0.04;
      ctx.clearRect(0, 0, w, h);
      // centre the cloud to the right on wide screens, behind the panel
      const cx = small ? w * 0.5 : w * 0.68, cy = h * 0.48;
      const scale = Math.min(w, h) * (small ? 0.42 : 0.46);
      const ca = Math.cos(angle + mx), sa = Math.sin(angle + mx);
      const cb = Math.cos(0.25 + my), sb = Math.sin(0.25 + my);
      for (let i = 0; i < pts.length; i++) {
        const p = pts[i];
        const x1 = p.x * ca - p.z * sa, z1 = p.x * sa + p.z * ca;
        const y2 = p.y * cb - z1 * sb, z2 = p.y * sb + z1 * cb;
        const f = 2.6 / (2.6 + z2);
        proj[i] = { x: cx + x1 * scale * f, y: cy + y2 * scale * f, z: z2, f };
      }
      ctx.lineWidth = 1;
      ctx.strokeStyle = ink;
      for (const [a, b] of links) {
        const A = proj[a], B = proj[b];
        ctx.globalAlpha = 0.07 * ((A.f + B.f) / 2);
        ctx.beginPath(); ctx.moveTo(A.x, A.y); ctx.lineTo(B.x, B.y); ctx.stroke();
      }
      const order = proj.map((_, i) => i).sort((a, b) => proj[b].z - proj[a].z);
      for (const i of order) {
        const q = proj[i];
        ctx.globalAlpha = Math.max(0.15, Math.min(0.85, 0.35 + (1 - q.z) * 0.3));
        ctx.fillStyle = colors[pts[i].c];
        ctx.beginPath(); ctx.arc(q.x, q.y, 1.6 + q.f * 1.6, 0, Math.PI * 2); ctx.fill();
      }
      ctx.globalAlpha = 1;
      if (!reduce && visible) raf = requestAnimationFrame(draw);
    };
    raf = requestAnimationFrame(draw);

    const io = new IntersectionObserver(([e]) => {
      visible = e.isIntersecting;
      if (visible && !reduce) { last = performance.now(); cancelAnimationFrame(raf); raf = requestAnimationFrame(draw); }
    });
    io.observe(canvas);

    return () => {
      cancelAnimationFrame(raf); io.disconnect(); mo.disconnect();
      window.removeEventListener('resize', resize); window.removeEventListener('pointermove', onMove);
    };
  }, []);

  return <canvas ref={ref} className="embed-field" aria-hidden="true" />;
}
