import pytest


def test_resumen_vacio(client):
    res = client.get("/api/resumen")
    assert res.status_code == 200
    data = res.get_json()
    assert data["total_general"] == 0
    assert data["por_categoria"] == []


def test_resumen_una_categoria(client, gasto_ejemplo):
    client.post("/api/gastos", json={**gasto_ejemplo, "importe": 10})
    client.post("/api/gastos", json={**gasto_ejemplo, "importe": 20})

    res = client.get("/api/resumen")
    data = res.get_json()
    assert data["total_general"] == 30
    assert len(data["por_categoria"]) == 1
    assert data["por_categoria"][0]["categoria"] == "Alimentación"
    assert data["por_categoria"][0]["total"] == 30


def test_resumen_varias_categorias(client, gasto_ejemplo):
    client.post("/api/gastos", json={**gasto_ejemplo, "importe": 50, "categoria": "Alimentación"})
    client.post("/api/gastos", json={**gasto_ejemplo, "importe": 30, "categoria": "Transporte"})
    client.post("/api/gastos", json={**gasto_ejemplo, "importe": 20, "categoria": "Ocio"})

    res = client.get("/api/resumen")
    data = res.get_json()
    assert data["total_general"] == 100
    assert len(data["por_categoria"]) == 3

    categorias = {r["categoria"]: r["total"] for r in data["por_categoria"]}
    assert categorias["Alimentación"] == 50
    assert categorias["Transporte"] == 30
    assert categorias["Ocio"] == 20


def test_resumen_ordenado_por_total_desc(client, gasto_ejemplo):
    client.post("/api/gastos", json={**gasto_ejemplo, "importe": 10, "categoria": "Ocio"})
    client.post("/api/gastos", json={**gasto_ejemplo, "importe": 80, "categoria": "Alimentación"})
    client.post("/api/gastos", json={**gasto_ejemplo, "importe": 30, "categoria": "Transporte"})

    res = client.get("/api/resumen")
    data = res.get_json()
    totales = [r["total"] for r in data["por_categoria"]]
    assert totales == sorted(totales, reverse=True)


def test_resumen_filtro_fecha_inicio(client, gasto_ejemplo):
    client.post("/api/gastos", json={**gasto_ejemplo, "importe": 100, "fecha": "2026-01-01"})
    client.post("/api/gastos", json={**gasto_ejemplo, "importe": 50, "fecha": "2026-06-01"})

    res = client.get("/api/resumen?fecha_inicio=2026-03-01")
    data = res.get_json()
    assert data["total_general"] == 50


def test_resumen_filtro_fecha_fin(client, gasto_ejemplo):
    client.post("/api/gastos", json={**gasto_ejemplo, "importe": 100, "fecha": "2026-01-01"})
    client.post("/api/gastos", json={**gasto_ejemplo, "importe": 50, "fecha": "2026-06-01"})

    res = client.get("/api/resumen?fecha_fin=2026-03-01")
    data = res.get_json()
    assert data["total_general"] == 100
