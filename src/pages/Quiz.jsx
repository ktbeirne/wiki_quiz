import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuiz } from '../context/QuizContext';
import QuizResult from '../components/QuizResult';

const Quiz = () => {
  const navigate = useNavigate();
  const {
    quiz,
    currentHintLevel,
    selectedAnswer,
    isAnswered,
    isCorrect,
    selectAnswer,
    submitAnswer,
    showNextHint,
  } = useQuiz();

  // Redirect to home if no quiz data
  useEffect(() => {
    if (!quiz) {
      navigate('/');
    }
  }, [quiz, navigate]);

  if (!quiz) {
    return null;
  }

  const handleAnswerSelect = (choice) => {
    selectAnswer(choice);
  };

  const handleSubmit = () => {
    submitAnswer();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8 px-4">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-t-2xl shadow-xl p-6 border-b-2 border-gray-200">
          <div className="flex items-center justify-between">
            <div className="inline-block bg-blue-100 text-blue-800 px-4 py-2 rounded-full text-sm font-semibold">
              カテゴリ: MLBの日本人選手
            </div>
            <button
              onClick={() => navigate('/')}
              className="text-gray-600 hover:text-gray-900 font-medium"
            >
              ホームに戻る
            </button>
          </div>
        </div>

        {!isAnswered ? (
          /* Quiz Section */
          <div className="bg-white rounded-b-2xl shadow-xl p-6 md:p-8">
            {/* Question */}
            <div className="mb-8">
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
                問題
              </h2>
              <p className="text-lg text-gray-800 leading-relaxed">
                {quiz.question}
              </p>
            </div>

            {/* Hints */}
            {currentHintLevel > 0 && (
              <div className="mb-8 space-y-3">
                <h3 className="font-semibold text-gray-900 mb-2">ヒント</h3>
                {currentHintLevel >= 1 && (
                  <div className="bg-yellow-50 border-l-4 border-yellow-400 p-3 rounded">
                    <p className="text-sm text-gray-700">
                      <span className="font-semibold">ヒント1:</span> {quiz.hints.hint1}
                    </p>
                  </div>
                )}
                {currentHintLevel >= 2 && (
                  <div className="bg-yellow-50 border-l-4 border-yellow-400 p-3 rounded">
                    <p className="text-sm text-gray-700">
                      <span className="font-semibold">ヒント2:</span> {quiz.hints.hint2}
                    </p>
                  </div>
                )}
                {currentHintLevel >= 3 && (
                  <div className="bg-yellow-50 border-l-4 border-yellow-400 p-3 rounded">
                    <p className="text-sm text-gray-700">
                      <span className="font-semibold">ヒント3:</span> {quiz.hints.hint3}
                    </p>
                  </div>
                )}
              </div>
            )}

            {/* Choices */}
            <div className="mb-8 space-y-3">
              <h3 className="font-semibold text-gray-900 mb-3">選択肢</h3>
              {quiz.choices.map((choice, index) => (
                <button
                  key={index}
                  onClick={() => handleAnswerSelect(choice)}
                  className={`w-full text-left p-4 rounded-lg border-2 transition-all duration-200 ${
                    selectedAnswer === choice
                      ? 'border-blue-500 bg-blue-50 shadow-md'
                      : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  <span className="font-medium">{choice}</span>
                </button>
              ))}
            </div>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-3">
              {currentHintLevel < 3 && (
                <button
                  onClick={showNextHint}
                  className="flex-1 bg-yellow-500 hover:bg-yellow-600 text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200"
                >
                  ヒントを見る ({currentHintLevel}/3)
                </button>
              )}
              <button
                onClick={handleSubmit}
                disabled={!selectedAnswer}
                className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200 disabled:cursor-not-allowed"
              >
                回答する
              </button>
            </div>
          </div>
        ) : (
          /* Result Section */
          <QuizResult
            isCorrect={isCorrect}
            correctAnswer={quiz.articleTitle}
            explanation={quiz.explanation}
            articleUrl={quiz.articleUrl}
            hintsUsed={currentHintLevel}
          />
        )}
      </div>
    </div>
  );
};

export default Quiz;
