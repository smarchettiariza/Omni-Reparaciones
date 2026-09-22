import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { cambiarEstado, cancelarReparacion, editarReparacion, getReparacion } from "../api/client";
import type { EditarReparacionRequestDTO, EstadoReparacion, MetodoPago, ReparacionResponseDTO } from "../types";

const ESTADOS: { value: EstadoReparacion; label: string }[] = [
  { value: "RECIBIDO", label: "Recibido" },
  { value: "DIAGNOSTICO", label: "Diagnóstico" },
  { value: "REPARACION", label: "Reparación" },
  { value: "REPARADO", label: "Reparado" },
  { value: "LISTO_PARA_RETIRAR", label: "Listo para retirar" },
  { value: "ENTREGADO", label: "Entregado" },
  { value: "NO_REPARADO", label: "No reparado" },
  { value: "CANCELADO", label: "Cancelado" },
];

const METODOS_PAGO: { value: MetodoPago; label: string }[] = [
  { value: "EFECTIVO", label: "Efectivo" },
  { value: "TARJETA", label: "Tarjeta" },
  { value: "TRANSFERENCIA", label: "Transferencia" },
];

const ESTADO_PAGO_LABEL: Record<string, string> = {
  PENDIENTE: "Pendiente de pago",
  PARCIAL: "Pago parcial",
  PAGADO: "Pagado",
};

function labelDe(estado: EstadoReparacion) {
  return ESTADOS.find((e) => e.value === estado)?.label ?? estado;
}

function labelMetodoPago(metodo?: MetodoPago) {
  return METODOS_PAGO.find((m) => m.value === metodo)?.label ?? "—";
}

function formatMonto(n: number) {
  return n.toLocaleString("es-AR", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

function formatFechaHora(iso: string) {
  const d = new Date(iso);
  const fecha = d.toLocaleDateString("es-AR", { day: "2-digit", month: "2-digit" });
  const hora = d.toLocaleTimeString("es-AR", { hour: "2-digit", minute: "2-digit" });
  return `${fecha} ${hora}`;
}

function aFormEdicion(r: ReparacionResponseDTO): EditarReparacionRequestDTO {
  return {
    marca: r.marca,
    modelo: r.modelo,
    imei: r.imei ?? "",
    color: r.color ?? "",
    fallaInformada: r.fallaInformada,
    estadoFisico: r.estadoFisico ?? "",
    observaciones: r.observaciones ?? "",
  };
}

export default function FichaReparacion() {
  const { id } = useParams<{ id: string }>();
  const [reparacion, setReparacion] = useState<ReparacionResponseDTO | null>(null);
  const [error, setError] = useState<string | null>(null);

  const [nuevoEstado, setNuevoEstado] = useState<EstadoReparacion | "">("");
  const [comentario, setComentario] = useState("");
  const [actualizando, setActualizando] = useState(false);

  const [editando, setEditando] = useState(false);
  const [formEdicion, setFormEdicion] = useState<EditarReparacionRequestDTO | null>(null);
  const [guardandoEdicion, setGuardandoEdicion] = useState(false);
  const [errorEdicion, setErrorEdicion] = useState<string | null>(null);

  // Campos de pago: se editan como texto/select aparte, igual que en NuevaReparacion,
  // y se combinan con formEdicion recien al guardar.
  const [importeStr, setImporteStr] = useState("");
  const [montoPagadoStr, setMontoPagadoStr] = useState("");
  const [metodoPago, setMetodoPago] = useState<MetodoPago | "">("");

  const [cancelando, setCancelando] = useState(false);
  const [motivoCancelacion, setMotivoCancelacion] = useState("");
  const [procesandoCancelacion, setProcesandoCancelacion] = useState(false);

  const cargar = () => {
    if (!id) return;
    getReparacion(Number(id))
      .then((r) => {
        setReparacion(r);
        setError(null);
      })
      .catch(() => setError("No se encontró la reparación."));
  };

  useEffect(cargar, [id]);

  const handleCambiarEstado = async () => {
    if (!id || !nuevoEstado) return;
    setActualizando(true);
    try {
      const actualizada = await cambiarEstado(Number(id), nuevoEstado, comentario || undefined);
      setReparacion(actualizada);
      setNuevoEstado("");
      setComentario("");
    } catch {
      setError("No se pudo actualizar el estado.");
    } finally {
      setActualizando(false);
    }
  };

  const iniciarEdicion = () => {
    if (!reparacion) return;
    setFormEdicion(aFormEdicion(reparacion));
    setImporteStr(reparacion.importe != null ? String(reparacion.importe) : "");
    setMontoPagadoStr(reparacion.montoPagado != null ? String(reparacion.montoPagado) : "");
    setMetodoPago(reparacion.metodoPago ?? "");
    setErrorEdicion(null);
    setEditando(true);
  };

  const cambiarCampoEdicion = (campo: keyof EditarReparacionRequestDTO) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
      setFormEdicion((f: EditarReparacionRequestDTO | null) => (f ? { ...f, [campo]: e.target.value } : f));

  const guardarEdicion = async () => {
    if (!id || !formEdicion) return;
    setGuardandoEdicion(true);
    setErrorEdicion(null);
    try {
      const payload: EditarReparacionRequestDTO = {
        ...formEdicion,
        importe: importeStr ? Number(importeStr) : undefined,
        metodoPago: metodoPago || undefined,
        montoPagado: montoPagadoStr ? Number(montoPagadoStr) : undefined,
      };
      const actualizada = await editarReparacion(Number(id), payload);
      setReparacion(actualizada);
      setEditando(false);
    } catch {
      setErrorEdicion(
        "No se pudieron guardar los cambios. Revisá que el monto pagado no supere al importe."
      );
    } finally {
      setGuardandoEdicion(false);
    }
  };

  const iniciarCancelacion = () => {
    setMotivoCancelacion("");
    setCancelando(true);
  };

  const confirmarCancelacion = async () => {
    if (!id || !motivoCancelacion.trim()) return;
    setProcesandoCancelacion(true);
    try {
      const actualizada = await cancelarReparacion(Number(id), motivoCancelacion.trim());
      setReparacion(actualizada);
      setCancelando(false);
      setMotivoCancelacion("");
    } catch {
      setError("No se pudo cancelar la reparación. Puede que ya esté cancelada o entregada.");
    } finally {
      setProcesandoCancelacion(false);
    }
  };

  if (error) {
    return (
      <div className="max-w-2xl mx-auto px-6 py-10">
        <div className="bg-danger-light border border-danger text-danger px-4 py-3 text-sm">{error}</div>
        <Link to="/reparaciones" className="text-sm text-muted hover:text-ink mt-4 inline-block">
          ← Volver al listado
        </Link>
      </div>
    );
  }

  if (!reparacion) {
    return <p className="text-muted text-sm px-6 py-10">Cargando...</p>;
  }

  const puedeCancelarse = reparacion.estado !== "CANCELADO" && reparacion.estado !== "ENTREGADO";
  const saldoPendiente =
    reparacion.importe != null ? reparacion.importe - reparacion.montoPagado : null;

  return (
    <div className="max-w-2xl mx-auto px-6 py-10">
      <Link to="/reparaciones" className="text-sm text-muted hover:text-ink">
        ← Volver al listado
      </Link>

      <div className="flex items-start justify-between mt-3 mb-6">
        <div>
          <h1 className="font-display text-2xl font-semibold">
            Orden #{String(reparacion.numeroOrden).padStart(3, "0")}
          </h1>
          <p className="text-muted text-sm mt-1">
            {reparacion.marca} {reparacion.modelo} · {reparacion.clienteNombre}
          </p>
        </div>
        <span className="bg-brand text-white px-3 py-1.5 text-sm font-medium">
          {labelDe(reparacion.estado)}
        </span>
      </div>

      {!editando && !cancelando && (
        <div className="mb-4 flex gap-3">
          <button
            onClick={iniciarEdicion}
            className="border border-line px-3 py-1.5 text-sm font-medium hover:bg-brand-light transition-colors"
          >
            Editar datos del equipo
          </button>
          <Link
            to={`/reparaciones/${reparacion.id}/recibo`}
            className="border border-line px-3 py-1.5 text-sm font-medium hover:bg-brand-light transition-colors"
          >
            Ver recibo
          </Link>
          {puedeCancelarse && (
            <button
              onClick={iniciarCancelacion}
              className="border border-danger text-danger px-3 py-1.5 text-sm font-medium hover:bg-danger-light transition-colors"
            >
              Cancelar reparación
            </button>
          )}
        </div>
      )}

      {!editando && !cancelando && (
        <div className="grid grid-cols-2 gap-x-6 gap-y-4 bg-surface border border-line px-5 py-4 mb-6 text-sm">
          <Dato label="Cliente" valor={reparacion.clienteNombre} />
          <Dato label="Teléfono" valor={reparacion.clienteTelefono} />
          <Dato label="IMEI" valor={reparacion.imei || "—"} />
          <Dato label="Color" valor={reparacion.color || "—"} />
          <Dato label="Falla informada" valor={reparacion.fallaInformada} full />
          {reparacion.estadoFisico && <Dato label="Estado físico" valor={reparacion.estadoFisico} full />}
          {reparacion.observaciones && <Dato label="Observaciones" valor={reparacion.observaciones} full />}
        </div>
      )}

      {!editando && !cancelando && (
        <div className="bg-surface border border-line px-5 py-4 mb-6">
          <h2 className="font-display text-sm font-semibold text-brand-dark uppercase tracking-wide mb-3">
            Pago
          </h2>
          {reparacion.importe == null ? (
            <p className="text-muted text-sm">Todavía no se cargó un importe para esta reparación.</p>
          ) : (
            <div className="grid grid-cols-2 gap-x-6 gap-y-3 text-sm">
              <Dato label="Importe" valor={`$${formatMonto(reparacion.importe)}`} />
              <Dato label="Método de pago" valor={labelMetodoPago(reparacion.metodoPago)} />
              <Dato label="Pagado" valor={`$${formatMonto(reparacion.montoPagado)}`} />
              <Dato
                label="Saldo pendiente"
                valor={`$${formatMonto(saldoPendiente ?? 0)}`}
              />
              <div className="col-span-2">
                <span
                  className={`inline-block px-2.5 py-1 text-xs font-medium ${
                    reparacion.estadoPago === "PAGADO"
                      ? "bg-brand-light text-brand-dark"
                      : reparacion.estadoPago === "PARCIAL"
                      ? "bg-copper/20 text-copper"
                      : "bg-danger-light text-danger"
                  }`}
                >
                  {reparacion.estadoPago ? ESTADO_PAGO_LABEL[reparacion.estadoPago] : "—"}
                </span>
              </div>
            </div>
          )}
        </div>
      )}

      {editando && formEdicion && (
        <div className="bg-surface border border-line px-5 py-4 mb-6 space-y-3">
          <h2 className="font-display text-sm font-semibold text-brand-dark uppercase tracking-wide mb-1">
            Editar datos del equipo
          </h2>
          {errorEdicion && (
            <div className="bg-danger-light border border-danger text-danger px-3 py-2 text-sm">
              {errorEdicion}
            </div>
          )}
          <div className="grid grid-cols-2 gap-3">
            <CampoEdicion label="Marca" value={formEdicion.marca} onChange={cambiarCampoEdicion("marca")} required />
            <CampoEdicion label="Modelo" value={formEdicion.modelo} onChange={cambiarCampoEdicion("modelo")} required />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <CampoEdicion label="IMEI" value={formEdicion.imei} onChange={cambiarCampoEdicion("imei")} />
            <CampoEdicion label="Color" value={formEdicion.color} onChange={cambiarCampoEdicion("color")} />
          </div>
          <CampoEdicionArea
            label="Falla informada"
            value={formEdicion.fallaInformada}
            onChange={cambiarCampoEdicion("fallaInformada")}
            required
          />
          <CampoEdicionArea
            label="Estado físico"
            value={formEdicion.estadoFisico}
            onChange={cambiarCampoEdicion("estadoFisico")}
          />
          <CampoEdicionArea
            label="Observaciones"
            value={formEdicion.observaciones}
            onChange={cambiarCampoEdicion("observaciones")}
          />

          <div className="pt-2 border-t border-line">
            <p className="font-display text-xs font-semibold text-brand-dark uppercase tracking-wide mb-2 mt-2">
              Pago
            </p>
            <div className="grid grid-cols-2 gap-3">
              <label className="block">
                <span className="text-sm text-muted">Importe total</span>
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={importeStr}
                  onChange={(e) => setImporteStr(e.target.value)}
                  placeholder="0.00"
                  className="mt-1 w-full border border-line bg-surface px-3 py-2 text-sm focus:outline-none focus:border-brand"
                />
              </label>
              <label className="block">
                <span className="text-sm text-muted">Monto pagado</span>
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={montoPagadoStr}
                  onChange={(e) => setMontoPagadoStr(e.target.value)}
                  placeholder="0.00"
                  className="mt-1 w-full border border-line bg-surface px-3 py-2 text-sm focus:outline-none focus:border-brand"
                />
              </label>
            </div>
            <label className="block mt-3">
              <span className="text-sm text-muted">Método de pago</span>
              <select
                value={metodoPago}
                onChange={(e) => setMetodoPago(e.target.value as MetodoPago | "")}
                className="mt-1 w-full border border-line bg-surface px-3 py-2 text-sm focus:outline-none focus:border-brand"
              >
                <option value="">Sin especificar</option>
                {METODOS_PAGO.map((m) => (
                  <option key={m.value} value={m.value}>
                    {m.label}
                  </option>
                ))}
              </select>
            </label>
          </div>

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

      {cancelando && (
        <div className="bg-danger-light border border-danger px-5 py-4 mb-6 space-y-3">
          <h2 className="font-display text-sm font-semibold text-danger uppercase tracking-wide mb-1">
            Cancelar reparación
          </h2>
          <p className="text-sm text-ink">
            Esta acción marca la reparación como <strong>cancelada</strong> y queda registrada en el historial.
            No se puede deshacer desde acá.
          </p>
          <label className="block">
            <span className="text-sm text-muted">Motivo de la cancelación</span>
            <textarea
              value={motivoCancelacion}
              onChange={(e) => setMotivoCancelacion(e.target.value)}
              required
              rows={2}
              placeholder="Ej: el cliente decidió no seguir con la reparación"
              className="mt-1 w-full border border-line bg-surface px-3 py-2 text-sm focus:outline-none focus:border-danger resize-none"
            />
          </label>
          <div className="flex gap-3 pt-1">
            <button
              onClick={confirmarCancelacion}
              disabled={!motivoCancelacion.trim() || procesandoCancelacion}
              className="bg-danger text-white px-4 py-2 text-sm font-medium hover:opacity-90 transition-colors disabled:opacity-50"
            >
              {procesandoCancelacion ? "Cancelando..." : "Confirmar cancelación"}
            </button>
            <button
              onClick={() => setCancelando(false)}
              className="border border-line px-4 py-2 text-sm font-medium hover:bg-base transition-colors"
            >
              Volver
            </button>
          </div>
        </div>
      )}

      {!cancelando && (
        <div className="bg-surface border border-line px-5 py-4 mb-6">
          <h2 className="font-display text-sm font-semibold text-brand-dark uppercase tracking-wide mb-3">
            Cambiar estado
          </h2>
          <div className="flex flex-wrap gap-3 items-start">
            <select
              value={nuevoEstado}
              onChange={(e) => setNuevoEstado(e.target.value as EstadoReparacion)}
              className="border border-line bg-surface px-3 py-2 text-sm focus:outline-none focus:border-brand"
            >
              <option value="">Elegí un estado...</option>
              {ESTADOS.map((e) => (
                <option key={e.value} value={e.value}>
                  {e.label}
                </option>
              ))}
            </select>
            <input
              type="text"
              placeholder="Comentario (opcional)"
              value={comentario}
              onChange={(e) => setComentario(e.target.value)}
              className="flex-1 min-w-[180px] border border-line bg-surface px-3 py-2 text-sm focus:outline-none focus:border-brand"
            />
            <button
              onClick={handleCambiarEstado}
              disabled={!nuevoEstado || actualizando}
              className="bg-brand text-white px-4 py-2 text-sm font-medium hover:bg-brand-dark transition-colors disabled:opacity-50"
            >
              {actualizando ? "Guardando..." : "Actualizar"}
            </button>
          </div>
        </div>
      )}

      <div className="bg-surface border border-line px-5 py-4">
        <h2 className="font-display text-sm font-semibold text-brand-dark uppercase tracking-wide mb-3">
          Historial
        </h2>
        <ol className="space-y-3">
          {reparacion.historial.map((h, i) => (
            <li key={i} className="flex gap-3 text-sm">
              <span className="text-muted tabular-nums whitespace-nowrap">{formatFechaHora(h.fecha)}</span>
              <span className="text-ink">
                {labelDe(h.estado)}
                {h.comentario && <span className="text-muted"> — {h.comentario}</span>}
              </span>
            </li>
          ))}
        </ol>
      </div>
    </div>
  );
}

function Dato({ label, valor, full }: { label: string; valor: string; full?: boolean }) {
  return (
    <div className={full ? "col-span-2" : ""}>
      <p className="text-muted text-xs">{label}</p>
      <p className="text-ink mt-0.5">{valor}</p>
    </div>
  );
}

function CampoEdicion({
  label,
  value,
  onChange,
  required,
}: {
  label: string;
  value?: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  required?: boolean;
}) {
  return (
    <label className="block">
      <span className="text-sm text-muted">{label}</span>
      <input
        type="text"
        value={value ?? ""}
        onChange={onChange}
        required={required}
        className="mt-1 w-full border border-line bg-surface px-3 py-2 text-sm focus:outline-none focus:border-brand"
      />
    </label>
  );
}

function CampoEdicionArea({
  label,
  value,
  onChange,
  required,
}: {
  label: string;
  value?: string;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  required?: boolean;
}) {
  return (
    <label className="block">
      <span className="text-sm text-muted">{label}</span>
      <textarea
        value={value ?? ""}
        onChange={onChange}
        required={required}
        rows={2}
        className="mt-1 w-full border border-line bg-surface px-3 py-2 text-sm focus:outline-none focus:border-brand resize-none"
      />
    </label>
  );
}