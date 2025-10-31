import { createContext, useContext, useState } from 'react';
import PropTypes from 'prop-types';
import * as api from '../services/api';

const QuizContext = createContext(null);

export const QuizProvider = ({ children }) => {
  // Article state
  const [article, setArticle] = useState(null);

  // Quiz state
  const [quiz, setQuiz] = useState(null);

  // UI state
  const [currentHintLevel, setCurrentHintLevel] = useState(0); // 0-3
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [isCorrect, setIsCorrect] = useState(null);

  // Loading and error states
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  /**
   * Fetch article from API
   */
  const fetchArticle = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await api.fetchArticle();
      setArticle(data);
      return data;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  /**
   * Generate quiz from article data
   */
  const generateQuiz = async (articleData) => {
    setLoading(true);
    setError(null);
    try {
      const data = await api.generateQuiz(articleData);
      setQuiz(data);
      return data;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  /**
   * Select an answer
   */
  const selectAnswer = (answer) => {
    if (!isAnswered) {
      setSelectedAnswer(answer);
    }
  };

  /**
   * Submit answer and check if correct
   */
  const submitAnswer = () => {
    if (!selectedAnswer || !quiz) return;

    const correct = selectedAnswer === quiz.correctAnswer;
    setIsCorrect(correct);
    setIsAnswered(true);
  };

  /**
   * Show next hint (up to 3 levels)
   */
  const showNextHint = () => {
    if (currentHintLevel < 3) {
      setCurrentHintLevel(currentHintLevel + 1);
    }
  };

  /**
   * Reset quiz state for next question
   */
  const resetQuiz = () => {
    setArticle(null);
    setQuiz(null);
    setCurrentHintLevel(0);
    setSelectedAnswer(null);
    setIsAnswered(false);
    setIsCorrect(null);
    setError(null);
  };

  const value = {
    // State
    article,
    quiz,
    currentHintLevel,
    selectedAnswer,
    isAnswered,
    isCorrect,
    loading,
    error,

    // Actions
    fetchArticle,
    generateQuiz,
    selectAnswer,
    submitAnswer,
    showNextHint,
    resetQuiz,
  };

  return <QuizContext.Provider value={value}>{children}</QuizContext.Provider>;
};

QuizProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

/**
 * Custom hook to use Quiz context
 */
export const useQuiz = () => {
  const context = useContext(QuizContext);
  if (!context) {
    throw new Error('useQuiz must be used within a QuizProvider');
  }
  return context;
};
