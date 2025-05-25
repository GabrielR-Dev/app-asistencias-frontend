// Archivo obsoleto tras migración a evento-suscripto.component.spec.ts
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { EventoSuscriptoComponent } from './materia-suscripta.component';


describe('EventoSuscriptoComponent', () => {
  let component: EventoSuscriptoComponent;
  let fixture: ComponentFixture<EventoSuscriptoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EventoSuscriptoComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EventoSuscriptoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});