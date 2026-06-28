import { useState } from "react";
import GastoForm from "./GastoForm";
import { updateGasto, deleteGasto } from "../api";

export default function GastoLista({ gastos, onRefresh }) {
  const [editandoId, setEditandoId] = useState(null);

  const handleEdit = async (data) => {
    await updateGasto(editandoId, data);
    setEditandoId(null);
    onRefresh();
  };

  const handleDelete = async (id) => {
    if (!confirm("¿Eliminar este gasto?")) return;
    await deleteGasto(id);
    onRefresh();
  };

  if (gastos.length === 0)
    return <p className="empty">No hay gastos registrados.</p>;

  return (
    <div className="tabla-wrapper">
      <table className="tabla-gastos">
        <thead>
          <tr>
            <th>Fecha</th>
            <th>Categoría</th>
            <th>Descripción</th>
            <th>Importe</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {gastos.map((g) =>
            editandoId === g.id ? (
              <tr key={g.id}>
                <td colSpan={5}>
                  <GastoForm
                    inicial={g}
                    onSubmit={handleEdit}
                    onCancel={() => setEditandoId(null)}
                  />
                </td>
              </tr>
            ) : (
              <tr key={g.id}>
                <td>{g.fecha}</td>
                <td>
                  <span className={`badge cat-${g.categoria.toLowerCase().replace(/[^a-z]/g, "")}`}>
                    {g.categoria}
                  </span>
                </td>
                <td>{g.descripcion || <span className="muted">—</span>}</td>
                <td className="importe">{Number(g.importe).toFixed(2)} €</td>
                <td className="acciones">
                  <button className="btn-edit" onClick={() => setEditandoId(g.id)}>✏️</button>
                  <button className="btn-delete" onClick={() => handleDelete(g.id)}>🗑️</button>
                </td>
              </tr>
            )
          )}
        </tbody>
      </table>
    </div>
  );
}
