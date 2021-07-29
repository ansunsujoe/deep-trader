from flask import Flask
from flask_cors import CORS
from flask_bcrypt import Bcrypt
from flask import request, session
from deep_trader.db_tools import Database
from datetime import datetime
import os

app = Flask(__name__)
app.config['ENV'] = "development"
app.secret_key = os.environ.get("SECRET_KEY")

# Set up some configurations for the app
CORS(app)
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
@app.route("/users", methods=['GET', 'POST'])
def sign_up():
    try:
        app.logger.debug(request.get_json())
        db.insert_user(request.get_json())
        userid = db.run_select("SELECT MAX(id) FROM trader;")
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
        data = db.run_select("SELECT quote.ticker_id, quote.price FROM (SELECT ticker_id, MAX(time) AS max_time FROM quote GROUP BY ticker_id) AS latest_prices INNER JOIN ticker ON latest_prices.ticker_id = ticker.id INNER JOIN quote ON quote.ticker_id = latest_prices.ticker_id AND quote.time = latest_prices.max_time;")
        response = db.to_dict(data, ["name", "price"])
        return response

@app.route("/watchlist", methods=["GET", "POST"])
def watchlist():
    if request.method == "GET":
        data = db.run_select("SELECT name FROM watchlist;")
        response = db.to_dict(data, ["name"])
        return response
    elif request.method == "POST":
        response = request.get_json()
        group_name = response.get("name")
        db.run_insert("watchlist", [session.get("userid"), group_name])
        app.logger.debug(f"Inserted group {group_name}")
        return "OK", 200

# Main method
if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5001, debug=True)