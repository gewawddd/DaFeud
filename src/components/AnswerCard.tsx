import React from 'react';
import { motion } from 'framer-motion';
import { Answer } from '../lib/storage';
type Props = {
  index: number;
  answer: Answer;
  revealed: boolean;
  onReveal: () => void;
};
export function AnswerCard({ index, answer, revealed, onReveal }: Props) {
  return (
    <motion.button
      type="button"
      onClick={() => !revealed && onReveal()}
      whileHover={
      !revealed ?
      {
        scale: 1.02,
        y: -2
      } :
      {}
      }
      whileTap={
      !revealed ?
      {
        scale: 0.98
      } :
      {}
      }
      className="relative w-full h-24 sm:h-28 md:h-32 [perspective:1200px] focus:outline-none focus-visible:ring-4 focus-visible:ring-amber-400/60 rounded-3xl"
      aria-pressed={revealed}
      aria-label={
      revealed ?
      `Answer ${index + 1}: ${answer.text}, ${answer.points} points` :
      `Reveal answer ${index + 1}`
      }>
      
      <motion.div
        className="relative w-full h-full [transform-style:preserve-3d]"
        animate={{
          rotateY: revealed ? 180 : 0
        }}
        transition={{
          duration: 0.7,
          ease: [0.4, 0, 0.2, 1]
        }}>
        
        {/* Front - slot number */}
        <div className="absolute inset-0 [backface-visibility:hidden] rounded-3xl flex items-center justify-center bg-gradient-to-br from-blue-700 via-blue-800 to-blue-950 border-2 border-blue-400/40 shadow-[0_10px_40px_rgba(0,0,0,0.4),inset_0_1px_0_rgba(255,255,255,0.15)]">
          <div className="absolute inset-2 rounded-2xl border border-blue-300/20" />
          <span className="font-led text-5xl sm:text-6xl md:text-7xl text-amber-300 led-glow">
            {index + 1}
          </span>
        </div>

        {/* Back - revealed answer */}
        <div className="absolute inset-0 [backface-visibility:hidden] [transform:rotateY(180deg)] rounded-3xl flex items-center justify-between px-5 sm:px-7 md:px-8 bg-gradient-to-br from-amber-400 via-yellow-500 to-amber-600 border-2 border-amber-200 shadow-[0_0_40px_rgba(251,191,36,0.5),inset_0_1px_0_rgba(255,255,255,0.4)]">
          <div className="absolute inset-2 rounded-2xl border border-white/30 pointer-events-none" />
          <span className="relative font-display uppercase font-bold tracking-wide text-blue-950 text-xl sm:text-2xl md:text-3xl truncate pr-4 text-left">
            {answer.text || '—'}
          </span>
          <span className="relative font-led text-3xl sm:text-4xl md:text-5xl text-blue-950 flex-shrink-0">
            {answer.points || 0}
          </span>
        </div>
      </motion.div>
    </motion.button>);

}