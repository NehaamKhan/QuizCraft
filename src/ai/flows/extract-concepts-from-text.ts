'use server';

/**
 * @fileOverview Extracts key concepts from an input text using AI.
 *
 * - extractConcepts - A function that extracts key concepts from text.
 * - ExtractConceptsInput - The input type for the extractConcepts function.
 * - ExtractConceptsOutput - The return type for the extractConcepts function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ExtractConceptsInputSchema = z.object({
  text: z.string().describe('The input text from which to extract concepts.'),
});

export type ExtractConceptsInput = z.infer<typeof ExtractConceptsInputSchema>;

const ExtractConceptsOutputSchema = z.object({
  concepts: z.array(z.string()).describe('The key concepts extracted from the text.'),
});

export type ExtractConceptsOutput = z.infer<typeof ExtractConceptsOutputSchema>;

export async function extractConcepts(input: ExtractConceptsInput): Promise<ExtractConceptsOutput> {
  return extractConceptsFlow(input);
}

const extractConceptsPrompt = ai.definePrompt({
  name: 'extractConceptsPrompt',
  input: {schema: ExtractConceptsInputSchema},
  output: {schema: ExtractConceptsOutputSchema},
  prompt: `Extract the key concepts from the following text:\n\n{{text}}\n\nReturn these concepts as a list of strings.`,
});

const extractConceptsFlow = ai.defineFlow(
  {
    name: 'extractConceptsFlow',
    inputSchema: ExtractConceptsInputSchema,
    outputSchema: ExtractConceptsOutputSchema,
  },
  async input => {
    const {output} = await extractConceptsPrompt(input);
    return output!;
  }
);
