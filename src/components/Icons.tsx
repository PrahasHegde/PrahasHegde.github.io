import type { SVGProps } from 'react';

type P = SVGProps<SVGSVGElement>;
const stroke = { fill: 'none', stroke: 'currentColor', strokeWidth: 2, strokeLinecap: 'round', strokeLinejoin: 'round' } as const;

export const Arrow = (p: P) => (
  <svg viewBox="0 0 24 24" {...stroke} strokeWidth={2.4} aria-hidden="true" {...p}><path d="M7 17 17 7M8 7h9v9" /></svg>
);
export const Search = (p: P) => (
  <svg viewBox="0 0 24 24" {...stroke} aria-hidden="true" {...p}><circle cx="11" cy="11" r="7" /><path d="m20 20-3.5-3.5" /></svg>
);
export const Sun = (p: P) => (
  <svg viewBox="0 0 24 24" {...stroke} aria-hidden="true" {...p}><circle cx="12" cy="12" r="4" /><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" /></svg>
);
export const Moon = (p: P) => (
  <svg viewBox="0 0 24 24" {...stroke} aria-hidden="true" {...p}><path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8Z" /></svg>
);
export const Mail = (p: P) => (
  <svg viewBox="0 0 24 24" {...stroke} aria-hidden="true" {...p}><rect x="3" y="5" width="18" height="14" rx="2" /><path d="m3 7 9 6 9-6" /></svg>
);
export const Download = (p: P) => (
  <svg viewBox="0 0 24 24" {...stroke} aria-hidden="true" {...p}><path d="M12 3v12m0 0-4-4m4 4 4-4M5 21h14" /></svg>
);
export const GitHub = (p: P) => (
  <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" {...p}><path d="M12 .5a11.5 11.5 0 0 0-3.64 22.41c.58.1.79-.25.79-.56v-2c-3.2.7-3.88-1.37-3.88-1.37-.52-1.33-1.28-1.69-1.28-1.69-1.05-.71.08-.7.08-.7 1.16.08 1.77 1.19 1.77 1.19 1.03 1.77 2.7 1.26 3.36.96.1-.75.4-1.26.73-1.55-2.55-.29-5.24-1.28-5.24-5.69 0-1.26.45-2.29 1.19-3.1-.12-.29-.52-1.46.11-3.05 0 0 .97-.31 3.17 1.18a11 11 0 0 1 5.77 0c2.2-1.49 3.17-1.18 3.17-1.18.63 1.59.23 2.76.11 3.05.74.81 1.19 1.84 1.19 3.1 0 4.42-2.7 5.39-5.26 5.68.41.36.78 1.06.78 2.14v3.17c0 .31.21.67.8.56A11.5 11.5 0 0 0 12 .5Z" /></svg>
);
export const LinkedIn = (p: P) => (
  <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" {...p}><path d="M20.45 20.45h-3.56v-5.57c0-1.33-.02-3.04-1.85-3.04-1.86 0-2.14 1.45-2.14 2.94v5.67H9.35V9h3.41v1.56h.05c.48-.9 1.64-1.85 3.37-1.85 3.6 0 4.27 2.37 4.27 5.46v6.28ZM5.34 7.43a2.06 2.06 0 1 1 0-4.13 2.06 2.06 0 0 1 0 4.13ZM7.12 20.45H3.56V9h3.56v11.45ZM22.22 0H1.77C.79 0 0 .77 0 1.73v20.54C0 23.23.79 24 1.77 24h20.45c.98 0 1.78-.77 1.78-1.73V1.73C24 .77 23.2 0 22.22 0Z" /></svg>
);

// interest icons
export const Mountain = (p: P) => (
  <svg viewBox="0 0 24 24" {...stroke} aria-hidden="true" {...p}><path d="m3 20 6.5-11 4 6.5 2.5-4L21 20Z" /><path d="m8 11.5 1.5 1.5 1.5-1.5" /><circle cx="17.5" cy="5.5" r="1.5" /></svg>
);
export const Run = (p: P) => (
  <svg viewBox="0 0 24 24" {...stroke} aria-hidden="true" {...p}><circle cx="14.5" cy="4.5" r="1.8" /><path d="m7 21 3.2-5.2 3.3 2.2V22M10.2 15.8 11.5 10l3 2.4 3.5.6M11.5 10 8 10.5 6.2 13.5" /></svg>
);
export const Globe = (p: P) => (
  <svg viewBox="0 0 24 24" {...stroke} aria-hidden="true" {...p}><circle cx="12" cy="12" r="9" /><path d="M3 12h18M12 3a14 14 0 0 1 0 18M12 3a14 14 0 0 0 0 18" /></svg>
);
export const Pen = (p: P) => (
  <svg viewBox="0 0 24 24" {...stroke} aria-hidden="true" {...p}><path d="M4 20h4L19 9a2.8 2.8 0 0 0-4-4L4 16Z" /><path d="m13.5 6.5 4 4M14 20h6" /></svg>
);
export const Whisk = (p: P) => (
  <svg viewBox="0 0 24 24" {...stroke} aria-hidden="true" {...p}><path d="m4 20 6.5-6.5" /><path d="M10.5 13.5C9 9 12 3.5 16.5 3.5s5 3 3 6.5-6.5 5-9 3.5Z" /><path d="M12.2 11.8c1-3 3-5.5 5.3-6.6M13.2 12.8c2.7-1.1 5-3 6.1-5.3" /></svg>
);
export const interestIcon = { mountain: Mountain, run: Run, globe: Globe, pen: Pen, whisk: Whisk };
