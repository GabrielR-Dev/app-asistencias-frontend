export class Asistencia {
  //titulo: string;
  descripcion: string;
  nombreLugar: string;
  direccion: string;
  fecha: string;// dd-mm-aaaa
  horaInicio: string;// HH:mm
  horaFin: string;// HH:mm
  eventoId: number;// id del evento al que pertenece la asistencia

  constructor(
    //titulo:string,
    fecha: string,
    horaInicio: string,
    horaFin: string,
    descripcion: string,
    lugar: string,
    direccion: string,
    eventoId: number
  ) {
    //this.titulo = titulo;
    this.fecha = fecha;
    this.horaInicio = horaInicio;
    this.horaFin = horaFin;
    this.descripcion = descripcion;
    this.nombreLugar = lugar;
    this.direccion = direccion;
    this.eventoId = eventoId;
  }
}
