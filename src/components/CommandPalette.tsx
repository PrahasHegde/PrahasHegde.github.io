import { useEffect, useMemo, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { experience, featured, more, profile } from '../data/content';
import { copyEmail, jump, mailto, printCV, toggleTheme } from '../lib/ui';

type Cmd = { t: string; g: string; k?: string; run: () => void };

const go = (href: string) => () => { location.href = href; };

export function CommandPalette({ open, setOpen }: { open: boolean; setOpen: (v: boolean) => void }) {
  const [q, setQ] = useState('');
  const [sel, setSel] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLUListElement>(null);
  const lastFocus = useRef<Element | null>(null);

  const cmds = useMemo<Cmd[]>(() => [
    { t: 'Email Prahas', g: 'Action', run: go(mailto) },
    { t: 'Copy email address', g: 'Action', run: () => void copyEmail() },
    { t: 'Save CV as PDF', g: 'Action', run: printCV },
    { t: 'Switch light / dark theme', g: 'Action', run: toggleTheme },
    ...[['work', 'Selected work'], ['experience', 'Experience'], ['skills', 'Skills'], ['about', 'About'], ['interests', 'Beyond work'], ['contact', 'Contact']]
      .map(([id, t]) => ({ t, g: 'Section', run: () => jump(id) })),
    { t: 'GitHub', g: 'Link', run: go(profile.github) },
    { t: 'LinkedIn', g: 'Link', run: go(profile.linkedin) },
    { t: 'Kaggle', g: 'Link', run: go(profile.kaggle) },
    ...[...featured, ...more].map((p) => ({
      t: p.title, g: 'Project',
      k: [p.kicker, ...p.tags, ...(p.stack ?? []), ...p.body.filter((b) => typeof b === 'string')].join(' '),
      run: () => jump(p.id),
    })),
    ...experience.map((r) => ({ t: `${r.org} · ${r.title}`, g: 'Role', run: () => jump(r.id) })),
  ], []);

  const shown = useMemo(() => {
    const s = q.trim().toLowerCase();
    if (!s) return cmds;
    const direct = cmds.filter((c) => c.t.toLowerCase().includes(s) || c.g.toLowerCase().includes(s));
    const deep = cmds.filter((c) => !direct.includes(c) && c.k?.toLowerCase().includes(s));
    return [...direct, ...deep];
  }, [q, cmds]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') { e.preventDefault(); setOpen(!open); }
      else if (e.key === '/' && !open && !/INPUT|TEXTAREA/.test((document.activeElement as HTMLElement)?.tagName)) { e.preventDefault(); setOpen(true); }
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [open, setOpen]);

  useEffect(() => {
    if (open) {
      lastFocus.current = document.activeElement;
      setQ(''); setSel(0);
      requestAnimationFrame(() => inputRef.current?.focus());
    } else if (lastFocus.current instanceof HTMLElement) {
      lastFocus.current.focus();
    }
  }, [open]);

  useEffect(() => {
    listRef.current?.children[sel]?.scrollIntoView({ block: 'nearest' });
  }, [sel]);

  const run = (i: number) => {
    const c = shown[i];
    if (!c) return;
    setOpen(false);
    c.run();
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="cmdk"
          role="dialog"
          aria-modal="true"
          aria-label="Search the site"
          onClick={(e) => e.target === e.currentTarget && setOpen(false)}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.15 }}
        >
          <motion.div className="panel" initial={{ y: -10, scale: 0.98 }} animate={{ y: 0, scale: 1 }} exit={{ y: -6, scale: 0.98 }} transition={{ duration: 0.18 }}>
            <input
              ref={inputRef}
              type="text"
              placeholder="Jump to a project, section or action…"
              autoComplete="off"
              spellCheck={false}
              aria-controls="cmdList"
              aria-activedescendant={shown.length ? `cmd-${sel}` : undefined}
              value={q}
              onChange={(e) => { setQ(e.target.value); setSel(0); }}
              onKeyDown={(e) => {
                const n = Math.max(1, shown.length);
                if (e.key === 'ArrowDown') { e.preventDefault(); setSel((sel + 1) % n); }
                else if (e.key === 'ArrowUp') { e.preventDefault(); setSel((sel - 1 + n) % n); }
                else if (e.key === 'Enter') { e.preventDefault(); run(sel); }
                else if (e.key === 'Escape') { e.preventDefault(); setOpen(false); }
                else if (e.key === 'Tab') { e.preventDefault(); }
              }}
            />
            <ul id="cmdList" role="listbox" ref={listRef}>
              {shown.length ? shown.map((c, i) => (
                <li key={c.g + c.t} id={`cmd-${i}`} role="option" aria-selected={i === sel} onMouseMove={() => i !== sel && setSel(i)} onClick={() => run(i)}>
                  <span>{c.t}</span><span className="g">{c.g}</span>
                </li>
              )) : <li style={{ color: 'var(--muted)' }}>No matches</li>}
            </ul>
            <div className="hint"><span><kbd>↑↓</kbd>move</span><span><kbd>Enter</kbd>open</span><span><kbd>Esc</kbd>close</span></div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
