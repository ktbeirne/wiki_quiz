import type { APIGatewayProxyHandler, APIGatewayProxyResult } from 'aws-lambda';
import { v4 as uuidv4 } from 'uuid';
import { GoogleGenerativeAI } from '@google/generative-ai';

/**
 * Lambda handler for quiz generation
 * Takes structured article content and generates a quiz question with Gemini API
 */
export const handler = async (event: any): Promise<APIGatewayProxyResult> => {
  console.log('Quiz function invoked', event);

  try {
    // Parse request body
    const body = event.body ? JSON.parse(event.body) : {};
    const { articleId, structuredContent, articleTitle, articleUrl } = body;

    // Validate required fields
    if (!articleId || !structuredContent || !articleTitle) {
      return {
        statusCode: 400,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          error: 'Missing required fields',
          required: ['articleId', 'structuredContent', 'articleTitle'],
        }),
      };
    }

    // Generate quiz using Gemini API
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error('GEMINI_API_KEY environment variable is not set');
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({
      model: 'gemini-flash-latest',
      generationConfig: {
        responseMimeType: 'application/json',
      },
    });

    const prompt = `あなたはクイズ作成者です。
以下の構造化された記事情報から、「この選手は誰でしょう」という形式のクイズを作成してください。

記事タイトル: ${articleTitle}
概要: ${structuredContent.summary}
重要な事実: ${structuredContent.keyFacts.join(', ')}
カテゴリ: ${structuredContent.category}

注意事項:
- questionは記事の概要をベースに、選手名・ポジション・チーム名などを伏せ字（■■■、〇〇〇）に変換してください
- 問題文の最後は「この選手は誰でしょう？」で終わらせてください
- choicesは正解（${articleTitle}）と他のMLB日本人選手3名の計4名を含めてください（有名な選手で、紛らわしい選手を選んでください）
- **重要**: ヒントは必ず問題文に含まれていない新しい情報を提供してください
- hint1: 問題文に書かれていない経歴や背景情報（50文字以内、抽象的）
- hint2: 問題文に書かれていない具体的な記録や成績（50文字以内、中程度）
- hint3: 問題文に書かれていない特徴的なエピソードや愛称（50文字以内、具体的だが正解は直接言わない）
- explanationは正解の解説（100文字程度）

以下のJSON形式で出力してください:
{
  "question": "伏せ字入りの問題文",
  "choices": ["${articleTitle}", "選手2", "選手3", "選手4"],
  "correctAnswer": "${articleTitle}",
  "hints": {
    "hint1": "抽象的なヒント",
    "hint2": "中程度のヒント",
    "hint3": "具体的なヒント"
  },
  "explanation": "正解の解説"
}`;

    const result = await model.generateContent(prompt);
    const geminiResponse = result.response.text();
    console.log('Gemini API response:', geminiResponse);

    const quizData = JSON.parse(geminiResponse);

    // Prepare final response
    const quizId = uuidv4();
    const response = {
      quizId,
      articleTitle,
      question: quizData.question,
      choices: quizData.choices,
      correctAnswer: quizData.correctAnswer || articleTitle,
      hints: quizData.hints,
      explanation: quizData.explanation,
      articleUrl: articleUrl || '',
    };

    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(response),
    };
  } catch (error) {
    console.error('Error in quiz function:', error);
    return {
      statusCode: 500,
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        error: 'Failed to generate quiz',
        message: error instanceof Error ? error.message : 'Unknown error',
      }),
    };
  }
};
