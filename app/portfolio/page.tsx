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

  const handleOptimize = async () => {
    const response = await axios.post("http://localhost:5000/api/optimize", { stocks: stocks.split(",") });
    setPortfolio(response.data);
  };

  const handleForecast = async () => {
    const response = await axios.post("http://localhost:5000/api/forecast", { stocks: stocks.split(",") });
    setForecast(response.data);
  };

  const handleRiskAnalysis = async () => {
    const response = await axios.post("http://localhost:5000/api/market-trend", { stocks: stocks.split(",") });
    setRiskMetrics(response.data);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6">
      <h1 className="text-3xl font-bold text-gray-800">Portfolio Optimizer</h1>

      <input
        type="text"
        value={stocks}
        onChange={(e) => setStocks(e.target.value)}
        placeholder="Enter stocks (e.g. TSLA, AAPL, SPY)"
        className="mt-3 p-2 border rounded w-80"
      />

      <div className="flex flex-wrap justify-center gap-4 mt-4">
        <button onClick={handleOptimize} className="px-4 py-2 bg-blue-600 text-white rounded">Optimize Portfolio</button>
        <button onClick={handleForecast} className="px-4 py-2 bg-green-600 text-white rounded">Run Forecast</button>
        <button onClick={handleRiskAnalysis} className="px-4 py-2 bg-red-600 text-white rounded">Analyze Risk</button>
      </div>

      <div className="flex flex-wrap justify-center mt-6 w-full">
        {portfolio && <PortfolioChart data={portfolio} />}
        {forecast && <ForecastChart data={forecast} />}
        {riskMetrics && <RiskMetrics riskData={riskMetrics} />}
      </div>
    </div>
  );
}
