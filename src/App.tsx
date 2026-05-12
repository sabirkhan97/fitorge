import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Workout from './pages/workoutForm/pages/GuestView';
import Result from './pages/Result';
import History from './pages/History';
import LoginPage from './pages/identity/pages/LoginPage';
import SignUpPage from './pages/identity/pages/SignUpPage';
import AnnouncementBar from './components/AnnouncementBar';
import WorkoutForm from './pages/workoutForm/WorkoutForm';
import About from './pages/about/About';
import Programs from './pages/programs/Programs';
import Muscles from './pages/Muscles/Muscles';
import Workouts from './pages/workouts/Workouts';
import Navbar from './pages/navbar/Navbar';

export default function App() {
  const announcements = [
    { id: 1, title: "🚧 Website Under Construction – Better AI coming soon! 🚧" },
    { id: 2, title: "✨ Generate workouts NOW – later get the most advanced plans ever! ✨" },
    { id: 3, title: "💪 Come back next week – we're adding weekly & monthly progressive plans! 💪" },
  ];

  return (
    <Router>
      <AnnouncementBar
        announcements={announcements}
        intervalMs={4000}
        buttonText="Start Free Workout →"
        buttonLink="/workout"
        bgColor="#C8F135"
        textColor="#000"
        dismissible={true}
      />
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


