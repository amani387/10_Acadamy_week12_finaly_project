"use client";

import { useState } from "react";
import axios from "axios";
import { Container, TextField, Button, Grid, Typography, Box } from "@mui/material";
import PortfolioChart from "../components/PortfolioChart";
import ForecastChart from "../components/ForecastChart";
import RiskMetrics from "../components/RiskMetrics";
import EfficientFrontierChart from "../components/EfficientFrontierChart";

export default function Portfolio() {
  const [stocks, setStocks] = useState("");
  const [portfolio, setPortfolio] = useState<{ [key: string]: number } | null>(null);
  const [forecast, setForecast] = useState<any | null>(null);
  const [riskMetrics, setRiskMetrics] = useState<any | null>(null);
  const [efficientFrontier, setEfficientFrontier] = useState<any | null>(null);

  const handleOptimize = async () => {
    try {
      const response = await axios.post("http://localhost:5000/api/optimize", {
        stocks: stocks.split(","),
      });
      setPortfolio(response.data);
    } catch (error) {
      console.error("Optimize API error:", error);
    }
  };

  const handleForecast = async () => {
    try {
      const response = await axios.post("http://localhost:5000/api/forecast", {
        stocks: stocks.split(","),
      });
      setForecast(response.data);
    } catch (error) {
      console.error("Forecast API error:", error);
    }
  };

  const handleRiskAnalysis = async () => {
    try {
      const response = await axios.post("http://localhost:5000/api/market-trend", {
        stocks: stocks.split(","),
      });
      setRiskMetrics(response.data);
    } catch (error) {
      console.error("Risk Analysis API error:", error);
    }
  };

  const handleEfficientFrontier = async () => {
    try {
      const response = await axios.post("http://localhost:5000/api/efficient-frontier", {
        stocks: stocks.split(","),
      });
      setEfficientFrontier(response.data);
    } catch (error) {
      console.error("Efficient Frontier API error:", error);
    }
  };

  return (
    <Container maxWidth="md" sx={{ mt: 4, textAlign: "center" }}>
      <Typography variant="h4" fontWeight="bold" color="primary" gutterBottom>
        Portfolio Optimizer
      </Typography>

      {/* Input Field for Stocks */}
      <TextField
        label="Enter Stocks (e.g., TSLA, AAPL, SPY)"
        variant="outlined"
        fullWidth
        value={stocks}
        onChange={(e) => setStocks(e.target.value)}
        sx={{ mb: 3 }}
      />

      {/* Action Buttons */}
      <Grid container spacing={2} justifyContent="center">
        <Grid item>
          <Button variant="contained" color="primary" onClick={handleOptimize}>
            Optimize Portfolio
          </Button>
        </Grid>
        <Grid item>
          <Button variant="contained" color="secondary" onClick={handleForecast}>
            Run Forecast
          </Button>
        </Grid>
        <Grid item>
          <Button variant="contained" color="success" onClick={handleRiskAnalysis}>
            Analyze Risk
          </Button>
        </Grid>
        <Grid item>
          <Button variant="contained" color="warning" onClick={handleEfficientFrontier}>
            Show Efficient Frontier
          </Button>
        </Grid>
      </Grid>

      {/* Charts & Data Sections */}
      <Box sx={{ mt: 5, display: "flex", flexWrap: "wrap", justifyContent: "center", gap: 4 }}>
        {portfolio && <PortfolioChart data={portfolio} />}
        {forecast && <ForecastChart data={forecast} />}
        {riskMetrics && <RiskMetrics riskData={riskMetrics} />}
        {efficientFrontier && <EfficientFrontierChart data={efficientFrontier} />}
      </Box>
    </Container>
  );
}
