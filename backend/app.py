from flask import Flask
from flask_cors import CORS
from flask.ext.bcrypt import Bcrypt

app = Flask(__name__)
app.config['ENV'] = "development"

# Set up some configurations for the app
CORS(app)
bcrypt = Bcrypt(app)

# Root endpoint
@app.route("/")
def index():
    return "Hello World!"

# Insert user
@app.route("/signup", methods=["POST"])
def sign_up():
    pass

# Main method
if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5001, debug=True)