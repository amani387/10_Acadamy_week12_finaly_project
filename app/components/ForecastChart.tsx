"use client";

import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  LineElement,
  PointElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  Filler,
} from "chart.js";
import {
  Card,
  CardContent,
  Typography,
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from "@mui/material";
import { motion } from "framer-motion";

// Register required Chart.js components
ChartJS.register(
  LineElement,
  PointElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  Filler
);

export default function ForecastChart({ data }: { data: any }) {
  const forecast = data.predictions;
  const confidenceInterval = data.confidence_interval
    ? {
        lower: data.confidence_interval_lower,
        upper: data.confidence_interval_upper,
      }
    : null;

  const labels = Array.from({ length: forecast.length }, (_, i) => `Day ${i + 1}`);

  const chartData = {
    labels,
    datasets: [
      {
        label: "Forecasted Price",
        data: forecast,
        borderColor: "#1976d2",
        backgroundColor: "rgba(25, 118, 210, 0.1)",
        fill: confidenceInterval ? "origin" : false,
        borderWidth: 2,
        tension: 0.4,
        pointRadius: 3,
        pointHoverRadius: 5,
      },
    ],
  };

  if (confidenceInterval) {
    chartData.datasets.push(
      {
        label: "Confidence Interval",
        data: confidenceInterval.lower,
        borderColor: "transparent",
        backgroundColor: "rgba(231, 76, 60, 0.1)",
        fill: false,
        // @ts-ignore
        borderDash: [5, 5],
        borderWidth: 1,
      },
      {
        label: "Confidence Interval",
        data: confidenceInterval.upper,
        borderColor: "transparent",
        backgroundColor: "rgba(46, 204, 113, 0.1)",
        fill: "tonal",
        borderDash: [5, 5],
        borderWidth: 1,
      }
    );
  }

  const tableData = labels.map((label: string, index: number) => ({
    day: label,
    forecast: forecast[index].toFixed(2),
    ...(confidenceInterval
      ? {
          lower: confidenceInterval.lower[index].toFixed(2),
          upper: confidenceInterval.upper[index].toFixed(2),
        }
      : {}),
  }));

  return (
    <Card
      sx={{
        width: "100%",
        margin: "auto",
        boxShadow: 3,
        borderRadius: 2,
        backgroundColor: "background.default",
      }}
    >
      <CardContent>
        <Typography
          variant="h6"
          fontWeight="bold"
          color="primary"
          textAlign="center"
          sx={{ mb: 3 }}
        >
          Stock Forecast
        </Typography>

        <Box
          sx={{
            height: 600,
            position: "relative",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            mb: 3,
          }}
        >
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <Line
              data={chartData}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                interaction: {
                  mode: "index",
                  intersect: false,
                },
                plugins: {
                  tooltip: {
                    enabled: true,
                    mode: "index",
                    callbacks: {
                      label: function (context) {
                        let label = context.dataset.label || "";
                        if (label) {
                          label += ": ";
                        }
                        if (context.dataset.label === "Forecasted Price") {
                          label += new Intl.NumberFormat("en-US", {
                            style: "currency",
                            currency: "USD",
                            // @ts-ignore
                          }).format(context.raw);
                        } else {
                          label += new Intl.NumberFormat("en-US", {
                            style: "currency",
                            currency: "USD",
                            // @ts-ignore
                          }).format(context.raw);
                        }
                        return label;
                      },
                    },
                  },
                  legend: {
                    position: "top",
                  },
                },
                scales: {
                  y: {
                    beginAtZero: false,
                    title: {
                      display: true,
                      text: "Price",
                    },
                  },
                  x: {
                    title: {
                      display: true,
                      text: "Forecast Days",
                    },
                  },
                },
              }}
            />
          </motion.div>
        </Box>

        {confidenceInterval && (
          <Box sx={{ mb: 3, display: "flex", justifyContent: "center" }}>
            <Chip
              label="Confidence Interval"
              color="primary"
              sx={{ mr: 1 }}
            />
            <Typography variant="body2" color="text.secondary">
              The shaded area represents the range within which we expect the actual price to fall 
              with 95% confidence.
            </Typography>
          </Box>
        )}

        <Typography
          variant="body1"
          color="text.secondary"
          textAlign="center"
          sx={{ mb: 3 }}
        >
          Model: {data.model} | Forecast Period: {data.forecast_period} days
        </Typography>

        <Accordion>
          <AccordionSummary
            expandIcon={<span>+</span>}
            aria-controls="panel1a-content"
            id="panel1a-header"
          >
            <Typography variant="subtitle1">Understanding Your Forecast</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Typography>
              This forecast shows the expected price movement of the stock over the next {data.forecast_period} days. 
              The main line represents our best estimate of future prices based on historical data and the selected model.
            </Typography>
            <br />
            {confidenceInterval && (
              <Typography>
                The shaded area (confidence interval) shows the range within which we expect the actual price to fall 
                with 95% confidence. This helps you understand the uncertainty in the forecast.
              </Typography>
            )}
            <br />
            <Typography>
              Remember that forecasts are not guarantees, but rather educated estimates based on historical patterns. 
              Market conditions can change, and actual results may differ.
            </Typography>
          </AccordionDetails>
        </Accordion>

        <TableContainer component={Paper} sx={{ mt: 3 }}>
          <Table sx={{ minWidth: 650 }} aria-label="simple table">
            <TableHead>
              <TableRow>
                <TableCell>Day</TableCell>
                <TableCell align="right">Forecasted Price</TableCell>
                {confidenceInterval && (
                  <>
                    <TableCell align="right">Lower Estimate</TableCell>
                    <TableCell align="right">Upper Estimate</TableCell>
                  </>
                )}
              </TableRow>
            </TableHead>
            <TableBody>
              {tableData.map((row: any, index: number) => (
                <TableRow key={index}>
                  <TableCell component="th" scope="row">
                    {row.day}
                  </TableCell>
                  <TableCell align="right">
                    {new Intl.NumberFormat("en-US", {
                      style: "currency",
                      currency: "USD",
                    }).format(parseFloat(row.forecast))}
                  </TableCell>
                  {confidenceInterval && (
                    <>
                      <TableCell align="right">
                        {new Intl.NumberFormat("en-US", {
                          style: "currency",
                          currency: "USD",
                        }).format(parseFloat(row.lower))}
                      </TableCell>
                      <TableCell align="right">
                        {new Intl.NumberFormat("en-US", {
                          style: "currency",
                          currency: "USD",
                        }).format(parseFloat(row.upper))}
                      </TableCell>
                    </>
                  )}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </CardContent>
    </Card>
  );
}