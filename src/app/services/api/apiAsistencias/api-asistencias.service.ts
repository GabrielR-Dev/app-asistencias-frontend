import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Asistencia } from 'src/app/models/asistencia.model';

@Injectable({
  providedIn: 'root'
})
export class ApiAsistenciasService {

  constructor(private http: HttpClient) { }

  crearAsistencia(asistencia: Asistencia) {
    const usuarioLogueado = JSON.parse(localStorage.getItem('usuarioLogueado') || '{}');
    const token = usuarioLogueado.token || '';
    const headers = new HttpHeaders()
      .set('Authorization', `Bearer ${token}`)
      .set('Content-Type', 'application/json');
    return this.http.post('http://localhost:8080/api/asistencias', asistencia, { headers });
  }


  getAsistenciasPorEvento(eventoId: number) {
    const usuarioLogueado = JSON.parse(localStorage.getItem('usuarioLogueado') || '{}');
    const token = usuarioLogueado.token || '';
    const headers = new HttpHeaders()
      .set('Authorization', `Bearer ${token}`);
    return this.http.get<Asistencia[]>(`http://localhost:8080/api/asistencias/evento/${eventoId}`, { headers });
  }
}
