export interface Ticker {
  symbol: string;
  name: string;
}

export interface TickerPrice {
  symbol: string;
  price: number;
  change: number;
  timestamp: number;
}

export interface ChartPoint {
  time: string;
  price: number;
}
