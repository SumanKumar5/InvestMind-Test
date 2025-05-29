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
      // If single quote, convert to array
      const quotes = Array.isArray(response.data) ? response.data : [response.data];
      
      return quotes.map((quote: any) => ({
        symbol: quote.symbol,
        name: quote.name || quote.symbol,
        price: parseFloat(quote.close),
        change: parseFloat(quote.percent_change),
        volume: parseInt(quote.volume),
      }));
    }
    
    return [];
  } catch (error) {
    console.error('Error fetching stock data:', error);
    return [];
  }
};