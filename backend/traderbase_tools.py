import psycopg2, os

def get_connection():
    try:
        connection_string = os.environ.get("DATABASE_URL")
        conn = psycopg2.connect(connection_string)
        cur = conn.cursor()
    except Exception as error:
        print(error)
        exit()
    return conn, cur

def value_string(array):
    str_array = []
    for val in array:
        str_array.append(f"\'{val}\'")
    return ",".join(str_array)

def clear_table(table_name):
    conn, cur = get_connection()
    cur.execute(f"DELETE FROM {table_name};")
    conn.commit()
    return

def insert_user(trader_info):
    conn, cur = get_connection()
    table = "trader(name, username, password)"
    
    # Get value strings
    names_str = value_string([trader_info.get("name"), trader_info.get("username")])
    password_str = value_string([trader_info.get("password")])
    
    # Construct query
    values = f"{value_string(names_str)}, crypt({password_str}, gen_salt(\'bf\'))"
    cur.execute(f"INSERT INTO {table} VALUES ({values});")
    conn.commit()
    
def select(attributes, table):
    _, cur = get_connection()
    
def select_all(table):
    _, cur = get_connection()
    cur.execute(f"SELECT * FROM {table}")
    data = cur.fetchall()
    return data
    