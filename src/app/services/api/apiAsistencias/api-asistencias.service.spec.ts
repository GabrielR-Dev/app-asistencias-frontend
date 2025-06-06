import { TestBed } from '@angular/core/testing';

import { ApiAsistenciasService } from './api-asistencias.service';

describe('ApiAsistenciasService', () => {
  let service: ApiAsistenciasService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ApiAsistenciasService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
