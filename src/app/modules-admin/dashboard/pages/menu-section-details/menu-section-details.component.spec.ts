import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MenuSectionDetailsComponent } from './menu-section-details.component';

describe('MenuSectionDetailsComponent', () => {
  let component: MenuSectionDetailsComponent;
  let fixture: ComponentFixture<MenuSectionDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [MenuSectionDetailsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(MenuSectionDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
