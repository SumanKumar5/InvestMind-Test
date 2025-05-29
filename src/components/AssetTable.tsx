import React, { useState } from 'react';
import { ChevronDown, ChevronUp, SlidersHorizontal } from 'lucide-react';
import { formatCurrency, formatLargeNumber, formatPercentage } from '../utils/formatters';
import SearchBar from './SearchBar';
import FilterTabs from './FilterTabs';
import useSWR from 'swr';
import { fetchAllMarketData, MarketData } from '../services/api';

type SortField = 'rank' | 'name' | 'price' | 'priceChange24h' | 'marketCap' | 'volume';
type SortDirection = 'asc' | 'desc';

const AssetTable: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState<'all' | 'stocks' | 'crypto' | 'funds'>('all');
  const [sortField, setSortField] = useState<SortField>('rank');
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc');

  const { data: assets = [], error, isLoading } = useSWR<MarketData[]>(
    'market-data',
    fetchAllMarketData,
    {
      refreshInterval: 30000 // Refresh every 30 seconds
    }
  );

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
      const matchesType = activeFilter === 'all' || 
                       (activeFilter === 'stocks' && asset.type === 'stock') ||
                       (activeFilter === 'crypto' && asset.type === 'crypto');
      return matchesSearch && matchesType;
    })
    .sort((a, b) => {
      if (sortField === 'name') {
        return sortDirection === 'asc' 
          ? a.name.localeCompare(b.name) 
          : b.name.localeCompare(a.name);
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

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-red-500">Error loading market data. Please try again later.</p>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="text-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
        <p className="mt-4 text-gray-400">Loading market data...</p>
      </div>
    );
  }

  // Mobile card view component
  const AssetCard = ({ asset }: { asset: MarketData }) => (
    <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
      <div className="flex justify-between items-start mb-4">
        <div className="flex items-center space-x-3">
          <span className="text-gray-400">#{asset.rank}</span>
          <div className="bg-gray-700 rounded-md py-1 px-2">
            <span className="text-sm font-semibold text-gray-200">{asset.symbol}</span>
          </div>
        </div>
        <span className={`font-mono ${
          asset.priceChange24h >= 0 ? 'text-green-500' : 'text-red-500'
        }`}>
          {formatPercentage(asset.priceChange24h)}
        </span>
      </div>
      <div className="space-y-2">
        <h3 className="text-lg font-medium text-gray-200">{asset.name}</h3>
        <div className="flex justify-between">
          <span className="text-gray-400">Price</span>
          <span className="font-mono">{formatCurrency(asset.price)}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-400">Market Cap</span>
          <span className="font-mono">{formatCurrency(asset.marketCap)}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-400">Volume</span>
          <span className="font-mono">{formatLargeNumber(asset.volume)}</span>
        </div>
      </div>
    </div>
  );

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
          
          {/* Desktop Table View */}
          <div className="hidden md:block overflow-x-auto bg-gray-800 rounded-xl border border-gray-700">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-800/90 backdrop-blur-sm border-b border-gray-700">
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider cursor-pointer hover:text-white transition-colors" onClick={() => handleSort('rank')}>
                    <div className="flex items-center space-x-1">
                      <span>Rank</span>
                      <SortIcon field="rank" />
                    </div>
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Symbol</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider cursor-pointer hover:text-white transition-colors" onClick={() => handleSort('name')}>
                    <div className="flex items-center space-x-1">
                      <span>Name</span>
                      <SortIcon field="name" />
                    </div>
                  </th>
                  <th className="px-6 py-4 text-right text-xs font-medium text-gray-400 uppercase tracking-wider cursor-pointer hover:text-white transition-colors" onClick={() => handleSort('price')}>
                    <div className="flex items-center justify-end space-x-1">
                      <span>Price</span>
                      <SortIcon field="price" />
                    </div>
                  </th>
                  <th className="px-6 py-4 text-right text-xs font-medium text-gray-400 uppercase tracking-wider cursor-pointer hover:text-white transition-colors" onClick={() => handleSort('priceChange24h')}>
                    <div className="flex items-center justify-end space-x-1">
                      <span>24h Change</span>
                      <SortIcon field="priceChange24h" />
                    </div>
                  </th>
                  <th className="px-6 py-4 text-right text-xs font-medium text-gray-400 uppercase tracking-wider cursor-pointer hover:text-white transition-colors" onClick={() => handleSort('marketCap')}>
                    <div className="flex items-center justify-end space-x-1">
                      <span>Market Cap</span>
                      <SortIcon field="marketCap" />
                    </div>
                  </th>
                  <th className="px-6 py-4 text-right text-xs font-medium text-gray-400 uppercase tracking-wider cursor-pointer hover:text-white transition-colors" onClick={() => handleSort('volume')}>
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
                    key={asset.id}
                    className="hover:bg-gray-750 transition-colors"
                  >
                    <td className="px-6 py-4 text-sm font-medium text-gray-300">
                      {asset.rank}
                    </td>
                    <td className="px-6 py-4">
                      <div className="bg-gray-700 rounded-md py-1 px-2 inline-block">
                        <span className="text-sm font-semibold text-gray-200">{asset.symbol}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-300 font-medium">
                      {asset.name}
                    </td>
                    <td className="px-6 py-4 text-sm text-right text-gray-300 font-mono">
                      {formatCurrency(asset.price)}
                    </td>
                    <td className="px-6 py-4 text-sm text-right font-medium">
                      <span className={`${
                        asset.priceChange24h >= 0 ? 'text-green-500' : 'text-red-500'
                      } font-mono`}>
                        {formatPercentage(asset.priceChange24h)}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-right text-gray-300 font-mono">
                      {formatCurrency(asset.marketCap)}
                    </td>
                    <td className="px-6 py-4 text-sm text-right text-gray-300 font-mono">
                      {formatLargeNumber(asset.volume)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile Card View */}
          <div className="md:hidden space-y-4">
            {filteredAssets.map((asset) => (
              <AssetCard key={asset.id} asset={asset} />
            ))}
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