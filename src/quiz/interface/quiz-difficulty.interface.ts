import { QuizDifficulty } from '../enum/quiz.enum';

interface DifficultyConfig {
  lengthMin: number;
  lengthMax: number;
  countMin: number;
  countMax: number;
  complexVowel: boolean;
  complexConsonant: boolean;
  maxAttempts: number;
}

export const DIFFICULTY_MAP: Readonly<Record<QuizDifficulty, DifficultyConfig>> = {
  [QuizDifficulty.EASY]: {
    lengthMin: 2,
    lengthMax: 3,
    countMin: 4,
    countMax: 6,
    complexVowel: false,
    complexConsonant: false,
    maxAttempts: 6,
  },
  [QuizDifficulty.MEDIUM]: {
    lengthMin: 2,
    lengthMax: 3,
    countMin: 6,
    countMax: 9,
    complexVowel: undefined,
    complexConsonant: undefined,
    maxAttempts: 6,
  },
  [QuizDifficulty.HARD]: {
    lengthMin: 3,
    lengthMax: 3,
    countMin: 7,
    countMax: 11,
    complexVowel: undefined,
    complexConsonant: undefined,
    maxAttempts: 6,
  },
  [QuizDifficulty.VERYHARD]: {
    lengthMin: 3,
    lengthMax: 4,
    countMin: 8,
    countMax: 16,
    complexVowel: undefined,
    complexConsonant: undefined,
    maxAttempts: 6,
  },
} as const;
