export type Answer = {
  id: string;
  text: string;
  points: number | '';
};

export type Survey = {
  question: string;
  answerCount: number;
  answers: Answer[];
};

export type GameState = {
  revealed: string[]; // answer ids
};

const SURVEY_KEY = 'trbsa-feud-survey';
const GAME_KEY = 'trbsa-feud-game';

export function loadSurvey(): Survey | null {
  try {
    const raw = localStorage.getItem(SURVEY_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as Survey;
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
    return JSON.parse(raw) as GameState;
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