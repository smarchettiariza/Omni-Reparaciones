import axios from "axios";
import { clearToken, getToken } from "../auth/auth";
import type {
  ClienteResponseDTO,
  ClienteRequestDTO,
  DashboardResponseDTO,
  EditarClienteRequestDTO,
  EditarReparacionRequestDTO,
  EstadoReparacion,
  ReparacionRequestDTO,
  ReparacionResponseDTO,
} from "../types";

const api = axios.create({
  baseURL: "http://localhost:8080/api",
});

// Antes de cada pedido, si hay un token guardado, lo agregamos al header.
// Asi no hay que acordarse de hacerlo a mano en cada funcion de este archivo.
api.interceptors.request.use((config) => {
  const token = getToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Si el backend responde 401 en cualquier pedido (token vencido, invalido,
// o sesion no iniciada), limpiamos el token y mandamos al login. La unica
// excepcion es el propio login: un 401 ahi es "contrasena incorrecta",
// no una sesion vencida, y lo maneja la pantalla de Login con su propio catch.
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const url = error.config?.url ?? "";
    // Un 401 en /auth/login es "contraseña incorrecta al iniciar sesión", y un 401
    // en /auth/password es "contraseña actual incorrecta al cambiarla" — ninguno de
    // los dos significa que la sesion vencio, asi que no correspondse redirigir.
    const esAuthPropio = url.includes("/auth/login") || url.includes("/auth/password");
    if (error.response?.status === 401 && !esAuthPropio) {
      clearToken();
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

export const login = (username: string, password: string) =>
  api
    .post<{ token: string; username: string }>("/auth/login", { username, password })
    .then((res) => res.data);

export const cambiarPassword = (passwordActual: string, passwordNueva: string) =>
  api.patch<void>("/auth/password", { passwordActual, passwordNueva }).then((res) => res.data);    

export const getDashboard = () =>
  api.get<DashboardResponseDTO>("/dashboard").then((res) => res.data);

export const getReparaciones = (params?: Record<string, string>) =>
  api
    .get<ReparacionResponseDTO[]>("/reparaciones", { params })
    .then((res) => res.data);

export const getReparacion = (id: number) =>
  api.get<ReparacionResponseDTO>(`/reparaciones/${id}`).then((res) => res.data);

export const crearReparacion = (dto: ReparacionRequestDTO) =>
  api.post<ReparacionResponseDTO>("/reparaciones", dto).then((res) => res.data);

export const cambiarEstado = (
  id: number,
  nuevoEstado: EstadoReparacion,
  comentario?: string
) =>
  api
    .patch<ReparacionResponseDTO>(`/reparaciones/${id}/estado`, { nuevoEstado, comentario })
    .then((res) => res.data);

export const editarReparacion = (id: number, dto: EditarReparacionRequestDTO) =>
  api.put<ReparacionResponseDTO>(`/reparaciones/${id}`, dto).then((res) => res.data);

export const cancelarReparacion = (id: number, motivo: string) =>
  api
    .patch<ReparacionResponseDTO>(`/reparaciones/${id}/cancelar`, { motivo })
    .then((res) => res.data);

export const getClientes = (busqueda?: string) =>
  api
    .get<ClienteResponseDTO[]>("/clientes", { params: busqueda ? { busqueda } : {} })
    .then((res) => res.data);

export const crearCliente = (dto: ClienteRequestDTO) =>
  api.post<ClienteResponseDTO>("/clientes", dto).then((res) => res.data);

export const getCliente = (id: number) =>
  api.get<ClienteResponseDTO>(`/clientes/${id}`).then((res) => res.data);

export const editarCliente = (id: number, dto: EditarClienteRequestDTO) =>
  api.put<ClienteResponseDTO>(`/clientes/${id}`, dto).then((res) => res.data);

export const getReparacionesDeCliente = (id: number) =>
  api.get<ReparacionResponseDTO[]>(`/clientes/${id}/reparaciones`).then((res) => res.data);

export default api;