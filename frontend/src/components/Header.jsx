/* eslint-disable no-unused-vars */
import React from 'react'

function Header() {
  return (
    <div>
        <header className="flex justify-between items-center px-6 md:px-20 py-4 bg-indigo-900 backdrop-blur-md fixed w-full z-50">
        <div className="text-2xl font-bold">BeastBuddy</div>
        <nav className="space-x-6 hidden md:flex">
          <a href="#features" className="hover:text-orange-400 transition">Features</a>
          <a href="#about" className="hover:text-orange-400 transition">About</a>
          <a href="#contact" className="hover:text-orange-400 transition">Contact</a>
        </nav>
        <div className="space-x-4">
          <button className="px-4 py-2 rounded-full bg-white text-indigo-900 font-semibold hover:scale-105 transform transition">Login</button>
          <button className="px-4 py-2 rounded-full bg-orange-500 hover:bg-orange-600 font-semibold transition">Sign Up</button>
        </div>
      </header>
    </div>
  )
}

export default Header;