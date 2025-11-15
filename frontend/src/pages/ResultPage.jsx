/* eslint-disable no-unused-vars */
import logo from "../assets/image.png";
import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

const ResultPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const result = location.state?.result;

  if (!result) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen text-center text-white bg-gradient-to-br from-purple-950 via-indigo-950 to-pink-950 p-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6 }}
          className="max-w-md mx-auto"
        >
          <div className="text-6xl mb-4">🐾</div>
          <h1 className="text-3xl font-bold mb-4 text-white">
            No Result Found
          </h1>
          <p className="text-gray-200 mb-6">
            It seems your spirit animal is playing hide and seek! Let's try again.
          </p>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate("/quiz")}
            className="px-8 py-4 rounded-full bg-orange-500 hover:bg-orange-600 text-white font-bold text-lg shadow-lg shadow-orange-500/25 transition-all"
          >
            Discover Your Spirit Animal
          </motion.button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center min-h-screen text-white bg-gradient-to-br from-purple-900 to-blue-950 px-4 py-8 pt-24">
      {/* Main Result Card */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, type: "spring" }}
        className="w-full max-w-4xl p-8 bg-white/10 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 mb-8"
      >
        {/* Result Header */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="text-center mb-8"
        >
          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ delay: 0.5, type: "spring", stiffness: 200 }}
            className="text-6xl mb-4"
          >
            🎉
          </motion.div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-orange-400 to-orange-300 bg-clip-text text-transparent">
            Your Spirit Animal Revealed!
          </h1>
          <p className="text-gray-200 text-lg">
            Based on your personality, you are most connected with...
          </p>
        </motion.div>

        {/* Animal Result */}
        <div className="grid md:grid-cols-2 gap-8 items-center">
          {/* Animal Name & Image Placeholder */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
            className="text-center"
          >
            <motion.div
              animate={{
                y: [0, -10, 0],
                boxShadow: [
                  "0 0 40px 20px rgba(249, 115, 22, 0.2)",
                  "0 0 60px 30px rgba(249, 115, 22, 0.3)",
                  "0 0 40px 20px rgba(249, 115, 22, 0.2)",
                ],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              className="w-48 h-48 mx-auto bg-gradient-to-br from-orange-400 to-orange-600 rounded-full flex items-center justify-center mb-6 border-4 border-white/20"
            >
              <span className="text-2xl w-36"><img src={logo} alt="Animal Logo" /></span>
            </motion.div>
            <motion.h2
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="text-4xl font-bold text-white mb-2"
            >
              {result.animalName}
            </motion.h2>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
              className="inline-flex items-center px-4 py-2 bg-orange-500/20 rounded-full border border-orange-400/30"
            >
              <span className="w-2 h-2 bg-orange-400 rounded-full mr-2 animate-pulse"></span>
              <span className="text-orange-300 font-medium">
                {(result.confidence * 1).toFixed(2)}% Match
              </span>
            </motion.div>
          </motion.div>

          {/* Animal Details */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 }}
            className="space-y-6"
          >
            {/* Reason */}
            <div>
              <h3 className="text-xl font-semibold text-orange-300 mb-3 flex items-center">
                <span className="mr-2">🔮</span> Why This Animal?
              </h3>
              <p className="text-gray-200 leading-relaxed bg-white/5 rounded-xl p-4 border border-white/10">
                {result.reason}
              </p>
            </div>

            {/* Strengths */}
            <div>
              <h3 className="text-xl font-semibold text-orange-300 mb-3 flex items-center">
                <span className="mr-2">🌟</span> Your Strengths
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {result.strengths?.map((s, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.7 + i * 0.1 }}
                    className="bg-white/10 backdrop-blur-sm rounded-xl p-3 border border-white/10 hover:border-orange-400/30 transition-all"
                  >
                    <span className="text-orange-400 mr-2">•</span>
                    {s}
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Fun Fact */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1 }}
              className="bg-gradient-to-r from-orange-500/20 to-purple-500/20 rounded-2xl p-4 border border-orange-400/30"
            >
              <h4 className="font-semibold text-orange-300 mb-2 flex items-center">
                <span className="mr-2">💡</span> Did You Know?
              </h4>
              <p className="text-gray-200 italic">{result.funFact}</p>
            </motion.div>
          </motion.div>
        </div>
      </motion.div>

      {/* Action Buttons */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.2 }}
        className="flex flex-col sm:flex-row gap-4 w-full max-w-4xl"
      >
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => navigate("/quiz")}
          className="flex-1 px-8 py-4 rounded-full bg-orange-500 hover:bg-orange-600 text-white font-bold text-lg shadow-lg shadow-orange-500/25 transition-all"
        >
          🐾 Discover Another Animal
        </motion.button>
        
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => navigate("/")}
          className="flex-1 px-8 py-4 rounded-full bg-white/10 backdrop-blur-sm hover:bg-white/20 text-white font-bold text-lg border border-white/20 hover:border-white/30 transition-all"
        >
          🏠 Back to Home
        </motion.button>
      </motion.div>

      {/* Share Section */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.4 }}
        className="mt-8 text-center"
      >
        <p className="text-gray-300 mb-4">Share your spirit animal with friends!</p>
        <div className="flex justify-center space-x-4">
          {['Twitter', 'Facebook', 'WhatsApp'].map((platform, i) => (
            <motion.button
              key={platform}
              whileHover={{ scale: 1.1, y: -2 }}
              whileTap={{ scale: 0.9 }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.6 + i * 0.1 }}
              className="px-6 py-2 bg-white/10 backdrop-blur-sm rounded-full border border-white/20 hover:bg-white/20 transition-all"
            >
              Share on {platform}
            </motion.button>
          ))}
        </div>
      </motion.div>

      {/* Background decorative elements */}
      <motion.div
        animate={{
          y: [0, -20, 0],
          opacity: [0.3, 0.6, 0.3]
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: "easeInOut"
        }}
        className="fixed bottom-10 left-10 w-24 h-24 bg-orange-400/20 rounded-full blur-xl"
      />
      <motion.div
        animate={{
          y: [0, 15, 0],
          opacity: [0.4, 0.7, 0.4]
        }}
        transition={{
          duration: 3,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 1
        }}
        className="fixed top-32 right-10 w-20 h-20 bg-purple-400/20 rounded-full blur-xl"
      />
    </div>
  );
};

export default ResultPage;