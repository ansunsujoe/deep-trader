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
        query = f"""
        SELECT t.name, q.price 
        FROM quote q 
        INNER JOIN ticker t
        ON q.ticker_id = t.id
        WHERE t.id = {id} AND q.is_current;
        """
        data = db.run_select(query)
        app.logger.debug(data)
        return data, 200
    
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

# Main method
if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5001, debug=True)