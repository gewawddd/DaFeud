import React, { useEffect, useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';
import { PlusIcon, SparklesIcon, RotateCcwIcon, PlayIcon } from 'lucide-react';
import { Survey, Answer, genId, saveSurvey } from '../lib/storage';
import { getSampleSurvey, getEmptySurvey } from '../lib/sampleData';
import { AnswerRow } from '../components/AnswerRow';
type Props = {
  initialSurvey: Survey | null;
  onStart: (survey: Survey) => void;
};
const ANSWER_OPTIONS = [4, 6, 8, 10];
export function SetupScreen({ initialSurvey, onStart }: Props) {
  const [survey, setSurvey] = useState<Survey>(
    () => initialSurvey ?? getEmptySurvey(6)
  );
  // Auto-save
  useEffect(() => {
    saveSurvey(survey);
  }, [survey]);
  const isValid = useMemo(() => {
    if (!survey.question.trim()) return false;
    if (survey.answers.length === 0) return false;
    return survey.answers.every(
      (a) => a.text.trim() !== '' && a.points !== '' && Number(a.points) > 0
    );
  }, [survey]);
  function updateAnswer(idx: number, next: Answer) {
    setSurvey((s) => ({
      ...s,
      answers: s.answers.map((a, i) => i === idx ? next : a)
    }));
  }
  function deleteAnswer(idx: number) {
    setSurvey((s) => ({
      ...s,
      answers: s.answers.filter((_, i) => i !== idx),
      answerCount: Math.max(1, s.answerCount - 1)
    }));
  }
  function addAnswer() {
    if (survey.answers.length >= 12) {
      toast.error('Maximum of 12 answers reached.');
      return;
    }
    setSurvey((s) => ({
      ...s,
      answers: [
      ...s.answers,
      {
        id: genId(),
        text: '',
        points: ''
      }],

      answerCount: s.answerCount + 1
    }));
  }
  function changeCount(count: number) {
    setSurvey((s) => {
      const current = s.answers;
      let next = current.slice(0, count);
      while (next.length < count) {
        next.push({
          id: genId(),
          text: '',
          points: ''
        });
      }
      return {
        ...s,
        answerCount: count,
        answers: next
      };
    });
  }
  function loadSample() {
    setSurvey(getSampleSurvey());
    toast.success('Sample survey loaded!');
  }
  function reset() {
    setSurvey(getEmptySurvey(6));
    toast.success('Form reset.');
  }
  function start() {
    if (!isValid) {
      toast.error('Please complete all fields with valid points.');
      return;
    }
    onStart(survey);
  }
  return (
    <div className="relative min-h-screen w-full overflow-x-hidden flex flex-col items-center px-4 sm:px-6 py-10 sm:py-16">
      {/* Header */}
      <motion.header
        initial={{
          opacity: 0,
          y: -20
        }}
        animate={{
          opacity: 1,
          y: 0
        }}
        transition={{
          duration: 0.6
        }}
        className="text-center mb-10 sm:mb-14 relative z-10">
        
        <h1 className="font-display text-5xl sm:text-7xl md:text-8xl font-bold tracking-tight text-transparent bg-clip-text bg-gradient-to-b from-amber-200 via-amber-400 to-amber-600 title-glow">
          TRBSA FEUD
        </h1>
        <p className="mt-3 text-base sm:text-lg text-blue-100/80 font-light">
          Create your own survey and start the game.
        </p>
      </motion.header>

      {/* Form Card */}
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
          delay: 0.15
        }}
        className="w-full max-w-3xl relative z-10">
        
        <div className="rounded-[28px] bg-white/5 backdrop-blur-xl border border-white/15 shadow-[0_20px_80px_rgba(0,0,0,0.4),inset_0_1px_0_rgba(255,255,255,0.1)] p-6 sm:p-10">
          {/* Question */}
          <label className="block">
            <span className="block text-sm font-display uppercase tracking-[0.2em] text-amber-300/90 mb-2">
              Survey Question
            </span>
            <input
              type="text"
              value={survey.question}
              onChange={(e) =>
              setSurvey((s) => ({
                ...s,
                question: e.target.value
              }))
              }
              placeholder="e.g. Name something you find in every Filipino home"
              className="w-full px-5 py-4 rounded-2xl bg-white/10 border border-white/20 text-white placeholder-white/40 text-lg focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent transition" />
            
          </label>

          {/* Count selector */}
          <div className="mt-6 flex flex-wrap items-center gap-3">
            <span className="text-sm font-display uppercase tracking-[0.2em] text-amber-300/90">
              Number of answers
            </span>
            <div className="flex gap-2">
              {ANSWER_OPTIONS.map((n) =>
              <button
                key={n}
                type="button"
                onClick={() => changeCount(n)}
                className={`w-12 h-12 rounded-2xl font-display text-lg font-bold border-2 transition ${survey.answerCount === n ? 'bg-amber-400 border-amber-300 text-blue-950 shadow-lg shadow-amber-500/30' : 'bg-white/5 border-white/15 text-white/70 hover:bg-white/10'}`}>
                
                  {n}
                </button>
              )}
            </div>
          </div>

          {/* Answers */}
          <div className="mt-8">
            <div className="text-sm font-display uppercase tracking-[0.2em] text-amber-300/90 mb-3">
              Answers
            </div>
            <div className="space-y-1">
              <AnimatePresence initial={false}>
                {survey.answers.map((a, i) =>
                <AnswerRow
                  key={a.id}
                  index={i}
                  answer={a}
                  onChange={(next) => updateAnswer(i, next)}
                  onDelete={() => deleteAnswer(i)}
                  canDelete={survey.answers.length > 1} />

                )}
              </AnimatePresence>
            </div>

            <button
              type="button"
              onClick={addAnswer}
              className="mt-4 inline-flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-white/5 border border-white/20 text-white/80 hover:bg-white/10 hover:text-white transition text-sm font-medium">
              
              <PlusIcon size={16} />
              Add Answer
            </button>
          </div>

          {/* Action buttons */}
          <div className="mt-10 flex flex-col-reverse sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={loadSample}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-white/5 border border-white/20 text-white/80 hover:bg-white/10 hover:text-white transition text-sm font-medium">
                
                <SparklesIcon size={16} />
                Load Sample
              </button>
              <button
                type="button"
                onClick={reset}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-white/5 border border-white/20 text-white/80 hover:bg-white/10 hover:text-white transition text-sm font-medium">
                
                <RotateCcwIcon size={16} />
                Reset
              </button>
            </div>

            <motion.button
              type="button"
              onClick={start}
              disabled={!isValid}
              whileHover={
              isValid ?
              {
                scale: 1.03
              } :
              {}
              }
              whileTap={
              isValid ?
              {
                scale: 0.97
              } :
              {}
              }
              animate={
              isValid ?
              {
                boxShadow: [
                '0 0 0 0 rgba(251,191,36,0.4)',
                '0 0 0 14px rgba(251,191,36,0)']

              } :
              {}
              }
              transition={
              isValid ?
              {
                duration: 1.6,
                repeat: Infinity,
                ease: 'easeOut'
              } :
              {}
              }
              className={`inline-flex items-center justify-center gap-3 px-8 py-4 rounded-2xl font-display text-xl font-bold tracking-wide transition shadow-xl ${isValid ? 'bg-gradient-to-b from-amber-300 via-amber-400 to-amber-600 text-blue-950 border-2 border-amber-200 cursor-pointer' : 'bg-white/10 text-white/30 border-2 border-white/10 cursor-not-allowed'}`}>
              
              <PlayIcon size={22} fill="currentColor" />
              Start Game
            </motion.button>
          </div>
        </div>
      </motion.div>

      <p className="mt-8 text-xs text-blue-100/40 relative z-10">
        Your survey is saved automatically.
      </p>
    </div>);

}