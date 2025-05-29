import axios from 'axios';

const API_KEY = 'df2dd95161e44741a7306d2c20f29328';
const BASE_URL = 'https://api.twelvedata.com';

export interface MarketQuote {
  symbol: string;
  name: string;
  price: number;
  percent_change: number;
  volume: number;
}

export const getMarketData = async (symbols: string[]): Promise<MarketQuote[]> => {
  try {
    const response = await axios.get(`${BASE_URL}/quote`, {
      params: {
        symbol: symbols.join(','),
        apikey: API_KEY
      }
    });

    if (Array.isArray(response.data)) {
      return response.data.map((quote: any) => ({
        symbol: String(quote.symbol || ''),
        name: String(quote.name || quote.symbol || ''),
        price: parseFloat(quote.close) || 0,
        percent_change: parseFloat(quote.percent_change) || 0,
        volume: parseFloat(quote.volume) || 0
      }));
    } else {
      // Single quote response
      const quote = response.data;
      return [{
        symbol: String(quote.symbol || ''),
        name: String(quote.name || quote.symbol || ''),
        price: parseFloat(quote.close) || 0,
        percent_change: parseFloat(quote.percent_change) || 0,
        volume: parseFloat(quote.volume) || 0
      }];
    }
  } catch (error) {
    console.error('Error fetching market data:', error);
    throw error;
  }
};