from flask import Flask
from flask_cors import CORS
from flask_bcrypt import Bcrypt
from flask import request, session
from deep_trader.db_tools import Database

app = Flask(__name__)
app.config['ENV'] = "development"

# Set up some configurations for the app
CORS(app)
bcrypt = Bcrypt(app)
db = Database()

# Root endpoint
@app.route("/")
def index():
    return "Hello World!"

# Insert user
@app.route("/users", methods = ['GET', 'POST'])
def sign_up():
    try:
        app.logger.debug(request.get_json())
        db.insert_user(request.get_json())
        data = db.select_all("trader")
        app.logger.debug(data)
    except Exception as e:
        app.logger.debug(e)
        return {"data": "Bad"}
    return {"data": data}

# Main method
if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5001, debug=True)