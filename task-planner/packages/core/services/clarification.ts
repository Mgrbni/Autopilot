const QUESTION_LIMIT = 3;

export function selectClarifyingQuestions(questions: string[]): string[] {
  return questions.slice(0, QUESTION_LIMIT);
}
