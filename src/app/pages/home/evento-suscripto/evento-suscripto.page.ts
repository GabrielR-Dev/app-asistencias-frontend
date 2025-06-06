

import { Component, OnInit } from '@angular/core';
import { Evento } from 'src/app/models/evento.model';
import { Asistencia } from 'src/app/models/asistencia.model';
import { Location } from '@angular/common';
@Component({
  selector: 'app-evento-suscripto',
  templateUrl: './evento-suscripto.page.html',
  styleUrls: ['./evento-suscripto.page.scss'],
  standalone: false
}) 
export class EventoSuscriptoPage /*implements OnInit*/ {
  /*evento: Evento | null = null;
  asistenciasFuturas: Asistencia[] = [];
  asistenciasEnCurso: Asistencia[] = [];
  asistenciasPasadas: Asistencia[] = [];
  mostrarPresencialidad = false;
  modalAsistenciaAbierto = false;
  nuevaAsistencia = Asistencia;
  errorMsg: string = '';

  // Nuevas variables para el modal de código
  modalCodigoAbierto = false;
  codigoAsistencia: string = '';
  asistenciaSeleccionada: Asistencia | null = null;

  constructor(private location: Location) { }

  ngOnInit() {
    const eventoRaw = localStorage.getItem('eventoDetalle');
    if (eventoRaw) {
      const e = JSON.parse(eventoRaw);
      this.evento = new Evento(
        e.nombre,
        e.creadorId,
        e.descripcion,
        e.organizadorNombre,
        e.organizadorApellido,
        e.puntuacion,
        e.fechaCreacion,
        e.invitacion
      );
      this.evento.id = e.id;
    }

    this.cargarAsistenciasDesdeStorage();
    setInterval(() => this.actualizarEstadoAsistencias(), 20000);
    this.actualizarEstadoAsistencias();
  }


  ionViewWillEnter() {
    this.cargarAsistenciasDesdeStorage();
    this.actualizarEstadoAsistencias();
  }

  cargarAsistenciasDesdeStorage() {

    this.asistenciasFuturas = [];
    this.asistenciasEnCurso = [];
    this.asistenciasPasadas = [];
    const key = 'asistencias';
    const asistenciasRaw = localStorage.getItem(key);

    if (asistenciasRaw) {
      const asistencias = JSON.parse(asistenciasRaw).map((a: any) => new Asistencia(

        a.fecha, a.horaInicio, a.horaFin, a.descripcion, a.lugar, a.direccion, a.creadorId, a.eventoId

      ));
      const ahora = new Date();

      for (const asistencia of asistencias) {

        const [dia, mes, anio] = asistencia.fecha.split('-').map(Number);
        const [horaInicio, minutoInicio] = asistencia.horaInicio.split(':').map(Number);
        const [horaFin, minutoFin] = asistencia.horaFin.split(':').map(Number);
        const inicio = new Date(anio, mes - 1, dia, horaInicio, minutoInicio);
        const fin = new Date(anio, mes - 1, dia, horaFin, minutoFin);

        if (ahora < inicio) {
          this.asistenciasFuturas.push(asistencia);
        } else if (ahora >= inicio && ahora <= fin) {
          this.asistenciasEnCurso.push(asistencia);
        } else {
          this.asistenciasPasadas.push(asistencia);
        }

      }
    }
  }

  volverAtras() {
    this.location.back();
  }

  mostrarAgregarPresencialidad() {
    this.mostrarPresencialidad = !this.mostrarPresencialidad;
  }

  abrirModalAsistencia() {
    this.nuevaAsistencia = { fecha: '', horaInicio: '', horaFin: '', descripcion: '', lugar: '', direccion: '' };
    this.modalAsistenciaAbierto = true;
  }

  cerrarModalAsistencia() {
    this.modalAsistenciaAbierto = false;
  }

  agregarAsistenciaFutura() {
    this.errorMsg = '';
    if (!this.nuevaAsistencia.fecha || !/^[0-9]{2}-[0-9]{2}-[0-9]{4}$/.test(this.nuevaAsistencia.fecha)) {
      this.errorMsg = 'La fecha es obligatoria y debe tener formato dd-mm-aaaa';
      return;
    }
    if (!this.nuevaAsistencia.horaInicio || !/^\d{2}:\d{2}$/.test(this.nuevaAsistencia.horaInicio)) {
      this.errorMsg = 'La hora de inicio es obligatoria y debe tener formato HH:mm';
      return;
    }
    if (!this.nuevaAsistencia.horaFin || !/^\d{2}:\d{2}$/.test(this.nuevaAsistencia.horaFin)) {
      this.errorMsg = 'La hora de fin es obligatoria y debe tener formato HH:mm';
      return;
    }
    if (!this.nuevaAsistencia.descripcion) {
      this.errorMsg = 'La descripción es obligatoria';
      return;
    }
    if (!this.nuevaAsistencia.nombreLugar) {
      this.errorMsg = 'El lugar es obligatorio';
      return;
    }
    if (!this.nuevaAsistencia.direccion) {
      this.errorMsg = 'La dirección es obligatoria';
      return;
    }

    const usuarioLogueado = JSON.parse(localStorage.getItem('usuarioLogueado') || 'null');

    let fecha = this.nuevaAsistencia.fecha;

    if (/^\d{4}-\d{2}-\d{2}$/.test(fecha)) {
      const [y, m, d] = fecha.split('-');
      fecha = `${d}-${m}-${y}`;
    } else if (/^\d{2}\/\d{2}\/\d{4}$/.test(fecha)) {
      const [d, m, y] = fecha.split('/');
      fecha = `${d}-${m}-${y}`;
    }
    const nueva = new Asistencia(
      fecha,
      this.nuevaAsistencia.horaInicio,
      this.nuevaAsistencia.horaFin,
      this.nuevaAsistencia.descripcion,
      this.nuevaAsistencia.nombreLugar,
      this.nuevaAsistencia.direccion,
     usuarioLogueado?.id || 0,
      this.evento.id
    );

    this.asistenciasFuturas.push(nueva);

    // Guardar en localStorage
    const key = 'asistencias_' + (this.evento?.id || '');
    let asistenciasGuardadas = [];
    const asistenciasRaw = localStorage.getItem(key);


    if (asistenciasRaw) {
      asistenciasGuardadas = JSON.parse(asistenciasRaw);
    }


    asistenciasGuardadas.push(nueva);
    localStorage.setItem(key, JSON.stringify(asistenciasGuardadas));
    this.cerrarModalAsistencia();
  }

  abrirModalCodigo(asistencia: Asistencia) {

    this.asistenciaSeleccionada = asistencia;
    this.codigoAsistencia = Math.random().toString(36).substring(2, 8).toUpperCase();
    this.modalCodigoAbierto = true;

  }

  cerrarModalCodigo() {

    this.modalCodigoAbierto = false;
    this.codigoAsistencia = '';
    this.asistenciaSeleccionada = null;

  }

  // Devuelve el tiempo restante en formato legible para una asistencia futura
  getTiempoRestante(asistencia: Asistencia): string {

    const [dia, mes, anio] = asistencia.fecha.split('-').map(Number);
    const [hora, minuto] = asistencia.horaInicio.split(':').map(Number);
    const inicio = new Date(anio, mes - 1, dia, hora, minuto);
    const ahora = new Date();
    const diff = inicio.getTime() - ahora.getTime();

    if (diff <= 0) return '¡Ya puedes marcar asistencia!';
    const horas = Math.floor(diff / (1000 * 60 * 60));
    const minutos = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    if (horas > 0) {
      return `Faltan ${horas}h ${minutos}m`;
    } else {
      return `Faltan ${minutos} minutos`;
    }
  }


  // Devuelve el tiempo restante para que termine la asistencia en curso
  getTiempoRestanteEnCurso(asistencia: Asistencia): string {

    const [dia, mes, anio] = asistencia.fecha.split('-').map(Number);
    const [horaFin, minutoFin] = asistencia.horaFin.split(':').map(Number);
    const fin = new Date(anio, mes - 1, dia, horaFin, minutoFin);
    const ahora = new Date();
    const diff = fin.getTime() - ahora.getTime();
    
    if (diff <= 0) return '¡Asistencia finalizada!';
    const horas = Math.floor(diff / (1000 * 60 * 60));
    const minutos = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    if (horas > 0) {
      return `Faltan ${horas}h ${minutos}m para cerrar`;
    } else {
      return `Faltan ${minutos} minutos para cerrar`;
    }
  }

  // Formatea automáticamente la fecha a dd-mm-aaaa y la hora a HH:mm mientras se escribe
  onFechaInput(event: any) {
    let value = event.target.value.replace(/[^0-9]/g, '');
    if (value.length > 2) value = value.slice(0, 2) + '-' + value.slice(2);
    if (value.length > 5) value = value.slice(0, 5) + '-' + value.slice(5, 9);
    if (value.length > 10) value = value.slice(0, 10);
    this.nuevaAsistencia.fecha = value;
  }

  onHoraInput(event: any, field: 'horaInicio' | 'horaFin') {
    let value = event.target.value.replace(/[^0-9]/g, '');
    if (value.length > 2) value = value.slice(0, 2) + ':' + value.slice(2);
    if (value.length > 5) value = value.slice(0, 5);
    this.nuevaAsistencia[field] = value;
  }

  actualizarEstadoAsistencias() {
    const ahora = new Date();
    this.asistenciasFuturas = this.asistenciasFuturas.filter(asistencia => {
      // Convertir fecha y horaInicio a objeto Date
      const [dia, mes, anio] = asistencia.fecha.split('-').map(Number);
      const [hora, minuto] = asistencia.horaInicio.split(':').map(Number);
      const [horaFin, minutoFin] = asistencia.horaFin.split(':').map(Number);
      const inicio = new Date(anio, mes - 1, dia, hora, minuto);
      const fin = new Date(anio, mes - 1, dia, horaFin, minutoFin);
      // Si ya está en curso, mover a asistenciasEnCurso
      if (ahora >= inicio && ahora <= fin) {
        this.asistenciasEnCurso.push(asistencia);
        return false; // quitar de futuras
      }
      // Si ya pasó, mover a asistenciasPasadas
      if (ahora > fin) {
        this.asistenciasPasadas.push(asistencia);
        return false;
      }
      return true; // sigue siendo futura
    });
    // Ahora también revisamos si alguna en curso debe pasar a pasada
    this.asistenciasEnCurso = this.asistenciasEnCurso.filter(asistencia => {
      const [dia, mes, anio] = asistencia.fecha.split('-').map(Number);
      const [horaFin, minutoFin] = asistencia.horaFin.split(':').map(Number);
      const fin = new Date(anio, mes - 1, dia, horaFin, minutoFin);
      if (ahora > fin) {
        this.asistenciasPasadas.push(asistencia);
        return false;
      }
      return true;
    });
    // Limpiar duplicados en EnCurso y Pasadas
    this.asistenciasEnCurso = this.asistenciasEnCurso.filter((a, i, arr) =>
      arr.findIndex(b => b.fecha === a.fecha && b.horaInicio === a.horaInicio) === i
    );
    this.asistenciasPasadas = this.asistenciasPasadas.filter((a, i, arr) =>
      arr.findIndex(b => b.fecha === a.fecha && b.horaInicio === a.horaInicio) === i
    );
  }*/
}
