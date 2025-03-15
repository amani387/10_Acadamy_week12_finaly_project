"use client";

import { Card, CardContent, Typography, Grid } from "@mui/material";

export default function RiskMetrics({ riskData }: { riskData: any }) {
  return (
    <Grid container spacing={3} justifyContent="center" sx={{ marginTop: 3 }}>
      {Object.keys(riskData.var_95).map((ticker) => (
        <Grid item key={ticker} xs={12} sm={6} md={4}>
          <Card sx={{ boxShadow: 3, borderRadius: 2, backgroundColor: "#f5f5f5" }}>
            <CardContent>
              <Typography variant="h6" fontWeight="bold" color="primary" textAlign="center">
                {ticker}
              </Typography>
              <Typography variant="body1" textAlign="center" color="text.secondary">
                🔻 <strong>VaR (95%):</strong> {riskData.var_95[ticker].toFixed(4)}
              </Typography>
              <Typography variant="body1" textAlign="center" color="text.secondary">
                📈 <strong>Volatility:</strong> {riskData.rolling_volatility[ticker].toFixed(4)}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      ))}
    </Grid>
  );
}
