import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MenuSectionEditComponent } from './menu-section-edit.component';

describe('MenuSectionEditComponent', () => {
  let component: MenuSectionEditComponent;
  let fixture: ComponentFixture<MenuSectionEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [MenuSectionEditComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(MenuSectionEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
