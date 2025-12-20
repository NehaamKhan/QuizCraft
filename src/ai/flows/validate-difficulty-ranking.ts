'use server';

/**
 * @fileOverview This flow validates the difficulty ranking of quiz questions.
 *
 * - validateDifficultyRanking - A function that validates the difficulty ranking of quiz questions.
 * - ValidateDifficultyRankingInput - The input type for the validateDifficultyRanking function.
 * - ValidateDifficultyRankingOutput - The return type for the validateDifficultyRanking function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ValidateDifficultyRankingInputSchema = z.object({
  questions: z.array(
    z.object({
      question: z.string().describe('The quiz question.'),
      answer: z.string().describe('The correct answer to the question.'),
      difficulty: z
        .enum(['easy', 'medium', 'hard'])
        .describe('The assigned difficulty level of the question.'),
    })
  ).describe('An array of quiz questions with their answers and assigned difficulty levels.'),
});
export type ValidateDifficultyRankingInput = z.infer<typeof ValidateDifficultyRankingInputSchema>;

const ValidateDifficultyRankingOutputSchema = z.object({
  validationResults: z.array(
    z.object({
      questionIndex: z.number().describe('The index of the question in the input array.'),
      isValid: z.boolean().describe('Whether the assigned difficulty level is valid for the question.'),
      reason: z.string().describe('The reason for the validation result.'),
    })
  ).describe('An array of validation results for each question.'),
});
export type ValidateDifficultyRankingOutput = z.infer<typeof ValidateDifficultyRankingOutputSchema>;

export async function validateDifficultyRanking(
  input: ValidateDifficultyRankingInput
): Promise<ValidateDifficultyRankingOutput> {
  return validateDifficultyRankingFlow(input);
}

const validateDifficultyRankingPrompt = ai.definePrompt({
  name: 'validateDifficultyRankingPrompt',
  input: {schema: ValidateDifficultyRankingInputSchema},
  output: {schema: ValidateDifficultyRankingOutputSchema},
  prompt: `You are an expert quiz validator. You are given a list of quiz questions, their correct answers, and their assigned difficulty levels (easy, medium, or hard).

  Your task is to validate whether the assigned difficulty level is appropriate for each question.

  Provide a validation result for each question, including whether the assigned difficulty level is valid and a brief reason for your assessment.

  The validationResults array should contain one object for each question in the input, with the questionIndex, isValid, and reason fields populated appropriately.

  Here are the quiz questions:
  {{#each questions}}
  Question {{@index}}: {{{this.question}}}
  Answer: {{{this.answer}}}
  Assigned Difficulty: {{{this.difficulty}}}
  {{/each}}`,
});

const validateDifficultyRankingFlow = ai.defineFlow(
  {
    name: 'validateDifficultyRankingFlow',
    inputSchema: ValidateDifficultyRankingInputSchema,
    outputSchema: ValidateDifficultyRankingOutputSchema,
  },
  async input => {
    const {output} = await validateDifficultyRankingPrompt(input);
    return output!;
  }
);
