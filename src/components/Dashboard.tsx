import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { LineChart, Wallet, TrendingUp, PieChart } from 'lucide-react';

const Dashboard: React.FC = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user is authenticated
    const token = localStorage.getItem('investmind_token');
    if (!token) {
      navigate('/login');
    }
  }, [navigate]);

  const portfolioStats = {
    totalValue: '$124,532.89',
    dayChange: '+2.34%',
    monthChange: '+8.67%',
    yearChange: '+22.14%'
  };

  const quickActions = [
    { icon: <Wallet className="h-6 w-6" />, label: 'Add Funds' },
    { icon: <TrendingUp className="h-6 w-6" />, label: 'Trade' },
    { icon: <PieChart className="h-6 w-6" />, label: 'Portfolio' },
    { icon: <LineChart className="h-6 w-6" />, label: 'Analytics' }
  ];

  return (
    <div className="min-h-screen bg-gray-900">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Welcome back!</h1>

        {/* Portfolio Overview Card */}
        <div className="bg-gray-800 rounded-xl p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4">Portfolio Overview</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-gray-700/50 rounded-lg p-4">
              <p className="text-gray-400 text-sm">Total Value</p>
              <p className="text-2xl font-bold">{portfolioStats.totalValue}</p>
            </div>
            <div className="bg-gray-700/50 rounded-lg p-4">
              <p className="text-gray-400 text-sm">24h Change</p>
              <p className="text-2xl font-bold text-green-500">{portfolioStats.dayChange}</p>
            </div>
            <div className="bg-gray-700/50 rounded-lg p-4">
              <p className="text-gray-400 text-sm">30d Change</p>
              <p className="text-2xl font-bold text-green-500">{portfolioStats.monthChange}</p>
            </div>
            <div className="bg-gray-700/50 rounded-lg p-4">
              <p className="text-gray-400 text-sm">1y Change</p>
              <p className="text-2xl font-bold text-green-500">{portfolioStats.yearChange}</p>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {quickActions.map((action, index) => (
            <button
              key={index}
              className="bg-gray-800 hover:bg-gray-750 rounded-xl p-6 flex flex-col items-center justify-center gap-3 transition-all duration-300 hover:transform hover:scale-105"
            >
              <div className="bg-blue-500/10 p-3 rounded-lg">
                {action.icon}
              </div>
              <span className="text-sm font-medium">{action.label}</span>
            </button>
          ))}
        </div>

        {/* Recent Activity */}
        <div className="bg-gray-800 rounded-xl p-6">
          <h2 className="text-xl font-semibold mb-4">Recent Activity</h2>
          <div className="space-y-4">
            {[1, 2, 3].map((_, index) => (
              <div key={index} className="flex items-center justify-between py-3 border-b border-gray-700 last:border-0">
                <div className="flex items-center gap-4">
                  <div className="bg-blue-500/10 p-2 rounded-lg">
                    <TrendingUp className="h-5 w-5 text-blue-500" />
                  </div>
                  <div>
                    <p className="font-medium">Purchased AAPL</p>
                    <p className="text-sm text-gray-400">2 hours ago</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-medium">+12.5 shares</p>
                  <p className="text-sm text-gray-400">$2,145.50</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;