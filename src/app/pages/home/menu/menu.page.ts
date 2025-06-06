import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CargarMasDatosService } from 'src/app/services/cargar-mas-datos.service';
import { ListaM } from 'src/app/models/lista.model';
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
  listaAsist: ListaM[] = [];
  listaAsistCarga: Evento[] = [];
  listaAsistDisponibles: ListaM[] = [];
  codigoInvitacion: string = '';
  usuarioLogueado = JSON.parse(localStorage.getItem('usuarioLogueado') || '{}');


  modalAbierto: boolean = false;
  eventoForm: Evento = {
    id: undefined,
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

  // Nuevo: usuario logueado

  constructor(
    private router: Router,
    private cargarMasDatos: CargarMasDatosService,
    private apiEventos: ApiEventosService,
    private cdRef: ChangeDetectorRef


  ) { }

  ngOnInit() {
    //this.listaAsist = JSON.parse(localStorage.getItem('listas') || '[]')
    //this.cargaIniciadoraAsist()   //llama a una función para crear listas
    this.listaAsistCarga.push(...this.cargarMasDatos.cargarInicial(this.listaAsist))    //carga 10 listas de todas las que tengo

    this.cargarEventosUsuarioDesdeApi();

    // Cargar materias desde localStorage y mapear a instancias de Materia
    const eventosRaw = JSON.parse(localStorage.getItem('eventos') || '[]');
    this.eventos = eventosRaw.map((e: any) => new Evento(
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

    // Al cargar eventos suscriptos desde storage, restaurar la descripción si existe
    const eventosSuscriptosRaw = JSON.parse(localStorage.getItem('eventosSuscriptos') || '[]');
    if (eventosSuscriptosRaw.length > 0) {
      this.listaAsistCarga = eventosSuscriptosRaw.map((e: any) => {
        const l = new ListaM(e.nombre, e.invitacion);
        l.invitacion = e.invitacion;
        (l as any).descripcion = e.descripcion || '';
        (l as any).creadorNombre = e.creadorNombre || '';
        return l;
      });
    }
  }


  //carga mas de las listas que tengo (carga de a 10)
  cargarMasListas() {
    const carga = this.cargarMasDatos.cargarMas(this.listaAsist, this.listaAsistCarga);
    this.listaAsistCarga.push(...carga);
  }

  //te lleva a una página donde estará todo el detalle de la lista
  detalle(id: any, lista: ListaM[]) {
    let detalle = lista.filter(item => item.nombre === id)
    localStorage.setItem('detalle', JSON.stringify(detalle))
    this.router.navigate(['/evento-suscripto', id]);
  }

  //elimina una lista de lo que está cargado, de todas las que tenes y actualiza el localstorage
  //recordad de cambiar el nombre por id cuando se complete el proyecto
  eliminar(idFav: any, lista: ListaM[]) {

    let listaActualizada = lista.filter(item => item.nombre !== idFav);
    // Convert ListaM objects to Evento objects before assigning
    this.listaAsistCarga = listaActualizada.slice(0, this.listaAsistCarga.length).map((item: any) =>
      new Evento(
        item.nombre,
        item.descripcion || '',
        item.organizadorNombre || '',
        item.organizadorApellido || '',
        item.fechaCreacion || '',
        item.codigoInvitacion || item.invitacion || '',
        item.creadorNombre || '',
        item.creadorApellido || ''
      )
    );
    this.listaAsist = listaActualizada;

    localStorage.setItem('listas', JSON.stringify(listaActualizada));
    // Permitir volver a suscribirse si se elimina de la lista suscripta
    this.yaSuscripto = false;
  }

  // Busca la materia por código de invitación en todas las materias guardadas
  async agregarListaPorCodigo() {

    const eventosRaw = JSON.parse(localStorage.getItem('eventos') || '[]');
    const eventoEncontrado = eventosRaw.find((e: any) => e.invitacion == this.codigoInvitacion);

    if (eventoEncontrado) {
      this.eventoBuscado = new Evento(
        eventoEncontrado.nombre,
        eventoEncontrado.creadorId,
        eventoEncontrado.descripcion,
        eventoEncontrado.organizadorNombre,
        eventoEncontrado.organizadorApellido,
        eventoEncontrado.puntuacion,
        eventoEncontrado.fechaCreacion,
        eventoEncontrado.invitacion
      );

      // Verificar si ya está suscripto (solo si sigue en la lista)
      this.yaSuscripto = this.listaAsistCarga.some(e => e.codigoInvitacion == eventoEncontrado.codigoInvitacion);
    } else {
      this.eventoBuscado = null;
      this.yaSuscripto = false;
    }
  }

  // Suscribirse a la materia encontrada
  /*suscribirseAEvento() {
    if (this.eventoBuscado && !this.yaSuscripto) {
      const invitacion = Number(this.eventoBuscado.codigoInvitacion) || Date.now();
      const listaSuscripta = new ListaM(
        this.eventoBuscado.nombre,
        invitacion
      );
      listaSuscripta.invitacion = invitacion;
      // Agregar descripción al objeto ListaM para mostrarla en la lista
      (listaSuscripta as any).descripcion = this.eventoBuscado.descripcion || '';
      // Guardar el nombre del creador del evento
      (listaSuscripta as any).creadorNombre = this.eventoBuscado.organizadorNombre || '';
      this.listaAsistCarga.push(listaSuscripta);
      localStorage.setItem('eventosSuscriptos', JSON.stringify(this.listaAsistCarga));
      this.yaSuscripto = true;
      // Asegura que al suscribirse también se guarde el eventoDetalle correctamente
      localStorage.setItem('eventoDetalle', JSON.stringify(this.eventoBuscado));
      this.eventoBuscado = null;
      this.codigoInvitacion = '';
    }
  }*/

  // Lógica para crear una clase nueva (puedes personalizar los datos)
  /*crearClaseNueva() {
    const nuevaClase = new ListaM('Clase nueva ' + (this.listaAsist.length + 1), Date.now());
    this.listaAsist.push(nuevaClase);
    this.listaAsistCarga.push(nuevaClase);
    localStorage.setItem('listas', JSON.stringify(this.listaAsist));
  }*/

  // Modal de eventos para crear
  abrirModal() {
    const usuarioLogueado = this.usuarioLogueado;
    this.eventoForm = {
      id: undefined,
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

  // Guarda una nueva materia creada por el usuario logueado
  // (Eliminada implementación duplicada de guardaEvento)

  detalleEvento(evento: Evento) {
    // Guarda la materia seleccionada en localStorage y navega a la página de detalle

    localStorage.setItem('eventoDetalle', JSON.stringify(evento));
    this.router.navigate(['menu/materia-detalle']);

  }

  /*cargarEventosUsuario() {
    this.apiEventos.verMisEventos().subscribe(
      (eventos: any) => {
        console.log('Eventos cargados:', eventos);
        this.eventos = eventos;
  
        // Guardar en localStorage como string
        localStorage.setItem('eventos', JSON.stringify(eventos));
  
        this.cargandoEventos = true;
      },
      (err: any) => {
        this.cargandoEventos = false;
        console.error('Error al cargar eventos del usuario', err);
      }
    );
  }*/
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
        this.eventos.forEach(e => {
          console.log("Evento: " + e.toString())
        });
        eventosConvertidos.forEach(e => {
          console.log("Evento convertido: " + e.toString())
        });

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


  /*async eliminarEvento(evento: Evento) {
    if (evento.id !== undefined) {
      this.apiEventos.borrarEvento(evento.id).subscribe({
        next: () => {
          this.eventos = this.eventos.filter(e => e.codigoInvitacion !== evento.codigoInvitacion);
          localStorage.setItem('eventos', JSON.stringify(this.eventos));

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
  }*/
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

}
