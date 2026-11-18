import { useEffect, useState } from 'react';
import { profile } from '../data/content';
import { toggleTheme } from '../lib/ui';
import { Moon, Search, Sun } from './Icons';

const sections = [
  { id: 'work', label: 'Work' },
  { id: 'experience', label: 'Experience' },
  { id: 'skills', label: 'Skills' },
  { id: 'about', label: 'About' },
];

export function Nav({ onSearch }: { onSearch: () => void }) {
  const [scrolled, setScrolled] = useState(false);
  const [active, setActive] = useState('');
  const isMac = /Mac|iPhone|iPad/.test(navigator.userAgent);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    const io = new IntersectionObserver(
      (es) => es.forEach((e) => e.isIntersecting && setActive(e.target.id)),
      { rootMargin: '-45% 0px -50% 0px' },
    );
    [...sections.map((s) => s.id), 'interests'].forEach((id) => {
      const el = document.getElementById(id);
      if (el) io.observe(el);
    });
    return () => {
      window.removeEventListener('scroll', onScroll);
      io.disconnect();
    };
  }, []);

  return (
    <nav className={`nav${scrolled ? ' scrolled' : ''}`} aria-label="Main">
      <div className="wrap">
        <a className="brand" href="#top">
          <b>{profile.name}</b>
          <span className="mono">/ {profile.role}</span>
        </a>
        <ul>
          {sections.map((s) => (
            <li key={s.id}>
              <a href={`#${s.id}`} className={active === s.id || (s.id === 'about' && active === 'interests') ? 'active' : ''}>
                {s.label}
              </a>
            </li>
          ))}
        </ul>
        <div className="nav-tools">
          <button className="icon-btn search-btn" type="button" aria-label="Search the site" onClick={onSearch}>
            <Search />
            <span className="lbl">Search</span>
            <kbd>{isMac ? '⌘K' : 'Ctrl K'}</kbd>
          </button>
          <button className="icon-btn theme-btn" type="button" aria-label="Switch light or dark theme" onClick={toggleTheme}>
            <Sun className="sun" />
            <Moon className="moon" />
          </button>
          <a className="hire" href="#contact">Hire me</a>
        </div>
      </div>
    </nav>
  );
}
