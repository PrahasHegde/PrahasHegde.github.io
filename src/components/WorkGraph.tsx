import { useEffect, useMemo, useRef, useState } from 'react';
import { forceCollide, forceSimulation, forceX, forceY, type Simulation, type SimulationNodeDatum } from 'd3-force';
import { jump, prefersReducedMotion } from '../lib/ui';
import type { Hue } from '../data/content';

type Kind = 'me' | 'hub' | 'leaf';
type GNode = SimulationNodeDatum & {
  id: string; label: string; kind: Kind; g?: Hue; target?: string; desc?: string;
  ang: number; tx: number; ty: number;
};

const W = 760, H = 640, CX = W / 2, CY = H / 2;
const RH: [number, number] = [150, 132];
const RL: [number, number] = [245, 235];

// Focus areas and their position around the circle (degrees, 0 = right, clockwise).
const HUBS: { id: Hue; label: string; ang: number }[] = [
  { id: 'data', label: 'Graphs & data', ang: 200 },
  { id: 'rag', label: 'RAG & retrieval', ang: 272 },
  { id: 'agents', label: 'Agents & tool use', ang: 335 },
  { id: 'eval', label: 'Evals & post-training', ang: 28 },
  { id: 'cv', label: 'Computer vision', ang: 121 },
];

// Projects and roles: which focus areas they connect to, and where they sit.
const LEAVES: { id: string; label: string; hubs: Hue[]; ang: number; target: string; desc: string }[] = [
  { id: 'kg', label: 'Knowledge graphs', hubs: ['data'], ang: 180, target: 'p-kg', desc: 'Connecting multi-source automotive data' },
  { id: 'bmw', label: 'BMW Group', hubs: ['data', 'rag'], ang: 205, target: 'x-bmw', desc: 'AI Intern: knowledge graphs, LLM and RAG for plants' },
  { id: 'lessons', label: 'Lessons Learned', hubs: ['data', 'rag'], ang: 225, target: 'p-lessons', desc: 'LLM platform for manufacturing quality issues' },
  { id: 'wiki', label: 'WikiPilot', hubs: ['rag', 'data'], ang: 245, target: 'p-wikipilot', desc: 'Time-travel RAG over 862,076 Wikipedia versions' },
  { id: 'career', label: 'CareerForge', hubs: ['rag'], ang: 263, target: 'p-careerforge', desc: 'RAG resume matching with a skill-gap graph' },
  { id: 'prag', label: 'Permission RAG', hubs: ['rag'], ang: 281, target: 'p-permrag', desc: 'Retrieval filtered by identity, hash-chained audit log' },
  { id: 'router', label: 'Cost Router', hubs: ['rag'], ang: 299, target: 'p-costrouter', desc: 'Semantic caching and small/large model routing' },
  { id: 'push', label: 'Pushback', hubs: ['agents', 'rag'], ang: 317, target: 'p-pushback', desc: 'Checks unfair letters claim by claim against current law' },
  { id: 'money', label: 'MoneyWise', hubs: ['agents'], ang: 340, target: 'p-moneywise', desc: 'Tool-calling agent over your own transactions' },
  { id: 'patch', label: 'PatchPilot', hubs: ['agents', 'eval'], ang: 7, target: 'p-patchpilot', desc: 'Planner + coder agents, verified by independent pytest runs' },
  { id: 'grpo', label: 'Gemma GRPO', hubs: ['eval'], ang: 30, target: 'p-grpo', desc: 'Post-training a 2B model to reason: 55% vs 25% baseline' },
  { id: 'tiebreak', label: 'Tiebreak eval', hubs: ['eval'], ang: 50, target: 'p-tiebreak', desc: '8 models, 684 graded answers: 43% from memory, 91% with the rules' },
  { id: 'secure', label: 'Secure AI lock', hubs: ['cv'], ang: 85, target: 'p-secure', desc: 'Stereo-vision anti-spoofing smart lock' },
  { id: 'drowsy', label: 'Drowsiness', hubs: ['cv'], ang: 103, target: 'p-drowsy', desc: 'Real-time CNN in PyTorch' },
  { id: 'trainer', label: 'AI trainer', hubs: ['cv'], ang: 121, target: 'p-trainer', desc: 'Pose tracking at 30+ FPS on CPU' },
  { id: 'lane', label: 'Lane detection', hubs: ['cv'], ang: 139, target: 'p-lane', desc: 'NEXT24Tech, autonomous-driving research' },
  { id: 'football', label: 'Player tracking', hubs: ['cv'], ang: 157, target: 'p-football', desc: 'Detection and tracking in match video' },
];

const rad = (a: number) => (a * Math.PI) / 180;
const at = (a: number, r: [number, number]) => [CX + Math.cos(rad(a)) * r[0], CY + Math.sin(rad(a)) * r[1]] as const;

function build() {
  const reduce = prefersReducedMotion();
  const nodes: GNode[] = [{ id: 'me', label: 'Prahas', kind: 'me', ang: 0, tx: CX, ty: CY, x: CX, y: CY, fx: CX, fy: CY }];
  HUBS.forEach((h) => {
    const [x, y] = at(h.ang, RH);
    nodes.push({ id: h.id, label: h.label, kind: 'hub', g: h.id, ang: h.ang, tx: x, ty: y, x, y, fx: x, fy: y });
  });
  LEAVES.forEach((l) => {
    const [tx, ty] = at(l.ang, RL);
    const [x, y] = reduce ? [tx, ty] : at(l.ang, [70, 62]); // bloom outward from the centre
    nodes.push({ id: l.id, label: l.label, kind: 'leaf', g: l.hubs[0], ang: l.ang, tx, ty, x, y, target: l.target, desc: l.desc });
  });
  const links: [string, string][] = [
    ...HUBS.map((h) => ['me', h.id] as [string, string]),
    ...LEAVES.flatMap((l) => l.hubs.map((h) => [h, l.id] as [string, string])),
  ];
  const nb: Record<string, Set<string>> = {};
  nodes.forEach((n) => (nb[n.id] = new Set([n.id])));
  links.forEach(([a, b]) => { nb[a].add(b); nb[b].add(a); });
  return { nodes, links, nb };
}

function labelProps(n: GNode) {
  if (n.kind === 'me') return { dy: 6, textAnchor: 'middle' as const };
  const c = Math.cos(rad(n.ang)), s = Math.sin(rad(n.ang));
  if (n.kind === 'hub') return { dy: s > 0.3 ? 33 : -21, textAnchor: 'middle' as const };
  if (c > 0.1) return { dx: 13, dy: 4.5, textAnchor: 'start' as const };
  if (c < -0.1) return { dx: -13, dy: 4.5, textAnchor: 'end' as const };
  return { dy: s > 0 ? 28 : -15, textAnchor: 'middle' as const };
}

const R = (k: Kind) => (k === 'me' ? 44 : k === 'hub' ? 13 : 8);
const DEFAULT_NOTE = 'A live map of my work. Hover a dot to see how it connects, click to jump to it.';
const TOUCH_NOTE = 'A live map of my work. Tap a dot to see how it connects, tap again to jump to it.';

export function WorkGraph() {
  const { nodes, links, nb } = useMemo(build, []);
  const byId = useMemo(() => Object.fromEntries(nodes.map((n) => [n.id, n])), [nodes]);
  const [, setFrame] = useState(0);
  const [focus, setFocus] = useState<string | null>(null);
  const [narrow, setNarrow] = useState(() => window.innerWidth < 560);
  const svgRef = useRef<SVGSVGElement>(null);
  const simRef = useRef<Simulation<GNode, undefined>>();
  const drag = useRef<{ id: string; moved: boolean; sx: number; sy: number } | null>(null);
  const lastTap = useRef<string | null>(null);
  const touch = useMemo(() => window.matchMedia('(hover: none)').matches, []);

  useEffect(() => {
    const sim = forceSimulation<GNode>(nodes)
      .force('x', forceX<GNode>((d) => d.tx).strength(0.5))
      .force('y', forceY<GNode>((d) => d.ty).strength(0.5))
      .force('collide', forceCollide<GNode>((d) => (d.kind === 'me' ? 60 : d.kind === 'hub' ? 22 : 15)))
      .alpha(0.6);
    simRef.current = sim;
    if (prefersReducedMotion()) {
      sim.stop();
      sim.tick(300);
      setFrame((f) => f + 1);
    } else {
      sim.on('tick', () => setFrame((f) => f + 1));
    }
    const onResize = () => setNarrow(window.innerWidth < 560);
    window.addEventListener('resize', onResize);
    return () => { sim.stop(); window.removeEventListener('resize', onResize); };
  }, [nodes]);

  const toSvg = (e: React.PointerEvent) => {
    const svg = svgRef.current!;
    const pt = svg.createSVGPoint();
    pt.x = e.clientX; pt.y = e.clientY;
    return pt.matrixTransform(svg.getScreenCTM()!.inverse());
  };

  const onDown = (e: React.PointerEvent, n: GNode) => {
    (e.currentTarget as Element).setPointerCapture(e.pointerId);
    drag.current = { id: n.id, moved: false, sx: e.clientX, sy: e.clientY };
  };
  const onMove = (e: React.PointerEvent, n: GNode) => {
    const d = drag.current;
    if (!d || d.id !== n.id) return;
    if (!d.moved && Math.hypot(e.clientX - d.sx, e.clientY - d.sy) < 5) return;
    d.moved = true;
    const p = toSvg(e);
    n.fx = p.x; n.fy = p.y;
    const sim = simRef.current!;
    if (prefersReducedMotion()) { n.x = p.x; n.y = p.y; setFrame((f) => f + 1); }
    else sim.alphaTarget(0.25).restart();
  };
  const onUp = (_e: React.PointerEvent, n: GNode) => {
    const d = drag.current;
    drag.current = null;
    if (!d) return;
    simRef.current?.alphaTarget(0);
    if (n.kind === 'leaf') { n.fx = null; n.fy = null; } else { n.fx = n.tx; n.fy = n.ty; }
    if (d.moved) { simRef.current?.alpha(0.5).restart(); return; }
    // a click / tap
    if (touch && lastTap.current !== n.id) { lastTap.current = n.id; setFocus(n.id); return; }
    lastTap.current = null;
    if (n.target) jump(n.target);
  };

  const set = focus ? nb[focus] : null;
  const f = focus ? byId[focus] : null;
  const note = f
    ? f.desc ? <><b>{f.label}</b>: {f.desc}</>
      : f.kind === 'hub' ? <><b>{f.label}</b>: {nb[f.id].size - 2} projects and roles</>
      : touch ? TOUCH_NOTE : DEFAULT_NOTE
    : touch ? TOUCH_NOTE : DEFAULT_NOTE;

  return (
    <div className="graph-wrap">
      <svg
        ref={svgRef}
        id="graph"
        viewBox={`0 0 ${W} ${H}`}
        className={`${focus ? 'focus' : ''} ${narrow ? 'narrow' : ''}`}
        role="img"
        aria-label="A map of Prahas's work: five focus areas (agents, retrieval, evals and post-training, computer vision, knowledge graphs and data) connected to the projects and roles behind them."
      >
        <g>
          {links.map(([a, b]) => {
            const s = byId[a], t = byId[b];
            const on = focus === a || focus === b;
            return <line key={a + b} className={`link${on ? ' on' : ''}`} x1={s.x} y1={s.y} x2={t.x} y2={t.y} />;
          })}
        </g>
        <g>
          {nodes.map((n) => {
            const on = !!set?.has(n.id);
            const r = R(n.kind) + (focus === n.id && n.kind !== 'me' ? 3 : 0);
            const color = n.g ? `var(--c-${n.g})` : undefined;
            return (
              <g
                key={n.id}
                className={`node ${n.kind}${on ? ' on' : ''}`}
                transform={`translate(${n.x},${n.y})`}
                tabIndex={n.target ? 0 : undefined}
                role={n.target ? 'link' : undefined}
                aria-label={n.target ? `${n.label}: ${n.desc}` : undefined}
                onPointerEnter={() => !touch && setFocus(n.id)}
                onPointerLeave={() => !touch && !drag.current && setFocus(null)}
                onFocus={() => setFocus(n.id)}
                onBlur={() => setFocus(null)}
                onPointerDown={(e) => onDown(e, n)}
                onPointerMove={(e) => onMove(e, n)}
                onPointerUp={(e) => onUp(e, n)}
                onKeyDown={(e) => { if ((e.key === 'Enter' || e.key === ' ') && n.target) { e.preventDefault(); jump(n.target); } }}
              >
                {n.kind === 'me' && <circle className="pulse" r={44} />}
                <circle
                  className="dot"
                  r={r}
                  style={{
                    fill: n.kind === 'me' ? 'var(--me)' : n.kind === 'hub' ? color : 'var(--node-fill)',
                    stroke: n.kind === 'me' ? 'none' : color,
                  }}
                  strokeWidth={n.kind === 'hub' ? 0 : 2.5}
                />
                <text {...labelProps(n)}>{n.label}</text>
              </g>
            );
          })}
        </g>
      </svg>
      <div className="graph-note" aria-live="polite">{note}</div>
    </div>
  );
}
