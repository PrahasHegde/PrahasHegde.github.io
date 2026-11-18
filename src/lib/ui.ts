import { profile } from '../data/content';

export const prefersReducedMotion = () =>
  typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

export const mailto = `mailto:${profile.email}?subject=Hi%20Prahas`;

/** Scroll to an element by id. Lets the project grid clear its filter first if the target is hidden. */
export function jump(id: string) {
  window.dispatchEvent(new CustomEvent('portfolio:reveal', { detail: id }));
  requestAnimationFrame(() =>
    requestAnimationFrame(() => {
      const el = document.getElementById(id);
      if (!el) return;
      const reduce = prefersReducedMotion();
      el.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'start' });
      if (!reduce && id.startsWith('p-') && el.animate) {
        el.animate(
          [
            { outline: '2px solid var(--accent)', outlineOffset: '6px' },
            { outline: '2px solid transparent', outlineOffset: '6px' },
          ],
          { duration: 1600, easing: 'ease-out' },
        );
      }
    }),
  );
}

export function toast(message: string) {
  window.dispatchEvent(new CustomEvent('portfolio:toast', { detail: message }));
}

export async function copyEmail(): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(profile.email);
    toast('Email copied');
    return true;
  } catch {
    toast(profile.email);
    return false;
  }
}

export function printCV() {
  window.dispatchEvent(new Event('portfolio:print'));
  setTimeout(() => window.print(), 80);
}

export function currentTheme(): 'light' | 'dark' {
  const t = document.documentElement.getAttribute('data-theme');
  if (t === 'light' || t === 'dark') return t;
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

export function toggleTheme() {
  const next = currentTheme() === 'dark' ? 'light' : 'dark';
  document.documentElement.setAttribute('data-theme', next);
  try {
    localStorage.setItem('theme', next);
  } catch {
    /* storage unavailable: theme still applies for this visit */
  }
}
