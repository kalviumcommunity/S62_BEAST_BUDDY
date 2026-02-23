/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from "react";
import apiClient from "../api/client";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import Sidebar from "../components/Sidebar";

const SPIRIT_ANIMAL_DATA = {
  wolf: {
    name: "Wolf",
    image: "https://images.unsplash.com/photo-1514984879728-be0aff75a6e8?w=150&h=150&fit=crop&crop=center",
    description: "Loyal, intelligent, and values deep connections with their pack.",
    traits: ["Loyalty", "Intuition", "Teamwork"],
    gradient: "from-blue-500 to-purple-600"
  },
  eagle: {
    name: "Eagle",
    image: "https://images.unsplash.com/photo-1551085254-e96b210db58a?w=150&h=150&fit=crop&crop=center",
    description: "Visionary, freedom-loving, and sees the bigger picture in life.",
    traits: ["Vision", "Freedom", "Perspective"],
    gradient: "from-amber-500 to-orange-600"
  },
  dolphin: {
    name: "Dolphin",
    image: "https://images.unsplash.com/photo-1570481662006-a3a1374699f8?w=150&h=150&fit=crop&crop=center",
    description: "Playful, intelligent, and brings joy to every situation.",
    traits: ["Intelligence", "Playfulness", "Social"],
    gradient: "from-cyan-500 to-blue-600"
  }
};

const Dashboard = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem("token");
        if (!token) {
          navigate("/login");
          return;
        }

        const res = await apiClient.get("/auth/me");

        // backend returns { success: true, data: user }
        setUser(res.data?.data || res.data);
      } catch (err) {
        console.error("Failed to load dashboard", err);
        if (err.response?.status === 401) {
          navigate("/login");
        } else {
          setError("Failed to load dashboard. Please try again later.");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [navigate]);

  const handleRetakeQuiz = () => {
    navigate("/quiz");
  };

  const handleDiscoverSpirit = () => {
    navigate("/quiz");
  };

  const handleEditProfile = () => {
    navigate('/edit-profile');
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

  const { name, email, spiritAnimal: userSpiritAnimal, spiritAnimalImageUrl, createdAt } = user;
  const hasTakenQuiz = !!userSpiritAnimal;
  const spiritAnimal = hasTakenQuiz ? SPIRIT_ANIMAL_DATA[userSpiritAnimal?.toLowerCase()] : null;

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
        {/* Page Header */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-orange-400 to-orange-300 bg-clip-text text-transparent">
            Welcome, {name}
          </h1>
          <p className="text-gray-300 mt-2">Your personal dashboard</p>
        </motion.div>

        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          {/* User Profile Card */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white/10 backdrop-blur-lg rounded-3xl p-8 border border-white/20 hover:border-orange-400/30 transition-all duration-300"
          >
            <h2 className="text-2xl font-bold text-white mb-6">Profile</h2>
            
            <div className="flex flex-col items-center text-center">
              {/* Avatar */}
              <div className="mb-6">
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  className="relative"
                >
                  <img
                    src={user.avatar || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&h=150&fit=crop&crop=center"}
                    alt={name}
                    className="w-32 h-32 rounded-full border-4 border-orange-400/50 shadow-2xl object-cover"
                  />
                  <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-gradient-to-r from-orange-500 to-orange-400 rounded-full border-4 border-indigo-900 flex items-center justify-center">
                    <span className="text-xs">✨</span>
                  </div>
                </motion.div>
              </div>

              {/* User Info */}
              <h3 className="text-2xl font-bold text-white mb-2">{name}</h3>
              <p className="text-gray-400 mb-1">{email}</p>
              <p className="text-gray-500 text-sm mb-8">Joined {joinDate}</p>

              {/* Edit Profile Button */}
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleEditProfile}
                className="w-full px-6 py-3 rounded-2xl bg-white/10 backdrop-blur-sm border border-white/20 text-white font-semibold hover:bg-white/20 transition-all duration-200"
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
            <h2 className="text-2xl font-bold text-white mb-6">Spirit Animal</h2>

            {hasTakenQuiz ? (
              // Quiz Completed - Show Spirit Animal
              <div className="flex flex-col items-center text-center">
                {/* Spirit Animal Image */}
                <div className="mb-8">
                  <motion.div 
                    className={`relative p-3 rounded-full bg-gradient-to-r ${spiritAnimal.gradient} shadow-lg`}
                    whileHover={{ scale: 1.1 }}
                    transition={{ type: "spring", stiffness: 300 }}
                  >
                    <img
                      src={spiritAnimalImageUrl || spiritAnimal.image}
                      alt={spiritAnimal.name}
                      className="w-32 h-32 rounded-full border-4 border-indigo-900 object-cover"
                    />
                  </motion.div>
                </div>

                {/* Spirit Animal Title */}
                <h3 className={`text-3xl font-bold bg-gradient-to-r ${spiritAnimal.gradient} bg-clip-text text-transparent mb-4`}>
                  Your Spirit Animal: {spiritAnimal.name}
                </h3>

                {/* Description */}
                <p className="text-gray-200 text-base mb-8 max-w-sm leading-relaxed">
                  {spiritAnimal.description}
                </p>

                {/* Traits */}
                <div className="mb-8 w-full">
                  <p className="text-gray-400 text-sm mb-3 font-semibold">Key Traits</p>
                  <div className="flex flex-wrap justify-center gap-2">
                    {spiritAnimal.traits.map((trait, index) => (
                      <motion.span
                        key={index}
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.5 + index * 0.1 }}
                        className="px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full text-sm text-white border border-white/20"
                      >
                        {trait}
                      </motion.span>
                    ))}
                  </div>
                </div>

                {/* Retake Quiz Button */}
                <motion.button 
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleRetakeQuiz}
                  className="w-full px-6 py-3 rounded-2xl bg-gradient-to-r from-orange-500 to-orange-400 text-white font-semibold shadow-lg shadow-orange-500/25 hover:shadow-orange-500/40 transition-all duration-200"
                >
                  Retake Quiz
                </motion.button>
              </div>
            ) : (
              // Quiz Not Taken - Show Placeholder
              <div className="flex flex-col items-center text-center">
                {/* Placeholder Icon */}
                <div className="mb-8">
                  <motion.div 
                    className="relative p-3 rounded-full bg-gradient-to-r from-gray-600 to-gray-700 shadow-lg"
                    whileHover={{ scale: 1.1 }}
                    transition={{ type: "spring", stiffness: 300 }}
                  >
                    <div className="w-32 h-32 rounded-full border-4 border-indigo-900 bg-gradient-to-br from-gray-700 to-gray-900 flex items-center justify-center text-6xl">
                      ❓
                    </div>
                  </motion.div>
                </div>

                {/* Unknown Title */}
                <h3 className="text-3xl font-bold text-gray-300 mb-4">
                  Spirit Animal: Unknown
                </h3>

                {/* Description */}
                <p className="text-gray-300 text-base mb-8 max-w-sm leading-relaxed">
                  Discover which spirit animal resonates with your unique personality and values through our personalized quiz.
                </p>

                {/* Discover Button */}
                <motion.button 
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleDiscoverSpirit}
                  className="w-full px-6 py-3 rounded-2xl bg-gradient-to-r from-orange-500 to-orange-400 text-white font-semibold shadow-lg shadow-orange-500/25 hover:shadow-orange-500/40 transition-all duration-200"
                >
                  Discover Your Spirit Animal
                </motion.button>
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
