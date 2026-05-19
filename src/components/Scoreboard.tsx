import React from 'react';
import { motion } from 'framer-motion';
type Props = {
  total: number;
  revealed: number;
  totalAnswers: number;
};
export function Scoreboard({ total, revealed, totalAnswers }: Props) {
  return (
    <div className="inline-flex items-center gap-4 sm:gap-6 px-6 py-4 rounded-3xl bg-blue-950/80 backdrop-blur-md border-2 border-amber-500/40 shadow-[0_0_30px_rgba(251,191,36,0.2),inset_0_1px_0_rgba(255,255,255,0.1)]">
      <div className="text-center">
        <div className="text-[10px] sm:text-xs uppercase tracking-[0.2em] text-amber-300/80 font-display mb-1">
          Score
        </div>
        <motion.div
          key={total}
          initial={{
            scale: 1.3,
            color: '#fde047'
          }}
          animate={{
            scale: 1,
            color: '#fbbf24'
          }}
          transition={{
            duration: 0.4
          }}
          className="font-led text-4xl sm:text-5xl led-glow">
          
          {String(total).padStart(3, '0')}
        </motion.div>
      </div>
      <div className="h-12 w-px bg-amber-500/30" />
      <div className="text-center">
        <div className="text-[10px] sm:text-xs uppercase tracking-[0.2em] text-amber-300/80 font-display mb-1">
          Revealed
        </div>
        <div className="font-led text-2xl sm:text-3xl text-amber-300/90">
          {revealed}/{totalAnswers}
        </div>
      </div>
    </div>);

}