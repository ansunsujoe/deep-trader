CREATE TABLE IF NOT EXISTS trader {
    ID INT NOT NULL,
    Name VARCHAR(20) UNIQUE NOT NULL,
    Password VARCHAR(30) NOT NULL
}