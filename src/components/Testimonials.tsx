import React from 'react';
import { Star } from 'lucide-react';

const Testimonials: React.FC = () => {
  const testimonials = [
    {
      name: "Sarah Chen",
      role: "Portfolio Manager",
      image: "https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=400",
      content: "InvestMinD's AI analytics have transformed how I manage client portfolios. The insights are invaluable.",
      rating: 5
    },
    {
      name: "Michael Roberts",
      role: "Day Trader",
      image: "https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=400",
      content: "The real-time market analysis helps me make faster, more informed trading decisions. A game-changer!",
      rating: 5
    },
    {
      name: "Emily Thompson",
      role: "Investment Advisor",
      image: "https://images.pexels.com/photos/1181686/pexels-photo-1181686.jpeg?auto=compress&cs=tinysrgb&w=400",
      content: "My clients love the clear insights and predictions. It's made our investment discussions much more productive.",
      rating: 5
    }
  ];

  return (
    <section className="py-24 bg-gray-900/50">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-12">
          Trusted by <span className="bg-gradient-to-r from-blue-500 to-teal-400 bg-clip-text text-transparent">Investment Professionals</span>
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <div 
              key={index}
              className="bg-gradient-to-b from-gray-800/80 to-gray-800/40 backdrop-blur-sm rounded-xl p-6 border border-gray-700/50 hover:border-blue-500/50 transition-all duration-300 hover:shadow-[0_0_30px_rgba(59,130,246,0.15)] group"
            >
              <div className="flex items-center space-x-4 mb-6">
                <img 
                  src={testimonial.image} 
                  alt={testimonial.name}
                  className="w-16 h-16 rounded-full object-cover border-2 border-gray-700 group-hover:border-blue-500 transition-colors duration-300"
                />
                <div>
                  <h3 className="font-semibold text-lg text-white group-hover:text-blue-400 transition-colors duration-300">
                    {testimonial.name}
                  </h3>
                  <p className="text-gray-400">{testimonial.role}</p>
                </div>
              </div>
              
              <div className="flex mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star 
                    key={i}
                    className="w-5 h-5 text-yellow-400 fill-current"
                  />
                ))}
              </div>
              
              <p className="text-gray-300 leading-relaxed">
                "{testimonial.content}"
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;