from flask import Flask, jsonify, request
from flask_cors import CORS
from database import init_db, get_db

app = Flask(__name__)
CORS(app)

init_db()


@app.route("/api/gastos", methods=["GET"])
def get_gastos():
    categoria = request.args.get("categoria")
    fecha_inicio = request.args.get("fecha_inicio")
    fecha_fin = request.args.get("fecha_fin")

    db = get_db()
    query = "SELECT * FROM gastos WHERE 1=1"
    params = []

    if categoria:
        query += " AND categoria = ?"
        params.append(categoria)
    if fecha_inicio:
        query += " AND fecha >= ?"
        params.append(fecha_inicio)
    if fecha_fin:
        query += " AND fecha <= ?"
        params.append(fecha_fin)

    query += " ORDER BY fecha DESC"
    gastos = db.execute(query, params).fetchall()
    db.close()
    return jsonify([dict(g) for g in gastos])


@app.route("/api/gastos", methods=["POST"])
def create_gasto():
    data = request.get_json()
    if not data or not all(k in data for k in ("importe", "categoria", "fecha")):
        return jsonify({"error": "Faltan campos obligatorios"}), 400
    if data["importe"] <= 0:
        return jsonify({"error": "El importe debe ser mayor que 0"}), 400

    db = get_db()
    cursor = db.execute(
        "INSERT INTO gastos (importe, categoria, descripcion, fecha) VALUES (?, ?, ?, ?)",
        (data["importe"], data["categoria"], data.get("descripcion", ""), data["fecha"]),
    )
    db.commit()
    gasto = db.execute("SELECT * FROM gastos WHERE id = ?", (cursor.lastrowid,)).fetchone()
    db.close()
    return jsonify(dict(gasto)), 201


@app.route("/api/gastos/<int:gasto_id>", methods=["PUT"])
def update_gasto(gasto_id):
    data = request.get_json()
    db = get_db()
    existing = db.execute("SELECT * FROM gastos WHERE id = ?", (gasto_id,)).fetchone()
    if not existing:
        db.close()
        return jsonify({"error": "Gasto no encontrado"}), 404
    if data.get("importe") is not None and data["importe"] <= 0:
        db.close()
        return jsonify({"error": "El importe debe ser mayor que 0"}), 400

    importe = data.get("importe", existing["importe"])
    categoria = data.get("categoria", existing["categoria"])
    descripcion = data.get("descripcion", existing["descripcion"])
    fecha = data.get("fecha", existing["fecha"])

    db.execute(
        "UPDATE gastos SET importe=?, categoria=?, descripcion=?, fecha=? WHERE id=?",
        (importe, categoria, descripcion, fecha, gasto_id),
    )
    db.commit()
    gasto = db.execute("SELECT * FROM gastos WHERE id = ?", (gasto_id,)).fetchone()
    db.close()
    return jsonify(dict(gasto))


@app.route("/api/gastos/<int:gasto_id>", methods=["DELETE"])
def delete_gasto(gasto_id):
    db = get_db()
    existing = db.execute("SELECT * FROM gastos WHERE id = ?", (gasto_id,)).fetchone()
    if not existing:
        db.close()
        return jsonify({"error": "Gasto no encontrado"}), 404
    db.execute("DELETE FROM gastos WHERE id = ?", (gasto_id,))
    db.commit()
    db.close()
    return jsonify({"message": "Gasto eliminado"}), 200


@app.route("/api/resumen", methods=["GET"])
def get_resumen():
    fecha_inicio = request.args.get("fecha_inicio")
    fecha_fin = request.args.get("fecha_fin")

    db = get_db()
    query = "SELECT categoria, SUM(importe) as total FROM gastos WHERE 1=1"
    params = []

    if fecha_inicio:
        query += " AND fecha >= ?"
        params.append(fecha_inicio)
    if fecha_fin:
        query += " AND fecha <= ?"
        params.append(fecha_fin)

    query += " GROUP BY categoria ORDER BY total DESC"
    resumen = db.execute(query, params).fetchall()
    total_general = db.execute(
        "SELECT SUM(importe) as total FROM gastos WHERE 1=1" +
        (" AND fecha >= ?" if fecha_inicio else "") +
        (" AND fecha <= ?" if fecha_fin else ""),
        params
    ).fetchone()
    db.close()
    return jsonify({
        "por_categoria": [dict(r) for r in resumen],
        "total_general": total_general["total"] or 0,
    })


@app.route("/api/categorias", methods=["GET"])
def get_categorias():
    db = get_db()
    rows = db.execute("SELECT DISTINCT categoria FROM gastos ORDER BY categoria").fetchall()
    db.close()
    categorias_fijas = ["Alimentación", "Transporte", "Ocio", "Salud", "Hogar", "Educación", "Otros"]
    usadas = [r["categoria"] for r in rows]
    todas = sorted(set(categorias_fijas + usadas))
    return jsonify(todas)


@app.route("/api/exportar", methods=["GET"])
def exportar_csv():
    import csv, io
    db = get_db()
    gastos = db.execute("SELECT * FROM gastos ORDER BY fecha DESC").fetchall()
    db.close()

    output = io.StringIO()
    writer = csv.writer(output)
    writer.writerow(["id", "importe", "categoria", "descripcion", "fecha"])
    for g in gastos:
        writer.writerow([g["id"], g["importe"], g["categoria"], g["descripcion"], g["fecha"]])

    from flask import Response
    return Response(
        output.getvalue(),
        mimetype="text/csv",
        headers={"Content-Disposition": "attachment; filename=gastos.csv"},
    )


if __name__ == "__main__":
    app.run(debug=True, port=5000)
