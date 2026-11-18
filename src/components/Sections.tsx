import { about, experience, interests, profile, skills } from '../data/content';
import { copyEmail, mailto, printCV } from '../lib/ui';
import { interestIcon } from './Icons';
import { Reveal } from './Reveal';
import { SectionHead } from './SectionHead';
import { useState } from 'react';

const dot = (hue: string) => ({ ['--dot' as string]: `var(--c-${hue})` });

export function Experience() {
  return (
    <section id="experience" style={{ paddingTop: 24 }}>
      <div className="wrap">
        <SectionHead n="02" kicker="Experience" title="Where I've worked">
          Four internships, from LLM systems in BMW plants to real-time ML pipelines, roads and online shops.
        </SectionHead>
        <ol className="timeline">
          {experience.map((r) => (
            <Reveal as="li" key={r.id} id={r.id} className={r.current ? 'current' : ''}>
              <div className="when"><span className="mono">{r.when}</span><span className="place">{r.place}</span></div>
              <div className="body">
                <h3>{r.title}</h3>
                <div className="org">{r.org}</div>
                <ul>{r.points.map((pt) => <li key={pt}>{pt}</li>)}</ul>
                {r.stack && <ul className="stack">{r.stack.map((s) => <li key={s}>{s}</li>)}</ul>}
              </div>
            </Reveal>
          ))}
        </ol>
      </div>
    </section>
  );
}

export function Skills() {
  return (
    <section id="skills" style={{ paddingTop: 24 }}>
      <div className="wrap">
        <SectionHead n="03" kicker="Skills" title="What I work with">
          Grouped by what they're for. Each one shows up in the work above.
        </SectionHead>
        <div className="skills">
          {skills.map((s, i) => (
            <Reveal key={s.title} className="skill" style={dot(s.hue)} delay={i * 0.06}>
              <h3>{s.title}</h3>
              <ul>{s.items.map((it) => <li key={it}>{it}</li>)}</ul>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

export function About() {
  return (
    <section id="about" style={{ paddingTop: 24 }}>
      <div className="wrap">
        <SectionHead n="04" kicker="About" title="A bit about me" />
        <div className="about">
          <Reveal as="figure" className="portrait">
            <img src="/assets/prahas.jpg" alt="Portrait of Prahas Hegde in front of the BMW headquarters in Munich" width={390} height={376} loading="lazy" />
            <figcaption>Outside BMW headquarters, Munich</figcaption>
          </Reveal>
          <Reveal className="text">
            <p className="big">{about.lead}</p>
            {about.paragraphs.map((p) => <p key={p}>{p}</p>)}
            <p className="print-only">
              <b>Education:</b> MSc Artificial Intelligence, THWS (2025–) · BTech Electronics and Computer Engineering, Goa College of Engineering (2024).{' '}
              <b>Languages:</b> {about.languages}. <b>Interests:</b> {interests.map((i) => i.title.toLowerCase()).join(', ')}.
            </p>
            <div className="facts">
              <div><div className="k mono">Education</div><div className="v">{about.education.map((e) => <div key={e}>{e}</div>)}</div></div>
              <div><div className="k mono">Languages</div><div className="v">{about.languages}</div></div>
              <div><div className="k mono">Elsewhere</div><div className="v">
                <a href={profile.github}>GitHub</a> · <a href={profile.kaggle}>Kaggle</a> · <a href={profile.linkedin}>LinkedIn</a>
              </div></div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

export function Interests() {
  return (
    <section id="interests" style={{ paddingTop: 24 }}>
      <div className="wrap">
        <SectionHead n="05" kicker="Beyond work" title="Off the clock">
          The things that keep me curious, patient and moving, on and off the trail.
        </SectionHead>
        <div className="interests">
          {interests.map((it, i) => {
            const Icon = interestIcon[it.icon];
            return (
              <Reveal key={it.id} className={`interest${it.photo ? ' has-photo' : ''}`} style={dot(it.hue)} delay={i * 0.07}>
                {it.photo && <img src={it.photo} alt="" loading="lazy" />}
                <div className="art" aria-hidden="true"><Icon /></div>
                <div className="body">
                  <span className="chip-ic"><Icon /></span>
                  <h3>{it.title}</h3>
                  <p>{it.line}</p>
                  {it.link && <div className="links"><a href={it.link.href}>{it.link.label}</a></div>}
                </div>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export function Contact() {
  const [copied, setCopied] = useState(false);
  return (
    <footer className="contact" id="contact">
      <div className="wrap">
        <span className="mono">06 · Contact</span>
        <Reveal>
          <h2>Let's build something you can trust.</h2>
        </Reveal>
        <p>I'm looking for 2027 internships and working student roles in AI and ML, especially LLM systems, agents, evals and graph ML. Email is the fastest way to reach me.</p>
        <div className="row">
          <a className="email" href={mailto}>{profile.email}</a>
          <button className="copy" type="button" onClick={async () => { if (await copyEmail()) { setCopied(true); setTimeout(() => setCopied(false), 2000); } }}>
            {copied ? 'Copied' : 'Copy email'}
          </button>
        </div>
        <div className="cta-row">
          <a className="btn primary" href={profile.linkedin}>Connect on LinkedIn</a>
          <button className="btn" type="button" onClick={printCV}>Save CV as PDF</button>
        </div>
        <div className="foot">
          <div style={{ display: 'flex', gap: 22, flexWrap: 'wrap' }}>
            <a href={profile.github}>GitHub</a>
            <a href={profile.linkedin}>LinkedIn</a>
            <a href={profile.kaggle}>Kaggle</a>
          </div>
          <div>© {new Date().getFullYear()} Prahas Hegde · Built with React, TypeScript, Framer Motion and D3</div>
        </div>
      </div>
    </footer>
  );
}
