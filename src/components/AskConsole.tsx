import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { ask, indexStats, suggestions, type Answer } from '../lib/ask';
import { jump, prefersReducedMotion } from '../lib/ui';

type Msg = { id: number; role: 'user' | 'bot'; text: string; answer?: Answer; shown?: number; done?: boolean };

const GREETING =
  "Hi. I'm a small retrieval engine over this site. Ask me anything about Prahas and I'll answer only from what's here, with citations. No LLM, nothing made up.";

export function AskConsole() {
  const [msgs, setMsgs] = useState<Msg[]>([{ id: 0, role: 'bot', text: GREETING, done: true }]);
  const [q, setQ] = useState('');
  const [busy, setBusy] = useState(false);
  const [openTrace, setOpenTrace] = useState<number | null>(null);
  const scroller = useRef<HTMLDivElement>(null);
  const nextId = useRef(1);
  const asked = useRef(new Set<string>());

  useEffect(() => {
    const el = scroller.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [msgs]);

  const send = (text: string) => {
    const question = text.trim();
    if (!question || busy) return;
    asked.current.add(question);
    setQ('');
    setBusy(true);
    const uid = nextId.current++;
    const bid = nextId.current++;
    const answer = ask(question);
    setMsgs((m) => [...m, { id: uid, role: 'user', text: question }, { id: bid, role: 'bot', text: answer.text, answer, shown: 0 }]);

    const words = answer.text.split(/(\s+)/);
    if (prefersReducedMotion()) {
      setMsgs((m) => m.map((x) => (x.id === bid ? { ...x, shown: words.length, done: true } : x)));
      setBusy(false);
      return;
    }
    // "retrieve" pause, then stream token by token
    let i = 0;
    const start = () => {
      const timer = setInterval(() => {
        i += 2;
        const done = i >= words.length;
        setMsgs((m) => m.map((x) => (x.id === bid ? { ...x, shown: Math.min(i, words.length), done } : x)));
        if (done) { clearInterval(timer); setBusy(false); }
      }, 28);
    };
    setTimeout(start, 520);
  };

  const remaining = suggestions.filter((s) => !asked.current.has(s)).slice(0, 4);

  return (
    <div className="ask">
      <div className="ask-log" ref={scroller} aria-live="polite">
        <AnimatePresence initial={false}>
          {msgs.map((m) => (
            <motion.div
              key={m.id}
              className={`msg ${m.role}`}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.25 }}
            >
              {m.role === 'bot' && m.answer && (
                <div className="trace-line mono">
                  <span className={`led${m.done ? '' : ' busy'}`} />
                  {m.shown === 0
                    ? 'retrieving…'
                    : m.answer.mode === 'intent'
                      ? `matched “${m.answer.intent}” · ${m.answer.sources.length} source${m.answer.sources.length === 1 ? '' : 's'} · ${m.answer.ms} ms`
                      : m.answer.mode === 'retrieval'
                        ? `bm25 · top ${m.answer.sources.length} of ${m.answer.trace.length} chunks · ${m.answer.ms} ms`
                        : `no confident match · refused to guess · ${m.answer.ms} ms`}
                </div>
              )}
              <p>
                {m.answer ? m.text.split(/(\s+)/).slice(0, m.shown).join('') : m.text}
                {m.answer && !m.done && m.shown! > 0 && <span className="caret" />}
              </p>
              {m.id === 0 && (
                <span className="index-line mono">
                  <span className="led" style={{ display: 'inline-block', marginRight: 8 }} />
                  index ready · {indexStats.chunks} chunks · bm25 + {indexStats.intents} curated answers
                </span>
              )}
              {m.answer && m.done && (
                <>
                  {m.answer.sources.length > 0 && (
                    <div className="cites">
                      {m.answer.sources.map((s, i) => (
                        <button key={s.id} type="button" className="cite" onClick={() => jump(s.id)}>
                          <b>{i + 1}</b>{s.label}
                        </button>
                      ))}
                    </div>
                  )}
                  {m.answer.trace.length > 0 && (
                    <button type="button" className="trace-toggle mono" aria-expanded={openTrace === m.id} onClick={() => setOpenTrace(openTrace === m.id ? null : m.id)}>
                      {openTrace === m.id ? '− hide' : '+ show'} retrieval trace
                    </button>
                  )}
                  {openTrace === m.id && (
                    <table className="trace mono">
                      <tbody>
                        {m.answer.trace.map((h) => (
                          <tr key={h.id}>
                            <td>{h.id}</td>
                            <td><span className="bar-s"><i style={{ width: `${Math.min(100, (h.score / m.answer!.trace[0].score) * 100)}%` }} /></span></td>
                            <td>{h.score.toFixed(2)}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  )}
                </>
              )}
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {remaining.length > 0 && (
        <div className="ask-sugs" role="group" aria-label="Suggested questions">
          {remaining.map((s) => (
            <button key={s} type="button" onClick={() => send(s)} disabled={busy}>{s}</button>
          ))}
        </div>
      )}

      <form className="ask-input" onSubmit={(e) => { e.preventDefault(); send(q); }}>
        <span className="mono prompt" aria-hidden="true">›</span>
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Ask about agents, RAG, BMW, availability…"
          aria-label="Ask a question about Prahas"
          maxLength={200}
        />
        <button type="submit" disabled={busy || !q.trim()} aria-label="Send question">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.2} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6" /></svg>
        </button>
      </form>
    </div>
  );
}
