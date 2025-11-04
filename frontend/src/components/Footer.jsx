/* eslint-disable no-unused-vars */
import React from 'react'

function Footer() {
  return (
    <div>
        <footer className="bg-indigo-900 py-6 px-6 md:px-20 mt-auto">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <p>© 2025 BeastBuddy. All rights reserved.</p>
          <div className="flex space-x-4 mt-2 md:mt-0">
            <a href="#" className="hover:text-orange-400 transition">Twitter</a>
            <a href="#" className="hover:text-orange-400 transition">Instagram</a>
            <a href="#" className="hover:text-orange-400 transition">Facebook</a>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default Footer;