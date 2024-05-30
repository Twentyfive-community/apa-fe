import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TrayCustomizedComponent } from './tray-customized.component';

describe('TrayCustomizedComponent', () => {
  let component: TrayCustomizedComponent;
  let fixture: ComponentFixture<TrayCustomizedComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TrayCustomizedComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(TrayCustomizedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
