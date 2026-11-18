// All site content lives here. Edit this file to update the portfolio;
// components only handle layout and behaviour.
import type { ReactNode } from 'react';

export type Tag = 'agents' | 'rag' | 'eval' | 'cv';
export type Hue = 'agents' | 'rag' | 'eval' | 'cv' | 'data';

export const profile = {
  name: 'Prahas Hegde',
  role: 'AI engineer',
  city: 'Munich',
  email: 'hegde.prahas@gmail.com',
  site: 'prahashegde.github.io',
  status: 'Open to 2027 internships and working student roles',
  github: 'https://github.com/PrahasHegde',
  linkedin: 'https://www.linkedin.com/in/prahaas-baburai-hegdae-4a2464255/',
  kaggle: 'https://www.kaggle.com/prahashegde',
};

export const glance = [
  { k: 'Now', v: 'AI Intern, BMW Group', s: 'Knowledge graphs, LLM and RAG' },
  { k: 'Looking for', v: '2027 AI/ML internships', s: 'and working student roles' },
  { k: 'Studying', v: 'MSc Artificial Intelligence', s: 'THWS, since 2025' },
  { k: 'Based in', v: 'Munich, Germany', s: 'English C1 · German A2–B1' },
];

export type Link = { label: string; href: string };

export type Project = {
  id: string;
  title: string;
  kicker: string;
  when: string;
  hue: Hue;
  tags: Tag[];
  what?: string;
  body: ReactNode[];
  metrics?: { v: string; l: string }[];
  stack?: string[];
  links?: Link[];
  note?: string;
};

export const featured: Project[] = [
  {
    id: 'p-tiebreak',
    title: 'Tiebreak',
    kicker: 'LLM evaluation',
    when: 'Nov 2026',
    hue: 'eval',
    tags: ['eval'],
    what: 'An eval that caught every frontier open model applying outdated rules.',
    body: [
      'FIFA changed its World Cup group tie-break rules for 2026. I turned Article 13 of the regulations into 19 tasks with exact, hand-derived answers and a deterministic grader (no LLM judge), then ran 8 open-weight models through it, with and without the rule text.',
      <>The grader also diagnoses <em>which</em> wrong procedure a model followed. 93% of wrong closed-book answers were exactly the ranking the old pre-2026 rules produce: the gap is stale knowledge, not reasoning.</>,
    ],
    stack: ['Eval design', 'Deterministic grading', 'Failure diagnosis', 'Kimi K3', 'Qwen 3.5', 'DeepSeek V4', 'Nemotron 3'],
    links: [
      { label: 'Code and results', href: 'https://github.com/PrahasHegde/Micro1_Eval' },
      { label: '4-minute walkthrough', href: 'https://youtu.be/_jOE2jT77CU' },
    ],
  },
  {
    id: 'p-patchpilot',
    title: 'PatchPilot',
    kicker: 'Coding agents',
    when: '2026',
    hue: 'agents',
    tags: ['agents'],
    what: 'Plain-language task in, planned and independently tested Python project out.',
    body: [
      'A planner model structures the work, a coding agent writes files and runs tests through a tool loop, and the backend re-runs pytest itself before it reports success. Failures go back to the agent within a bounded turn budget. Imported projects are sandboxed per run, with ZIP checks against unsafe paths and symlinks.',
    ],
    stack: ['Nemotron 3 Ultra + Nano', 'Tool calling', 'FastAPI', 'SSE', 'React + TS', 'Tavily'],
    links: [{ label: 'View code', href: 'https://github.com/PrahasHegde/Patch_Pilot' }],
  },
  {
    id: 'p-pushback',
    title: 'Pushback',
    kicker: 'Agentic research',
    when: 'Junction 2026',
    hue: 'agents',
    tags: ['agents', 'rag'],
    what: "An AI advocate that checks unfair letters claim by claim against today's law.",
    body: [
      'Paste or photograph a rent increase, a flight-delay refusal or a surprise bill. Pushback highlights every claim, researches current law and official sources live with Exa, stamps each claim with a verdict, and drafts a reply that quotes the rule. Every statement carries a citation, and any citation the model invents is removed automatically.',
    ],
    stack: ['Exa search', 'Gemini vision', 'Citation grounding', 'Human-in-the-loop'],
    links: [{ label: 'View code and demo', href: 'https://github.com/PrahasHegde/Pushback_junction_2026' }],
  },
  {
    id: 'p-permrag',
    title: 'Permission-aware RAG',
    kicker: 'Enterprise RAG',
    when: '2026',
    hue: 'rag',
    tags: ['rag'],
    what: 'Multi-tenant retrieval where unauthorized text never reaches the model.',
    body: [
      'Every chunk carries access metadata, and retrieval is filtered by the caller\'s identity before anything reaches the LLM. An append-only, hash-chained audit log records what was retrieved and for whom. The UI shows the full retrieval trace, a documents-by-users access matrix and an "ask as every user" comparison. Runs fully on open-weight models.',
    ],
    stack: ['Qdrant', 'Ollama', 'Qwen', 'nomic-embed', 'FastAPI', 'SQLite audit log', 'React + TS'],
    links: [{ label: 'View code', href: 'https://github.com/PrahasHegde/Permission_RAG' }],
  },
  {
    id: 'p-grpo',
    title: 'Teaching Gemma to show its work',
    kicker: 'LLM post-training',
    when: 'Kaggle · Jan 2026',
    hue: 'eval',
    tags: ['eval'],
    what: 'Post-training a 2B model with GRPO to reason before it answers.',
    body: [
      'For the Google Tunix hackathon, our team of four post-trained Gemma-2 2B with LoRA and Group Relative Policy Optimization on ARC science questions, with reward functions that score format, visible reasoning and the correct answer.',
    ],
    metrics: [
      { v: '55%', l: 'accuracy, vs. 25% random baseline' },
      { v: '80%', l: 'of answers in the required reasoning format' },
    ],
    stack: ['Gemma-2 2B', 'GRPO', 'LoRA', 'Google Tunix', 'Reward design'],
    links: [{ label: 'Read the write-up', href: 'https://www.kaggle.com/prahashegde/writeups' }],
  },
];

export const tiebreakChart = {
  title: 'Accuracy of 6 large open models',
  note: 'Pooled over 304 responses per condition',
  bars: [
    { label: 'From memory', value: 43, good: false },
    { label: 'With the rule text', value: 91, good: true },
  ],
  foot: <>On the 8 hardest tasks: <b>0 of 128</b> correct from memory, <b>119 of 128</b> with the rules. 684 graded responses in total.</>,
};

const gh = (repo: string) => `https://github.com/PrahasHegde/${repo}`;

export const more: Project[] = [
  { id: 'p-wikipilot', title: 'WikiPilot', kicker: 'Time-travel RAG', when: 'Junction 2026', hue: 'rag', tags: ['rag'],
    body: ['Ask Wikipedia a question as it stood on any day since 2003. Vector search, full-text match and system-versioned history fused in one MariaDB query over 862,076 article versions, plus sentence-level blame and edit-war detection.'],
    links: [{ label: 'View code', href: gh('wiki_pilot_junction_2026') }] },
  { id: 'p-moneywise', title: 'MoneyWise', kicker: 'Tool-calling agent', when: 'Junction 2026', hue: 'agents', tags: ['agents'],
    body: ['A finance coach that chats with your own transactions. Every number comes from deterministic pandas tools, never the model, and each reply shows the data it checked. Works in Finnish, Swedish and English, with Claude or Gemini.'],
    links: [{ label: 'View code', href: gh('MoneyWise_junction_2026') }, { label: 'Watch demo', href: 'https://youtu.be/KpjejMlj3NM' }] },
  { id: 'p-careerforge', title: 'CareerForge AI', kicker: 'RAG platform', when: 'THWS · team of 4', hue: 'rag', tags: ['rag'],
    body: ['Reads a resume against a job description, scores the semantic match with embeddings, draws a skill-gap graph and runs an audio mock interview that grades spoken answers with Whisper.'],
    links: [{ label: 'View code', href: gh('CareerForge_AI') }] },
  { id: 'p-rivalsense', title: 'RivalSense', kicker: 'Web intelligence', when: 'Junction 2026', hue: 'rag', tags: ['rag', 'agents'],
    body: ['Market and competitor research with cited answers. Extracts and compares product listings from URLs, keeping uncertain product matches apart instead of presenting unsupported comparisons.'],
    links: [{ label: 'View code', href: gh('Rivalsense') }] },
  { id: 'p-costrouter', title: 'RAG Cost Router', kicker: 'LLM infra', when: '2026', hue: 'rag', tags: ['rag', 'eval'],
    body: ['Cost-aware RAG inference: semantic response caching, small/large model routing and cost tracking, with P50/P95 latency and cache-hit metrics in Prometheus and Grafana. Ships with Docker.'],
    links: [{ label: 'View code', href: gh('Cost_Router') }] },
  { id: 'p-lessons', title: 'BMW Lessons Learned', kicker: 'LLM platform', when: 'BMW Group', hue: 'data', tags: ['rag'],
    body: ['Turns manufacturing quality-issue records into lessons learned and preventive actions, and searches for fixes across past incidents, a RAG knowledge base and the web.'],
    links: [{ label: 'View code', href: gh('BMW_lesson_learned_LLM_project') }] },
  { id: 'p-kg', title: 'Knowledge graphs for plants', kicker: 'Knowledge graphs', when: 'BMW Group', hue: 'data', tags: ['rag'],
    body: ['Graphs that connect multi-source automotive data into entities and relationships, with LLM and RAG systems on top to answer real questions from production.'],
    note: 'Internal work' },
  { id: 'p-secure', title: 'Secure AI smart lock', kicker: '3D vision', when: 'CAIRO.thws expo', hue: 'cv', tags: ['cv'],
    body: ["Uses stereo vision to check real depth in real time, so a printed photo or a screen can't unlock it. Demonstrated live at the CAIRO.thws expo."],
    note: 'Stereo vision · deep learning · edge' },
  { id: 'p-drowsy', title: 'Driver drowsiness detection', kicker: 'Real-time CNN', when: 'PyTorch', hue: 'cv', tags: ['cv'],
    body: ["Classifies open eyes, closed eyes and yawns from a webcam in real time, with temporal smoothing so a blink doesn't trigger an alarm."],
    links: [{ label: 'View code', href: gh('Driver-Drowsiness-Detection') }] },
  { id: 'p-trainer', title: 'AI personal trainer', kicker: 'Pose estimation', when: 'MediaPipe', hue: 'cv', tags: ['cv'],
    body: ['Tracks 33 body landmarks at 30+ FPS on a CPU, measures the elbow angle and counts reps with a state machine and live form feedback.'],
    links: [{ label: 'View code', href: gh('AI-Personal-Trainer-Bicep-Curl-Counter') }] },
  { id: 'p-lane', title: 'Real-time lane detection', kicker: 'Autonomous driving', when: 'NEXT24Tech', hue: 'cv', tags: ['cv'],
    body: ['Edge detection, region-of-interest extraction and a CNN trained on custom road data, built during my internship.'],
    note: 'Internship project, 2024' },
  { id: 'p-football', title: 'Football player tracking', kicker: 'Detection + tracking', when: 'Sports', hue: 'cv', tags: ['cv'],
    body: ['Detects and tracks players across match video so analysts and coaches can study movement and strategy.'],
    links: [{ label: 'View code', href: gh('Football_player_detection_tracking') }] },
  { id: 'p-sahi', title: 'Small-object detection', kicker: 'Small objects', when: 'SAHI', hue: 'cv', tags: ['cv'],
    body: ['Slicing-aided hyper inference to find objects that standard detectors miss in high-resolution images.'],
    links: [{ label: 'View code', href: gh('smallObjectDetection-using-SAHI') }] },
  { id: 'p-pdf', title: 'Chat with your documents', kicker: 'RAG', when: 'Groq · FAISS', hue: 'rag', tags: ['rag'],
    body: ['Upload PDFs and ask questions in plain language. Hugging Face embeddings and FAISS find the right passages, and an LLM answers from them.'],
    links: [{ label: 'View code', href: gh('Chat_with_Your_Data') }] },
];

export const filters: { id: 'all' | Tag; label: string }[] = [
  { id: 'all', label: 'All' },
  { id: 'agents', label: 'Agents' },
  { id: 'rag', label: 'RAG & retrieval' },
  { id: 'eval', label: 'Evals & post-training' },
  { id: 'cv', label: 'Computer vision' },
];

export type Role = { id: string; when: string; place: string; title: string; org: string; points: string[]; stack?: string[]; current?: boolean };

export const experience: Role[] = [
  { id: 'x-bmw', when: 'Mar 2026 – present', place: 'Munich, Germany', title: 'Artificial Intelligence Intern', org: 'BMW Group', current: true,
    points: [
      'Build knowledge graphs that connect complex, multi-source automotive data into entities and relationships.',
      'Develop and optimize LLM and RAG systems that solve real production problems in BMW plants.',
      'Run end-to-end AI pipelines on enterprise LLM APIs, Palantir Foundry and cloud infrastructure.',
    ],
    stack: ['Knowledge graphs', 'RAG', 'Enterprise LLM APIs', 'Palantir Foundry'] },
  { id: 'x-ei', when: 'Aug 2024 – Dec 2024', place: 'India', title: 'Machine Learning Intern', org: 'EI Systems',
    points: [
      'Designed ML pipelines for real-time data processing, training and deployment.',
      'Built predictive models with feature engineering to improve automation efficiency and accuracy.',
    ] },
  { id: 'x-next24', when: 'Apr 2024 – Jun 2024', place: 'India', title: 'Machine Learning Engineer Intern', org: 'NEXT24Tech Technologies',
    points: ['Built a real-time road lane detection model on custom datasets, from preprocessing to evaluation.'] },
  { id: 'x-persistent', when: 'Jul 2023 – Oct 2023', place: 'India', title: 'Software and AI Intern', org: 'Persistent Systems',
    points: ['Integrated OpenAI APIs into an e-commerce platform and built a real-time customer-support chatbot.'] },
];

export const skills: { title: string; hue: Hue; items: string[] }[] = [
  { title: 'LLM systems', hue: 'agents', items: ['Tool-calling agents', 'RAG and hybrid retrieval', 'Evals and deterministic graders', 'LoRA and GRPO post-training', 'Knowledge graphs', 'Prompt and reward design'] },
  { title: 'Models and serving', hue: 'rag', items: ['Claude, Gemini, OpenAI APIs', 'Qwen, Llama, Gemma, Nemotron', 'Ollama, Groq, OpenRouter', 'Qdrant, FAISS, embeddings', 'LangChain, Hugging Face', 'Prometheus and Grafana'] },
  { title: 'Machine learning', hue: 'cv', items: ['PyTorch', 'TensorFlow and Keras', 'scikit-learn', 'CNNs, detection and tracking', 'OpenCV and MediaPipe', 'Whisper (speech)'] },
  { title: 'Engineering', hue: 'eval', items: ['Python, SQL, C++', 'FastAPI, SSE', 'React and TypeScript', 'Docker, AWS, Linux', 'Palantir Foundry', 'Git and CI/CD'] },
];

export const about = {
  lead: "Most of the world's useful data sits in tables linked by keys. I want to build AI that understands those links, and can prove what it says.",
  paragraphs: [
    'I grew up in Goa, studied Electronics and Computer Engineering at Goa College of Engineering, and moved to Germany in 2025 for an MSc in Artificial Intelligence at THWS. At BMW I see every day how much signal hides in the relationships between records, and how flat, single-table models miss it.',
    "That's why I'm drawn to knowledge graphs, retrieval and post-training methods like GRPO that make models more useful and more honest. When I build, I care about the unglamorous parts that make AI trustworthy: deterministic tools for the numbers, citations for the claims, tests for the code and evals for the model.",
  ],
  education: ['MSc AI, THWS (2025–)', 'BTech ECE, Goa College of Engineering (2024)'],
  languages: 'English (C1), German (A2–B1), Hindi, Marathi, Konkani',
};

// Interests. To add a photo, put an image in public/interests/ and set `photo`,
// e.g. photo: '/interests/hiking.jpg'; `pos` is the CSS object-position for the crop.
// Without a photo the card shows an illustration.
export type Interest = {
  id: string; title: string; line: string; icon: 'mountain' | 'run' | 'globe' | 'pen' | 'ball'; hue: Hue;
  photo?: string; pos?: string; alt?: string; link?: Link;
  /** Photo credit for images that are not Prahas's own (required by CC licences). */
  credit?: { text: string; href: string };
};

export const interests: Interest[] = [
  { id: 'hiking', title: 'Hiking', icon: 'mountain', hue: 'cv',
    photo: '/interests/hiking-summit.jpg', pos: '50% 58%', alt: 'Prahas standing on a rocky summit above forested valleys and Alpine peaks',
    line: 'Long trails, early starts and no notifications. The best place I know to think a problem through.' },
  { id: 'travel', title: 'Travelling', icon: 'globe', hue: 'rag',
    photo: '/interests/paris-eiffel.jpg', pos: '50% 40%', alt: 'The Eiffel Tower lit up at night, seen down a Paris street',
    line: 'From Goa to Germany and onward. New cities, new food, and a lot of trains.' },
  { id: 'running', title: 'Running', icon: 'run', hue: 'eval',
    photo: '/interests/running-trail.jpg', pos: '58% 55%', alt: 'A trail runner on a grassy mountain path above a wide valley',
    credit: { text: 'Photo: Wikimedia Commons, public domain', href: 'https://commons.wikimedia.org/wiki/File:Runner-1-.jpg' },
    line: 'Steady kilometres before the day starts. Consistency beats intensity, in training and in engineering.' },
  { id: 'football', title: 'Football', icon: 'ball', hue: 'data',
    photo: '/interests/football-messi.jpg', pos: '50% 45%', alt: 'Lionel Messi dribbling past AS Roma defenders in a 2015 pre-season match',
    credit: { text: 'Photo: Justine Magny, CC BY-SA 2.0', href: 'https://commons.wikimedia.org/wiki/File:Messi_v_AS_Roma_2015.jpg' },
    line: 'Playing and watching. Team sport taught me most of what I know about passing the ball at the right moment.' },
  { id: 'blog', title: 'Travel writing', icon: 'pen', hue: 'agents',
    photo: '/interests/alpine-sunset.jpg', pos: '50% 62%', alt: 'Sunset over a ridge of Alpine peaks with streaks of cloud',
    line: 'I write up my trips on my travel blog: the places, the people and the small details worth remembering.' },
];

// The photo strip under the interest cards.
export const gallery: { src: string; alt: string; pos?: string }[] = [
  { src: '/interests/valley-view.jpg', alt: 'Prahas crouching on a mountain viewpoint above a town in a wide Alpine valley', pos: '50% 60%' },
  { src: '/interests/mountain-lake.jpg', alt: 'A turquoise mountain lake seen from a grassy slope, with snowy peaks behind' },
  { src: '/interests/alpine-meadow.jpg', alt: 'A green meadow in the foreground with a range of snow-capped mountains', pos: '50% 55%' },
];
