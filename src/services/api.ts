import axios from 'axios';

const COINGECKO_API = 'https://api.coingecko.com/api/v3';
const ALPHA_VANTAGE_API = 'https://www.alphavantage.co/query';
const ALPHA_VANTAGE_KEY = 'SI3CN0SOFXH9BU7W';

export interface MarketData {
  id: string;
  rank: number;
  symbol: string;
  name: string;
  type: 'stock' | 'crypto';
  price: number;
  priceChange24h: number;
  marketCap: number;
  volume: number;
}

export const fetchTopCryptos = async (): Promise<MarketData[]> => {
  const response = await axios.get(`${COINGECKO_API}/coins/markets`, {
    params: {
      vs_currency: 'usd',
      order: 'market_cap_desc',
      per_page: 5,
      sparkline: false
    }
  });

  return response.data.map((coin: any, index: number) => ({
    id: coin.id,
    rank: index + 1,
    symbol: coin.symbol.toUpperCase(),
    name: coin.name,
    type: 'crypto',
    price: coin.current_price,
    priceChange24h: coin.price_change_percentage_24h,
    marketCap: coin.market_cap,
    volume: coin.total_volume
  }));
};

export const fetchTopStocks = async (): Promise<MarketData[]> => {
  const symbols = ['AAPL', 'MSFT', 'GOOGL', 'AMZN', 'NVDA'];
  const stocksData = await Promise.all(
    symbols.map(async (symbol, index) => {
      const response = await axios.get(`${ALPHA_VANTAGE_API}`, {
        params: {
          function: 'GLOBAL_QUOTE',
          symbol,
          apikey: ALPHA_VANTAGE_KEY
        }
      });

      const quote = response.data['Global Quote'];
      return {
        id: symbol.toLowerCase(),
        rank: index + 1,
        symbol,
        name: getStockName(symbol), // Added company names
        type: 'stock',
        price: parseFloat(quote['05. price']),
        priceChange24h: parseFloat(quote['10. change percent'].replace('%', '')),
        marketCap: 0, // Alpha Vantage basic API doesn't provide market cap
        volume: parseFloat(quote['06. volume'])
      };
    })
  );

  return stocksData;
};

// Helper function to get company names
function getStockName(symbol: string): string {
  const companies: Record<string, string> = {
    'AAPL': 'Apple Inc.',
    'MSFT': 'Microsoft Corporation',
    'GOOGL': 'Alphabet Inc.',
    'AMZN': 'Amazon.com Inc.',
    'NVDA': 'NVIDIA Corporation'
  };
  return companies[symbol] || symbol;
}

export const fetchAllMarketData = async (): Promise<MarketData[]> => {
  try {
    const [cryptos, stocks] = await Promise.all([
      fetchTopCryptos(),
      fetchTopStocks()
    ]);

    return [...cryptos, ...stocks].sort((a, b) => a.rank - b.rank);
  } catch (error) {
    console.error('Error fetching market data:', error);
    return [];
  }
};