import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Brain, Menu, X, CheckCircle2 } from 'lucide-react';
import toast from 'react-hot-toast';

const Header: React.FC = () => {
  const navigate = useNavigate();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    const checkAuthStatus = () => {
      const token = localStorage.getItem('investmind_token');
      setIsLoggedIn(!!token);
    };

    window.addEventListener('scroll', handleScroll);
    checkAuthStatus();
    
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleAuthAction = () => {
    if (isLoggedIn) {
      localStorage.removeItem('investmind_token');
      setIsLoggedIn(false);
      
      // First navigate
      navigate('/');
      
      // Then show the notification after a small delay to ensure we're on the home page
      setTimeout(() => {
        toast.custom((t) => (
          <div
            className={`${
              t.visible ? 'animate-enter' : 'animate-leave'
            } toast-success max-w-md w-full bg-gray-800/95 shadow-lg rounded-lg pointer-events-auto flex items-center p-4`}
          >
            <div className="flex-shrink-0 text-green-400">
              <CheckCircle2 className="h-6 w-6" />
            </div>
            <div className="ml-3 flex-1">
              <p className="text-sm font-medium text-gray-100">
                Successfully signed out!
              </p>
            </div>
            <button
              onClick={() => toast.dismiss(t.id)}
              className="ml-4 flex-shrink-0 text-gray-400 hover:text-gray-300"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        ), { duration: 3000 });
      }, 100);
    } else {
      navigate('/login');
    }
  };

  return (
    <header 
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled 
          ? 'bg-gray-900/95 backdrop-blur-md shadow-lg' 
          : 'bg-transparent'
      }`}
    >
      <div className="container mx-auto px-4">
        <nav className="flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <div 
            className="flex items-center space-x-2 shrink-0 group cursor-pointer"
            onClick={() => navigate('/')}
          >
            <Brain className="h-8 w-8 text-blue-500 transition-transform duration-300 group-hover:scale-110" />
            <span className="text-xl font-bold bg-gradient-to-r from-blue-500 to-teal-400 bg-clip-text text-transparent">
              InvestMinD
            </span>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6">
            <div className="flex items-center space-x-2">
              <button 
                onClick={() => navigate('/')}
                className="px-4 py-2 rounded-lg transition-all duration-300 text-gray-300 hover:text-white hover:bg-gray-800/50"
              >
                Home
              </button>
              {isLoggedIn && (
                <button 
                  onClick={() => navigate('/portfolio')}
                  className="px-4 py-2 rounded-lg transition-all duration-300 text-gray-300 hover:text-white hover:bg-gray-800/50"
                >
                  Portfolio
                </button>
              )}
            </div>
            <button 
              onClick={handleAuthAction}
              className={`${
                isLoggedIn 
                  ? 'bg-gray-700 hover:bg-gray-600' 
                  : 'bg-blue-600 hover:bg-blue-700'
              } text-white px-6 py-2.5 rounded-lg transition-all duration-300 font-medium shadow-lg hover:shadow-blue-500/25 transform hover:scale-105 active:scale-95`}
            >
              {isLoggedIn ? 'Sign Out' : 'Sign In'}
            </button>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden p-2 text-gray-400 hover:text-white transition-colors rounded-lg hover:bg-gray-800/50"
            aria-label="Toggle menu"
          >
            {isMobileMenuOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </button>
        </nav>

        {/* Mobile Menu */}
        <div 
          className={`md:hidden transition-all duration-300 ease-in-out ${
            isMobileMenuOpen 
              ? 'max-h-64 opacity-100' 
              : 'max-h-0 opacity-0 pointer-events-none'
          }`}
        >
          <div className="py-4 space-y-4">
            <div className="space-y-2">
              <button 
                onClick={() => {
                  navigate('/');
                  setIsMobileMenuOpen(false);
                }}
                className="block w-full px-4 py-2 rounded-lg transition-all duration-300 text-gray-300 hover:text-white hover:bg-gray-800/50"
              >
                Home
              </button>
              {isLoggedIn && (
                <button 
                  onClick={() => {
                    navigate('/portfolio');
                    setIsMobileMenuOpen(false);
                  }}
                  className="block w-full px-4 py-2 rounded-lg transition-all duration-300 text-gray-300 hover:text-white hover:bg-gray-800/50"
                >
                  Portfolio
                </button>
              )}
            </div>
            <button 
              onClick={() => {
                handleAuthAction();
                setIsMobileMenuOpen(false);
              }}
              className={`w-full ${
                isLoggedIn 
                  ? 'bg-gray-700 hover:bg-gray-600' 
                  : 'bg-blue-600 hover:bg-blue-700'
              } text-white px-6 py-2.5 rounded-lg transition-all duration-300 font-medium shadow-lg hover:shadow-blue-500/25 transform hover:scale-105 active:scale-95`}
            >
              {isLoggedIn ? 'Sign Out' : 'Sign In'}
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;