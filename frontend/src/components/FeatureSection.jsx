/* eslint-disable no-unused-vars */
import React from 'react'
import { motion } from 'framer-motion';

const features = [
  {
    title: 'Take a Quiz',
    description: 'Answer fun questions to discover your spirit animal.',
    icon: '📝',
  },
  {
    title: 'AI-Powered Match',
    description: 'Our AI finds the perfect animal based on your personality.',
    icon: '🤖',
  },
  {
    title: 'Explore Animals',
    description: 'Learn interesting facts about your matched animal.',
    icon: '🌿',
  },
  {
    title: 'Share with Friends',
    description: 'Show off your spirit animal to your friends!',
    icon: '🎉',
  },
];

function FeatureSection() {
  return (
    <div><section id="features" className="px-6 md:px-20 py-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {features.map((feature, index) => (
          <motion.div
            key={index}
            className="bg-white bg-opacity-10 backdrop-blur-md p-6 rounded-xl hover:scale-105 transform transition duration-500 cursor-pointer text-center"
            whileHover={{ scale: 1.1 }}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: index * 0.2 }}
          >
            <div className="text-5xl mb-4">{feature.icon}</div>
            <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
            <p className="text-gray-200">{feature.description}</p>
          </motion.div>
        ))}
      </section>

      {/* CTA Section */}
      <section className="text-center py-16 bg-indigo-800">
        <motion.h2
          className="text-3xl md:text-4xl font-bold mb-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
        >
          Ready to find your spirit animal?
        </motion.h2>
        <motion.button
          className="bg-orange-500 hover:bg-orange-600 px-8 py-4 rounded-full font-bold text-xl shadow-lg transition duration-300"
          whileHover={{ scale: 1.1 }}
        >
          Take Quiz Now
        </motion.button>
      </section></div>
  )
}

export default FeatureSection;