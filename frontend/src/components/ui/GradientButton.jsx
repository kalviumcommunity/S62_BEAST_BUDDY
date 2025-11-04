/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import React from "react";

const GradientButton = ({ children, onClick }) => {
  return (
    <button
      onClick={onClick}
      className="bg-gradient-to-r from-orange-400 to-pink-500 text-white px-6 py-2 rounded-full shadow-md hover:opacity-90 transition"
    >
      {children}
    </button>
  );
};

export default GradientButton;
