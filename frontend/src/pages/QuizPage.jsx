/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

function QuizPage({ user }) {
  const [questions, setQuestions] = useState([]);
  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [loadingQuestions, setLoadingQuestions] = useState(true);
  const [loadingResult, setLoadingResult] = useState(false);

  const navigate = useNavigate();
  const headers = user ? { "x-user-id": user._id } : {};

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const res = await axios.post(
          "http://localhost:8000/quiz/start",
          {},
          { headers }
        );
        setQuestions(res.data.questions);
      } catch (err) {
        console.error("Error fetching questions:", err);
      } finally {
        setLoadingQuestions(false);
      }
    };
    fetchQuestions();
  }, []);

  const handleAnswer = async (option) => {
    const newAnswers = [...answers, option];
    setAnswers(newAnswers);

    if (current < questions.length - 1) {
      setCurrent(current + 1);
    } else {
      try {
        setLoadingResult(true);
        const res = await axios.post(
          "http://localhost:8000/quiz/fetch-animal",
          { questions, answers: newAnswers },
          { headers }
        );
        navigate("/result", { state: { result: res.data.result } });
      } catch (err) {
        console.error("Error fetching result:", err);
      } finally {
        setLoadingResult(false);
      }
    }
  };

  // Loader for quiz questions
  if (loadingQuestions) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 1.3, ease: "linear" }}
          className="w-12 h-12 border-4 border-pu1.3ple-500 border-t-transparent rounded-full"
          transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
          className="w-12 h-12 border-4 border-purple-400 border-t-transparent rounded-full"
        />
        <p className="mt-4 text-gray-300">Loading quiz questions...</p>
      </div>
    );
  }

  // Loader for AI result
  if (loadingResult) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: [0, 1], scale: [0.8, 1] }}
          transition={{ repeat: Infinity, duration: 1, ease: "easeInOut" }}
          className="w-12 h-12 border-4 border-purple-500 border-t-transparent rounded-full"
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
          className="w-12 h-12 border-4 border-teal-400 border-t-transparent rounded-full"
        />
        <p className="mt-4 text-gray-300">Finding your spirit animal...</p>
      </div>
    );
  }

  const currentQ = questions[current];

  return (
    <div className="flex flex-col items-center min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white px-4 py-10">
      {/* Quiz Card (fade in) */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.8 }}
        className="w-full max-w-2xl p-8 bg-gray-800/70 backdrop-blur-xl rounded-2xl shadow-xl border border-gray-700"
      >
        {/* Question */}
        <h2 className="text-2xl md:text-3xl font-bold mb-6 text-center text-purple-400">
    <div className="flex flex-col items-center min-h-screen bg-gradient-to-br from-indigo-900 via-purple-800 to-black text-white px-4 py-10">
      {/* Quiz Card */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-2xl p-8 bg-gray-800/70 backdrop-blur-xl rounded-2xl shadow-xl border border-gray-700"
      >
        {/* Question */}
        <h2 className="text-2xl md:text-3xl font-bold mb-6 text-center text-purple-100">
          {currentQ.question}
        </h2>

        {/* Options */}
        <div className="space-y-3">
          {currentQ.options.map((opt, idx) => (
            <motion.button
              key={idx}
              onClick={() => handleAnswer(opt)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="w-full py-3 px-4 bg-gradient-to-r from-purple-500 to-purple-600 rounded-xl 
                         hover:from-purple-600 hover:to-purple-700 transition text-lg font-medium shadow-md"
              className="w-full py-3 px-4 bg-gradient-to-r from-purple-600 to-purple-800 rounded-xl 
                         hover:from-purple-500 hover:to-purple-600 transition text-lg font-medium shadow-md"
            >
              {opt}
            </motion.button>
          ))}
        </div>

        {/* Progress */}
        <div className="mt-6">
          <div className="w-full bg-gray-700 rounded-full h-2">
            <motion.div
              className="bg-gray-100 h-2 rounded-full"
              className="bg-purple-400 h-2 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${((current + 1) / questions.length) * 100}%` }}
              transition={{ duration: 0.5 }}
            />
          </div>
          <p className="mt-3 text-sm text-gray-300 text-center">
            Question {current + 1} of {questions.length}
          </p>
        </div>
      </motion.div>
    </div>
  );
}

export default QuizPage;
