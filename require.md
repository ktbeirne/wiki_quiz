# Wikipedia クイズアプリケーション - 要件定義書

## プロジェクト概要

### アプリケーション名
Wikipedia クイズ - 「これは何の記事でしょう」

### 目的
日本語版Wikipediaの記事を使用したクイズゲーム。Gemini APIで生成された問題と選択肢に答え、段階的なヒントを活用しながら正解を目指すSPAアプリケーション。

### アーキテクチャ
**Single Page Application (SPA)**
- クライアントサイドのみでレンダリング
- ページリロードなしでの画面遷移
- React Routerによるクライアントサイドルーティング

---

## 技術スタック

### フロントエンド
- **フレームワーク**: React 18+
- **ルーティング**: React Router v6
- **状態管理**: React Hooks (useState, useContext)
- **スタイリング**: Tailwind CSS
- **ビルドツール**: Vite または Create React App

### バックエンド
- **サーバー**: AWS Amplify
  - API Gateway + Lambda関数
  - Gemini APIキーの安全な管理
  - CORSの適切な設定

### 外部API
1. **Wikipedia ランダム記事取得**
   - URL: `https://ja.wikipedia.org/wiki/Special:RandomInCategory/MLBの日本人選手`
   - **固定カテゴリ**: `MLBの日本人選手` (MVP版)

2. **Gemini API**
   - Google Gemini API (gemini-1.5-flash 推奨)
   - 呼び出し回数: **1問につき2回**
     - 1回目: Wikipedia記事HTMLをJSON形式に構造化
     - 2回目: 構造化JSONから問題文、選択肢、ヒント3つを一括生成

---

## 主要機能

### MVP機能（優先実装）

#### 1. 固定カテゴリ
- **カテゴリ**: `MLBの日本人選手` (固定)
- カテゴリ選択画面なし（将来的な拡張で追加予定）

#### 2. クイズ出題
- **形式**: 4択選択式
- **進行方式**: 1問ずつ出題
- Wikipedia記事からGemini APIが問題を生成
- 選択肢4つから正解を選ぶ

#### 3. ヒント機能
- **段階**: 3段階
  - ヒント1: 軽いヒント（抽象的な情報）
  - ヒント2: 中程度のヒント（具体的な特徴）
  - ヒント3: 強いヒント（ほぼ答えに近い情報）
- 「ヒントを見る」ボタンで順次表示
- 使用したヒント数を記録

#### 4. 正解判定
- 選択肢を選んで「回答する」ボタンクリック
- 正解/不正解の表示
- 正解の場合: 記事タイトルと簡単な解説
- 不正解の場合: 正解の記事タイトルと解説

#### 5. 次の問題へ
- 「次の問題」ボタンで新しい問題を取得
- 同じカテゴリ（MLBの日本人選手）から新しい記事を取得

### 将来的な拡張機能（MVP後）
- **カテゴリ選択機能**（複数カテゴリから選べるように）
- スコア・ポイント管理
- 制限時間
- ローディング状態の改善
- エラーハンドリングの強化
- レスポンシブデザイン（モバイル対応）
- 難易度選択
- ユーザーによるカテゴリ自由入力

---

## 画面構成（SPA）

### 1. ホーム画面 (`/`)
- アプリケーションタイトル
- ゲーム説明
- カテゴリ表示: 「MLBの日本人選手」
- 「スタート」ボタン → クイズ画面へ遷移

### 2. クイズ画面 (`/quiz`)
- カテゴリ名表示: 「MLBの日本人選手」
- 問題文（Gemini生成）
- 4つの選択肢（ラジオボタンまたはカード）
- ヒントボタン（3段階）
  - 「ヒント1を見る」「ヒント2を見る」「ヒント3を見る」
  - クリックでヒントが順次表示される
- 「回答する」ボタン
- 「ホームに戻る」ボタン

### 3. 結果表示画面 (クイズ画面内にモーダルまたはセクション)
- 正解/不正解の表示
- 正解の記事タイトル
- 記事の簡単な解説（Gemini生成）
- 使用したヒント数
- Wikipedia記事へのリンク
- 「次の問題」ボタン
- 「ホームに戻る」ボタン

---

## API仕様

### バックエンド API（AWS Amplify）

**1問につき2回のAPI呼び出しで完結**

#### 1. 記事取得・構造化 API
**エンドポイント**: `POST /api/article`

**リクエスト**:
```json
{}
```
※ リクエストボディは不要（カテゴリ固定のため）

**処理フロー**:
1. 固定Wikipedia URLから記事を取得:
   - `https://ja.wikipedia.org/wiki/Special:RandomInCategory/MLBの日本人選手`
2. Wikipedia記事のHTMLを取得
3. Gemini APIに記事HTMLを送信し、構造化JSONを生成

**レスポンス**:
```json
{
  "articleId": "unique-article-id",
  "category": "MLBの日本人選手",
  "articleTitle": "記事のタイトル（選手名）",
  "articleUrl": "https://ja.wikipedia.org/wiki/...",
  "structuredContent": {
    "summary": "記事の要約（200文字程度）",
    "keyFacts": ["重要な事実1", "重要な事実2", "重要な事実3"],
    "category": "野球選手の特徴（投手/野手、所属チームなど）"
  }
}
```

#### 2. クイズ生成 API
**エンドポイント**: `POST /api/quiz`

**リクエスト**:
```json
{
  "articleId": "unique-article-id",
  "structuredContent": {
    "summary": "記事の要約",
    "keyFacts": ["重要な事実1", "重要な事実2"],
    "category": "..."
  },
  "articleTitle": "記事のタイトル"
}
```

**処理フロー**:
1. 構造化JSONをGemini APIに送信
2. Geminiが以下を一括生成:
   - クイズ問題文
   - 4択選択肢（正解1つ + 誤答3つ）
   - 3段階のヒント（hint1, hint2, hint3）
   - 正解の解説文

**レスポンス**:
```json
{
  "quizId": "unique-quiz-id",
  "articleTitle": "大谷翔平",
  "question": "■■■は、日本のプロ野球および〇〇〇（ポジション）として活躍し、2021年にMLBでMVPを獲得した。投打の二刀流で知られ、ロサンゼルス・■■■（チーム名の一部伏せ）に所属した。",
  "choices": [
    "大谷翔平",
    "ダルビッシュ有",
    "前田健太",
    "田中将大"
  ],
  "correctAnswer": "大谷翔平",
  "hints": {
    "hint1": "この選手は投手と野手の二刀流で活躍しています",
    "hint2": "2021年にアメリカン・リーグMVPを獲得しました",
    "hint3": "ロサンゼルス・エンゼルスからロサンゼルス・ドジャースに移籍しました"
  },
  "explanation": "大谷翔平は投打二刀流でMLB史上初のMVP獲得など数々の記録を打ち立てた選手です。",
  "articleUrl": "https://ja.wikipedia.org/wiki/大谷翔平"
}
```

**注意**:
- **問題文**: Wikipedia記事の概要をベースに、選手名・ポジション・答えに直結する情報を伏せ字（■■■、〇〇〇）に変換
- 正答判定はフロントエンドで実施（`correctAnswer`と比較）
- ヒントは最初から3つすべて含まれており、フロントエンドで段階的に表示
- 追加のAPI呼び出しは不要

---

## データフロー

### クイズプレイフロー（1問につきAPI呼び出し2回）
```
1. ユーザー: ホーム画面で「スタート」ボタンクリック
   ↓
2. フロントエンド: POST /api/article
   ↓
3. バックエンド（1回目のGemini呼び出し）:
   - Wikipedia Special:RandomInCategory/MLBの日本人選手 からHTMLを取得
   - Gemini APIでHTMLを構造化JSONに変換
   ↓
4. フロントエンド: 記事の構造化データを受け取る
   ↓
5. フロントエンド: POST /api/quiz (articleId, structuredContent)
   ↓
6. バックエンド（2回目のGemini呼び出し）:
   - 構造化JSONから問題文、選択肢、ヒント3つを一括生成
   ↓
7. フロントエンド: クイズデータをすべて受け取り、画面に表示
   - 問題文
   - 4つの選択肢
   - ヒント3つ（非表示状態で保持）
   - 正解と解説（非表示状態で保持）
   ↓
8. ユーザー: ヒントボタンクリック（任意）
   ↓
9. フロントエンド: 保持しているヒントを段階的に表示（API呼び出しなし）
   ↓
10. ユーザー: 選択肢を選択して「回答する」
   ↓
11. フロントエンド: クライアントサイドで正解判定（API呼び出しなし）
   ↓
12. フロントエンド: 結果表示（正解、解説、記事URLを表示）
   ↓
13. ユーザー: 「次の問題」または「ホームに戻る」
```

**API呼び出し回数**: 1問につき2回のみ（記事取得+構造化、クイズ生成）

---

## 状態管理

### Context構成
- **QuizContext**: クイズ全体の状態管理
  - 現在のクイズデータ（問題、選択肢、ヒント3つ、正解、解説）
  - ヒント表示レベル（0: 非表示, 1: hint1まで表示, 2: hint2まで表示, 3: hint3まで表示）
  - ユーザーの選択した回答
  - 正解/不正解の状態

### 主要なState
```typescript
{
  article: {
    articleId: string,
    articleTitle: string,
    articleUrl: string,
    structuredContent: {
      summary: string,
      keyFacts: string[],
      category: string  // "野球選手の特徴"など
    }
  } | null,
  quiz: {
    quizId: string,
    question: string,
    choices: string[],
    correctAnswer: string,
    hints: {
      hint1: string,
      hint2: string,
      hint3: string
    },
    explanation: string,
    articleTitle: string,
    articleUrl: string
  } | null,
  currentHintLevel: 0 | 1 | 2 | 3,  // 表示中のヒントレベル
  selectedAnswer: string | null,
  isAnswered: boolean,
  isCorrect: boolean | null
}
```

※ カテゴリは「MLBの日本人選手」固定のため、状態管理は不要

---

## Gemini API プロンプト設計

### 1. 記事構造化プロンプト（1回目の呼び出し）
```
あなたはWikipedia記事を分析する専門家です。以下のMLB日本人選手に関するWikipedia記事のHTMLから、重要な情報を抽出してJSON形式で構造化してください。

記事HTML: {articleHTML}

以下のJSON形式で出力してください：
{
  "articleTitle": "選手の名前",
  "summary": "Wikipedia記事の概要をそのまま転記する",
  "keyFacts": [
    "重要な事実1（例: 所属チーム、ポジション）",
    "重要な事実2（例: 主な実績、記録）",
    "重要な事実3（例: 特徴的なエピソード）"
  ],
  "category": "投手/野手の分類、または主な特徴"
}

注意事項:
- summaryは選手のキャリアの核心部分を簡潔にまとめる
- keyFactsは選手を特定するのに役立つ重要な事実を3つ抽出
- categoryは投手/野手などの分類を明確に
```

### 2. クイズ生成プロンプト（2回目の呼び出し）
```
あなたはクイズ作成者です。以下の構造化されたMLB日本人選手の記事情報から、「この選手は誰でしょう」というクイズを作成してください。

選手名: {articleTitle}
経歴要約: {summary}
重要な事実: {keyFacts}
分類: {category}

以下のJSON形式で出力してください：
{
  "question": "記事の概要を伏せ字にした問題文",
  "choices": ["選手名1（正解）", "選手名2", "選手名3", "選手名4"],
  "correctAnswer": "選手名1（正解）",
  "hints": {
    "hint1": "抽象的なヒント（例: 「この選手は投手として活躍しました」）",
    "hint2": "中程度のヒント（例: 「ヤンキースで活躍しました」）",
    "hint3": "具体的なヒント（例: 「メジャー通算200勝を達成しました」）"
  },
  "explanation": "正解の解説（100文字程度、選手の代表的な実績など）"
}

注意事項:
- questionは記事の要約（summary）をベースに作成し、以下の情報を伏せ字（■■■や〇〇）に置き換える:
  * 選手名（姓・名）
  * 本名
  * 愛称・ニックネーム
  * ポジション（投手、野手、内野手、外野手など）
  * その他、答えに直結する固有名詞
- 概要文をそのまま使い、自然な日本語になるように伏せ字を配置
- 例: 「■■■は、日本のプロ野球および〇〇〇（伏せ字）として活躍した選手である。」
- choices は正解の選手名1つと、他のMLB日本人選手の名前3つ。誤答は適度に紛らわしい選手を選ぶ
- correctAnswerはchoicesの中の正解の選手名をそのまま記載
- hint1は抽象的（ポジションや年代）、hint2は中程度（チーム名や特徴）、hint3は具体的（具体的な実績や記録）な段階的ヒント（各50文字以内）
- explanationは正解の選手の代表的な実績や特徴を簡潔に説明
```

---

## 開発優先順位

### Phase 1: MVP開発
1. Reactプロジェクトセットアップ（Vite + Tailwind CSS）
2. React Routerセットアップ
3. AWS Amplifyセットアップ（Lambda関数2つ）
4. 基本的な画面構成（ホーム、クイズ）
5. Wikipedia Special:RandomInCategory 連携
6. Gemini API連携（記事構造化 + クイズ生成）
7. ヒント機能実装（3段階、フロントエンドで段階表示）
8. 正解判定と結果表示（フロントエンドで判定）
9. Context APIで状態管理

### Phase 2: 改善・拡張
- ローディングインジケーター
- エラーハンドリング（API失敗時の再試行）
- レスポンシブデザイン
- アニメーション・トランジション

### Phase 3: 追加機能
- スコア・ポイントシステム
- 制限時間機能
- 難易度選択
- カテゴリの追加・カスタマイズ

---

## 非機能要件

### セキュリティ
- Gemini APIキーはバックエンド（AWS Amplify）で管理
- フロントエンドには一切露出しない
- CORS設定を適切に行う

### パフォーマンス
- Wikipedia記事取得は軽量なデータのみ（summary）
- Gemini APIレスポンスは10秒以内を目標

### ユーザビリティ
- 直感的なUI/UX
- クリアなフィードバック（正解/不正解）
- シンプルな操作フロー

---

## 参考情報

### Wikipedia ランダム記事取得
- **使用URL**: `https://ja.wikipedia.org/wiki/Special:RandomInCategory/MLBの日本人選手`
- **固定カテゴリ**: `MLBの日本人選手`
- **注意**: カテゴリ名は正確に一致する必要がある

### Gemini API
- ドキュメント: https://ai.google.dev/docs
- モデル推奨: `gemini-1.5-flash` (高速・コスト効率)
- JSON出力モード: `response_mime_type="application/json"` を使用推奨

---

## まとめ

このアプリケーションは、Wikipedia の Special:RandomInCategory とGemini APIを活用した「MLB日本人選手クイズ」です。

### アーキテクチャの特徴
- **SPA構成**: React + React Routerによる完全なクライアントサイドレンダリング
- **効率的なAPI設計**: 1問につき2回のAPI呼び出しで完結
  1. Wikipedia記事のHTML取得 → Geminiで構造化JSON生成
  2. 構造化JSONから問題、選択肢、ヒント3つを一括生成
- **バックエンド**: AWS Amplifyで安全にGemini APIキーを管理
- **固定カテゴリ**: `MLBの日本人選手` (MVP版)

### 開発方針
MVP開発を優先し、段階的に機能を拡張していきます。コンテキスト効率を重視し、ヒント生成や正答判定は動的に行わず、クイズ生成時に一括で取得します。将来的には複数カテゴリ対応も視野に入れています。
