import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OrderRedoComponent } from './order-redo.component';

describe('OrderRedoComponent', () => {
  let component: OrderRedoComponent;
  let fixture: ComponentFixture<OrderRedoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [OrderRedoComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(OrderRedoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
