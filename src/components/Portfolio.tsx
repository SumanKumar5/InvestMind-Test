import React from 'react';
import { Brain } from 'lucide-react';
import Header from './Header';
import Footer from './Footer';

const Portfolio: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-900 flex flex-col">
      <Header />
      <div className="flex-grow container mx-auto px-4 py-24">
        <div className="max-w-4xl mx-auto text-center">
          <div className="flex items-center justify-center space-x-3 mb-8">
            <Brain className="h-12 w-12 text-blue-500" />
            <span className="text-3xl font-bold bg-gradient-to-r from-blue-500 to-teal-400 bg-clip-text text-transparent">
              InvestMinD
            </span>
          </div>
          <h1 className="text-4xl font-bold mb-6">Welcome Back!</h1>
          <p className="text-xl text-gray-400">
            Your portfolio dashboard is coming soon.
          </p>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Portfolio;