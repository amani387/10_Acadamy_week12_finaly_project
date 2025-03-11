"use client";

import { useState } from "react";
import axios from "axios";
import PortfolioChart from "../components/PortfolioChart";
import ForecastChart from "../components/ForecastChart";
import RiskMetrics from "../components/RiskMetrics";

export default function Portfolio() {
  const [stocks, setStocks] = useState("");
  const [portfolio, setPortfolio] = useState<{ [key: string]: number } | null>(null);
  const [forecast, setForecast] = useState<any | null>(null);
  const [riskMetrics, setRiskMetrics] = useState<any | null>(null);
  const [loading, setLoading] = useState<string | null>(null);

  const handleOptimize = async () => {
    try {
      setLoading("Optimizing Portfolio...");
      const response = await axios.post("http://localhost:5000/api/optimize", {
        stocks: stocks.split(",").map((s) => s.trim()),
      });
      setPortfolio(response.data);
    } catch (error) {
      console.error("Optimize API error:", error);
      alert("Failed to optimize portfolio. Please try again.");
    } finally {
      setLoading(null);
    }
  };

  const handleForecast = async () => {
    try {
      setLoading("Fetching Forecast...");
      const response = await axios.post("http://localhost:5000/api/forecast", {
        stocks: stocks.split(",").map((s) => s.trim()),
      });
      setForecast(response.data);
    } catch (error) {
      console.error("Forecast API error:", error);
      alert("Failed to fetch forecast. Please try again.");
    } finally {
      setLoading(null);
    }
  };

  const handleRiskAnalysis = async () => {
    try {
      setLoading("Analyzing Risk...");
      const response = await axios.post("http://localhost:5000/api/market-trend", {
        stocks: stocks.split(",").map((s) => s.trim()),
      });
      setRiskMetrics(response.data);
    } catch (error) {
      console.error("Risk API error:", error);
      alert("Failed to analyze risk. Please try again.");
    } finally {
      setLoading(null);
    }
  };

  return (
    <div className="container">
      <h1 className="title">Portfolio Optimizer</h1>

      <input
        type="text"
        value={stocks}
        onChange={(e) => setStocks(e.target.value)}
        placeholder="Enter stocks (e.g. TSLA, AAPL, SPY)"
        className="input-field"
      />

      <div className="button-container">
        <button onClick={handleOptimize} className="button blue">Optimize Portfolio</button>
        <button onClick={handleForecast} className="button green">Run Forecast</button>
        <button onClick={handleRiskAnalysis} className="button red">Analyze Risk</button>
      </div>

      {loading && <p className="loading">{loading}</p>}

      <div className="chart-container">
        {portfolio && <PortfolioChart data={portfolio} />}
        {forecast && <ForecastChart data={forecast} />}
        {riskMetrics && <RiskMetrics riskData={riskMetrics} />}
      </div>
    </div>
  );
}
