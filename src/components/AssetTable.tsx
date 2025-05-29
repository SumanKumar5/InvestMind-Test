import React, { useState, useEffect } from 'react';
import { ChevronDown, ChevronUp, SlidersHorizontal } from 'lucide-react';
import { formatCurrency, formatLargeNumber, formatPercentage } from '../utils/formatters';
import SearchBar from './SearchBar';
import FilterTabs from './FilterTabs';
import { getMarketData, MarketQuote } from '../services/twelveData';

type SortField = 'symbol' | 'name' | 'price' | 'percent_change' | 'volume';
type SortDirection = 'asc' | 'desc';

const SYMBOLS = ['AAPL', 'MSFT', 'GOOGL', 'AMZN', 'META', 'TSLA', 'NVDA', 'BRK.A', 'JPM', 'V'];

const AssetTable: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState<'all' | 'stocks' | 'crypto' | 'funds'>('all');
  const [sortField, setSortField] = useState<SortField>('symbol');
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc');
  const [assets, setAssets] = useState<MarketQuote[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const data = await getMarketData(SYMBOLS);
        setAssets(data);
        setError(null);
      } catch (err) {
        setError('Failed to fetch market data. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
    const interval = setInterval(fetchData, 60000); // Refresh every minute

    return () => clearInterval(interval);
  }, []);

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const filteredAssets = assets
    .filter((asset) => {
      const matchesSearch = asset.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          asset.symbol.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesSearch;
    })
    .sort((a, b) => {
      if (sortField === 'name' || sortField === 'symbol') {
        return sortDirection === 'asc' 
          ? a[sortField].localeCompare(b[sortField]) 
          : b[sortField].localeCompare(a[sortField]);
      } else {
        const aValue = a[sortField];
        const bValue = b[sortField];
        return sortDirection === 'asc' ? (aValue - bValue) : (bValue - aValue);
      }
    });

  const SortIcon = ({ field }: { field: SortField }) => {
    if (sortField !== field) return null;
    return sortDirection === 'asc' ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12 text-red-500">
        <p>{error}</p>
      </div>
    );
  }

  return (
    <section className="py-16 container mx-auto px-4">
      <div className="max-w-screen-xl mx-auto">
        <div className="mb-12">
          <h2 className="text-3xl font-bold mb-8">Top Global Assets</h2>
          
          <div className="flex flex-col md:flex-row md:items-center justify-between space-y-4 md:space-y-0 md:space-x-6 mb-8">
            <div className="w-full md:w-1/3">
              <SearchBar searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
            </div>
            
            <div className="flex items-center space-x-4">
              <SlidersHorizontal className="h-5 w-5 text-gray-400" />
              <FilterTabs activeFilter={activeFilter} setActiveFilter={setActiveFilter} />
            </div>
          </div>
          
          <div className="bg-gray-800 rounded-xl overflow-hidden shadow-xl border border-gray-700">
            <div className="responsive-table">
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-800/90 backdrop-blur-sm border-b border-gray-700">
                    <th 
                      className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider cursor-pointer hover:text-white transition-colors"
                      onClick={() => handleSort('symbol')}
                    >
                      <div className="flex items-center space-x-1">
                        <span>Symbol</span>
                        <SortIcon field="symbol" />
                      </div>
                    </th>
                    <th 
                      className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider cursor-pointer hover:text-white transition-colors"
                      onClick={() => handleSort('name')}
                    >
                      <div className="flex items-center space-x-1">
                        <span>Name</span>
                        <SortIcon field="name" />
                      </div>
                    </th>
                    <th 
                      className="px-6 py-4 text-right text-xs font-medium text-gray-400 uppercase tracking-wider cursor-pointer hover:text-white transition-colors"
                      onClick={() => handleSort('price')}
                    >
                      <div className="flex items-center justify-end space-x-1">
                        <span>Price</span>
                        <SortIcon field="price" />
                      </div>
                    </th>
                    <th 
                      className="px-6 py-4 text-right text-xs font-medium text-gray-400 uppercase tracking-wider cursor-pointer hover:text-white transition-colors"
                      onClick={() => handleSort('percent_change')}
                    >
                      <div className="flex items-center justify-end space-x-1">
                        <span>24h Change</span>
                        <SortIcon field="percent_change" />
                      </div>
                    </th>
                    <th 
                      className="px-6 py-4 text-right text-xs font-medium text-gray-400 uppercase tracking-wider cursor-pointer hover:text-white transition-colors"
                      onClick={() => handleSort('volume')}
                    >
                      <div className="flex items-center justify-end space-x-1">
                        <span>Volume</span>
                        <SortIcon field="volume" />
                      </div>
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-700">
                  {filteredAssets.map((asset) => (
                    <tr 
                      key={asset.symbol}
                      className="hover:bg-gray-750 transition-colors"
                    >
                      <td className="px-6 py-4">
                        <div className="bg-gray-700 rounded-md py-1 px-2 inline-block">
                          <span className="text-sm font-semibold text-gray-200">{asset.symbol}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-300">
                        {asset.name}
                      </td>
                      <td className="px-6 py-4 text-sm text-right text-gray-300 font-mono">
                        {formatCurrency(asset.price)}
                      </td>
                      <td className="px-6 py-4 text-sm text-right">
                        <span className={`${
                          asset.percent_change >= 0 ? 'text-green-500' : 'text-red-500'
                        } font-mono`}>
                          {formatPercentage(asset.percent_change)}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-right text-gray-300 font-mono">
                        {formatLargeNumber(asset.volume)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {filteredAssets.length === 0 && (
            <div className="text-center py-12 text-gray-400 italic">
              No assets found matching your criteria.
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default AssetTable;