export class UsuarioPresente {// para los presentes
  id: number;
  nombre: string;
  apellido: string;
  email: string;
  dni: string;


  constructor(nombre: string, apellido: string, email: string, dni: string) {
    this.id = new Date().getTime();
    this.nombre = nombre;
    this.apellido = apellido;
    this.email = email;
    this.dni = dni;
  }
}