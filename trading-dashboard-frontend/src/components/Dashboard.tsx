import React, { useState, useMemo } from "react";

import { useLivePrices } from "../hooks/livePrices";

import { TickerPrices } from "./TickerPrices";
import { TickerChart } from "./TickerChart";
import { TickerList } from "./TickerList";
import { useNavigate } from "react-router-dom";

import logo from "../assets/logo.png";

export const Dashboard: React.FC = () => {
  const { tickers, prices, history } = useLivePrices();

  const [selected, setSelected] = useState<string>("AAPL");

  const chartData = useMemo(() => history[selected] ?? [], [history, selected]);

  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login", { replace: true });
  };

  return (
    <div className="dashboard">
      <header className="dashboard-header">
        <div className="header-left">
          <div className="logo">
            {/* <img src={logo} alt="TradeFlow Logo" className="logo-img" /> */}
            Trade Dashboard
          </div>
        </div>

        <div className="header-center">
          <span className="market-status">Live Market</span>
        </div>

        <div className="header-right">
          <button className="logout-btn" onClick={handleLogout}>
            Logout
          </button>
        </div>
      </header>

      <div className="dashboard-content">
        <aside className="dashboard-sidebar">
          <h3>Tickers</h3>

          <TickerList
            tickers={tickers}
            selected={selected}
            onSelect={setSelected}
          />
        </aside>

        <main className="dashboard-main">
          <section className="dashboard-top">
            <TickerPrices
              tickers={tickers}
              prices={prices}
              selected={selected}
              onSelect={setSelected}
            />
          </section>

          <section className="dashboard-bottom">
            <TickerChart symbol={selected} data={chartData} />
          </section>
        </main>
      </div>
    </div>
  );
};
