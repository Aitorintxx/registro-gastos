import pytest


def test_categorias_incluye_fijas(client):
    res = client.get("/api/categorias")
    assert res.status_code == 200
    data = res.get_json()
    for cat in ["Alimentación", "Transporte", "Ocio", "Salud", "Hogar", "Educación", "Otros"]:
        assert cat in data


def test_categorias_incluye_las_usadas(client, gasto_ejemplo):
    client.post("/api/gastos", json={**gasto_ejemplo, "categoria": "MiCategoria"})

    res = client.get("/api/categorias")
    data = res.get_json()
    assert "MiCategoria" in data


def test_categorias_sin_duplicados(client, gasto_ejemplo):
    client.post("/api/gastos", json={**gasto_ejemplo, "categoria": "Alimentación"})
    client.post("/api/gastos", json={**gasto_ejemplo, "categoria": "Alimentación"})

    res = client.get("/api/categorias")
    data = res.get_json()
    assert data.count("Alimentación") == 1


def test_categorias_ordenadas(client):
    res = client.get("/api/categorias")
    data = res.get_json()
    assert data == sorted(data)


def test_exportar_csv_status(client, gasto_ejemplo):
    client.post("/api/gastos", json=gasto_ejemplo)
    res = client.get("/api/exportar")
    assert res.status_code == 200
    assert "text/csv" in res.content_type


def test_exportar_csv_contiene_cabecera(client, gasto_ejemplo):
    client.post("/api/gastos", json=gasto_ejemplo)
    res = client.get("/api/exportar")
    contenido = res.data.decode("utf-8")
    assert "importe" in contenido
    assert "categoria" in contenido
    assert "fecha" in contenido


def test_exportar_csv_contiene_datos(client, gasto_ejemplo):
    client.post("/api/gastos", json=gasto_ejemplo)
    res = client.get("/api/exportar")
    contenido = res.data.decode("utf-8")
    assert "Alimentación" in contenido
    assert "Supermercado" in contenido
    assert "25.5" in contenido


def test_exportar_csv_vacio(client):
    res = client.get("/api/exportar")
    assert res.status_code == 200
    contenido = res.data.decode("utf-8")
    lineas = [l for l in contenido.strip().split("\n") if l]
    assert len(lineas) == 1
