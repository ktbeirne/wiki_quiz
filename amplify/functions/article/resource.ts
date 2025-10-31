import { defineFunction } from '@aws-amplify/backend';

export const article = defineFunction({
  name: 'article',
  entry: './handler.ts',
  environment: {
    // Gemini API key will be added here
    GEMINI_API_KEY: process.env.GEMINI_API_KEY || '',
  },
  timeoutSeconds: 60,
});
