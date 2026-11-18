import { useEffect, useState } from 'react';
import { MotionConfig, motion, useScroll, useSpring } from 'framer-motion';
import { Nav } from './components/Nav';
import { Hero } from './components/Hero';
import { Work } from './components/Work';
import { About, Contact, Experience, Interests, Skills } from './components/Sections';
import { CommandPalette } from './components/CommandPalette';

function Toast() {
  const [msg, setMsg] = useState('');
  const [show, setShow] = useState(false);
  useEffect(() => {
    let t: ReturnType<typeof setTimeout>;
    const on = (e: Event) => {
      setMsg((e as CustomEvent<string>).detail);
      setShow(true);
      clearTimeout(t);
      t = setTimeout(() => setShow(false), 2000);
    };
    window.addEventListener('portfolio:toast', on);
    return () => window.removeEventListener('portfolio:toast', on);
  }, []);
  return <div className={`toast${show ? ' show' : ''}`} role="status" aria-live="polite">{msg}</div>;
}

function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 200, damping: 40, restDelta: 0.001 });
  return <motion.div className="progress" style={{ scaleX }} aria-hidden="true" />;
}

export default function App() {
  const [cmdOpen, setCmdOpen] = useState(false);
  return (
    <MotionConfig reducedMotion="user">
      <a className="skip" href="#work">Skip to work</a>
      <ScrollProgress />
      <Nav onSearch={() => setCmdOpen(true)} />
      <main>
        <Hero />
        <Work />
        <Experience />
        <Skills />
        <About />
        <Interests />
      </main>
      <Contact />
      <CommandPalette open={cmdOpen} setOpen={setCmdOpen} />
      <Toast />
    </MotionConfig>
  );
}
