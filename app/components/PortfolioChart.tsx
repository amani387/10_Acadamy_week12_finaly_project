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
  Chip,
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from "@mui/material";
import { motion } from "framer-motion";

// Register required Chart.js components
ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, PointElement, LineElement);

export default function PortfolioChart({ data }: { data: any }) {
  const weights = data.max_sharpe_portfolio.weights;
  const performance = data.max_sharpe_portfolio.performance;

  const chartData = {
    labels: Object.keys(weights),
    datasets: [
      {
        label: "Portfolio Allocation",
        data: Object.values(weights),
        backgroundColor: ["#1976d2", "#dc004e", "#ff9800"],
        hoverOffset: 4,
      },
    ],
  };

  const tableData = Object.entries(weights).map(([ticker, weight]) => ({
    ticker,
    // @ts-ignore
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
          <strong>Expected Return:</strong> {(performance[0] * 100).toFixed(2)}% |
          <strong> Volatility:</strong> {(performance[1] * 100).toFixed(2)}% |
          <strong> Sharpe Ratio:</strong> {performance[2].toFixed(2)}
        </Typography>

        <Accordion>
          <AccordionSummary
            expandIcon={<span>+</span>}
            aria-controls="panel1a-content"
            id="panel1a-header"
          >
            <Typography variant="subtitle1">What does this mean?</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Typography>
              <strong>Portfolio Optimization</strong> is the process of selecting the best possible 
              combination of assets to maximize returns for a given level of risk. Your optimized 
              portfolio is designed to provide the best possible balance between potential returns 
              and risk based on historical data.
            </Typography>
            <br />
            <Typography>
              <strong>Expected Return:</strong> This is the average return you can expect from 
              this portfolio based on historical performance.
            </Typography>
            <br />
            <Typography>
              <strong>Volatility:</strong> This measures how much the portfolio's returns can 
              vary. Higher volatility means greater risk.
            </Typography>
            <br />
            <Typography>
              <strong>Sharpe Ratio:</strong> This measures the performance of the portfolio 
              after adjusting for its risk. Higher values indicate better risk-adjusted returns.
            </Typography>
          </AccordionDetails>
        </Accordion>

        <TableContainer component={Paper} sx={{ mt: 3 }}>
          <Table sx={{ minWidth: 650 }} aria-label="simple table">
            <TableHead>
              <TableRow>
                <TableCell>Asset</TableCell>
                <TableCell align="right">Recommended Allocation</TableCell>
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