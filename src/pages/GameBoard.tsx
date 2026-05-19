import React, { useEffect, useMemo, useState, useRef } from 'react';
import { motion } from 'framer-motion';
import {
  EyeIcon,
  RotateCcwIcon,
  ArrowLeftIcon,
  FileTextIcon } from
'lucide-react';
import {
  Survey,
  GameState,
  loadGame,
  saveGame,
  clearGame } from
'../lib/storage';
import { AnswerCard } from '../components/AnswerCard';
import { Scoreboard } from '../components/Scoreboard';
import { Confetti } from '../components/Confetti';
import { SoundToggle } from '../components/SoundToggle';
type Props = {
  survey: Survey;
  onBackToSetup: () => void;
  onNewQuestion: () => void;
};
export function GameBoard({ survey, onBackToSetup, onNewQuestion }: Props) {
  const [revealed, setRevealed] = useState<Set<string>>(() => {
    const g = loadGame();
    return new Set(g?.revealed ?? []);
  });
  const [soundOn, setSoundOn] = useState(true);
  const audioCtxRef = useRef<AudioContext | null>(null);
  useEffect(() => {
    const state: GameState = {
      revealed: Array.from(revealed)
    };
    saveGame(state);
  }, [revealed]);
  const total = useMemo(
    () =>
    survey.answers.
    filter((a) => revealed.has(a.id)).
    reduce((sum, a) => sum + (Number(a.points) || 0), 0),
    [survey.answers, revealed]
  );
  const allRevealed =
  survey.answers.length > 0 && revealed.size === survey.answers.length;
  function playDing() {
    if (!soundOn) return;
    try {
      if (!audioCtxRef.current) {
        const Ctx =
        window.AudioContext ||
        (
        window as unknown as {
          webkitAudioContext: typeof AudioContext;
        }).
        webkitAudioContext;
        audioCtxRef.current = new Ctx();
      }
      const ctx = audioCtxRef.current;
      if (!ctx) return;
      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(880, now);
      osc.frequency.exponentialRampToValueAtTime(1320, now + 0.08);
      gain.gain.setValueAtTime(0.0001, now);
      gain.gain.exponentialRampToValueAtTime(0.25, now + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.5);
      osc.connect(gain).connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.55);
    } catch {

      // ignore
    }}
  function reveal(id: string) {
    if (revealed.has(id)) return;
    setRevealed((s) => {
      const next = new Set(s);
      next.add(id);
      return next;
    });
    playDing();
  }
  function revealAll() {
    let i = 0;
    survey.answers.forEach((a) => {
      if (revealed.has(a.id)) return;
      setTimeout(() => {
        setRevealed((s) => {
          if (s.has(a.id)) return s;
          const next = new Set(s);
          next.add(a.id);
          return next;
        });
        playDing();
      }, i * 280);
      i++;
    });
  }
  function resetGame() {
    setRevealed(new Set());
    clearGame();
  }
  return (
    <div className="relative min-h-screen w-full overflow-x-hidden px-4 sm:px-6 py-8 sm:py-12">
      <Confetti active={allRevealed} />

      {/* Top controls */}
      <div className="relative z-10 max-w-6xl mx-auto flex items-center justify-between gap-3 mb-8">
        <button
          type="button"
          onClick={onBackToSetup}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-white/5 border border-white/20 text-white/80 hover:bg-white/10 hover:text-white transition text-sm font-medium backdrop-blur-md">
          
          <ArrowLeftIcon size={16} />
          <span className="hidden sm:inline">Back to Setup</span>
        </button>
        <SoundToggle enabled={soundOn} onToggle={() => setSoundOn((v) => !v)} />
      </div>

      {/* Title */}
      <motion.div
        initial={{
          opacity: 0,
          scale: 0.7
        }}
        animate={{
          opacity: 1,
          scale: 1
        }}
        transition={{
          duration: 0.7,
          ease: [0.34, 1.56, 0.64, 1]
        }}
        className="relative z-10 text-center mb-6 sm:mb-8">
        
        <h1 className="font-display text-5xl sm:text-7xl md:text-8xl font-bold tracking-tight text-transparent bg-clip-text bg-gradient-to-b from-amber-200 via-amber-400 to-amber-600 title-glow">
          TRBSA FEUD
        </h1>
      </motion.div>

      {/* Question panel */}
      <motion.div
        initial={{
          opacity: 0,
          y: 20
        }}
        animate={{
          opacity: 1,
          y: 0
        }}
        transition={{
          duration: 0.6,
          delay: 0.3
        }}
        className="relative z-10 max-w-4xl mx-auto mb-8 sm:mb-10">
        
        <div className="rounded-3xl bg-blue-950/70 backdrop-blur-md border-2 border-amber-400/40 shadow-[0_0_50px_rgba(251,191,36,0.25),inset_0_1px_0_rgba(255,255,255,0.1)] px-6 py-6 sm:px-10 sm:py-8 text-center">
          <div className="text-[10px] sm:text-xs uppercase tracking-[0.3em] text-amber-300/80 font-display mb-3">
            Survey Says...
          </div>
          <p className="text-white text-xl sm:text-2xl md:text-3xl font-display tracking-wide leading-snug">
            {survey.question}
          </p>
        </div>
      </motion.div>

      {/* Scoreboard */}
      <div className="relative z-10 flex justify-center mb-8 sm:mb-10">
        <Scoreboard
          total={total}
          revealed={revealed.size}
          totalAnswers={survey.answers.length} />
        
      </div>

      {/* Answer board */}
      <div className="relative z-10 max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5">
        {survey.answers.map((a, i) =>
        <AnswerCard
          key={a.id}
          index={i}
          answer={a}
          revealed={revealed.has(a.id)}
          onReveal={() => reveal(a.id)} />

        )}
      </div>

      {/* Controls */}
      <div className="relative z-10 max-w-5xl mx-auto mt-10 sm:mt-12 flex flex-wrap justify-center gap-3">
        <motion.button
          type="button"
          onClick={revealAll}
          whileHover={{
            scale: 1.04
          }}
          whileTap={{
            scale: 0.96
          }}
          className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-gradient-to-b from-amber-300 via-amber-400 to-amber-600 text-blue-950 font-display font-bold tracking-wide border-2 border-amber-200 shadow-lg shadow-amber-500/30">
          
          <EyeIcon size={18} />
          Reveal All
        </motion.button>
        <button
          type="button"
          onClick={resetGame}
          className="inline-flex items-center gap-2 px-5 py-3 rounded-2xl bg-white/10 border border-white/20 text-white hover:bg-white/15 transition font-medium backdrop-blur-md">
          
          <RotateCcwIcon size={16} />
          Reset Game
        </button>
        <button
          type="button"
          onClick={onNewQuestion}
          className="inline-flex items-center gap-2 px-5 py-3 rounded-2xl bg-white/10 border border-white/20 text-white hover:bg-white/15 transition font-medium backdrop-blur-md">
          
          <FileTextIcon size={16} />
          New Question
        </button>
      </div>
    </div>);

}