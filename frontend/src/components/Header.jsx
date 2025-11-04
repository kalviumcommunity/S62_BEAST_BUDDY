import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';

function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location]);

  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
    setIsMobileMenuOpen(false);
  };

  return (
    <>
      <header 
        className={`fixed w-full z-50 transition-all duration-300 ${
          isScrolled 
            ? 'bg-blue-100/95 backdrop-blur-lg shadow-lg py-2' 
            : 'bg-gradient-to-b from-indigo-900 via-purple-900 to-indigo-900/95 backdrop-blur-md py-4'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center">
            {/* Logo */}
            <Link 
              to="/" 
              className={`text-2xl font-bold transition-colors ${
                isScrolled ? 'text-indigo-900' : 'text-white'
              }`}
            >
              BeastBuddy
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-8">
              {['features', 'about', 'contact'].map((item) => (
                <button
                  key={item}
                  onClick={() => scrollToSection(item)}
                  className={`font-medium capitalize transition-all hover:text-orange-400 ${
                    isScrolled ? 'text-gray-700' : 'text-white'
                  }`}
                >
                  {item}
                </button>
              ))}
            </nav>

            {/* Desktop Auth Buttons */}
            <div className="hidden md:flex items-center space-x-3">
              <Link 
                to="/login" 
                className={`px-6 py-2 rounded-full font-semibold transition-all border ${
                  isScrolled 
                    ? 'bg-white text-indigo-900 border-indigo-200 hover:bg-gray-50 hover:scale-105' 
                    : 'bg-white/10 text-white border-white/20 backdrop-blur-sm hover:bg-white/20 hover:scale-105'
                }`}
              >
                Login
              </Link>
              <Link 
                to="/signup" 
                className="px-6 py-2 rounded-full bg-orange-500 text-white font-semibold transition-all hover:bg-orange-600 hover:scale-105 shadow-lg shadow-orange-500/25"
              >
                Sign Up
              </Link>
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className={`md:hidden p-2 rounded-lg transition-colors ${
                isScrolled ? 'text-gray-700' : 'text-white'
              }`}
              aria-label="Toggle menu"
            >
              <div className="w-6 h-6 flex flex-col justify-center space-y-1">
                <span 
                  className={`block h-0.5 w-6 bg-current transition-transform ${
                    isMobileMenuOpen ? 'rotate-45 translate-y-1.5' : ''
                  }`}
                />
                <span 
                  className={`block h-0.5 w-6 bg-current transition-opacity ${
                    isMobileMenuOpen ? 'opacity-0' : 'opacity-100'
                  }`}
                />
                <span 
                  className={`block h-0.5 w-6 bg-current transition-transform ${
                    isMobileMenuOpen ? '-rotate-45 -translate-y-1.5' : ''
                  }`}
                />
              </div>
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        <div 
          className={`md:hidden absolute top-full left-0 w-full bg-white/95 backdrop-blur-lg shadow-lg transition-all duration-300 ${
            isMobileMenuOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0 overflow-hidden'
          }`}
        >
          <div className="px-4 pt-2 pb-6 space-y-4">
            {['features', 'about', 'contact'].map((item) => (
              <button
                key={item}
                onClick={() => scrollToSection(item)}
                className="block w-full text-left px-4 py-3 text-gray-700 font-medium rounded-lg hover:bg-indigo-50 hover:text-indigo-900 transition-colors capitalize"
              >
                {item}
              </button>
            ))}
            <div className="pt-4 space-y-3 border-t border-gray-200">
              <Link 
                to="/login" 
                className="block w-full text-center px-4 py-3 bg-indigo-100 text-indigo-900 font-semibold rounded-lg hover:bg-indigo-200 transition-colors"
              >
                Login
              </Link>
              <Link 
                to="/signup" 
                className="block w-full text-center px-4 py-3 bg-orange-500 text-white font-semibold rounded-lg hover:bg-orange-600 transition-colors shadow-lg shadow-orange-500/25"
              >
                Sign Up
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Spacer for fixed header */}
      <div className="h-20 md:h-24" />
    </>
  );
}

export default Header;