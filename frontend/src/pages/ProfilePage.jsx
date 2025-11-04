/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import MoodButton from "../components/ui/MoodButtonComp";
import GradientButton from "../components/ui/GradientButton";

const ProfilePage = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [activeMood, setActiveMood] = useState("");
  const navigate = useNavigate();

    const spiritAnimalData = {
    wolf: {
      name: "Wolf",
      image: "https://images.unsplash.com/photo-1514984879728-be0aff75a6e8?w=150&h=150&fit=crop&crop=center",
      description: "Loyal, intelligent, and values deep connections with their pack.",
      strengths: ["Loyalty", "Intuition", "Teamwork"],
      color: "from-blue-500 to-purple-600"
    },
    eagle: {
      name: "Eagle", 
      image: "https://images.unsplash.com/photo-1551085254-e96b210db58a?w=150&h=150&fit=crop&crop=center",
      description: "Visionary, freedom-loving, and sees the bigger picture in life.",
      strengths: ["Vision", "Freedom", "Perspective"],
      color: "from-amber-500 to-orange-600"
    },
    dolphin: {
      name: "Dolphin",
      image: "https://images.unsplash.com/photo-1570481662006-a3a1374699f8?w=150&h=150&fit=crop&crop=center",
      description: "Playful, intelligent, and brings joy to every situation.",
      strengths: ["Intelligence", "Playfulness", "Social"],
      color: "from-cyan-500 to-blue-600"
    }
  };

  useEffect(() => {
    const fetchUser = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem("token");
        if (!token) {
          navigate("/login");
          return;
        }

        const res = await axios.get("http://localhost:8000/auth/me", {
          headers: { Authorization: `Bearer ${token}` },
        });

        setUser(res.data);
        setActiveMood(res.data.todayMood || "");
      } catch (err) {
        console.error("Failed to load User", err);
        if (err.response?.status === 401) {
          navigate("/login");
        } else {
          setError("Failed to load profile. Please try again later.");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [navigate]);

  const handleMoodSelect = async (mood) => {
    try {
      setActiveMood(mood);
      // TODO: Add API call to update user's mood
      // await axios.patch(`http://localhost:8000/auth/update-mood`, { mood });
    } catch (err) {
      console.error("Failed to update mood", err);
    }
  };

  const handleRetakeQuiz = () => {
    navigate("/quiz");
  };

  const handleEditProfile = () => {
    // TODO: Implement edit profile modal or page
    console.log("Edit profile clicked");
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-900">
        {/* <LoadingSpinner size="large" /> */}
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-900">
        <div className="text-center">
          <div className="text-red-400 text-xl mb-4">⚠️</div>
          <p className="text-white mb-4">{error}</p>
          <button 
            onClick={() => window.location.reload()}
            className="bg-gradient-to-r from-green-500 to-emerald-600 px-6 py-2 rounded-full hover:scale-105 transition"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (!user) return null;

  const { name, email, spiritAnimal: userSpiritAnimal, createdAt } = user;
  const spiritAnimal = spiritAnimalData[userSpiritAnimal?.toLowerCase()] || {
    name: userSpiritAnimal || "Unknown",
    image: "https://images.unsplash.com/photo-1474511320723-9a56873867b5?w=150&h=150&fit=crop&crop=center", // fallback animal
    description: "Take a quiz to discover your spirit animal and its unique traits!",
    strengths: ["Curiosity", "Adaptability", "Growth"],
    color: "from-gray-500 to-gray-700"
  };

  const joinDate = new Date(createdAt).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  return (
    <div className="flex min-h-screen bg-gray-900">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <div className="flex-1 lg:ml-64 p-6">
        {/* Header */}
        <div className="mb-4">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-400 to-pink-600 bg-clip-text text-transparent">
            Welcome back, {name}!
          </h1>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
          {/* Profile Card */}
          <div className="bg-gray-800/50 backdrop-blur-lg rounded-2xl p-8 border border-gray-700 hover:border-green-400/30 transition-all duration-300">
            <div className="flex flex-col items-center text-center">
              {/* Avatar */}
              <div className="relative mb-6">
                <img
                  src={user.avatar || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&h=150&fit=crop&crop=center"}
                  alt="Profile"
                  className="w-32 h-32 rounded-full border-4 border-green-500/30 shadow-2xl"
                />
                <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-green-500 rounded-full border-4 border-gray-900 flex items-center justify-center">
                  <span className="text-xs">⭐</span>
                </div>
              </div>

              {/* User Info */}
              <h2 className="text-2xl font-bold text-white mb-1">{name}</h2>
              <p className="text-gray-400 mb-2">{email}</p>
              <p className="text-gray-500 text-sm mb-6">Joined {joinDate}</p>

              <GradientButton 
                onClick={handleEditProfile}
                className="w-full max-w-xs"
              >
                Edit Profile
              </GradientButton>
            </div>
          </div>

          {/* Spirit Animal Card */}
          <div className="bg-gray-800/50 backdrop-blur-lg rounded-2xl p-8 border border-gray-700 hover:border-green-400/30 transition-all duration-300">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-white mb-2">Your Spirit Animal</h2>
              
              <div className="flex justify-center mb-4">
                <div className={`relative p-1 rounded-full bg-gradient-to-r ${spiritAnimal.color}`}>
                  <img
                    src={spiritAnimal.image}
                    alt={spiritAnimal.name}
                    className="w-24 h-24 rounded-full border-4 border-gray-900"
                  />
                </div>
              </div>

              <h3 className={`text-2xl font-bold bg-gradient-to-r ${spiritAnimal.color} bg-clip-text text-transparent mb-2`}>
                {spiritAnimal.name}
              </h3>
              <p className="text-gray-300 text-sm mb-4 max-w-md mx-auto">
                {spiritAnimal.description}
              </p>

              {/* Strengths */}
              <div className="flex justify-center gap-2 mb-6">
                {spiritAnimal.strengths.map((strength, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-gray-700/50 rounded-full text-xs text-gray-300 border border-gray-600"
                  >
                    {strength}
                  </span>
                ))}
              </div>

              <button 
                onClick={handleRetakeQuiz}
                className="bg-gradient-to-r from-green-500 to-emerald-600 px-6 py-3 rounded-full font-semibold hover:scale-105 hover:shadow-xl transition-all duration-200 w-full max-w-xs"
              >
                🔄 Retake Quiz
              </button>
            </div>

            <div className="border-t border-gray-700 pt-6">
              {/* Mood Section */}
              <div className="mb-6">
                <h3 className="font-semibold text-lg text-white mb-4">Today's Mood</h3>
                <div className="flex gap-3 justify-center">
                  {[
                    { mood: "Happy", emoji: "😊" },
                    { mood: "Neutral", emoji: "😐" },
                    { mood: "Sad", emoji: "😔" },
                    { mood: "Energetic", emoji: "⚡" },
                    { mood: "Calm", emoji: "🌿" }
                  ].map(({ mood, emoji }) => (
                    <MoodButton
                      key={mood}
                      mood={mood}
                      emoji={emoji}
                      isActive={activeMood === mood}
                      onClick={handleMoodSelect}
                    />
                  ))}
                </div>
              </div>

              {/* Recent Activity */}
              <div>
                <h3 className="font-semibold text-lg text-white mb-4">Recent Activity</h3>
                {user.recentQuizzes?.length > 0 ? (
                  <div className="space-y-3">
                    {user.recentQuizzes.slice(0, 3).map((quiz, idx) => (
                      <div
                        key={idx}
                        className="flex justify-between items-center p-4 bg-gray-700/30 rounded-xl border border-gray-600 hover:border-green-400/40 transition-colors"
                      >
                        <div>
                          <span className="text-gray-300 block">{quiz.date}</span>
                          <span className="text-green-400 font-semibold text-sm">{quiz.result}</span>
                        </div>
                        <div className="text-2xl">
                          {spiritAnimalData[quiz.result?.toLowerCase()]?.emoji || "🐾"}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <div className="text-4xl mb-2">📊</div>
                    <p className="text-gray-500">No quiz history yet</p>
                    <button 
                      onClick={handleRetakeQuiz}
                      className="text-green-400 hover:text-green-300 text-sm mt-2"
                    >
                      Take your first quiz!
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;