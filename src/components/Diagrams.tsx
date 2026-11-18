// Small animated architecture diagrams for the featured project cards.
// Each one shows how the system actually works, in the project's own terms.
import type { ReactNode } from 'react';

const Node = ({ x, y, w = 74, label, kind = '' }: { x: number; y: number; w?: number; label: string; kind?: string }) => (
  <g className={`dg-node ${kind}`} transform={`translate(${x},${y})`}>
    <rect x={-w / 2} y={-14} width={w} height={28} rx={8} />
    <text y={4} textAnchor="middle">{label}</text>
  </g>
);
const Flow = ({ d, slow }: { d: string; slow?: boolean }) => (
  <>
    <path className="dg-edge" d={d} markerEnd="url(#dg-arrow)" />
    <path className={`dg-flow${slow ? ' slow' : ''}`} d={d} />
  </>
);

function Frame({ children, label }: { children: ReactNode; label: string }) {
  return (
    <figure className="diagram" aria-label={label} role="img">
      <svg viewBox="0 0 480 120" preserveAspectRatio="xMidYMid meet">
        <defs>
          <marker id="dg-arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
            <path d="M0 0 10 5 0 10z" className="dg-head" />
          </marker>
        </defs>
        {children}
      </svg>
    </figure>
  );
}

const diagrams: Record<string, ReactNode> = {
  'p-patchpilot': (
    <Frame label="PatchPilot: task to planner to coder, which loops with pytest until tests pass, then verified">
      <Flow d="M78 60H108" /><Flow d="M184 60H214" /><Flow d="M290 60H320" /><Flow d="M396 60H418" />
      <path className="dg-edge loop" d="M358 74C358 104 252 104 252 76" markerEnd="url(#dg-arrow)" />
      <text className="dg-note" x="305" y="112" textAnchor="middle">fail → repair</text>
      <Node x={42} y={60} w={68} label="task" />
      <Node x={146} y={60} label="planner" />
      <Node x={252} y={60} label="coder" kind="accent" />
      <Node x={358} y={60} label="pytest" />
      <g className="dg-ok" transform="translate(446,60)"><circle r="14" /><path d="M-6 0l4 4 8-8" /></g>
    </Frame>
  ),
  'p-pushback': (
    <Frame label="Pushback: letter to claims to live search to verdicts with citations to reply">
      <Flow d="M74 60H98" /><Flow d="M170 60H194" /><Flow d="M266 60H290" /><Flow d="M362 60H386" />
      <Node x={40} y={60} w={64} label="letter" />
      <Node x={134} y={60} w={70} label="claims" />
      <Node x={230} y={60} w={70} label="Exa search" kind="accent" />
      <Node x={326} y={60} w={70} label="verdict" />
      <Node x={428} y={60} w={78} label="reply" />
      <g className="dg-cites">
        <rect x="296" y="86" width="22" height="14" rx="4" /><text x="307" y="96" textAnchor="middle">S1</text>
        <rect x="322" y="86" width="22" height="14" rx="4" /><text x="333" y="96" textAnchor="middle">S2</text>
      </g>
      <text className="dg-note" x="134" y="96" textAnchor="middle">every claim highlighted</text>
    </Frame>
  ),
  'p-permrag': (
    <Frame label="Permission-aware RAG: user identity filters retrieval before the LLM; every retrieval goes into a hash-chained audit log">
      <Flow d="M76 44H104" /><Flow d="M190 44H218" /><Flow d="M296 44H324" />
      <Node x={42} y={44} w={64} label="user · id" />
      <Node x={148} y={44} w={82} label="ACL filter" kind="accent" />
      <Node x={258} y={44} w={74} label="Qdrant" />
      <Node x={366} y={44} w={78} label="LLM" />
      <path className="dg-edge dash" d="M148 58V84" markerEnd="url(#dg-arrow)" />
      <g className="dg-chain">
        {[0, 1, 2, 3, 4].map((i) => (
          <g key={i} transform={`translate(${120 + i * 62},98)`}>
            <rect x="-22" y="-10" width="44" height="20" rx="5" />
            <text y="4" textAnchor="middle">#{(0xa3f + i * 0x1b7).toString(16)}</text>
            {i < 4 && <path className="dg-link" d="M22 0H40" />}
          </g>
        ))}
      </g>
      <text className="dg-note" x="436" y="102" textAnchor="middle">audit log</text>
    </Frame>
  ),
  'p-grpo': (
    <Frame label="GRPO: the policy samples a group of answers, rewards score format, reasoning and correctness, and the policy is updated">
      <Node x={52} y={60} w={86} label="Gemma 2B" kind="accent" />
      <Flow d="M96 60H130" />
      <g className="dg-group">
        {[0, 1, 2, 3].map((i) => <rect key={i} x={138} y={26 + i * 18} width={56} height={12} rx={3} style={{ opacity: 1 - i * 0.18 }} />)}
        <text x="166" y="18" textAnchor="middle" className="dg-note">G samples</text>
      </g>
      <Flow d="M200 60H232" />
      <g className="dg-rewards" transform="translate(240,28)">
        {['format', 'reasoning', 'answer'].map((r, i) => (
          <g key={r} transform={`translate(0,${i * 22})`}><rect width="92" height="16" rx="4" /><text x="46" y="12" textAnchor="middle">{r}</text></g>
        ))}
      </g>
      <Flow d="M338 60H368" />
      <Node x={418} y={60} w={86} label="advantage" />
      <path className="dg-edge loop" d="M418 74C418 112 52 112 52 76" markerEnd="url(#dg-arrow)" />
      <text className="dg-note" x="240" y="116" textAnchor="middle">policy update (LoRA)</text>
    </Frame>
  ),
};

export function Diagram({ id }: { id: string }) {
  return diagrams[id] ?? null;
}
