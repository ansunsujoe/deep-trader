-- Crypt extension
CREATE EXTENSION pgcrypto;

-- For a single user
CREATE TABLE IF NOT EXISTS trader (
    id SERIAL PRIMARY KEY,
    name VARCHAR(50) NOT NULL,
    username VARCHAR(30) UNIQUE NOT NULL,
    password TEXT NOT NULL
);

-- For a single ticker
CREATE TABLE IF NOT EXISTS ticker {
    id SERIAL PRIMARY KEY,
    name VARCHAR(10) NOT NULL,
}

-- For a single stock price
CREATE TABLE IF NOT EXISTS quote {
    id SERIAL PRIMARY KEY,
    ticker_id INT NOT NULL,
    time TIMESTAMP NOT NULL,
    price DECIMAL NOT NULL
}

-- For a single stock trade recommendation
CREATE TABLE IF NOT EXISTS recommendation {
    id SERIAL PRIMARY KEY,
    ticker_id INT NOT NULL,
    action 
}