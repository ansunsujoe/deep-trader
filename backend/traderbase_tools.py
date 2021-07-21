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

def clear_table(table_name):
    conn, cur = get_connection()
    cur.execute(f"DELETE FROM {table_name};")
    conn.commit()
    return