import pytest
import sys
import os

sys.path.insert(0, os.path.dirname(os.path.dirname(__file__)))

from app import app as flask_app
from database import init_db, get_db, DB_PATH


@pytest.fixture
def app(tmp_path, monkeypatch):
    db_file = tmp_path / "test_gastos.db"
    monkeypatch.setattr("database.DB_PATH", str(db_file))
    monkeypatch.setattr("app.DB_PATH", str(db_file), raising=False)

    import database
    database.DB_PATH = str(db_file)
    init_db()

    flask_app.config["TESTING"] = True
    yield flask_app


@pytest.fixture
def client(app):
    return app.test_client()


@pytest.fixture
def gasto_ejemplo():
    return {
        "importe": 25.50,
        "categoria": "Alimentación",
        "descripcion": "Supermercado",
        "fecha": "2026-06-01",
    }
