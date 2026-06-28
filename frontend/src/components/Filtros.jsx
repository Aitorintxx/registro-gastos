import { useEffect, useState } from "react";
import { getCategorias } from "../api";

export default function Filtros({ filtros, onChange }) {
  const [categorias, setCategorias] = useState([]);

  useEffect(() => {
    getCategorias().then(setCategorias);
  }, []);

  const handle = (e) => onChange({ ...filtros, [e.target.name]: e.target.value });

  return (
    <div className="filtros">
      <select name="categoria" value={filtros.categoria} onChange={handle}>
        <option value="">Todas las categorías</option>
        {categorias.map((c) => (
          <option key={c} value={c}>{c}</option>
        ))}
      </select>

      <label>Desde
        <input type="date" name="fecha_inicio" value={filtros.fecha_inicio} onChange={handle} />
      </label>

      <label>Hasta
        <input type="date" name="fecha_fin" value={filtros.fecha_fin} onChange={handle} />
      </label>

      <button
        className="btn-secondary"
        onClick={() => onChange({ categoria: "", fecha_inicio: "", fecha_fin: "" })}
      >
        Limpiar
      </button>
    </div>
  );
}
