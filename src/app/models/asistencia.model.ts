export class Asistencia {
  id?: number;
  titulo: string;
  descripcion: string;
  nombreLugar: string;
  direccion: string;
  fecha: string; // formato dd-mm-aaaa
  horaInicio: string; 
  horaFin: string;
  eventoId: number;
  cantColaboradores: number;

  constructor(
    titulo: string,
    fecha: string,
    horaInicio: string,
    horaFin: string,
    descripcion: string,
    lugar: string,
    direccion: string,
    cantColaboradores: number,
    eventoId: number,
    id?: number 
  ) {
    this.titulo = titulo;
    this.fecha = fecha;
    this.horaInicio = horaInicio;
    this.horaFin = horaFin;
    this.descripcion = descripcion;
    this.nombreLugar = lugar;
    this.direccion = direccion;
    this.cantColaboradores = cantColaboradores;
    this.eventoId = eventoId;
    if (id !== undefined) this.id = id;
  }
}

