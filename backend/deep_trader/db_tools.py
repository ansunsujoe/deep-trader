import psycopg2, os
import logging
import market_data as md

logger = logging.getLogger(__name__)

table_names = {
    "trader": "trader(id, name, username, password)",
    "ticker": "ticker(id, name)",
    "quote": "quote(id, ticker_id, time, price)",
    "transaction": "transaction(id, trader_id, ticker_id, action, price, time)",
    "watchlist": "watchlist(id, trader_id, name)",
    "watchlist_item": "watchlist_item(id, trader_id, watchlist_id, ticker_id)"
}

class Database():
    def __init__(self):
        pass

    def get_connection(self):
        try:
            connection_string = os.environ.get("DATABASE_URL")
            conn = psycopg2.connect(connection_string)
            cur = conn.cursor()
        except Exception as error:
            logger.error(error)
        return conn, cur

    def value_string(self, array):
        str_array = []
        for val in array:
            str_array.append(f"\'{val}\'")
        return ",".join(str_array)

    def clear_table(self, table_name):
        conn, cur = self.get_connection()
        cur.execute(f"DELETE FROM {table_name};")
        conn.commit()
        return

    def insert_user(self, trader_info):
        conn, cur = self.get_connection()
        table = table_names.get("trader")
        
        # Get value strings
        names_str = self.value_string([trader_info.get("name"), trader_info.get("username")])
        password_str = self.value_string([trader_info.get("password")])
        
        # Construct query
        values = f"{names_str}, crypt({password_str}, gen_salt(\'bf\'))"
        cur.execute(f"INSERT INTO {table} VALUES ({values});")
        conn.commit()
        
    def run_insert(self, table, data):
        # Get connections
        conn, cur = self.get_connection()
        table_name = table_names.get(table)
        
        # Create query
        values = ",".join(data)
        cur.execute(f"INSERT INTO {table_name} VALUES (DEFAULT, {values}) RETURNING id;")
        data = cur.fetchall()
        conn.commit()
        
        # Return ID
        return data[0][0]
        
    def authenticate_user(self, trader_info):
        username = trader_info.get("username")
        password = trader_info.get("password")
        data = self.run_select(f"SELECT id FROM trader WHERE username = {username} AND password = crypt({password}, password);")
        if len(data) == 0:
            return
        else:
            return data[0]
        
    def select_conditions(self, table, attributes, conditions):
        _, cur = self.get_connection()
        attribute_str = ",".join(attributes)
        conditions_str = " AND ".join(conditions)
        cur.execute(f"SELECT {attribute_str} FROM {table} WHERE {conditions_str};")
        data = cur.fetchall()
        return data
    
    def select(self, table, attributes):
        _, cur = self.get_connection()
        attribute_str = ",".join(attributes)
        cur.execute(f"SELECT {attribute_str} FROM {table};")
        data = cur.fetchall()
        return data[0]
        
    def select_all(self, table):
        _, cur = self.get_connection()
        cur.execute(f"SELECT * FROM {table}")
        data = cur.fetchall()
        return data[0]
    
    def run_select(self, query):
        _, cur = self.get_connection()
        cur.execute(query)
        data = cur.fetchall()
        return data[0]
    
    def init_stock_data(self, ticker_fp):
        with open(ticker_fp, "r") as f:
            tickers = f.read().split("\n")
            for ticker in tickers:
                ticker_data = md.read_intraday(ticker)
                ticker_id = self.run_insert("ticker", data=[ticker])
                for quote in ticker_data:
                    time = quote.get("time")
                    price = quote.get("price")
                    self.run_insert("quote", [ticker_id, time, price])
                    
    def is_empty(self, table):
        if len(self.select_all(table)) == 0:
            return True
        return False
    
    def to_dict(data, keys):
        array = []
        for entry in data:
            dictionary = {}
            for i in range(len(keys)):
                dictionary[keys[i]] = entry[i]
        return array