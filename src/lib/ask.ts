// A tiny, honest retrieval engine over this site's own content.
// No LLM: curated answers for common questions, BM25 retrieval for everything else,
// and every answer carries the sections it came from.
import { about, experience, featured, glance, interests, more, profile, skills } from '../data/content';
import type { ReactNode } from 'react';

export type Source = { id: string; label: string };
export type Hit = { id: string; label: string; score: number };
export type Answer = { text: string; sources: Source[]; trace: Hit[]; ms: number; mode: 'intent' | 'retrieval' | 'none'; intent?: string };

const STOP = new Set('a an the is are was were be to of in on for and or with at by from about what whats which who how does do did has have he his him prahas tell me you your can could i it its this that any some there their them as into more'.split(' '));
const stem = (w: string) => w.replace(/(ing|ers|er|es|s)$/,'').replace(/'s$/,'');
export const tokenize = (s: string) =>
  s.toLowerCase().replace(/[^a-z0-9+#.\s]/g, ' ').split(/\s+/).filter((w) => w && !STOP.has(w)).map(stem).filter((w) => w.length > 1);

const plain = (n: ReactNode): string => (typeof n === 'string' ? n : '');

// ---- chunks: every project, role, skill group and section becomes a retrievable chunk ----
type Chunk = { id: string; label: string; text: string; tokens: string[] };
const chunks: Chunk[] = [
  ...[...featured, ...more].map((p) => ({
    id: p.id, label: p.title,
    text: [p.title, p.kicker, p.what ?? '', ...p.body.map(plain), ...(p.stack ?? []), p.tags.join(' '),
      p.tags.includes('agents') ? 'agent agentic tool calling' : '', p.tags.includes('rag') ? 'rag retrieval search vector' : '',
      p.tags.includes('eval') ? 'evaluation benchmark llm training' : '', p.tags.includes('cv') ? 'computer vision image video detection' : ''].join(' '),
  })),
  ...experience.map((r) => ({ id: r.id, label: `${r.org}`, text: [r.title, r.org, r.when, r.place, ...r.points, ...(r.stack ?? []), 'experience job work internship role'].join(' ') })),
  { id: 'skills', label: 'Skills', text: skills.map((s) => `${s.title} ${s.items.join(' ')}`).join(' ') + ' stack tools languages frameworks technologies' },
  { id: 'about', label: 'About', text: [about.lead, ...about.paragraphs, about.education.join(' '), about.languages, 'education degree university background goa germany'].join(' ') },
  { id: 'interests', label: 'Off the clock', text: interests.map((i) => `${i.title} ${i.line}`).join(' ') + ' hobbies free time fun outside work' },
  { id: 'contact', label: 'Contact', text: `contact email hire reach ${profile.status} ${glance.map((g) => `${g.k} ${g.v} ${g.s}`).join(' ')}` },
].map((c) => ({ ...c, tokens: tokenize(c.text) }));

// ---- BM25 ----
const N = chunks.length;
const avgdl = chunks.reduce((a, c) => a + c.tokens.length, 0) / N;
const df = new Map<string, number>();
chunks.forEach((c) => new Set(c.tokens).forEach((t) => df.set(t, (df.get(t) ?? 0) + 1)));
function bm25(q: string[]): Hit[] {
  const k1 = 1.4, b = 0.75;
  return chunks
    .map((c) => {
      let s = 0;
      for (const t of new Set(q)) {
        const f = c.tokens.filter((x) => x === t).length;
        if (!f) continue;
        const idf = Math.log(1 + (N - (df.get(t) ?? 0) + 0.5) / ((df.get(t) ?? 0) + 0.5));
        s += idf * ((f * (k1 + 1)) / (f + k1 * (1 - b + (b * c.tokens.length) / avgdl)));
      }
      return { id: c.id, label: c.label, score: +s.toFixed(2) };
    })
    .filter((h) => h.score > 0)
    .sort((a, b) => b.score - a.score);
}

// ---- curated answers for the questions recruiters actually ask ----
type Intent = { name: string; keys: string[]; text: string; sources: Source[] };
const S = (id: string, label: string): Source => ({ id, label });
const intents: Intent[] = [
  { name: 'availability', keys: ['available', 'availability', 'hire', 'hiring', 'open to', 'internship', 'working student', 'job', 'start', 'looking for', 'when'],
    text: `Yes. Prahas is open to 2027 internships and working student roles in AI and ML, especially LLM systems, agents, evals and graph ML. He's based in Munich and is currently an AI Intern at BMW Group. The fastest way to reach him is email: ${profile.email}.`,
    sources: [S('contact', 'Contact'), S('x-bmw', 'BMW Group')] },
  { name: 'agents', keys: ['agent', 'agentic', 'tool calling', 'tool use', 'autonomous', 'coding agent'],
    text: 'Four agent systems. PatchPilot plans a coding task, lets an agent write and test the code, then re-runs pytest itself before it claims success. Pushback checks unfair letters claim by claim against current law, with a citation on every verdict. MoneyWise is a tool-calling finance coach whose numbers always come from deterministic pandas tools, never the model. RivalSense does cited market research.',
    sources: [S('p-patchpilot', 'PatchPilot'), S('p-pushback', 'Pushback'), S('p-moneywise', 'MoneyWise'), S('p-rivalsense', 'RivalSense')] },
  { name: 'rag', keys: ['rag', 'retrieval', 'vector', 'search', 'embedding', 'knowledge base', 'qdrant', 'faiss'],
    text: "RAG is his core. Permission-aware RAG filters retrieval by the caller's identity before anything reaches the LLM, with a hash-chained audit log. WikiPilot answers questions from Wikipedia as it stood on any date, fusing vector, full-text and time-travel SQL over 862,076 article versions. At BMW he builds LLM and RAG systems for production plants, and the RAG Cost Router adds semantic caching and model routing.",
    sources: [S('p-permrag', 'Permission-aware RAG'), S('p-wikipilot', 'WikiPilot'), S('x-bmw', 'BMW Group'), S('p-costrouter', 'Cost Router')] },
  { name: 'evals', keys: ['eval', 'evaluation', 'benchmark', 'tiebreak', 'grpo', 'post-training', 'fine-tun', 'finetun', 'rlhf', 'reinforcement', 'lora', 'training'],
    text: 'Tiebreak is an eval he designed: 19 hand-derived tasks with a deterministic grader, run on 8 open-weight models. Large models scored 43% from memory and 91% with the rule text, and 93% of wrong answers matched the outdated rules exactly. For post-training, his team used GRPO and LoRA on Gemma-2 2B and reached 55% accuracy against a 25% random baseline.',
    sources: [S('p-tiebreak', 'Tiebreak'), S('p-grpo', 'Gemma GRPO')] },
  { name: 'best project', keys: ['best', 'proud', 'favourite', 'favorite', 'standout', 'impressive', 'strongest', 'flagship', 'top project'],
    text: "Start with Tiebreak. He found that every frontier open model applies FIFA's outdated tie-break rules, proved it with a deterministic grader instead of an LLM judge, and diagnosed exactly which wrong procedure each model followed. It shows the habit that runs through all his work: measure it, don't assume it.",
    sources: [S('p-tiebreak', 'Tiebreak')] },
  { name: 'experience', keys: ['bmw', 'experience', 'work history', 'worked', 'internships', 'career', 'company', 'companies', 'employer', 'current role', 'current job'],
    text: 'Four internships. Since March 2026 he has been an AI Intern at BMW Group in Munich, building knowledge graphs and LLM/RAG systems for production plants on Palantir Foundry and enterprise LLM APIs. Before that: ML pipelines at EI Systems, real-time lane detection at NEXT24Tech, and an OpenAI-powered support chatbot at Persistent Systems.',
    sources: [S('x-bmw', 'BMW Group'), S('x-ei', 'EI Systems'), S('x-next24', 'NEXT24Tech'), S('x-persistent', 'Persistent Systems')] },
  { name: 'stack', keys: ['stack', 'skill', 'tech', 'tools', 'language', 'python', 'pytorch', 'framework', 'technologies', 'know'],
    text: 'Python first, plus SQL and C++. For models: PyTorch, TensorFlow, Hugging Face, LoRA and GRPO. For LLM systems: tool-calling agents, RAG with Qdrant or FAISS, Claude, Gemini, OpenAI and open-weight models like Qwen, Llama and Nemotron via Ollama or Groq. To ship: FastAPI, React and TypeScript, Docker, AWS and Palantir Foundry.',
    sources: [S('skills', 'Skills')] },
  { name: 'education', keys: ['education', 'study', 'studying', 'degree', 'university', 'msc', 'master', 'bachelor', 'thws', 'college'],
    text: 'He is doing an MSc in Artificial Intelligence at THWS (since 2025), after a BTech in Electronics and Computer Engineering from Goa College of Engineering (2024).',
    sources: [S('about', 'About')] },
  { name: 'location & languages', keys: ['german', 'speak', 'languages', 'english', 'location', 'based', 'where', 'munich', 'relocate', 'visa'],
    text: `He is based in Munich, Germany. He speaks English (C1), German (A2–B1), Hindi, Marathi and Konkani. For anything about relocation or work authorisation, ask him directly at ${profile.email}.`,
    sources: [S('about', 'About'), S('contact', 'Contact')] },
  { name: 'computer vision', keys: ['vision', 'computer vision', 'image', 'video', 'detection', 'tracking', 'opencv', 'camera'],
    text: 'Computer vision is his long-running second track: a stereo-vision smart lock that rejects photos and screens, real-time drowsiness detection, pose tracking at 30+ FPS on a CPU, lane detection for autonomous driving, football player tracking and small-object detection with SAHI.',
    sources: [S('p-secure', 'Secure AI lock'), S('p-drowsy', 'Drowsiness'), S('p-trainer', 'AI trainer'), S('p-lane', 'Lane detection')] },
  { name: 'interests', keys: ['hobby', 'hobbies', 'fun', 'free time', 'outside work', 'interest', 'hike', 'hiking', 'run', 'running', 'travel', 'football', 'blog', 'weekend'],
    text: 'Off the clock he hikes in the Alps, runs, plays and watches football, travels, and writes about his trips on his travel blog.',
    sources: [S('interests', 'Off the clock')] },
  { name: 'why hire', keys: ['why', 'should we hire', 'strength', 'different', 'unique', 'stand out', 'value', 'pitch', 'summary', 'who is'],
    text: "He builds AI you can check. His systems show their evidence: MoneyWise computes numbers with tools, Pushback cites every claim and strips invented citations, PatchPilot verifies code with independent tests, and Tiebreak grades models deterministically. Pair that with production experience at BMW and he's an engineer who ships LLM systems that hold up on real data.",
    sources: [S('work', 'Selected work'), S('p-tiebreak', 'Tiebreak'), S('x-bmw', 'BMW Group')] },
  { name: 'contact', keys: ['contact', 'email', 'reach', 'linkedin', 'github', 'cv', 'resume', 'phone', 'talk', 'call'],
    text: `Email is fastest: ${profile.email}. He's also on LinkedIn and GitHub (PrahasHegde). You can save his CV as a PDF with the "Save CV as PDF" button on this page.`,
    sources: [S('contact', 'Contact')] },
];

const intentTokens = intents.map((it) => it.keys.map((k) => ({ phrase: k, toks: tokenize(k) })));

// Everything the engine "knows": words in any chunk or curated answer.
const vocab = new Set<string>([...chunks.flatMap((c) => c.tokens), ...intents.flatMap((it) => tokenize(it.text + ' ' + it.keys.join(' ')))]);
// Question filler that shouldn't count as an unknown topic.
const GENERIC = new Set(['tell', 'know', 'built', 'build', 'use', 'used', 'using', 'work', 'worked', 'project', 'good', 'much', 'many', 'year', 'ever', 'like', 'please', 'show', 'give', 'him', 'she', 'they', 'we', 'our', 'kind', 'type', 'thing', 'anything', 'something', 'experience', 'expert', 'familiar', 'level', 'skill', 'skilled'].map(stem));

export function ask(question: string): Answer {
  const t0 = performance.now();
  const q = question.toLowerCase();
  const qt = tokenize(question);
  const content = qt.filter((t) => !GENERIC.has(t)); // the words that carry the topic
  const trace = bm25(content).slice(0, 4);

  // curated-answer match; remember which words it consumed
  let best = -1, bestScore = 0, bestUsed = new Set<string>();
  intentTokens.forEach((keys, i) => {
    let s = 0;
    const used = new Set<string>();
    for (const k of keys) {
      if (k.toks.length > 1) {
        if (q.includes(k.phrase)) { s += 2; k.toks.forEach((t) => used.add(t)); }
      } else {
        const hit = qt.find((w) => k.toks.some((t) => w === t || (t.length > 4 && w.startsWith(t))));
        if (hit) { s += 1; used.add(hit); }
      }
    }
    if (s > bestScore) { bestScore = s; best = i; bestUsed = used; }
  });
  // what retrieval finds from the words the curated match did NOT explain
  const rest = bm25(content.filter((t) => !bestUsed.has(t)));

  const ms = () => +(performance.now() - t0).toFixed(1);

  // Guardrail 1: the question's topic appears nowhere on this site → say so, don't imply it.
  const unknown = question
    .replace(/[^A-Za-z0-9+#.\s]/g, ' ')
    .split(/\s+/)
    .filter((w) => w.length > 2 && !STOP.has(w.toLowerCase()) && !GENERIC.has(stem(w.toLowerCase())) && !vocab.has(stem(w.toLowerCase())));
  const strongRetrieval = (trace[0]?.score ?? 0) >= 2;
  if (unknown.length && bestScore <= 1 && !strongRetrieval) {
    const term = unknown.slice(0, 2).join(' ');
    return {
      text: `"${term}" isn't mentioned anywhere on this site, so I won't claim it either way. Ask Prahas directly at ${profile.email}, or ask me about his agents, RAG, evals or work at BMW.`,
      sources: [S('contact', 'Contact')], trace, ms: ms(), mode: 'none',
    };
  }

  // Guardrail 2: a one-word curated match must not override a specific project the other words point to.
  if (best >= 0 && bestScore <= 1 && rest[0] && rest[0].score >= 2 && !intents[best].sources.some((s) => s.id === rest[0].id)) {
    best = -1;
  }

  if (best >= 0) {
    const it = intents[best];
    return { text: it.text, sources: it.sources, trace, ms: ms(), mode: 'intent', intent: it.name };
  }
  if (trace.length && trace[0].score > 1.2) {
    const top = trace.slice(0, 2).filter((h) => h.score >= trace[0].score * 0.6).map((h) => chunks.find((c) => c.id === h.id)!);
    const lines = top.map((c) => {
      const p = [...featured, ...more].find((x) => x.id === c.id);
      if (p) return `${p.title}: ${p.what ?? plain(p.body[0]).split('. ')[0] + '.'}`;
      const r = experience.find((x) => x.id === c.id);
      if (r) return `${r.title} at ${r.org} (${r.when}): ${r.points[0]}`;
      return `${c.label}: ${c.text.split('. ')[0]}.`;
    });
    return { text: `The closest matches on this site: ${lines.join(' ')}`, sources: top.map((c) => ({ id: c.id, label: c.label })), trace, ms: ms(), mode: 'retrieval' };
  }
  return {
    text: "I can only answer from what's on this site, and I couldn't find that here. Rather than guess, try asking about his agents, RAG work, evals, experience at BMW or availability.",
    sources: [], trace, ms: ms(), mode: 'none',
  };
}

export const suggestions = [
  'Is he available?',
  'What has he built with agents?',
  "What's his best project?",
  'Tell me about BMW',
  "What's his stack?",
  'What does he do for fun?',
];

export const indexStats = { chunks: chunks.length, intents: intents.length };
