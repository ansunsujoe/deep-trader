import requests
import os

def read_intraday(ticker):
    url = "https://www.alphavantage.co/query"
    params = {
        "interval": "5min",
        "function": "TIME_SERIES_INTRADAY",
        "symbol": ticker.upper(),
        "apikey": os.environ.get("ALPHAVANTAGE_KEY"),
        "datatype": "json",
        "output_size": "compact"
    }
    response = requests.request("GET", url, params=params)
    array = []
    
    # Iterate through timeseries
    try:
        timeseries = response.json()["Time Series (5min)"]
    except Exception:
        raise Exception("Stock API Error")
    for key in timeseries:
        day = timeseries[key]
        array.append({
            "time": key,
            "price": day["4. close"]
        })
    return array

def read_daily(ticker):
    # Make the request and get the response
    url = 'https://www.alphavantage.co/query'
    params = {
        "function": "TIME_SERIES_DAILY",
        "symbol": ticker.upper(),
        "apikey": os.environ.get("ALPHAVANTAGE_KEY"),
        "datatype": "json",
        "outputsize": "compact"
    }
    response = requests.request("GET", url, params=params)
    array = []
    
    # Iterate through timeseries
    try:
        timeseries = response.json()["Time Series (Daily)"]
    except Exception:
        raise Exception("Stock API Error")
    for key in timeseries:
        day = timeseries[key]
        array.append({
            "time": key,
            "price": day["4. close"]
        })
    return array