import React from "react";
import type { Ticker } from "../hooks/livePrices";

type Props = {
  tickers: Ticker[];
  selected: string;
  onSelect: (symbol: string) => void;
};

export const TickerList: React.FC<Props> = ({
  tickers,
  selected,
  onSelect,
}) => {
  return (
    <div className="ticker-list">
      {tickers.map((t) => (
        <button
          key={t.symbol}
          className={`ticker-item ${selected === t.symbol ? "active" : ""}`}
          onClick={() => onSelect(t.symbol)}
        >
          <span className="ticker-symbol">{t.symbol}</span>

          <span className="ticker-name">{t.name}</span>
        </button>
      ))}
    </div>
  );
};
