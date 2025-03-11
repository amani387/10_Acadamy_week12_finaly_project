"use client";

export default function RiskMetrics({ riskData }: { riskData: any }) {
  return (
    <div className="risk-metrics-container">
      <h2 className="risk-metrics-title">Market Risk Metrics</h2>
      <div className="metrics-wrapper">
        {Object.keys(riskData.var_95).map((ticker) => (
          <div key={ticker} className="metric-card">
            <h3>{ticker}</h3>
            <p>
              🔻 <strong>VaR (95%):</strong> {riskData.var_95[ticker].toFixed(4)}
            </p>
            <p>
              📈 <strong>Volatility:</strong> {riskData.rolling_volatility[ticker].toFixed(4)}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
