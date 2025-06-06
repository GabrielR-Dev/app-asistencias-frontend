import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Evento } from 'src/app/models/evento.model';

@Injectable({
  providedIn: 'root'
})
export class ApiEventosService {

  constructor(private http: HttpClient) { }

  token = localStorage.getItem('token') || '';


  crearEvento(evento: any) {
    const usuarioLogueado = JSON.parse(localStorage.getItem('usuarioLogueado') || '{}');
    const token = usuarioLogueado.token || '';
    const headers = new HttpHeaders()
      .set('Authorization', `Bearer ${token}`)
      .set('Content-Type', 'application/json');
    return this.http.post('http://localhost:8080/api/eventos', evento, { headers });
  }

  borrarEvento(id: string | number) {
    const usuarioLogueado = JSON.parse(localStorage.getItem('usuarioLogueado') || '{}');
    const token = usuarioLogueado.token || '';
    const headers = new HttpHeaders()
      .set('Authorization', `Bearer ${token}`)
      .set('Content-Type', 'application/json');
    return this.http.delete(`http://localhost:8080/api/eventos/${id}`, { headers });
  }

  verMisEventos() : Observable<Evento[]> {
    const usuarioLogueado = JSON.parse(localStorage.getItem('usuarioLogueado') || '{}');
    const token = usuarioLogueado.token || '';
    const id = usuarioLogueado.idUsuario;
    console.log(usuarioLogueado)
    console.log(id)
    console.log(token)
    const headers = new HttpHeaders()
      .set('Authorization', `Bearer ${token}`)
      .set('Content-Type', 'application/json');
    return this.http.get<Evento[]>(`http://localhost:8080/api/eventos/usuario/${id}`, { headers });
  }
}

