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
import type { SummarizePerformanceInput, SummarizePerformanceOutput } from '@/app/actions';


export async function summarizePerformance(
  input: SummarizePerformanceInput
): Promise<SummarizePerformanceOutput> {
  // Note: We are not using a structured prompt here to avoid exporting schemas
  // from a 'use server' file, which causes Next.js build errors.
  // The validation is handled in the calling server action.
  const prompt = `You are an expert educator providing feedback on a quiz. Analyze the user's performance based on the following questions and their answers.

Provide a concise, insightful, and encouraging summary of their performance.
- Highlight the concepts they seem to understand well (based on correct answers).
- Gently point out areas or concepts where they might need review (based on incorrect answers).
- Keep the tone positive and constructive.
- Format the output as a markdown string.

The final output should be a JSON object with a single key "summary" containing the markdown string.

Here are the results:
${input.questions.map(q => `---
Question: ${q.question}
${q.isCorrect ? 'Result: CORRECT' : `Result: INCORRECT
User's Answer: ${q.options[q.userAnswerIndex!]}
Correct Answer: ${q.options[q.correctAnswerIndex]}`}
`).join('\n')}
`;

  const {output} = await ai.generate({
    prompt,
    model: 'googleai/gemini-2.5-flash',
    format: 'json'
  });

  return output as SummarizePerformanceOutput;
}
