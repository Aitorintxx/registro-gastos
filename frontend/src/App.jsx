import { useEffect, useState } from "react";
import GastoForm from "./components/GastoForm";
import GastoLista from "./components/GastoLista";
import Filtros from "./components/Filtros";
import Resumen from "./components/Resumen";
import { getGastos, createGasto, getResumen, exportarCSV } from "./api";
import "./App.css";

export default function App() {
  const [tab, setTab] = useState("gastos");
  const [gastos, setGastos] = useState([]);
  const [resumen, setResumen] = useState(null);
  const [filtros, setFiltros] = useState({ categoria: "", fecha_inicio: "", fecha_fin: "" });
  const [mostrarForm, setMostrarForm] = useState(false);

  const cargar = async () => {
    const [g, r] = await Promise.all([getGastos(filtros), getResumen(filtros)]);
    setGastos(g);
    setResumen(r);
  };

  useEffect(() => { cargar(); }, [filtros]);

  const handleCrear = async (data) => {
    await createGasto(data);
    setMostrarForm(false);
    cargar();
  };

  return (
    <div className="app">
      <header className="app-header">
        <h1>💸 Registro de Gastos</h1>
        <div className="header-actions">
          <button className="btn-primary" onClick={() => setMostrarForm((v) => !v)}>
            {mostrarForm ? "✕ Cancelar" : "+ Nuevo gasto"}
          </button>
          <button className="btn-secondary" onClick={exportarCSV}>
            ⬇ Exportar CSV
          </button>
        </div>
      </header>

      {mostrarForm && (
        <section className="card">
          <h2>Nuevo gasto</h2>
          <GastoForm onSubmit={handleCrear} onCancel={() => setMostrarForm(false)} />
        </section>
      )}

      <Filtros filtros={filtros} onChange={setFiltros} />

      <nav className="tabs">
        <button
          className={tab === "gastos" ? "tab active" : "tab"}
          onClick={() => setTab("gastos")}
        >
          Gastos ({gastos.length})
        </button>
        <button
          className={tab === "resumen" ? "tab active" : "tab"}
          onClick={() => setTab("resumen")}
        >
          Resumen
        </button>
      </nav>

      <section className="card">
        {tab === "gastos" ? (
          <GastoLista gastos={gastos} onRefresh={cargar} />
        ) : (
          <Resumen resumen={resumen} />
        )}
      </section>
    </div>
  );
}
