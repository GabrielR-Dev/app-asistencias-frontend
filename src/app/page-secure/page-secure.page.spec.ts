import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PageSecurePage } from './page-secure.page';

describe('PageSecurePage', () => {
  let component: PageSecurePage;
  let fixture: ComponentFixture<PageSecurePage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(PageSecurePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
