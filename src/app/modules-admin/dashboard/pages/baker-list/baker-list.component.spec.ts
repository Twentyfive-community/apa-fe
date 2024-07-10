import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BakerListComponent } from './baker-list.component';

describe('BakerListComponent', () => {
  let component: BakerListComponent;
  let fixture: ComponentFixture<BakerListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [BakerListComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(BakerListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
