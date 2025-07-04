export class UsuarioM {
  id: number;
  nombre: string;
  apellido: string;
  mail: string;
  dni: string;


  constructor(nombre: string, apellido: string, mail: string, dni: string) {
    this.id = new Date().getTime();
    this.nombre = nombre;
    this.apellido = apellido;
    this.mail = mail;
    this.dni = dni;
  }
}