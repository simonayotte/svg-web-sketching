import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DrawingStartedDialogComponent } from './drawing-started-dialog.component';

describe('DrawingStartedDialogComponent', () => {
  let component: DrawingStartedDialogComponent;
  let fixture: ComponentFixture<DrawingStartedDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DrawingStartedDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DrawingStartedDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
