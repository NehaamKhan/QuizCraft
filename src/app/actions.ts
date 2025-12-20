'use server';

import { extractConcepts } from '@/ai/flows/extract-concepts-from-text';
import { generateQuizQuestions } from '@/ai/flows/generate-quiz-questions';
import { validateDifficultyRanking } from '@/ai/flows/validate-difficulty-ranking';
import { summarizePerformance } from '@/ai/flows/summarize-performance';
import type { GenerateQuizQuestionsOutput } from '@/ai/flows/generate-quiz-questions';
import type { ValidateDifficultyRankingOutput } from '@/ai/flows/validate-difficulty-ranking';
import { z } from 'zod';


// Define the Zod schema for a single question's result.
const QuestionResultSchema = z.object({
  question: z.string(),
  options: z.array(z.string()),
  correctAnswerIndex: z.number(),
  userAnswerIndex: z.number().optional(),
  isCorrect: z.boolean(),
});


// Define the Zod schema for the input of the summarizePerformance flow.
const SummarizePerformanceInputSchema = z.object({
  questions: z.array(QuestionResultSchema),
});

// Create a TypeScript type from the Zod schema.
export type SummarizePerformanceInput = z.infer<typeof SummarizePerformanceInputSchema>;


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

export async function getPerformanceSummary(results: SummarizePerformanceInput): Promise<{ summary?: string; error?: string }> {
  try {
    // Validate the input using the Zod schema.
    const validatedResults = SummarizePerformanceInputSchema.parse(results);
    
    const performanceResult = await summarizePerformance(validatedResults);
    if (!performanceResult.summary) {
      return { error: 'Could not generate a performance summary.' };
    }
    return { summary: performanceResult.summary };
  } catch (e) {
    console.error(e);
    const errorMessage = e instanceof Error ? e.message : 'An unknown error occurred.';
    
    if (e instanceof z.ZodError) {
      return { error: `Invalid data format for summary generation: ${e.issues.map(i => i.message).join(', ')}` };
    }
    
    return { error: `An unexpected error occurred while generating summary: ${errorMessage}` };
  }
}
