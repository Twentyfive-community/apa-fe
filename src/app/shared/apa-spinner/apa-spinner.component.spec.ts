import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ApaSpinnerComponent } from './apa-spinner.component';

describe('ApaSpinnerComponent', () => {
  let component: ApaSpinnerComponent;
  let fixture: ComponentFixture<ApaSpinnerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ApaSpinnerComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ApaSpinnerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
