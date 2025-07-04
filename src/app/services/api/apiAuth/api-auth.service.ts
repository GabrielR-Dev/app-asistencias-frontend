import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class ApiAuthService {

  private baseUrl = 'https://app-asistencias-backend-qa38.onrender.com';

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
    return this.http.post(`${this.baseUrl}/api/users/auth/register`, dataForm);
  }




  loginApi(email: string, contrasenia: string) {
    const dataForm = {
      email: email,
      contrasenia: contrasenia
    };
    const headers = { 'Content-Type': 'application/json' };
    return this.http.post(`${this.baseUrl}/api/users/auth/login`, dataForm, { headers });
  }



}
