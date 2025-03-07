from flask import Flask, request, jsonify
from flask_cors import CORS
import yfinance as yf
import pandas as pd
import numpy as np
from statsmodels.tsa.arima.model import ARIMA
from statsmodels.tsa.statespace.sarimax import SARIMAX
from statsmodels.tsa.seasonal import seasonal_decompose
from sklearn.preprocessing import MinMaxScaler
import scipy.optimize as sco
from scipy.stats import norm

app = Flask(__name__)
CORS(app)  # Allow frontend access

# 📌 Fetch stock data
def fetch_stock_data(tickers):
    data = yf.download(tickers, start="2015-01-01", end="2025-01-01")
    return data["Close"]

# 📌 EDA & Preprocessing
@app.route("/api/analyze", methods=["POST"])
def analyze():
    try:
        tickers = request.json["stocks"]
        data = fetch_stock_data(tickers)
        data.fillna(method="ffill", inplace=True)  # Fill missing values

        # Compute rolling mean & standard deviation
        rolling_means = data.rolling(window=30).mean()

        # Seasonal Decomposition for TSLA
        decomposition = seasonal_decompose(data["TSLA"], model="additive", period=365)

        return jsonify({"message": "EDA completed!"})

    except Exception as e:
        return jsonify({"error": str(e)}), 500

# 📌 Time Series Forecasting with Confidence Intervals
@app.route("/api/forecast", methods=["POST"])
def forecast():
    try:
        # Filter out any empty ticker values
        tickers = [ticker.strip() for ticker in request.json["stocks"] if ticker.strip()]
        if not tickers:
            return jsonify({"error": "No valid stock tickers provided."}), 400

        # We will only forecast for one ticker at a time for now (e.g., TSLA)
        # You can extend this logic for multiple tickers later if needed.
        ticker = tickers[0]
        data = yf.download([ticker], start="2015-01-01", end="2025-01-01")[ticker].dropna()

        # Check if data is empty
        if data.empty:
            return jsonify({"error": f"No data found for ticker {ticker}."}), 400

        train_size = int(len(data) * 0.85)
        train, test = data[:train_size], data[train_size:]

        # ARIMA Model
        arima_model = ARIMA(train, order=(5, 1, 0))
        arima_result = arima_model.fit()
        forecast_values = arima_result.forecast(steps=len(test))

        # Compute standard error for forecast to get confidence intervals
        std_err = np.std(forecast_values - test.values)
        lower_bound = forecast_values - 1.96 * std_err
        upper_bound = forecast_values + 1.96 * std_err

        return jsonify({
            "forecast": forecast_values.tolist(),
            "lower_bound": lower_bound.tolist(),
            "upper_bound": upper_bound.tolist()
        })

    except Exception as e:
        return jsonify({"error": str(e)}), 500

# 📌 Market Trend Analysis & Risk Metrics (VaR & Volatility)
@app.route("/api/market-trend", methods=["POST"])
def market_trend():
    try:
        tickers = request.json["stocks"]
        data = fetch_stock_data(tickers)
        daily_returns = data.pct_change().dropna()

        # Compute Value at Risk (VaR 95%)
        var_95 = daily_returns.quantile(0.05)

        # Compute rolling volatility (last 30 days)
        rolling_volatility = daily_returns.rolling(window=30).std().iloc[-1]

        return jsonify({
            "var_95": var_95.to_dict(),
            "rolling_volatility": rolling_volatility.to_dict()
        })

    except Exception as e:
        return jsonify({"error": str(e)}), 500

# 📌 Portfolio Optimization with Dynamic Rebalancing
@app.route("/api/optimize", methods=["POST"])
def optimize():
    try:
        data = request.get_json()
        tickers = data.get("stocks", [])

        if not tickers:
            return jsonify({"error": "No stocks provided"}), 400

        # Fetch stock data
        stock_data = fetch_stock_data(tickers)
        daily_returns = stock_data.pct_change().dropna()

        # Compute expected returns & covariance matrix
        expected_returns = daily_returns.mean() * 252
        cov_matrix = daily_returns.cov() * 252

        # Optimization function
        def portfolio_performance(weights):
            returns = np.dot(weights, expected_returns)
            volatility = np.sqrt(np.dot(weights.T, np.dot(cov_matrix, weights)))
            sharpe_ratio = returns / volatility
            return returns, volatility, sharpe_ratio

        # Objective function (negative Sharpe ratio)
        def neg_sharpe_ratio(weights):
            return -portfolio_performance(weights)[2]

        # Constraints & bounds
        constraints = ({"type": "eq", "fun": lambda w: np.sum(w) - 1})
        bounds = tuple((0, 1) for _ in tickers)

        # Initial weights (equal split)
        initial_weights = np.array([1 / len(tickers)] * len(tickers))

        # Optimize portfolio allocation
        result = sco.minimize(
            neg_sharpe_ratio, initial_weights, method="SLSQP", bounds=bounds, constraints=constraints
        )

        optimized_weights = result.x

        # Return results
        return jsonify({ticker: round(weight, 4) for ticker, weight in zip(tickers, optimized_weights)})

    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == "__main__":
    app.run(debug=True, port=5000)
