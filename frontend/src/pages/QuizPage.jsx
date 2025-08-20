/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function QuizPage({ user }) {
  const [questions, setQuestions] = useState([]);
  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState([]);
  
  const navigate = useNavigate();

  // 👇 header only if user exists
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
      const res = await axios.post(
        "http://localhost:8000/quiz/fetch-animal",
        { questions, answers: newAnswers },
        { headers }
      );

      // 👉 Always pass only the actual `result` object
      navigate("/result", { state: { result: res.data.result } });
    } catch (err) {
      console.error("Error fetching result:", err);
    }
  }
};


  if (!questions.length) return <p className="text-white">Loading questions...</p>;

  const currentQ = questions[current];

  return (
    <div className="flex flex-col items-center min-h-screen bg-gray-900 text-white">
      <div className="max-w-xl p-6 bg-gray-800 rounded-2xl shadow-lg">
        <h2 className="text-xl font-bold mb-6">{currentQ.question}</h2>
        <div className="space-y-3">
          {currentQ.options.map((opt, idx) => (
            <button
              key={idx}
              onClick={() => handleAnswer(opt)}
              className="w-full py-2 px-4 bg-teal-600 rounded-xl hover:bg-teal-700 transition"
            >
              {opt}
            </button>
          ))}
        </div>
        <p className="mt-6 text-sm text-gray-400">
          Question {current + 1} of {questions.length}
        </p>
      </div>
    </div>
  );
}

export default QuizPage;
