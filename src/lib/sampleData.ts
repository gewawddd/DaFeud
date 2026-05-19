import { Survey, genId } from './storage';

export function getSampleSurvey(): Survey {
  return {
    rounds: [
    {
      id: genId(),
      title: 'Round 1',
      question:
      'Sabihin ang isang bagay na laging hinahanap ng mga Pilipino sa bahay.',
      answerCount: 4,
      answers: [
      { id: genId(), text: "Suka't Toyo", points: 35 },
      { id: genId(), text: 'Bigas', points: 28 },
      { id: genId(), text: 'Asin', points: 15 },
      { id: genId(), text: 'Sabon', points: 10 }]

    },
    {
      id: genId(),
      title: 'Round 2',
      question: 'Banggitin ang isang bagay na laging nasa ref.',
      answerCount: 4,
      answers: [
      { id: genId(), text: 'Tubig', points: 30 },
      { id: genId(), text: 'Kanin', points: 22 },
      { id: genId(), text: 'Gatas', points: 18 },
      { id: genId(), text: 'Prutas', points: 12 }]

    },
    {
      id: genId(),
      title: 'Round 3',
      question: 'Pangalan ng bagay na dala ng tao kapag umuulan.',
      answerCount: 4,
      answers: [
      { id: genId(), text: 'Payong', points: 38 },
      { id: genId(), text: 'Kapote', points: 20 },
      { id: genId(), text: 'Bota', points: 14 },
      { id: genId(), text: 'Jacket', points: 8 }]

    }]
  };
}

export function getEmptySurvey(roundCount = 3, answersPerQuestion = 4): Survey {
  return {
    rounds: Array.from({ length: roundCount }, (_, i) => ({
      id: genId(),
      title: `Round ${i + 1}`,
      question: '',
      answerCount: answersPerQuestion,
      answers: Array.from({ length: answersPerQuestion }, () => ({
        id: genId(),
        text: '',
        points: '' as const
      }))
    }))
  };
}