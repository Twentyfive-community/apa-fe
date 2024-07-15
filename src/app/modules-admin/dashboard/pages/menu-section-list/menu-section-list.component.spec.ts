import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MenuSectionListComponent } from './menu-section-list.component';

describe('MenuSectionComponent', () => {
  let component: MenuSectionListComponent;
  let fixture: ComponentFixture<MenuSectionListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [MenuSectionListComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MenuSectionListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
