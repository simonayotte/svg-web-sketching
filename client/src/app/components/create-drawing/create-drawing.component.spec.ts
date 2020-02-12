import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateDrawingComponent } from './create-drawing.component';
import { DrawStateService } from 'src/app/services/draw-state/draw-state.service';
import { ColorService } from 'src/app/services/color/color.service';
import { MatDialogRef } from '@angular/material';

describe('CreateDrawingComponent', () => {
  let component: CreateDrawingComponent;
  let fixture: ComponentFixture<CreateDrawingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreateDrawingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateDrawingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  

});
