import React, { useEffect, useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';
import {
  PlusIcon,
  SparklesIcon,
  RotateCcwIcon,
  PlayIcon,
  Trash2Icon,
  CopyIcon,
  ChevronDownIcon
} from 'lucide-react';
import { Survey, Answer, Round, genId, saveSurvey } from '../lib/storage';
import { getSampleSurvey, getEmptySurvey } from '../lib/sampleData';
import { AnswerRow } from '../components/AnswerRow';
type Props = {
  initialSurvey: Survey | null;
  onStart: (survey: Survey) => void;
};
const ANSWER_OPTIONS = [4, 6, 8, 10, 12];
const DEFAULT_ROUNDS = 3;
const DEFAULT_ANSWER_COUNT = 4;
const MAX_ROUNDS = 12;
const MAX_ANSWERS = 12;
export function SetupScreen({ initialSurvey, onStart }: Props) {
  const [survey, setSurvey] = useState<Survey>(
    () => initialSurvey ?? getEmptySurvey(DEFAULT_ROUNDS, DEFAULT_ANSWER_COUNT)
  );
  const [expandedRoundId, setExpandedRoundId] = useState<string>(
    () => initialSurvey?.rounds?.[0]?.id ?? ''
  );
  // Auto-save
  useEffect(() => {
    saveSurvey(survey);
  }, [survey]);
  useEffect(() => {
    if (!expandedRoundId && survey.rounds[0]) {
      setExpandedRoundId(survey.rounds[0].id);
    }
  }, [expandedRoundId, survey.rounds]);
  const isValid = useMemo(() => {
    if (survey.rounds.length === 0) return false;
    return survey.rounds.every((round) => {
      if (!round.question.trim()) return false;
      if (round.answers.length === 0) return false;
      return round.answers.every(
        (a) => a.text.trim() !== '' && a.points !== '' && Number(a.points) > 0
      );
    });
  }, [survey]);
  function normalizeRoundTitles(rounds: Round[]) {
    return rounds.map((round, idx) => ({
      ...round,
      title: `Round ${idx + 1}`
    }));
  }
  function updateRound(roundId: string, updater: (r: Round) => Round) {
    setSurvey((s) => ({
      ...s,
      rounds: s.rounds.map((r) => r.id === roundId ? updater(r) : r)
    }));
  }
  function updateAnswer(roundId: string, idx: number, next: Answer) {
    updateRound(roundId, (r) => ({
      ...r,
      answers: r.answers.map((a, i) => i === idx ? next : a)
    }));
  }
  function deleteAnswer(roundId: string, idx: number) {
    updateRound(roundId, (r) => ({
      ...r,
      answers: r.answers.filter((_, i) => i !== idx),
      answerCount: Math.max(1, r.answerCount - 1)
    }));
  }
  function addAnswer(roundId: string) {
    const round = survey.rounds.find((r) => r.id === roundId);
    if (!round) return;
    if (round.answers.length >= MAX_ANSWERS) {
      toast.error(`Maximum of ${MAX_ANSWERS} answers reached.`);
      return;
    }
    updateRound(roundId, (r) => ({
      ...r,
      answers: [
      ...r.answers,
      {
        id: genId(),
        text: '',
        points: ''
      }],

      answerCount: r.answerCount + 1
    }));
  }
  function changeCount(roundId: string, count: number) {
    updateRound(roundId, (r) => {
      const current = r.answers;
      let next = current.slice(0, count);
      while (next.length < count) {
        next.push({
          id: genId(),
          text: '',
          points: ''
        });
      }
      return {
        ...r,
        answerCount: count,
        answers: next
      };
    });
  }
  function addRound() {
    if (survey.rounds.length >= MAX_ROUNDS) {
      toast.error(`Maximum of ${MAX_ROUNDS} rounds reached.`);
      return;
    }
    const newRoundId = genId();
    const newRound: Round = {
      id: newRoundId,
      title: 'Round',
      question: '',
      answerCount: DEFAULT_ANSWER_COUNT,
      answers: Array.from({ length: DEFAULT_ANSWER_COUNT }, () => ({
        id: genId(),
        text: '',
        points: ''
      }))
    };
    setSurvey((s) => ({
      ...s,
      rounds: normalizeRoundTitles([...s.rounds, newRound])
    }));
    setExpandedRoundId(newRoundId);
  }
  function duplicateRound(roundId: string) {
    const newRoundId = genId();
    setSurvey((s) => {
      const idx = s.rounds.findIndex((r) => r.id === roundId);
      if (idx < 0) return s;
      if (s.rounds.length >= MAX_ROUNDS) {
        toast.error(`Maximum of ${MAX_ROUNDS} rounds reached.`);
        return s;
      }
      const original = s.rounds[idx];
      const copy: Round = {
        ...original,
        id: newRoundId,
        answers: original.answers.map((a) => ({
          ...a,
          id: genId()
        }))
      };
      const nextRounds = [...s.rounds];
      nextRounds.splice(idx + 1, 0, copy);
      return {
        ...s,
        rounds: normalizeRoundTitles(nextRounds)
      };
    });
    setExpandedRoundId(newRoundId);
  }
  function deleteRound(roundId: string) {
    if (survey.rounds.length <= 1) {
      toast.error('At least 1 round is required.');
      return;
    }
    setSurvey((s) => {
      const next = normalizeRoundTitles(
        s.rounds.filter((r) => r.id !== roundId)
      );
      return {
        ...s,
        rounds: next
      };
    });
    if (expandedRoundId === roundId) {
      setExpandedRoundId('');
    }
  }
  function toggleRound(roundId: string) {
    setExpandedRoundId(roundId);
  }
  function loadSample() {
    const next = getSampleSurvey();
    setSurvey(next);
    setExpandedRoundId(next.rounds[0]?.id ?? '');
    toast.success('Sample survey loaded!');
  }
  function reset() {
    const next = getEmptySurvey(DEFAULT_ROUNDS, DEFAULT_ANSWER_COUNT);
    setSurvey(next);
    setExpandedRoundId(next.rounds[0]?.id ?? '');
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
    <div className="relative min-h-full w-full overflow-x-hidden flex flex-col items-center px-4 sm:px-6 py-10 sm:py-16">
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
        className="w-full max-w-[1400px] relative z-10">
        
        <div className="rounded-[28px] bg-white/5 backdrop-blur-xl border border-white/15 shadow-[0_20px_80px_rgba(0,0,0,0.4),inset_0_1px_0_rgba(255,255,255,0.1)] p-6 sm:p-10">
          {/* Rounds */}
          <div className="flex flex-col gap-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <div className="text-sm font-display uppercase tracking-[0.2em] text-amber-300/90">
                  Rounds
                </div>
                <div className="text-xs text-blue-100/50 mt-1">
                  1 question per round. Default answers: {DEFAULT_ANSWER_COUNT}.
                </div>
              </div>
              <button
                type="button"
                onClick={addRound}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-white/5 border border-white/20 text-white/80 hover:bg-white/10 hover:text-white transition text-sm font-medium">
                
                <PlusIcon size={16} />
                Add Round
              </button>
            </div>

            <div className="space-y-4">
              {survey.rounds.map((round, index) => {
                const expanded = round.id === expandedRoundId;
                return (
                  <div
                    key={round.id}
                    className="rounded-3xl bg-white/5 border border-white/15 overflow-hidden">
                    
                    <div className="flex items-center justify-between gap-3 px-5 sm:px-6 py-4">
                      <button
                        type="button"
                        onClick={() => toggleRound(round.id)}
                        className="flex-1 text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-400/60 rounded-2xl">
                        
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-amber-400 to-amber-600 text-blue-950 font-display text-xl font-bold flex items-center justify-center shadow-lg shadow-amber-500/20">
                            {index + 1}
                          </div>
                          <div className="min-w-0">
                            <div className="text-sm font-display uppercase tracking-[0.2em] text-amber-200/90">
                              {round.title || `Round ${index + 1}`}
                            </div>
                            <div className="text-sm text-blue-100/60 truncate">
                              {round.question || 'Add your question...'}
                            </div>
                          </div>
                        </div>
                      </button>

                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => duplicateRound(round.id)}
                          className="w-10 h-10 rounded-2xl border border-white/15 bg-white/5 text-white/70 hover:bg-white/10 hover:text-white transition"
                          aria-label={`Duplicate ${round.title || `Round ${index + 1}`}`}>
                          
                          <CopyIcon size={16} />
                        </button>
                        <button
                          type="button"
                          onClick={() => deleteRound(round.id)}
                          className="w-10 h-10 rounded-2xl border border-red-500/30 bg-red-500/10 text-red-300 hover:bg-red-500/20 hover:text-red-200 transition"
                          aria-label={`Delete ${round.title || `Round ${index + 1}`}`}>
                          
                          <Trash2Icon size={16} />
                        </button>
                        <ChevronDownIcon
                          size={18}
                          className={`text-white/60 transition ${expanded ? 'rotate-180' : ''}`} />
                      </div>
                    </div>

                    <AnimatePresence initial={false}>
                      {expanded ? (
                        <motion.div
                          key="content"
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          transition={{ duration: 0.25, ease: 'easeOut' }}
                          className="px-5 sm:px-6 pb-6">
                          
                          <label className="block">
                            <span className="block text-xs font-display uppercase tracking-[0.2em] text-amber-300/90 mb-2">
                              Survey Question
                            </span>
                            <input
                              type="text"
                              value={round.question}
                              onChange={(e) =>
                              updateRound(round.id, (r) => ({
                                ...r,
                                question: e.target.value
                              }))
                              }
                              placeholder="e.g. Name something you find in every Filipino home"
                              className="w-full px-5 py-4 rounded-2xl bg-white/10 border border-white/20 text-white placeholder-white/40 text-lg focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent transition" />
                            
                          </label>

                          <div className="mt-5 flex flex-wrap items-center gap-3">
                            <span className="text-xs font-display uppercase tracking-[0.2em] text-amber-300/90">
                              Number of answers
                            </span>
                            <div className="flex gap-2">
                              {ANSWER_OPTIONS.map((n) =>
                              <button
                                key={n}
                                type="button"
                                onClick={() => changeCount(round.id, n)}
                                className={`w-12 h-12 rounded-2xl font-display text-lg font-bold border-2 transition ${round.answerCount === n ? 'bg-amber-400 border-amber-300 text-blue-950 shadow-lg shadow-amber-500/30' : 'bg-white/5 border-white/15 text-white/70 hover:bg-white/10'}`}>
                                
                                  {n}
                                </button>
                              )}
                            </div>
                          </div>

                          <div className="mt-6">
                            <div className="text-xs font-display uppercase tracking-[0.2em] text-amber-300/90 mb-3">
                              Answers
                            </div>
                            <div className="space-y-1">
                              <AnimatePresence initial={false}>
                                {round.answers.map((a, i) =>
                                <AnswerRow
                                  key={a.id}
                                  index={i}
                                  answer={a}
                                  onChange={(next) => updateAnswer(round.id, i, next)}
                                  onDelete={() => deleteAnswer(round.id, i)}
                                  canDelete={round.answers.length > 1} />

                                )}
                              </AnimatePresence>
                            </div>

                            <button
                              type="button"
                              onClick={() => addAnswer(round.id)}
                              className="mt-4 inline-flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-white/5 border border-white/20 text-white/80 hover:bg-white/10 hover:text-white transition text-sm font-medium">
                              
                              <PlusIcon size={16} />
                              Add Answer
                            </button>
                          </div>
                        </motion.div>
                      ) : null}
                    </AnimatePresence>
                  </div>
                );
              })}
            </div>
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