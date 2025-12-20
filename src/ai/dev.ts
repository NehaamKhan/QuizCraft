import { config } from 'dotenv';
config();

import '@/ai/flows/generate-quiz-questions.ts';
import '@/ai/flows/validate-difficulty-ranking.ts';
import '@/ai/flows/extract-concepts-from-text.ts';
import '@/ai/flows/rank-questions-by-difficulty.ts';
import '@/ai/flows/summarize-performance.ts';
