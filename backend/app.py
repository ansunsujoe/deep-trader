from flask import Flask
from flask_cors import CORS
from flask_bcrypt import Bcrypt
from flask import request, session
from deep_trader.db_tools import Database
from datetime import datetime
import os, json

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
        request_data = request.get_json()
        app.logger.debug(request_data)
        
        # Check if username is taken
        username_str = db.value_string([request_data.get("username")])
        existing_id = db.run_select_one(f"SELECT id FROM trader WHERE username = {username_str}")
        if existing_id is not None:
            return "Username Exists", 400
        
        db.insert_user(request_data)
        userid = db.run_select("SELECT MAX(id) FROM trader;")[0][0]
        
        # Set UserID and Admin credentials
        session["userid"] = userid
        if request_data.get("username") == "admin":
            session["admin"] = True
        else:
            session["admin"] = False
        app.logger.debug(userid)
    
    # Catch exception
    except Exception as e:
        app.logger.debug("Exception " + e)
        return "Bad Request", 400
    return {"userid": userid, "admin": session.get("admin")}

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
            if response.get("username") == "admin":
                session["admin"] = True
            else:
                session["admin"] = False
            return {"userid": user_id, "admin": session.get("admin")}
    except Exception as e:
        app.logger.debug("Exception " + e)
        return "Bad Request", 400
        

# Log out user
@app.route("/logout")
def logout():
    userid = session.get("userid")
    session["userid"] = None
    session["admin"] = None
    return {"userid": userid, "admin": session.get("admin")}

# Tickers
@app.route("/tickers", methods=["GET", "POST", "DELETE"])
def tickers():
    if request.method == "GET":
        query = f"""
        SELECT t.name, q.price, t.is_active, t.description
        FROM quote q 
        INNER JOIN ticker t
        ON q.ticker_id = t.id
        WHERE q.is_current;
        """
        data = db.run_select(query)
        app.logger.debug(data)
        response = db.to_dict(data, ["name", "price", "status", "desc"])
        return {"stocks": response}
    
    if request.method == "POST":
        request_data = request.form
        ticker = request_data.get("ticker")
        desc = request_data.get("desc")
        file = request.files.get("image")
        
        try:
            ticker_id = db.add_stock_data(ticker)
            if not desc:
                desc = ""
            db.run_update(f"UPDATE ticker set description = {db.value_string([desc])} WHERE id = {ticker_id}")
            if file:
                file.save(f"/usr/src/images/{ticker}.jpg")
                db.run_update(f"UPDATE ticker SET image_valid = TRUE WHERE id = {ticker_id};")
        except Exception:
            return "Invalid Ticker Name", 400
        return "Success", 200
    
    if request.method == "DELETE":
        request_data = request.get_json()
        ticker = request_data.get("ticker")
        query = f"""
        UPDATE ticker
        SET is_active = FALSE
        WHERE name = {db.value_string([ticker])};
        """
        db.run_update(query)
        return "Success", 200
    
# Ticker status
@app.route("/tickers/status", methods=["PUT"])
def activate_ticker():
    request_data = request.get_json()
    ticker = request_data.get("ticker")
    status = request_data.get("status")
    if status == "Deleted":
        bool_value = "TRUE"
    else:
        bool_value = "FALSE"
    query = f"""
    UPDATE ticker
    SET is_active = {bool_value}
    WHERE name = {db.value_string([ticker])};
    """
    db.run_update(query)
    return "Success", 200

@app.route("/tickers/description", methods=["PUT"])
def edit_description():
    request_data = request.form
    ticker = request_data.get("ticker")
    desc = request_data.get("desc")
    db.run_update(f"UPDATE ticker SET description = {db.value_string([desc])} WHERE name = {db.value_string([ticker])};")
    
    # Get image if it exists
    file = request.files.get("image")
    if file:
        file.save(f"/usr/src/images/{ticker}.jpg")
        db.run_update(f"UPDATE ticker SET image_valid = TRUE WHERE name = {db.value_string([ticker])};")
        
    return "Success", 200
    

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
        
        # Get stocks in watchlist
        for list_entry in response:
            name = list_entry.get("name")
            query = f"""
            SELECT t.name, q.price
            FROM ticker t
            INNER JOIN quote q
            ON t.id = q.ticker_id
            WHERE q.is_current
            AND t.id IN (
                SELECT DISTINCT ticker_id
                FROM watchlist_item
                WHERE trader_id = {user_id}
                AND watchlist_id IN (
                    SELECT id FROM watchlist
                    WHERE name = {db.value_string([name])}
                )
            );
            """
            data = db.run_select(query)
            stocks = db.to_dict(data, keys=["ticker", "price"])
            list_entry["stocks"] = stocks
        
        app.logger.debug(response)
        return {"watchlists": response}
    
    # Request POST
    elif request.method == "POST":
        response = request.get_json()
        group_name = response.get("name")
        db.run_insert("watchlist", [user_id, group_name])
        app.logger.debug(f"Inserted group {group_name}")
        return "OK", 200
    
@app.route("/watchlistItem", methods=["POST", "PUT"])
def watchlist_item():
    # Get user id, and if not the request is unauthorized
    user_id = session.get("userid")
    if user_id is None:
        return "Unauthorized", 401
    
    if request.method == "POST":
        request_data = request.get_json()
        watchlist = request_data.get("watchlist")
        ticker_id= request_data.get("tickerId")

        watchlist_id = db.run_select_one(f"SELECT id FROM watchlist WHERE name = {db.value_string([watchlist])};")[0]
        db.run_insert("watchlist_item", [user_id, watchlist_id, ticker_id])
        return "Success", 200
    
    if request.method == "PUT":
        request_data = request.get_json()
        watchlist = request_data.get("watchlist")
        ticker = request_data.get("ticker")
        
        ticker_id = db.run_select_one(f"SELECT id FROM ticker WHERE name = {db.value_string([ticker])};")[0]
        watchlist_id = db.run_select_one(f"SELECT id FROM watchlist WHERE name = {db.value_string([watchlist])};")[0]
        
        db.run_update(f"DELETE FROM watchlist_item WHERE id = {watchlist_id};")
        return "Success", 200
    
@app.route("/stock/<id>", methods=["GET", "POST"])
def stock(id):
    if request.method == "GET":
        ticker, is_active, desc, image_exists = db.run_select_one(f"SELECT name, is_active, description, image_exists FROM ticker WHERE id = {id};")
        if desc is None:
            desc = ""
        
        # Price of ticker
        query = f"""
        SELECT q.price 
        FROM quote q
        WHERE q.ticker_id = {id} AND q.is_current;
        """
        data = db.run_select_one(query)
        price = float(data[0])
        
        # Cash of the user
        user_id = session.get("userid")
        if user_id is None:
            return "Unauthorized", 401
        cash = db.run_select_one(f"SELECT cash FROM trader WHERE id = {user_id};")
        if cash is None:
            return "Bad Request", 400
        cash = float(cash[0])
        
        # Watchlists of the stock
        query = f"""
        SELECT DISTINCT name FROM watchlist
        WHERE trader_id = {user_id}
        AND id NOT IN (
            SELECT DISTINCT watchlist_id FROM watchlist_item
            WHERE trader_id = {user_id}
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
        timeseries = [float(t[0]) for t in timeseries][::-1]
        
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
            current_shares = int(current_shares[0])
        
        # Consolidate and return final data
        stock_info = {
            "ticker": ticker,
            "isActive": is_active,
            "desc": desc,
            "imageValid": image_exists,
            "price": price,
            "cash": cash,
            "watchlists": watchlists,
            "shares": current_shares,
            "maxBuy": cash // price,
            "timeseries": timeseries
        }
        app.logger.debug(stock_info)
        return stock_info, 200
    
    
@app.route("/asset", methods=["GET", "PUT"])
def asset():
    userid = session.get("userid")
    if userid is None:
        return "Unauthorized", 401
    
    if request.method == "GET":
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
    
    if request.method == "PUT":
        request_data = request.get_json()
        ticker_id = int(request_data.get("tickerId"))
        current_price = request_data.get("currentPrice")
        current_shares = request_data.get("currentShares")
        share_change = request_data.get("shareChange")
        action = request_data.get("action")
        
        if action == "buy":
            new_shares = current_shares + share_change
            cash_change = -round(share_change * current_price, 2)
        elif action == "sell":
            new_shares = current_shares - share_change
            cash_change = round(share_change * current_price, 2)
            
        conn, cur = db.get_connection()
            
        # Create the asset
        if current_shares == 0:
            db.run_insert("asset", [userid, ticker_id, new_shares], conn, cur, commit=False)
        
        # Update the asset
        elif new_shares == 0:
            cur.execute(f"DELETE FROM asset WHERE trader_id = {userid} AND ticker_id = {ticker_id};")
        else:
            cur.execute(f"UPDATE asset SET shares = {new_shares} WHERE trader_id = {userid} AND ticker_id = {ticker_id};")
            
        # Create the transaction
        db.run_insert("transaction", [userid, ticker_id, action, current_price, share_change, datetime.now()], conn, cur, commit=False)
        
        # Change the cash value
        cur.execute(f"UPDATE trader SET cash = cash + {cash_change} WHERE id = {userid};")
        conn.commit()
        
        return "Success", 200
        
    
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
        "cash": round(float(data[1]), 2)
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
    results = db.run_select(asset_query)
    assets = db.to_dict(results, keys=["ticker", "price", "shares"])
    
    # Perform calculation on assets
    total_invested = 0
    for asset in assets:
        total_invested += asset.get("price") * asset.get("shares")
    total_invested = round(float(total_invested), 2)
    total = data_dict.get("cash") + total_invested
    
    # Format and return output dictionary
    trader_info = {
        "username": data_dict.get("username"),
        "total": total,
        "cash": data_dict.get("cash"),
        "invested": total_invested,
        "assets": assets
    }
    app.logger.debug(trader_info)
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
        app.logger.debug(data)
        return str(data[0]), 200
    
@app.route("/currentuser", methods=["GET"])
def get_current_user():
    userid = session.get("userid")
    if userid is None:
        return "Unauthorized", 401
    admin = session.get("admin")
    return {"userid": userid, "admin": admin}

@app.route("/transactions/buy", methods=["GET"])
def get_buy_transactions():
    userid = session.get("userid")
    if userid is None:
        return "Unauthorized", 401
    
    # Query to get all buy transactions
    query = f"""
    SELECT tr.time, t.name, tr.action, tr.shares, tr.price
    FROM transaction tr
    INNER JOIN ticker t
    ON tr.ticker_id = t.id
    WHERE tr.action = {db.value_string(["buy"])}
    ORDER BY tr.time DESC;
    """
    data = db.run_select(query)
    transactions = db.to_dict(data, ["time", "ticker", "action", "shares", "price"])
    app.logger.debug(transactions)
    return json.dumps(transactions)

    
@app.route("/transactions/sell", methods=["GET"])
def get_sell_transactions():
    userid = session.get("userid")
    if userid is None:
        return "Unauthorized", 401
    
    # Query to get all sell transactions
    query = f"""
    SELECT tr.time, t.name, tr.action, tr.shares, tr.price
    FROM transaction tr
    INNER JOIN ticker t
    ON tr.ticker_id = t.id
    WHERE tr.action = {db.value_string(["sell"])}
    ORDER BY tr.time DESC;
    """
    data = db.run_select(query)
    transactions = db.to_dict(data, ["time", "name", "action", "shares", "price"])
    return json.dumps(transactions)
    
# Main method
if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5001, debug=True)