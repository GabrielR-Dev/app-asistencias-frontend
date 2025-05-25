import { ComponentFixture, TestBed } from '@angular/core/testing';
import { EventoDetallePage } from './evento-detalle.page';

describe('MateriaDetallePage', () => {
  let component: EventoDetallePage;
  let fixture: ComponentFixture<EventoDetallePage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(EventoDetallePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
