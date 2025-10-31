import amplifyOutputs from '../../amplify_outputs.json';

/**
 * API service for communicating with AWS Lambda backend via Function URLs
 */

const ARTICLE_FUNCTION_URL = amplifyOutputs.custom.articleFunctionUrl;
const QUIZ_FUNCTION_URL = amplifyOutputs.custom.quizFunctionUrl;

/**
 * Fetch a random MLB Japanese player article and structure it
 * @returns {Promise<Object>} Article data with structured content
 */
export const fetchArticle = async () => {
  try {
    const response = await fetch(ARTICLE_FUNCTION_URL, {
      method: 'POST',
      mode: 'cors',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({}),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching article:', error);
    throw new Error(`記事の取得に失敗しました: ${error.message}`);
  }
};

/**
 * Generate a quiz question from article data
 * @param {Object} articleData - Structured article data
 * @returns {Promise<Object>} Quiz data with question, choices, hints, etc.
 */
export const generateQuiz = async (articleData) => {
  try {
    const response = await fetch(QUIZ_FUNCTION_URL, {
      method: 'POST',
      mode: 'cors',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        articleId: articleData.articleId,
        structuredContent: articleData.structuredContent,
        articleTitle: articleData.articleTitle,
        articleUrl: articleData.articleUrl,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error generating quiz:', error);
    throw new Error(`クイズの生成に失敗しました: ${error.message}`);
  }
};
