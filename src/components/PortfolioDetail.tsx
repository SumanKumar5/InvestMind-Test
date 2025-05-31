import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  Download, 
  Plus, 
  Trash2, 
  Brain, 
  Loader2, 
  X, 
  CheckCircle2,
  TrendingUp,
  TrendingDown,
  PieChart
} from 'lucide-react';
import { 
  PieChart as RechartsPieChart, 
  Pie, 
  Cell, 
  ResponsiveContainer, 
  Tooltip 
} from 'recharts';
import toast, { Toaster } from 'react-hot-toast';
import { useRequireAuth } from '../hooks/useAuth';
import Header from './Header';
import Footer from './Footer';
import { formatCurrency, formatPercentage } from '../utils/formatters';

interface Holding {
  id: string;
  symbol: string;
  name: string;
  quantity: number;
  buyPrice: number;
  currentPrice: number;
  marketValue: number;
  gainLoss: number;
  sector: string;
}

interface Analytics {
  totalInvestment: number;
  currentValue: number;
  profitLossPercentage: number;
  cagr: number;
}

interface SectorData {
  sector: string;
  percentage: number;
}

const COLORS = [
  '#3B82F6', '#10B981', '#6366F1', '#F59E0B', '#EC4899',
  '#8B5CF6', '#14B8A6', '#F97316', '#06B6D4', '#6366F1'
];

const PortfolioDetail: React.FC = () => {
  useRequireAuth();
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [holdings, setHoldings] = useState<Holding[]>([]);
  const [analytics, setAnalytics] = useState<Analytics | null>(null);
  const [sectorData, setSectorData] = useState<SectorData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [holdingToDelete, setHoldingToDelete] = useState<string | null>(null);
  const [newHolding, setNewHolding] = useState({
    symbol: '',
    quantity: '',
    buyPrice: '',
    sector: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

const fetchData = async () => {
  setIsLoading(true);
  try {
    const [holdingsRes, analyticsRes, cagrRes, sectorRes] = await Promise.all([
      fetch(`/api/portfolios/${id}/holdings`),
      fetch(`/api/analytics/${id}`),
      fetch(`/api/analytics/${id}/cagr`),
      fetch(`/api/analytics/${id}/sector`)
    ]);

    if (!holdingsRes.ok || !analyticsRes.ok || !cagrRes.ok || !sectorRes.ok) {
      throw new Error("One or more requests failed");
    }

    const holdingsData = await holdingsRes.json();
    const analyticsData = await analyticsRes.json();
    const { cagr } = await cagrRes.json();
    const sectorData = await sectorRes.json();

    setHoldings(holdingsData ?? []);
    setAnalytics({ ...analyticsData, cagr: cagr ?? 0 });
    setSectorData(sectorData ?? []);
  } catch (error) {
    console.error(" Error loading portfolio data:", error);
    toast.error('Failed to load portfolio data. Please try again.');
  } finally {
    setIsLoading(false);
  }
};

  useEffect(() => {
    fetchData();
  }, [id]);

  const handleExport = async () => {
    try {
      const response = await fetch(`/api/exports/${id}`);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'portfolio-export.xlsx';
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      toast.error('Failed to export portfolio');
    }
  };

  const handleAddHolding = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newHolding.symbol || !newHolding.quantity || !newHolding.buyPrice || !newHolding.sector) {
      toast.error('Please fill in all fields');
      return;
    }

    setIsSubmitting(true);
    try {
      await fetch(`/api/portfolios/${id}/holdings`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newHolding)
      });

      await fetchData();
      setIsAddModalOpen(false);
      setNewHolding({ symbol: '', quantity: '', buyPrice: '', sector: '' });
      toast.custom((t) => (
        <div className={`${t.visible ? 'animate-enter' : 'animate-leave'} max-w-md w-full bg-gray-800/95 shadow-lg rounded-lg pointer-events-auto flex items-center p-4`}>
          <div className="flex-shrink-0 text-green-400">
            <CheckCircle2 className="h-6 w-6" />
          </div>
          <div className="ml-3 flex-1">
            <p className="text-sm font-medium text-gray-100">
              Holding added successfully!
            </p>
          </div>
          <button onClick={() => toast.dismiss(t.id)} className="ml-4 flex-shrink-0 text-gray-400 hover:text-gray-300">
            <X className="h-5 w-5" />
          </button>
        </div>
      ));
    } catch (error) {
      toast.error('Failed to add holding');
    } finally {
      setIsSubmitting(false);
    }
  };

  const confirmDelete = (holdingId: string) => {
    setHoldingToDelete(holdingId);
    setIsDeleteModalOpen(true);
  };

  const handleDeleteHolding = async () => {
    if (!holdingToDelete) return;

    setIsSubmitting(true);
    try {
      await fetch(`/api/holdings/${holdingToDelete}`, { method: 'DELETE' });
      await fetchData();
      setIsDeleteModalOpen(false);
      setHoldingToDelete(null);
      toast.custom((t) => (
        <div className={`${t.visible ? 'animate-enter' : 'animate-leave'} max-w-md w-full bg-gray-800/95 shadow-lg rounded-lg pointer-events-auto flex items-center p-4`}>
          <div className="flex-shrink-0 text-green-400">
            <CheckCircle2 className="h-6 w-6" />
          </div>
          <div className="ml-3 flex-1">
            <p className="text-sm font-medium text-gray-100">
              Holding deleted successfully!
            </p>
          </div>
          <button onClick={() => toast.dismiss(t.id)} className="ml-4 flex-shrink-0 text-gray-400 hover:text-gray-300">
            <X className="h-5 w-5" />
          </button>
        </div>
      ));
    } catch (error) {
      toast.error('Failed to delete holding');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Loading skeleton component
  const LoadingSkeleton = () => (
    <div className="animate-pulse space-y-8">
      <div className="h-24 bg-gray-800 rounded-lg"></div>
      <div className="space-y-4">
        <div className="h-12 bg-gray-800 rounded-lg"></div>
        <div className="h-12 bg-gray-800 rounded-lg"></div>
        <div className="h-12 bg-gray-800 rounded-lg"></div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-900 flex flex-col">
      <Header />
      <Toaster position="top-right" />

      <main className="flex-grow container mx-auto px-4 py-24">
        <div className="max-w-7xl mx-auto">
          {isLoading ? (
            <LoadingSkeleton />
          ) : (
            <>
              {/* Header Section */}
              <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 mb-8 border border-gray-700">
                <div className="flex flex-col md:flex-row md:items-center justify-between mb-6">
                  <h1 className="text-3xl font-bold mb-4 md:mb-0">Portfolio Details</h1>
                  <button
                    onClick={handleExport}
                    className="flex items-center space-x-2 bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded-lg transition-all duration-300"
                  >
                    <Download className="w-5 h-5" />
                    <span>Export</span>
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="bg-gray-800 rounded-lg p-4">
                    <p className="text-gray-400 text-sm mb-1">Total Investment</p>
                    <p className="text-2xl font-bold">
                      {formatCurrency(analytics?.totalInvestment || 0)}
                    </p>
                  </div>
                  <div className="bg-gray-800 rounded-lg p-4">
                    <p className="text-gray-400 text-sm mb-1">Current Value</p>
                    <p className="text-2xl font-bold">
                      {formatCurrency(analytics?.currentValue || 0)}
                    </p>
                  </div>
                  <div className="bg-gray-800 rounded-lg p-4">
                    <p className="text-gray-400 text-sm mb-1">Profit/Loss</p>
                    <div className="flex items-center">
                      {analytics?.profitLossPercentage != null ? (
                        <>
                          {analytics.profitLossPercentage >= 0 ? (
                            <TrendingUp className="w-5 h-5 text-green-500 mr-1" />
                          ) : (
                            <TrendingDown className="w-5 h-5 text-red-500 mr-1" />
                          )}
                          <p className={`text-2xl font-bold ${
                            analytics.profitLossPercentage >= 0 ? 'text-green-500' : 'text-red-500'
                          }`}>
                            {formatPercentage(analytics.profitLossPercentage)}
                          </p>
                        </>
                      ) : (
                        <p className="text-2xl font-bold text-gray-400">--</p>
                      )}
                    </div>
                  </div>
                  <div className="bg-gray-800 rounded-lg p-4">
                    <p className="text-gray-400 text-sm mb-1">CAGR</p>
                    <p className={`text-2xl font-bold ${
                      analytics?.cagr != null
                        ? analytics.cagr >= 0 ? 'text-green-500' : 'text-red-500'
                        : 'text-gray-400'
                    }`}>
                      {analytics?.cagr != null ? formatPercentage(analytics.cagr) : '--'}
                    </p>
                  </div>
                </div>
              </div>

              {/* Holdings Section */}
              <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl border border-gray-700 mb-8">
                <div className="p-6 border-b border-gray-700">
                  <div className="flex justify-between items-center">
                    <h2 className="text-xl font-semibold">Holdings</h2>
                    <button
                      onClick={() => setIsAddModalOpen(true)}
                      className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-all duration-300"
                    >
                      <Plus className="w-5 h-5" />
                      <span>Add Holding</span>
                    </button>
                  </div>
                </div>

                {holdings.length === 0 ? (
                  <div className="p-12 text-center">
                    <p className="text-gray-400 mb-4">No holdings in this portfolio yet.</p>
                    <button
                      onClick={() => setIsAddModalOpen(true)}
                      className="text-blue-500 hover:text-blue-400 font-medium"
                    >
                      Add your first holding
                    </button>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="bg-gray-800/90 border-b border-gray-700">
                          <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase">Symbol</th>
                          <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase">Name</th>
                          <th className="px-6 py-4 text-right text-xs font-medium text-gray-400 uppercase">Quantity</th>
                          <th className="px-6 py-4 text-right text-xs font-medium text-gray-400 uppercase">Avg Buy Price</th>
                          <th className="px-6 py-4 text-right text-xs font-medium text-gray-400 uppercase">Current Price</th>
                          <th className="px-6 py-4 text-right text-xs font-medium text-gray-400 uppercase">Market Value</th>
                          <th className="px-6 py-4 text-right text-xs font-medium text-gray-400 uppercase">Gain/Loss</th>
                          <th className="px-6 py-4 text-center text-xs font-medium text-gray-400 uppercase">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-700">
                        {holdings.map((holding) => (
                          <tr key={holding.id} className="hover:bg-gray-750">
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="bg-gray-700 rounded-md py-1 px-2 inline-block">
                                <span className="text-sm font-semibold text-gray-200">{holding.symbol}</span>
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-gray-300">{holding.name}</td>
                            <td className="px-6 py-4 text-right whitespace-nowrap text-gray-300">{holding.quantity}</td>
                            <td className="px-6 py-4 text-right whitespace-nowrap font-mono text-gray-300">
                              {formatCurrency(holding.buyPrice)}
                            </td>
                            <td className="px-6 py-4 text-right whitespace-nowrap font-mono text-gray-300">
                              {formatCurrency(holding.currentPrice)}
                            </td>
                            <td className="px-6 py-4 text-right whitespace-nowrap font-mono text-gray-300">
                              {formatCurrency(holding.marketValue)}
                            </td>
                            <td className={`px-6 py-4 text-right whitespace-nowrap font-mono ${
                              holding.gainLoss >= 0 ? 'text-green-500' : 'text-red-500'
                            }`}>
                              {formatCurrency(holding.gainLoss)}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-center">
                              <div className="flex items-center justify-center space-x-2">
                                <button
                                  onClick={() => navigate(`/insights/${holding.symbol}`)}
                                  className="p-2 text-blue-500 hover:text-blue-400 transition-colors"
                                  title="AI Insights"
                                >
                                  <Brain className="w-5 h-5" />
                                </button>
                                <button
                                  onClick={() => confirmDelete(holding.id)}
                                  className="p-2 text-red-500 hover:text-red-400 transition-colors"
                                  title="Delete"
                                >
                                  <Trash2 className="w-5 h-5" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>

              {/* Sector Exposure Chart */}
              {sectorData.length > 0 && (
                <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl border border-gray-700 p-6">
                  <h2 className="text-xl font-semibold mb-6 flex items-center">
                    <PieChart className="w-5 h-5 mr-2" />
                    Sector Exposure
                  </h2>
                  <div className="h-[400px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <RechartsPieChart>
                        <Pie
                          data={sectorData}
                          dataKey="percentage"
                          nameKey="sector"
                          cx="50%"
                          cy="50%"
                          outerRadius={150}
                          label={({ sector, percentage }) => `${sector} (${percentage.toFixed(1)}%)`}
                        >
                          {sectorData.map((_, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip
                          content={({ active, payload }) => {
                            if (active && payload && payload.length) {
                              const data = payload[0].payload;
                              return (
                                <div className="bg-gray-800 p-3 rounded-lg border border-gray-700">
                                  <p className="font-medium text-white">{data.sector}</p>
                                  <p className="text-gray-300">{`${data.percentage.toFixed(1)}%`}</p>
                                </div>
                              );
                            }
                            return null;
                          }}
                        />
                      </RechartsPieChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </main>

      {/* Add Holding Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-gray-800 rounded-lg p-6 w-full max-w-md mx-4">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold">Add New Holding</h2>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="text-gray-400 hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <form onSubmit={handleAddHolding}>
              <div className="space-y-4">
                <div>
                  <label htmlFor="symbol" className="block text-sm font-medium text-gray-300 mb-2">
                    Stock Symbol
                  </label>
                  <input
                    id="symbol"
                    type="text"
                    value={newHolding.symbol}
                    onChange={(e) => setNewHolding({ ...newHolding, symbol: e.target.value })}
                    className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    placeholder="e.g., AAPL"
                    required
                    disabled={isSubmitting}
                  />
                </div>

                <div>
                  <label htmlFor="quantity" className="block text-sm font-medium text-gray-300 mb-2">
                    Quantity
                  </label>
                  <input
                    id="quantity"
                    type="number"
                    value={newHolding.quantity}
                    onChange={(e) => setNewHolding({ ...newHolding, quantity: e.target.value })}
                    className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    placeholder="Number of shares"
                    required
                    disabled={isSubmitting}
                  />
                </div>

                <div>
                  <label htmlFor="buyPrice" className="block text-sm font-medium text-gray-300 mb-2">
                    Buy Price
                  </label>
                  <input
                    id="buyPrice"
                    type="number"
                    step="0.01"
                    value={newHolding.buyPrice}
                    onChange={(e) => setNewHolding({ ...newHolding, buyPrice: e.target.value })}
                    className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    placeholder="Price per share"
                    required
                    disabled={isSubmitting}
                  />
                </div>

                <div>
                  <label htmlFor="sector" className="block text-sm font-medium text-gray-300 mb-2">
                    Sector
                  </label>
                  <select
                    id="sector"
                    value={newHolding.sector}
                    onChange={(e) => setNewHolding({ ...newHolding, sector: e.target.value })}
                    className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    required
                    disabled={isSubmitting}
                  >
                    <option value="">Select a sector</option>
                    <option value="Technology">Technology</option>
                    <option value="Healthcare">Healthcare</option>
                    <option value="Finance">Finance</option>
                    <option value="Consumer">Consumer</option>
                    <option value="Energy">Energy</option>
                    <option value="Industrial">Industrial</option>
                    <option value="Materials">Materials</option>
                    <option value="Real Estate">Real Estate</option>
                    <option value="Utilities">Utilities</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
              </div>
              
              <div className="flex justify-end space-x-3 mt-6">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 text-gray-300 hover:text-white transition-colors"
                  disabled={isSubmitting}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex items-center justify-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition-all duration-300"
                >
                  {isSubmitting ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    <>
                      <Plus className="w-5 h-5" />
                      <span>Add</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {isDeleteModalOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-gray-800 rounded-lg p-6 w-full max-w-md mx-4">
            <div className="mb-6">
              <h2 className="text-xl font-semibold mb-2">Delete Holding?</h2>
              <p className="text-gray-400">
                Are you sure you want to delete this holding? This action cannot be undone.
              </p>
            </div>
            
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => {
                  setIsDeleteModalOpen(false);
                  setHoldingToDelete(null);
                }}
                className="px-4 py-2 text-gray-300 hover:text-white transition-colors"
                disabled={isSubmitting}
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteHolding}
                disabled={isSubmitting}
                className="flex items-center justify-center space-x-2 bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-lg transition-all duration-300"
              >
                {isSubmitting ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <>
                    <Trash2 className="w-5 h-5" />
                    <span>Delete</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
};

export default PortfolioDetail;