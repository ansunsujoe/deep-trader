-- Create Database
CREATE DATABASE IF NOT EXISTS deep-trader;

-- For a single user
CREATE TABLE IF NOT EXISTS trader (
    ID INT NOT NULL,
    Full_Name VARCHAR(50),
    Username VARCHAR(30) UNIQUE NOT NULL,
    User_Password VARCHAR(30) NOT NULL
);