from flask import Flask, request, jsonify
from flask_cors import CORS
import yfinance as yf
import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
import seaborn as sns
from statsmodels.tsa.arima.model import ARIMA
from statsmodels.tsa.seasonal import seasonal_decompose
from statsmodels.tsa.stattools import adfuller
from sklearn.metrics import mean_absolute_error, mean_squared_error
from math import sqrt
import scipy.optimize as sco
from scipy.stats import norm
import tensorflow as tf
from tensorflow.keras.models import Sequential
from tensorflow.keras.layers import LSTM, Dense
from sklearn.preprocessing import MinMaxScaler
import warnings
import logging
import io
import base64

# Suppress warnings for cleaner logs
warnings.filterwarnings('ignore')

# Configure logging
logging.basicConfig(level=logging.INFO)

app = Flask(__name__)
CORS(app)  # Allow cross-origin requests

# ---------------------------
# HELPER FUNCTIONS
# ---------------------------

def fetch_stock_data(tickers, start="2015-01-01", end="2025-01-01"):
    """Fetch historical closing prices from Yahoo Finance."""
    data = yf.download(tickers, start=start, end=end)
    if data.empty:
        raise ValueError("No data fetched. Please check the tickers and dates.")
    return data["Close"]

def check_stationarity(timeseries):
    """Perform Augmented Dickey-Fuller test and print results."""
    result = adfuller(timeseries.dropna())
    return {
        "ADF Statistic": result[0],
        "p-value": result[1],
        "Critical Values": result[4]
    }

def create_sequences(data, window=60):
    """Convert time series data into sequences for LSTM training."""
    X, y = [], []
    for i in range(len(data) - window):
        X.append(data[i:i + window])
        y.append(data[i + window])
    return np.array(X), np.array(y)

# ---------------------------
# ENDPOINTS
# ---------------------------

# Endpoint 1: Data Analysis & EDA
@app.route("/api/analyze", methods=["POST"])
def analyze():
    try:
        tickers = [ticker.strip() for ticker in request.json.get("stocks", []) if ticker.strip()]
        if not tickers:
            return jsonify({"error": "No valid stocks provided."}), 400

        data = fetch_stock_data(tickers)
        data.fillna(method="ffill", inplace=True)

        # Compute rolling mean & seasonal decomposition for TSLA if available
        analysis_results = {}
        if "TSLA" in tickers:
            rolling_mean = data["TSLA"].rolling(window=30).mean().to_dict()
            decomposition = seasonal_decompose(data["TSLA"], model="multiplicative", period=252)
            # For brevity, we only include the trend component summary here.
            trend = decomposition.trend.dropna().to_dict()
            analysis_results["TSLA"] = {"rolling_mean": rolling_mean, "trend": trend}
        
        # Return a simple message and optional analysis summary
        return jsonify({"message": "EDA completed!", "analysis": analysis_results})
    except Exception as e:
        logging.exception("Error in /api/analyze")
        return jsonify({"error": str(e)}), 500

# Endpoint 2: ARIMA Forecasting with Confidence Intervals
@app.route("/api/forecast", methods=["POST"])
def forecast():
    try:
        tickers = [ticker.strip() for ticker in request.json.get("stocks", []) if ticker.strip()]
        if not tickers:
            return jsonify({"error": "No valid stock tickers provided."}), 400

        ticker = tickers[0]
        df = yf.download(ticker, start="2015-01-01", end="2025-01-01")

        if df.empty:
            return jsonify({"error": f"No data found for ticker {ticker}."}), 400

        data = df["Close"].dropna()  # Ensure using closing price

        train_size = int(len(data) * 0.85)
        train, test = data[:train_size], data[train_size:]

        # Fit ARIMA model
        model = ARIMA(train, order=(5, 1, 0))
        model_fit = model.fit()
        forecast_values = model_fit.forecast(steps=len(test))

        # Ensure forecast_values is a NumPy array
        forecast_values = np.array(forecast_values)

        # Compute standard error for confidence intervals
        if len(test) > 0:
            std_err = np.std(forecast_values - test.values)
            lower_bound = forecast_values - 1.96 * std_err
            upper_bound = forecast_values + 1.96 * std_err
        else:
            lower_bound = forecast_values
            upper_bound = forecast_values

        return jsonify({
            "ticker": ticker,
            "forecast": forecast_values.tolist(),
            "lower_bound": lower_bound.tolist(),
            "upper_bound": upper_bound.tolist()
        })
    except Exception as e:
        logging.exception("Error in /api/forecast")
        return jsonify({"error": str(e)}), 500

# Endpoint 3: Market Trend Analysis & Risk Metrics (VaR and Rolling Volatility)
@app.route("/api/market-trend", methods=["POST"])
def market_trend():
    try:
        tickers = [ticker.strip() for ticker in request.json.get("stocks", []) if ticker.strip()]
        if not tickers:
            return jsonify({"error": "No valid stocks provided."}), 400

        data = fetch_stock_data(tickers)
        daily_returns = data.pct_change().dropna()

        var_95 = daily_returns.quantile(0.05)
        rolling_volatility = daily_returns.rolling(window=30).std().iloc[-1]

        return jsonify({
            "var_95": var_95.to_dict(),
            "rolling_volatility": rolling_volatility.to_dict()
        })
    except Exception as e:
        logging.exception("Error in /api/market-trend")
        return jsonify({"error": str(e)}), 500

# Endpoint 4: Portfolio Optimization (Maximizing Sharpe Ratio)
@app.route("/api/optimize", methods=["POST"])
def optimize():
    try:
        tickers = request.json.get("stocks", [])
        tickers = [ticker.strip() for ticker in tickers if ticker.strip()]
        if not tickers:
            return jsonify({"error": "No valid stocks provided."}), 400

        stock_data = fetch_stock_data(tickers)
        daily_returns = stock_data.pct_change().dropna()
        expected_returns = daily_returns.mean() * 252
        cov_matrix = daily_returns.cov() * 252

        def portfolio_performance(weights):
            port_return = np.dot(weights, expected_returns)
            port_vol = np.sqrt(np.dot(weights.T, np.dot(cov_matrix, weights)))
            sharpe_ratio = port_return / port_vol
            return port_return, port_vol, sharpe_ratio

        def neg_sharpe_ratio(weights, expected_returns, cov_matrix):
            returns, volatility, sharpe_ratio = portfolio_performance(weights)
            return -sharpe_ratio

        constraints = {"type": "eq", "fun": lambda w: np.sum(w) - 1}
        bounds = tuple((0, 1) for _ in tickers)
        initial_weights = np.array([1/len(tickers)] * len(tickers))

        result = sco.minimize(neg_sharpe_ratio, initial_weights, args=(expected_returns, cov_matrix),  
                              method="SLSQP", bounds=bounds, constraints=constraints)
        optimized_weights = result.x

        return jsonify({ticker: round(weight, 4) for ticker, weight in zip(tickers, optimized_weights)})
    except Exception as e:
        logging.exception("Error in /api/optimize")
        return jsonify({"error": str(e)}), 500

@app.route("/api/efficient-frontier", methods=["POST"])
def efficient_frontier():
    try:
        tickers = [ticker.strip() for ticker in request.json.get("stocks", []) if ticker.strip()]
        if not tickers:
            return jsonify({"error": "No valid stocks provided."}), 400

        # Fetch data and compute portfolio optimization metrics (expected returns, covariance, etc.)
        stock_data = fetch_stock_data(tickers)
        daily_returns = stock_data.pct_change().dropna()
        expected_returns = daily_returns.mean() * 252
        cov_matrix = daily_returns.cov() * 252

        # Simulate random portfolios for the efficient frontier
        num_portfolios = 10000
        ret_arr = np.zeros(num_portfolios)
        vol_arr = np.zeros(num_portfolios)
        sharpe_arr = np.zeros(num_portfolios)
        
        for i in range(num_portfolios):
            weights = np.random.random(len(tickers))
            weights /= np.sum(weights)
            ret_arr[i] = np.dot(weights, expected_returns)
            vol_arr[i] = np.sqrt(np.dot(weights.T, np.dot(cov_matrix, weights)))
            sharpe_arr[i] = ret_arr[i] / vol_arr[i]

        # Plot efficient frontier
        fig, ax = plt.subplots(figsize=(12, 6))
        sc = ax.scatter(vol_arr, ret_arr, c=sharpe_arr, cmap='viridis', marker='o', s=10, alpha=0.3)
        plt.colorbar(sc, label='Sharpe Ratio')
        ax.set_xlabel('Volatility')
        ax.set_ylabel('Expected Return')
        ax.set_title('Efficient Frontier')
        plt.tight_layout()

        # Save plot to a bytes buffer and encode as Base64
        buf = io.BytesIO()
        plt.savefig(buf, format="png")
        buf.seek(0)
        img_base64 = base64.b64encode(buf.getvalue()).decode("utf-8")
        buf.close()
        plt.close(fig)

        return jsonify({"efficient_frontier_image": img_base64})
    except Exception as e:
        return jsonify({"error": str(e)}), 500
if __name__ == "__main__":
    app.run(debug=True, port=5000)
