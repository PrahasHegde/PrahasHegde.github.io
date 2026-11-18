import { motion } from 'framer-motion';
import { glance, profile } from '../data/content';
import { mailto, printCV } from '../lib/ui';
import { Download, GitHub, LinkedIn, Mail } from './Icons';
import { WorkGraph } from './WorkGraph';

const rise = (i: number) => ({
  initial: { opacity: 0, y: 18 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.7, ease: [0.2, 0.8, 0.2, 1], delay: 0.06 * i },
});

export function Hero() {
  return (
    <>
      <header className="hero" id="top">
        <div className="wrap">
          <div>
            <motion.div className="status reveal" {...rise(0)}>
              <span className="av"><img src="/assets/prahas.jpg" alt="" width={30} height={30} /><i aria-hidden="true" /></span>
              {profile.status}
            </motion.div>
            <motion.p className="kicker mono reveal" {...rise(1)}>{profile.role} · {profile.city}</motion.p>
            <motion.h1 className="reveal" {...rise(2)}>{profile.name}</motion.h1>
            <motion.p className="lede reveal" {...rise(3)}>
              I build AI systems <em>you can check</em>: agents that cite their sources, RAG that respects permissions, and evals that catch what models get wrong.
            </motion.p>
            <motion.p className="sub reveal" {...rise(4)}>
              AI Intern at BMW Group, building knowledge graphs and LLM systems for production plants. MSc Artificial Intelligence student at THWS.
            </motion.p>
            <p className="print-only print-contact">
              {profile.email} · {profile.site} · github.com/PrahasHegde · linkedin.com/in/prahaas-baburai-hegdae-4a2464255 · Munich, Germany
            </p>
            <motion.div className="actions reveal" {...rise(5)}>
              <a className="btn primary" href={mailto}><Mail />Email me</a>
              <button className="btn" type="button" onClick={printCV}><Download />Save CV as PDF</button>
              <a className="btn sq" href={profile.github} aria-label="GitHub"><GitHub /></a>
              <a className="btn sq" href={profile.linkedin} aria-label="LinkedIn"><LinkedIn /></a>
            </motion.div>
          </div>
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.8, delay: 0.2 }}>
            <WorkGraph />
          </motion.div>
        </div>
      </header>

      <div className="glance" aria-label="At a glance">
        <div className="wrap">
          {glance.map((g) => (
            <div className="cell" key={g.k}>
              <div className="k mono">{g.k}</div>
              <div className="v">{g.v}<small>{g.s}</small></div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
