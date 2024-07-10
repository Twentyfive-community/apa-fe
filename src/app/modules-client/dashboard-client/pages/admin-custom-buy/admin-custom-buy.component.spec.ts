import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminCustomBuyComponent } from './admin-custom-buy.component';

describe('AdminCustomBuyComponent', () => {
  let component: AdminCustomBuyComponent;
  let fixture: ComponentFixture<AdminCustomBuyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AdminCustomBuyComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AdminCustomBuyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
