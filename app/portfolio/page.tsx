"use client";
import React, { useState } from "react";
import axios from "axios";
import {
  Container,
  TextField,
  Button,
  Grid,
  Typography,
  Card,
  CardContent,
  CircularProgress,
  Snackbar,
  Alert,
  Box,
  Switch,
  Tabs,
  Tab,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from "@mui/material";
import { motion } from "framer-motion";
import PortfolioChart from "../components/PortfolioChart";
import ForecastChart from "../components/ForecastChart";
import RiskMetrics from "../components/RiskMetrics";
import EfficientFrontierChart from "../components/EfficientFrontierChart";
// @ts-ignore
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

export default function Portfolio() {
  const [stocks, setStocks] = useState("");
  const [portfolio, setPortfolio] = useState(null);
  const [forecast, setForecast] = useState(null);
  const [riskMetrics, setRiskMetrics] = useState(null);
  const [efficientFrontier, setEfficientFrontier] = useState(null);
  const [loading, setLoading] = useState(false);
  const [notification, setNotification] = useState({
    open: false,
    message: "",
    severity: "success",
  });
  const [darkMode, setDarkMode] = useState(false);
  const [forecastModel, setForecastModel] = useState("arima");
  const [forecastPeriod, setForecastPeriod] = useState(30);
  const [tabValue, setTabValue] = useState(0);

  const handleAPIRequest = async (endpoint, setter, params = {}) => {
    setLoading(true);
    try {
      const response = await axios.post(
        `http://localhost:5000/api/${endpoint}`,
        {
          stocks: stocks.split(","),
          ...params,
        }
      );
      setter(response.data);
      setNotification({ open: true, message: "Success!", severity: "success" });
    } catch (error) {
      setNotification({
        open: true,
        message: `Error: ${error.message}`,
        severity: "error",
      });
    }
    setLoading(false);
  };

  const theme = {
    palette: {
      mode: darkMode ? "dark" : "light",
      primary: {
        main: "#3f51b5",
      },
      background: {
        default: darkMode ? "#121212" : "#ffffff",
      },
      text: {
        primary: darkMode ? "#fff" : "#333",
      },
    },
    typography: {
      h4: {
        fontWeight: 700,
        fontSize: "2.5rem",
      },
      h5: {
        fontWeight: 600,
        fontSize: "1.5rem",
      },
      body2: {
        fontSize: "1rem",
        lineHeight: 1.6,
      },
    },
  };

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  return (
    <Box
      sx={{
        background: darkMode
          ? "linear-gradient(135deg, #2c387e, #1d1d1d)"
          : "linear-gradient(135deg, #3f51b5, #ffffff)",
        height: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        padding: "20px",
      }}
    >
      <Container
        maxWidth="lg"
        sx={{
          mt: 20,
          textAlign: "center",
          backgroundColor: darkMode ? "#333" : "#f5f5f5",
          padding: 4,
          borderRadius: 3,
          boxShadow: darkMode
            ? "0 4px 12px rgba(0, 0, 0, 0.7)"
            : "0 4px 12px rgba(0, 0, 0, 0.1)",
        }}
      >
        <Box sx={{ display: "flex", justifyContent: "flex-end", mb: 3 }}>
          <Switch
            checked={darkMode}
            onChange={() => setDarkMode(!darkMode)}
            color="primary"
          />
          <Typography variant="body2" sx={{ ml: 2 }}>
            Toggle Dark/Light Mode
          </Typography>
        </Box>

        <Typography variant="h4" sx={{ fontWeight: 700, mb: 3 }}>
          Portfolio Optimization Dashboard
        </Typography>

        <TextField
          label="Enter Stock Symbols (e.g., TSLA, AAPL, SPY)"
          variant="outlined"
          fullWidth
          value={stocks}
          onChange={(e) => setStocks(e.target.value)}
          sx={{
            mb: 3,
            backgroundColor: "white",
            borderRadius: 2,
            boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.1)",
          }}
        />

        <Tabs
          value={tabValue}
          onChange={handleTabChange}
          centered
          sx={{
            mb: 4,
            backgroundColor: darkMode ? "#424242" : "#f5f5f5",
            borderRadius: 2,
          }}
        >
          <Tab label="Portfolio Optimization" />
          <Tab label="Market Forecast" />
          <Tab label="Risk Analysis" />
          <Tab label="Efficient Frontier" />
        </Tabs>

        {loading && <CircularProgress sx={{ mt: 2 }} />}

        {tabValue === 0 && (
          <Card
            sx={{
              width: "100%",
              boxShadow: darkMode
                ? "0 4px 12px rgba(0, 0, 0, 0.5)"
                : "0 4px 12px rgba(0, 0, 0, 0.1)",
              backgroundColor: darkMode ? "#424242" : "#fff",
              borderRadius: 2,
              p: 3,
            }}
          >
            <Button
              variant="contained"
              color="primary"
              onClick={() => handleAPIRequest("optimize", setPortfolio)}
              sx={{
                width: "100%",
                backgroundColor: darkMode ? "#673ab7" : "#3f51b5",
                "&:hover": {
                  backgroundColor: darkMode ? "#512da8" : "#303f9f",
                },
              }}
            >
              Optimize Portfolio
            </Button>

            {portfolio && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
                // @ts-ignore
                style={{ mt: 2 }}
              >
                <PortfolioChart data={portfolio} />
              </motion.div>
            )}
          </Card>
        )}

        {tabValue === 1 && (
          <Card
            sx={{
              width: "100%",
              boxShadow: darkMode
                ? "0 4px 12px rgba(0, 0, 0, 0.5)"
                : "0 4px 12px rgba(0, 0, 0, 0.1)",
              backgroundColor: darkMode ? "#424242" : "#fff",
              borderRadius: 2,
              p: 3,
            }}
          >
            <Grid container spacing={2} alignItems="center">
              <Grid item xs={12} sm={4}>
                <FormControl fullWidth>
                  <InputLabel>Forecast Model</InputLabel>
                  <Select
                    value={forecastModel}
                    onChange={(e) => setForecastModel(e.target.value)}
                    label="Forecast Model"
                  >
                    <MenuItem value="arima">ARIMA</MenuItem>
                    <MenuItem value="sarima">SARIMA</MenuItem>
                    <MenuItem value="lstm">LSTM</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={4}>
                <FormControl fullWidth>
                  <InputLabel>Forecast Period (days)</InputLabel>
                  <Select
                    value={forecastPeriod}
                    onChange={(e) => setForecastPeriod(Number(e.target.value))}
                    label="Forecast Period"
                  >
                    <MenuItem value={7}>7 days</MenuItem>
                    <MenuItem value={14}>14 days</MenuItem>
                    <MenuItem value={30}>30 days</MenuItem>
                    <MenuItem value={60}>60 days</MenuItem>
                    <MenuItem value={90}>90 days</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={4}>
                <Button
                  variant="contained"
                  color="secondary"
                  onClick={() =>
                    handleAPIRequest("forecast", setForecast, {
                      ticker: stocks.split(",")[0],
                      model_type: forecastModel,
                      forecast_period: forecastPeriod,
                    })
                  }
                  sx={{
                    width: "100%",
                    backgroundColor: darkMode ? "#ff4081" : "#ff80ab",
                    "&:hover": {
                      backgroundColor: darkMode ? "#f50057" : "#ff4081",
                    },
                  }}
                >
                  Run Forecast
                </Button>
              </Grid>
            </Grid>

            {forecast && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
                // @ts-ignore
                style={{ mt: 2 }}
              >
                <ForecastChart data={forecast} />
              </motion.div>
            )}
          </Card>
        )}

        {tabValue === 2 && (
          <Card
            sx={{
              width: "100%",
              boxShadow: darkMode
                ? "0 4px 12px rgba(0, 0, 0, 0.5)"
                : "0 4px 12px rgba(0, 0, 0, 0.1)",
              backgroundColor: darkMode ? "#424242" : "#fff",
              borderRadius: 2,
              p: 3,
            }}
          >
            <Button
              variant="contained"
              color="success"
              onClick={() => handleAPIRequest("market-trend", setRiskMetrics)}
              sx={{
                width: "100%",
                backgroundColor: darkMode ? "#388e3c" : "#4caf50",
                "&:hover": {
                  backgroundColor: darkMode ? "#2e7d32" : "#388e3c",
                },
              }}
            >
              Analyze Risk
            </Button>

            {riskMetrics && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
                // @ts-ignore
                style={{ mt: 2 }}
              >
                <RiskMetrics riskData={riskMetrics} />
              </motion.div>
            )}
          </Card>
        )}

        {tabValue === 3 && (
          <Card
            sx={{
              width: "100%",
              boxShadow: darkMode
                ? "0 4px 12px rgba(0, 0, 0, 0.5)"
                : "0 4px 12px rgba(0, 0, 0, 0.1)",
              backgroundColor: darkMode ? "#424242" : "#fff",
              borderRadius: 2,
              p: 3,
            }}
          >
            <Button
              variant="contained"
              color="warning"
              onClick={() =>
                handleAPIRequest("efficient-frontier", setEfficientFrontier)
              }
              sx={{
                width: "100%",
                backgroundColor: darkMode ? "#f57c00" : "#ff9800",
                "&:hover": {
                  backgroundColor: darkMode ? "#e65100" : "#f57c00",
                },
              }}
            >
              Generate Efficient Frontier
            </Button>

            {efficientFrontier && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
                // @ts-ignore
                style={{ mt: 2 }}
              >
                <EfficientFrontierChart data={efficientFrontier} />
              </motion.div>
            )}
          </Card>
        )}

        <Snackbar
          open={notification.open}
          autoHideDuration={6000}
          onClose={() => setNotification({ ...notification, open: false })}
        >
          <Alert
            onClose={() => setNotification({ ...notification, open: false })}
            // @ts-ignore
            severity={notification.severity}
            sx={{
              position: "fixed",
              top: 20,
              right: 20,
              zIndex: 9999,
              maxWidth: "200px",
              padding: "8px 16px",
              fontSize: "0.875rem",
              borderRadius: "8px",
            }}
          >
            {notification.message}
          </Alert>
        </Snackbar>
      </Container>
    </Box>
  );
}