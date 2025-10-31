import { defineBackend } from '@aws-amplify/backend';
import { article } from './functions/article/resource';
import { quiz } from './functions/quiz/resource';
import { FunctionUrlAuthType } from 'aws-cdk-lib/aws-lambda';

/**
 * @see https://docs.amplify.aws/react/build-a-backend/ to add storage, functions, and more
 */
const backend = defineBackend({
  article,
  quiz,
});

// Add Function URLs for direct HTTP access
const articleFunctionUrl = backend.article.resources.lambda.addFunctionUrl({
  authType: FunctionUrlAuthType.NONE,
  cors: {
    allowedOrigins: ['*'],
    allowedMethods: ['POST'] as any,
    allowedHeaders: ['*'],
  },
});

const quizFunctionUrl = backend.quiz.resources.lambda.addFunctionUrl({
  authType: FunctionUrlAuthType.NONE,
  cors: {
    allowedOrigins: ['*'],
    allowedMethods: ['POST'] as any,
    allowedHeaders: ['*'],
  },
});

// Export Function URLs for frontend use
backend.addOutput({
  custom: {
    articleFunctionUrl: articleFunctionUrl.url,
    quizFunctionUrl: quizFunctionUrl.url,
  },
});
