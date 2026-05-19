import { Survey, genId } from './storage';

export function getSampleSurvey(): Survey {
  return {
    question:
    'Sabihin ang isang bagay na laging hinahanap ng mga Pilipino sa bahay.',
    answerCount: 6,
    answers: [
    { id: genId(), text: "Suka't Toyo", points: 35 },
    { id: genId(), text: 'Bigas', points: 28 },
    { id: genId(), text: 'Asin', points: 15 },
    { id: genId(), text: 'Sabon', points: 10 },
    { id: genId(), text: 'Tubig', points: 7 },
    { id: genId(), text: 'Kape', points: 5 }]

  };
}

export function getEmptySurvey(count = 6): Survey {
  return {
    question: '',
    answerCount: count,
    answers: Array.from({ length: count }, () => ({
      id: genId(),
      text: '',
      points: '' as const
    }))
  };
}