"use client";
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

export default function RiskMetrics({ riskData }: { riskData: any }) {
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
          Risk Analysis
        </Typography>

        <TableContainer component={Paper} sx={{ mt: 3 }}>
          <Table sx={{ minWidth: 650 }} aria-label="simple table">
            <TableHead>
              <TableRow>
                <TableCell>Stock</TableCell>
                <TableCell align="right">Value at Risk (VaR)</TableCell>
                <TableCell align="right">Conditional VaR (CVaR)</TableCell>
                <TableCell align="right">30-Day Volatility</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {Object.entries(riskData.var_95).map(([ticker, varValue]) => (
                <TableRow key={ticker}>
                  <TableCell component="th" scope="row">
                    {ticker}
                  </TableCell>
                  <TableCell align="right">
                    {new Intl.NumberFormat("en-US", {
                      style: "currency",
                      currency: "USD",
                      // @ts-ignore
                    }).format(varValue)}
                  </TableCell>
                  <TableCell align="right">
                    {new Intl.NumberFormat("en-US", {
                      style: "currency",
                      currency: "USD",
                    }).format(riskData.cvar_95[ticker])}
                  </TableCell>
                  <TableCell align="right">
                    {(riskData.rolling_volatility[ticker] * 100).toFixed(2)}%
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        <Accordion sx={{ mt: 3 }}>
          <AccordionSummary
            expandIcon={<span>+</span>}
            aria-controls="panel1a-content"
            id="panel1a-header"
          >
            <Typography variant="subtitle1">Understanding Risk Metrics</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Typography>
              <strong>Value at Risk (VaR):</strong> This represents the maximum potential loss 
              you could expect with 95% confidence over a one-day period. In other words, there's 
              a 5% chance the loss could be greater than this amount.
            </Typography>
            <br />
            <Typography>
              <strong>Conditional Value at Risk (CVaR):</strong> This measures the average loss 
              that could occur in the worst 5% of cases. It gives you an idea of how bad things 
              could get in extreme market conditions.
            </Typography>
            <br />
            <Typography>
              <strong>Volatility:</strong> This shows how much the stock's price has fluctuated 
              over the past 30 days. Higher volatility means greater uncertainty and risk.
            </Typography>
          </AccordionDetails>
        </Accordion>
      </CardContent>
    </Card>
  );
}