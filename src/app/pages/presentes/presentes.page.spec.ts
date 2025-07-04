import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PresentesPage } from './presentes.page';

describe('PresentesPage', () => {
  let component: PresentesPage;
  let fixture: ComponentFixture<PresentesPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(PresentesPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
