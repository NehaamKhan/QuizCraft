'use server';
/**
 * @fileOverview Ranks quiz questions by difficulty level.
 *
 * - rankQuestionsByDifficulty - A function that ranks the given quiz questions by difficulty.
 * - RankQuestionsByDifficultyInput - The input type for the rankQuestionsByDifficulty function.
 * - RankQuestionsByDifficultyOutput - The return type for the rankQuestionsByDifficulty function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const RankQuestionsByDifficultyInputSchema = z.array(
  z.object({
    question: z.string().describe('The quiz question.'),
    answer: z.string().describe('The answer to the quiz question.'),
  })
).describe('An array of quiz questions and their corresponding answers.');

export type RankQuestionsByDifficultyInput = z.infer<
  typeof RankQuestionsByDifficultyInputSchema
>;

const RankQuestionsByDifficultyOutputSchema = z.array(
  z.object({
    question: z.string().describe('The quiz question.'),
    answer: z.string().describe('The answer to the quiz question.'),
    difficulty: z
      .string()
      .describe(
        'The difficulty level of the question, which can be Easy, Medium, or Hard.'
      ),
  })
).describe('An array of quiz questions, their answers, and their difficulty levels.');

export type RankQuestionsByDifficultyOutput = z.infer<
  typeof RankQuestionsByDifficultyOutputSchema
>;

export async function rankQuestionsByDifficulty(
  input: RankQuestionsByDifficultyInput
): Promise<RankQuestionsByDifficultyOutput> {
  return rankQuestionsByDifficultyFlow(input);
}

const prompt = ai.definePrompt({
  name: 'rankQuestionsByDifficultyPrompt',
  input: {schema: RankQuestionsByDifficultyInputSchema},
  output: {schema: RankQuestionsByDifficultyOutputSchema},
  prompt: `You are an expert quiz question difficulty ranker.

You will be provided a list of quiz questions and their answers. You will rank each question by its difficulty level, which can be Easy, Medium, or Hard.

Here are the quiz questions and answers:
{{#each this}}
Question: {{{question}}}
Answer: {{{answer}}}
{{/each}}

Return the questions with their difficulty level.
`,
});

const rankQuestionsByDifficultyFlow = ai.defineFlow(
  {
    name: 'rankQuestionsByDifficultyFlow',
    inputSchema: RankQuestionsByDifficultyInputSchema,
    outputSchema: RankQuestionsByDifficultyOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
