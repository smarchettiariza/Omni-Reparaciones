import { useState, type FormEvent } from "react";
import { Link } from "react-router-dom";
import { cambiarPassword } from "../api/client";

export default function CambiarPassword() {
  const [passwordActual, setPasswordActual] = useState("");
  const [passwordNueva, setPasswordNueva] = useState("");
  const [confirmacion, setConfirmacion] = useState("");
  const [mostrarPasswords, setMostrarPasswords] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [exito, setExito] = useState(false);
  const [enviando, setEnviando] = useState(false);

  const tipoCampo = mostrarPasswords ? "text" : "password";

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);

    if (passwordNueva !== confirmacion) {
      setError("La confirmación no coincide con la nueva contraseña.");
      return;
    }
    if (passwordNueva.length < 6) {
      setError("La nueva contraseña debe tener al menos 6 caracteres.");
      return;
    }

    setEnviando(true);
    try {
      await cambiarPassword(passwordActual, passwordNueva);
      setExito(true);
      setPasswordActual("");
      setPasswordNueva("");
      setConfirmacion("");
    } catch (err: unknown) {
      const status = (err as { response?: { status?: number } })?.response?.status;
      if (status === 401) {
        setError("La contraseña actual no es correcta.");
      } else {
        setError("No se pudo cambiar la contraseña. Intentá de nuevo.");
      }
    } finally {
      setEnviando(false);
    }
  };

  return (
    <div className="max-w-sm mx-auto px-6 py-10">
      <Link to="/" className="text-sm text-muted hover:text-ink">
        ← Volver
      </Link>
      <h1 className="font-display text-2xl font-semibold mt-3 mb-6">Cambiar contraseña</h1>

      {exito && (
        <div className="bg-brand-light border border-brand text-brand-dark px-4 py-3 text-sm mb-6">
          Contraseña actualizada correctamente.
        </div>
      )}

      {error && (
        <div className="bg-danger-light border border-danger text-danger px-4 py-3 text-sm mb-6">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <label className="block">
          <span className="text-sm text-muted">Contraseña actual</span>
          <input
            type={tipoCampo}
            value={passwordActual}
            onChange={(e) => setPasswordActual(e.target.value)}
            required
            className="mt-1 w-full border border-line bg-surface px-3 py-2 text-sm focus:outline-none focus:border-brand"
          />
        </label>
        <label className="block">
          <span className="text-sm text-muted">Nueva contraseña</span>
          <input
            type={tipoCampo}
            value={passwordNueva}
            onChange={(e) => setPasswordNueva(e.target.value)}
            required
            minLength={6}
            className="mt-1 w-full border border-line bg-surface px-3 py-2 text-sm focus:outline-none focus:border-brand"
          />
        </label>
        <label className="block">
          <span className="text-sm text-muted">Confirmar nueva contraseña</span>
          <input
            type={tipoCampo}
            value={confirmacion}
            onChange={(e) => setConfirmacion(e.target.value)}
            required
            minLength={6}
            className="mt-1 w-full border border-line bg-surface px-3 py-2 text-sm focus:outline-none focus:border-brand"
          />
        </label>

        <button
          type="button"
          onClick={() => setMostrarPasswords((v) => !v)}
          className="flex items-center gap-1.5 text-sm text-muted hover:text-ink transition-colors"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={1.8}
            strokeLinecap="round"
            strokeLinejoin="round"
            className="w-4 h-4"
          >
            {mostrarPasswords ? (
              <>
                <path d="M17.94 17.94A10.94 10.94 0 0 1 12 20c-6 0-10-6-10-8a12.6 12.6 0 0 1 3.06-4.94M9.9 4.24A10.5 10.5 0 0 1 12 4c6 0 10 6 10 8a12.9 12.9 0 0 1-2.16 3.19M14.12 14.12a3 3 0 1 1-4.24-4.24" />
                <line x1="1" y1="1" x2="23" y2="23" />
              </>
            ) : (
              <>
                <path d="M2 12s4-8 10-8 10 8 10 8-4 8-10 8-10-8-10-8Z" />
                <circle cx="12" cy="12" r="3" />
              </>
            )}
          </svg>
          {mostrarPasswords ? "Ocultar contraseñas" : "Mostrar contraseñas"}
        </button>

        <button
          type="submit"
          disabled={enviando}
          className="bg-brand text-white px-5 py-2.5 text-sm font-medium hover:bg-brand-dark transition-colors disabled:opacity-50"
        >
          {enviando ? "Guardando..." : "Cambiar contraseña"}
        </button>
      </form>
    </div>
  );
}