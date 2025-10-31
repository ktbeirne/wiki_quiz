import type { APIGatewayProxyHandler, APIGatewayProxyResult } from 'aws-lambda';
import { v4 as uuidv4 } from 'uuid';
import axios from 'axios';
import * as cheerio from 'cheerio';
import { GoogleGenerativeAI, SchemaType } from '@google/generative-ai';

/**
 * Lambda handler for article fetching and structuring
 * Fetches a random MLB Japanese player Wikipedia article and structures it using Gemini API
 */
export const handler = async (event: any): Promise<APIGatewayProxyResult> => {
  console.log('Article function invoked', event);

  try {
    // Step 1: Fetch random MLB Japanese player Wikipedia article
    const wikiUrl = 'https://ja.wikipedia.org/wiki/Special:RandomInCategory/MLBの日本人選手';
    const response = await axios.get(wikiUrl, {
      maxRedirects: 5,
      validateStatus: (status) => status >= 200 && status < 400,
    });

    const finalUrl = response.request.res.responseUrl || wikiUrl;
    console.log('Final Wikipedia URL:', finalUrl);

    // Step 2: Extract article content using Cheerio
    const $ = cheerio.load(response.data);

    // Get article title
    const articleTitle = $('#firstHeading').text().trim();
    console.log('Article title:', articleTitle);

    // Get article text (first few paragraphs)
    const paragraphs: string[] = [];
    $('#mw-content-text .mw-parser-output > p').each((i, elem) => {
      if (i < 5) { // Get first 5 paragraphs
        const text = $(elem).text().trim();
        if (text.length > 50) { // Only meaningful paragraphs
          paragraphs.push(text);
        }
      }
    });

    const articleText = paragraphs.join('\n\n');
    console.log('Extracted article text length:', articleText.length);

    if (!articleText || articleText.length < 100) {
      throw new Error('Failed to extract sufficient article content');
    }

    // Step 3: Structure content using Gemini API
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error('GEMINI_API_KEY environment variable is not set');
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({
      model: 'gemini-flash-latest',
      generationConfig: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: SchemaType.OBJECT,
          properties: {
            articleTitle: { type: SchemaType.STRING },
            summary: { type: SchemaType.STRING },
            keyFacts: {
              type: SchemaType.ARRAY,
              items: { type: SchemaType.STRING },
            },
            category: { type: SchemaType.STRING },
          },
          required: ['articleTitle', 'summary', 'keyFacts', 'category'],
        },
      },
    });

    const prompt = `あなたはWikipedia記事を分析する専門家です。
以下のMLB日本人選手に関するWikipedia記事から、重要な情報を抽出してJSON形式で構造化してください。

記事タイトル: ${articleTitle}
記事本文:
${articleText}

以下のJSON形式で出力してください:
{
  "articleTitle": "選手の名前",
  "summary": "Wikipedia記事の概要（100-200文字程度、経歴や主な実績を含む）",
  "keyFacts": ["重要な事実1", "重要な事実2", "重要な事実3"],
  "category": "投手/野手/投手・野手のいずれか"
}`;

    const result = await model.generateContent(prompt);
    const geminiResponse = result.response.text();
    console.log('Gemini API response:', geminiResponse);

    const structuredContent = JSON.parse(geminiResponse);

    // Step 4: Prepare final response
    const articleId = uuidv4();
    const finalResponse = {
      articleId,
      category: 'MLBの日本人選手',
      articleTitle: structuredContent.articleTitle || articleTitle,
      articleUrl: finalUrl,
      structuredContent: {
        summary: structuredContent.summary,
        keyFacts: structuredContent.keyFacts,
        category: structuredContent.category,
      },
    };

    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(finalResponse),
    };
  } catch (error) {
    console.error('Error in article function:', error);
    return {
      statusCode: 500,
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        error: 'Failed to fetch and structure article',
        message: error instanceof Error ? error.message : 'Unknown error',
      }),
    };
  }
};
