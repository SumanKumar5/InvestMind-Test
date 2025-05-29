import React from 'react';
import { ArrowRight } from 'lucide-react';

const CTA: React.FC = () => {
  return (
    <section className="py-20 relative overflow-hidden">
      <div className="absolute inset-0 bg-blue-600/10 backdrop-blur-3xl"></div>
      <div className="container mx-auto px-4 relative">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6 bg-gradient-to-r from-blue-500 to-teal-400 bg-clip-text text-transparent">
            Ready to Transform Your Investment Strategy?
          </h2>
          <p className="text-lg text-gray-300 mb-8">
            Join thousands of investors using AI-powered insights to make smarter investment decisions.
          </p>
          <button className="btn-primary bg-blue-600 text-white px-8 py-4 rounded-xl shadow-lg shadow-blue-500/25 flex items-center justify-center mx-auto text-lg font-medium group">
            Get Started Now
            <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </div>
    </section>
  );
};

export default CTA;