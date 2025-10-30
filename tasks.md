# MLB日本人選手クイズアプリ - タスクリスト

## 概要
このタスクリストは、require.mdに基づいて作成されたMVP開発のための実装タスクです。

---

## 🎉 完了済み作業 (2025-10-30)

### Git/GitHub セットアップ
- ✅ Gitリポジトリ初期化
- ✅ GitHubリポジトリ連携: https://github.com/ktbeirne/wiki_quiz
- ✅ mainブランチ作成・初回コミット
- ✅ devブランチ作成

### 自動化・CI/CD
- ✅ CodeRabbit自動PRレビュー設定
  - `.coderabbit.yaml` 作成（日本語レビュー、自動レビュー有効化）
  - GitHubアプリ連携完了
  - PR #1 でレビュー動作確認済み
- ✅ AWS Amplify Hosting 自動デプロイ設定
  - GitHub連携完了
  - mainブランチへのマージで自動デプロイ
  - デプロイURL: https://main.d1w4eib1zil6od.amplifyapp.com/

### フロントエンド基盤
- ✅ React 19.2.0 + Vite 7.1.12 セットアップ
- ✅ TypeScript 5.9.3 設定
- ✅ 基本的なプロジェクト構造作成
  - `src/main.jsx` (エントリーポイント)
  - `src/App.jsx` (ルートコンポーネント)
  - `src/App.css`, `src/index.css` (スタイル)
  - `index.html`
- ✅ ランディングページ実装
  - タイトル: "MLB日本人選手クイズ"
  - 説明文
  - "クイズを始める" ボタン（UI のみ）

### バックエンド基盤
- ✅ AWS Amplify Gen 2 セットアップ
  - `@aws-amplify/backend` 1.17.0
  - `@aws-amplify/backend-cli` 1.8.0
  - `aws-amplify` 6.15.7
- ✅ `amplify/backend.ts` 作成（空の定義）
- ✅ `amplify/tsconfig.json` 作成
- ✅ `amplify.yml` 作成（CI/CDビルド設定）
- ✅ Amplify CLI 14.2.0 インストール
- ✅ AWS認証情報設定完了

### 開発ワークフロー確認
- ✅ devブランチで開発 → PR作成 → CodeRabbitレビュー → mainマージ → 自動デプロイ
- ✅ PR #1: "Initial setup: React app + Amplify Gen 2 backend" マージ完了

---

## Phase 1: プロジェクトセットアップ

### 1.1 フロントエンド環境構築
- [x] Viteを使用してReactプロジェクトを作成
  ```bash
  npm create vite@latest wiki-quiz -- --template react
  ```
- [x] プロジェクトの依存関係をインストール
- [ ] Tailwind CSSのインストールと設定
  - [ ] tailwindcss, postcss, autoprefixerのインストール
  - [ ] `tailwind.config.js`の作成と設定
  - [ ] `index.css`にTailwindディレクティブを追加
- [ ] React Router v6のインストール
  ```bash
  npm install react-router-dom
  ```
- [ ] フォルダ構造の作成
  ```
  src/
  ├── components/      # Reactコンポーネント
  ├── context/         # Context API
  ├── hooks/           # カスタムフック
  ├── pages/           # ページコンポーネント
  ├── services/        # API通信
  ├── types/           # TypeScript型定義（オプション）
  └── utils/           # ユーティリティ関数
  ```

### 1.2 バックエンド環境構築（AWS Amplify）
- [x] AWS Amplify CLIのインストール
  ```bash
  npm install -g @aws-amplify/cli
  ```
- [x] Amplifyプロジェクトの初期化（Gen 2形式）
  ```bash
  # Gen 2では amplify/backend.ts を作成
  ```
- [ ] API (REST) の追加
  ```bash
  amplify add api
  ```
- [ ] Lambda関数の作成
  - [ ] `/article` エンドポイント用Lambda関数
    - Wikipedia記事取得
    - Gemini APIで構造化JSON生成
  - [ ] `/quiz` エンドポイント用Lambda関数
    - 構造化JSONからクイズ生成
- [ ] 環境変数の設定
  - [ ] Gemini APIキーの登録
  - [ ] Lambda関数の環境変数設定
- [ ] CORSの設定
- [ ] Amplifyのデプロイ
  ```bash
  amplify push
  ```

---

## Phase 2: バックエンドAPI実装

### 2.1 Lambda関数: 記事取得・構造化 (`/article`)
- [ ] Wikipedia記事取得ロジックの実装
  - [ ] `https://ja.wikipedia.org/wiki/Special:RandomInCategory/MLBの日本人選手` からHTMLを取得
  - [ ] HTTPリクエストライブラリ（axios等）のインストール
  - [ ] リダイレクト処理の実装
- [ ] Gemini API連携の実装
  - [ ] Gemini API SDKのインストール
  - [ ] APIキーの読み込み
  - [ ] 記事構造化プロンプトの実装
  - [ ] JSON出力モードの設定 (`response_mime_type="application/json"`)
- [ ] レスポンス形式の実装
  ```json
  {
    "articleId": "uuid",
    "category": "MLBの日本人選手",
    "articleTitle": "選手名",
    "articleUrl": "...",
    "structuredContent": {
      "summary": "...",
      "keyFacts": ["...", "...", "..."],
      "category": "..."
    }
  }
  ```
- [ ] エラーハンドリング
  - [ ] Wikipedia記事取得失敗時
  - [ ] Gemini API呼び出し失敗時
- [ ] ローカルテスト

### 2.2 Lambda関数: クイズ生成 (`/quiz`)
- [ ] リクエストボディの検証
  - [ ] articleId, structuredContent, articleTitleの確認
- [ ] Gemini API連携の実装
  - [ ] クイズ生成プロンプトの実装
    - 記事概要ベースの問題文生成
    - 選手名・ポジションなどを伏せ字に変換
  - [ ] JSON出力モードの設定
- [ ] レスポンス形式の実装
  ```json
  {
    "quizId": "uuid",
    "articleTitle": "選手名",
    "question": "伏せ字入り問題文",
    "choices": ["...", "...", "...", "..."],
    "correctAnswer": "...",
    "hints": {
      "hint1": "...",
      "hint2": "...",
      "hint3": "..."
    },
    "explanation": "...",
    "articleUrl": "..."
  }
  ```
- [ ] エラーハンドリング
  - [ ] 不正なリクエストボディ
  - [ ] Gemini API呼び出し失敗時
- [ ] ローカルテスト

---

## Phase 3: フロントエンド - Context/状態管理

### 3.1 QuizContext の作成
- [ ] `src/context/QuizContext.jsx` を作成
- [ ] 状態の定義
  ```typescript
  {
    article: {
      articleId: string,
      articleTitle: string,
      articleUrl: string,
      structuredContent: {...}
    } | null,
    quiz: {
      quizId: string,
      question: string,
      choices: string[],
      correctAnswer: string,
      hints: {...},
      explanation: string,
      articleTitle: string,
      articleUrl: string
    } | null,
    currentHintLevel: 0 | 1 | 2 | 3,
    selectedAnswer: string | null,
    isAnswered: boolean,
    isCorrect: boolean | null
  }
  ```
- [ ] アクション/関数の定義
  - [ ] `fetchArticle()` - 記事取得APIを呼び出し
  - [ ] `generateQuiz()` - クイズ生成APIを呼び出し
  - [ ] `selectAnswer(answer)` - 回答を選択
  - [ ] `submitAnswer()` - 回答を提出・判定
  - [ ] `showNextHint()` - 次のヒントを表示
  - [ ] `resetQuiz()` - クイズをリセット
- [ ] ContextProviderの実装
- [ ] カスタムフック `useQuiz()` の作成

---

## Phase 4: フロントエンド - ページコンポーネント

### 4.1 ホーム画面 (`src/pages/Home.jsx`)
- [ ] コンポーネントの作成
- [ ] UIの実装
  - [ ] アプリケーションタイトル
  - [ ] ゲーム説明文
  - [ ] カテゴリ表示: 「MLBの日本人選手」
  - [ ] 「スタート」ボタン
- [ ] 「スタート」ボタンクリック時の処理
  - [ ] 記事取得API呼び出し
  - [ ] クイズ生成API呼び出し
  - [ ] `/quiz` へ遷移
- [ ] ローディング状態の表示
- [ ] エラー表示
- [ ] Tailwind CSSでスタイリング

### 4.2 クイズ画面 (`src/pages/Quiz.jsx`)
- [ ] コンポーネントの作成
- [ ] UIの実装
  - [ ] カテゴリ名表示
  - [ ] 問題文表示（伏せ字対応）
  - [ ] 4択選択肢（ラジオボタンまたはカード）
  - [ ] ヒントボタン（3段階）
  - [ ] 「回答する」ボタン
  - [ ] 「ホームに戻る」ボタン
- [ ] 選択肢選択の処理
- [ ] ヒント表示の処理
  - [ ] hint1, hint2, hint3を段階的に表示
  - [ ] 使用したヒント数のカウント
- [ ] 回答提出の処理
  - [ ] クライアントサイドで正解判定
  - [ ] 結果表示セクションを表示
- [ ] Tailwind CSSでスタイリング

### 4.3 結果表示セクション（クイズ画面内）
- [ ] コンポーネントの作成（`src/components/QuizResult.jsx`）
- [ ] UIの実装
  - [ ] 正解/不正解の表示
  - [ ] 正解の記事タイトル
  - [ ] 解説文
  - [ ] 使用したヒント数
  - [ ] Wikipedia記事へのリンク
  - [ ] 「次の問題」ボタン
  - [ ] 「ホームに戻る」ボタン
- [ ] 「次の問題」ボタンクリック時の処理
  - [ ] クイズをリセット
  - [ ] 新しい記事取得API呼び出し
  - [ ] 新しいクイズ生成API呼び出し
- [ ] Tailwind CSSでスタイリング

---

## Phase 5: フロントエンド - API通信

### 5.1 API通信サービスの作成
- [ ] `src/services/api.js` を作成
- [ ] 記事取得API関数の実装
  ```javascript
  export const fetchArticle = async () => {
    // POST /api/article
  }
  ```
- [ ] クイズ生成API関数の実装
  ```javascript
  export const generateQuiz = async (articleData) => {
    // POST /api/quiz
  }
  ```
- [ ] エラーハンドリング
- [ ] Amplify APIライブラリの使用
  ```bash
  npm install aws-amplify
  ```

---

## Phase 6: フロントエンド - ルーティング

### 6.1 React Routerの設定
- [ ] `src/App.jsx` でルーティングを設定
  ```javascript
  <Routes>
    <Route path="/" element={<Home />} />
    <Route path="/quiz" element={<Quiz />} />
  </Routes>
  ```
- [ ] QuizContextProviderでアプリ全体をラップ
- [ ] ナビゲーションの実装

---

## Phase 7: スタイリング・UI改善

### 7.1 全体的なデザイン
- [ ] カラースキームの決定
- [ ] 統一感のあるデザインシステムの構築
- [ ] ボタンのホバー/アクティブ状態
- [ ] アニメーション・トランジションの追加（オプション）

### 7.2 レスポンシブ対応（基本）
- [ ] モバイル画面での表示確認
- [ ] タブレット画面での表示確認
- [ ] デスクトップ画面での表示確認

---

## Phase 8: テスト・デバッグ

### 8.1 機能テスト
- [ ] ホーム画面の表示確認
- [ ] 「スタート」ボタンからクイズ画面への遷移確認
- [ ] 記事取得APIの動作確認
- [ ] クイズ生成APIの動作確認
- [ ] 問題文の伏せ字表示確認
- [ ] 選択肢の選択動作確認
- [ ] ヒントの段階表示確認
- [ ] 正解判定の動作確認
- [ ] 結果表示の確認
- [ ] 「次の問題」ボタンの動作確認
- [ ] Wikipedia記事リンクの動作確認

### 8.2 エッジケース対応
- [ ] API呼び出し失敗時の挙動確認
- [ ] ネットワークエラー時の挙動確認
- [ ] 連続して「次の問題」をクリックした場合の動作確認
- [ ] ヒントを全て表示してから回答する場合の動作確認

### 8.3 バグ修正
- [ ] 発見されたバグの記録
- [ ] バグの修正
- [ ] 修正後の動作確認

---

## Phase 9: デプロイ

### 9.1 本番環境へのデプロイ
- [x] Amplify Hostingの設定
- [x] フロントエンドのビルド（自動ビルド設定完了）
  ```bash
  npm run build
  ```
- [x] Amplifyへの自動デプロイ設定（mainブランチへのマージで自動実行）
- [x] 本番環境での動作確認
  - URL: https://main.d1w4eib1zil6od.amplifyapp.com/
  - ランディングページ表示確認済み

### 9.2 ドキュメント作成
- [ ] README.mdの作成
  - プロジェクト概要
  - セットアップ手順
  - 開発手順
  - デプロイ手順
- [ ] 環境変数の設定手順をドキュメント化

---

## Phase 10: 今後の拡張（MVP後）

### 10.1 機能追加
- [ ] カテゴリ選択機能の追加
- [ ] スコア・ポイント管理機能
- [ ] 制限時間機能
- [ ] ローディングインジケーターの改善
- [ ] エラーハンドリングの強化
- [ ] レスポンシブデザインの完全対応
- [ ] 難易度選択機能
- [ ] ユーザーによるカテゴリ自由入力機能

---

## 優先度の高いタスク（最初に着手）

1. ✅ プロジェクトセットアップ（Phase 1）
2. ✅ Lambda関数の実装（Phase 2）
3. ✅ Context/状態管理の実装（Phase 3）
4. ✅ ホーム画面の実装（Phase 4.1）
5. ✅ API通信の実装（Phase 5）
6. ✅ クイズ画面の実装（Phase 4.2）
7. ✅ 結果表示の実装（Phase 4.3）
8. ✅ テスト・デバッグ（Phase 8）
9. ✅ デプロイ（Phase 9）

---

## 注意事項

- **コンテキスト効率**: 1問につきAPI呼び出しは2回のみ
- **セキュリティ**: Gemini APIキーは必ずバックエンド（Lambda）で管理
- **プロンプト設計**: require.mdのプロンプト設計に従う
- **伏せ字処理**: 問題文は選手名・ポジション等を伏せ字にする
- **段階的開発**: MVP機能を優先し、拡張機能は後回し

---

## 進捗管理

各タスクの完了時にチェックボックスをチェックしてください。
- [ ] 未着手
- [x] 完了

現在の進捗: **Phase 1 セットアップ 部分完了**
- ✅ Git/GitHub環境構築完了
- ✅ CI/CD（CodeRabbit + Amplify Hosting）設定完了
- ✅ React + Vite 基盤完了
- ✅ Amplify Gen 2 初期設定完了
- 🔄 次: フロントエンド開発（Phase 3-4）またはバックエンドAPI実装（Phase 2）
