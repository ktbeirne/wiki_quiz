import { useNavigate } from 'react-router-dom';
import { useQuiz } from '../context/QuizContext';
import { fetchArticle, generateQuiz } from '../services/api';
import PropTypes from 'prop-types';

const QuizResult = ({ isCorrect, correctAnswer, explanation, articleUrl, hintsUsed }) => {
  const navigate = useNavigate();
  const { resetQuiz } = useQuiz();

  const handleNextQuestion = async () => {
    try {
      // Reset quiz state
      resetQuiz();

      // Fetch new article and generate new quiz
      const articleData = await fetchArticle();
      await generateQuiz(articleData);

      // Stay on quiz page (will re-render with new quiz)
      // No navigation needed as we're already on /quiz
    } catch (err) {
      console.error('Error loading next question:', err);
    }
  };

  const handleBackHome = () => {
    resetQuiz();
    navigate('/');
  };

  return (
    <div className="bg-white rounded-b-2xl shadow-xl p-6 md:p-8">
      {/* Result Header */}
      <div className={`text-center mb-6 p-6 rounded-xl ${
        isCorrect
          ? 'bg-green-50 border-2 border-green-200'
          : 'bg-red-50 border-2 border-red-200'
      }`}>
        <div className="text-6xl mb-3">
          {isCorrect ? '🎉' : '😢'}
        </div>
        <h2 className={`text-3xl font-bold mb-2 ${
          isCorrect ? 'text-green-700' : 'text-red-700'
        }`}>
          {isCorrect ? '正解！' : '不正解...'}
        </h2>
        {!isCorrect && (
          <p className="text-gray-700 text-lg">
            正解は <span className="font-bold">{correctAnswer}</span> でした
          </p>
        )}
      </div>

      {/* Stats */}
      <div className="mb-6 bg-gray-50 rounded-lg p-4">
        <div className="flex items-center justify-center gap-2 text-gray-700">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span>使用したヒント: {hintsUsed}/3</span>
        </div>
      </div>

      {/* Correct Answer Info */}
      <div className="mb-6">
        <h3 className="text-xl font-bold text-gray-900 mb-3">
          正解の選手: {correctAnswer}
        </h3>
        <p className="text-gray-700 leading-relaxed">
          {explanation}
        </p>
      </div>

      {/* Wikipedia Link */}
      {articleUrl && (
        <div className="mb-6">
          <a
            href={articleUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-800 font-medium"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
            </svg>
            Wikipedia記事を読む
          </a>
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-3">
        <button
          onClick={handleNextQuestion}
          className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200 shadow-lg hover:shadow-xl"
        >
          次の問題へ
        </button>
        <button
          onClick={handleBackHome}
          className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold py-3 px-6 rounded-lg transition-colors duration-200"
        >
          ホームに戻る
        </button>
      </div>
    </div>
  );
};

QuizResult.propTypes = {
  isCorrect: PropTypes.bool.isRequired,
  correctAnswer: PropTypes.string.isRequired,
  explanation: PropTypes.string.isRequired,
  articleUrl: PropTypes.string,
  hintsUsed: PropTypes.number.isRequired,
};

export default QuizResult;
