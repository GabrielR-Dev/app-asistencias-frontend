import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Evento } from 'src/app/models/evento.model';

@Injectable({
  providedIn: 'root'
})
export class ApiEventosService {

  private baseUrl = 'https://app-asistencias-backend-qa38.onrender.com';
  token = localStorage.getItem('token') || '';

  constructor(private http: HttpClient) { }



  crearEvento(evento: any) {
    const usuarioLogueado = JSON.parse(localStorage.getItem('usuarioLogueado') || '{}');
    const token = usuarioLogueado.token || '';
    const headers = new HttpHeaders()
      .set('Authorization', `Bearer ${token}`)
      .set('Content-Type', 'application/json');
    return this.http.post(`${this.baseUrl}/api/eventos`, evento, { headers });
  }



  borrarEvento(id: string | number) {
    const usuarioLogueado = JSON.parse(localStorage.getItem('usuarioLogueado') || '{}');
    const token = usuarioLogueado.token || '';
    const headers = new HttpHeaders()
      .set('Authorization', `Bearer ${token}`)
      .set('Content-Type', 'application/json');
    return this.http.delete(`${this.baseUrl}/api/eventos/${id}`, { headers });
  }



  verMisEventos(): Observable<Evento[]> {
    const usuarioLogueado = JSON.parse(localStorage.getItem('usuarioLogueado') || '{}');
    const token = usuarioLogueado.token || '';
    const id = usuarioLogueado.idUsuario;
    console.log(usuarioLogueado)
    console.log(id)
    console.log(token)
    const headers = new HttpHeaders()
      .set('Authorization', `Bearer ${token}`)
      .set('Content-Type', 'application/json');
    return this.http.get<Evento[]>(`${this.baseUrl}/api/eventos/usuario/${id}`, { headers });
  }



  buscarEventoPorCodigoInvitacion(codigoDeInvitacion: string): Observable<Evento> {
    const usuarioLogueado = JSON.parse(localStorage.getItem('usuarioLogueado') || '{}');
    const token = usuarioLogueado.token || '';
    const headers = new HttpHeaders()
      .set('Authorization', `Bearer ${token}`)
      .set('Content-Type', 'application/json');
    return this.http.get<Evento>(`${this.baseUrl}/api/eventos/codigo/${codigoDeInvitacion}`, { headers });
  }



  suscribirseAEvento(codigoInvitacion: String) {
    const usuarioLogueado = JSON.parse(localStorage.getItem('usuarioLogueado') || '{}');
    const token = usuarioLogueado.token || '';

    const headers = new HttpHeaders()
      .set('Authorization', `Bearer ${token}`)
      .set('Content-Type', 'application/json');

    const body = { codigoInvitacion };

    return this.http.post<Evento>(`${this.baseUrl}/api/suscripcion`, body, { headers });
  }



  misSuscripcionesDeEventos(): Observable<Array<Evento>> {
    const usuarioLogueado = JSON.parse(localStorage.getItem('usuarioLogueado') || '{}');
    const token = usuarioLogueado.token || '';

    const headers = new HttpHeaders()
      .set('Authorization', `Bearer ${token}`)
      .set('Content-Type', 'application/json');

    return this.http.get<Array<Evento>>(`${this.baseUrl}/api/suscripcion`, { headers });
  }



  desuscribirseAEvento(idEvento: number): Observable<Array<Evento>> {
    const usuarioLogueado = JSON.parse(localStorage.getItem('usuarioLogueado') || '{}');
    const token = usuarioLogueado.token || '';

    const headers = new HttpHeaders()
      .set('Authorization', `Bearer ${token}`)
      .set('Content-Type', 'application/json');

    return this.http.delete<Array<Evento>>(`${this.baseUrl}/api/suscripcion/${idEvento}`, { headers });
  }


}

