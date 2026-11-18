import { motion, type HTMLMotionProps } from 'framer-motion';

type Tag = 'div' | 'article' | 'li' | 'figure' | 'h3';

/** Fades and lifts its content in once, when it scrolls into view. */
export function Reveal({ as = 'div', className = '', delay = 0, ...rest }: HTMLMotionProps<'div'> & { as?: Tag; delay?: number }) {
  const M = motion[as] as typeof motion.div;
  return (
    <M
      className={`reveal ${className}`.trim()}
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '0px 0px -8% 0px' }}
      transition={{ duration: 0.6, ease: [0.2, 0.8, 0.2, 1], delay }}
      {...rest}
    />
  );
}
