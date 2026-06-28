import { useState, useEffect } from "react";
import { getCategorias } from "../api";

export default function GastoForm({ onSubmit, inicial = null, onCancel }) {
  const hoy = new Date().toISOString().split("T")[0];
  const [form, setForm] = useState(
    inicial ?? { importe: "", categoria: "Otros", descripcion: "", fecha: hoy }
  );
  const [categorias, setCategorias] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    getCategorias().then(setCategorias);
  }, []);

  const handleChange = (e) =>
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (!form.importe || Number(form.importe) <= 0) {
      setError("El importe debe ser mayor que 0");
      return;
    }
    try {
      await onSubmit({ ...form, importe: Number(form.importe) });
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="gasto-form">
      {error && <div className="form-error">{error}</div>}

      <div className="form-row">
        <label>Importe (€)
          <input
            type="number"
            name="importe"
            step="0.01"
            min="0.01"
            value={form.importe}
            onChange={handleChange}
            required
          />
        </label>

        <label>Categoría
          <select name="categoria" value={form.categoria} onChange={handleChange}>
            {categorias.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </label>

        <label>Fecha
          <input
            type="date"
            name="fecha"
            value={form.fecha}
            onChange={handleChange}
            required
          />
        </label>
      </div>

      <label>Descripción
        <input
          type="text"
          name="descripcion"
          value={form.descripcion}
          onChange={handleChange}
          placeholder="Opcional"
        />
      </label>

      <div className="form-actions">
        <button type="submit" className="btn-primary">
          {inicial ? "Guardar cambios" : "Añadir gasto"}
        </button>
        {onCancel && (
          <button type="button" className="btn-secondary" onClick={onCancel}>
            Cancelar
          </button>
        )}
      </div>
    </form>
  );
}
