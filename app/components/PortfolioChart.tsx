"use client";

import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";

// Register necessary Chart.js components
ChartJS.register(ArcElement, Tooltip, Legend);

export default function PortfolioChart({ data }: { data: { [key: string]: number } }) {
  const chartData = {
    labels: Object.keys(data),
    datasets: [
      {
        label: "Portfolio Allocation",
        data: Object.values(data),
        backgroundColor: ["#3498db", "#2ecc71", "#e74c3c"],
        hoverOffset: 4,
      },
    ],
  };

  return (
    <div className="w-full md:w-1/2 lg:w-1/3 p-4">
      <h2 className="text-xl font-bold text-center">Optimized Portfolio Allocation</h2>
      <Pie data={chartData} />
    </div>
  );
}
