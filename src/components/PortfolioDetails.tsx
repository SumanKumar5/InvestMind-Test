import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  Trash2, 
  Brain, 
  Download, 
  Plus, 
  X, 
  Loader2, 
  CheckCircle2, 
  TrendingUp, 
  TrendingDown,
  AlertCircle
} from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import toast, { Toaster } from 'react-hot-toast';
import Header from './Header';
import Footer from './Footer';
import { useRequireAuth } from '../hooks/useAuth';
import { 
  getPortfolioHoldings, 
  addHolding, 
  deleteHolding,
  getPortfolioAnalytics,
  exportPortfolio
} from '../services/api';
import { formatCurrency, formatPercentage } from '../utils/formatters';
import { Holding, SectorExposure, PortfolioAnalytics } from '../types/holding';

const SECTORS = [
  'Technology',
  'Healthcare',
  'Finance',
  'Consumer',
  'Industrial',
  'Energy',
  'Materials',
  'Real Estate',
  'Utilities',
  'Other'
];

const COLORS = [
  '#3B82F6', // blue-500
  '#10B981', // emerald-500
  '#8B5CF6', // violet-500
  '#F59E0B', // amber-500
  '#EC4899', // pink-500
  '#6366F1', // indigo-500
  '#14B8A6', // teal-500
  '#F97316', // orange-500
  '#8B5CF6', // violet-500
  '#64748B'  // slate-500
];

const PortfolioDetails: React.FC = () => {
  useRequireAuth();
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [holdings, setHoldings] = useState<Holding[]>([]);
  const [analytics, setAnalytics] = useState<PortfolioAnalytics | null>(null);
  const [sectorData, setSectorData] = useState<SectorExposure[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [holdingToDelete, setHoldingToDelete] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [newHolding, setNewHolding] = useState({
    symbol: '',
    quantity: '',
    buyPrice: '',
    sector: 'Technology'
  });

  const fetchPortfolioData = async () => {
    if (!id) return;

    setIsLoading(true);
    try {
      console.log('Fetching portfolio data for ID:', id);
      
      const [holdingsData, analyticsData] = await Promise.all([
        getPortfolioHoldings(id).catch(error => {
          console.error('Error fetching holdings:', error.response?.data || error.message);
          throw error;
        }),
        getPortfolioAnalytics(id).catch(error => {
          console.error('Error fetching analytics:', error.response?.data || error.message);
          throw error;
        })
      ]);

      console.log('Holdings data:', holdingsData);
      console.log('Analytics data:', analyticsData);

      setHoldings(holdingsData);
      setAnalytics(analyticsData);

      // Transform sectors data for pie chart
      if (analyticsData?.sectors) {
        const sectorExposure = Object.entries(analyticsData.sectors).map(([sector, percentage]) => ({
          sector,
          percentage: parseFloat(percentage)
        }));
        setSectorData(sectorExposure);
        console.log('Sector data:', sectorExposure);
      }
    } catch (err: any) {
      console.error('Portfolio data fetch error:', {
        message: err.message,
        response: err.response?.data,
        status: err.response?.status
      });
      toast.error(`Failed to load portfolio data: ${err.response?.data?.message || err.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPortfolioData();
  }, [id]);

  const handleAddHolding = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!id) return;

    setIsSubmitting(true);
    try {
      await addHolding(id, {
        symbol: newHolding.symbol.toUpperCase(),
        quantity: Number(newHolding.quantity),
        buyPrice: Number(newHolding.buyPrice),
        sector: newHolding.sector
      });

      await fetchPortfolioData();
      setIsAddModalOpen(false);
      setNewHolding({ symbol: '', quantity: '', buyPrice: '', sector: 'Technology' });
      
      toast.custom((t) => (
        <div className="toast-success max-w-md w-full flex items-center p-4">
          <div className="flex-shrink-0 text-green-400">
            <CheckCircle2 className="h-6 w-6" />
          </div>
          <div className="ml-3 flex-1">
            <p className="text-sm font-medium text-gray-100">
              Holding added successfully!
            </p>
          </div>
          <button onClick={() => toast.dismiss(t.id)} className="ml-4 text-gray-400 hover:text-gray-300">
            <X className="h-5 w-5" />
          </button>
        </div>
      ), { duration: 1000 });
    } catch (err: any) {
      console.error('Add holding error:', err.response?.data || err.message);
      toast.error(`Failed to add holding: ${err.response?.data?.message || err.message}`);
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
      await deleteHolding(holdingToDelete);
      await fetchPortfolioData();
      setIsDeleteModalOpen(false);
      setHoldingToDelete(null);
      
      toast.custom((t) => (
        <div className="toast-success max-w-md w-full flex items-center p-4">
          <div className="flex-shrink-0 text-green-400">
            <CheckCircle2 className="h-6 w-6" />
          </div>
          <div className="ml-3 flex-1">
            <p className="text-sm font-medium text-gray-100">
              Holding deleted successfully!
            </p>
          </div>
          <button onClick={() => toast.dismiss(t.id)} className="ml-4 text-gray-400 hover:text-gray-300">
            <X className="h-5 w-5" />
          </button>
        </div>
      ), { duration: 1000 });
    } catch (err: any) {
      console.error('Delete holding error:', err.response?.data || err.message);
      toast.error(`Failed to delete holding: ${err.response?.data?.message || err.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleExport = async () => {
    if (!id) return;

    try {
      const blob = await exportPortfolio(id);
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `portfolio-${id}.xlsx`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      
      toast.custom((t) => (
        <div className="toast-success max-w-md w-full flex items-center p-4">
          <div className="flex-shrink-0 text-green-400">
            <CheckCircle2 className="h-6 w-6" />
          </div>
          <div className="ml-3 flex-1">
            <p className="text-sm font-medium text-gray-100">
              Portfolio exported successfully!
            </p>
          </div>
          <button onClick={() => toast.dismiss(t.id)} className="ml-4 text-gray-400 hover:text-gray-300">
            <X className="h-5 w-5" />
          </button>
        </div>
      ), { duration: 1000 });
    } catch (err: any) {
      console.error('Export error:', err.response?.data || err.message);
      toast.error(`Failed to export portfolio: ${err.response?.data?.message || err.message}`);
    }
  };

  // Loading skeleton
  const HoldingSkeleton = () => (
    <tr className="animate-pulse">
      <td className="px-6 py-4">
        <div className="h-4 bg-gray-700 rounded w-20"></div>
      </td>
      <td className="px-6 py-4">
        <div className="h-4 bg-gray-700 rounded w-32"></div>
      </td>
      <td className="px-6 py-4">
        <div className="h-4 bg-gray-700 rounded w-16"></div>
      </td>
      <td className="px-6 py-4">
        <div className="h-4 bg-gray-700 rounded w-24"></div>
      </td>
      <td className="px-6 py-4">
        <div className="h-4 bg-gray-700 rounded w-24"></div>
      </td>
      <td className="px-6 py-4">
        <div className="h-4 bg-gray-700 rounded w-24"></div>
      </td>
      <td className="px-6 py-4">
        <div className="h-4 bg-gray-700 rounded w-24"></div>
      </td>
      <td className="px-6 py-4">
        <div className="flex space-x-2">
          <div className="h-8 bg-gray-700 rounded w-20"></div>
          <div className="h-8 bg-gray-700 rounded w-20"></div>
        </div>
      </td>
    </tr>
  );

  return (
    <div className="min-h-screen bg-gray-900 flex flex-col">
      <Header />
      <Toaster 
        position="top-right"
        toastOptions={{
          duration: 1000,
          className: 'bg-transparent border-0 shadow-none p-0 m-0'
        }}
      />

      <main className="flex-grow container mx-auto px-4 py-24">
        <div className="max-w-7xl mx-auto">
          {/* Analytics Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700">
              <h3 className="text-sm font-medium text-gray-400 mb-2">Total Investment</h3>
              {isLoading ? (
                <div className="h-8 bg-gray-700 rounded animate-pulse"></div>
              ) : (
                <p className="text-2xl font-semibold">
                  {formatCurrency(analytics?.totalInvestment || 0)}
                </p>
              )}
            </div>

            <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700">
              <h3 className="text-sm font-medium text-gray-400 mb-2">Current Value</h3>
              {isLoading ? (
                <div className="h-8 bg-gray-700 rounded animate-pulse"></div>
              ) : (
                <p className="text-2xl font-semibold">
                  {formatCurrency(analytics?.currentValue || 0)}
                </p>
              )}
            </div>

            <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700">
              <h3 className="text-sm font-medium text-gray-400 mb-2">Profit/Loss</h3>
              {isLoading ? (
                <div className="h-8 bg-gray-700 rounded animate-pulse"></div>
              ) : (
                <div className="flex items-center">
                  {analytics?.profitLossPercentage != null ? (
                    <>
                      {parseFloat(analytics.profitLossPercentage) >= 0 ? (
                        <TrendingUp className="w-5 h-5 text-green-500 mr-2" />
                      ) : (
                        <TrendingDown className="w-5 h-5 text-red-500 mr-2" />
                      )}
                      <p className={`text-2xl font-semibold ${
                        parseFloat(analytics.profitLossPercentage) >= 0 ? 'text-green-500' : 'text-red-500'
                      }`}>
                        {analytics.profitLossPercentage}%
                      </p>
                    </>
                  ) : (
                    <p className="text-2xl font-semibold text-gray-400">--</p>
                  )}
                </div>
              )}
            </div>

            <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700">
              <h3 className="text-sm font-medium text-gray-400 mb-2">CAGR</h3>
              {isLoading ? (
                <div className="h-8 bg-gray-700 rounded animate-pulse"></div>
              ) : (
                <p className="text-2xl font-semibold">
                  {analytics?.CAGR || '--'}
                </p>
              )}
            </div>
          </div>

          {/* Actions Bar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 space-y-4 sm:space-y-0">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setIsAddModalOpen(true)}
                className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg transition-all duration-300 transform hover:scale-105 active:scale-95"
              >
                <Plus className="w-5 h-5" />
                <span>Add Holding</span>
              </button>
              <button
                onClick={handleExport}
                className="flex items-center space-x-2 bg-gray-700 hover:bg-gray-600 text-white px-6 py-3 rounded-lg transition-all duration-300"
              >
                <Download className="w-5 h-5" />
                <span>Export</span>
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Holdings Table */}
            <div className="lg:col-span-2">
              <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl overflow-hidden border border-gray-700">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="bg-gray-800/90 border-b border-gray-700">
                        <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase">Symbol</th>
                        <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase">Name</th>
                        <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase">Qty</th>
                        <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase">Avg Price</th>
                        <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase">Current</th>
                        <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase">Value</th>
                        <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase">P/L</th>
                        <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-700">
                      {isLoading ? (
                        [...Array(3)].map((_, i) => <HoldingSkeleton key={i} />)
                      ) : holdings.length === 0 ? (
                        <tr>
                          <td colSpan={8} className="px-6 py-8 text-center text-gray-400">
                            <div className="flex flex-col items-center">
                              <AlertCircle className="w-12 h-12 mb-4 text-gray-500" />
                              <p className="text-lg mb-2">No holdings yet</p>
                              <p className="text-sm">Start building your portfolio by adding some holdings!</p>
                            </div>
                          </td>
                        </tr>
                      ) : (
                        holdings.map((holding) => (
                          <tr key={holding.id} className="hover:bg-gray-750">
                            <td className="px-6 py-4">
                              <div className="bg-gray-700 rounded-md py-1 px-2 inline-block">
                                <span className="text-sm font-semibold text-gray-200">{holding.symbol}</span>
                              </div>
                            </td>
                            <td className="px-6 py-4 text-gray-300">{holding.companyName}</td>
                            <td className="px-6 py-4 text-gray-300">{holding.quantity}</td>
                            <td className="px-6 py-4 font-mono text-gray-300">{formatCurrency(holding.buyPrice)}</td>
                            <td className="px-6 py-4 font-mono text-gray-300">{formatCurrency(holding.currentPrice)}</td>
                            <td className="px-6 py-4 font-mono text-gray-300">{formatCurrency(holding.marketValue)}</td>
                            <td className="px-6 py-4">
                              <span className={`font-mono ${
                                holding.gainLoss >= 0 ? 'text-green-500' : 'text-red-500'
                              }`}>
                                {formatPercentage(holding.gainLossPercentage)}
                              </span>
                            </td>
                            <td className="px-6 py-4">
                              <div className="flex items-center space-x-2">
                                <button
                                  onClick={() => navigate(`/insights/${holding.symbol}`)}
                                  className="flex items-center space-x-1 text-sm text-blue-500 hover:text-blue-400 transition-colors px-3 py-2 rounded-lg hover:bg-blue-500/10"
                                >
                                  <Brain className="w-4 h-4" />
                                  <span>AI Insight</span>
                                </button>
                                <button
                                  onClick={() => confirmDelete(holding.id)}
                                  className="flex items-center space-x-1 text-sm text-red-500 hover:text-red-400 transition-colors px-3 py-2 rounded-lg hover:bg-red-500/10"
                                >
                                  <Trash2 className="w-4 h-4" />
                                  <span>Delete</span>
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            {/* Sector Distribution */}
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700">
              <h3 className="text-lg font-semibold mb-6">Sector Distribution</h3>
              {isLoading ? (
                <div className="h-64 flex items-center justify-center">
                  <Loader2 className="w-8 h-8 text-gray-400 animate-spin" />
                </div>
              ) : sectorData.length === 0 ? (
                <div className="h-64 flex items-center justify-center text-gray-400 text-center">
                  <div>
                    <AlertCircle className="w-12 h-12 mb-4 mx-auto text-gray-500" />
                    <p>No sector data available</p>
                  </div>
                </div>
              ) : (
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={sectorData}
                        dataKey="percentage"
                        nameKey="sector"
                        cx="50%"
                        cy="50%"
                        outerRadius={80}
                        label={({ name, percent }) => `${name} ${(percent).toFixed(0)}%`}
                      >
                        {sectorData.map((_, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip
                        content={({ active, payload }) => {
                          if (active && payload && payload.length) {
                            return (
                              <div className="bg-gray-800 p-3 rounded-lg border border-gray-700">
                                <p className="text-sm text-gray-200">{payload[0].name}</p>
                                <p className="text-sm font-semibold text-white">
                                  {payload[0].value.toFixed(2)}%
                                </p>
                              </div>
                            );
                          }
                          return null;
                        }}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              )}
            </div>
          </div>
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
                    min="0"
                    step="1"
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
                    min="0"
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
                    {SECTORS.map((sector) => (
                      <option key={sector} value={sector}>{sector}</option>
                    ))}
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

export default PortfolioDetails;