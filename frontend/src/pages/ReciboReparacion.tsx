import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { getReparacion } from "../api/client";
import { CONDICIONES, LOCAL } from "../config/local";
import Logo from "../components/Logo";
import type {
  EstadoReparacion,
  MetodoPago,
  ReparacionResponseDTO,
} from "../types";

const LABELS: Record<EstadoReparacion, string> = {
  RECIBIDO: "Recibido",
  DIAGNOSTICO: "Diagnóstico",
  REPARACION: "Reparación",
  REPARADO: "Reparado",
  LISTO_PARA_RETIRAR: "Listo para retirar",
  ENTREGADO: "Entregado",
  NO_REPARADO: "No reparado",
  CANCELADO: "Cancelado",
};

const METODOS_PAGO: Record<MetodoPago, string> = {
  EFECTIVO: "Efectivo",
  TARJETA: "Tarjeta",
  TRANSFERENCIA: "Transferencia",
};

function formatFecha(iso: string) {
  return new Date(iso).toLocaleDateString("es-AR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}

function formatFechaHora(iso: string) {
  const d = new Date(iso);

  const fecha = d.toLocaleDateString("es-AR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });

  const hora = d.toLocaleTimeString("es-AR", {
    hour: "2-digit",
    minute: "2-digit",
  });

  return `${fecha} ${hora}`;
}

function formatMonto(n: number) {
  return n.toLocaleString("es-AR", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

// wa.me necesita el numero con codigo de pais y sin simbolos.
// Para celulares argentinos: 54 + 9 + numero sin 0 ni 15.
function aNumeroWhatsApp(telefono: string) {
  const digitos = telefono.replace(/\D/g, "");

  if (digitos.startsWith("54")) return digitos;

  return `549${digitos}`;
}

export default function ReciboReparacion() {
  const { id } = useParams<{ id: string }>();

  const [reparacion, setReparacion] =
    useState<ReparacionResponseDTO | null>(null);

  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;

    getReparacion(Number(id))
      .then(setReparacion)
      .catch(() => setError("No se encontró la reparación."));
  }, [id]);

  const enviarPorWhatsApp = () => {
    if (!reparacion) return;

    const orden = String(reparacion.numeroOrden).padStart(3, "0");

    let lineaPago = "";

    if (reparacion.importe != null) {
      const saldo = reparacion.importe - reparacion.montoPagado;

      lineaPago =
        `Importe: $${formatMonto(reparacion.importe)}\n` +
        `Pagado: $${formatMonto(reparacion.montoPagado)}\n` +
        (saldo > 0
          ? `Saldo pendiente: $${formatMonto(saldo)}\n`
          : `Pago: completo\n`);
    }

    const mensaje =
      `Hola ${reparacion.clienteNombre}! Te paso el comprobante de tu equipo en ${LOCAL.nombre}.\n\n` +
      `Orden: #${orden}\n` +
      `Equipo: ${reparacion.marca} ${reparacion.modelo}\n` +
      `Falla informada: ${reparacion.fallaInformada}\n` +
      `Estado actual: ${LABELS[reparacion.estado]}\n` +
      `Fecha de ingreso: ${formatFecha(reparacion.fechaIngreso)}\n` +
      lineaPago +
      `\nGuardá este número de orden para retirar el equipo. Ante cualquier duda, escribinos por acá. ¡Gracias!`;

    const numero = aNumeroWhatsApp(reparacion.clienteTelefono);

    window.open(
      `https://wa.me/${numero}?text=${encodeURIComponent(mensaje)}`,
      "_blank"
    );
  };

  if (error) {
    return (
      <div className="max-w-2xl mx-auto px-6 py-10">
        <div className="bg-danger-light border border-danger text-danger px-4 py-3 text-sm">
          {error}
        </div>

        <Link
          to="/reparaciones"
          className="text-sm text-muted hover:text-ink mt-4 inline-block"
        >
          ← Volver al listado
        </Link>
      </div>
    );
  }

  if (!reparacion) {
    return (
      <p className="text-muted text-sm px-6 py-10">
        Cargando...
      </p>
    );
  }

  const orden = String(reparacion.numeroOrden).padStart(3, "0");

  const saldoPendiente =
    reparacion.importe != null
      ? reparacion.importe - reparacion.montoPagado
      : null;

  return (
    <div className="max-w-2xl mx-auto px-6 py-10">
      {/* Barra de acciones: no se imprime */}
      <div className="no-print flex flex-wrap items-center gap-3 mb-6">
        <Link
          to={`/reparaciones/${reparacion.id}`}
          className="text-sm text-muted hover:text-ink mr-auto"
        >
          ← Volver a la ficha
        </Link>

        <button
          onClick={() => window.print()}
          className="bg-brand text-white px-4 py-2 text-sm font-medium hover:bg-brand-dark transition-colors"
        >
          Imprimir / Guardar PDF
        </button>

        <button
          onClick={enviarPorWhatsApp}
          className="border border-line px-4 py-2 text-sm font-medium hover:bg-brand-light transition-colors"
        >
          Enviar por WhatsApp
        </button>
      </div>

      {/* Recibo */}
      <div className="bg-surface border border-line px-8 py-7 text-sm">
        {/* Encabezado */}
        <div className="flex items-start justify-between border-b border-line pb-4 mb-5">
          {/* Logo + información del local */}
          <div className="flex items-start gap-3">
            <Logo
              size={36}
              className="mt-0.5 shrink-0"
            />

            <div>
              <h1 className="font-display text-2xl font-semibold text-brand-dark">
                {LOCAL.nombre}
              </h1>

              <p className="text-muted text-xs mt-1">
                {LOCAL.rubro}
              </p>

              <p className="text-muted text-xs mt-2">
                {LOCAL.direccion}
                <br />
                {LOCAL.telefono} · {LOCAL.email}
              </p>
            </div>
          </div>

          {/* Información del comprobante */}
          <div className="text-right">
            <p className="text-xs text-muted uppercase tracking-wide">
              Comprobante
            </p>

            <p className="font-display text-xl font-semibold mt-0.5">
              #{orden}
            </p>

            <p className="text-xs text-muted mt-1">
              Ingreso: {formatFecha(reparacion.fechaIngreso)}
            </p>
          </div>
        </div>

        {/* Cliente */}
        <Seccion titulo="Cliente">
          <div className="grid grid-cols-2 gap-x-6 gap-y-2">
            <Dato
              label="Nombre"
              valor={reparacion.clienteNombre}
            />

            <Dato
              label="Teléfono"
              valor={reparacion.clienteTelefono}
            />
          </div>
        </Seccion>

        {/* Equipo */}
        <Seccion titulo="Equipo">
          <div className="grid grid-cols-2 gap-x-6 gap-y-2">
            <Dato
              label="Marca"
              valor={reparacion.marca}
            />

            <Dato
              label="Modelo"
              valor={reparacion.modelo}
            />

            <Dato
              label="IMEI"
              valor={reparacion.imei || "—"}
            />

            <Dato
              label="Color"
              valor={reparacion.color || "—"}
            />

            <Dato
              label="Falla informada"
              valor={reparacion.fallaInformada}
              full
            />

            <Dato
              label="Estado físico al ingresar"
              valor={reparacion.estadoFisico || "—"}
              full
            />

            {reparacion.observaciones && (
              <Dato
                label="Observaciones"
                valor={reparacion.observaciones}
                full
              />
            )}
          </div>
        </Seccion>

        {/* Estado actual */}
        <Seccion titulo="Estado actual">
          <p className="text-ink">
            {LABELS[reparacion.estado]}

            {reparacion.historial.length > 0 && (
              <span className="text-muted">
                {" "}
                · última actualización:{" "}
                {formatFechaHora(
                  reparacion.historial[
                    reparacion.historial.length - 1
                  ].fecha
                )}
              </span>
            )}
          </p>
        </Seccion>

        {/* Pago */}
        {reparacion.importe != null && (
          <Seccion titulo="Pago">
            <div className="grid grid-cols-2 gap-x-6 gap-y-2">
              <Dato
                label="Importe total"
                valor={`$${formatMonto(reparacion.importe)}`}
              />

              <Dato
                label="Método de pago"
                valor={
                  reparacion.metodoPago
                    ? METODOS_PAGO[reparacion.metodoPago]
                    : "—"
                }
              />

              <Dato
                label="Pagado"
                valor={`$${formatMonto(reparacion.montoPagado)}`}
              />

              <Dato
                label="Saldo pendiente"
                valor={
                  saldoPendiente != null && saldoPendiente > 0
                    ? `$${formatMonto(saldoPendiente)}`
                    : "Sin saldo pendiente"
                }
              />
            </div>
          </Seccion>
        )}

        {/* Condiciones */}
        <Seccion titulo="Condiciones y garantía">
          <ol className="space-y-1.5 text-xs text-muted leading-relaxed">
            {CONDICIONES.map((c, i) => (
              <li key={i}>
                {i + 1}. {c}
              </li>
            ))}
          </ol>
        </Seccion>

        {/* Firmas */}
        <div className="grid grid-cols-2 gap-10 mt-10 pt-2">
          <Firma label="Firma del cliente" />

          <Firma label={`Firma ${LOCAL.nombre}`} />
        </div>
      </div>
    </div>
  );
}

function Seccion({
  titulo,
  children,
}: {
  titulo: string;
  children: React.ReactNode;
}) {
  return (
    <div className="mb-5">
      <h2 className="font-display text-xs font-semibold text-brand-dark uppercase tracking-wide mb-2">
        {titulo}
      </h2>

      {children}
    </div>
  );
}

function Dato({
  label,
  valor,
  full,
}: {
  label: string;
  valor: string;
  full?: boolean;
}) {
  return (
    <div className={full ? "col-span-2" : ""}>
      <p className="text-muted text-xs">
        {label}
      </p>

      <p className="text-ink mt-0.5">
        {valor}
      </p>
    </div>
  );
}

function Firma({ label }: { label: string }) {
  return (
    <div>
      <div className="border-t border-line pt-1.5" />

      <p className="text-xs text-muted">
        {label}
      </p>
    </div>
  );
}