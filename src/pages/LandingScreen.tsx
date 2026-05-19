import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRightIcon } from 'lucide-react';
type Props = {
  onEnter: () => void;
};
export function LandingScreen({ onEnter }: Props) {
  return (
    <div className="relative min-h-screen w-full flex flex-col items-center justify-center px-6 py-16 overflow-hidden">
      {/* Subtle floating spotlights */}
      <motion.div
        aria-hidden
        className="pointer-events-none absolute -top-20 left-1/4 w-96 h-96 rounded-full bg-amber-400/20 blur-3xl"
        animate={{
          x: [0, 40, 0],
          y: [0, 20, 0]
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: 'easeInOut'
        }} />
      
      <motion.div
        aria-hidden
        className="pointer-events-none absolute -bottom-20 right-1/4 w-96 h-96 rounded-full bg-orange-500/15 blur-3xl"
        animate={{
          x: [0, -30, 0],
          y: [0, -20, 0]
        }}
        transition={{
          duration: 9,
          repeat: Infinity,
          ease: 'easeInOut'
        }} />
      

      {/* Title */}
      <motion.h1
        initial={{
          opacity: 0,
          scale: 0.7,
          y: 20
        }}
        animate={{
          opacity: 1,
          scale: 1,
          y: 0
        }}
        transition={{
          duration: 0.9,
          ease: [0.34, 1.56, 0.64, 1]
        }}
        className="relative z-10 font-display text-7xl sm:text-8xl md:text-[10rem] lg:text-[12rem] font-bold tracking-tight text-transparent bg-clip-text bg-gradient-to-b from-amber-200 via-amber-400 to-amber-600 title-glow text-center leading-none">
        
        TRBSA FEUD
      </motion.h1>

      {/* Subtle tagline */}
      <motion.p
        initial={{
          opacity: 0,
          y: 10
        }}
        animate={{
          opacity: 1,
          y: 0
        }}
        transition={{
          duration: 0.6,
          delay: 0.5
        }}
        className="relative z-10 mt-4 sm:mt-6 text-base sm:text-lg text-blue-100/60 font-display tracking-[0.4em] uppercase">
        
        Survey Says...
      </motion.p>

      {/* Small enter button */}
      <motion.button
        type="button"
        onClick={onEnter}
        initial={{
          opacity: 0,
          y: 10
        }}
        animate={{
          opacity: 1,
          y: 0
        }}
        transition={{
          duration: 0.5,
          delay: 0.9
        }}
        whileHover={{
          scale: 1.05,
          y: -1
        }}
        whileTap={{
          scale: 0.96
        }}
        className="relative z-10 mt-10 sm:mt-12 inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white/10 backdrop-blur-md border border-amber-400/40 text-amber-200 hover:bg-amber-400/15 hover:text-amber-100 hover:border-amber-300/60 transition text-sm font-medium tracking-wide"
        aria-label="Enter TRBSA Feud">
        
        Enter
        <ArrowRightIcon size={14} />
      </motion.button>
    </div>);

}