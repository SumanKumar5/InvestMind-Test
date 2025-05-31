export interface Holding {
  id: string;
  symbol: string;
  companyName: string;
  quantity: number;
  buyPrice: number;
  currentPrice: number;
  marketValue: number;
  gainLoss: number;
  gainLossPercentage: number;
  sector: string;
}

export interface SectorExposure {
  sector: string;
  percentage: number;
}

export interface PortfolioAnalytics {
  totalInvestment: number;
  currentValue: number;
  profitLossPercentage: number;
  CAGR: string;
  sectors: Record<string, string>;
}