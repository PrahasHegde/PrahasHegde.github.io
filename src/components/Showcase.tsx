import { useEffect, useRef, useState } from 'react';
import { motion, useInView, useScroll, useTransform, type MotionValue } from 'framer-motion';
import { featured, more } from '../data/content';
import { jump, prefersReducedMotion } from '../lib/ui';

/* ---------------- manifesto: words light up as you scroll ---------------- */

const MANIFESTO =
  'Most AI demos look great until someone asks how do you know? I build the other kind: systems that show the data they checked, the source they cited and the test they passed.';
const EMPH = new Set(['how', 'do', 'you', 'know?', 'data', 'source', 'test']);

function Word({ w, i, n, p }: { w: string; i: number; n: number; p: MotionValue<number> }) {
  const start = i / n, end = start + 1.5 / n;
  const opacity = useTransform(p, [start, end], [0.14, 1]);
  return <motion.span style={{ opacity }} className={EMPH.has(w.toLowerCase()) ? 'em' : undefined}>{w} </motion.span>;
}

export function Manifesto() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start 0.85', 'end 0.45'] });
  const words = MANIFESTO.split(' ');
  return (
    <section className="manifesto" aria-label="What I believe">
      <div className="wrap">
        <p className="mono m-kicker"><span className="slash">//</span> the thesis</p>
        <div ref={ref} className="m-text">
          <span className="sr-only">{MANIFESTO}</span>
          <span aria-hidden="true">
            {words.map((w, i) => <Word key={i} w={w} i={i} n={words.length} p={scrollYProgress} />)}
          </span>
        </div>
      </div>
    </section>
  );
}

/* ---------------- by the numbers: bento grid with count-up ---------------- */

function CountUp({ to, decimals = 0, suffix = '' }: { to: number; decimals?: number; suffix?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: '0px 0px -10% 0px' });
  const [v, setV] = useState(prefersReducedMotion() ? to : 0);
  useEffect(() => {
    if (!inView || prefersReducedMotion()) return;
    let raf = 0; const t0 = performance.now(); const dur = 1400;
    const tick = (t: number) => {
      const k = Math.min(1, (t - t0) / dur);
      const e = 1 - Math.pow(1 - k, 4);
      setV(to * e);
      if (k < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [inView, to]);
  return <span ref={ref} className="num">{v.toLocaleString('en-US', { maximumFractionDigits: decimals, minimumFractionDigits: decimals })}{suffix}</span>;
}

const all = [...featured, ...more];
const tagCount = (t: string) => all.filter((p) => p.tags.includes(t as never)).length;

export function Numbers() {
  const segs = [
    { k: 'Agents', n: tagCount('agents'), hue: 'agents' },
    { k: 'RAG', n: tagCount('rag'), hue: 'rag' },
    { k: 'Evals', n: tagCount('eval'), hue: 'eval' },
    { k: 'Vision', n: tagCount('cv'), hue: 'cv' },
  ];
  const segTotal = segs.reduce((a, s) => a + s.n, 0);
  return (
    <section className="numbers" aria-label="By the numbers">
      <div className="wrap">
        <div className="bento">
          <motion.button type="button" className="tile t-big" onClick={() => jump('p-tiebreak')}
            initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }}>
            <span className="t-k mono">Tiebreak · LLM eval</span>
            <span className="t-row"><CountUp to={91} suffix="%" /><span className="t-vs">vs <b>43%</b></span></span>
            <span className="t-l">accuracy of large open models <b>with</b> the rule text vs. from memory. Same models, same tasks: the gap is stale knowledge.</span>
            <span className="t-bars" aria-hidden="true">
              <i style={{ ['--h' as string]: '43%' }} className="muted" /><i style={{ ['--h' as string]: '91%' }} />
            </span>
          </motion.button>

          <motion.button type="button" className="tile t-wide" onClick={() => jump('p-wikipilot')}
            initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6, delay: 0.05 }}>
            <span className="t-k mono">WikiPilot · time-travel RAG</span>
            <CountUp to={862076} />
            <span className="t-l">Wikipedia article versions you can query as of any date since 2003</span>
            <span className="t-spark" aria-hidden="true">
              {Array.from({ length: 24 }, (_, i) => <i key={i} style={{ ['--h' as string]: `${8 + 92 * Math.pow(i / 23, 1.5)}%` }} />)}
            </span>
            <span className="t-axis mono" aria-hidden="true"><span>2003</span><span>cumulative edits</span><span>2026</span></span>
          </motion.button>

          <motion.button type="button" className="tile" onClick={() => jump('p-tiebreak')}
            initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6, delay: 0.1 }}>
            <span className="t-k mono">Graded responses</span>
            <CountUp to={684} />
            <span className="t-l">across 8 open-weight models, by a deterministic grader. No LLM judge.</span>
            <span className="t-dots" aria-hidden="true">{Array.from({ length: 72 }, (_, i) => <i key={i} />)}</span>
          </motion.button>

          <motion.button type="button" className="tile" onClick={() => jump('p-grpo')}
            initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6, delay: 0.15 }}>
            <span className="t-k mono">GRPO post-training</span>
            <span className="t-row"><CountUp to={55} suffix="%" /><svg className="t-ring" viewBox="0 0 36 36" aria-hidden="true"><circle cx="18" cy="18" r="15" /><circle cx="18" cy="18" r="15" className="base" pathLength="100" strokeDasharray="25 100" /><circle cx="18" cy="18" r="15" className="val" pathLength="100" strokeDasharray="55 100" /></svg></span>
            <span className="t-l">Gemma-2 2B on ARC, vs. a 25% random baseline</span>
          </motion.button>

          <motion.button type="button" className="tile t-half" onClick={() => jump('experience')}
            initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6, delay: 0.2 }}>
            <span className="t-k mono">Internships</span>
            <CountUp to={4} />
            <span className="t-l">from customer-support LLMs to knowledge graphs at BMW Group</span>
            <span className="t-line" aria-hidden="true"><i /><i /><i /><i className="now" /></span>
          </motion.button>

          <motion.button type="button" className="tile t-half" onClick={() => jump('work')}
            initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6, delay: 0.25 }}>
            <span className="t-k mono">Projects on this site</span>
            <CountUp to={all.length} />
            <span className="t-seg" aria-hidden="true">
              {segs.map((s) => <i key={s.k} style={{ flex: s.n, background: `var(--c-${s.hue})` }} />)}
            </span>
            <span className="t-legend">{segs.map((s) => <span key={s.k}><i style={{ background: `var(--c-${s.hue})` }} />{s.k} {s.n}</span>)}</span>
            <span className="sr-only">{segTotal} tag assignments across agents, RAG, evals and vision.</span>
          </motion.button>
        </div>
      </div>
    </section>
  );
}
