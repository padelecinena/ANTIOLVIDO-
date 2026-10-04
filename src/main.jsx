import React, { useMemo, useState } from "react";
import { createRoot } from "react-dom/client";
import "./styles.css";

const MODELOS = ["P2JO", "L21", "P21", "B10"];
const ZONAS = ["2012", "2015", "2026", "2122", "2125"];
const TIPOS = [
  "ROBOT",
  "CADENA",
  "ASCENSOR",
  "PASTA",
  "PUNTOS SOLDADURA",
  "DEFORMACIÓNES / RAYAS / ENGATILLADOS"
];

const SEED = [
  { id: crypto.randomUUID(), modelo:"B10", zona:"2015", estacion:"5145", tipo:"ROBOT", descripcion:"R450_70: el robot no inicia ciclo; revisar habilitación y reset de seguridad.", solucion:"Comprobar cadena de seguridad, hacer reset del controlador y verificar habilitación de servos." },
  { id: crypto.randomUUID(), modelo:"B10", zona:"2015", estacion:"5145", tipo:"ROBOT", descripcion:"R450_70: fallo de comunicación con el PLC.", solucion:"Revisar cable Ethernet industrial, reiniciar comunicación y comprobar diagnóstico del PLC." },
  { id: crypto.randomUUID(), modelo:"B10", zona:"2015", estacion:"5145", tipo:"ROBOT", descripcion:"R450_70: pinza no alcanza posición de cierre.", solucion:"Comprobar sensores de posición y presión neumática; ajustar sensor si procede." }
];

function loadDefects() {
  try {
    const saved = JSON.parse(localStorage.getItem("antiolvido_defects") || "null");
    return Array.isArray(saved) ? saved : SEED;
  } catch {
    return SEED;
  }
}

function saveDefects(items) {
  localStorage.setItem("antiolvido_defects", JSON.stringify(items));
}

function App() {
  const [page, setPage] = useState("home");
  const [defects, setDefects] = useState(loadDefects);
  const [filters, setFilters] = useState({ modelo:"", zona:"", estacion:"", tipo:"" });
  const [solution, setSolution] = useState("");
  const [notice, setNotice] = useState("");

  const matches = useMemo(() => {
    const anyFilter = Object.values(filters).some(Boolean);
    if (!anyFilter) return [];
    return defects.filter(d =>
      (!filters.modelo || d.modelo === filters.modelo) &&
      (!filters.zona || d.zona === filters.zona) &&
      (!filters.estacion || d.estacion.toLowerCase().includes(filters.estacion.toLowerCase())) &&
      (!filters.tipo || d.tipo === filters.tipo)
    );
  }, [defects, filters]);

  const allFilled = filters.modelo && filters.zona && filters.estacion.trim() && filters.tipo;

  function update(key, value) {
    setFilters(f => ({...f, [key]: value}));
    setNotice("");
    if (key !== "estacion") setSolution("");
  }

  function addDefect() {
    if (!allFilled || !solution.trim()) return;
    const item = {
      id: crypto.randomUUID(),
      ...filters,
      estacion: filters.estacion.trim(),
      descripcion: `${filters.tipo} — ${filters.modelo} / ${filters.zona} / estación ${filters.estacion.trim()}`,
      solucion: solution.trim()
    };
    const next = [item, ...defects];
    setDefects(next);
    saveDefects(next);
    setSolution("");
    setNotice("Nueva avería guardada correctamente.");
  }

  function reset() {
    setFilters({ modelo:"", zona:"", estacion:"", tipo:"" });
    setSolution("");
    setNotice("");
  }

  return (
    <div className="app">
      <header className="topbar">
        <div className="brand" onClick={() => { reset(); setPage("home"); }}>
          <span className="brand-mark">A</span>
          <div><strong>ANTIOLVIDO</strong><small>Knowledge at the station</small></div>
        </div>
        {page !== "home" && <button className="ghost" onClick={() => { reset(); setPage("home"); }}>INICIO</button>}
      </header>

      <main>
        {page === "home" ? (
          <section className="home">
            <div className="hero">
              <span className="eyebrow">MANTENIMIENTO · PRODUCCIÓN</span>
              <h1>Que una avería no vuelva a<br/><span>perderse en el tiempo.</span></h1>
              <p>Consulta soluciones que ya funcionaron o registra una nueva para que el siguiente operario pueda encontrarla.</p>
            </div>
            <div className="home-grid">
              <button className="big-card primary" onClick={() => setPage("fault")}>
                <span className="card-number">01</span>
                <span className="card-icon">⚙</span>
                <strong>AVERÍA</strong>
                <small>Buscar o registrar un defecto</small>
                <span className="arrow">→</span>
              </button>
              <button className="big-card" onClick={() => setPage("history")}>
                <span className="card-number">02</span>
                <span className="card-icon">◷</span>
                <strong>HISTORIAL</strong>
                <small>Consultar todas las averías registradas</small>
                <span className="arrow">→</span>
              </button>
            </div>
          </section>
        ) : page === "history" ? (
          <section className="panel">
            <div className="section-head">
              <div><span className="eyebrow">BASE DE CONOCIMIENTO</span><h2>Historial</h2></div>
              <span className="count">{defects.length} averías</span>
            </div>
            <div className="history-list">
              {defects.map(d => (
                <article className="history-item" key={d.id}>
                  <div className="chips"><span>{d.modelo}</span><span>{d.zona}</span><span>EST. {d.estacion}</span><span>{d.tipo}</span></div>
                  <h3>{d.descripcion}</h3>
                  <p><b>SOLUCIÓN</b> {d.solucion}</p>
                </article>
              ))}
            </div>
          </section>
        ) : (
          <section className="panel">
            <div className="section-head">
              <div><span className="eyebrow">NUEVA CONSULTA</span><h2>Avería</h2></div>
              {notice && <div className="notice">{notice}</div>}
            </div>

            <div className="form-grid">
              <label>1 · MODELO
                <select value={filters.modelo} onChange={e => update("modelo", e.target.value)}>
                  <option value="">Selecciona modelo</option>
                  {MODELOS.map(x => <option key={x}>{x}</option>)}
                </select>
              </label>
              <label>2 · ZONA
                <select value={filters.zona} onChange={e => update("zona", e.target.value)}>
                  <option value="">Selecciona zona</option>
                  {ZONAS.map(x => <option key={x}>{x}</option>)}
                </select>
              </label>
              <label>3 · ESTACIÓN
                <input value={filters.estacion} onChange={e => update("estacion", e.target.value)} placeholder="Ej. 5145" />
              </label>
              <label>4 · TIPO DE AVERÍA
                <select value={filters.tipo} onChange={e => update("tipo", e.target.value)}>
                  <option value="">Selecciona tipo</option>
                  {TIPOS.map((x,i) => <option key={x} value={x}>{i+1} · {x}</option>)}
                </select>
              </label>
            </div>

            <div className="results-head">
              <h3>{Object.values(filters).some(Boolean) ? "Resultados encontrados" : "Rellena los filtros para buscar"}</h3>
              {allFilled && <span>{matches.length} coincidencias</span>}
            </div>

            {matches.length > 0 ? (
              <div className="results">
                {matches.map((d, i) => (
                  <article className="result" key={d.id}>
                    <div className="result-top"><span>#{String(i+1).padStart(2,"0")}</span><span>{d.modelo} · {d.zona} · EST. {d.estacion}</span></div>
                    <h3>{d.descripcion}</h3>
                    <div className="solution"><b>SOLUCIÓN</b><p>{d.solucion}</p></div>
                  </article>
                ))}
              </div>
            ) : allFilled ? (
              <div className="new-solution">
                <div className="empty-icon">+</div>
                <div><h3>No hay ninguna avería registrada con estos filtros.</h3><p>Escribe la solución para que quede disponible para el siguiente operario.</p></div>
                <textarea value={solution} onChange={e => setSolution(e.target.value)} placeholder="Describe paso a paso cómo se solucionó..." />
                <button className="save" disabled={!solution.trim()} onClick={addDefect}>GUARDAR NUEVA AVERÍA <span>→</span></button>
              </div>
            ) : null}
          </section>
        )}
      </main>
    </div>
  );
}

createRoot(document.getElementById("root")).render(<App />);
