import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Brain, Menu, X, CheckCircle2, User } from 'lucide-react';
import toast, { Toaster } from 'react-hot-toast';
import { useAuth } from '../contexts/AuthContext';

const Header: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuth();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogoClick = () => {
    if (location.pathname === '/') {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    } else {
      navigate('/');
    }
  };

  const handleAuthAction = () => {
    if (user) {
      logout();
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
      <Toaster 
        position="top-right"
        toastOptions={{
          duration: 3000,
          className: 'bg-transparent border-0 shadow-none p-0 m-0'
        }}
      />
      
      <div className="container mx-auto px-4">
        <nav className="flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <div 
            className="flex items-center space-x-2 shrink-0 group cursor-pointer"
            onClick={handleLogoClick}
          >
            <Brain className="h-8 w-8 text-blue-500 transition-transform duration-300 group-hover:scale-110" />
            <span className="text-xl font-bold bg-gradient-to-r from-blue-500 to-teal-400 bg-clip-text text-transparent">
              InvestMinD
            </span>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6">
            <div className="flex items-center space-x-4">
              <button 
                onClick={() => navigate('/')}
                className="px-4 py-2 rounded-lg transition-all duration-300 text-gray-300 hover:text-white hover:bg-gray-800/50"
              >
                Home
              </button>
              {user && (
                <button 
                  onClick={() => navigate('/portfolio')}
                  className="px-4 py-2 rounded-lg transition-all duration-300 text-gray-300 hover:text-white hover:bg-gray-800/50"
                >
                  Portfolio
                </button>
              )}
            </div>
            
            <div className="flex items-center space-x-4">
              {user && (
                <div className="flex items-center space-x-2 px-4 py-2 rounded-lg bg-gray-800/50">
                  <User className="h-5 w-5 text-gray-400" />
                  <span className="text-gray-200">Hi, {user.name.split(' ')[0]} 👋</span>
                </div>
              )}
              <button 
                onClick={handleAuthAction}
                className={`${
                  user 
                    ? 'bg-gray-700 hover:bg-gray-600' 
                    : 'bg-blue-600 hover:bg-blue-700'
                } text-white px-6 py-2.5 rounded-lg transition-all duration-300 font-medium shadow-lg hover:shadow-blue-500/25 transform hover:scale-105 active:scale-95`}
              >
                {user ? 'Sign Out' : 'Sign In'}
              </button>
            </div>
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
            {user && (
              <div className="flex items-center space-x-2 px-4 py-2 rounded-lg bg-gray-800/50">
                <User className="h-5 w-5 text-gray-400" />
                <span className="text-gray-200">Hi, {user.name.split(' ')[0]} 👋</span>
              </div>
            )}
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
              {user && (
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
                user 
                  ? 'bg-gray-700 hover:bg-gray-600' 
                  : 'bg-blue-600 hover:bg-blue-700'
              } text-white px-6 py-2.5 rounded-lg transition-all duration-300 font-medium shadow-lg hover:shadow-blue-500/25 transform hover:scale-105 active:scale-95`}
            >
              {user ? 'Sign Out' : 'Sign In'}
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;