import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import QuizPage from "./pages/QuizPage";
import ResultPage from "./pages/ResultPage";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import ProfilePage from "./pages/ProfilePage";
import EditProfile from "./pages/EditProfile";
import LearnMorePage from "./pages/LearnMorePage";
import ContactPage from "./pages/ContactPage";
import AnimalEncyclopedia from "./pages/AnimalEncyclopedia";
import HomeWrapper from "./pages/HomeWrapper";
import ProtectedRoute from "./components/ProtectedRoute";
import PersonalizedHomePage from "./pages/PersonalizedHomePage";

function App() {
  return (
    <React.StrictMode>
      <AuthProvider>
        <Router>
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<HomeWrapper />} />
            <Route path="/learn-more" element={<LearnMorePage />} />
            <Route path="/animals" element={<AnimalEncyclopedia />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<SignupPage />} />

            {/* Quiz & Result (public for guests, results saved for authenticated users) */}
            <Route path="/quiz" element={<QuizPage />} />
            <Route path="/result" element={<ResultPage />} />

            {/* Protected Routes (authenticated users only) */}
            <Route path="/home" element={<ProtectedRoute><PersonalizedHomePage /></ProtectedRoute>} />
            <Route path="/user-dashboard" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />
            <Route path="/edit-profile" element={<ProtectedRoute><EditProfile /></ProtectedRoute>} />
          </Routes>
        </Router>
      </AuthProvider>
    </React.StrictMode>
  );
}

export default App;
