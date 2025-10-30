# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is an **MLB Japanese Players Quiz Application** - a Single Page Application (SPA) that generates quiz questions from Wikipedia articles using Gemini AI.

**Core Concept**: Users guess MLB Japanese players based on their Wikipedia article summaries with key information (names, positions) redacted using placeholder characters (■■■, 〇〇〇).

## Architecture

### Tech Stack
- **Frontend**: React 18+ with Vite, React Router v6, Tailwind CSS
- **State Management**: React Context API (useState, useContext)
- **Backend**: AWS Amplify (API Gateway + Lambda functions)
- **External APIs**:
  - Wikipedia: `https://ja.wikipedia.org/wiki/Special:RandomInCategory/MLBの日本人選手`
  - Gemini API: `gemini-1.5-flash` model

### Project Structure (Planned)
```
src/
├── components/      # Reusable UI components
├── context/         # QuizContext for global state
├── hooks/           # Custom hooks (e.g., useQuiz)
├── pages/           # Route pages (Home, Quiz)
├── services/        # API communication layer
└── utils/           # Utility functions
```

## Key Design Decisions

### API Call Efficiency
**Critical**: Each quiz question requires exactly **2 API calls** to Gemini:
1. **Article Structuring** (`POST /api/article`): Fetches Wikipedia HTML → Gemini converts to structured JSON
2. **Quiz Generation** (`POST /api/quiz`): Structured JSON → Gemini generates question, 4 choices, 3 hints, explanation

**No additional API calls** for:
- Hint display (all 3 hints pre-generated, shown progressively on frontend)
- Answer validation (done client-side by comparing with `correctAnswer`)

### State Management Pattern
Use `QuizContext` to manage:
- `article`: Structured Wikipedia content
- `quiz`: Question, choices, correctAnswer, hints (all 3 levels), explanation
- `currentHintLevel`: 0-3 (controls which hints are visible)
- `selectedAnswer`, `isAnswered`, `isCorrect`

**Note**: Category is hardcoded as `MLBの日本人選手` (no state needed for MVP).

### Question Generation Rules
Problem statements must:
1. Use Wikipedia article summary as base text
2. Replace with placeholder characters:
   - Player names (first/last) → `■■■`
   - Positions (pitcher/fielder) → `〇〇〇`
   - Nicknames, real names → `■■■`
   - Any answer-revealing proper nouns → appropriate placeholder

Example:
```
"■■■は、日本のプロ野球および〇〇〇（ポジション）として活躍し、
2021年にMLBでMVPを獲得した。"
```

## Gemini API Prompts

### Prompt 1: Article Structuring
```
あなたはWikipedia記事を分析する専門家です。
以下のMLB日本人選手に関するWikipedia記事のHTMLから、
重要な情報を抽出してJSON形式で構造化してください。

Output JSON:
{
  "articleTitle": "選手の名前",
  "summary": "Wikipedia記事の概要をそのまま転記する",
  "keyFacts": ["事実1", "事実2", "事実3"],
  "category": "投手/野手の分類"
}
```

### Prompt 2: Quiz Generation
```
あなたはクイズ作成者です。
以下の構造化された記事情報から、「この選手は誰でしょう」クイズを作成。

注意事項:
- questionは記事要約をベースに、選手名・ポジション等を伏せ字（■■■、〇〇〇）に
- choices は正解+他のMLB日本人選手3名（紛らわしい選手を選ぶ）
- hint1は抽象的、hint2は中程度、hint3は具体的（各50文字以内）

Output JSON:
{
  "question": "伏せ字入り問題文",
  "choices": ["正解", "選手2", "選手3", "選手4"],
  "correctAnswer": "正解",
  "hints": { "hint1": "...", "hint2": "...", "hint3": "..." },
  "explanation": "正解の解説（100文字程度）"
}
```

Use `response_mime_type="application/json"` for reliable JSON output.

## Development Commands

### Initial Setup
```bash
# Create React project with Vite
npm create vite@latest wiki-quiz -- --template react
cd wiki-quiz
npm install

# Install dependencies
npm install react-router-dom
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p

# AWS Amplify setup
npm install -g @aws-amplify/cli
amplify init
amplify add api  # REST API with Lambda functions
amplify push
```

### Development
```bash
npm run dev           # Start dev server
npm run build         # Build for production
npm run preview       # Preview production build
```

### Amplify Deployment
```bash
amplify push          # Deploy backend changes
amplify publish       # Deploy frontend + backend
```

## API Endpoints

### POST /api/article
- **Request**: `{}` (empty - category is hardcoded)
- **Response**: Article structured data (articleId, articleTitle, articleUrl, structuredContent)

### POST /api/quiz
- **Request**: `{ articleId, structuredContent, articleTitle }`
- **Response**: Quiz data (quizId, question, choices, correctAnswer, hints, explanation, articleUrl)

## Security Requirements

- **Never expose Gemini API key in frontend code**
- Store API key in AWS Lambda environment variables
- Configure proper CORS for API Gateway
- Frontend only receives quiz data, never raw API keys

## Routes

- `/` - Home page (title, description, "Start" button)
- `/quiz` - Quiz page (question, 4 choices, hint buttons, answer validation, result display)

## Future Enhancements (Post-MVP)

- Category selection (expand beyond MLB Japanese players)
- Score/points tracking
- Time limits per question
- Enhanced loading states and error handling
- Full responsive design (mobile/tablet)
- Difficulty levels
- Custom category input
