/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from "react";
import apiClient from "../api/client";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useAuth } from "../context/AuthContext";

function QuizPage({ user: propUser }) {
  const [questions, setQuestions] = useState([]);
  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [loadingQuestions, setLoadingQuestions] = useState(true);
  const [loadingResult, setLoadingResult] = useState(false);
  const [selectedOption, setSelectedOption] = useState(null);

  const navigate = useNavigate();
  const { refetchUser } = useAuth();

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        // Reset quiz state for new attempt
        setCurrent(0);
        setAnswers([]);
        setSelectedOption(null);
        
        const res = await apiClient.post("/quiz/start", {});
        setQuestions(res.data.questions);
      } catch (err) {
        console.error("Error fetching questions:", err);
      } finally {
        setLoadingQuestions(false);
      }
    };
    fetchQuestions();
  }, []);

  const handleAnswer = async (option, index) => {
    setSelectedOption(index);
    
    setTimeout(async () => {
      const newAnswers = [...answers, option];
      setAnswers(newAnswers);
      setSelectedOption(null);

      if (current < questions.length - 1) {
        setCurrent(current + 1);
      } else {
        try {
          setLoadingResult(true);
          
          console.log("DEBUG: Submitting quiz...");
          console.log("  questions length:", questions.length, "first:", questions[0]);
          console.log("  newAnswers length:", newAnswers.length, "content:", newAnswers);
          
          const res = await apiClient.post("/quiz/fetch-animal", {
            questions,
            answers: newAnswers
          });
          console.log("DEBUG: Response received:", res.data);
          
          // If logged in, refresh auth user so dashboard/profile updates reflect new spirit animal
          if (refetchUser) {
            try { await refetchUser(); } catch (e) { /* ignore */ }
          }
          navigate("/result", { state: { result: res.data.result } });
        } catch (err) {
          console.error("Error fetching result:", err);
          console.error("Response data:", err.response?.data);
        } finally {
          setLoadingResult(false);
        }
      }
    }, 500);
  };

  if (loadingQuestions) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-purple-900 to-blue-950 text-white">
        <motion.div
          animate={{ 
            rotate: 360,
            scale: [1, 1.2, 1]
          }}
          transition={{ 
            repeat: Infinity, 
            duration: 2, 
            ease: "easeInOut" 
          }}
          className="w-16 h-16 border-4 border-orange-400 border-t-transparent rounded-full mb-4"
        />
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="text-lg text-gray-200"
        >
          Preparing your spirit animal journey...
        </motion.p>
      </div>
    );
  }

  if (loadingResult) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-purple-900 to-indigo-950 text-white">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ 
            opacity: [0.5, 1, 0.5], 
            scale: [0.8, 1.2, 0.8],
            rotate: 360 
          }}
          transition={{ 
            repeat: Infinity, 
            duration: 2, 
            ease: "easeInOut" 
          }}
          className="w-20 h-20 border-4 border-orange-500 border-t-transparent rounded-full mb-6"
        />
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center"
        >
          <h3 className="text-2xl font-bold text-white mb-2">
            Discovering Your Spirit Animal
          </h3>
          <p className="text-gray-200 text-lg">
            The magic is happening...
          </p>
        </motion.div>
        <motion.div
          className="flex space-x-2 mt-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              animate={{ 
                scale: [1, 1.5, 1],
                opacity: [0.3, 1, 0.3]
              }}
              transition={{ 
                repeat: Infinity, 
                duration: 1.5, 
                delay: i * 0.2 
              }}
              className="w-3 h-3 bg-orange-400 rounded-full"
            />
          ))}
        </motion.div>
      </div>
    );
  }

  const currentQ = questions[current];

  return (
    <div className="flex flex-col items-center min-h-screen bg-gradient-to-br from-purple-950 via-indigo-950 to-pink-950 text-white px-4 py-8 pt-24">
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-2xl mb-8"
      >
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-medium text-gray-200">
            Question {current + 1} of {questions.length}
          </span>
          <span className="text-sm font-medium text-orange-300">
            {Math.round(((current + 1) / questions.length) * 100)}% Complete
          </span>
        </div>
        <div className="w-full bg-white/20 backdrop-blur-sm rounded-full h-3">
          <motion.div
            className="bg-gradient-to-r from-orange-500 to-orange-400 h-3 rounded-full shadow-lg shadow-orange-500/25"
            initial={{ width: 0 }}
            animate={{ width: `${((current + 1) / questions.length) * 100}%` }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          />
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 30 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.6, type: "spring", stiffness: 100 }}
        className="w-full max-w-2xl p-8 bg-white/10 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20"
      >
        <div className="text-center mb-6">
          <motion.span 
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring" }}
            className="inline-block px-4 py-1 bg-orange-500 text-white text-sm font-bold rounded-full mb-4"
          >
            Question {current + 1}
          </motion.span>
        </div>

        <motion.h2
          key={current}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="text-2xl md:text-4xl font-bold text-center mb-8 text-white leading-tight"
        >
          {currentQ.question}
        </motion.h2>

        <div className="space-y-4">
          {currentQ.options.map((opt, idx) => (
            <motion.button
              key={idx}
              onClick={() => handleAnswer(opt, idx)}
              disabled={selectedOption !== null}
              whileHover={{ 
                scale: selectedOption === null ? 1.02 : 1,
                x: selectedOption === null ? 5 : 0
              }}
              whileTap={{ scale: selectedOption === null ? 0.98 : 1 }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ 
                opacity: 1, 
                y: 0,
                scale: selectedOption === idx ? 1.05 : 1
              }}
              transition={{ 
                duration: 0.4, 
                delay: idx * 0.1,
                type: "spring" 
              }}
              className={`w-full py-4 px-6 rounded-2xl text-lg font-semibold transition-all duration-300 shadow-lg ${
                selectedOption === idx
                  ? 'bg-gradient-to-r from-orange-500 to-orange-600 text-white shadow-orange-500/50 transform scale-105'
                  : 'bg-white/10 backdrop-blur-sm text-white hover:bg-white/20 border border-white/10 hover:border-white/30'
              }`}
            >
              <div className="flex items-center justify-between">
                <span>{opt}</span>
                {selectedOption === idx && (
                  <motion.div
                    initial={{ scale: 0, rotate: -180 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ type: "spring", stiffness: 200 }}
                  >
                    ✨
                  </motion.div>
                )}
              </div>
            </motion.button>
          ))}
        </div>

        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="mt-8 text-center"
        >
          <p className="text-gray-300 text-sm">
            Choose the option that resonates most with your personality
          </p>
        </motion.div>
      </motion.div>

      <motion.div
        animate={{
          y: [0, -10, 0],
          opacity: [0.3, 0.6, 0.3]
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: "easeInOut"
        }}
        className="fixed bottom-10 left-10 w-20 h-20 bg-orange-400/20 rounded-full blur-xl"
      />
      <motion.div
        animate={{
          y: [0, 10, 0],
          opacity: [0.4, 0.7, 0.4]
        }}
        transition={{
          duration: 3,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 1
        }}
        className="fixed top-20 right-10 w-16 h-16 bg-purple-400/20 rounded-full blur-xl"
      />
    </div>
  );
}

export default QuizPage;