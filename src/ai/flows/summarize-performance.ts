'use server';

/**
 * @fileOverview Generates a performance summary for a completed quiz.
 *
 * - summarizePerformance - A function that generates a performance summary.
 * - SummarizePerformanceInput - The input type for the summarizePerformance function.
 * - SummarizePerformanceOutput - The return type for the summarizePerformance function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const QuestionResultSchema = z.object({
  question: z.string().describe('The quiz question.'),
  options: z.array(z.string()).describe('The multiple-choice options for the question.'),
  correctAnswerIndex: z.number().describe('The index of the correct answer in the options array.'),
  userAnswerIndex: z.number().optional().describe('The index of the user\'s answer.'),
  isCorrect: z.boolean().describe('Whether the user answered the question correctly.'),
});

export const SummarizePerformanceInputSchema = z.object({
  questions: z.array(QuestionResultSchema).describe('The user\'s quiz results.'),
});
export type SummarizePerformanceInput = z.infer<typeof SummarizePerformanceInputSchema>;

export const SummarizePerformanceOutputSchema = z.object({
  summary: z
    .string()
    .describe(
      'A concise, insightful, and encouraging summary of the user\'s performance, highlighting strengths and areas for improvement based on the questions they answered correctly and incorrectly. The summary should be in markdown format.'
    ),
});
export type SummarizePerformanceOutput = z.infer<typeof SummarizePerformanceOutputSchema>;

export async function summarizePerformance(
  input: SummarizePerformanceInput
): Promise<SummarizePerformanceOutput> {
  return summarizePerformanceFlow(input);
}

const prompt = ai.definePrompt({
  name: 'summarizePerformancePrompt',
  input: {schema: SummarizePerformanceInputSchema},
  output: {schema: SummarizePerformanceOutputSchema},
  prompt: `You are an expert educator providing feedback on a quiz. Analyze the user's performance based on the following questions and their answers.

Provide a concise, insightful, and encouraging summary of their performance.
- Highlight the concepts they seem to understand well (based on correct answers).
- Gently point out areas or concepts where they might need review (based on incorrect answers).
- Keep the tone positive and constructive.
- Format the output as a markdown string.

Here are the results:
{{#each questions}}
---
Question: {{{this.question}}}
{{#if this.isCorrect}}
Result: CORRECT
{{else}}
Result: INCORRECT
User's Answer: {{{this.options.[this.userAnswerIndex]}}}
Correct Answer: {{{this.options.[this.correctAnswerIndex]}}}
{{/if}}
{{/each}}
`,
});

const summarizePerformanceFlow = ai.defineFlow(
  {
    name: 'summarizePerformanceFlow',
    inputSchema: SummarizePerformanceInputSchema,
    outputSchema: SummarizePerformanceOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
