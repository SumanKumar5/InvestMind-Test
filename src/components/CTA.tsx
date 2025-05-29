import React from 'react';
import { ArrowRight, Brain, LineChart, TrendingUp } from 'lucide-react';

const CTA: React.FC = () => {
  return (
    <section className="py-24 relative overflow-hidden">
      {/* Enhanced background effects */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-600/20 rounded-full filter blur-[100px] animate-pulse"></div>
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-600/20 rounded-full filter blur-[100px] animate-pulse" style={{ animationDelay: '1s' }}></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full h-full bg-gradient-to-b from-transparent via-blue-900/10 to-transparent"></div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-4xl mx-auto">
          <div className="bg-gradient-to-r from-gray-800/50 to-gray-900/50 backdrop-blur-xl rounded-2xl p-8 md:p-12 border border-gray-700/50 shadow-2xl">
            <div className="flex flex-col items-center text-center space-y-8">
              {/* Floating icons */}
              <div className="flex justify-center space-x-8 mb-4">
                <div className="animate-bounce" style={{ animationDelay: '0s', animationDuration: '2s' }}>
                  <div className="bg-blue-500/10 p-3 rounded-xl">
                    <Brain className="w-6 h-6 text-blue-400" />
                  </div>
                </div>
                <div className="animate-bounce" style={{ animationDelay: '0.5s', animationDuration: '2.2s' }}>
                  <div className="bg-teal-500/10 p-3 rounded-xl">
                    <LineChart className="w-6 h-6 text-teal-400" />
                  </div>
                </div>
                <div className="animate-bounce" style={{ animationDelay: '1s', animationDuration: '1.8s' }}>
                  <div className="bg-purple-500/10 p-3 rounded-xl">
                    <TrendingUp className="w-6 h-6 text-purple-400" />
                  </div>
                </div>
              </div>

              <h2 className="text-4xl md:text-5xl font-bold">
                Ready to{' '}
                <span className="bg-gradient-to-r from-blue-500 via-purple-500 to-teal-500 bg-clip-text text-transparent animate-gradient">
                  Transform
                </span>{' '}
                Your Investment Strategy?
              </h2>

              <p className="text-xl text-gray-300 max-w-2xl">
                Join thousands of investors using AI-powered insights to make smarter investment decisions.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 w-full max-w-md">
                <button className="flex-1 btn-primary bg-gradient-to-r from-blue-600 to-blue-700 text-white px-8 py-4 rounded-xl shadow-lg shadow-blue-500/25 flex items-center justify-center text-lg font-medium group hover:from-blue-700 hover:to-blue-800">
                  Start Free Trial
                  <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </button>
                <button className="flex-1 px-8 py-4 rounded-xl border border-gray-600 text-gray-300 hover:text-white hover:border-gray-500 transition-colors duration-300 text-lg font-medium">
                  Learn More
                </button>
              </div>

              <p className="text-sm text-gray-400">
                No credit card required • 14-day free trial • Cancel anytime
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CTA;