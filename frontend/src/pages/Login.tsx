import { useState, type FormEvent } from "react";
import { login } from "../api/client";
import { setToken } from "../auth/auth";
import Logo from "../components/Logo";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [mostrarPassword, setMostrarPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [enviando, setEnviando] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setEnviando(true);
    try {
      const { token } = await login(username, password);
      setToken(token);
      // Recarga completa a proposito: asi toda la app (Nav incluido)
      // arranca de cero ya sabiendo que hay una sesion activa.
      window.location.href = "/";
    } catch {
      setError("Usuario o contraseña incorrectos.");
    } finally {
      setEnviando(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-base px-6">
      <div className="w-full max-w-sm bg-surface border border-line px-8 py-8">
        <div className="flex flex-col items-center mb-6">
          <Logo size={40} />
          <h1 className="font-display text-xl font-semibold mt-3">Omni</h1>
          <p className="text-muted text-sm mt-1">Iniciá sesión para continuar</p>
        </div>

        {error && (
          <div className="bg-danger-light border border-danger text-danger px-4 py-3 text-sm mb-4">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <label className="block">
            <span className="text-sm text-muted">Usuario</span>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              autoFocus
              className="mt-1 w-full border border-line bg-surface px-3 py-2 text-sm focus:outline-none focus:border-brand"
            />
          </label>
          <label className="block">
            <span className="text-sm text-muted">Contraseña</span>
            <div className="relative mt-1">
              <input
                type={mostrarPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full border border-line bg-surface px-3 py-2 pr-10 text-sm focus:outline-none focus:border-brand"
              />
              <button
                type="button"
                onClick={() => setMostrarPassword((v) => !v)}
                tabIndex={-1}
                aria-label={mostrarPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
                className="absolute inset-y-0 right-0 flex items-center px-3 text-muted hover:text-ink transition-colors"
              >
                {mostrarPassword ? (
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
                    <path d="M17.94 17.94A10.94 10.94 0 0 1 12 20c-6 0-10-6-10-8a12.6 12.6 0 0 1 3.06-4.94M9.9 4.24A10.5 10.5 0 0 1 12 4c6 0 10 6 10 8a12.9 12.9 0 0 1-2.16 3.19M14.12 14.12a3 3 0 1 1-4.24-4.24" />
                    <line x1="1" y1="1" x2="23" y2="23" />
                  </svg>
                ) : (
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
                    <path d="M2 12s4-8 10-8 10 8 10 8-4 8-10 8-10-8-10-8Z" />
                    <circle cx="12" cy="12" r="3" />
                  </svg>
                )}
              </button>
            </div>
          </label>
          <button
            type="submit"
            disabled={enviando}
            className="w-full bg-brand text-white px-4 py-2.5 text-sm font-medium hover:bg-brand-dark transition-colors disabled:opacity-50"
          >
            {enviando ? "Ingresando..." : "Ingresar"}
          </button>
        </form>
      </div>
    </div>
  );
}