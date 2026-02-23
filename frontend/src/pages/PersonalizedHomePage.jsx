/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from "react";
import Header from "../components/Header";
import FeatureSection from "../components/FeatureSection";
import Footer from "../components/Footer";

const PersonalizedHomePage = () => {
  const username = localStorage.getItem("username") || "Buddy";
  const userSpiritAnimal = localStorage.getItem("spiritAnimal") || null;
  const quizTaken = localStorage.getItem("quizTaken") === "true";
  const [lastLogin, setLastLogin] = useState(null);
  const [userStreak, setUserStreak] = useState(0);

  const userPreferences = JSON.parse(localStorage.getItem("userPreferences") || "{}");
  const userFriends = JSON.parse(localStorage.getItem("userFriends") || "[]");

  useEffect(() => {

    const today = new Date().toDateString();
    const lastLoginDate = localStorage.getItem("lastLogin");
    
    if (lastLoginDate !== today) {
      if (lastLoginDate && new Date(lastLoginDate).toDateString() === new Date(Date.now() - 86400000).toDateString()) {
        // User logged in yesterday - increase streak
        const currentStreak = parseInt(localStorage.getItem("userStreak") || "0") + 1;
        setUserStreak(currentStreak);
        localStorage.setItem("userStreak", currentStreak.toString());
      } else {
        // Reset or start streak
        setUserStreak(1);
        localStorage.setItem("userStreak", "1");
      }
      localStorage.setItem("lastLogin", today);
    } else {
      setUserStreak(parseInt(localStorage.getItem("userStreak") || "0"));
    }
    
    setLastLogin(lastLoginDate);
  }, []);

  const updateUserPreference = (key, value) => {
    const prefs = { ...userPreferences, [key]: value };
    localStorage.setItem("userPreferences", JSON.stringify(prefs));
    window.location.reload(); // Refresh to show updated preferences
  };

  return (
    <div className="font-poppins bg-gradient-to-b from-purple-900 via-blue-900 to-pink-900 text-white min-h-screen flex flex-col">
      <Header />
      
      {/* Personalized Hero Section */}
      <section className="flex-grow">
        <div className="container mx-auto px-4 py-8">
          {/* Welcome Header with Personal Stats */}
          <div className="text-center mb-8">
            <div className="flex flex-col md:flex-row items-center justify-center mb-6 gap-6">
              {userSpiritAnimal && (
                <div className="relative">
                  <div className="w-24 h-24 bg-gradient-to-r from-orange-400 to-purple-500 rounded-full flex items-center justify-center shadow-2xl">
                    <span className="text-4xl">
                      {getAnimalEmoji(userSpiritAnimal)}
                    </span>
                  </div>
                  {userStreak > 0 && (
                    <div className="absolute -top-2 -right-2 bg-green-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                      🔥 {userStreak}
                    </div>
                  )}
                </div>
              )}
              <div className="text-left">
                <h1 className="text-4xl md:text-5xl font-bold mb-2 bg-gradient-to-r from-orange-400 to-pink-400 bg-clip-text text-transparent">
                  Welcome back, {username}!
                </h1>
                <p className="text-lg text-gray-300 mb-2">
                  {getPersonalizedGreeting(userSpiritAnimal, quizTaken)}
                </p>
                {lastLogin && (
                  <p className="text-sm text-gray-400">
                    Last seen: {formatLastLogin(lastLogin)}
                  </p>
                )}
              </div>
            </div>

            {/* User Progress/Stats */}
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 max-w-4xl mx-auto mb-8">
              <h3 className="text-2xl font-semibold mb-6 text-center">Your Spirit Journey</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center">
                  <div className="text-3xl font-bold text-orange-400">
                    {userSpiritAnimal ? 1 : 0}
                  </div>
                  <div className="text-sm text-gray-300">Spirit Animals</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-purple-400">
                    {userPreferences.quizzesTaken || 0}
                  </div>
                  <div className="text-sm text-gray-300">Quizzes Taken</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-blue-400">
                    {userPreferences.matchesViewed || 0}
                  </div>
                  <div className="text-sm text-gray-300">Matches Viewed</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-green-400">
                    {userFriends.length}
                  </div>
                  <div className="text-sm text-gray-300">Spirit Friends</div>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="mt-6 flex flex-wrap justify-center gap-4">
              {!quizTaken ? (
                <button 
                  className="bg-gradient-to-r from-orange-500 to-pink-500 px-8 py-4 rounded-xl font-semibold text-lg hover:from-orange-600 hover:to-pink-600 transition-all transform hover:scale-105 shadow-lg flex items-center gap-2"
                  onClick={() => window.location.href = '/quiz'}
                >
                  <span>🎯</span>
                  Discover Your Spirit Animal
                </button>
              ) : (
                <>
                  <button 
                    className="bg-gradient-to-r from-orange-500 to-pink-500 px-6 py-3 rounded-xl font-semibold hover:from-orange-600 hover:to-pink-600 transition-all transform hover:scale-105 shadow-lg flex items-center gap-2"
                    onClick={() => window.location.href = '/quiz-retake'}
                  >
                    <span>🔄</span>
                    Retake Quiz
                  </button>
                  <button 
                    className="bg-gradient-to-r from-purple-600 to-blue-500 px-6 py-3 rounded-xl font-semibold hover:from-purple-700 hover:to-blue-600 transition-all transform hover:scale-105 shadow-lg flex items-center gap-2"
                    onClick={() => updateUserPreference('matchesViewed', (userPreferences.matchesViewed || 0) + 1)}
                  >
                    <span>👥</span>
                    View My Matches
                  </button>
                  <button 
                    className="bg-gradient-to-r from-green-600 to-teal-500 px-6 py-3 rounded-xl font-semibold hover:from-green-700 hover:to-teal-600 transition-all transform hover:scale-105 shadow-lg flex items-center gap-2"
                    onClick={() => window.location.href = '/share'}
                  >
                    <span>📤</span>
                    Share My Animal
                  </button>
                </>
              )}
            </div>
          </div>

          {/* Spirit Animal Details */}
          {userSpiritAnimal && (
            <div className="max-w-6xl mx-auto bg-black/20 backdrop-blur-sm rounded-2xl p-8 mb-8">
              <div className="flex flex-col md:flex-row justify-between items-center mb-6">
                <h2 className="text-3xl font-bold text-center md:text-left">
                  Your Spirit Animal: <span className="text-orange-400">{userSpiritAnimal}</span> {getAnimalEmoji(userSpiritAnimal)}
                </h2>
                <button 
                  className="mt-4 md:mt-0 bg-white/20 px-4 py-2 rounded-lg hover:bg-white/30 transition-all"
                  onClick={() => window.location.href = `/animal-details/${userSpiritAnimal.toLowerCase()}`}
                >
                  Learn More →
                </button>
              </div>
              
              <div className="grid md:grid-cols-3 gap-6">
                <div className="bg-white/5 rounded-xl p-6">
                  <h3 className="text-xl font-semibold mb-3 text-orange-400 flex items-center gap-2">
                    <span>🌟</span> Your Traits
                  </h3>
                  <p className="text-gray-300 text-sm leading-relaxed">
                    {getAnimalTraits(userSpiritAnimal)}
                  </p>
                </div>
                <div className="bg-white/5 rounded-xl p-6">
                  <h3 className="text-xl font-semibold mb-3 text-purple-400 flex items-center gap-2">
                    <span>💞</span> Best Matches
                  </h3>
                  <p className="text-gray-300 text-sm mb-4">
                    You're most compatible with {getCompatibleAnimals(userSpiritAnimal)}
                  </p>
                  <button 
                    className="bg-gradient-to-r from-purple-500 to-blue-400 px-4 py-2 rounded-lg text-sm hover:from-purple-600 hover:to-blue-500 transition-all w-full"
                    onClick={() => updateUserPreference('matchesViewed', (userPreferences.matchesViewed || 0) + 1)}
                  >
                    Find Your Matches
                  </button>
                </div>
                <div className="bg-white/5 rounded-xl p-6">
                  <h3 className="text-xl font-semibold mb-3 text-blue-400 flex items-center gap-2">
                    <span>📊</span> Your Community
                  </h3>
                  <p className="text-gray-300 text-sm mb-2">
                    <strong>{getAnimalPercentage(userSpiritAnimal)}%</strong> of users share your spirit animal
                  </p>
                  <button 
                    className="bg-gradient-to-r from-blue-500 to-cyan-400 px-4 py-2 rounded-lg text-sm hover:from-blue-600 hover:to-cyan-500 transition-all w-full"
                    onClick={() => window.location.href = `/community/${userSpiritAnimal.toLowerCase()}`}
                  >
                    Join {userSpiritAnimal} Community
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Personalized Recommendations */}
          <div className="max-w-6xl mx-auto mb-8">
            <h2 className="text-3xl font-bold text-center mb-8">
              Personalized For You
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div 
                className="bg-white/10 backdrop-blur-sm rounded-xl p-6 text-center cursor-pointer hover:bg-white/15 transition-all transform hover:scale-105 group"
                onClick={() => window.location.href = '/community'}
              >
                <div className="text-4xl mb-3 group-hover:scale-110 transition-transform">👥</div>
                <h3 className="text-xl font-semibold mb-2">Your Community</h3>
                <p className="text-gray-300 text-sm">
                  Connect with fellow {userSpiritAnimal ? userSpiritAnimal + ' spirits' : 'explorers'}
                </p>
              </div>
              
              <div 
                className="bg-white/10 backdrop-blur-sm rounded-xl p-6 text-center cursor-pointer hover:bg-white/15 transition-all transform hover:scale-105 group"
                onClick={() => window.location.href = userSpiritAnimal ? `/stories/${userSpiritAnimal}` : '/stories'}
              >
                <div className="text-4xl mb-3 group-hover:scale-110 transition-transform">📖</div>
                <h3 className="text-xl font-semibold mb-2">
                  {userSpiritAnimal ? `${userSpiritAnimal} Stories` : 'Spirit Stories'}
                </h3>
                <p className="text-gray-300 text-sm">
                  Discover tales about {userSpiritAnimal ? 'your spirit animal' : 'various spirits'}
                </p>
              </div>
              
              <div 
                className="bg-white/10 backdrop-blur-sm rounded-xl p-6 text-center cursor-pointer hover:bg-white/15 transition-all transform hover:scale-105 group"
                onClick={() => window.location.href = '/insights'}
              >
                <div className="text-4xl mb-3 group-hover:scale-110 transition-transform">📈</div>
                <h3 className="text-xl font-semibold mb-2">Your Insights</h3>
                <p className="text-gray-300 text-sm">
                  Deep dive into your spiritual journey and growth
                </p>
              </div>
              
              <div 
                className="bg-white/10 backdrop-blur-sm rounded-xl p-6 text-center cursor-pointer hover:bg-white/15 transition-all transform hover:scale-105 group"
                onClick={() => window.location.href = '/achievements'}
              >
                <div className="text-4xl mb-3 group-hover:scale-110 transition-transform">🏆</div>
                <h3 className="text-xl font-semibold mb-2">Achievements</h3>
                <p className="text-gray-300 text-sm">
                  Unlock badges and track your spiritual progress
                </p>
              </div>
            </div>
          </div>

          {/* Recent Activity */}
          {userPreferences.lastActivity && (
            <div className="max-w-6xl mx-auto bg-white/5 rounded-2xl p-6 mb-8">
              <h3 className="text-2xl font-semibold mb-4 flex items-center gap-2">
                <span>🕒</span>
                Continue Where You Left Off
              </h3>
              <div className="bg-white/10 rounded-xl p-4 cursor-pointer hover:bg-white/15 transition-all">
                <p className="text-gray-300">
                  You were last exploring: <strong>{userPreferences.lastActivity}</strong>
                </p>
                <button 
                  className="mt-2 text-orange-400 hover:text-orange-300 text-sm font-semibold"
                  onClick={() => window.location.href = userPreferences.lastActivityUrl || '/explore'}
                >
                  Continue Exploring →
                </button>
              </div>
            </div>
          )}
        </div>
      </section>

      <FeatureSection />
      <Footer />
    </div>  
  );
};

// Enhanced Helper functions
const getAnimalEmoji = (animal) => {
  const emojiMap = {
    'wolf': '🐺',
    'eagle': '🦅',
    'bear': '🐻',
    'dolphin': '🐬',
    'lion': '🦁',
    'owl': '🦉',
    'fox': '🦊',
    'tiger': '🐯',
    'butterfly': '🦋',
    'elephant': '🐘',
    'whale': '🐋',
    'hawk': '🦅',
    'raven': '🐦‍⬛'
  };
  return emojiMap[animal.toLowerCase()] || '🐾';
};

const getPersonalizedGreeting = (spiritAnimal, quizTaken) => {
  const greetings = [
    "Ready to continue your spiritual journey?",
    "Your spirit awaits discovery!",
    "Embrace your inner wisdom today!",
    "What will your spirit reveal today?",
    "Your journey continues...",
  ];

  if (!quizTaken) {
    return "Ready to discover your spirit animal today?";
  }
  if (spiritAnimal) {
    const spiritGreetings = [
      `Embrace your inner ${spiritAnimal}!`,
      `Your ${spiritAnimal} spirit is shining today!`,
      `The ${spiritAnimal} within you is strong!`,
      `Let your ${spiritAnimal} spirit guide you!`,
    ];
    return spiritGreetings[Math.floor(Math.random() * spiritGreetings.length)];
  }
  return greetings[Math.floor(Math.random() * greetings.length)];
};

const getAnimalTraits = (animal) => {
  const traits = {
    'wolf': 'Loyal, intelligent, and strong community bonds. You value family and have great intuition. Wolves are natural leaders who protect their pack.',
    'eagle': 'Visionary, courageous, and freedom-loving. You see the bigger picture and inspire others with your perspective and determination.',
    'bear': 'Strong, protective, and introspective. You have inner strength and value solitude. Bears are healers and providers.',
    'dolphin': 'Playful, intelligent, and communicative. You bring joy and connection to those around you with your social nature.',
    'lion': 'Confident, courageous, and natural leader. You command respect and protect your pride with unwavering loyalty.',
    'owl': 'Wise, intuitive, and observant. You see what others miss and offer profound insights with your deep understanding.',
    'fox': 'Clever, adaptable, and quick-thinking. You navigate challenges with wit, grace, and strategic thinking.',
    'tiger': 'Passionate, powerful, and independent. You move with purpose and intensity, commanding attention naturally.'
  };
  return traits[animal.toLowerCase()] || 'Unique, mysterious, and full of potential. Your spirit animal reflects your evolving inner journey and personal growth.';
};

const getCompatibleAnimals = (animal) => {
  const compatibility = {
    'wolf': 'eagles and dolphins',
    'eagle': 'wolves and owls',
    'bear': 'tigers and foxes',
    'dolphin': 'wolves and lions',
    'lion': 'dolphins and eagles',
    'owl': 'eagles and foxes',
    'fox': 'owls and bears',
    'tiger': 'bears and lions'
  };
  return compatibility[animal.toLowerCase()] || 'many different spirit animals who appreciate your unique energy';
};

const getAnimalPercentage = (animal) => {
  const percentages = {
    'wolf': 15,
    'eagle': 12,
    'bear': 18,
    'dolphin': 10,
    'lion': 8,
    'owl': 14,
    'fox': 11,
    'tiger': 7
  };
  return percentages[animal.toLowerCase()] || 5;
};

const formatLastLogin = (dateString) => {
  const date = new Date(dateString);
  const now = new Date();
  const diffTime = Math.abs(now - date);
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
  if (diffDays === 1) return 'Yesterday';
  if (diffDays < 7) return `${diffDays} days ago`;
  if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
  return date.toLocaleDateString();
};

export default PersonalizedHomePage;