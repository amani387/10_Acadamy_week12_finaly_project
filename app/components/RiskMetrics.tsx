"use client";
export default function RiskMetrics({ riskData }: { riskData: any }) {
  return (
    <div className="p-4 w-full">
      <h2 className="text-xl font-bold text-center">Market Risk Metrics</h2>
      <div className="flex flex-wrap justify-center">
        {Object.keys(riskData.var_95).map((ticker) => (
          <div key={ticker} className="bg-gray-200 p-3 m-2 rounded shadow-md text-center">
            <h3 className="text-lg font-semibold">{ticker}</h3>
            <p>🔻 <strong>VaR (95%):</strong> {riskData.var_95[ticker].toFixed(4)}</p>
            <p>📈 <strong>Volatility:</strong> {riskData.rolling_volatility[ticker].toFixed(4)}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
