```markdown
# API Endpoints Documentation

This document outlines the available API endpoints along with instructions on how to test them.

---

## 1. Optimize Portfolio Endpoint

**URL:**  
`http://127.0.0.1:5000/api/optimize`

**Method:**  
`POST`

**Headers:**  
`Content-Type: application/json`

**Body:**  
Select "raw" and choose JSON as the data type. Enter the following JSON:
```json
{
  "stocks": ["TSLA", "AAPL", "SPY"]
}
```

**Expected Response:**  
On success, you should receive a JSON response similar to:
```json
{
  "TSLA": 0.45,
  "AAPL": 0.30,
  "SPY": 0.25
}
```
This means:
- 45% of your money should be in TSLA
- 30% in AAPL
- 25% in SPY

---

## 2. Stock Analysis Endpoint

**URL:**  
`http://127.0.0.1:5000/api/analyze`

**Method:**  
`POST`

**Headers:**  
`Content-Type: application/json`

**Body:**  
```json
{
  "stocks": ["TSLA", "AAPL", "SPY"]
}
```

**Expected Response:**  
A successful analysis will return:
```json
{ 
  "message": "EDA completed!" 
}
```

---

## 3. Stock Forecasting Endpoint

**URL:**  
`http://127.0.0.1:5000/api/forecast`

**Method:**  
`POST`

**Headers:**  
`Content-Type: application/json`

**Body:**  
```json
{
  "stocks": ["TSLA"]
}
```

**Expected Response:**  
The response will provide a forecast array (the example below is indicative):
```json
{
  "forecast": [350.1, 351.2, 352.4, ...]
}
```
```