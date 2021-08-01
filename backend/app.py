from flask import Flask
from flask_cors import CORS
from flask_bcrypt import Bcrypt
from flask import request, session
from deep_trader.db_tools import Database
from datetime import datetime
import os

app = Flask(__name__)
app.config['ENV'] = "development"
app.config.update(SESSION_COOKIE_SAMESITE="None", SESSION_COOKIE_SECURE=True)
app.secret_key = os.environ.get("SECRET_KEY")

# Set up some configurations for the app
CORS(app, supports_credentials=True)
bcrypt = Bcrypt(app)
db = Database()

# Fill tables with data if not already
if db.is_empty("quote"):
    db.init_stock_data("resources/tickers.txt")

# Root endpoint
@app.route("/")
def index():
    return "Hello World!"

# Insert user
@app.route("/users", methods=['POST'])
def sign_up():
    try:
        app.logger.debug(request.get_json())
        db.insert_user(request.get_json())
        userid = db.run_select("SELECT MAX(id) FROM trader;")[0][0]
        session["userid"] = userid
        app.logger.debug(userid)
    except Exception as e:
        app.logger.debug("Exception " + e)
        return "Bad Request", 400
    return {"userid": userid}

# Login as user
@app.route("/login", methods=['POST'])
def login():
    try:
        response = request.get_json()
        user_id = db.authenticate_user(response)
        if user_id is None:
            return "Unauthorized", 401
        else:
            session["userid"] = user_id
            return {"userid": user_id}
    except Exception as e:
        app.logger.debug("Exception " + e)
        return "Bad Request", 400
        

# Log out user
@app.route("/logout")
def logout():
    userid = session.get("userid")
    session["userid"] = None
    return {"userid": userid}

# Tickers
@app.route("/tickers", methods=["GET", "POST"])
def tickers():
    if request.method == "GET":
        query = f"""
        SELECT t.name, q.price 
        FROM quote q 
        INNER JOIN ticker t
        ON q.ticker_id = t.id
        WHERE q.is_current;
        """
        data = db.run_select(query)
        app.logger.debug(data)
        response = db.to_dict(data, ["name", "price"])
        return {"stocks": response}

@app.route("/watchlist", methods=["GET", "POST"])
def watchlist():
    # Get user id, and if not the request is unauthorized
    user_id = session.get("userid")
    if user_id is None:
        return "Unauthorized", 401
    
    # Request GET
    if request.method == "GET":
        data = db.run_select(f"SELECT name FROM watchlist WHERE trader_id = {db.value_string([user_id])};")
        response = db.to_dict(data, ["name"])
        return {"watchlists": response}
    # Request POST
    elif request.method == "POST":
        response = request.get_json()
        group_name = response.get("name")
        db.run_insert("watchlist", [user_id, group_name])
        app.logger.debug(f"Inserted group {group_name}")
        return "OK", 200
    
@app.route("/stock/<id>", methods=["GET", "POST"])
def stock(id):
    if request.method == "GET":
        # Name and price of ticker
        query = f"""
        SELECT t.name, q.price 
        FROM quote q 
        INNER JOIN ticker t
        ON q.ticker_id = t.id
        WHERE t.id = {id} AND q.is_current;
        """
        data = db.run_select(query)
        ticker_dict = db.to_dict(data, ["ticker", "price"])[0]
        
        # Cash of the user
        user_id = session.get("userid")
        if user_id is None:
            return "Unauthorized", 401
        userid_str = db.value_string(user_id)
        cash = db.run_select_one(f"SELECT cash FROM trader WHERE id = {userid_str};")
        if cash is None:
            return "Bad Request", 400
        cash = float(cash[0])
        
        # Watchlists of the stock
        query = f"""
        SELECT DISTINCT name FROM watchlist
        WHERE trader_id = {userid_str}
        AND id NOT IN (
            SELECT DISTINCT watchlist_id FROM watchlist_item
            WHERE trader_id = {userid_str}
            AND ticker_id = {id}
        );
        """
        watchlists = db.run_select(query)
        watchlists = [w[0] for w in watchlists]
        
        # Last n stock prices in timeseries
        query = f"""
        SELECT price FROM quote
        WHERE ticker_id = {id}
        ORDER BY time DESC
        LIMIT 15;
        """
        timeseries = db.run_select(query)
        timeseries = [t[0] for t in timeseries]
        
        # Assets of the user in a specific stock
        query = f"""
        SELECT shares FROM asset
        WHERE trader_id = {user_id} 
        AND ticker_id = {id};
        """
        current_shares = db.run_select_one(query)
        if current_shares is None:
            current_shares = 0
        else:
            current_shares = current_shares[0]
        
        # Consolidate and return final data
        stock_info = {
            "ticker": ticker_dict.get("ticker"),
            "price": ticker_dict.get("price"),
            "cash": cash,
            "watchlists": watchlists,
            "shares": current_shares,
            "maxBuy": cash // ticker_dict.get("price"),
            "timeseries": timeseries
        }
        return stock_info, 200
    
    
@app.route("/asset", methods=["GET", "POST"])
def asset():
    if request.method == "GET":
        userid = session.get("userid")
        if userid is None:
            return "Unauthorized", 401
        query = f"""
        SELECT t.name, a.shares
        FROM asset a
        INNER JOIN ticker t
        ON a.ticker_id = t.id
        WHERE a.trader_id = {userid};
        """
        data = db.run_select(query)
        response = db.to_dict(data, ["name", "shares"])
        return {"assets": response}
    
@app.route("/traderinfo", methods=["GET"])
def trader_info():
    # Get the user ID or return as unauthorized
    user_id = session.get("userid")
    if user_id is None:
        return "Unauthorized", 401
    userid_str = db.value_string([user_id])
    
    # Get the basic trader data
    data = db.run_select_one(f"SELECT username, cash FROM trader WHERE id = {userid_str};")
    data_dict = {
        "username": data[0],
        "cash": float(data[1])
    }
    
    # Get all trader assets
    asset_query = f"""
        SELECT t.name, q.price, a.shares
        FROM asset a
        INNER JOIN ticker t
        ON a.ticker_id = t.id
        INNER JOIN quote q
        ON t.id = q.ticker_id
        WHERE a.trader_id = {user_id}
        AND q.is_current;
        """
    assets = db.run_select(asset_query)
    assets = db.to_dict(assets, keys=["ticker", "price", "shares"])
    
    # Perform calculation on assets
    total_invested = 0
    for asset in assets:
        total_invested += asset.get("price") * asset.get("shares")
    total = data_dict.get("cash") + total_invested
    
    # Format and return output dictionary
    trader_info = {
        "username": data_dict.get("username"),
        "total": total,
        "cash": data_dict.get("cash"),
        "invested": total_invested,
        "assets": assets
    }
    return trader_info

@app.route("/stockid", methods=["GET"])
def get_stock_id():
    ticker = request.args.get('ticker')
    app.logger.debug(f"Ticker requested: {ticker}")
    if ticker is None:
        return "Bad Request", 400
    ticker_str = db.value_string([ticker])
    data = db.run_select_one(f"SELECT id FROM ticker WHERE name = {ticker_str};")
    if data is None:
        return "Bad Request", 400
    else:
        return str(data[0]), 200

# Main method
if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5001, debug=True)