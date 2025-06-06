import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class ApiAuthService {

  constructor(private http: HttpClient) { }


  registerApi(user: {
    nombre: string,
    apellido: string,
    nombreUsuario: string,
    email: string,
    contrasenia: string,
    edad: number,
    genero: string
  }) {
    const dataForm = {
      'Content-Type': 'application/json',
      'nombre': user.nombre,
      'apellido': user.apellido,
      'nombreUsuario': user.nombreUsuario,
      'email': user.email,
      'contrasenia': user.contrasenia,
      'edad': user.edad.toString(),
      'genero': user.genero
    };
    console.log(dataForm)
    return this.http.post('http://localhost:8080/api/users/auth/register', dataForm);
  }

  loginApi(email: string, contrasenia: string) {
    const dataForm = {
      email: email,
      contrasenia: contrasenia
    };
    const headers = { 'Content-Type': 'application/json' };
    return this.http.post('http://localhost:8080/api/users/auth/login', dataForm, { headers });
  }

}
