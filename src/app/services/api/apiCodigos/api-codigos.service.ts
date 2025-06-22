import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Asistencia } from 'src/app/models/asistencia.model';
import { CodigoAsistencia } from 'src/app/models/codigoAsistencia';

@Injectable({
  providedIn: 'root'
})
export class ApiCodigosService {

  private baseUrl = 'https://app-asistencias-backend-qa38.onrender.com';
  constructor(private http: HttpClient) { }




  marcarAsistenciaConCodigo(codigoIngresado: string, idAsistencia: number) {
    const usuarioLogueado = JSON.parse(localStorage.getItem('usuarioLogueado') || '{}');
    const token = usuarioLogueado.token || '';

    const headers = new HttpHeaders()
      .set('Authorization', `Bearer ${token}`)
      .set('Content-Type', 'application/json');

    const body = {
      "codigoAsistencia": codigoIngresado  // 👈 Enviar como body, no en headers
    };

    return this.http.post(
      `${this.baseUrl}/api/presentismos/${idAsistencia}`,
      body,
      { headers }
    );

  }




  getCodigoPorIdEvento(id: number): Observable<CodigoAsistencia> {
    const usuarioLogueado = JSON.parse(localStorage.getItem('usuarioLogueado') || '{}');
    const token = usuarioLogueado.token || '';
    const headers = new HttpHeaders()
      .set('Authorization', `Bearer ${token}`)
      .set('Content-Type', 'application/json');
    return this.http.get<CodigoAsistencia>(`${this.baseUrl}/api/presentismos/random/${id}`, { headers });
  }




  deleteCodigo(id: number) {
    const usuarioLogueado = JSON.parse(localStorage.getItem('usuarioLogueado') || '{}');
    const token = usuarioLogueado.token || '';
    const headers = new HttpHeaders()
      .set('Authorization', `Bearer ${token}`)
      .set('Content-Type', 'application/json');
    return this.http.get(`${this.baseUrl}/api/presentismos/random/${id}`, { headers });
  }




  deleteCodigos(idAsistencia: number): Observable<any> {
    const usuarioLogueado = JSON.parse(localStorage.getItem('usuarioLogueado') || '{}');
    const token = usuarioLogueado.token || '';

    const headers = new HttpHeaders()
      .set('Authorization', `Bearer ${token}`)
      .set('Content-Type', 'application/json');


    return this.http.delete(`${this.baseUrl}/api/presentismos/${idAsistencia}`, {
      headers
    });

  }


}
