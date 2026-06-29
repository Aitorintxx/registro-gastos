import pytest
import os
from database import init_db, get_db


def test_init_db_crea_tabla(tmp_path, monkeypatch):
    db_file = tmp_path / "test.db"
    monkeypatch.setattr("database.DB_PATH", str(db_file))
    import database
    database.DB_PATH = str(db_file)

    init_db()

    assert os.path.exists(str(db_file))
    db = get_db()
    tablas = db.execute("SELECT name FROM sqlite_master WHERE type='table'").fetchall()
    nombres = [t["name"] for t in tablas]
    db.close()
    assert "gastos" in nombres


def test_init_db_idempotente(tmp_path, monkeypatch):
    db_file = tmp_path / "test.db"
    monkeypatch.setattr("database.DB_PATH", str(db_file))
    import database
    database.DB_PATH = str(db_file)

    init_db()
    init_db()

    db = get_db()
    tablas = db.execute("SELECT name FROM sqlite_master WHERE type='table' AND name='gastos'").fetchall()
    db.close()
    assert len(tablas) == 1


def test_get_db_devuelve_conexion(tmp_path, monkeypatch):
    db_file = tmp_path / "test.db"
    monkeypatch.setattr("database.DB_PATH", str(db_file))
    import database
    database.DB_PATH = str(db_file)
    init_db()

    db = get_db()
    assert db is not None
    db.close()


def test_tabla_gastos_tiene_columnas_correctas(tmp_path, monkeypatch):
    db_file = tmp_path / "test.db"
    monkeypatch.setattr("database.DB_PATH", str(db_file))
    import database
    database.DB_PATH = str(db_file)
    init_db()

    db = get_db()
    cols = db.execute("PRAGMA table_info(gastos)").fetchall()
    nombres = [c["name"] for c in cols]
    db.close()

    assert "id" in nombres
    assert "importe" in nombres
    assert "categoria" in nombres
    assert "descripcion" in nombres
    assert "fecha" in nombres
