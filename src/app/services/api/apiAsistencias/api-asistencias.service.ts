import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, throwError } from 'rxjs';
import { Asistencia } from 'src/app/models/asistencia.model';
import { CodigoAsistencia } from 'src/app/models/codigoAsistencia';
import { Presentismo } from 'src/app/models/presentismo.model';
import { UsuarioM } from 'src/app/models/usuario.model';
import { UsuarioPresente } from 'src/app/models/usuarioPresente.model';

@Injectable({
  providedIn: 'root'
})
export class ApiAsistenciasService {


  private baseUrl = 'https://app-asistencias-backend-qa38.onrender.com';

  constructor(private http: HttpClient,) { }

  crearAsistencia(asistencia: Asistencia): Observable<any> {
    const headers = this.getHeaders();
    return this.http.post(`${this.baseUrl}/api/asistencias`, asistencia, { headers });
  }

  getAsistenciasPorEvento(eventoId: number): Observable<Asistencia[]> {
    const headers = this.getHeaders();
    return this.http.get<Asistencia[]>(`${this.baseUrl}/api/asistencias/evento/${eventoId}`, { headers })
      .pipe(
        catchError(err => {
          console.error('Error al obtener asistencias:', err);
          return throwError(() => new Error('No se pudo obtener las asistencias'));
        })
      );
  }

  getCodigoPresentismo(asistenciaId: number, eventoId: number): Observable<CodigoAsistencia> {
    const headers = this.getHeaders();
    return this.http.get<CodigoAsistencia>(`${this.baseUrl}/api/presentismos/random/evento/${eventoId}/asistencia/${asistenciaId}`, { headers });
  }


  private getHeaders(): HttpHeaders {
    const usuarioLogueado = JSON.parse(localStorage.getItem('usuarioLogueado') || '{}');
    const token = usuarioLogueado.token || '';
    return new HttpHeaders()
      .set('Authorization', `Bearer ${token}`)
      .set('Content-Type', 'application/json');
  }


  getEstuvoPresente(): Observable<Presentismo[]> {
    const headers = this.getHeaders();
    return this.http.get<Presentismo[]>(`${this.baseUrl}/api/presentismos`, { headers })
      .pipe(
        catchError(err => {
          console.error('Error al obtener asistencias:', err);
          return throwError(() => new Error('No se pudo obtener los presentismos'));
        })
      );
  }

verificarCodigo(codigoAsistencia: string, idAsistencia: number): Observable<CodigoAsistencia> {
  const headers = this.getHeaders().set("codigoAsistencia", codigoAsistencia);

  return this.http.get<CodigoAsistencia>(
    `${this.baseUrl}/api/presentismos/asistencia/${idAsistencia}`,
    { headers }
  );
}
  /*verificarCodigo(asistenciaId: number, eventoId: number, codigo: String): Observable<CodigoAsistencia> {
    const headers = this.getHeaders();
    headers.set("codigoAsistencia", codigo)
    return this.http.get<CodigoAsistencia>(`${this.baseUrl}/presentismos/random/evento/${eventoId}/asistencia/${asistenciaId}`, { headers });
  }*/

verPresentes(idAsistencia: number): Observable<UsuarioPresente[]> {
    const headers = this.getHeaders();
    return this.http.get<UsuarioPresente[]>(`${this.baseUrl}/api/presentismos/${idAsistencia}`, { headers })
      .pipe(
        catchError(err => {
          console.error('Error al obtener asistencias:', err);
          return throwError(() => new Error('No se pudo obtener los presentismos'));
        })
      );
  } 



}

