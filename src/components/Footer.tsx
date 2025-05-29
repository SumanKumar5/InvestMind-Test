import React from 'react';
import { Github, Twitter, Linkedin, Brain } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-950 border-t border-gray-800 py-12">
      <div className="container mx-auto px-4">
        <div className="flex flex-col items-center text-center">
          <div className="flex items-center space-x-2 mb-4">
            <Brain className="h-6 w-6 text-blue-500" />
            <span className="text-xl font-bold bg-gradient-to-r from-blue-500 to-teal-400 bg-clip-text text-transparent">InvestMinD</span>
          </div>
          <p className="text-gray-400 mb-6">
            AI-powered investment analytics.<br />
            Make smarter decisions with data-driven insights.
          </p>
          
          <div className="flex space-x-6 mb-8">
            <a href="#" className="text-gray-400 hover:text-white transition-colors">
              <Twitter className="h-5 w-5" />
            </a>
            <a href="#" className="text-gray-400 hover:text-white transition-colors">
              <Github className="h-5 w-5" />
            </a>
            <a href="#" className="text-gray-400 hover:text-white transition-colors">
              <Linkedin className="h-5 w-5" />
            </a>
          </div>
          
          <nav className="mb-8">
            <ul className="flex flex-wrap justify-center gap-6">
              <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Documentation</a></li>
              <li><button className="text-gray-400 hover:text-white transition-colors">Privacy Policy</button></li>
              <li><button className="text-gray-400 hover:text-white transition-colors">Terms of Service</button></li>
            </ul>
          </nav>
          
          <div className="text-gray-500 text-sm">
            <p>© 2025 InvestMinD. All rights reserved.</p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;