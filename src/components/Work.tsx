import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, LayoutGroup, motion, useInView } from 'framer-motion';
import { featured, filters, more, tiebreakChart, type Project, type Tag } from '../data/content';
import { Arrow } from './Icons';
import { SectionHead } from './SectionHead';
import { Reveal } from './Reveal';

type Filter = 'all' | Tag;
const all = [...featured, ...more];
const matches = (p: Project, f: Filter) => f === 'all' || p.tags.includes(f);
const ease = [0.2, 0.8, 0.2, 1] as const;

function Top({ p }: { p: Project }) {
  return (
    <div className="top mono">
      <span className="tag-dot" style={{ ['--dot' as string]: `var(--c-${p.hue})` }}>{p.kicker}</span>
      <span>{p.when}</span>
    </div>
  );
}

function Links({ p, arrow }: { p: Project; arrow?: boolean }) {
  if (!p.links?.length) return p.note ? <div className="note">{p.note}</div> : null;
  return (
    <div className="links">
      {p.links.map((l) => (
        <a key={l.href} href={l.href}>{l.label}{arrow && <Arrow />}</a>
      ))}
    </div>
  );
}

function Stack({ items }: { items?: string[] }) {
  return items?.length ? <ul className="stack">{items.map((s) => <li key={s}>{s}</li>)}</ul> : null;
}

function Compare() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: '0px 0px -10% 0px' });
  return (
    <div ref={ref} className={`compare${inView ? ' in' : ''}`}>
      <h4>{tiebreakChart.title}</h4>
      <p className="note">{tiebreakChart.note}</p>
      {tiebreakChart.bars.map((b) => (
        <div className="bar-row" key={b.label}>
          <div className="lbl"><span>{b.label}</span><b>{b.value}%</b></div>
          <div className={`bar${b.good ? ' good' : ''}`} role="img" aria-label={`${b.label}: ${b.value}%`}>
            <i style={{ ['--w' as string]: `${b.value}%` }} />
          </div>
        </div>
      ))}
      <p className="cmp-foot">{tiebreakChart.foot}</p>
    </div>
  );
}

function Card({ p, flag }: { p: Project; flag?: boolean }) {
  const main = (
    <>
      <Top p={p} />
      <h3>{p.title}</h3>
      {p.what && <p className="what">{p.what}</p>}
      {p.body.map((b, i) => <p key={i} className={!p.metrics && i === p.body.length - 1 ? 'grow' : undefined}>{b}</p>)}
      {p.metrics && (
        <div className="metrics grow">
          {p.metrics.map((m) => <div key={m.v}><b>{m.v}</b><span>{m.l}</span></div>)}
        </div>
      )}
      <Stack items={p.stack} />
      <Links p={p} arrow />
    </>
  );
  return (
    <motion.article
      layout
      id={p.id}
      className={`card reveal${flag ? ' flag' : ''}`}
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.97 }}
      viewport={{ once: true, margin: '0px 0px -8% 0px' }}
      transition={{ duration: 0.5, ease }}
    >
      {flag ? <><div>{main}</div><Compare /></> : main}
    </motion.article>
  );
}

function Item({ p }: { p: Project }) {
  return (
    <motion.div
      layout
      id={p.id}
      className="item reveal"
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      viewport={{ once: true, margin: '0px 0px -6% 0px' }}
      transition={{ duration: 0.45, ease }}
    >
      <Top p={p} />
      <h4>{p.title}</h4>
      {p.body.map((b, i) => <p key={i}>{b}</p>)}
      <Links p={p} />
    </motion.div>
  );
}

export function Work() {
  const [filter, setFilter] = useState<Filter>('all');

  useEffect(() => {
    const onReveal = (e: Event) => {
      const id = (e as CustomEvent<string>).detail;
      const p = all.find((x) => x.id === id);
      if (p && !matches(p, filter)) setFilter('all');
    };
    const showAll = () => setFilter('all');
    window.addEventListener('portfolio:reveal', onReveal);
    window.addEventListener('portfolio:print', showAll);
    window.addEventListener('beforeprint', showAll);
    return () => {
      window.removeEventListener('portfolio:reveal', onReveal);
      window.removeEventListener('portfolio:print', showAll);
      window.removeEventListener('beforeprint', showAll);
    };
  }, [filter]);

  const shownFeatured = featured.filter((p) => matches(p, filter));
  const shownMore = more.filter((p) => matches(p, filter));

  return (
    <section id="work">
      <div className="wrap">
        <SectionHead n="01" kicker="Selected work" title="Things I've built">
          One idea runs through all of it: an AI system should show its evidence. The data it checked, the source it cited, the test it passed.
        </SectionHead>

        <div className="filters" role="group" aria-label="Filter projects">
          {filters.map((f) => (
            <button key={f.id} className="chip" type="button" aria-pressed={filter === f.id} onClick={() => setFilter(f.id)}>
              {f.label}
              <span className="n">{all.filter((p) => matches(p, f.id)).length}</span>
            </button>
          ))}
        </div>

        <LayoutGroup>
          <motion.div layout className="cards">
            <AnimatePresence mode="popLayout">
              {shownFeatured.map((p) => <Card key={p.id} p={p} flag={p.id === 'p-tiebreak'} />)}
            </AnimatePresence>
          </motion.div>

          <motion.div layout className="more">
            <Reveal as="h3">More projects</Reveal>
            <div className="grid-more">
              <AnimatePresence mode="popLayout">
                {shownMore.map((p) => <Item key={p.id} p={p} />)}
              </AnimatePresence>
            </div>
            {!shownMore.length && <p className="empty">No smaller projects in this category. The highlights above cover it.</p>}
          </motion.div>
        </LayoutGroup>
      </div>
    </section>
  );
}
