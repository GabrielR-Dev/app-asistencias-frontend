import { UsuarioM } from "./usuario.model";

export class ListaM {
    id: number;
    invitacion: number;
    nombre: string;
    creador: UsuarioM = new UsuarioM('valentin','ojeda','123@gmail.com','00 0000 0000')
    miembros: UsuarioM[] = [];
    descripcion?: string; // Nueva propiedad explícita
    creadorNombre?: string; // Nueva propiedad explícita


    constructor(nombre: string, i: number, /*creador: UsuarioM*/) {
        this.nombre = nombre;
        this.id = new Date().getTime();
        this.invitacion = new Date().getTime() + i;
        //this.creador = creador;
    }
}