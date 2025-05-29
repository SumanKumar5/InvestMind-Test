import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Trash2, ExternalLink, Loader2, X, CheckCircle2 } from 'lucide-react';
import Header from './Header';
import Footer from './Footer';
import { useRequireAuth } from '../hooks/useAuth';
import { getPortfolios, createPortfolio, deletePortfolio } from '../services/api';
import toast, { Toaster } from 'react-hot-toast';

interface Portfolio {
  _id: string;
  name: string;
  createdAt: string;
}

const Portfolio: React.FC = () => {
  useRequireAuth();
  const navigate = useNavigate();
  
  const [portfolios, setPortfolios] = useState<Portfolio[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [newPortfolioName, setNewPortfolioName] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchPortfolios = async () => {
    try {
      const data = await getPortfolios();
      setPortfolios(data);
      setError(null);
    } catch (err) {
      setError('Failed to fetch portfolios');
      toast.error('Failed to load portfolios');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPortfolios();
  }, []);

  const handleCreatePortfolio = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPortfolioName.trim()) return;

    setIsSubmitting(true);
    try {
      await createPortfolio(newPortfolioName);
      await fetchPortfolios();
      setIsCreateModalOpen(false);
      setNewPortfolioName('');
      toast.custom((t) => (
        <div className={`${t.visible ? 'animate-enter' : 'animate-leave'} toast-success max-w-md w-full bg-gray-800/95 shadow-lg rounded-lg pointer-events-auto flex items-center p-4`}>
          <div className="flex-shrink-0 text-green-400">
            <CheckCircle2 className="h-6 w-6" />
          </div>
          <div className="ml-3 flex-1">
            <p className="text-sm font-medium text-gray-100">Portfolio created successfully!</p>
          </div>
          <button onClick={() => toast.dismiss(t.id)} className="ml-4 flex-shrink-0 text-gray-400 hover:text-gray-300">
            <X className="h-5 w-5" />
          </button>
        </div>
      ), { duration: 1000 });
    } catch (err) {
      toast.error('Failed to create portfolio');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeletePortfolio = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this portfolio?')) return;

    try {
      await deletePortfolio(id);
      await fetchPortfolios();
      toast.custom((t) => (
        <div className={`${t.visible ? 'animate-enter' : 'animate-leave'} toast-success max-w-md w-full bg-gray-800/95 shadow-lg rounded-lg pointer-events-auto flex items-center p-4`}>
          <div className="flex-shrink-0 text-green-400">
            <CheckCircle2 className="h-6 w-6" />
          </div>
          <div className="ml-3 flex-1">
            <p className="text-sm font-medium text-gray-100">Portfolio deleted successfully!</p>
          </div>
          <button onClick={() => toast.dismiss(t.id)} className="ml-4 flex-shrink-0 text-gray-400 hover:text-gray-300">
            <X className="h-5 w-5" />
          </button>
        </div>
      ), { duration: 1000 });
    } catch (err) {
      toast.error('Failed to delete portfolio');
    }
  };

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
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-center justify-between mb-8">
            <h1 className="text-3xl font-bold mb-4 md:mb-0">Your Portfolios</h1>
            <button
              onClick={() => setIsCreateModalOpen(true)}
              className="flex items-center justify-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg transition-all duration-300 transform hover:scale-105 active:scale-95"
            >
              <Plus className="w-5 h-5" />
              <span>Create Portfolio</span>
            </button>
          </div>

          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
            </div>
          ) : error ? (
            <div className="bg-red-500/10 border border-red-500/50 text-red-500 px-6 py-4 rounded-lg">
              {error}
            </div>
          ) : portfolios.length === 0 ? (
            <div className="text-center py-12 bg-gray-800/50 rounded-lg border border-gray-700">
              <p className="text-gray-400 mb-4">You haven't created any portfolios yet.</p>
              <button
                onClick={() => setIsCreateModalOpen(true)}
                className="text-blue-500 hover:text-blue-400 font-medium"
              >
                Create your first portfolio
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {portfolios.map((portfolio) => (
                <div
                  key={portfolio._id}
                  className="bg-gray-800/50 backdrop-blur-sm rounded-lg border border-gray-700 hover:border-blue-500/50 transition-all duration-300 hover:shadow-[0_0_30px_rgba(59,130,246,0.15)] group"
                >
                  <div className="p-6">
                    <h3 className="text-xl font-semibold mb-2 text-white group-hover:text-blue-400 transition-colors">
                      {portfolio.name}
                    </h3>
                    <p className="text-sm text-gray-400 mb-4">
                      Created on {new Date(portfolio.createdAt).toLocaleDateString()}
                    </p>
                    <div className="flex items-center space-x-3">
                      <button
                        onClick={() => navigate(`/portfolio/${portfolio._id}`)}
                        className="flex items-center space-x-1 text-sm text-blue-500 hover:text-blue-400 transition-colors"
                      >
                        <ExternalLink className="w-4 h-4" />
                        <span>View Details</span>
                      </button>
                      <button
                        onClick={() => handleDeletePortfolio(portfolio._id)}
                        className="flex items-center space-x-1 text-sm text-red-500 hover:text-red-400 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                        <span>Delete</span>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>

      {/* Create Portfolio Modal */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-gray-800 rounded-lg p-6 w-full max-w-md mx-4">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold">Create New Portfolio</h2>
              <button
                onClick={() => setIsCreateModalOpen(false)}
                className="text-gray-400 hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <form onSubmit={handleCreatePortfolio}>
              <div className="mb-6">
                <label htmlFor="portfolioName" className="block text-sm font-medium text-gray-300 mb-2">
                  Portfolio Name
                </label>
                <input
                  id="portfolioName"
                  type="text"
                  value={newPortfolioName}
                  onChange={(e) => setNewPortfolioName(e.target.value)}
                  className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  placeholder="Enter portfolio name"
                  required
                  disabled={isSubmitting}
                />
              </div>
              
              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setIsCreateModalOpen(false)}
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
                      <span>Create</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
};

export default Portfolio;