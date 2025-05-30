import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  Loader2, Plus, Trash2, Download, Brain, X, CheckCircle2,
  TrendingUp, TrendingDown, AlertCircle
} from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import Header from './Header';
import Footer from './Footer';
import { useRequireAuth } from '../hooks/useAuth';
import {
  getPortfolioDetails,
  getPortfolioHoldings,
  getPortfolioAnalytics,
  getPortfolioCAGR,
  getSectorExposure,
  addHolding,
  deleteHolding,
  exportPortfolio
} from '../services/api';
import { formatCurrency, formatPercentage } from '../utils/formatters';
import toast, { Toaster } from 'react-hot-toast';

interface Holding {
  id: string;
  symbol: string;
  companyName: string;
  quantity: number;
  buyPrice: number;
  currentPrice: number;
  sector: string;
}

interface Analytics {
  totalInvestment: number;
  currentValue: number;
  profitLossPercentage: number;
  cagr: number;
}

interface SectorExposure {
  sector: string;
  percentage: number;
}

const SECTORS = [
  'Technology',
  'Healthcare',
  'Finance',
  'Consumer',
  'Industrial',
  'Energy',
  'Materials',
  'Utilities',
  'Real Estate',
  'Other'
];

const COLORS = [
  '#3B82F6', '#10B981', '#6366F1', '#F59E0B', '#EC4899',
  '#8B5CF6', '#14B8A6', '#F97316', '#06B6D4', '#6B7280'
];

const PortfolioDetail: React.FC = () => {
  useRequireAuth();
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [portfolio, setPortfolio] = useState<{ name: string } | null>(null);
  const [holdings, setHoldings] = useState<Holding[]>([]);
  const [analytics, setAnalytics] = useState<Analytics | null>(null);
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
      const [portfolioData, holdingsData, analyticsData, sectorExposure] = await Promise.all([
        getPortfolioDetails(id),
        getPortfolioHoldings(id),
        getPortfolioAnalytics(id),
        getSectorExposure(id)
      ]);

      setPortfolio(portfolioData);
      setHoldings(holdingsData);
      setAnalytics(analyticsData);
      setSectorData(sectorExposure);
    } catch (err) {
      toast.error('Failed to load portfolio data');
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

      setIsAddModalOpen(false);
      setNewHolding({ symbol: '', quantity: '', buyPrice: '', sector: 'Technology' });
      await fetchPortfolioData();

      toast.custom((t) => (
        <div className="toast-success max-w-md w-full bg-gray-800/95 shadow-lg rounded-lg pointer-events-auto flex items-center p-4">
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
      ), { duration: 1000 });
    } catch (err) {
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
      await deleteHolding(holdingToDelete);
      await fetchPortfolioData();
      setIsDeleteModalOpen(false);
      setHoldingToDelete(null);

      toast.custom((t) => (
        <div className="toast-success max-w-md w-full bg-gray-800/95 shadow-lg rounded-lg pointer-events-auto flex items-center p-4">
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
      ), { duration: 1000 });
    } catch (err) {
      toast.error('Failed to delete holding');
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
        <div className="toast-success max-w-md w-full bg-gray-800/95 shadow-lg rounded-lg pointer-events-auto flex items-center p-4">
          <div className="flex-shrink-0 text-green-400">
            <CheckCircle2 className="h-6 w-6" />
          </div>
          <div className="ml-3 flex-1">
            <p className="text-sm font-medium text-gray-100">
              Portfolio exported successfully!
            </p>
          </div>
          <button onClick={() => toast.dismiss(t.id)} className="ml-4 flex-shrink-0 text-gray-400 hover:text-gray-300">
            <X className="h-5 w-5" />
          </button>
        </div>
      ), { duration: 1000 });
    } catch (err) {
      toast.error('Failed to export portfolio');
    }
  };

  // Loading skeleton components
  const AnalyticsSkeleton = () => (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 animate-pulse">
      {[...Array(4)].map((_, i) => (
        <div key={i} className="bg-gray-800/50 rounded-lg p-6">
          <div className="h-4 w-1/2 bg-gray-700 rounded mb-2"></div>
          <div className="h-6 w-3/4 bg-gray-700 rounded"></div>
        </div>
      ))}
    </div>
  );

  const TableSkeleton = () => (
    <div className="animate-pulse">
      <div className="h-12 bg-gray-800/50 rounded-t-lg mb-1"></div>
      {[...Array(5)].map((_, i) => (
        <div key={i} className="h-16 bg-gray-800/50 rounded-lg mb-1"></div>
      ))}
    </div>
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
          {/* Portfolio Header */}
          <div className="flex flex-col md:flex-row md:items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold mb-2">
                {isLoading ? (
                  <div className="h-9 w-48 bg-gray-800 rounded animate-pulse"></div>
                ) : (
                  portfolio?.name
                )}
              </h1>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setIsAddModalOpen(true)}
                className="flex items-center justify-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg transition-all duration-300 transform hover:scale-105 active:scale-95"
              >
                <Plus className="w-5 h-5" />
                <span>Add Holding</span>
              </button>
              <button
                onClick={handleExport}
                className="flex items-center justify-center space-x-2 bg-gray-700 hover:bg-gray-600 text-white px-6 py-3 rounded-lg transition-all duration-300"
              >
                <Download className="w-5 h-5" />
                <span>Export</span>
              </button>
            </div>
          </div>

          {/* Analytics Cards */}
          {isLoading ? (
            <AnalyticsSkeleton />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
              <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg p-6 border border-gray-700">
                <h3 className="text-sm font-medium text-gray-400 mb-2">Total Investment</h3>
                <p className="text-2xl font-semibold">
                  {formatCurrency(analytics?.totalInvestment || 0)}
                </p>
              </div>
              <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg p-6 border border-gray-700">
                <h3 className="text-sm font-medium text-gray-400 mb-2">Current Value</h3>
                <p className="text-2xl font-semibold">
                  {formatCurrency(analytics?.currentValue || 0)}
                </p>
              </div>
              <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg p-6 border border-gray-700">
                <h3 className="text-sm font-medium text-gray-400 mb-2">Total P/L</h3>
                <div className="flex items-center">
                  {analytics?.profitLossPercentage != null ? (
                    <>
                      {analytics.profitLossPercentage >= 0 ? (
                        <TrendingUp className="w-5 h-5 text-green-500 mr-2" />
                      ) : (
                        <TrendingDown className="w-5 h-5 text-red-500 mr-2" />
                      )}
                      <p className={`text-2xl font-semibold ${
                        analytics.profitLossPercentage >= 0 ? 'text-green-500' : 'text-red-500'
                      }`}>
                        {formatPercentage(analytics.profitLossPercentage)}
                      </p>
                    </>
                  ) : (
                    <p className="text-2xl font-semibold text-gray-400">--</p>
                  )}
                </div>
              </div>
              <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg p-6 border border-gray-700">
                <h3 className="text-sm font-medium text-gray-400 mb-2">CAGR</h3>
                <p className={`text-2xl font-semibold ${
                  analytics?.cagr != null
                    ? analytics.cagr >= 0 ? 'text-green-500' : 'text-red-500'
                    : 'text-gray-400'
                }`}>
                  {analytics?.cagr != null ? formatPercentage(analytics.cagr) : '--'}
                </p>
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
            {/* Holdings Table */}
            <div className="lg:col-span-2">
              {isLoading ? (
                <TableSkeleton />
              ) : holdings.length > 0 ? (
                <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg border border-gray-700 overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="bg-gray-800/90 border-b border-gray-700">
                          <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase">Symbol</th>
                          <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase">Quantity</th>
                          <th className="px-6 py-4 text-right text-xs font-medium text-gray-400 uppercase">Avg Price</th>
                          <th className="px-6 py-4 text-right text-xs font-medium text-gray-400 uppercase">Current</th>
                          <th className="px-6 py-4 text-right text-xs font-medium text-gray-400 uppercase">Value</th>
                          <th className="px-6 py-4 text-right text-xs font-medium text-gray-400 uppercase">P/L</th>
                          <th className="px-6 py-4 text-center text-xs font-medium text-gray-400 uppercase">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-700">
                        {holdings.map((holding) => {
                          const marketValue = holding.quantity * holding.currentPrice;
                          const investmentValue = holding.quantity * holding.buyPrice;
                          const profitLoss = ((marketValue - investmentValue) / investmentValue) * 100;

                          return (
                            <tr key={holding.id} className="hover:bg-gray-750">
                              <td className="px-6 py-4">
                                <div>
                                  <div className="font-medium text-white">{holding.symbol}</div>
                                  <div className="text-sm text-gray-400">{holding.companyName}</div>
                                </div>
                              </td>
                              <td className="px-6 py-4 font-medium">{holding.quantity}</td>
                              <td className="px-6 py-4 text-right font-mono">
                                {formatCurrency(holding.buyPrice)}
                              </td>
                              <td className="px-6 py-4 text-right font-mono">
                                {formatCurrency(holding.currentPrice)}
                              </td>
                              <td className="px-6 py-4 text-right font-mono">
                                {formatCurrency(marketValue)}
                              </td>
                              <td className="px-6 py-4 text-right">
                                <span className={`font-mono ${
                                  profitLoss >= 0 ? 'text-green-500' : 'text-red-500'
                                }`}>
                                  {formatPercentage(profitLoss)}
                                </span>
                              </td>
                              <td className="px-6 py-4">
                                <div className="flex items-center justify-center space-x-3">
                                  <button
                                    onClick={() => navigate(`/insights/${holding.symbol}`)}
                                    className="text-blue-500 hover:text-blue-400 transition-colors"
                                    title="AI Insight"
                                  >
                                    <Brain className="w-5 h-5" />
                                  </button>
                                  <button
                                    onClick={() => confirmDelete(holding.id)}
                                    className="text-red-500 hover:text-red-400 transition-colors"
                                    title="Delete"
                                  >
                                    <Trash2 className="w-5 h-5" />
                                  </button>
                                </div>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>
              ) : (
                <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg border border-gray-700 p-8 text-center">
                  <AlertCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-300 mb-4">No holdings yet — start investing!</p>
                  <button
                    onClick={() => setIsAddModalOpen(true)}
                    className="text-blue-500 hover:text-blue-400 font-medium"
                  >
                    Add your first holding
                  </button>
                </div>
              )}
            </div>

            {/* Sector Distribution */}
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg border border-gray-700 p-6">
              <h3 className="text-lg font-semibold mb-6">Sector Distribution</h3>
              {isLoading ? (
                <div className="animate-pulse">
                  <div className="h-64 bg-gray-700 rounded-full mx-auto"></div>
                </div>
              ) : sectorData.length > 0 ? (
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
                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      >
                        {sectorData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip
                        content={({ active, payload }) => {
                          if (active && payload && payload.length) {
                            return (
                              <div className="bg-gray-800 border border-gray-700 rounded-lg p-3">
                                <p className="text-white">{`${payload[0].name}: ${(payload[0].value * 100).toFixed(2)}%`}</p>
                              </div>
                            );
                          }
                          return null;
                        }}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              ) : (
                <div className="h-64 flex items-center justify-center text-gray-400">
                  No sector data available
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

export default PortfolioDetail;