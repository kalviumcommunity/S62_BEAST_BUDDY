/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
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
      color: "from-blue-500 to-purple-600",
      gradient: "from-blue-500 to-purple-600"
    },
    eagle: {
      name: "Eagle", 
      image: "https://images.unsplash.com/photo-1551085254-e96b210db58a?w=150&h=150&fit=crop&crop=center",
      description: "Visionary, freedom-loving, and sees the bigger picture in life.",
      strengths: ["Vision", "Freedom", "Perspective"],
      color: "from-amber-500 to-orange-600",
      gradient: "from-amber-500 to-orange-600"
    },
    dolphin: {
      name: "Dolphin",
      image: "https://images.unsplash.com/photo-1570481662006-a3a1374699f8?w=150&h=150&fit=crop&crop=center",
      description: "Playful, intelligent, and brings joy to every situation.",
      strengths: ["Intelligence", "Playfulness", "Social"],
      color: "from-cyan-500 to-blue-600",
      gradient: "from-cyan-500 to-blue-600"
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
      <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-purple-950 via-indigo-950 to-pink-950">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="w-12 h-12 border-4 border-orange-400 border-t-transparent rounded-full"
        />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-purple-950 via-indigo-950 to-pink-950">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center bg-white/10 backdrop-blur-lg rounded-3xl p-8 border border-white/20"
        >
          <div className="text-6xl mb-4">⚠️</div>
          <p className="text-white mb-4 text-lg">{error}</p>
          <button 
            onClick={() => window.location.reload()}
            className="px-6 py-3 rounded-full bg-orange-500 hover:bg-orange-600 text-white font-semibold transition-all"
          >
            Try Again
          </button>
        </motion.div>
      </div>
    );
  }

  if (!user) return null;

  const { name, email, spiritAnimal: userSpiritAnimal, createdAt } = user;
  const spiritAnimal = spiritAnimalData[userSpiritAnimal?.toLowerCase()] || {
    name: userSpiritAnimal || "Unknown",
    image: "https://images.unsplash.com/photo-1474511320723-9a56873867b5?w=150&h=150&fit=crop&crop=center",
    description: "Take a quiz to discover your spirit animal and its unique traits!",
    strengths: ["Curiosity", "Adaptability", "Growth"],
    color: "from-gray-500 to-gray-700",
    gradient: "from-gray-500 to-gray-700"
  };

  const joinDate = new Date(createdAt).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-purple-950 via-indigo-950 to-pink-950">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <div className="flex-1 lg:ml-64 p-6">
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-orange-400 to-orange-300 bg-clip-text text-transparent">
            Welcome back, {name}!
          </h1>
          <p className="text-gray-200 mt-2">Your spiritual journey continues...</p>
        </motion.div>

        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          {/* Profile Card */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white/10 backdrop-blur-lg rounded-3xl p-8 border border-white/20 hover:border-orange-400/30 transition-all duration-300"
          >
            <div className="flex flex-col items-center text-center">
              {/* Avatar */}
              <div className="relative mb-6">
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  className="relative"
                >
                  <img
                    src={user.avatar || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&h=150&fit=crop&crop=center"}
                    alt="Profile"
                    className="w-32 h-32 rounded-full border-4 border-orange-400/50 shadow-2xl"
                  />
                  <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-gradient-to-r from-orange-500 to-orange-400 rounded-full border-4 border-indigo-900 flex items-center justify-center">
                    <span className="text-xs text-white">⭐</span>
                  </div>
                </motion.div>
              </div>

              {/* User Info */}
              <h2 className="text-2xl font-bold text-white mb-1">{name}</h2>
              <p className="text-gray-300 mb-2">{email}</p>
              <p className="text-gray-400 text-sm mb-6">Joined {joinDate}</p>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleEditProfile}
                className="w-full max-w-xs py-3 rounded-2xl bg-white/10 backdrop-blur-sm border border-white/20 text-white font-semibold hover:bg-white/20 transition-all"
              >
                Edit Profile
              </motion.button>
            </div>
          </motion.div>

          {/* Spirit Animal Card */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white/10 backdrop-blur-lg rounded-3xl p-8 border border-white/20 hover:border-orange-400/30 transition-all duration-300"
          >
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-white mb-6">Your Spirit Animal</h2>
              
              <div className="flex justify-center mb-6">
                <motion.div 
                  className={`relative p-2 rounded-full bg-gradient-to-r ${spiritAnimal.gradient} shadow-lg`}
                  whileHover={{ scale: 1.1 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <img
                    src={spiritAnimal.image}
                    alt={spiritAnimal.name}
                    className="w-28 h-28 rounded-full border-4 border-indigo-900"
                  />
                </motion.div>
              </div>

              <h3 className={`text-3xl font-bold bg-gradient-to-r ${spiritAnimal.gradient} bg-clip-text text-transparent mb-3`}>
                The {spiritAnimal.name}
              </h3>
              <p className="text-gray-200 text-lg mb-6 max-w-md mx-auto leading-relaxed">
                {spiritAnimal.description}
              </p>

              {/* Strengths */}
              <div className="flex justify-center gap-3 mb-8">
                {spiritAnimal.strengths.map((strength, index) => (
                  <motion.span
                    key={index}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.5 + index * 0.1 }}
                    className="px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full text-sm text-white border border-white/20"
                  >
                    {strength}
                  </motion.span>
                ))}
              </div>

              <motion.button 
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleRetakeQuiz}
                className="px-8 py-4 rounded-full bg-gradient-to-r from-orange-500 to-orange-400 text-white font-bold text-lg shadow-lg shadow-orange-500/25 hover:shadow-orange-500/40 transition-all duration-200 w-full max-w-xs"
              >
                🔄 Discover Again
              </motion.button>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;