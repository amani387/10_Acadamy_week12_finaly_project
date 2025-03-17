# **Portfolio Management & Time Series Forecasting**

## 📌 **Project Overview**
This project integrates **Time Series Forecasting** with **Portfolio Optimization** to enhance investment decision-making. It uses **ARIMA, LSTM, and Modern Portfolio Theory (MPT)** to analyze stock trends, assess market risks, and suggest optimized portfolio allocations.

## 🚀 **Features**
- **Stock Data Fetching**: Uses Yahoo Finance API to fetch historical stock prices.
- **Time Series Forecasting**: ARIMA-based forecasting with confidence intervals.
- **Market Risk Analysis**: Computes **Value at Risk (VaR)** and rolling volatility.
- **Portfolio Optimization**: Maximizes **Sharpe Ratio** using modern portfolio theory.
- **Efficient Frontier Visualization**: Shows risk-return tradeoff for various portfolio allocations.
- **Interactive Frontend**: Built with **Next.js & Material UI** for seamless data visualization.
- **REST API Backend**: Flask API with endpoints for forecasting, risk analysis, and optimization.

## 🛠 **Tech Stack**
### **Backend**
- **Flask** (Python)
- **Yahoo Finance API (yfinance)**
- **Scipy, Statsmodels, Pandas, NumPy** (Data Analysis & Optimization)
- **TensorFlow/Keras** (LSTM Forecasting)
- **Matplotlib, Seaborn** (Visualizations)

### **Frontend**
- **Next.js (React.js)**
- **Material UI (MUI)** for UI components
- **Chart.js (React-ChartJS-2)** for data visualization
- **Axios** for API calls

## 📂 **Project Structure**
```
📦 project-root
├── 📁 backend
│   ├── app.py                 # Flask backend with endpoints
│   ├── requirements.txt       # Python dependencies
│   ├── models.py              # Forecasting & optimization models
│   ├── utils.py               # Helper functions
│   ├── static                 # Stores generated plots
├── 📁 frontend
│   ├── pages
│   │   ├── index.tsx          # Home Page
│   │   ├── portfolio.tsx      # Portfolio Management UI
│   ├── components
│   │   ├── PortfolioChart.tsx
│   │   ├── ForecastChart.tsx
│   │   ├── RiskMetrics.tsx
│   │   ├── EfficientFrontierChart.tsx
│   ├── styles
│   │   ├── globals.css        # Global Styles
├── 📄 README.md
├── 📄 package.json            # Frontend dependencies
```

## ⚡ **Installation & Setup**
### **1️⃣ Clone the repository**
```bash
git clone https://github.com/amani387/10_Acadamy_week12_finaly_project.git
cd 10_Acadamy_week12_finaly_project
```

### **2️⃣ Backend Setup**
```bash
cd backend
python -m venv venv
source venv/bin/activate   # On Windows: venv\Scripts\activate
pip install -r requirements.txt
python app.py  # Start Flask server
```

### **3️⃣ Frontend Setup**
```bash
cd frontend
npm install  # or npm install
npm run dev      # Start Next.js frontend
```

## 🔗 **API Endpoints**
| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/analyze` | POST | Fetches stock data & performs EDA |
| `/api/forecast` | POST | Predicts future stock prices using ARIMA |
| `/api/market-trend` | POST | Computes VaR & rolling volatility |
| `/api/optimize` | POST | Optimizes portfolio allocation using Sharpe Ratio |
| `/api/efficient-frontier` | POST | Generates Efficient Frontier visualization |

## 📊 **Frontend UI Preview**
### **Portfolio Optimizer Dashboard**
- Enter stock symbols (e.g., `TSLA, AAPL, SPY`)
- Click **"Optimize Portfolio"** to get allocation
- Click **"Run Forecast"** to predict future prices
- Click **"Analyze Risk"** for VaR & volatility
- Click **"Show Efficient Frontier"** for visualization

## 🌍 **Deployment Plan**
- **Backend**:  Flask API 
- **Frontend**: Deploy Next.js on **Vercel**

## 📎 **GitHub Repository**
🔗 **[GitHub Link](https://github.com/amani387/10_Acadamy_week12_finaly_project.git)**

## 📢 **Future Improvements**
- **Improve Forecasting**: Implement SARIMA & LSTM models
- **Advanced Risk Metrics**: Factor in beta, max drawdown
- **Live Data Updates**: Integrate WebSockets for real-time pricing


## 📌 **Contributors**
- **Amanuel Nega** 

🙌 **Thank you for checking out this project!** 🚀

