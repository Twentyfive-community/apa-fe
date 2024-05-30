import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomCakeComponent } from './custom-cake.component';

describe('CustomCakeComponent', () => {
  let component: CustomCakeComponent;
  let fixture: ComponentFixture<CustomCakeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CustomCakeComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CustomCakeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
