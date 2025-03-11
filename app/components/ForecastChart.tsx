"use client";

import { Line } from "react-chartjs-2";
import { Chart as ChartJS, LineElement, PointElement, Tooltip, Legend, CategoryScale, LinearScale } from "chart.js";
import { Card, CardContent, Typography } from "@mui/material";

// Register required Chart.js components
ChartJS.register(LineElement, PointElement, Tooltip, Legend, CategoryScale, LinearScale);

export default function ForecastChart({ data }: { data: any }) {
  const labels = Array.from({ length: data.forecast.length }, (_, i) => `Day ${i + 1}`);

  const chartData = {
    labels,
    datasets: [
      {
        label: "Forecasted Price",
        data: data.forecast,
        borderColor: "#1976d2",
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
    <Card sx={{ maxWidth: 600, margin: "auto", boxShadow: 3 }}>
      <CardContent>
        <Typography variant="h6" fontWeight="bold" color="primary" textAlign="center">
          Stock Forecast
        </Typography>
        <Line data={chartData} />
      </CardContent>
    </Card>
  );
}
