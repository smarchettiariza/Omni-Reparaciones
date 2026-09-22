import { Routes, Route, useLocation } from "react-router-dom";
import Nav from "./components/Nav";
import ProtectedRoute from "./components/ProtectedRoute";
import Login from "./pages/Login";
import CambiarPassword from "./pages/CambiarPassword";
import Dashboard from "./pages/Dashboard";
import NuevaReparacion from "./pages/NuevaReparacion";
import ListadoReparaciones from "./pages/ListadoReparaciones";
import FichaReparacion from "./pages/FichaReparacion";
import ReciboReparacion from "./pages/ReciboReparacion";
import Clientes from "./pages/Clientes";
import FichaCliente from "./pages/FichaCliente";

function App() {
  const location = useLocation();
  const esLogin = location.pathname === "/login";

  return (
    <>
      {!esLogin && (
        <div className="no-print">
          <Nav />
        </div>
      )}
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/reparaciones/nueva"
          element={
            <ProtectedRoute>
              <NuevaReparacion />
            </ProtectedRoute>
          }
        />
        <Route
          path="/reparaciones"
          element={
            <ProtectedRoute>
              <ListadoReparaciones />
            </ProtectedRoute>
          }
        />
        <Route
          path="/reparaciones/:id"
          element={
            <ProtectedRoute>
              <FichaReparacion />
            </ProtectedRoute>
          }
        />
        <Route
          path="/reparaciones/:id/recibo"
          element={
            <ProtectedRoute>
              <ReciboReparacion />
            </ProtectedRoute>
          }
        />
        <Route
          path="/clientes"
          element={
            <ProtectedRoute>
              <Clientes />
            </ProtectedRoute>
          }
        />
        <Route
          path="/clientes/:id"
          element={
            <ProtectedRoute>
              <FichaCliente />
            </ProtectedRoute>
          }
        />
        <Route
          path="/cambiar-password"
          element={
            <ProtectedRoute>
              <CambiarPassword />
            </ProtectedRoute>
          }
        />
      </Routes>

    </>
  );
}

export default App;