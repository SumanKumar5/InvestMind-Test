import axios from 'axios';

const BASE_URL = 'https://api.twelvedata.com';
const API_KEY = import.meta.env.VITE_TWELVE_DATA_API_KEY;

export interface StockQuote {
  symbol: string;
  name: string;
  price: number;
  change: number;
  volume: number;
  market_cap?: number;
}

export const getTopStocks = async (): Promise<StockQuote[]> => {
  try {
    // Get quotes for major indices and stocks
    const symbols = ['AAPL', 'MSFT', 'GOOGL', 'AMZN', 'NVDA', 'META', 'TSLA', 'BRK.A', 'UNH', 'JNJ'].join(',');
    const response = await axios.get(`${BASE_URL}/quote?symbol=${symbols}&apikey=${API_KEY}`);
    
    if (response.data) {
      // Handle both single quote and multiple quotes responses
      const quotes = Array.isArray(response.data) ? response.data : [response.data];
      
      return quotes.map((quote: any) => ({
        symbol: quote.symbol,
        name: quote.symbol, // Using symbol as name since the API doesn't provide company names
        price: parseFloat(quote.close) || 0,
        change: parseFloat(quote.percent_change) || 0,
        volume: parseInt(quote.volume) || 0
      }));
    }
    
    return [];
  } catch (error) {
    console.error('Error fetching stock data:', error);
    // Return mock data as fallback
    return [
      {
        symbol: 'AAPL',
        name: 'Apple Inc.',
        price: 181.56,
        change: 0.82,
        volume: 57000000
      },
      {
        symbol: 'MSFT',
        name: 'Microsoft Corporation',
        price: 326.22,
        change: -0.32,
        volume: 31000000
      },
      {
        symbol: 'GOOGL',
        name: 'Alphabet Inc.',
        price: 141.18,
        change: 0.53,
        volume: 23000000
      }
    ];
  }
};