import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Workout from './pages/workout/Workout';
import Result from './pages/Result';
import History from './pages/History';
import LoginPage from './pages/identity/pages/LoginPage';
import SignUpPage from './pages/identity/pages/SignUpPage';

export default function App() {

  return (
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/workout" element={<Workout />} />
          <Route path="/result" element={<Result />} />
          <Route path="/history" element={<History />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignUpPage />} />
        </Routes>
      </Router>
  );
}


