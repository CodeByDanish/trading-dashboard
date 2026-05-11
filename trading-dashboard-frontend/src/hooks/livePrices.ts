import { useEffect, useState } from "react";
import { getToken } from "../auth/auth";

export type Ticker = {
  symbol: string;
  name: string;
};

export type TickerPrice = {
  symbol: string;
  price: number;
  change: number;
  timestamp: number;
};

export type ChartPoint = {
  time: string;
  price: number;
};

const INITIAL_TICKERS: Ticker[] = [
  { symbol: "AAPL", name: "Apple" },
  { symbol: "TSLA", name: "Tesla" },
  { symbol: "BTC-USD", name: "Bitcoin" },
];

function createInitialState(tickers: Ticker[]) {
  const prices: Record<string, TickerPrice> = {};
  const history: Record<string, ChartPoint[]> = {};

  tickers.forEach((t) => {
    prices[t.symbol] = {
      symbol: t.symbol,
      price: 0,
      change: 0,
      timestamp: Date.now(),
    };

    history[t.symbol] = [];
  });

  return { prices, history };
}

export function useLivePrices() {
  const [tickers] = useState<Ticker[]>(INITIAL_TICKERS);

  const [{ prices, history }, setState] = useState(
    createInitialState(INITIAL_TICKERS),
  );

  useEffect(() => {
    const token = getToken();
    if (!token) return;

    const ws = new WebSocket(`ws://localhost:3000/ws?token=${token}`);
    ws.onopen = () => {
      console.log("WS connected");

      ws.send(
        JSON.stringify({
          type: "subscribe",
          tickers: INITIAL_TICKERS.map((t) => t.symbol),
        }),
      );
    };

    ws.onmessage = (msg) => {
      const data = JSON.parse(msg.data);

      if (data.type === "price_update") {
        setState((prev) => {
          const newPrices = { ...prev.prices };
          const newHistory = { ...prev.history };

          data.data.forEach((tick: any) => {
            const old = newPrices[tick.symbol];
            const price = tick.price;

            const change = old ? price - old.price : 0;

            newPrices[tick.symbol] = {
              symbol: tick.symbol,
              price,
              change,
              timestamp: tick.time,
            };

            const timeLabel = new Date(tick.time).toLocaleTimeString();

            newHistory[tick.symbol] = [
              ...(newHistory[tick.symbol] || []),
              {
                time: timeLabel,
                price,
              },
            ].slice(-30);
          });

          return {
            prices: newPrices,
            history: newHistory,
          };
        });
      }
    };

    ws.onerror = (err) => {
      console.error("WS error:", err);
    };

    ws.onclose = () => {
      console.log("WS closed");
    };

    return () => ws.close();
  }, []);

  return { tickers, prices, history };
}
