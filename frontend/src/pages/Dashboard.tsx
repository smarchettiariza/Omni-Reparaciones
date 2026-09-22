import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getDashboard } from "../api/client";
import type { DashboardResponseDTO } from "../types";
import StatCard from "../components/StatCard";
import Logo from "../components/Logo";

export default function Dashboard() {
  const [data, setData] = useState<DashboardResponseDTO | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    getDashboard()
      .then(setData)
      .catch(() =>
        setError(
          "No se pudo conectar con el servidor. Verificá que el backend esté corriendo en el puerto 8080."
        )
      );
  }, []);

  return (
    <div className="max-w-4xl mx-auto px-6 py-10">
      <header className="flex flex-wrap items-center justify-between gap-4 mb-8">
        <div className="flex items-center gap-3">
          <Logo size={34} />
          <div>
            <h1 className="font-display text-2xl font-semibold">Omni</h1>
            <p className="text-muted text-sm mt-1">Estado actual del local</p>
          </div>
        </div>
        <div className="flex gap-3">
          <Link
            to="/reparaciones/nueva"
            className="bg-brand text-white px-4 py-2 text-sm font-medium hover:bg-brand-dark transition-colors"
          >
            + Nueva reparación
          </Link>
          <Link
            to="/reparaciones"
            className="border border-line px-4 py-2 text-sm font-medium hover:bg-brand-light transition-colors"
          >
            Ver reparaciones
          </Link>
        </div>
      </header>

      {error && (
        <div className="bg-danger-light border border-danger text-danger px-4 py-3 text-sm mb-6">
          {error}
        </div>
      )}

      {!error && !data && <p className="text-muted text-sm">Cargando...</p>}

      {data && (
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-4">
          <StatCard label="En el local" value={data.totalEnLocal} accent="ink" />
          <StatCard label="En diagnóstico" value={data.enDiagnostico} accent="copper" />
          <StatCard label="En reparación" value={data.enReparacion} accent="copper" />
          <StatCard label="Reparados" value={data.reparados} accent="brand" />
          <StatCard label="Listos para retirar" value={data.listosParaRetirar} accent="brand" />
        </div>
      )}
    </div>
  );
}