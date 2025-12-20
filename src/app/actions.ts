'use server';

import { extractConcepts } from '@/ai/flows/extract-concepts-from-text';
import { generateQuizQuestions } from '@/ai/flows/generate-quiz-questions';
import { validateDifficultyRanking } from '@/ai/flows/validate-difficulty-ranking';
import type { GenerateQuizQuestionsOutput } from '@/ai/flows/generate-quiz-questions';
import type { ValidateDifficultyRankingOutput } from '@/ai/flows/validate-difficulty-ranking';

export type QuestionWithValidation = GenerateQuizQuestionsOutput['questions'][0] & {
    validation: ValidateDifficultyRankingOutput['validationResults'][0];
};

export type QuizData = {
  concepts: string[];
  questions: QuestionWithValidation[];
};

export async function generateQuizFromText(
  currentState: any,
  formData: FormData
): Promise<(QuizData & { error?: undefined }) | { error: string; concepts?: undefined; questions?: undefined }> {
  const text = formData.get('text') as string;

  if (!text || text.trim().length < 50) {
    return { error: 'Please enter a text with at least 50 characters.' };
  }

  try {
    const conceptResult = await extractConcepts({ text });
    if (!conceptResult.concepts || conceptResult.concepts.length === 0) {
      return { error: 'Could not extract any concepts from the text.' };
    }

    const conceptsString = conceptResult.concepts.join('\n- ');
    const quizResult = await generateQuizQuestions({ concepts: `- ${conceptsString}` });
    if (!quizResult.questions || quizResult.questions.length === 0) {
      return { error: 'Could not generate quiz questions.' };
    }

    const validationInput = quizResult.questions.map(q => ({
      question: q.question,
      answer: q.options[q.correctAnswerIndex],
      difficulty: q.difficulty,
    }));
    const validationResult = await validateDifficultyRanking({ questions: validationInput });
    
    const combinedQuestions = quizResult.questions.map((question, index) => {
      const validation = validationResult.validationResults.find(v => v.questionIndex === index);
      return {
        ...question,
        validation: validation || { questionIndex: index, isValid: false, reason: 'Validation check failed for this question.' }
      };
    });

    return {
      concepts: conceptResult.concepts,
      questions: combinedQuestions,
    };

  } catch (e) {
    console.error(e);
    const errorMessage = e instanceof Error ? e.message : 'An unknown error occurred.';
    return { error: `An unexpected error occurred: ${errorMessage}` };
  }
}
