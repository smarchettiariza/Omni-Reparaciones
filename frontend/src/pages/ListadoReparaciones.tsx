import { useEffect, useState, type FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { getReparaciones } from "../api/client";
import type { EstadoReparacion, ReparacionResponseDTO } from "../types";

const ESTADOS: { value: EstadoReparacion | ""; label: string }[] = [
  { value: "", label: "Todos los estados" },
  { value: "RECIBIDO", label: "Recibido" },
  { value: "DIAGNOSTICO", label: "Diagnóstico" },
  { value: "REPARACION", label: "Reparación" },
  { value: "REPARADO", label: "Reparado" },
  { value: "LISTO_PARA_RETIRAR", label: "Listo para retirar" },
  { value: "ENTREGADO", label: "Entregado" },
  { value: "NO_REPARADO", label: "No reparado" },
  { value: "CANCELADO", label: "Cancelado" },
];

const ESTADO_STYLES: Record<EstadoReparacion, string> = {
  RECIBIDO: "bg-line text-ink",
  DIAGNOSTICO: "bg-copper-light text-copper",
  REPARACION: "bg-copper-light text-copper",
  REPARADO: "bg-brand-light text-brand-dark",
  LISTO_PARA_RETIRAR: "bg-brand text-white",
  ENTREGADO: "bg-line text-muted",
  NO_REPARADO: "bg-danger-light text-danger",
  CANCELADO: "bg-danger-light text-danger",
};

function formatFecha(iso: string) {
  const d = new Date(iso);
  return d.toLocaleDateString("es-AR", { day: "2-digit", month: "2-digit" });
}

export default function ListadoReparaciones() {
  const navigate = useNavigate();
  const [reparaciones, setReparaciones] = useState<ReparacionResponseDTO[]>([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [texto, setTexto] = useState("");
  const [estado, setEstado] = useState<EstadoReparacion | "">("");

  const buscar = async () => {
    setCargando(true);
    setError(null);
    try {
      const params: Record<string, string> = {};
      // "texto" busca a la vez por cliente, IMEI y marca/modelo: el backend
      // acepta cada filtro por separado, asi que lo mandamos en los tres.
      if (texto.trim()) {
        params.cliente = texto.trim();
        params.imei = texto.trim();
        params.marcaModelo = texto.trim();
      }
      if (estado) params.estado = estado;

      const resultados = await getReparaciones(params);

      // Si el texto no coincidio por cliente pero si por imei o marca (o viceversa),
      // el backend con AND de todos los filtros devolveria vacio. Para una
      // busqueda "OR" simple en V1, pedimos sin combinar cuando hay texto.
      if (texto.trim()) {
        const [porCliente, porImei, porMarca] = await Promise.all([
          getReparaciones({ ...(estado ? { estado } : {}), cliente: texto.trim() }),
          getReparaciones({ ...(estado ? { estado } : {}), imei: texto.trim() }),
          getReparaciones({ ...(estado ? { estado } : {}), marcaModelo: texto.trim() }),
        ]);
        const combinados = new Map<number, ReparacionResponseDTO>();
        [...porCliente, ...porImei, ...porMarca].forEach((r) => combinados.set(r.id, r));
        setReparaciones(Array.from(combinados.values()));
      } else {
        setReparaciones(resultados);
      }
    } catch (err) {
      setError("No se pudo conectar con el servidor.");
      console.error(err);
    } finally {
      setCargando(false);
    }
  };

  useEffect(() => {
    buscar();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    buscar();
  };

  return (
    <div className="max-w-5xl mx-auto px-6 py-10">
      <div className="flex items-center justify-between mb-6">
        <div>
          <Link to="/" className="text-sm text-muted hover:text-ink">
            ← Volver
          </Link>
          <h1 className="font-display text-2xl font-semibold mt-2">Reparaciones</h1>
        </div>
        <Link
          to="/reparaciones/nueva"
          className="bg-brand text-white px-4 py-2 text-sm font-medium hover:bg-brand-dark transition-colors"
        >
          + Nueva reparación
        </Link>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-wrap gap-3 mb-6">
        <input
          type="text"
          placeholder="Buscar por N° orden, cliente, teléfono, IMEI o modelo..."
          value={texto}
          onChange={(e) => setTexto(e.target.value)}
          className="flex-1 min-w-[240px] border border-line bg-surface px-3 py-2 text-sm focus:outline-none focus:border-brand"
        />
        <select
          value={estado}
          onChange={(e) => setEstado(e.target.value as EstadoReparacion | "")}
          className="border border-line bg-surface px-3 py-2 text-sm focus:outline-none focus:border-brand"
        >
          {ESTADOS.map((e) => (
            <option key={e.value} value={e.value}>
              {e.label}
            </option>
          ))}
        </select>
        <button
          type="submit"
          className="border border-line px-4 py-2 text-sm font-medium hover:bg-brand-light transition-colors"
        >
          Buscar
        </button>
      </form>

      {error && (
        <div className="bg-danger-light border border-danger text-danger px-4 py-3 text-sm mb-6">
          {error}
        </div>
      )}

      {cargando && <p className="text-muted text-sm">Cargando...</p>}

      {!cargando && !error && reparaciones.length === 0 && (
        <p className="text-muted text-sm">No hay reparaciones que coincidan con la búsqueda.</p>
      )}

      {!cargando && reparaciones.length > 0 && (
        <div className="border border-line bg-surface overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-line text-left text-muted">
                <th className="px-4 py-3 font-medium">Orden</th>
                <th className="px-4 py-3 font-medium">Cliente</th>
                <th className="px-4 py-3 font-medium">Equipo</th>
                <th className="px-4 py-3 font-medium">Falla</th>
                <th className="px-4 py-3 font-medium">Estado</th>
                <th className="px-4 py-3 font-medium">Fecha</th>
              </tr>
            </thead>
            <tbody>
              {reparaciones.map((r) => (
                <tr
                  key={r.id}
                  onClick={() => navigate(`/reparaciones/${r.id}`)}
                  className="border-b border-line last:border-0 hover:bg-base cursor-pointer"
                >
                  <td className="px-4 py-3 font-display font-medium">#{String(r.numeroOrden).padStart(3, "0")}</td>
                  <td className="px-4 py-3">{r.clienteNombre}</td>
                  <td className="px-4 py-3">
                    {r.marca} {r.modelo}
                  </td>
                  <td className="px-4 py-3 text-muted max-w-[200px] truncate">{r.fallaInformada}</td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-1 text-xs font-medium ${ESTADO_STYLES[r.estado]}`}>
                      {ESTADOS.find((e) => e.value === r.estado)?.label}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-muted">{formatFecha(r.fechaIngreso)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}