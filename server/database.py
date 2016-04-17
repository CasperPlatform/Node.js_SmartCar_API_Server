import sqlite3

def connect():
    return sqlite3.connect('/home/pi/CASPER/db.db', detect_types=sqlite3.PARSE_DECLTYPES)
