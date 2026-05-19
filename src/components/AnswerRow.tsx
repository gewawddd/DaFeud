import React from 'react';
import { motion } from 'framer-motion';
import { Trash2Icon } from 'lucide-react';
import { Answer } from '../lib/storage';
type Props = {
  index: number;
  answer: Answer;
  onChange: (a: Answer) => void;
  onDelete: () => void;
  canDelete: boolean;
};
export function AnswerRow({
  index,
  answer,
  onChange,
  onDelete,
  canDelete
}: Props) {
  return (
    <motion.div
      layout
      initial={{
        opacity: 0,
        height: 0,
        y: -8
      }}
      animate={{
        opacity: 1,
        height: 'auto',
        y: 0
      }}
      exit={{
        opacity: 0,
        height: 0,
        y: -8
      }}
      transition={{
        duration: 0.25,
        ease: 'easeOut'
      }}
      className="overflow-hidden">
      
      <div className="flex items-stretch gap-2 sm:gap-3 py-2">
        <div className="flex-shrink-0 w-10 sm:w-12 flex items-center justify-center rounded-2xl bg-gradient-to-br from-amber-400 to-amber-600 text-blue-950 font-display text-xl sm:text-2xl font-bold shadow-lg shadow-amber-500/20">
          {index + 1}
        </div>
        <input
          type="text"
          value={answer.text}
          onChange={(e) =>
          onChange({
            ...answer,
            text: e.target.value
          })
          }
          placeholder={`Answer ${index + 1}`}
          className="flex-1 min-w-0 px-4 py-3 rounded-2xl bg-white/10 border border-white/20 text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent transition" />
        
        <input
          type="number"
          min={0}
          value={answer.points === '' ? '' : answer.points}
          onChange={(e) => {
            const v = e.target.value;
            onChange({
              ...answer,
              points: v === '' ? '' : Math.max(0, parseInt(v) || 0)
            });
          }}
          placeholder="Pts"
          className="w-20 sm:w-24 px-3 py-3 rounded-2xl bg-white/10 border border-white/20 text-white text-center font-led text-lg focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent transition" />
        
        <button
          type="button"
          onClick={onDelete}
          disabled={!canDelete}
          aria-label={`Delete answer ${index + 1}`}
          className="flex-shrink-0 w-12 flex items-center justify-center rounded-2xl bg-red-500/20 border border-red-500/30 text-red-300 hover:bg-red-500/30 hover:text-red-200 disabled:opacity-30 disabled:cursor-not-allowed transition">
          
          <Trash2Icon size={18} />
        </button>
      </div>
    </motion.div>);

}