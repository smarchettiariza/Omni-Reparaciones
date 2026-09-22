import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { editarCliente, getCliente, getReparacionesDeCliente } from "../api/client";
import type { ClienteResponseDTO, EditarClienteRequestDTO, ReparacionResponseDTO } from "../types";

function formatFecha(iso: string) {
  return new Date(iso).toLocaleDateString("es-AR", { day: "2-digit", month: "2-digit", year: "numeric" });
}

function aFormEdicion(c: ClienteResponseDTO): EditarClienteRequestDTO {
  return {
    nombre: c.nombre,
    telefono: c.telefono,
    email: c.email ?? "",
  };
}

export default function FichaCliente() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [cliente, setCliente] = useState<ClienteResponseDTO | null>(null);
  const [reparaciones, setReparaciones] = useState<ReparacionResponseDTO[]>([]);
  const [error, setError] = useState<string | null>(null);

  const [editando, setEditando] = useState(false);
  const [formEdicion, setFormEdicion] = useState<EditarClienteRequestDTO | null>(null);
  const [guardandoEdicion, setGuardandoEdicion] = useState(false);
  const [errorEdicion, setErrorEdicion] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;
    Promise.all([getCliente(Number(id)), getReparacionesDeCliente(Number(id))])
      .then(([c, r]) => {
        setCliente(c);
        setReparaciones(r);
      })
      .catch(() => setError("No se encontró el cliente."));
  }, [id]);

  const iniciarEdicion = () => {
    if (!cliente) return;
    setFormEdicion(aFormEdicion(cliente));
    setErrorEdicion(null);
    setEditando(true);
  };

  const cambiarCampoEdicion = (campo: keyof EditarClienteRequestDTO) =>
    (e: React.ChangeEvent<HTMLInputElement>) =>
      setFormEdicion((f) => (f ? { ...f, [campo]: e.target.value } : f));

  const guardarEdicion = async () => {
    if (!id || !formEdicion) return;
    setGuardandoEdicion(true);
    setErrorEdicion(null);
    try {
      const actualizado = await editarCliente(Number(id), formEdicion);
      setCliente(actualizado);
      setEditando(false);
    } catch {
      setErrorEdicion("No se pudieron guardar los cambios. Revisá los datos ingresados.");
    } finally {
      setGuardandoEdicion(false);
    }
  };

  if (error) {
    return (
      <div className="max-w-2xl mx-auto px-6 py-10">
        <div className="bg-danger-light border border-danger text-danger px-4 py-3 text-sm">{error}</div>
        <Link to="/clientes" className="text-sm text-muted hover:text-ink mt-4 inline-block">
          ← Volver a clientes
        </Link>
      </div>
    );
  }

  if (!cliente) {
    return <p className="text-muted text-sm px-6 py-10">Cargando...</p>;
  }

  return (
    <div className="max-w-2xl mx-auto px-6 py-10">
      <Link to="/clientes" className="text-sm text-muted hover:text-ink">
        ← Volver a clientes
      </Link>

      {!editando && (
        <div className="flex items-start justify-between mt-3 mb-4">
          <div>
            <h1 className="font-display text-2xl font-semibold">{cliente.nombre}</h1>
            <p className="text-muted text-sm mt-1">
              {cliente.telefono}
              {cliente.email && ` · ${cliente.email}`}
            </p>
          </div>
          <button
            onClick={iniciarEdicion}
            className="border border-line px-3 py-1.5 text-sm font-medium hover:bg-brand-light transition-colors"
          >
            Editar
          </button>
        </div>
      )}

      {editando && formEdicion && (
        <div className="bg-surface border border-line px-5 py-4 mt-3 mb-6 space-y-3">
          <h2 className="font-display text-sm font-semibold text-brand-dark uppercase tracking-wide mb-1">
            Editar datos del cliente
          </h2>
          {errorEdicion && (
            <div className="bg-danger-light border border-danger text-danger px-3 py-2 text-sm">
              {errorEdicion}
            </div>
          )}
          <CampoEdicion
            label="Nombre"
            value={formEdicion.nombre}
            onChange={cambiarCampoEdicion("nombre")}
            required
          />
          <CampoEdicion
            label="Teléfono"
            value={formEdicion.telefono}
            onChange={cambiarCampoEdicion("telefono")}
            required
          />
          <CampoEdicion
            label="Email"
            value={formEdicion.email}
            onChange={cambiarCampoEdicion("email")}
            type="email"
          />
          <div className="flex gap-3 pt-1">
            <button
              onClick={guardarEdicion}
              disabled={guardandoEdicion}
              className="bg-brand text-white px-4 py-2 text-sm font-medium hover:bg-brand-dark transition-colors disabled:opacity-50"
            >
              {guardandoEdicion ? "Guardando..." : "Guardar cambios"}
            </button>
            <button
              onClick={() => setEditando(false)}
              className="border border-line px-4 py-2 text-sm font-medium hover:bg-base transition-colors"
            >
              Cancelar
            </button>
          </div>
        </div>
      )}

      <h2 className="font-display text-sm font-semibold text-brand-dark uppercase tracking-wide mb-3">
        Historial de equipos ({reparaciones.length})
      </h2>

      {reparaciones.length === 0 && (
        <p className="text-muted text-sm">Todavía no trajo ningún equipo.</p>
      )}

      {reparaciones.length > 0 && (
        <div className="border border-line bg-surface divide-y divide-line">
          {reparaciones.map((r) => (
            <button
              key={r.id}
              onClick={() => navigate(`/reparaciones/${r.id}`)}
              className="w-full text-left px-4 py-3 flex items-center justify-between hover:bg-base transition-colors"
            >
              <div>
                <p className="text-sm font-medium text-ink">
                  #{String(r.numeroOrden).padStart(3, "0")} · {r.marca} {r.modelo}
                </p>
                <p className="text-xs text-muted mt-0.5">{r.fallaInformada}</p>
              </div>
              <div className="text-right">
                <p className="text-xs text-muted">{formatFecha(r.fechaIngreso)}</p>
                <p className="text-xs text-brand-dark mt-0.5">{r.estado}</p>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

function CampoEdicion({
  label,
  value,
  onChange,
  required,
  type = "text",
}: {
  label: string;
  value?: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  required?: boolean;
  type?: string;
}) {
  return (
    <label className="block">
      <span className="text-sm text-muted">{label}</span>
      <input
        type={type}
        value={value ?? ""}
        onChange={onChange}
        required={required}
        className="mt-1 w-full border border-line bg-surface px-3 py-2 text-sm focus:outline-none focus:border-brand"
      />
    </label>
  );
}