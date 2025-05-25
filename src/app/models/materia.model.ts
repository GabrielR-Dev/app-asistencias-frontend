export class Materia {
  id: number;
  nombre: string;
  creadorId: number;
  descripcion?: string;
  puntuacion?: number;
  profesorNombre?: string;
  profesorApellido?: string;
  fechaCreacion?: string;
  invitacion?: number;

  constructor(
    nombre: string,
    creadorId: number,
    descripcion: string = '',
    profesorNombre: string = '',
    profesorApellido: string = '',
    puntuacion?: number,
    fechaCreacion?: string,
    invitacion?: number
  ) {
    this.id = Date.now();
    this.nombre = nombre;
    this.creadorId = creadorId;
    this.descripcion = descripcion;
    this.profesorNombre = profesorNombre;
    this.profesorApellido = profesorApellido;
    this.puntuacion = puntuacion;
    this.fechaCreacion = fechaCreacion || new Date().toISOString();
    this.invitacion = invitacion || (this.id + Math.floor(Math.random() * 1000));
  }
}
