"use client"; // Required for useState & useEffect in Next.js App Router

import { useState } from "react";
import axios from "axios";
import PortfolioChart from "../components/PortfolioChart";

export default function Portfolio() {
  const [stocks, setStocks] = useState("");
  const [portfolio, setPortfolio] = useState<{ [key: string]: number } | null>(
    null
  );

  const handleOptimize = async () => {
    const response = await axios.post("http://localhost:5000/api/optimize", {
      stocks: stocks.split(","),
    });
    setPortfolio(response.data);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center">
      <h1 className="text-3xl font-bold text-gray-800">Portfolio Optimizer</h1>
      <input
        type="text"
        value={stocks}
        onChange={(e) => setStocks(e.target.value)}
        placeholder="Enter stocks (e.g. TSLA, AAPL, SPY)"
        className="mt-3 p-2 border rounded w-80"
      />
      <button
        onClick={handleOptimize}
        className="mt-3 px-4 py-2 bg-blue-600 text-white rounded"
      >
        Optimize Portfolio
      </button>

      {portfolio && <PortfolioChart data={portfolio} />}
    </div>
  );
}
