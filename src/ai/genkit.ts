import {genkit} from 'genkit';
import {googleAI} from '@genkit-ai/google-genai';

export const ai = genkit({
  plugins: [googleAI()],
  plugins: [googleAI({apiKey: process.env.AIzaSyD7gN68133FBirtgE4AAMEVOVNcTLjZnIw})],
  model: 'googleai/gemini-2.5-flash',
});
