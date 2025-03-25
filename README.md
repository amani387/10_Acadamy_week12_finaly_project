# **Portfolio Management & Time Series Forecasting**

## 📌 **Project Overview**
This project integrates **Time Series Forecasting** with **Portfolio Optimization** to enhance investment decision-making. It uses **ARIMA,SARIMA, LSTM, and Modern Portfolio Theory (MPT)** to analyze stock trends, assess market risks, and suggest optimized portfolio allocations.

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
FOR THE FRONTEND IT IS INTHE SAME FOLDER IN THE WHOLE PROJECT 
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
- Click **"Optimize Portfolio"** to get allocation u need to see by insertting only two ticker or morethan three tickers 
- Click **"Run Forecast"** to predict future prices use only one ticker to see the forcaster efficiently 
- Click **"Analyze Risk"** for VaR & volatility
- Click **"Show Efficient Frontier"** for visualization

## 🌍 **Deployment Plan**
- **Backend**:  Flask API Deploy on **Heroku**
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
![new_impo2_720](https://github.com/user-attachments/assets/a346e8f6-64bf-4fd9-8e7e-a879bfb6d921)
![impo_8_720](https://github.com/user-attachments/assets/27176f64-267f-4b72-86d2-0667e4e8d0f6)
![impo_7_720](https://github.com/user-attachments/assets/f822ca36-d835-4880-935a-4df568a5d739)
![impo_6_720](https://github.com/user-attachments/assets/6335a21b-27aa-4aec-ac22-b11942ec1ae6)
![impo_0 2_720](https://github.com/user-attachments/assets/26ab51d5-bb5f-49f3-83c1-439d4d704518)
![impo_0 1_720](https://github.com/user-attachments/assets/f780d04f-23fe-4d0f-83de-709fd56f098c)

