import { Injectable } from '@angular/core';


interface Usuario {
  email: string;
  password: string;
  nombre?: string;
  apellido?: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private usuariosRegistrados: Usuario[] = [];

  constructor() {}

  login(email: string, password: string): boolean {
    const usuario = this.usuariosRegistrados.find(u => u.email === email && u.password === password);
    if (usuario) {
      localStorage.setItem('usuarioLogueado', JSON.stringify(usuario));
      return true;
    }
    return false;
  }

  logout(): void {
    localStorage.removeItem('usuarioLogueado');
  }

  isLoggedIn(): boolean {
    return !!localStorage.getItem('usuarioLogueado');
  }


  register(email: string, password: string, nombre?: string, apellido?: string): boolean {
    const existe = this.usuariosRegistrados.some(u => u.email === email);
    if (existe) return false;

    const nuevoUsuario: Usuario = { email, password, nombre, apellido };
    this.usuariosRegistrados.push(nuevoUsuario);
    localStorage.setItem('usuarioLogueado', JSON.stringify(nuevoUsuario));
    return true;
  }
}
