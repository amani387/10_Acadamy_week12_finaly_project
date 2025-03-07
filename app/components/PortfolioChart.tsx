"use client"; // Needed for Chart.js in Next.js App Router

import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";

ChartJS.register(ArcElement, Tooltip, Legend);

export default function PortfolioChart({ data }: { data: { [key: string]: number } }) {
  const chartData = {
    labels: Object.keys(data),
    datasets: [
      {
        data: Object.values(data),
        backgroundColor: ["#3498db", "#e74c3c", "#2ecc71"],
      },
    ],
  };

  return (
    <div className="mt-5 p-4 bg-white shadow-lg rounded">
      <h3 className="text-xl font-semibold">Portfolio Allocation</h3>
      <Pie data={chartData} />
    </div>
  );
}
