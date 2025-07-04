

import { Component, OnInit } from '@angular/core';
import { Evento } from 'src/app/models/evento.model';
import { Asistencia } from 'src/app/models/asistencia.model';
import { Location } from '@angular/common';
import { ApiAsistenciasService } from 'src/app/services/api/apiAsistencias/api-asistencias.service';
import { CodigoAsistencia } from 'src/app/models/codigoAsistencia';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ApiCodigosService } from 'src/app/services/api/apiCodigos/api-codigos.service';
import { Presentismo } from 'src/app/models/presentismo.model';
@Component({
  selector: 'app-evento-suscripto',
  templateUrl: './evento-suscripto.page.html',
  styleUrls: ['./evento-suscripto.page.scss'],
  standalone: false
})
export class EventoSuscriptoPage implements OnInit {
  evento: Evento | null = null;

  mostrarPresencialidad = false;
  modalAsistenciaAbierto = false;
  nuevaAsistencia = { titulo: "", fecha: '', horaInicio: '', horaFin: '', descripcion: '', nombreLugar: '', direccion: '', cantColaboradores: 0 };
  errorMsg: string = '';
  codigoForm!: FormGroup;

  modalCodigoAbierto = false;
  codigoAsistencia!: CodigoAsistencia;
  asistenciaSeleccionada: Asistencia | null = null;
  codigoIngresado: any;

  constructor(
    private location: Location,
    private apiAsistencias: ApiAsistenciasService,
    private apiCodigos: ApiCodigosService,
    private fb: FormBuilder
  ) { }

  ngOnInit() {

    const storedEvento = localStorage.getItem('suscripcionDetalle');
    if (storedEvento) {
      this.evento = JSON.parse(storedEvento);
    } else {
      this.evento = null;
    }
    this.cargarAsistencias(this.evento!.id);
    const marcados = localStorage.getItem('presentismosMarcados');
    if (marcados) {
      this.presentismosMarcadosIds = JSON.parse(marcados);
    }
    setInterval(() => {
      this.actualizarEstadoAsistenciasDesdeLocalStorage();
    }, 20000);


    this.codigoForm = this.fb.group({
      codigo: ['', [
        Validators.required,
        Validators.minLength(6),
        Validators.maxLength(6),
        Validators.pattern('^[a-zA-Z0-9]*$')  // Acepta letras y números
      ]]
    });

    this.cargarPresentismos();

  }



  //Ejecuta antes de cerrar la pagina
  ionViewWillLeave() {
    localStorage.removeItem('suscripcionDetalle');
    localStorage.removeItem('eventos');
    localStorage.removeItem('asistencias');
    localStorage.removeItem('presentismos');
  }





  estuvoPresente: Presentismo[] = [];
  cargarPresentismos() {
    this.apiAsistencias.getEstuvoPresente().subscribe({
      next: (presentes) => {
        this.estuvoPresente = presentes;
        localStorage.setItem('presentismos', JSON.stringify(presentes));

      },
      error: (err) => {
        console.error('Error al cargar presentismos', err);
      }
    });
  }

  estaPresente(asistenciaId: number): boolean {
    return this.estuvoPresente.some(p => p.asistenciaId === asistenciaId && p.presente === 1);
  }





  asistenciasFuturas: Asistencia[] = [];
  asistenciasEnCurso: Asistencia[] = [];
  asistenciasPasadas: Asistencia[] = [];

  cargarAsistencias(eventoId: number) {
    this.asistenciasFuturas = [];
    this.asistenciasEnCurso = [];
    this.asistenciasPasadas = [];

    //Treamos las asistencias por el id del evento
    this.apiAsistencias.getAsistenciasPorEvento(eventoId).subscribe({
      next: (asistenciasApi: Asistencia[]) => {
        const asistencias = asistenciasApi.map(a => new Asistencia(
          a.titulo,
          a.fecha,
          a.horaInicio,
          a.horaFin,
          a.descripcion,
          a.nombreLugar,
          a.direccion,
          a.cantColaboradores,
          eventoId,
          a.id
        ));

        localStorage.setItem('asistencias', JSON.stringify(asistencias));
        console.log(asistencias);
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
      },
      error: error => {
        console.error('Error al cargar asistencias desde la API', error);
      }
    });
  }


  actualizarEstadoAsistencias() {
    if (this.evento) {
      this.cargarAsistencias(this.evento.id);
    }
  }





  // 
  actualizarEstadoAsistenciasDesdeLocalStorage() {
    const asistenciasLST = localStorage.getItem('asistencias');
    if (!asistenciasLST) return;

    const asistenciasGuardadas: Asistencia[] = JSON.parse(asistenciasLST);
    this.asistenciasFuturas = [];
    this.asistenciasEnCurso = [];
    this.asistenciasPasadas = [];

    const ahora = new Date();

    for (const asistencia of asistenciasGuardadas) {
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
        this.apiCodigos.deleteCodigo(asistencia.id!);
      }
    }
  }




  mostrarAgregarPresencialidad() {
    this.mostrarPresencialidad = !this.mostrarPresencialidad;
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
    let fecha = this.nuevaAsistencia.fecha;
    if (/^\d{4}-\d{2}-\d{2}$/.test(fecha)) {
      const [y, m, d] = fecha.split('-');
      fecha = `${d}-${m}-${y}`;
    } else if (/^\d{2}\/\d{2}\/\d{4}$/.test(fecha)) {
      const [d, m, y] = fecha.split('/');
      fecha = `${d}-${m}-${y}`;
    }
    const nueva = new Asistencia(
      this.nuevaAsistencia.titulo,
      fecha,
      this.nuevaAsistencia.horaInicio,
      this.nuevaAsistencia.horaFin,
      this.nuevaAsistencia.descripcion,
      this.nuevaAsistencia.nombreLugar,
      this.nuevaAsistencia.direccion,
      this.nuevaAsistencia.cantColaboradores,
      this.evento?.id || 0
    );
    this.apiAsistencias.crearAsistencia(nueva).subscribe({
      next: (asistenciaCreada) => {
        this.asistenciasFuturas.push(nueva);
        this.cerrarModalAsistencia();
      },
      error: (error: any) => {
        console.error('Error al crear asistencia', error);
        this.errorMsg = 'No se pudo crear la asistencia. Intenta nuevamente.';
      }
    });
  }





  //Modal para mostrar el codigo que se le tiene que mostrar al colaborador
  abrirModalCodigo(asistencia: Asistencia) {
    this.asistenciaSeleccionada = asistencia;
    console.log("Asistencia seleccionada: " + this.asistenciaSeleccionada)

    localStorage.setItem('asistencia', JSON.stringify(asistencia));

    this.modalCodigoAbierto = true;

  }





  presentimoMarcado = false;
  codigoInvalido = false;
  mensajeCodigo = '';
  presentismosMarcadosIds: number[] = [];


  marcarPresentismo(codigoIngresado: string) {
    const asistenciaStr = localStorage.getItem('asistencia');
    if (!asistenciaStr) return;

    const asistencia: Asistencia = JSON.parse(asistenciaStr);
    let codigoIngresadoMayusculas = codigoIngresado.toLocaleUpperCase()

    this.apiCodigos.marcarAsistenciaConCodigo(codigoIngresadoMayusculas, asistencia.id!).subscribe({
      next: (res: any) => {
        console.log('Respuesta backend:', res);
        if (!res.success) {
          this.presentimoMarcado = false;
          this.codigoInvalido = true;
          this.mensajeCodigo = res.message;


        } else {
          this.presentimoMarcado = true;

          this.codigoInvalido = false;
          this.mensajeCodigo = res.message;

          if (!this.presentismosMarcadosIds.includes(asistencia.id!)) {
            this.presentismosMarcadosIds.push(asistencia.id!);
            localStorage.setItem('presentismosMarcados', JSON.stringify(this.presentismosMarcadosIds));
          }

          setTimeout(() => {
            this.modalCodigoAbierto = false;
            this.codigoIngresado = '';
          }, 2000);
        }
        // 👇 Lo agregás en cuanto se marque el presentismo

      },
      error: (err) => {
        console.error('Error al marcar asistencia:', err);
        this.presentimoMarcado = false;
        this.codigoInvalido = true;
        this.mensajeCodigo = 'Error en la comunicación con el servidor.';
      }
    });
    this.cargarPresentismos();
  }






  cerrarModalCodigo() {
    this.modalCodigoAbierto = false;
    this.codigoAsistencia;
    this.asistenciaSeleccionada = null;
  }






  getTiempoRestante(asistencia: Asistencia): string {
    const [dia, mes, anio] = asistencia.fecha.split('-').map(Number);
    const [hora, minuto] = asistencia.horaInicio.split(':').map(Number);
    const inicio = new Date(anio, mes - 1, dia, hora, minuto);
    const ahora = new Date();
    const diff = inicio.getTime() - ahora.getTime();

    if (diff <= 0) return 'Ya puedes marcar asistencia!';
    const dias = Math.floor(diff / (1000 * 60 * 60 * 24));
    const horas = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutos = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

    if (dias > 0) {
      return `Faltan ${dias}d ${horas}h ${minutos}m`;
    } else if (horas > 0) {
      return `Faltan ${horas}h ${minutos}m`;
    } else {
      return `Faltan ${minutos} minutos`;
    }
  }






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





  volverAtras() {
    this.location.back();
  }



}
