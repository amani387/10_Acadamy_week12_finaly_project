"use client";

import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

// Register required components
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

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

  const options = {
    responsive: true,
    plugins: {
      legend: { position: "top" as const },
      title: { display: true, text: "Optimized Portfolio Allocation" },
    },
    scales: {
      x: { type: "category" as const },
      y: { beginAtZero: true },
    },
  };

  return (
    <div className="portfolio-chart-container">
      <Bar data={chartData} options={options} />
    </div>
  );
}
