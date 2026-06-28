const BASE = "http://localhost:5000/api";

export async function getGastos(filtros = {}) {
  const params = new URLSearchParams();
  if (filtros.categoria) params.append("categoria", filtros.categoria);
  if (filtros.fecha_inicio) params.append("fecha_inicio", filtros.fecha_inicio);
  if (filtros.fecha_fin) params.append("fecha_fin", filtros.fecha_fin);
  const res = await fetch(`${BASE}/gastos?${params}`);
  return res.json();
}

export async function createGasto(data) {
  const res = await fetch(`${BASE}/gastos`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error((await res.json()).error);
  return res.json();
}

export async function updateGasto(id, data) {
  const res = await fetch(`${BASE}/gastos/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error((await res.json()).error);
  return res.json();
}

export async function deleteGasto(id) {
  const res = await fetch(`${BASE}/gastos/${id}`, { method: "DELETE" });
  if (!res.ok) throw new Error((await res.json()).error);
  return res.json();
}

export async function getResumen(filtros = {}) {
  const params = new URLSearchParams();
  if (filtros.fecha_inicio) params.append("fecha_inicio", filtros.fecha_inicio);
  if (filtros.fecha_fin) params.append("fecha_fin", filtros.fecha_fin);
  const res = await fetch(`${BASE}/resumen?${params}`);
  return res.json();
}

export async function getCategorias() {
  const res = await fetch(`${BASE}/categorias`);
  return res.json();
}

export function exportarCSV() {
  window.open(`${BASE}/exportar`, "_blank");
}
