from flask import Flask, request, jsonify
from flask_cors import CORS
import yfinance as yf
import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
import seaborn as sns
from statsmodels.tsa.arima.model import ARIMA
from statsmodels.tsa.statespace.sarimax import SARIMAX
from statsmodels.tsa.seasonal import seasonal_decompose
from sklearn.preprocessing import MinMaxScaler
import tensorflow as tf
from tensorflow.keras.models import Sequential
from tensorflow.keras.layers import LSTM, Dense
import scipy.optimize as sco

app = Flask(__name__)
CORS(app)  # Allow frontend access

# 📌 Fetch stock data
def fetch_stock_data(tickers):
    data = yf.download(tickers, start="2015-01-01", end="2025-01-01")
    return data["Close"]

@app.route("/api/analyze", methods=["POST"])
def analyze():
    try:
        tickers = request.json["stocks"]
        data = fetch_stock_data(tickers)
        data.fillna(method="ffill", inplace=True)  # Fill missing values

        # Rolling Mean & Std Dev
        rolling_means = data.rolling(window=30).mean()

        # Seasonal Decomposition
        decomposition = seasonal_decompose(data["TSLA"], model="additive", period=365)
        
        return jsonify({"message": "EDA completed!"})

    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route("/api/forecast", methods=["POST"])
def forecast():
    try:
        tickers = request.json["stocks"]
        data = fetch_stock_data(tickers)
        train_size = int(len(data["TSLA"]) * 0.85)
        train, test = data["TSLA"][:train_size], data["TSLA"][train_size:]

        # ARIMA Model
        arima_model = ARIMA(train, order=(5,1,0))
        arima_result = arima_model.fit()
        test_predictions_arima = arima_result.forecast(steps=len(test))

        return jsonify({"forecast": test_predictions_arima.tolist()})

    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route("/api/optimize", methods=["POST"])
def optimize():
    try:
        tickers = request.json["stocks"]
        data = fetch_stock_data(tickers)
        daily_returns = data.pct_change().dropna()

        expected_returns = daily_returns.mean() * 252
        cov_matrix = daily_returns.cov() * 252

        def portfolio_performance(weights):
            returns = np.dot(weights, expected_returns)
            volatility = np.sqrt(np.dot(weights.T, np.dot(cov_matrix, weights)))
            sharpe_ratio = returns / volatility
            return -sharpe_ratio  # Minimize negative Sharpe Ratio

        constraints = ({'type': 'eq', 'fun': lambda weights: np.sum(weights) - 1})
        bounds = tuple((0, 1) for _ in range(len(tickers)))
        initial_weights = np.array([1/len(tickers)] * len(tickers))

        optimized_result = sco.minimize(portfolio_performance, initial_weights,
                                        method='SLSQP', bounds=bounds, constraints=constraints)

        optimized_weights = optimized_result.x
        return jsonify({tickers[i]: round(optimized_weights[i], 2) for i in range(len(tickers))})

    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == "__main__":
    app.run(debug=True, port=5000)
