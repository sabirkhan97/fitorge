import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Result from './pages/Result';
import History from './pages/History';
import LoginPage from './pages/identity/pages/LoginPage';
import SignUpPage from './pages/identity/pages/SignUpPage';
import WorkoutForm from './pages/workoutForm/WorkoutForm';
import About from './pages/about/About';
import Programs from './pages/programs/Programs';
import Muscles from './pages/Muscles/Muscles';
import Workouts from './pages/workouts/Workouts';
import Navbar from './pages/navbar/Navbar';

export default function App() {

  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/workout" element={<WorkoutForm />} />
        <Route path="/result" element={<Result />} />
        <Route path="/history" element={<History />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignUpPage />} />
        <Route path="/about" element={<About />} />
        <Route path="/programs" element={<Programs />} />
        <Route path="/muscles" element={<Muscles />} />
        <Route path="/workouts" element={<Workouts />} />

      </Routes>
    </Router>
  );
}


