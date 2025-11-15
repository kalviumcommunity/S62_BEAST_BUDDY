/* eslint-disable no-unused-vars */
import React from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";

const LearnMore = () => {
  return (
    <div className="bg-gradient-to-b from-purple-900 via-blue-900 to-pink-900 text-gray-200 min-h-screen">
        <Header />
      <section className="py-24 text-center ">
        <h1 className="text-5xl font-bold mb-4 text-orange-400">
          Discover What Makes BeastBuddy Unique
        </h1>
        <p className="max-w-2xl mx-auto text-lg text-gray-400">
          Every animal match tells a story — of personality, emotion, and
          instinct. Learn how BeastBuddy finds yours.
        </p>
      </section>

      <section className="py-20 px-6 md:px-16 text-center" id="how-it-works">
        <h2 className="text-4xl font-bold mb-12 text-orange-400">
          How BeastBuddy Works
        </h2>
        <div className="grid md:grid-cols-3 gap-10 max-w-5xl mx-auto">
          {[
            {
              step: "1",
              title: "Take the Quiz",
              desc: "Answer fun, personality-based questions that help reveal your unique traits and instincts.",
            },
            {
              step: "2",
              title: "AI Matching",
              desc: "Our algorithm analyzes your choices to connect your personality with an animal that mirrors your inner nature.",
            },
            {
              step: "3",
              title: "Discover Yourself",
              desc: "Explore what your Beast Buddy says about your emotions, behavior, and strengths in daily life.",
            },
          ].map((item, i) => (
            <div
              key={i}
              className="bg-white bg-opacity-10 backdrop-blur-md p-6 rounded-xl hover:scale-105 transition-transform duration-150 ease-out cursor-pointer text-center"
            >
              <div className="text-5xl font-bold text-orange-500 mb-4">
                {item.step}
              </div>
              <h3 className="text-2xl font-semibold mb-3">{item.title}</h3>
              <p className="text-gray-400">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="py-20 text-center px-6 md:px-16" id="animals">
        <h2 className="text-4xl font-bold mb-12 text-orange-400">
          The Meaning Behind the Animals
        </h2>
        <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-10 max-w-5xl mx-auto">
          {[
            {
              emoji: "🦁",
              name: "Lion",
              desc: "Symbol of leadership, courage, and self-confidence.",
            },
            {
              emoji: "🦉",
              name: "Owl",
              desc: "Represents wisdom, deep thought, and intuition.",
            },
            {
              emoji: "🐬",
              name: "Dolphin",
              desc: "Embodies joy, empathy, and connection with others.",
            },
            {
              emoji: "🐺",
              name: "Wolf",
              desc: "Reflects loyalty, teamwork, and emotional depth.",
            },
          ].map((animal, i) => (
            <div
              key={i}
              className="bg-white bg-opacity-10 backdrop-blur-md p-6 rounded-xl hover:scale-105 transition-transform duration-150 ease-out cursor-pointer text-center"
            >
              <div className="text-6xl mb-4">{animal.emoji}</div>
              <h3 className="text-2xl font-semibold mb-2">{animal.name}</h3>
              <p className="text-gray-400">{animal.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="py-20 px-6 md:px-16 text-center">
        <h2 className="text-4xl font-bold mb-6 text-orange-400">
          The Idea Behind BeastBuddy
        </h2>
        <p className="max-w-3xl mx-auto text-lg text-gray-200 mb-8">
          BeastBuddy combines psychology-inspired personality mapping with a
          fun, story-driven experience. Each answer you give contributes to a
          unique personality signature, which our algorithm matches with an
          animal whose instincts and behavior align with your emotional
          patterns.
        </p>
        <p className="max-w-3xl mx-auto font-mono text-gray-300">
          It’s not just a quiz — it’s a journey of self-discovery wrapped in
          creativity, symbolism, and tech. As BeastBuddy grows, our AI system
          will continue learning from responses to refine each match even more
          deeply.
        </p>
      </section>

      <section className="py-16  text-center">
        <h2 className="text-4xl font-bold mb-6 text-orange-400">
          Ready to Meet Your Spirit Animal?
        </h2>
        <p className="max-w-2xl mx-auto text-gray-200 mb-10">
          Take the quiz and see which animal reflects your personality, traits,
          and instincts. Your Beast Buddy is waiting.
        </p>
        <a
          href="/quiz"
          className="bg-orange-500 hover:bg-orange-600 text-white font-semibold px-8 py-4 rounded-full transition"
        >
          Take the Quiz
        </a>
      </section>

      <Footer />
    </div>
  );
};

export default LearnMore;
