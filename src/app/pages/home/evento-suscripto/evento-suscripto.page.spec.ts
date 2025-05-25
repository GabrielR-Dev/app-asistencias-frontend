import { ComponentFixture, TestBed } from '@angular/core/testing';
import { EventoSuscriptoPage } from './evento-suscripto.page';

describe('EventoSuscriptoPage', () => {
  let component: EventoSuscriptoPage;
  let fixture: ComponentFixture<EventoSuscriptoPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(EventoSuscriptoPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
