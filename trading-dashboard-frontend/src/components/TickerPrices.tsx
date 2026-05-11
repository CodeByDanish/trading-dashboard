import React from "react";
import type { Ticker, TickerPrice } from "../hooks/livePrices";

type Props = {
  tickers: Ticker[];
  prices: Record<string, TickerPrice>;
  selected: string;
  onSelect: (symbol: string) => void;
};

export const TickerPrices: React.FC<Props> = ({
  tickers,
  prices,
  selected,
  onSelect,
}) => {
  return (
    <div className="ticker-prices">
      {tickers.map((t) => {
        const p = prices[t.symbol];

        const changeClass =
          p && p.change !== 0 ? (p.change > 0 ? "price-up" : "price-down") : "";

        return (
          <div
            key={t.symbol}
            className={`ticker-row ${
              selected === t.symbol ? "selected-row" : ""
            }`}
            onClick={() => onSelect(t.symbol)}
          >
            <div className="ticker-row-left">
              <span className="ticker-symbol">{t.symbol}</span>

              <span className="ticker-name">{t.name}</span>
            </div>

            <div className="ticker-row-right">
              <span className="ticker-price">
                {p ? p.price.toFixed(2) : "--"}
              </span>

              <span className={`ticker-change ${changeClass}`}>
                {p
                  ? p.change >= 0
                    ? `+${p.change.toFixed(2)}`
                    : p.change.toFixed(2)
                  : "--"}
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
};
