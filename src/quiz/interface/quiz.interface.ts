export interface QuizRawStats {
  solvedCnt: number;
  totalCnt: number;
  solveStreak: number;
  solvedAttemptsStats: Record<number, number>;
}

export interface QuizDifficultyStats {
  [difficulty: string]: QuizRawStats;
}
