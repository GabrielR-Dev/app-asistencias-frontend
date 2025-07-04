export class Evento {
  public id: number;
  public nombre: String;
  public descripcion: String;
  public organizadorNombre: String;
  public organizadorApellido: String;
  public fechaCreacion: String;
  public codigoInvitacion: String;
  public creadorNombre: String;
  public creadorApellido: String;

  constructor(
    id: number = 0 as any,
    nombre: String = '',
    descripcion: String = '',
    organizadorNombre: String = '',
    organizadorApellido: String = '',
    fechaCreacion: String = '',
    codigoInvitacion: String = '',
    creadorNombre: String = '',
    creadorApellido: String = ''
  ) {
    this.id = id;
    this.nombre = nombre;
    this.descripcion = descripcion;
    this.organizadorNombre = organizadorNombre;
    this.organizadorApellido = organizadorApellido;
    this.fechaCreacion = fechaCreacion;
    this.codigoInvitacion = codigoInvitacion;
    this.creadorNombre = creadorNombre;
    this.creadorApellido = creadorApellido;
  }

  toString(): string {
    return `Evento {
    id: ${this.id},
    nombre: ${this.nombre},
    descripcion: ${this.descripcion},
    organizadorNombre: ${this.organizadorNombre},
    organizadorApellido: ${this.organizadorApellido},
    fechaCreacion: ${this.fechaCreacion},
    codigoInvitacion: ${this.codigoInvitacion},
    creadorNombre: ${this.creadorNombre},
    creadorApellido: ${this.creadorApellido}
  }`;
  }
}
