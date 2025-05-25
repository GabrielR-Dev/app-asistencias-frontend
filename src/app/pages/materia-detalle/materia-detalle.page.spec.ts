import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MateriaDetallePage } from './materia-detalle.page';

describe('MateriaDetallePage', () => {
  let component: MateriaDetallePage;
  let fixture: ComponentFixture<MateriaDetallePage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(MateriaDetallePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
