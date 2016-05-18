import sqlite3

def connect():
    return sqlite3.connect('/root/db.db', detect_types=sqlite3.PARSE_DECLTYPES)
