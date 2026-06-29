import pytest
import json


def test_get_gastos_lista_vacia(client):
    res = client.get("/api/gastos")
    assert res.status_code == 200
    assert res.get_json() == []


def test_crear_gasto_correcto(client, gasto_ejemplo):
    res = client.post("/api/gastos", json=gasto_ejemplo)
    assert res.status_code == 201
    data = res.get_json()
    assert data["importe"] == gasto_ejemplo["importe"]
    assert data["categoria"] == gasto_ejemplo["categoria"]
    assert data["descripcion"] == gasto_ejemplo["descripcion"]
    assert data["fecha"] == gasto_ejemplo["fecha"]
    assert "id" in data


def test_crear_gasto_sin_importe(client):
    res = client.post("/api/gastos", json={"categoria": "Ocio", "fecha": "2026-06-01"})
    assert res.status_code == 400


def test_crear_gasto_importe_cero(client):
    res = client.post("/api/gastos", json={"importe": 0, "categoria": "Ocio", "fecha": "2026-06-01"})
    assert res.status_code == 400


def test_crear_gasto_importe_negativo(client):
    res = client.post("/api/gastos", json={"importe": -5, "categoria": "Ocio", "fecha": "2026-06-01"})
    assert res.status_code == 400


def test_crear_gasto_sin_categoria(client):
    res = client.post("/api/gastos", json={"importe": 10, "fecha": "2026-06-01"})
    assert res.status_code == 400


def test_crear_gasto_sin_fecha(client):
    res = client.post("/api/gastos", json={"importe": 10, "categoria": "Ocio"})
    assert res.status_code == 400


def test_get_gastos_devuelve_creados(client, gasto_ejemplo):
    client.post("/api/gastos", json=gasto_ejemplo)
    client.post("/api/gastos", json={**gasto_ejemplo, "importe": 10, "categoria": "Transporte"})

    res = client.get("/api/gastos")
    assert res.status_code == 200
    data = res.get_json()
    assert len(data) == 2


def test_filtro_por_categoria(client, gasto_ejemplo):
    client.post("/api/gastos", json=gasto_ejemplo)
    client.post("/api/gastos", json={**gasto_ejemplo, "categoria": "Transporte"})

    res = client.get("/api/gastos?categoria=Alimentación")
    data = res.get_json()
    assert len(data) == 1
    assert data[0]["categoria"] == "Alimentación"


def test_filtro_por_fecha_inicio(client, gasto_ejemplo):
    client.post("/api/gastos", json={**gasto_ejemplo, "fecha": "2026-01-01"})
    client.post("/api/gastos", json={**gasto_ejemplo, "fecha": "2026-06-01"})

    res = client.get("/api/gastos?fecha_inicio=2026-03-01")
    data = res.get_json()
    assert len(data) == 1
    assert data[0]["fecha"] == "2026-06-01"


def test_filtro_por_fecha_fin(client, gasto_ejemplo):
    client.post("/api/gastos", json={**gasto_ejemplo, "fecha": "2026-01-01"})
    client.post("/api/gastos", json={**gasto_ejemplo, "fecha": "2026-06-01"})

    res = client.get("/api/gastos?fecha_fin=2026-03-01")
    data = res.get_json()
    assert len(data) == 1
    assert data[0]["fecha"] == "2026-01-01"


def test_filtro_combinado(client, gasto_ejemplo):
    client.post("/api/gastos", json={**gasto_ejemplo, "fecha": "2026-01-01", "categoria": "Ocio"})
    client.post("/api/gastos", json={**gasto_ejemplo, "fecha": "2026-06-01", "categoria": "Alimentación"})
    client.post("/api/gastos", json={**gasto_ejemplo, "fecha": "2026-06-15", "categoria": "Alimentación"})

    res = client.get("/api/gastos?categoria=Alimentación&fecha_inicio=2026-05-01&fecha_fin=2026-06-10")
    data = res.get_json()
    assert len(data) == 1
    assert data[0]["fecha"] == "2026-06-01"


def test_actualizar_gasto(client, gasto_ejemplo):
    crear = client.post("/api/gastos", json=gasto_ejemplo)
    gasto_id = crear.get_json()["id"]

    res = client.put(f"/api/gastos/{gasto_id}", json={"importe": 99.99, "descripcion": "Actualizado"})
    assert res.status_code == 200
    data = res.get_json()
    assert data["importe"] == 99.99
    assert data["descripcion"] == "Actualizado"
    assert data["categoria"] == gasto_ejemplo["categoria"]


def test_actualizar_gasto_no_existente(client):
    res = client.put("/api/gastos/9999", json={"importe": 10})
    assert res.status_code == 404


def test_actualizar_gasto_importe_invalido(client, gasto_ejemplo):
    crear = client.post("/api/gastos", json=gasto_ejemplo)
    gasto_id = crear.get_json()["id"]

    res = client.put(f"/api/gastos/{gasto_id}", json={"importe": -1})
    assert res.status_code == 400


def test_eliminar_gasto(client, gasto_ejemplo):
    crear = client.post("/api/gastos", json=gasto_ejemplo)
    gasto_id = crear.get_json()["id"]

    res = client.delete(f"/api/gastos/{gasto_id}")
    assert res.status_code == 200

    res_lista = client.get("/api/gastos")
    assert res_lista.get_json() == []


def test_eliminar_gasto_no_existente(client):
    res = client.delete("/api/gastos/9999")
    assert res.status_code == 404


def test_gastos_ordenados_por_fecha_desc(client, gasto_ejemplo):
    client.post("/api/gastos", json={**gasto_ejemplo, "fecha": "2026-01-01"})
    client.post("/api/gastos", json={**gasto_ejemplo, "fecha": "2026-06-15"})
    client.post("/api/gastos", json={**gasto_ejemplo, "fecha": "2026-03-10"})

    res = client.get("/api/gastos")
    data = res.get_json()
    fechas = [g["fecha"] for g in data]
    assert fechas == sorted(fechas, reverse=True)
