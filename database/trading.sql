-- Crypt extension
CREATE EXTENSION pgcrypto;

-- For a single user
CREATE TABLE IF NOT EXISTS trader (
    id SERIAL PRIMARY KEY,
    name VARCHAR(50) NOT NULL,
    username VARCHAR(30) UNIQUE NOT NULL,
    password TEXT NOT NULL,
    cash DECIMAL NOT NULL,
    admin BOOLEAN NOT NULL
);

-- For a single ticker
CREATE TABLE IF NOT EXISTS ticker (
    id SERIAL PRIMARY KEY,
    name VARCHAR(10) UNIQUE NOT NULL,
    is_active BOOLEAN NOT NULL,
    description TEXT,
    image_exists BOOLEAN DEFAULT FALSE
);

-- For a single stock price
CREATE TABLE IF NOT EXISTS quote (
    id SERIAL PRIMARY KEY,
    ticker_id INT NOT NULL REFERENCES ticker(id),
    time TIMESTAMP NOT NULL,
    price DECIMAL NOT NULL,
    is_current BOOLEAN NOT NULL
);

-- For a single stock trade recommendation
CREATE TABLE IF NOT EXISTS recommendation (
    id SERIAL PRIMARY KEY,
    ticker_id INT NOT NULL REFERENCES ticker(id),
    action VARCHAR(10) NOT NULL,
    time TIMESTAMP NOT NULL
);

-- For a transaction
CREATE TABLE IF NOT EXISTS transaction (
    id SERIAL PRIMARY KEY,
    trader_id INT NOT NULL REFERENCES trader(id),
    ticker_id INT NOT NULL REFERENCES ticker(id),
    action VARCHAR(10) NOT NULL,
    price DECIMAL NOT NULL,
    shares INT NOT NULL,
    time TIMESTAMP NOT NULL
);

-- For a stock group
CREATE TABLE IF NOT EXISTS watchlist (
    id SERIAL PRIMARY KEY,
    trader_id INT NOT NULL REFERENCES trader(id),
    name VARCHAR(30) NOT NULL
);

-- For a stock group ticker
CREATE TABLE IF NOT EXISTS watchlist_item (
    id SERIAL PRIMARY KEY,
    trader_id INT NOT NULL REFERENCES trader(id),
    watchlist_id INT NOT NULL REFERENCES watchlist(id) ON DELETE CASCADE ON UPDATE CASCADE,
    ticker_id INT NOT NULL REFERENCES ticker(id)
);

-- For a single asset owned by a user
CREATE TABLE IF NOT EXISTS asset (
    id SERIAL PRIMARY KEY,
    trader_id INT NOT NULL REFERENCES trader(id),
    ticker_id INT NOT NULL REFERENCES ticker(id),
    shares INT NOT NULL
)