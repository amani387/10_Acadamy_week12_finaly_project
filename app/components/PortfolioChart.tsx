"use client";

import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { Card, CardContent, Typography } from "@mui/material";

// Register required Chart.js components
ChartJS.register(ArcElement, Tooltip, Legend);

export default function PortfolioChart({ data }: { data: { [key: string]: number } }) {
  const chartData = {
    labels: Object.keys(data),
    datasets: [
      {
        label: "Portfolio Allocation",
        data: Object.values(data),
        backgroundColor: ["#1976d2", "#dc004e", "#ff9800"],
        hoverOffset: 4,
      },
    ],
  };

  return (
    <Card sx={{ maxWidth: 500, margin: "auto", boxShadow: 3 }}>
      <CardContent>
        <Typography variant="h6" fontWeight="bold" color="primary" textAlign="center">
          Optimized Portfolio Allocation
        </Typography>
        <Pie data={chartData} />
      </CardContent>
    </Card>
  );
}
