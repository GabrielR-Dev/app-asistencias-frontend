import { TestBed } from '@angular/core/testing';

import { CargarMasDatosService } from './cargar-mas-datos.service';

describe('CargarMasDatosService', () => {
  let service: CargarMasDatosService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CargarMasDatosService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
