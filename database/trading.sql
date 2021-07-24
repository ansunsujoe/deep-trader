-- Crypt extension
CREATE EXTENSION pgcrypto;

-- Create Database
CREATE DATABASE IF NOT EXISTS deep_trader;

-- For a single user
CREATE TABLE IF NOT EXISTS trader (
    id SERIAL PRIMARY KEY,
    namr VARCHAR(50),
    username VARCHAR(30) UNIQUE NOT NULL,
    password TEXT NOT NULL
);