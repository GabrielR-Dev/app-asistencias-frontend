import { TestBed } from '@angular/core/testing';

import { ApiEventosService } from './api-eventos.service';

describe('ApiEventosService', () => {
  let service: ApiEventosService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ApiEventosService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
