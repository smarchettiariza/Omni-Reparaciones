import { Link, NavLink } from "react-router-dom";
import Logo from "./Logo";
import { logout } from "../auth/auth";

const linkClase = ({ isActive }: { isActive: boolean }) =>
  `text-sm font-medium px-1 pb-0.5 border-b-2 transition-colors ${isActive ? "border-brand text-ink" : "border-transparent text-muted hover:text-ink"
  }`;

export default function Nav() {
  return (
    <nav className="border-b border-line bg-surface">
      <div className="max-w-5xl mx-auto px-6 h-14 flex items-center gap-6">
        <Link to="/" className="flex items-center gap-2 mr-1">
          <Logo size={24} />
          <span className="font-display font-semibold text-ink">Omni</span>
        </Link>
        <NavLink to="/" end className={linkClase}>
          Dashboard
        </NavLink>
        <NavLink to="/reparaciones" className={linkClase}>
          Reparaciones
        </NavLink>
        <NavLink to="/clientes" className={linkClase}>
          Clientes
        </NavLink>
        <div className="ml-auto flex items-center gap-4">
          <Link to="/cambiar-password" className="text-sm text-muted hover:text-ink transition-colors">
            Cambiar contraseña
          </Link>
          <button
            onClick={logout}
            className="text-sm text-muted hover:text-ink transition-colors"
          >
            Cerrar sesión
          </button>
        </div>
      </div>
    </nav>
  );
}