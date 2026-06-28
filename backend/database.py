import sqlite3
import os

DB_PATH = os.path.join(os.path.dirname(__file__), "gastos.db")


def get_db():
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    return conn


def init_db():
    db = get_db()
    db.execute("""
        CREATE TABLE IF NOT EXISTS gastos (
            id          INTEGER PRIMARY KEY AUTOINCREMENT,
            importe     REAL    NOT NULL,
            categoria   TEXT    NOT NULL,
            descripcion TEXT    DEFAULT '',
            fecha       TEXT    NOT NULL
        )
    """)
    db.commit()
    db.close()
