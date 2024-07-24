import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserCartCheckoutComponent } from './user-cart-checkout.component';

describe('UserCartCheckoutComponent', () => {
  let component: UserCartCheckoutComponent;
  let fixture: ComponentFixture<UserCartCheckoutComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [UserCartCheckoutComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(UserCartCheckoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
