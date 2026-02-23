/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";
import apiClient from "../api/client";

const Contact = () => {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setStatus("");

    try {
      const res = await apiClient.post("/api/contact", { name, email, message });

      if (res.data?.success) {
        setIsSuccess(true);
        setStatus("Message sent successfully! Redirecting to homepage...");
        
        setName("");
        setEmail("");
        setMessage("");
        
        setTimeout(() => {
          navigate("/");
        }, 2000);
      } else {
        setStatus("Failed to send message. Please try again.");
        setIsSuccess(false);
      }
    } catch (error) {
      setStatus("An error occurred. Please try again later.");
      setIsSuccess(false);
    } finally {
      setIsLoading(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="min-h-screen flex flex-col bg-gradient-to-br from-indigo-900 via-purple-900 to-indigo-900 text-white">
        <Header />
        <main className="flex-1 flex items-center justify-center px-4 py-20">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center bg-white/10 backdrop-blur-lg rounded-3xl p-12 border border-white/20 max-w-md w-full"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring" }}
              className="text-6xl mb-6"
            >
              ✅
            </motion.div>
            <h2 className="text-3xl font-bold text-orange-400 mb-4">
              Message Sent!
            </h2>
            <p className="text-gray-200 mb-6">
              Thank you for reaching out. We'll get back to you soon!
            </p>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="flex items-center justify-center space-x-2 text-gray-300"
            >
              <div className="w-2 h-2 bg-orange-400 rounded-full animate-bounce"></div>
              <div className="w-2 h-2 bg-orange-400 rounded-full animate-bounce" style={{ animationDelay: "0.1s" }}></div>
              <div className="w-2 h-2 bg-orange-400 rounded-full animate-bounce" style={{ animationDelay: "0.2s" }}></div>
              <span className="ml-2">Redirecting...</span>
            </motion.div>
          </motion.div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-indigo-900 via-purple-900 to-indigo-900 text-white">
      <Header />

      <main className="flex-1 flex flex-col items-center justify-center px-4 py-20 pt-24">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-orange-400 to-orange-300 bg-clip-text text-transparent mb-4">
            Get in Touch
          </h1>
          <p className="text-gray-200 text-lg max-w-xl">
            Have questions, feedback, or just want to say hi?
            We'd love to connect with you. Fill out the form below!
          </p>
        </motion.div>

        <motion.form
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          onSubmit={handleSubmit}
          className="w-full max-w-lg bg-white/10 backdrop-blur-lg rounded-3xl p-8 border border-white/20"
        >
          <div className="space-y-6">
            <div>
              <input
                type="text"
                placeholder="Your Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full p-4 rounded-2xl bg-white/5 border border-white/10 text-white placeholder-gray-300 focus:outline-none focus:border-orange-400 transition-colors"
                required
                disabled={isLoading}
              />
            </div>

            <div>
              <input
                type="email"
                placeholder="Your Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full p-4 rounded-2xl bg-white/5 border border-white/10 text-white placeholder-gray-300 focus:outline-none focus:border-orange-400 transition-colors"
                required
                disabled={isLoading}
              />
            </div>

            <div>
              <textarea
                rows="5"
                placeholder="Your Message"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="w-full p-4 rounded-2xl bg-white/5 border border-white/10 text-white placeholder-gray-300 focus:outline-none focus:border-orange-400 transition-colors resize-none"
                required
                disabled={isLoading}
              />
            </div>

            <motion.button
              whileHover={!isLoading ? { scale: 1.02 } : {}}
              whileTap={!isLoading ? { scale: 0.98 } : {}}
              type="submit"
              disabled={isLoading}
              className="w-full py-4 rounded-2xl bg-gradient-to-r from-orange-500 to-orange-400 hover:from-orange-600 hover:to-orange-500 disabled:from-orange-400 disabled:to-orange-300 text-white font-bold text-lg shadow-lg shadow-orange-500/25 transition-all flex items-center justify-center"
            >
              {isLoading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-3" />
                  Sending Message...
                </>
              ) : (
                "Send Message"
              )}
            </motion.button>
          </div>
        </motion.form>

        <AnimatePresence>
          {status && !isSuccess && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className={`mt-6 p-4 rounded-2xl border ${
                status.includes("Failed") || status.includes("error")
                  ? "bg-red-500/20 border-red-400/30 text-red-200"
                  : "bg-green-500/20 border-green-400/30 text-green-200"
              }`}
            >
              {status}
            </motion.div>
          )}
        </AnimatePresence>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="mt-12 text-center text-gray-300"
        >
          <p className="mb-2">
            Email:{" "}
            <a
              href="mailto:beastbuddyteam@gmail.com"
              className="text-orange-400 hover:text-orange-300 transition-colors"
            >
              beastbuddyteam@gmail.com
            </a>
          </p>
          <p>
            Follow us:{" "}
            <a
              href="#"
              className="text-orange-400 hover:text-orange-300 transition-colors"
            >
              @beastbuddy
            </a>
          </p>
        </motion.div>
      </main>

      <Footer />
    </div>
  );
};

export default Contact;