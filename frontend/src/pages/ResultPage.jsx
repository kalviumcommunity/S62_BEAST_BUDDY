// src/pages/ResultPage.jsx
import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

const ResultPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const result = location.state?.result;

  if (!result) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen text-center text-gray-200 bg-gradient-to-br from-gray-900 via-gray-800 to-black p-6">
        <motion.h1
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
          className="text-2xl font-bold mb-4"
        >
          No Result Found
        </motion.h1>
        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          onClick={() => navigate("/quiz")}
          className="mt-4 px-6 py-3 rounded-2xl bg-green-600 hover:bg-green-700 text-white font-medium shadow-md transition"
        >
          Take Quiz Again
        </motion.button>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen text-gray-100 bg-gradient-to-br from-gray-900 via-gray-800 to-black p-6">
      <motion.h1
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        className="text-4xl font-bold mb-6 text-purple-400"
      >
        🎉 Your Spirit Animal
      </motion.h1>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="w-full max-w-2xl p-8 bg-gray-800/70 backdrop-blur-xl rounded-2xl shadow-xl border border-gray-700"
      >
        <h2 className="text-3xl font-semibold text-green-400">{result.animalName}</h2>
        <p className="mt-2 text-gray-300">{result.reason}</p>

        <div className="mt-4">
          <h3 className="text-xl font-semibold text-purple-300">🌟 Strengths</h3>
          <ul className="list-disc list-inside text-gray-300">
            {result.strengths?.map((s, i) => (
              <li key={i}>{s}</li>
            ))}
          </ul>
        </div>

        <p className="mt-4 italic text-yellow-400">💡 {result.funFact}</p>

        <p className="mt-4 text-gray-400">
          🔮 Confidence: {(result.confidence * 100).toFixed(1)}%
        </p>

        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          onClick={() => navigate("/quiz")}
          className="mt-6 w-full py-3 rounded-2xl bg-green-600 hover:bg-green-700 text-white font-medium shadow-md transition"
        >
          Retake Quiz
        </motion.button>
      </motion.div>
    </div>
  );
};

export default ResultPage;
