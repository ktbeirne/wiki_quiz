import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { QuizProvider } from './context/QuizContext';
import Home from './pages/Home';
import Quiz from './pages/Quiz';

function App() {
  return (
    <Router>
      <QuizProvider>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/quiz" element={<Quiz />} />
        </Routes>
      </QuizProvider>
    </Router>
  );
}

export default App;
