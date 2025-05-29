import axios from 'axios';

const API_KEY = 'c9cb1125f0e04947a2dbb1d4fd054b13';
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
        symbol: quote.symbol,
        name: quote.name || quote.symbol,
        price: parseFloat(quote.close),
        percent_change: parseFloat(quote.percent_change),
        volume: parseFloat(quote.volume)
      }));
    } else {
      // Single quote response
      const quote = response.data;
      return [{
        symbol: quote.symbol,
        name: quote.name || quote.symbol,
        price: parseFloat(quote.close),
        percent_change: parseFloat(quote.percent_change),
        volume: parseFloat(quote.volume)
      }];
    }
  } catch (error) {
    console.error('Error fetching market data:', error);
    throw error;
  }
};