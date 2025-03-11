"use client";

import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Tooltip,
  Legend,
  Title,
} from "chart.js";

// Register necessary components for a line chart
ChartJS.register(LineElement, CategoryScale, LinearScale, PointElement, Tooltip, Legend, Title);

export default function ForecastChart({ data }: { data: any }) {
  // Generate labels based on forecast length
  const labels = Array.from({ length: data.forecast.length }, (_, i) => `Day ${i + 1}`);

  const chartData = {
    labels,
    datasets: [
      {
        label: "Forecasted Price",
        data: data.forecast,
        borderColor: "#3498db",
        fill: false,
      },
      {
        label: "Lower Bound",
        data: data.lower_bound,
        borderColor: "#e74c3c",
        borderDash: [5, 5],
        fill: false,
      },
      {
        label: "Upper Bound",
        data: data.upper_bound,
        borderColor: "#2ecc71",
        borderDash: [5, 5],
        fill: false,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: { position: "top" as const },
      title: { display: true, text: "Stock Forecast with Confidence Intervals" },
    },
    scales: {
      x: { type: "category" as const },
      y: { beginAtZero: false },
    },
  };

  return (
    <div className="w-full p-6 bg-white shadow-lg rounded-lg border border-gray-200">
      <div className="text-center mb-4">
        <h2 className="text-2xl font-semibold text-gray-800">Stock Price Forecast</h2>
        <p className="text-sm text-gray-600">Prediction with confidence intervals</p>
      </div>
      <div className="w-full">
        <Line data={chartData} options={options} />
      </div>
    </div>
  );
}
