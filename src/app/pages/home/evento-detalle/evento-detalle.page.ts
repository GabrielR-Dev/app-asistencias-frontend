import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Evento } from 'src/app/models/evento.model';
import { Asistencia } from 'src/app/models/asistencia.model';
import { Location } from '@angular/common';
import { ApiAsistenciasService } from 'src/app/services/api/apiAsistencias/api-asistencias.service';
import { CodigoAsistencia } from 'src/app/models/codigoAsistencia';
import { ApiCodigosService } from 'src/app/services/api/apiCodigos/api-codigos.service';

@Component({
  selector: 'app-evento-detalle',
  templateUrl: './evento-detalle.page.html',
  styleUrls: ['./evento-detalle.page.scss'],
  standalone: false
})
export class EventoDetallePage implements OnInit {

  evento: Evento | null = null;
  asistenciasFuturas: Asistencia[] = [];
  asistenciasEnCurso: Asistencia[] = [];
  asistenciasPasadas: Asistencia[] = [];
  mostrarPresencialidad = false;
  modalAsistenciaAbierto = false;
  nuevaAsistencia = { titulo: "", fecha: '', horaInicio: '', horaFin: '', descripcion: '', nombreLugar: '', direccion: '', cantColaboradores: 0 };
  errorMsg: string = '';

  modalCodigoAbierto = false;
  codigoAsistencia!: CodigoAsistencia;
  asistenciaSeleccionada: Asistencia | null = null;

  constructor(
    private location: Location,
    private apiAsistencias: ApiAsistenciasService,
    private apiCodigo: ApiCodigosService
  ) { }




  ngOnInit() {
    const storedEvento = localStorage.getItem('eventoDetalle');
    if (storedEvento) {
      this.evento = JSON.parse(storedEvento);
    } else {
      this.evento = null;
    }
    this.cargarAsistencias(this.evento!.id);
    setInterval(() => {
      this.actualizarEstadoAsistenciasDesdeLocalStorage();
    }, 5000);
  }




  ionViewWillLeave() {
    localStorage.removeItem('eventoDetalle');
    localStorage.removeItem('eventos');
    localStorage.removeItem('asistencias');
  }






  cargarAsistencias(eventoId: number) {
    this.asistenciasFuturas = [];
    this.asistenciasEnCurso = [];
    this.asistenciasPasadas = [];

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




  copiado = false;
  async copiarCodigo(codigo: String) {
    try {
      await navigator.clipboard.writeText(codigo.toString());
      this.copiado = true;
      setTimeout(() => this.copiado = false, 2000); // vuelve al icono original después de 2 seg
    } catch (err) {
      console.error('Error al copiar:', err);
    }
  }




  actualizarEstadoAsistenciasDesdeLocalStorage() {
    const asistenciasStr = localStorage.getItem('asistencias');
    if (!asistenciasStr) return;

    const asistenciasGuardadas: Asistencia[] = JSON.parse(asistenciasStr);
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
        /*this.apiCodigo.deleteCodigos(asistencia.id!).subscribe({
          next: () => {
            console.log(`Códigos de asistencia ${asistencia.id} eliminados`);
          },
          error: (err) => {
            console.error(`Error al eliminar códigos de asistencia ${asistencia.id}:`, err);
            if (err.status === 403) {
              console.warn('No tenés permisos suficientes para eliminar este código.');
            }
          }
        });*/
      }
    }
  }





  mostrarAgregarPresencialidad() {
    this.mostrarPresencialidad = !this.mostrarPresencialidad;
  }






  abrirModalAsistencia() {
    //Con la instancia muestramos el contenido del modal
    this.nuevaAsistencia = new Asistencia(
      '',                          // titulo
      '',                          // fecha
      '',                          // horaInicio
      '',                          // horaFin
      '',                          // descripcion
      '',                          // lugar
      '',                          // direccion
      this.evento?.id || 0,        // eventoId
      0,                           // cantColaboradores
    );
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
        this.cerrarModalAsistencia();
        if (this.evento) {
          this.cargarAsistencias(this.evento.id);
        }
      },
      error: (error: any) => {
        console.error('Error al crear asistencia', error);
        this.errorMsg = 'No se pudo crear la asistencia. Intenta nuevamente.';
      }
    });




  }








  //Modal para mostrar el codigo que se le tiene que mostrar al colaborador
  intervalId: any; // Propiedad para guardar el ID del setInterval

  abrirModalCodigo(asistencia: Asistencia) {
    this.asistenciaSeleccionada = asistencia;

    this.apiAsistencias.getCodigoPresentismo(asistencia.id!, asistencia.eventoId).subscribe({
      next: (codigo) => {
        this.codigoAsistencia = codigo;
        this.modalCodigoAbierto = true;

        // Iniciar verificación cada 5 segundos
        this.intervalId = setInterval(() => {
          if (this.codigoAsistencia && this.codigoAsistencia.codigo && this.asistenciaSeleccionada?.id != null) {
            this.apiAsistencias.verificarCodigo(this.codigoAsistencia.codigo, this.asistenciaSeleccionada.id).subscribe({
              next: (res) => {
                console.log(res)
                console.log(res.codigo)
                localStorage.setItem("codigoAleatorio", JSON.stringify(res))
                this.codigoAsistencia = res;
              },
              error: (err) => {
                console.error('Error al verificar el código:', err);
              }
            });
          }
        }, 5000);
      },
      error: (err) => {
        console.error('Error al obtener el código:', err);
      }
    });
  }







  cerrarModalCodigo() {
    this.modalCodigoAbierto = false;
    this.codigoAsistencia = undefined!;
    this.asistenciaSeleccionada = null;

    // Limpiar intervalo al cerrar
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
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






  actualizarEstadoAsistencias() {
    if (this.evento) {

      this.cargarAsistencias(this.evento.id);
    }
  }





  volverAtras() {
    this.location.back();
  }

}
