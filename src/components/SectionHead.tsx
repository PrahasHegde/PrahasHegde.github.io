import type { ReactNode } from 'react';
import { Reveal } from './Reveal';

export function SectionHead({ n, kicker, title, children }: { n: string; kicker: string; title: string; children?: ReactNode }) {
  return (
    <Reveal className="sec-head">
      <div>
        <span className="mono">{n} · {kicker}</span>
        <h2>{title}</h2>
      </div>
      {children && <p>{children}</p>}
    </Reveal>
  );
}
