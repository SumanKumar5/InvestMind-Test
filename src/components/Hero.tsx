import React from 'react';
import { useNavigate } from 'react-router-dom';
import { LineChart, Brain } from 'lucide-react';

const Hero: React.FC = () => {
  const navigate = useNavigate();

  const scrollToFeatures = () => {
    const featuresSection = document.getElementById('features');
    if (featuresSection) {
      featuresSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleStartTracking = () => {
    const token = localStorage.getItem('investmind_token');
    if (token) {
      navigate('/portfolio');
    } else {
      navigate('/login');
    }
  };

  return (
    <section className="relative min-h-screen py-32 md:py-40 overflow-hidden flex items-center">
      {/* Enhanced background elements */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-1/4 left-1/3 w-96 h-96 bg-blue-600 rounded-full filter blur-[100px] animate-pulse"></div>
        <div className="absolute bottom-1/3 right-1/4 w-80 h-80 bg-purple-600 rounded-full filter blur-[100px] animate-pulse" style={{ animationDelay: '1s' }}></div>
        <div className="absolute top-1/2 left-1/2 w-72 h-72 bg-teal-600 rounded-full filter blur-[100px] animate-pulse" style={{ animationDelay: '2s' }}></div>
      </div>
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-4xl mx-auto">
          <div className="inline-flex items-center bg-gray-800/80 backdrop-blur-sm rounded-full px-6 py-3 mb-8 text-sm text-blue-400 border border-gray-700/50 shadow-lg transform hover:scale-105 transition-transform duration-300">
            <Brain className="h-5 w-5 mr-2" />
            <span className="font-medium">AI-powered investment analytics</span>
          </div>
          
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold mb-8 leading-tight animate-gradient bg-gradient-to-r from-blue-500 via-teal-400 to-blue-500 bg-clip-text text-transparent">
            Track, analyze, and grow your investments with AI
          </h1>
          
          <p className="text-xl md:text-2xl text-gray-300 mb-12 leading-relaxed max-w-3xl">
            Experience the future of investing with real-time asset data and personalized portfolio analytics.
            Let our AI help you make smarter investment decisions backed by data-driven insights.
          </p>
          
          <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-6">
            <button 
              onClick={handleStartTracking}
              className="btn-primary bg-blue-600 text-white font-medium px-8 py-4 rounded-xl shadow-lg shadow-blue-500/25 flex items-center justify-center text-lg"
            >
              <LineChart className="h-5 w-5 mr-2" />
              Start Tracking
            </button>
            <button 
              onClick={scrollToFeatures}
              className="btn-primary bg-gray-800 text-white font-medium px-8 py-4 rounded-xl shadow-lg border border-gray-700/50 flex items-center justify-center text-lg hover:bg-gray-750"
            >
              Learn More
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;