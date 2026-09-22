export type EstadoReparacion =
  | "RECIBIDO"
  | "DIAGNOSTICO"
  | "REPARACION"
  | "REPARADO"
  | "LISTO_PARA_RETIRAR"
  | "ENTREGADO"
  | "NO_REPARADO"
  | "CANCELADO";

export type MetodoPago = "EFECTIVO" | "TARJETA" | "TRANSFERENCIA";

export type EstadoPago = "PENDIENTE" | "PARCIAL" | "PAGADO";

export interface HistorialEstadoDTO {
  estado: EstadoReparacion;
  fecha: string;
  comentario?: string;
}

export interface ReparacionResponseDTO {
  id: number;
  numeroOrden: number;
  clienteId: number;
  clienteNombre: string;
  clienteTelefono: string;
  marca: string;
  modelo: string;
  imei?: string;
  color?: string;
  fallaInformada: string;
  estadoFisico?: string;
  observaciones?: string;
  fechaIngreso: string;
  estado: EstadoReparacion;
  historial: HistorialEstadoDTO[];
  importe?: number;
  metodoPago?: MetodoPago;
  montoPagado: number;
  estadoPago?: EstadoPago;
}

export interface ReparacionRequestDTO {
  clienteId?: number;
  clienteNombre?: string;
  clienteTelefono?: string;
  clienteEmail?: string;
  marca: string;
  modelo: string;
  imei?: string;
  color?: string;
  fallaInformada: string;
  estadoFisico?: string;
  observaciones?: string;
  importe?: number;
  metodoPago?: MetodoPago;
  montoPagado?: number;
}

export interface EditarReparacionRequestDTO {
  marca: string;
  modelo: string;
  imei?: string;
  color?: string;
  fallaInformada: string;
  estadoFisico?: string;
  observaciones?: string;
  importe?: number;
  metodoPago?: MetodoPago;
  montoPagado?: number;
}

export interface ClienteRequestDTO {
  nombre: string;
  telefono: string;
  email?: string;
}

export interface ClienteResponseDTO {
  id: number;
  nombre: string;
  telefono: string;
  email?: string;
  createdAt: string;
}

export interface EditarClienteRequestDTO {
  nombre: string;
  telefono: string;
  email?: string;
}

export interface DashboardResponseDTO {
  totalEnLocal: number;
  enDiagnostico: number;
  enReparacion: number;
  reparados: number;
  listosParaRetirar: number;
}

export interface CancelarReparacionRequestDTO {
  motivo: string;
}