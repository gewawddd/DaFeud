export type Answer = {
  id: string;
  text: string;
  points: number | '';
};

export type Round = {
  id: string;
  title: string;
  question: string;
  answerCount: number;
  answers: Answer[];
};

export type Survey = {
  rounds: Round[];
};

export type GameState = {
  roundIndex: number;
  revealedByRound: Record<string, string[]>; // roundId -> answer ids
};

const SURVEY_KEY = 'trbsa-feud-survey';
const GAME_KEY = 'trbsa-feud-game';

export function loadSurvey(): Survey | null {
  try {
    const raw = localStorage.getItem(SURVEY_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as Partial<Survey> & {
      question?: string;
      answerCount?: number;
      answers?: Answer[];
    };
    if (Array.isArray(parsed.rounds)) {
      return parsed as Survey;
    }
    if (typeof parsed.question === 'string' && Array.isArray(parsed.answers)) {
      return {
        rounds: [
        {
          id: genId(),
          title: 'Round 1',
          question: parsed.question,
          answerCount: parsed.answerCount ?? parsed.answers.length,
          answers: parsed.answers
        }]

      };
    }
    return null;
  } catch {
    return null;
  }
}

export function saveSurvey(survey: Survey) {
  try {
    localStorage.setItem(SURVEY_KEY, JSON.stringify(survey));
  } catch {

    // ignore
  }}

export function clearSurvey() {
  try {
    localStorage.removeItem(SURVEY_KEY);
  } catch {

    // ignore
  }}

export function loadGame(): GameState | null {
  try {
    const raw = localStorage.getItem(GAME_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as Partial<GameState> & {
      revealed?: string[];
    };
    if (typeof parsed.roundIndex === 'number' && parsed.revealedByRound) {
      return parsed as GameState;
    }
    return null;
  } catch {
    return null;
  }
}

export function saveGame(state: GameState) {
  try {
    localStorage.setItem(GAME_KEY, JSON.stringify(state));
  } catch {

    // ignore
  }}

export function clearGame() {
  try {
    localStorage.removeItem(GAME_KEY);
  } catch {

    // ignore
  }}

export function genId(): string {
  return Math.random().toString(36).slice(2, 10);
}