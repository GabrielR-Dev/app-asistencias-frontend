import { ComponentFixture, TestBed } from '@angular/core/testing';
import { EventoSuscriptoComponent } from './evento-suscripto.component';

describe('EventoSuscriptoComponent', () => {
  let component: EventoSuscriptoComponent;
  let fixture: ComponentFixture<EventoSuscriptoComponent>;

  beforeEach(() => {
    fixture = TestBed.createComponent(EventoSuscriptoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
