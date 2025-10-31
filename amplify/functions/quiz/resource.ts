import { defineFunction } from '@aws-amplify/backend';

export const quiz = defineFunction({
  name: 'quiz',
  entry: './handler.ts',
  environment: {
    // Gemini API key will be added here
    GEMINI_API_KEY: process.env.GEMINI_API_KEY || '',
  },
  timeoutSeconds: 60,
});
