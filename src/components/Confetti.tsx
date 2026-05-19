import React, { useMemo } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
type Props = {
  active: boolean;
};
const COLORS = ['#fbbf24', '#f59e0b', '#f97316', '#fde047', '#fff', '#60a5fa'];
export function Confetti({ active }: Props) {
  const reduceMotion = useReducedMotion();
  const particles = useMemo(
    () =>
    Array.from(
      {
        length: 60
      },
      (_, i) => ({
        id: i,
        x: Math.random() * 100,
        delay: Math.random() * 0.6,
        duration: 2.2 + Math.random() * 1.6,
        rotate: Math.random() * 720 - 360,
        size: 6 + Math.random() * 8,
        color: COLORS[i % COLORS.length],
        drift: (Math.random() - 0.5) * 200
      })
    ),
    []
  );
  if (!active || reduceMotion) return null;
  return (
    <div className="pointer-events-none fixed inset-0 z-50 overflow-hidden">
      {particles.map((p) =>
      <motion.div
        key={p.id}
        initial={{
          y: -40,
          x: `${p.x}vw`,
          opacity: 1,
          rotate: 0
        }}
        animate={{
          y: '110vh',
          x: `calc(${p.x}vw + ${p.drift}px)`,
          rotate: p.rotate,
          opacity: [1, 1, 0.8, 0]
        }}
        transition={{
          duration: p.duration,
          delay: p.delay,
          ease: 'easeIn'
        }}
        style={{
          position: 'absolute',
          top: 0,
          width: p.size,
          height: p.size * 1.5,
          backgroundColor: p.color,
          borderRadius: 2
        }} />

      )}
    </div>);

}