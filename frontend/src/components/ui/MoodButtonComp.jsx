/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import React from "react";

const MoodButton = ({ mood, isActive, onClick }) => {
  return (
    <button
      onClick={() => onClick(mood)}
      className={`px-3 py-1 rounded-full text-white ${
        isActive ? "bg-orange-400" : "bg-gray-600 hover:bg-gray-500"
      }`}
    >
      {mood}
    </button>
  );
};

export default MoodButton;
