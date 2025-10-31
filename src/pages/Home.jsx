import { useNavigate } from 'react-router-dom';
import { useQuiz } from '../context/QuizContext';

const Home = () => {
  const navigate = useNavigate();
  const { loading, error, score, resetQuiz, fetchArticle, generateQuiz } = useQuiz();

  const handleStart = async () => {
    try {
      // Reset any previous quiz state
      resetQuiz();

      // Fetch article and generate quiz
      const articleData = await fetchArticle();
      await generateQuiz(articleData);

      // Navigate to quiz page
      navigate('/quiz');
    } catch (err) {
      console.error('Error starting quiz:', err);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="max-w-2xl w-full bg-white rounded-2xl shadow-xl p-8 md:p-12">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            MLB日本人選手クイズ
          </h1>
          <div className="inline-block bg-blue-100 text-blue-800 px-4 py-2 rounded-full text-sm font-semibold mb-2">
            カテゴリ: MLBの日本人選手
          </div>
          {/* Score Display */}
          <div className="mt-3">
            <div className="inline-flex items-center bg-green-100 text-green-800 px-4 py-2 rounded-full text-sm font-semibold">
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              連続正解数: {score}問
            </div>
          </div>
        </div>

        {/* Description */}
        <div className="mb-8 text-gray-600 space-y-3">
          <p className="text-lg">
            Wikipedia記事から生成されるクイズで、MLB日本人選手について学びましょう！
          </p>
          <p>
            選手の経歴や実績についての問題に答えて、あなたの知識を試してみてください。
          </p>

          {/* Game Rules */}
          <div className="bg-gray-50 rounded-lg p-4 mt-4">
            <h2 className="font-semibold text-gray-900 mb-2">遊び方</h2>
            <ul className="text-sm space-y-1 list-disc list-inside">
              <li>記事の概要から選手を当ててください</li>
              <li>困ったら3段階のヒントを使えます</li>
              <li>正解すると詳しい解説が見られます</li>
              <li>Wikipedia記事へのリンクもあります</li>
            </ul>
          </div>
        </div>

        {/* Error Display */}
        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
            {error}
          </div>
        )}

        {/* Start Button */}
        <button
          onClick={handleStart}
          disabled={loading}
          className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-bold py-4 px-6 rounded-xl text-lg transition-colors duration-200 shadow-lg hover:shadow-xl disabled:cursor-not-allowed"
        >
          {loading ? (
            <span className="flex items-center justify-center">
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              読み込み中...
            </span>
          ) : (
            'クイズを始める'
          )}
        </button>

        {/* Footer */}
        <div className="mt-8 text-center text-sm text-gray-500">
          <p>Powered by Wikipedia & Gemini AI</p>
        </div>
      </div>
    </div>
  );
};

export default Home;
