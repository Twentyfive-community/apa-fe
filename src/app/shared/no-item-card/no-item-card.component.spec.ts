import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NoItemCardComponent } from './no-item-card.component';

describe('NoItemCardComponent', () => {
  let component: NoItemCardComponent;
  let fixture: ComponentFixture<NoItemCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [NoItemCardComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(NoItemCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
