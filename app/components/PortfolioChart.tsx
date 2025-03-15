"use client";

import { Pie } from "react-chartjs-2";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
} from "chart.js";
import {
  Card,
  CardContent,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Box,
  TableFooter,
  TablePagination,
} from "@mui/material";
import { motion } from "framer-motion";

// Register required Chart.js components
ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement
);

export default function PortfolioChart({ data }: { data: any }) {
  // Extract weights and performance metrics
  const weights = data.max_sharpe_portfolio.weights;
  const performance = data.max_sharpe_portfolio.performance;

  // Format data for the pie chart
  const chartData = {
    labels: Object.keys(weights),
    datasets: [
      {
        label: "Portfolio Allocation",
        data: Object.values(weights),
        backgroundColor: [
          "#1976d2", // Primary blue
          "#dc004e", // Red
          "#ff9800", // Amber
          "#4caf50", // Green
          "#9c27b0", // Purple
          "#f44336", // Red
        ],
        hoverOffset: 4,
      },
    ],
  };

  // Table data
  const tableData = Object.entries(weights).map(([ticker, weight]) => ({
    ticker,
    weight: `${(weight * 100).toFixed(2)}%`,
  }));

  return (
    <Card
      sx={{
        maxWidth: "100%",
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
          Optimized Portfolio Allocation
        </Typography>

        <Box
          sx={{
            height: 400,
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
            <Pie data={chartData} />
          </motion.div>
        </Box>

        <Typography
          variant="body1"
          color="text.secondary"
          textAlign="center"
          sx={{ mb: 3 }}
        >
          Expected Return: {(performance[0] * 100).toFixed(2)}% | 
          Volatility: {(performance[1] * 100).toFixed(2)}% | 
          Sharpe Ratio: {performance[2].toFixed(2)}
        </Typography>

        <TableContainer component={Paper} sx={{ mt: 3 }}>
          <Table sx={{ minWidth: 650 }} aria-label="simple table">
            <TableHead>
              <TableRow>
                <TableCell>Asset</TableCell>
                <TableCell align="right">Allocation</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {tableData.map((row: any) => (
                <TableRow
                  key={row.ticker}
                  sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                >
                  <TableCell component="th" scope="row">
                    {row.ticker}
                  </TableCell>
                  <TableCell align="right">{row.weight}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </CardContent>
    </Card>
  );
}