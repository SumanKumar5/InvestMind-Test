import React, { useState, useMemo } from 'react';
import { ChevronDown, ChevronUp, SlidersHorizontal, Apple, Microscope as Microsoft, Bitcoin, ToggleLeft as Google, Feather as Ethereum, LineChart, Banknote, Car, Sun } from 'lucide-react';
import { formatCurrency, formatLargeNumber, formatPercentage } from '../utils/formatters';
import { mockAssets } from '../data/mockAssets';
import { Asset } from '../types/asset';
import SearchBar from './SearchBar';
import FilterTabs from './FilterTabs';

type SortField = 'rank' | 'name' | 'price' | 'priceChange24h' | 'marketCap' | 'volume';
type SortDirection = 'asc' | 'desc';

const AssetTable: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState<'all' | 'stocks' | 'crypto' | 'funds'>('all');
  const [sortField, setSortField] = useState<SortField>('rank');
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc');

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const getAssetIcon = (symbol: string, type: string, className: string = "h-5 w-5") => {
    switch (symbol) {
      case 'AAPL':
        return <Apple className={className} aria-hidden="true" />;
      case 'MSFT':
        return <Microsoft className={className} aria-hidden="true" />;
      case 'BTC':
        return <Bitcoin className={className} aria-hidden="true" />;
      case 'GOOGL':
        return <Google className={className} aria-hidden="true" />;
      case 'ETH':
        return <Ethereum className={className} aria-hidden="true" />;
      case 'VFIAX':
      case 'FXAIX':
        return <Banknote className={className} aria-hidden="true" />;
      case 'TSLA':
        return <Car className={className} aria-hidden="true" />;
      case 'SOL':
        return <Sun className={className} aria-hidden="true" />;
      default:
        return <LineChart className={className} aria-hidden="true" />;
    }
  };

  const filteredAssets = useMemo(() => {
    return mockAssets
      .filter((asset) => {
        const matchesSearch = asset.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                            asset.symbol.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesType = activeFilter === 'all' || 
                         (activeFilter === 'stocks' && asset.type === 'stock') ||
                         (activeFilter === 'crypto' && asset.type === 'crypto') ||
                         (activeFilter === 'funds' && asset.type === 'fund');
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
  }, [searchQuery, activeFilter, sortField, sortDirection]);

  const SortIcon = ({ field }: { field: SortField }) => {
    if (sortField !== field) return null;
    return sortDirection === 'asc' ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />;
  };

  // Mobile card view component
  const AssetCard = ({ asset }: { asset: Asset }) => (
    <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center space-x-3">
          <span className="text-gray-400">#{asset.rank}</span>
          <div className="flex items-center space-x-2">
            {getAssetIcon(asset.symbol, asset.type, "h-5 w-5 text-gray-400")}
            <div className="bg-gray-700 rounded-md py-1 px-2">
              <span className="text-sm font-semibold text-gray-200">{asset.symbol}</span>
            </div>
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
          <span className="font-mono">{formatCurrency(asset.marketCap).split('.')[0]}</span>
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
          <div className="hidden md:block bg-gray-800 rounded-xl overflow-hidden shadow-xl border border-gray-700">
            <div className="responsive-table">
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-800/90 backdrop-blur-sm border-b border-gray-700">
                    {[
                      { field: 'rank' as SortField, label: 'Rank' },
                      { field: null, label: 'Symbol' },
                      { field: 'name' as SortField, label: 'Asset Name' },
                      { field: 'price' as SortField, label: 'Price (USD)' },
                      { field: 'priceChange24h' as SortField, label: '24h Change' },
                      { field: 'marketCap' as SortField, label: 'Market Cap' },
                      { field: 'volume' as SortField, label: 'Volume' }
                    ].map((column) => (
                      <th 
                        key={column.label}
                        className={`px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider ${
                          column.field ? 'cursor-pointer hover:text-white transition-colors' : ''
                        }`}
                        onClick={() => column.field && handleSort(column.field)}
                      >
                        <div className="flex items-center space-x-1">
                          <span>{column.label}</span>
                          {column.field && <SortIcon field={column.field} />}
                        </div>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-700">
                  {filteredAssets.map((asset) => (
                    <tr 
                      key={asset.id}
                      className="hover:bg-gray-750 group cursor-pointer"
                    >
                      <td className="px-6 py-4 text-sm font-medium text-gray-300">
                        {asset.rank}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center space-x-2">
                          {getAssetIcon(asset.symbol, asset.type, "h-5 w-5 text-gray-400 group-hover:text-gray-300 transition-colors")}
                          <div className="bg-gray-700 rounded-md py-1 px-2">
                            <span className="text-sm font-semibold text-gray-200">{asset.symbol}</span>
                          </div>
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
                        {formatCurrency(asset.marketCap).split('.')[0]}
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