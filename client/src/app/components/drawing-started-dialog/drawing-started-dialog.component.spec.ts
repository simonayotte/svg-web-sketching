import { OverlayModule } from '@angular/cdk/overlay';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialog, MatDialogModule, MatDialogRef } from '@angular/material'
import { DrawingStartedDialogComponent } from './drawing-started-dialog.component';

describe('DrawingStartedDialogComponent', () => {
  let component: DrawingStartedDialogComponent;
  let fixture: ComponentFixture<DrawingStartedDialogComponent>;
  const dialogMock = {
    close: () => {/*empty function*/}
  };
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DrawingStartedDialogComponent ],
      providers: [
        {
          provide: MatDialogRef,
          useValue: {dialogMock}
        },
      MatDialog],
      imports: [OverlayModule, MatDialogModule]
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
