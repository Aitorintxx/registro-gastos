import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";

ChartJS.register(ArcElement, Tooltip, Legend);

const COLORES = [
  "#6366f1", "#f59e0b", "#10b981", "#ef4444",
  "#3b82f6", "#8b5cf6", "#ec4899", "#14b8a6",
];

export default function Resumen({ resumen }) {
  if (!resumen || resumen.por_categoria.length === 0)
    return <p className="empty">Sin datos para mostrar.</p>;

  const data = {
    labels: resumen.por_categoria.map((r) => r.categoria),
    datasets: [
      {
        data: resumen.por_categoria.map((r) => r.total),
        backgroundColor: COLORES.slice(0, resumen.por_categoria.length),
        borderWidth: 2,
        borderColor: "#fff",
      },
    ],
  };

  return (
    <div className="resumen">
      <div className="resumen-total">
        Total gastado: <strong>{Number(resumen.total_general).toFixed(2)} €</strong>
      </div>

      <div className="resumen-grid">
        <div className="chart-container">
          <Pie data={data} options={{ plugins: { legend: { position: "right" } } }} />
        </div>

        <table className="tabla-resumen">
          <thead>
            <tr><th>Categoría</th><th>Total</th><th>%</th></tr>
          </thead>
          <tbody>
            {resumen.por_categoria.map((r, i) => (
              <tr key={r.categoria}>
                <td>
                  <span
                    className="dot"
                    style={{ background: COLORES[i % COLORES.length] }}
                  />
                  {r.categoria}
                </td>
                <td>{Number(r.total).toFixed(2)} €</td>
                <td>{((r.total / resumen.total_general) * 100).toFixed(1)}%</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
