import { useState, type FormEvent } from "react";
import { Link } from "react-router-dom";
import { crearReparacion } from "../api/client";
import type { MetodoPago, ReparacionRequestDTO, ReparacionResponseDTO } from "../types";

const initialForm: ReparacionRequestDTO = {
  clienteNombre: "",
  clienteTelefono: "",
  clienteEmail: "",
  marca: "",
  modelo: "",
  imei: "",
  color: "",
  fallaInformada: "",
  estadoFisico: "",
  observaciones: "",
};

export default function NuevaReparacion() {
  const [form, setForm] = useState<ReparacionRequestDTO>(initialForm);

  // Los campos de pago se manejan como texto en el input y se convierten
  // a numero recien al enviar, para no pelear con el estado intermedio
  // (por ejemplo mientras el usuario todavia esta escribiendo "1500.").
  const [importeStr, setImporteStr] = useState("");
  const [montoPagadoStr, setMontoPagadoStr] = useState("");
  const [metodoPago, setMetodoPago] = useState<MetodoPago | "">("");

  const [enviando, setEnviando] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [creada, setCreada] = useState<ReparacionResponseDTO | null>(null);

  const actualizar = (campo: keyof ReparacionRequestDTO) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
      setForm((f) => ({ ...f, [campo]: e.target.value }));

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setEnviando(true);
    try {
      const payload: ReparacionRequestDTO = {
        ...form,
        importe: importeStr ? Number(importeStr) : undefined,
        metodoPago: metodoPago || undefined,
        montoPagado: montoPagadoStr ? Number(montoPagadoStr) : undefined,
      };
      const resultado = await crearReparacion(payload);
      setCreada(resultado);
    } catch (err) {
      setError(
        "No se pudo guardar el equipo. Revisá que los campos obligatorios estén completos, que el monto pagado no supere al importe, y que el backend esté corriendo."
      );
      console.error(err);
    } finally {
      setEnviando(false);
    }
  };

  const cargarOtra = () => {
    setCreada(null);
    setForm(initialForm);
    setImporteStr("");
    setMontoPagadoStr("");
    setMetodoPago("");
  };

  if (creada) {
    return (
      <div className="max-w-lg mx-auto px-6 py-10">
        <div className="bg-brand-light border border-brand px-6 py-5">
          <p className="text-sm text-brand-dark font-medium">Equipo recibido</p>
          <h1 className="font-display text-2xl font-semibold mt-1">
            Orden #{creada.numeroOrden}
          </h1>
          <p className="text-ink mt-3">
            {creada.marca} {creada.modelo} — {creada.clienteNombre}
          </p>
          <p className="text-muted text-sm mt-1">Estado: Recibido</p>
          {creada.importe != null && (
            <p className="text-muted text-sm mt-1">
              Importe: ${creada.importe.toLocaleString("es-AR")} · Pagado: $
              {creada.montoPagado.toLocaleString("es-AR")}
            </p>
          )}
        </div>
        <div className="flex gap-3 mt-6">
          <button
            onClick={cargarOtra}
            className="bg-brand text-white px-4 py-2 text-sm font-medium hover:bg-brand-dark transition-colors"
          >
            + Cargar otro equipo
          </button>
          <Link
            to="/"
            className="border border-line px-4 py-2 text-sm font-medium hover:bg-brand-light transition-colors"
          >
            Volver al dashboard
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-lg mx-auto px-6 py-10">
      <Link to="/" className="text-sm text-muted hover:text-ink">
        ← Volver
      </Link>
      <h1 className="font-display text-2xl font-semibold mt-3 mb-6">Nueva reparación</h1>

      {error && (
        <div className="bg-danger-light border border-danger text-danger px-4 py-3 text-sm mb-6">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5">
        <fieldset className="space-y-3">
          <legend className="font-display text-sm font-semibold text-brand-dark uppercase tracking-wide mb-1">
            Cliente
          </legend>
          <Campo label="Nombre" required value={form.clienteNombre} onChange={actualizar("clienteNombre")} />
          <Campo
            label="Teléfono de contacto"
            required
            value={form.clienteTelefono}
            onChange={actualizar("clienteTelefono")}
          />
          <Campo label="Email (opcional)" value={form.clienteEmail} onChange={actualizar("clienteEmail")} />
        </fieldset>

        <fieldset className="space-y-3">
          <legend className="font-display text-sm font-semibold text-brand-dark uppercase tracking-wide mb-1">
            Equipo
          </legend>
          <div className="grid grid-cols-2 gap-3">
            <Campo label="Marca" required value={form.marca} onChange={actualizar("marca")} />
            <Campo label="Modelo" required value={form.modelo} onChange={actualizar("modelo")} />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <Campo label="IMEI" value={form.imei} onChange={actualizar("imei")} />
            <Campo label="Color" value={form.color} onChange={actualizar("color")} />
          </div>
          <CampoTextArea
            label="Falla informada"
            required
            value={form.fallaInformada}
            onChange={actualizar("fallaInformada")}
          />
          <CampoTextArea
            label="Estado físico (rayones, roturas, etc.)"
            value={form.estadoFisico}
            onChange={actualizar("estadoFisico")}
          />
          <CampoTextArea
            label="Observaciones"
            value={form.observaciones}
            onChange={actualizar("observaciones")}
          />
        </fieldset>

        <fieldset className="space-y-3">
          <legend className="font-display text-sm font-semibold text-brand-dark uppercase tracking-wide mb-1">
            Pago (opcional)
          </legend>
          <p className="text-xs text-muted -mt-2">
            Si todavía no sabés el precio (por ejemplo, falta el diagnóstico), dejá estos campos vacíos y
            los completás después desde la ficha.
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
              <span className="text-sm text-muted">Monto pagado ahora</span>
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
          <label className="block">
            <span className="text-sm text-muted">Método de pago</span>
            <select
              value={metodoPago}
              onChange={(e) => setMetodoPago(e.target.value as MetodoPago | "")}
              className="mt-1 w-full border border-line bg-surface px-3 py-2 text-sm focus:outline-none focus:border-brand"
            >
              <option value="">Sin especificar</option>
              <option value="EFECTIVO">Efectivo</option>
              <option value="TARJETA">Tarjeta</option>
              <option value="TRANSFERENCIA">Transferencia</option>
            </select>
          </label>
        </fieldset>

        <button
          type="submit"
          disabled={enviando}
          className="bg-brand text-white px-5 py-2.5 text-sm font-medium hover:bg-brand-dark transition-colors disabled:opacity-50"
        >
          {enviando ? "Guardando..." : "Registrar equipo"}
        </button>
      </form>
    </div>
  );
}

function Campo({
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

function CampoTextArea({
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