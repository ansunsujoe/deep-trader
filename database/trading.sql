-- Crypt extension
CREATE EXTENSION pgcrypto;

-- For a single user
CREATE TABLE IF NOT EXISTS trader (
    id SERIAL PRIMARY KEY,
    namr VARCHAR(50),
    username VARCHAR(30) UNIQUE NOT NULL,
    password TEXT NOT NULL
);