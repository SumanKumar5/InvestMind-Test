import React from 'react';
import { LineChart, Brain } from 'lucide-react';

const Hero: React.FC = () => {
  const scrollToFeatures = () => {
    const featuresSection = document.getElementById('features');
    if (featuresSection) {
      featuresSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="relative min-h-screen py-32 md:py-40 overflow-hidden flex items-center">
      {/* Background elements */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/3 w-96 h-96 bg-primary/20 rounded-full filter blur-[100px] animate-pulse"></div>
        <div className="absolute bottom-1/3 right-1/4 w-80 h-80 bg-primary/30 rounded-full filter blur-[100px] animate-pulse" style={{ animationDelay: '1s' }}></div>
      </div>
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-4xl mx-auto">
          <div className="inline-flex items-center bg-white/5 backdrop-blur-sm rounded-full px-6 py-3 mb-8 text-sm border border-white/10 hover:border-primary/50 transition-colors duration-300">
            <Brain className="h-5 w-5 mr-2 text-primary" />
            <span className="font-medium">AI-powered investment analytics</span>
          </div>
          
          <h1 className="text-7xl md:text-8xl font-bold mb-8 leading-tight gradient-text reveal-text">
            Track & Analyze Investments with AI
          </h1>
          
          <p className="text-xl md:text-2xl text-gray-400 mb-12 leading-relaxed max-w-3xl reveal-text" style={{ animationDelay: '0.2s' }}>
            Experience the future of investing with real-time asset data and personalized portfolio analytics.
          </p>
          
          <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-6 reveal-text" style={{ animationDelay: '0.4s' }}>
            <button className="btn-primary px-8 py-4 rounded-full text-lg font-medium">
              <LineChart className="h-5 w-5 mr-2 inline-block" />
              Start Investing
            </button>
            <button 
              onClick={scrollToFeatures}
              className="px-8 py-4 rounded-full text-lg font-medium border border-white/10 hover:border-primary/50 transition-colors duration-300 hover:bg-white/5"
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