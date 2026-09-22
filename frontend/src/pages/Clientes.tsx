import { useEffect, useState, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { getClientes } from "../api/client";
import type { ClienteResponseDTO } from "../types";

export default function Clientes() {
  const navigate = useNavigate();
  const [clientes, setClientes] = useState<ClienteResponseDTO[]>([]);
  const [busqueda, setBusqueda] = useState("");
  const [cargando, setCargando] = useState(true);

  const buscar = async () => {
    setCargando(true);
    try {
      setClientes(await getClientes(busqueda.trim() || undefined));
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
    <div className="max-w-3xl mx-auto px-6 py-10">
      <h1 className="font-display text-2xl font-semibold mb-6">Clientes</h1>

      <form onSubmit={handleSubmit} className="flex gap-3 mb-6">
        <input
          type="text"
          placeholder="Buscar por nombre o teléfono..."
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
          className="flex-1 border border-line bg-surface px-3 py-2 text-sm focus:outline-none focus:border-brand"
        />
        <button
          type="submit"
          className="border border-line px-4 py-2 text-sm font-medium hover:bg-brand-light transition-colors"
        >
          Buscar
        </button>
      </form>

      {cargando && <p className="text-muted text-sm">Cargando...</p>}

      {!cargando && clientes.length === 0 && (
        <p className="text-muted text-sm">No hay clientes que coincidan con la búsqueda.</p>
      )}

      {!cargando && clientes.length > 0 && (
        <div className="border border-line bg-surface divide-y divide-line">
          {clientes.map((c) => (
            <button
              key={c.id}
              onClick={() => navigate(`/clientes/${c.id}`)}
              className="w-full text-left px-4 py-3 flex items-center justify-between hover:bg-base transition-colors"
            >
              <div>
                <p className="text-sm font-medium text-ink">{c.nombre}</p>
                <p className="text-xs text-muted mt-0.5">{c.telefono}</p>
              </div>
              <span className="text-muted text-sm">Ver historial →</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}