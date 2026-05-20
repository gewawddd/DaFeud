import React from 'react';
import { motion } from 'framer-motion';
type Props = {
  questionTotal: number;
  roundTotal: number;
  grandTotal: number;
  revealed: number;
  totalAnswers: number;
};
export function Scoreboard({
  questionTotal,
  roundTotal,
  grandTotal,
  revealed,
  totalAnswers
}: Props) {
  return (
    <div
      className="inline-flex items-center px-5 sm:px-7 py-4 rounded-3xl bg-blue-950/80 backdrop-blur-md border-2 border-amber-500/40 shadow-[0_0_30px_rgba(251,191,36,0.2),inset_0_1px_0_rgba(255,255,255,0.1)]"
      aria-live="polite">
      
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6 text-center">
        <div>
          <div className="text-[10px] sm:text-xs uppercase tracking-[0.2em] text-amber-300/80 font-display mb-1 w-[8ch] mx-auto text-center">
            Question
          </div>
          <motion.div
            key={questionTotal}
            initial={{ scale: 1.2, color: '#fde047' }}
            animate={{ scale: 1, color: '#fbbf24' }}
            transition={{ duration: 0.35 }}
            className="font-led text-3xl sm:text-4xl led-glow tabular-nums w-[3ch] mx-auto text-center">
            
            {String(questionTotal).padStart(3, '0')}
          </motion.div>
        </div>
        <div>
          <div className="text-[10px] sm:text-xs uppercase tracking-[0.2em] text-amber-300/80 font-display mb-1 w-[8ch] mx-auto text-center">
            Round
          </div>
          <motion.div
            key={roundTotal}
            initial={{ scale: 1.2, color: '#fde047' }}
            animate={{ scale: 1, color: '#fbbf24' }}
            transition={{ duration: 0.35 }}
            className="font-led text-3xl sm:text-4xl led-glow tabular-nums w-[3ch] mx-auto text-center">
            
            {String(roundTotal).padStart(3, '0')}
          </motion.div>
        </div>
        <div>
          <div className="text-[10px] sm:text-xs uppercase tracking-[0.2em] text-amber-300/80 font-display mb-1 w-[8ch] mx-auto text-center">
            Total
          </div>
          <motion.div
            key={grandTotal}
            initial={{ scale: 1.2, color: '#fde047' }}
            animate={{ scale: 1, color: '#fbbf24' }}
            transition={{ duration: 0.35 }}
            className="font-led text-3xl sm:text-4xl led-glow tabular-nums w-[3ch] mx-auto text-center">
            
            {String(grandTotal).padStart(3, '0')}
          </motion.div>
        </div>
        <div>
          <div className="text-[10px] sm:text-xs uppercase tracking-[0.2em] text-amber-300/80 font-display mb-1 w-[8ch] mx-auto text-center">
            Revealed
          </div>
          <div className="font-led text-2xl sm:text-3xl text-amber-300/90 tabular-nums w-[5ch] mx-auto text-center">
            {revealed}/{totalAnswers}
          </div>
        </div>
      </div>
    </div>);

}