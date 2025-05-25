export class Evento {
  id: number;
  nombre: string;
  creadorId: number;
  descripcion?: string;
  puntuacion?: number;
  organizadorNombre?: string;
  organizadorApellido?: string;
  fechaCreacion?: string;
  invitacion?: number;
  creadorNombre?: string; // Nuevo campo para el nombre del creador

  constructor(
    nombre: string,
    creadorId: number,
    descripcion: string = '',
    organizadorNombre: string = '',
    organizadorApellido: string = '',
    puntuacion?: number,
    fechaCreacion?: string,
    invitacion?: number,
    creadorNombre?: string // Nuevo parámetro opcional
  ) {
    this.id = Date.now();
    this.nombre = nombre;
    this.creadorId = creadorId;
    this.descripcion = descripcion;
    this.organizadorNombre = organizadorNombre;
    this.organizadorApellido = organizadorApellido;
    this.puntuacion = puntuacion;
    this.fechaCreacion = fechaCreacion || new Date().toISOString();
    this.invitacion = invitacion || (this.id + Math.floor(Math.random() * 1000));
    this.creadorNombre = creadorNombre || organizadorNombre;
  }
}
