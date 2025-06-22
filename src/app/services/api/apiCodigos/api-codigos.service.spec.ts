import { TestBed } from '@angular/core/testing';

import { ApiCodigosService } from './api-codigos.service';

describe('ApiCodigosService', () => {
  let service: ApiCodigosService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ApiCodigosService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
