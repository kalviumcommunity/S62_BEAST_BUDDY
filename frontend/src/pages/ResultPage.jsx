/* eslint-disable no-unused-vars */
import React from "react";
import { useLocation, useNavigate } from "react-router-dom";

const ResultPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const result = location.state?.result;

  if (!result) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen text-center text-gray-200">
        <h1 className="text-2xl font-bold">No Result Found</h1>
        <button
          onClick={() => navigate("/quiz")}
          className="mt-4 px-6 py-2 rounded-lg bg-green-600 hover:bg-green-700 text-white"
        >
          Take Quiz Again
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen text-gray-100 bg-gray-900 p-6">
      <h1 className="text-4xl font-bold mb-4">🎉 Your Spirit Animal</h1>
      <div className="bg-gray-800 shadow-lg rounded-2xl p-6 max-w-lg w-full">
        <h2 className="text-3xl font-semibold text-green-400">
          {result.animalName}
        </h2>
        <p className="mt-2 text-gray-300">{result.reason}</p>

        <div className="mt-4">
          <h3 className="text-xl font-semibold">🌟 Strengths</h3>
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

        <button
          onClick={() => navigate("/quiz")}
          className="mt-6 w-full py-2 rounded-lg bg-green-600 hover:bg-green-700 text-white"
        >
          Retake Quiz
        </button>
      </div>
    </div>
  );
};

export default ResultPage;
