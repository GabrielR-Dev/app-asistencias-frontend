export class Asistencia {
  fecha: string; // dd-mm-aaaa
  horaInicio: string; // HH:mm
  horaFin: string; // HH:mm
  descripcion: string;
  lugar: string;
  direccion: string;
  creadorId: number; // id del usuario logueado
  eventoId: number; // id del evento al que pertenece la asistencia

  constructor(
    fecha: string,
    horaInicio: string,
    horaFin: string,
    descripcion: string,
    lugar: string,
    direccion: string,
    creadorId: number,
    eventoId: number
  ) {
    this.fecha = fecha;
    this.horaInicio = horaInicio;
    this.horaFin = horaFin;
    this.descripcion = descripcion;
    this.lugar = lugar;
    this.direccion = direccion;
    this.creadorId = creadorId;
    this.eventoId = eventoId;
  }
}
