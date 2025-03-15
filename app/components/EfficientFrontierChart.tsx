"use client";

import { Scatter } from "react-chartjs-2";
import { Chart as ChartJS, PointElement, LinearScale, Tooltip, Legend } from "chart.js";
import React from "react";
import { Card, CardContent, Typography } from "@mui/material";

// Register necessary Chart.js components
ChartJS.register(PointElement, LinearScale, Tooltip, Legend);

export default function EfficientFrontierChart({ data }: { data: any }) {
  if (!data || !data.random_portfolios || data.random_portfolios.length === 0) {
    return (
      <Card sx={{ boxShadow: 3, borderRadius: 2 }}>
        <CardContent>
          <Typography variant="h6" fontWeight="bold" color="primary" textAlign="center">
            No portfolio data available.
          </Typography>
        </CardContent>
      </Card>
    );
  }

  const scatterData = {
    datasets: [
      {
        label: "Random Portfolios",
        data: data.random_portfolios.map((p: any) => ({ x: p.volatility, y: p.return })),
        backgroundColor: "rgba(52, 152, 219, 0.7)", // Blue color
      },
      {
        label: "Max Sharpe Portfolio",
        data: [{ x: data.optimized_portfolio.volatility, y: data.optimized_portfolio.return }],
        backgroundColor: "red",
        pointRadius: 6,
      },
    ],
  };

  return (
    <Card sx={{ boxShadow: 3, borderRadius: 2 }}>
      <CardContent>
        <Typography variant="h6" fontWeight="bold" color="primary" textAlign="center" gutterBottom>
          Efficient Frontier
        </Typography>
        <Scatter
          data={scatterData}
          options={{
            scales: {
              x: { title: { display: true, text: "Volatility" } },
              y: { title: { display: true, text: "Expected Return" } },
            },
          }}
        />
      </CardContent>
    </Card>
  );
}
