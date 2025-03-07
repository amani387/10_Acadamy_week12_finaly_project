"use client";
import { Line } from "react-chartjs-2";

export default function ForecastChart({ data }: { data: any }) {
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

  return (
    <div className="w-full p-4">
      <h2 className="text-xl font-bold text-center">Stock Forecast</h2>
      <Line data={chartData} />
    </div>
  );
}
