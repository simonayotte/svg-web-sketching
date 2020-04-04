import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AerosolComponent } from './aerosol.component';

describe('AerosolComponent', () => {
  let component: AerosolComponent;
  let fixture: ComponentFixture<AerosolComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AerosolComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AerosolComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
