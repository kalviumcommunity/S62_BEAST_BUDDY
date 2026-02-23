/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { fetchAllAnimals } from "../services/animalService";

const AnimalEncyclopedia = () => {
  const [animals, setAnimals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedAnimal, setSelectedAnimal] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("name");

  useEffect(() => {
    window.scrollTo(0, 0);
    loadAnimals();
  }, []);

  const loadAnimals = async () => {
    try {
      setLoading(true);
      setError("");
      const data = await fetchAllAnimals(sortBy);
      setAnimals(data);
    } catch (err) {
      console.error("Failed to load animals:", err);
      setError("Failed to load the animal encyclopedia. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  // Filter animals based on search term
  const filteredAnimals = animals.filter(
    (animal) =>
      animal.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      animal.traits.some((trait) =>
        trait.toLowerCase().includes(searchTerm.toLowerCase())
      )
  );

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut",
      },
    },
  };

  const cardHoverVariants = {
    rest: {
      y: 0,
      boxShadow: "0 10px 30px rgba(0, 0, 0, 0.3)",
    },
    hover: {
      y: -8,
      boxShadow: "0 20px 40px rgba(249, 115, 22, 0.4)",
    },
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col bg-gradient-to-br from-purple-900 via-blue-900 to-pink-900 text-white">
        <Header />
        <div className="flex-1 flex items-center justify-center">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            className="w-16 h-16 border-4 border-orange-400 border-t-transparent rounded-full"
          />
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-purple-900 via-blue-900 to-pink-900 text-white">
      <Header />

      {/* Hero Section */}
      <motion.section
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="relative px-4 py-16 text-center"
      >
        <div className="max-w-4xl mx-auto">
          <h1 className="text-5xl md:text-6xl font-bold mb-4 bg-gradient-to-r from-orange-400 via-yellow-300 to-orange-400 bg-clip-text text-transparent">
            Spirit Animal Encyclopedia
          </h1>
          <p className="text-lg md:text-xl text-gray-200 mb-8">
            Explore the wisdom and symbolism of 15 spirit animals. Each creature embodies unique traits and lessons.
          </p>

          {/* Search and Sort */}
          <div className="grid md:grid-cols-2 gap-4 max-w-2xl mx-auto">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
            >
              <input
                type="text"
                placeholder="Search by name or trait..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-white/10 backdrop-blur-sm border border-white/20 text-white placeholder-gray-300 focus:outline-none focus:border-orange-400 transition-colors"
              />
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
            >
              <select
                value={sortBy}
                onChange={(e) => {
                  setSortBy(e.target.value);
                  // Reload animals with new sort
                  fetchAllAnimals(e.target.value)
                    .then((data) => setAnimals(data))
                    .catch(console.error);
                }}
                className="w-full px-4 py-3 rounded-xl bg-white/10 backdrop-blur-sm border border-white/20 text-white focus:outline-none focus:border-orange-400 transition-colors"
              >
                <option value="name" className="text-gray-900">
                  Sort by Name
                </option>
                <option value="newest" className="text-gray-900">
                  Newest First
                </option>
              </select>
            </motion.div>
          </div>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="text-gray-300 mt-4"
          >
            Showing {filteredAnimals.length} of {animals.length} animals
          </motion.p>
        </div>
      </motion.section>

      {/* Error State */}
      {error && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-4xl mx-auto px-4 mb-8"
        >
          <div className="bg-red-500/20 border border-red-400/30 rounded-xl p-4 text-red-200">
            {error}
          </div>
        </motion.div>
      )}

      {/* Animals Grid */}
      <motion.section
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="flex-1 px-4 py-12"
      >
        <div className="max-w-6xl mx-auto">
          {filteredAnimals.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-12"
            >
              <p className="text-xl text-gray-300">
                No animals found matching your search.
              </p>
            </motion.div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredAnimals.map((animal) => (
                <motion.div
                  key={animal._id}
                  variants={itemVariants}
                  whileHover="hover"
                  initial="rest"
                  animate="rest"
                  variants={cardHoverVariants}
                  onClick={() => setSelectedAnimal(animal)}
                  className="cursor-pointer group"
                >
                  <div className="bg-white/10 backdrop-blur-xl rounded-2xl overflow-hidden border border-white/20 hover:border-orange-400/50 transition-all duration-300 h-full flex flex-col">
                    {/* Animal Image */}
                    <div className="relative h-48 overflow-hidden bg-gradient-to-br from-orange-400 to-pink-500">
                      <img
                        src={animal.imageUrl}
                        alt={animal.name}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                    </div>

                    {/* Content */}
                    <div className="p-6 flex-1 flex flex-col">
                      <h3 className="text-2xl font-bold text-white mb-2">
                        {animal.name}
                      </h3>

                      <p className="text-gray-300 text-sm mb-4 line-clamp-3">
                        {animal.description}
                      </p>

                      {/* Traits */}
                      <div className="mb-4">
                        <p className="text-xs text-orange-300 font-semibold mb-2">
                          KEY TRAITS
                        </p>
                        <div className="flex flex-wrap gap-2">
                          {animal.traits.slice(0, 3).map((trait, idx) => (
                            <span
                              key={idx}
                              className="text-xs bg-orange-500/20 text-orange-300 px-3 py-1 rounded-full border border-orange-400/30"
                            >
                              {trait}
                            </span>
                          ))}
                          {animal.traits.length > 3 && (
                            <span className="text-xs text-gray-400 px-3 py-1">
                              +{animal.traits.length - 3}
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Learn More Button */}
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setSelectedAnimal(animal)}
                        className="mt-auto px-4 py-2 rounded-lg bg-gradient-to-r from-orange-500 to-pink-500 text-white font-semibold text-sm hover:shadow-lg hover:shadow-orange-500/30 transition-all"
                      >
                        Learn More
                      </motion.button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </motion.section>

      {/* Modal for Selected Animal */}
      {selectedAnimal && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => setSelectedAnimal(null)}
          className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            onClick={(e) => e.stopPropagation()}
            className="bg-gradient-to-br from-purple-900 to-indigo-900 rounded-3xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-white/20"
          >
            <div className="relative">
              {/* Close Button */}
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setSelectedAnimal(null)}
                className="absolute top-4 right-4 z-10 w-10 h-10 rounded-full bg-red-500/80 hover:bg-red-600 flex items-center justify-center text-white font-bold text-lg"
              >
                ×
              </motion.button>

              {/* Animal Image */}
              <div className="h-72 relative overflow-hidden">
                <img
                  src={selectedAnimal.imageUrl}
                  alt={selectedAnimal.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-purple-900/80" />
              </div>

              {/* Content */}
              <div className="p-8 text-white">
                <motion.h2
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="text-4xl font-bold mb-2 bg-gradient-to-r from-orange-400 to-pink-400 bg-clip-text text-transparent"
                >
                  {selectedAnimal.name}
                </motion.h2>

                {/* Symbolism */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="mb-6 p-4 bg-orange-500/10 border border-orange-400/30 rounded-xl"
                >
                  <p className="text-orange-300 font-semibold mb-2">✨ Symbolism</p>
                  <p className="text-gray-200">{selectedAnimal.symbolism}</p>
                </motion.div>

                {/* Description */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  className="mb-6"
                >
                  <h3 className="text-xl font-semibold text-orange-300 mb-3">
                    About the {selectedAnimal.name}
                  </h3>
                  <p className="text-gray-300 leading-relaxed">
                    {selectedAnimal.description}
                  </p>
                </motion.div>

                {/* Traits */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                  className="mb-6"
                >
                  <h3 className="text-xl font-semibold text-orange-300 mb-3">
                    🌟 Key Traits
                  </h3>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {selectedAnimal.traits.map((trait, idx) => (
                      <div
                        key={idx}
                        className="bg-white/10 rounded-lg p-3 text-center border border-white/10 hover:border-orange-400/50 transition-colors"
                      >
                        <p className="text-orange-300 font-medium">{trait}</p>
                      </div>
                    ))}
                  </div>
                </motion.div>

                {/* Fun Facts */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 }}
                  className="mb-6"
                >
                  <h3 className="text-xl font-semibold text-orange-300 mb-3">
                    🎯 Fun Facts
                  </h3>
                  <ul className="space-y-2">
                    {selectedAnimal.funFacts.map((fact, idx) => (
                      <motion.li
                        key={idx}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.7 + idx * 0.1 }}
                        className="flex items-start gap-3 text-gray-300"
                      >
                        <span className="text-orange-400 font-bold mt-1">•</span>
                        <span>{fact}</span>
                      </motion.li>
                    ))}
                  </ul>
                </motion.div>

                {/* Tags */}
                {selectedAnimal.tags && selectedAnimal.tags.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.8 }}
                  >
                    <p className="text-sm text-gray-400 mb-2">Tags:</p>
                    <div className="flex flex-wrap gap-2">
                      {selectedAnimal.tags.map((tag, idx) => (
                        <span
                          key={idx}
                          className="text-xs bg-purple-500/30 text-purple-200 px-3 py-1 rounded-full border border-purple-400/30"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </motion.div>
                )}
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}

      <Footer />
    </div>
  );
};

export default AnimalEncyclopedia;
