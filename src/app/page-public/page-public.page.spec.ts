import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PagePublicPage } from './page-public.page';

describe('PagePublicPage', () => {
  let component: PagePublicPage;
  let fixture: ComponentFixture<PagePublicPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(PagePublicPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
