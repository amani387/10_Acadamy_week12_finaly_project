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
CORS(app,resources={r"/*": {"origins": "*"}})  # Allow cross-origin requests

# ---------------------------
# HELPER FUNCTIONS
# ---------------------------

def portfolio_volatility(weights, expected_returns, cov_matrix):
    """
    Calculate portfolio volatility.
    
    Parameters:
    weights (np.array): Portfolio weights
    expected_returns (pd.Series): Expected annual returns
    cov_matrix (pd.DataFrame): Annual covariance matrix
    
    Returns:
    float: Portfolio volatility
    """
    return portfolio_annualized_performance(weights, expected_returns, cov_matrix)[1]
def negative_sharpe_ratio(weights, expected_returns, cov_matrix):
    """
    Calculate the negative Sharpe ratio for optimization.
    
    Parameters:
    weights (np.array): Portfolio weights
    expected_returns (pd.Series): Expected annual returns
    cov_matrix (pd.DataFrame): Annual covariance matrix
    
    Returns:
    float: Negative Sharpe ratio
    """
    ret, vol, sharpe = portfolio_annualized_performance(weights, expected_returns, cov_matrix)
    return -sharpe
def fetch_and_preprocess_data(tickers, start_date="2015-01-01", end_date="2025-01-01"):
    """
    Fetches and preprocesses financial data for the given tickers.
    
    Parameters:
    tickers (list): List of stock tickers to fetch
    start_date (str): Start date for historical data
    end_date (str): End date for historical data
    
    Returns:
    pd.DataFrame: Cleaned and processed dataframe with historical data
    """
    # Fetch data using yfinance
    data = yf.download(tickers, start=start_date, end=end_date)
    
    # Check if data was successfully fetched
    if data.empty:
        raise ValueError(f"No data fetched for tickers {tickers}. Please check the stock tickers.")
    
    # Select only the 'Close' prices and handle missing values
    close_prices = data["Close"].copy()
    
    # Fill missing values using forward fill
    close_prices.fillna(method="ffill", inplace=True)
    
    # Fill remaining missing values with backward fill
    close_prices.fillna(method="bfill", inplace=True)
    
    # Check for any remaining missing values
    if close_prices.isnull().values.any():
        logging.warning("Some missing values remain after filling.")
    
    # Convert index to datetime
    close_prices.index = pd.to_datetime(close_prices.index)
    
    return close_prices

def perform_eda(data, tickers):
    """
    Perform exploratory data analysis on the given financial data.
    
    Parameters:
    data (pd.DataFrame): Cleaned financial data
    tickers (list): List of stock tickers
    
    Returns:
    dict: Dictionary containing EDA results
    """
    eda_results = {}
    
    for ticker in tickers:
        if ticker not in data.columns:
            continue
        
        # Basic statistics
        stats = data[ticker].describe().to_dict()
        
        # Rolling metrics
        rolling_mean = data[ticker].rolling(window=30).mean()
        rolling_std = data[ticker].rolling(window=30).std()
        
        # Calculate returns
        returns = data[ticker].pct_change().dropna()
        
        # Stationarity test
        stationarity = check_stationarity(data[ticker])
        
        # Seasonal decomposition
        decomposition = seasonal_decompose(data[ticker], model="multiplicative", period=252)
        trend = decomposition.trend
        seasonal = decomposition.seasonal
        residual = decomposition.resid
        
        # Volatility clustering
        volatility_clustering = (returns.rolling(window=30).std() * np.sqrt(252)).dropna()
        
        # Store results
        eda_results[ticker] = {
            "basic_stats": stats,
            "rolling_mean": rolling_mean.to_dict(),
            "rolling_std": rolling_std.to_dict(),
            "returns": returns.to_dict(),
            "stationarity": stationarity,
            "trend": trend.dropna().to_dict(),
            "seasonal": seasonal.dropna().to_dict(),
            "residual": residual.dropna().to_dict(),
            "volatility_clustering": volatility_clustering.to_dict()
        }
    
    return eda_results

def optimize_arima_params(series, max_p=5, max_d=2, max_q=5):
    """
    Find optimal ARIMA parameters using AIC criterion.
    
    Parameters:
    series (pd.Series): Time series data
    max_p (int): Maximum p value to test
    max_d (int): Maximum d value to test
    max_q (int): Maximum q value to test
    
    Returns:
    tuple: Optimal (p, d, q) parameters
    """
    best_aic = float("inf")
    best_params = (0, 0, 0)
    
    for p in range(max_p + 1):
        for d in range(max_d + 1):
            for q in range(max_q + 1):
                try:
                    model = ARIMA(series, order=(p, d, q))
                    model_fit = model.fit()
                    
                    if model_fit.aic < best_aic:
                        best_aic = model_fit.aic
                        best_params = (p, d, q)
                except:
                    continue
    
    return best_params

def optimize_sarima_params(series, max_p=2, max_d=1, max_q=2, 
                          max_P=1, max_D=1, max_Q=1, max_m=12):
    """
    Find optimal SARIMA parameters using AIC criterion.
    
    Parameters:
    series (pd.Series): Time series data
    max_p (int): Maximum non-seasonal p value
    max_d (int): Maximum non-seasonal d value
    max_q (int): Maximum non-seasonal q value
    max_P (int): Maximum seasonal P value
    max_D (int): Maximum seasonal D value
    max_Q (int): Maximum seasonal Q value
    max_m (int): Maximum seasonal period
    
    Returns:
    tuple: Optimal (p, d, q, P, D, Q, m) parameters
    """
    best_aic = float("inf")
    best_params = (0, 0, 0, 0, 0, 0, 0)
    
    for p in range(max_p + 1):
        for d in range(max_d + 1):
            for q in range(max_q + 1):
                for P in range(max_P + 1):
                    for D in range(max_D + 1):
                        for Q in range(max_Q + 1):
                            for m in [12, 24, 252]:  # Common financial periods
                                try:
                                    model = SARIMAX(series, 
                                                  order=(p, d, q),
                                                  seasonal_order=(P, D, Q, m))
                                    model_fit = model.fit(disp=False)
                                    
                                    if model_fit.aic < best_aic:
                                        best_aic = model_fit.aic
                                        best_params = (p, d, q, P, D, Q, m)
                                except:
                                    continue
    
    return best_params

def create_lstm_model(window_size, features):
    """
    Create an LSTM model for time series forecasting.
    
    Parameters:
    window_size (int): Number of time steps to use for prediction
    features (int): Number of features in the input data
    
    Returns:
    Sequential: Compiled LSTM model
    """
    model = Sequential()
    model.add(LSTM(50, return_sequences=True, input_shape=(window_size, features)))
    model.add(LSTM(50, return_sequences=False))
    model.add(Dense(25))
    model.add(Dense(1))
    
    model.compile(optimizer='adam', loss='mean_squared_error')
    return model

def calculate_var(returns, confidence_level=0.95):
    """
    Calculate Value at Risk using historical simulation method.
    
    Parameters:
    returns (pd.Series): Historical returns
    confidence_level (float): Confidence level for VaR calculation
    
    Returns:
    float: VaR value
    """
    return -np.percentile(returns, 100 * (1 - confidence_level))

def calculate_cvar(returns, confidence_level=0.95):
    """
    Calculate Conditional Value at Risk.
    
    Parameters:
    returns (pd.Series): Historical returns
    confidence_level (float): Confidence level for CVaR calculation
    
    Returns:
    float: CVaR value
    """
    var = calculate_var(returns, confidence_level)
    cvar = returns[returns <= -var].mean()
    return -cvar

def portfolio_annualized_performance(weights, expected_returns, cov_matrix):
    """
    Calculate annualized performance metrics for a portfolio.
    
    Parameters:
    weights (np.array): Portfolio weights
    expected_returns (pd.Series): Expected annual returns
    cov_matrix (pd.DataFrame): Annual covariance matrix
    
    Returns:
    tuple: (return, volatility, sharpe_ratio)
    """
    ret = np.dot(weights, expected_returns)
    vol = np.sqrt(np.dot(weights.T, np.dot(cov_matrix, weights)))
    sharpe = ret / vol
    return ret, vol, sharpe

def maximize_sharpe_ratio(expected_returns, cov_matrix):
    """
    Find the portfolio weights that maximize the Sharpe ratio.
    
    Parameters:
    expected_returns (pd.Series): Expected annual returns
    cov_matrix (pd.DataFrame): Annual covariance matrix
    
    Returns:
    np.array: Optimal portfolio weights
    """
    num_assets = len(expected_returns)
    args = (expected_returns, cov_matrix)
    constraints = ({'type': 'eq', 'fun': lambda x: np.sum(x) - 1})
    bounds = tuple((0, 1) for _ in range(num_assets))
    initial_guess = num_assets * [1. / num_assets,]
    
    result = sco.minimize(negative_sharpe_ratio, 
                          initial_guess,
                          args=args,
                          method='SLSQP',
                          bounds=bounds,
                          constraints=constraints)
    return result.x
def minimum_volatility_portfolio(expected_returns, cov_matrix):
    """
    Find the portfolio weights that minimize volatility.
    
    Parameters:
    expected_returns (pd.Series): Expected annual returns
    cov_matrix (pd.DataFrame): Annual covariance matrix
    
    Returns:
    np.array: Optimal portfolio weights
    """
    num_assets = len(expected_returns)
    args = (expected_returns, cov_matrix)
    constraints = ({'type': 'eq', 'fun': lambda x: np.sum(x) - 1})
    bounds = tuple((0, 1) for _ in range(num_assets))
    initial_guess = num_assets * [1. / num_assets,]
    
    result = sco.minimize(portfolio_volatility, 
                          initial_guess,
                          args=args,
                          method='SLSQP',
                          bounds=bounds,
                          constraints=constraints)
    return result.x

def efficient_frontier(expected_returns, cov_matrix, num_portfolios=10000):
    """
    Generate the efficient frontier for a set of assets.
    
    Parameters:
    expected_returns (pd.Series): Expected annual returns
    cov_matrix (pd.DataFrame): Annual covariance matrix
    num_portfolios (int): Number of portfolios to generate
    
    Returns:
    pd.DataFrame: Efficient frontier data
    """
    results = []
    weights_list = []
    
    for _ in range(num_portfolios):
        weights = np.random.random(len(expected_returns))
        weights /= np.sum(weights)
        ret, vol, sharpe = portfolio_annualized_performance(weights, expected_returns, cov_matrix)
        results.append((vol, ret, sharpe))
        weights_list.append(weights)
    
    results = np.array(results)
    weights_list = np.array(weights_list)
    
    # Find portfolios on the efficient frontier
    unique_vol = np.unique(results[:,0])
    ef_points = []
    
    for vol in unique_vol:
        max_sharpe_idx = np.argmax(results[results[:,0]==vol][:,2])
        ef_points.append(results[results[:,0]==vol][max_sharpe_idx])
    
    ef_points = np.array(ef_points)
    
    return pd.DataFrame(ef_points, columns=['Volatility', 'Return', 'Sharpe Ratio'])
# ---------------------------
# ENDPOINTS
# ---------------------------
# Endpoint 1: Data Analysis & EDA
@app.route("/api/analyze", methods=["POST"])
def analyze():
    try:
        # Get tickers from request
        tickers = [ticker.strip() for ticker in request.json.get("stocks", []) if ticker.strip()]
        if not tickers:
            return jsonify({"error": "No valid stocks provided."}), 400
        
        # Fetch and preprocess data
        data = fetch_and_preprocess_data(tickers)
        
        # Perform EDA
        eda_results = perform_eda(data, tickers)
        
        # Return results
        return jsonify({
            "message": "EDA completed successfully",
            "results": eda_results,
            "tickers": tickers
        })
    
    except Exception as e:
        logging.exception("Error in /api/analyze")
        return jsonify({"error": str(e)}), 500

@app.route("/api/forecast", methods=["POST"])
def forecast():
    try:
        # Get parameters from request
        ticker = request.json.get("ticker")
        model_type = request.json.get("model_type", "arima")
        forecast_period = request.json.get("forecast_period", 30)
        
        if not ticker:
            return jsonify({"error": "No valid ticker provided."}), 400
        
        # Fetch data
        data = fetch_and_preprocess_data([ticker])
        
        # Select forecasting model
        if model_type.lower() == "arima":
            # Optimize ARIMA parameters
            best_params = optimize_arima_params(data[ticker])
            model = ARIMA(data[ticker], order=best_params)
            model_fit = model.fit()
            
            # Forecast
            forecast = model_fit.get_forecast(steps=forecast_period)
            predictions = forecast.predicted_mean
            conf_int = forecast.conf_int()
            
        elif model_type.lower() == "sarima":
            # Optimize SARIMA parameters
            best_params = optimize_sarima_params(data[ticker])
            model = SARIMAX(data[ticker], 
                           order=(best_params[0], best_params[1], best_params[2]),
                           seasonal_order=(best_params[3], best_params[4], best_params[5], best_params[6]))
            model_fit = model.fit(disp=False)
            
            # Forecast
            forecast = model_fit.get_forecast(steps=forecast_period)
            predictions = forecast.predicted_mean
            conf_int = forecast.conf_int()
            
        elif model_type.lower() == "lstm":
            # Prepare data for LSTM
            scaler = MinMaxScaler(feature_range=(0, 1))
            scaled_data = scaler.fit_transform(np.array(data[ticker]).reshape(-1, 1))
            
            # Create sequences
            window_size = 60
            X, y = create_sequences(scaled_data, window_size)
            
            # Split into train/test
            split = int(0.8 * len(X))
            X_train, X_test = X[:split], X[split:]
            y_train, y_test = y[:split], y[split:]
            
            # Reshape data for LSTM [samples, time steps, features]
            X_train = np.reshape(X_train, (X_train.shape[0], X_train.shape[1], 1))
            X_test = np.reshape(X_test, (X_test.shape[0], X_test.shape[1], 1))
            
            # Create and train model with early stopping
            model = create_lstm_model(window_size, 1)
            
            # Add early stopping to prevent overfitting and reduce training time
            early_stopping = tf.keras.callbacks.EarlyStopping(
                monitor='val_loss',
                patience=5,
                restore_best_weights=True
            )
            
            model.fit(
                X_train, 
                y_train, 
                batch_size=32, 
                epochs=50,
                validation_data=(X_test, y_test),
                callbacks=[early_stopping]
            )
            
            # Create forecast data
            last_sequence = scaled_data[-window_size:]
            forecast_input = last_sequence.reshape(1, window_size, 1)
            
            forecast_scaled = []
            current_input = forecast_input.copy()
            
            for _ in range(forecast_period):
                next_pred = model.predict(current_input)
                forecast_scaled.append(next_pred[0, 0])
                current_input = np.append(current_input[:, 1:, :], [[next_pred]], axis=1)
            
            # Inverse transform scaling
            predictions = scaler.inverse_transform(np.array(forecast_scaled).reshape(-1, 1)).flatten()
            
            # For LSTM, we don't have confidence intervals directly
            conf_int = None
            
        else:
            return jsonify({"error": "Invalid model type. Choose from 'arima', 'sarima', or 'lstm'."}), 400
        
        # Prepare results
        results = {
            "ticker": ticker,
            "model": model_type,
            "forecast_period": forecast_period,
            "predictions": predictions.to_dict() if hasattr(predictions, 'to_dict') else {i: val for i, val in enumerate(predictions)}
        }
        
        if conf_int is not None:
            results["confidence_interval_lower"] = conf_int.iloc[:, 0].to_dict()
            results["confidence_interval_upper"] = conf_int.iloc[:, 1].to_dict()
        
        return jsonify(results)
    
    except Exception as e:
        logging.exception("Error in /api/forecast")
        return jsonify({"error": str(e)}), 500
    

# Endpoint 3: Market Trend Analysis & Risk Metrics
@app.route("/api/market-trend", methods=["POST"])
def market_trend():
    try:
        # Get tickers from request
        tickers = [ticker.strip() for ticker in request.json.get("stocks", []) if ticker.strip()]
        if not tickers:
            return jsonify({"error": "No valid stocks provided."}), 400
        
        # Fetch data
        data = fetch_and_preprocess_data(tickers)
        
        # Calculate daily returns
        daily_returns = data.pct_change().dropna()
        
        # Calculate risk metrics
        var_95 = daily_returns.apply(lambda x: calculate_var(x))
        cvar_95 = daily_returns.apply(lambda x: calculate_cvar(x))
        rolling_volatility = daily_returns.rolling(window=30).std().iloc[-1] * np.sqrt(252)  # Annualized
        
        # Calculate correlation matrix
        correlation_matrix = daily_returns.corr()
        
        # Prepare results
        results = {
            "var_95": var_95.to_dict(),
            "cvar_95": cvar_95.to_dict(),
            "rolling_volatility": rolling_volatility.to_dict(),
            "correlation_matrix": correlation_matrix.to_dict()
        }
        
        return jsonify(results)
    
    except Exception as e:
        logging.exception("Error in /api/market-trend")
        return jsonify({"error": str(e)}), 500
# Endpoint 4: efficient-frontier
@app.route("/api/efficient-frontier", methods=["POST", "OPTIONS"])
def efficient_frontier_two():
    if request.method == "OPTIONS":
        # Handle preflight OPTIONS request
        return jsonify({}), 200
    
    try:
        tickers = [ticker.strip() for ticker in request.json.get("stocks", []) if ticker.strip()]
        if not tickers:
            return jsonify({"error": "No valid stocks provided."}), 400

        stock_data = fetch_and_preprocess_data(tickers)
        daily_returns = stock_data.pct_change().dropna()
        expected_returns = daily_returns.mean() * 252
        cov_matrix = daily_returns.cov() * 252

        num_portfolios = 5000
        random_portfolios = []

        for _ in range(num_portfolios):
            weights = np.random.random(len(tickers))
            weights /= np.sum(weights)
            port_return = np.dot(weights, expected_returns)
            port_volatility = np.sqrt(np.dot(weights.T, np.dot(cov_matrix, weights)))
            sharpe_ratio = port_return / port_volatility if port_volatility != 0 else 0

            random_portfolios.append({
                "volatility": float(port_volatility),
                "return": float(port_return),
                "sharpe_ratio": float(sharpe_ratio)
            })

        # Find the portfolio with the maximum Sharpe ratio
        max_sharpe_portfolio = max(random_portfolios, key=lambda p: p["sharpe_ratio"])

        # Generate the efficient frontier plot
        fig, ax = plt.subplots(figsize=(12, 6))
        
        # Plot all generated portfolios
        sc = ax.scatter(
            [p["volatility"] for p in random_portfolios],
            [p["return"] for p in random_portfolios],
            c=[p["sharpe_ratio"] for p in random_portfolios],
            cmap='viridis',
            marker='o',
            s=10,
            alpha=0.3
        )
        plt.colorbar(sc, label='Sharpe Ratio')
        
        # Highlight the maximum Sharpe ratio portfolio
        ax.scatter(
            max_sharpe_portfolio["volatility"],
            max_sharpe_portfolio["return"],
            marker='*',
            color='red',
            s=200,
            label='Max Sharpe Ratio'
        )
        
        ax.set_xlabel('Volatility')
        ax.set_ylabel('Expected Return')
        ax.set_title('Efficient Frontier')
        ax.legend()
        plt.tight_layout()

        # Convert plot to Base64
        buf = io.BytesIO()
        plt.savefig(buf, format="png")
        buf.seek(0)
        img_base64 = base64.b64encode(buf.getvalue()).decode("utf-8")
        buf.close()
        plt.close(fig)

        return jsonify({
            "efficient_frontier_image": img_base64,
            "random_portfolios": random_portfolios,
            "optimized_portfolio": max_sharpe_portfolio
        })

    except Exception as e:
        logging.exception("Error in /api/efficient-frontier")
        return jsonify({"error": str(e)}), 500
# Endpoint 4: Portfolio Optimization
@app.route("/api/optimize", methods=["POST"])
def optimize():
    try:
        # Get tickers from request
        tickers = [ticker.strip() for ticker in request.json.get("stocks", []) if ticker.strip()]
        if not tickers:
            return jsonify({"error": "No valid stocks provided."}), 400
        
        # Fetch data
        data = fetch_and_preprocess_data(tickers)
        
        # Calculate daily returns
        daily_returns = data.pct_change().dropna()
        
        # Annualize returns and covariance
        expected_returns = daily_returns.mean() * 252
        cov_matrix = daily_returns.cov() * 252
        
        # Calculate optimal portfolios
        max_sharpe_weights = maximize_sharpe_ratio(expected_returns, cov_matrix)
        min_vol_weights = minimum_volatility_portfolio(expected_returns, cov_matrix)
        
        # Calculate efficient frontier
        ef = efficient_frontier(expected_returns, cov_matrix)
        
        # Prepare results
        results = {
            "max_sharpe_portfolio": {
                "weights": {ticker: round(weight, 4) for ticker, weight in zip(tickers, max_sharpe_weights)},
                "performance": portfolio_annualized_performance(max_sharpe_weights, expected_returns, cov_matrix)
            },
            "min_volatility_portfolio": {
                "weights": {ticker: round(weight, 4) for ticker, weight in zip(tickers, min_vol_weights)},
                "performance": portfolio_annualized_performance(min_vol_weights, expected_returns, cov_matrix)
            },
            "efficient_frontier": ef.to_dict(orient='records')
        }
        
        return jsonify(results)
    
    except Exception as e:
        logging.exception("Error in /api/optimize")
        return jsonify({"error": str(e)}), 500

if __name__ == "__main__":
    app.run(debug=True, port=5000)

