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

export default function EfficientFrontierChart({ data }: { data: any }) {
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
          Efficient Frontier
        </Typography>

        <Box
          sx={{
            height: 500,
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
            <img
              src={`data:image/png;base64,${data.efficient_frontier_image}`}
              alt="Efficient Frontier"
              style={{ maxWidth: "100%", height: "auto" }}
            />
          </motion.div>
        </Box>

        <Typography
          variant="body1"
          color="text.secondary"
          textAlign="center"
          sx={{ mb: 3 }}
        >
          The efficient frontier shows the optimal balance between risk and return for different 
          portfolio allocations. The star indicates the portfolio with the best risk-adjusted returns.
        </Typography>

        <Accordion>
          <AccordionSummary
            expandIcon={<span>+</span>}
            aria-controls="panel1a-content"
            id="panel1a-header"
          >
            <Typography variant="subtitle1">What is the Efficient Frontier?</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Typography>
              The efficient frontier is a concept in portfolio theory that shows all possible 
              combinations of assets that offer the highest expected return for a defined level 
              of risk. Points on this frontier represent optimal portfolios - you can't get 
              higher returns without taking on more risk, and you can't get lower risk without 
              sacrificing returns.
            </Typography>
            <br />
            <Typography>
              The star on the graph represents the portfolio with the maximum Sharpe Ratio, 
              which means it provides the best balance between risk and return based on your 
              selected assets.
            </Typography>
          </AccordionDetails>
        </Accordion>
      </CardContent>
    </Card>
  );
}