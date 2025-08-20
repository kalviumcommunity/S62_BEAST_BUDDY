/* eslint-disable no-unused-vars */
import React from 'react';
import Logo from '../assets/image.png';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

function HeroSection() {
  return (
    <div>
        <section className="flex flex-col md:flex-row items-center justify-between px-6 md:px-20 pt-28 pb-20">
        <div className="md:w-1/2 space-y-6">
          <motion.h1
            className="text-5xl md:text-6xl font-bold"
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
          >
            Discover Your Spirit Animal
          </motion.h1>
          <motion.p
            className="text-lg md:text-xl text-gray-200"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.3 }}
          >
            Take our fun quiz and find the animal that reflects your personality!
          </motion.p>
          <motion.div
            className="flex space-x-4 mt-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.6 }}
          >
            <Link to="/quiz" className="bg-orange-500 hover:bg-orange-600 px-8 py-4 rounded-full font-bold text-xl shadow-lg transition duration-300">
              Take Quiz Now
            </Link>
            <button className="bg-white text-indigo-900 px-6 py-3 rounded-full font-semibold shadow-lg hover:scale-105 transform transition duration-300">
              Learn More
            </button>
          </motion.div>
        </div>
        <div className="md:w-1/2 mt-10 md:mt-0 flex justify-center ">
          <motion.img
            src={Logo}
            alt="Spirit Animal"
            className="w-[350px] md:w-[450px] rounded-full bg-gradient-to-tr from-navy-blue-600 to-purple-600 p-4 shadow-2xl"
            animate={{
              y: [0, -15, 0],
              boxShadow: [
                "0 0 40px 20px rgba(224, 44, 27, 0.73)",
                "0 0 40px rgba(177, 60, 60, 0.9)",
                "0 0 20px rgba(255, 165, 0, 0.5)",
              ],
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        </div>
      </section>
    </div>
  )
}

export default HeroSection