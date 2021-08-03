import psycopg2, os
import logging
from deep_trader import market_data as md
from decimal import Decimal
from datetime import datetime

logger = logging.getLogger(__name__)

table_names = {
    "trader": "trader(id, name, username, password, cash, admin)",
    "ticker": "ticker(id, name)",
    "quote": "quote(id, ticker_id, time, price, is_current)",
    "transaction": "transaction(id, trader_id, ticker_id, action, price, shares, time)",
    "watchlist": "watchlist(id, trader_id, name)",
    "watchlist_item": "watchlist_item(id, trader_id, watchlist_id, ticker_id)",
    "asset": "asset(id, trader_id, ticker_id, shares)"
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
            if isinstance(val, int) or isinstance(val, float):
                str_array.append(str(val))
            else:
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
        cash = 20000
        
        # Construct query
        values = f"{names_str}, crypt({password_str}, gen_salt(\'bf\')), {cash}, FALSE"
        cur.execute(f"INSERT INTO {table} VALUES (DEFAULT, {values});")
        conn.commit()
        
    def run_insert(self, table, data, conn=None, cur=None, commit=True):
        # Get connections
        if conn is None:
            conn, cur = self.get_connection()
        table_name = table_names.get(table)
        
        # Create query
        values = self.value_string(data)
        cur.execute(f"INSERT INTO {table_name} VALUES (DEFAULT, {values}) RETURNING id;")
        data = cur.fetchall()
        if commit:
            conn.commit()
        
        # Return ID
        return data[0][0]
    
    def run_update(self, query):
        # Get connections
        conn, cur = self.get_connection()
        
        # Execute and commit query
        cur.execute(query)
        conn.commit()
        
    def authenticate_user(self, trader_info):
        username = self.value_string([trader_info.get("username")])
        password = self.value_string([trader_info.get("password")])
        data = self.run_select(f"SELECT id FROM trader WHERE username = {username} AND password = crypt({password}, password);")
        logger.debug(f"LOGIN: User found has ID {data}")
        if len(data) == 0:
            return
        else:
            return data[0][0]
        
    def edit_asset(self, trader_id, ticker_id, new_shares):
        value_string = self.value_string([trader_id, ticker_id, new_shares])
        query = f"""
        UPDATE asset SET shares = {new_shares}
        WHERE trader_id = {trader_id}
        AND ticker_id = {ticker_id}; 
        IF NOT FOUND THEN 
        INSERT INTO {table_names.get("asset")} values (DEFAULT, {value_string}); 
        END IF; 
        """
        self.run_update(query)
        
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
        return data
        
    def select_all(self, table):
        _, cur = self.get_connection()
        cur.execute(f"SELECT * FROM {table}")
        data = cur.fetchall()
        if len(data) == 0:
            return data
        return data
    
    def run_select(self, query):
        _, cur = self.get_connection()
        cur.execute(query)
        data = cur.fetchall()
        if len(data) == 0:
            return data
        return data
    
    def run_select_one(self, query):
        _, cur = self.get_connection()
        cur.execute(query)
        data = cur.fetchone()
        return data
    
    def init_stock_data(self, ticker_fp):
        with open(ticker_fp, "r") as f:
            tickers = f.read().split("\n")
            for ticker in tickers:
                ticker_data = md.read_intraday(ticker)
                ticker_id = self.run_insert("ticker", data=[ticker])
                is_current = True
                for quote in ticker_data:
                    time = quote.get("time")
                    price = quote.get("price")
                    self.run_insert("quote", [ticker_id, time, price, is_current])
                    is_current = False
                    
    def is_empty(self, table):
        if len(self.select_all(table)) == 0:
            return True
        return False
    
    def to_dict(self, data, keys):
        array = []
        for entry in data:
            dictionary = {}
            for i in range(len(keys)):
                val = entry[i]
                if isinstance(val, Decimal):
                    dictionary[keys[i]] = float(val)
                if isinstance(val, datetime):
                    dictionary[keys[i]] = str(val)
                else:
                    dictionary[keys[i]] = val
            array.append(dictionary)
        return array