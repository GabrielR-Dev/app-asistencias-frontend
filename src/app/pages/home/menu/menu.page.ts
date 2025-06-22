import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Evento } from 'src/app/models/evento.model';
import { ApiEventosService } from 'src/app/services/api/apiEventos/api-eventos.service';
import { firstValueFrom } from 'rxjs';

@Component({
  standalone: false,
  selector: 'app-menu',
  templateUrl: './menu.page.html',
  styleUrls: ['./menu.page.scss'],
})
export class MenuPage implements OnInit {


  listaMisEventosSuscriptos: Evento[] = []; //Variable para alar los eventos suscriptos que devuelve la api
  codigoInvitacion: string = '';
  usuarioLogueado = JSON.parse(localStorage.getItem('usuarioLogueado') || '{}'); // Guardammos datos del usuario que inicio sesion
  modalAbierto: boolean = false; //Variable para modal
  //Creamos una variable para default del form
  eventoForm: Evento = {
    id: 0,
    nombre: '',
    descripcion: '',
    organizadorNombre: '',
    organizadorApellido: '',
    fechaCreacion: '',
    codigoInvitacion: '',
    creadorNombre: '',
    creadorApellido: ''
  };
  eventos: Evento[] = [];

  // Buscar materia por código de invitación
  eventoBuscado: Evento | null = null;
  yaSuscripto: boolean = false;
  cargandoEventos: boolean = false;
  esMiEvento: boolean = false;


  

  constructor(
    private router: Router,
    //private cargarMasDatos: CargarMasDatosService,
    private apiEventos: ApiEventosService,
  ) { }





  ngOnInit() {
    this.cargarEventosUsuarioDesdeApi();
    this.cargarSuscripcionesUsuarioDesdeApi();

    const eventosSuscriptos = JSON.parse(localStorage.getItem('suscripciones') || '[]');
    this.listaMisEventosSuscriptos = eventosSuscriptos.map((e: any) => new Evento(
      e.id,
      e.nombre,
      e.descripcion || '',
      e.organizadorNombre || '',
      e.organizadorApellido || '',
      e.fechaCreacion || '',
      e.codigoInvitacion || '',
      e.creadorNombre || '',
      e.creadorApellido || ''
    ));

    // Cargar Eventos desde localStorage y mapear a instancias de Eventos
    const eventos = JSON.parse(localStorage.getItem('eventos') || '[]');
    this.eventos = eventos.map((e: any) => new Evento(
      e.id,
      e.nombre,
      e.descripcion,
      e.organizadorNombre,
      e.organizadorApellido,
      e.fechaCreacion,
      e.codigoInvitacion,
      e.creadorNombre,
      e.creadorApellido
    ));

    // Obtener usuario logueado real desde localStorage
    const usuarioLogueado = JSON.parse(localStorage.getItem('usuarioLogueado') || 'null');
    if (usuarioLogueado && usuarioLogueado.id !== undefined && usuarioLogueado.id !== null && usuarioLogueado.id !== '') {
      this.usuarioLogueado = usuarioLogueado;
    } else {
      // Solo redirigir si NO está en la página de login y no hay usuario válido
      if (this.router.url !== '/login') {
        //this.router.navigate(['/login']);
        console.log('No hay usuario logueado, redirigiendo a login');
      }
      return;
    }

  }






  // Busca los Eventos por código de invitación en todas las eventos guardadas
  agregarListaPorCodigo() {
    this.apiEventos.buscarEventoPorCodigoInvitacion(this.codigoInvitacion)
      .subscribe({
        next: (eventoEncontrado) => {
          if (eventoEncontrado) {
            this.eventoBuscado = new Evento(
              eventoEncontrado.id,
              eventoEncontrado.nombre,
              eventoEncontrado.descripcion,
              eventoEncontrado.organizadorNombre,
              eventoEncontrado.organizadorApellido,
              eventoEncontrado.fechaCreacion,
              eventoEncontrado.codigoInvitacion,
              eventoEncontrado.creadorNombre,
              eventoEncontrado.creadorApellido
            );

            // Verificar si ya está suscripto
            this.yaSuscripto = this.listaMisEventosSuscriptos.some(
              e => e.codigoInvitacion === eventoEncontrado.codigoInvitacion
            );

            // Verificar si el evento pertenece al usuario (es su propio evento)
            const miEvento = this.eventos.find(e =>
              e.codigoInvitacion === this.eventoBuscado!.codigoInvitacion
            );

            this.esMiEvento = !!miEvento;
          } else {
            this.eventoBuscado = null;
            this.yaSuscripto = false;
            this.esMiEvento = false;
          }
        },
        error: (err) => {
          console.error('Error buscando evento por código:', err);
          this.eventoBuscado = null;
          this.yaSuscripto = false;
          this.esMiEvento = false;
        }
      });
  }






  buscarEventoPorCodigo() {
    if (!this.codigoInvitacion) return;

    this.apiEventos.buscarEventoPorCodigoInvitacion(this.codigoInvitacion).subscribe({
      next: (evento) => {
        this.eventoBuscado = evento;



        // Verificar si ya está suscripto en la lista local
        this.yaSuscripto = this.listaMisEventosSuscriptos.some(
          e => e.codigoInvitacion.toString() === evento.codigoInvitacion.toString()
        );
      },
      error: (error) => {
        console.error('Error buscando evento:', error);
        this.eventoBuscado = null;
        this.yaSuscripto = false;
      }
    });
  }





  suscribirseAEvento() {
    const codigoInvitacion = this.eventoBuscado?.codigoInvitacion;

    if (!codigoInvitacion) {
      console.warn("No hay código de invitación disponible.");
      return;
    }

    this.apiEventos.suscribirseAEvento(codigoInvitacion).subscribe({
      next: (respuesta) => {
        this.yaSuscripto = true;

        if (!this.eventoBuscado) return;

        this.listaMisEventosSuscriptos.push(this.eventoBuscado);

        const suscripciones = JSON.parse(localStorage.getItem('suscripciones') || '[]');

        const yaExiste = suscripciones.some((e: any) => e.id === this.eventoBuscado!.id);
        if (!yaExiste) {
          suscripciones.push(this.eventoBuscado);
          localStorage.setItem('suscripciones', JSON.stringify(suscripciones));
        }

        console.log('Suscripción agregada correctamente.');
      },
      error: (error) => {
        console.error("Error al suscribirse:", error);
      }
    });
  }






  // Modal de eventos para crear
  abrirModal() {
    const usuarioLogueado = this.usuarioLogueado;
    this.eventoForm = {
      id: 0 as 1,
      nombre: '',
      descripcion: '',
      organizadorNombre: '',
      organizadorApellido: '',
      fechaCreacion: '',
      codigoInvitacion: '',
      creadorNombre: '',
      creadorApellido: ''
    };
    this.modalAbierto = true;
  }






  cerrarModal() {
    this.modalAbierto = false;
  }





  // Guarda el evento seleccionado en localStorage y navega a la página de detalle Es
  detalleEvento(evento: Evento) {
    localStorage.setItem('eventoDetalle', JSON.stringify(evento));
    this.router.navigate(['menu/materia-detalle']);
  }






  detalleSuscripto(evento: Evento) {
    localStorage.setItem('suscripcionDetalle', JSON.stringify(evento));
    this.router.navigate(['menu/evento-suscripto']);
  }





  cargarEventosUsuarioDesdeApi() {
    this.apiEventos.verMisEventos().subscribe({
      next: (data: Evento[]) => {
        console.log(data);
        // Convertir la respuesta en instancias de Evento
        const eventosConvertidos: Evento[] = data.map(e => new Evento(
          e.id,
          e.nombre,
          e.descripcion,
          e.organizadorNombre,
          e.organizadorApellido,
          e.fechaCreacion,
          e.codigoInvitacion,
          e.creadorNombre,
          e.creadorApellido
        ));

        this.eventos = eventosConvertidos;

        // Guardar en localStorage
        localStorage.setItem('eventos', JSON.stringify(eventosConvertidos));

        this.cargandoEventos = false;
      },
      error: (err: any) => {
        this.cargandoEventos = false;
        console.error('Error al cargar eventos del usuario', err);
      }
    });
  }






  cargarSuscripcionesUsuarioDesdeApi() {

    this.apiEventos.misSuscripcionesDeEventos().subscribe({
      next: (data: Evento[]) => {
        console.log(data);
        // Convertir la respuesta en instancias de Evento
        const eventosConvertidos: Evento[] = data.map(e => new Evento(
          e.id,
          e.nombre,
          e.descripcion,
          e.organizadorNombre,
          e.organizadorApellido,
          e.fechaCreacion,
          e.codigoInvitacion,
          e.creadorNombre,
          e.creadorApellido
        ));

        this.listaMisEventosSuscriptos = eventosConvertidos;

        // Guardar en localStorage
        localStorage.setItem('suscripciones', JSON.stringify(eventosConvertidos));

        this.cargandoEventos = false;
      },
      error: (err: any) => {
        this.cargandoEventos = false;
        console.error('Error al cargar eventos del usuario', err);
      }
    });
  }





  async guardaEvento() {
    const nuevoEvento = {
      nombre: this.eventoForm.nombre,
      descripcion: this.eventoForm.descripcion,
    };

    try {
      const response = await firstValueFrom(this.apiEventos.crearEvento(nuevoEvento));
      console.log(response)
      this.cargarEventosUsuarioDesdeApi();
      this.cerrarModal();
    } catch (error) {
      console.error('Error al crear evento en la API', error);
    }
  }






  async eliminarEvento(evento: Evento) {
    if (evento.id !== undefined) {
      this.apiEventos.borrarEvento(evento.id).subscribe({
        next: () => {
          // 1. Filtramos la lista de eventos y cambiamos la referencia
          //this.eventos = this.eventos.filter(e => e.codigoInvitacion !== evento.codigoInvitacion);
          this.eventos = this.eventos.filter(e => e.id !== evento.id);

          this.cargarEventosUsuarioDesdeApi();
          // 2. Guardamos la nueva lista en el localStorage
          localStorage.setItem('eventos', JSON.stringify(this.eventos));

          // 3. Si el evento eliminado era el que estaba seleccionado, lo limpiamos
          if (this.eventoBuscado && this.eventoBuscado.codigoInvitacion === evento.codigoInvitacion) {
            this.eventoBuscado = null;
            this.yaSuscripto = false;
          }

        },
        error: (error) => {
          console.error('Error al borrar evento en la API', error);
        }
      });
    } else {
      console.error('El evento no tiene un código de invitación válido.');
    }
  }






  desuscribirseDeEvento(idEvento: number) {
    this.apiEventos.desuscribirseAEvento(idEvento).subscribe({
      next: () => {
        this.listaMisEventosSuscriptos = this.listaMisEventosSuscriptos.filter(
          evento => evento.id !== idEvento
        );
      },
      error: (err) => {
        console.error('Error al desuscribirse:', err);
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

}
