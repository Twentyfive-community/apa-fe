import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DashboardClient } from './dashboard-client';

describe('CatalogComponent', () => {
  let component: DashboardClient;
  let fixture: ComponentFixture<DashboardClient>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DashboardClient]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DashboardClient);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
