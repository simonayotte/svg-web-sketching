import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material';
import { CreateDrawingComponent } from 'src/app/components/create-drawing/create-drawing.component'

@Component({
  selector: 'app-drawing-started-dialog',
  templateUrl: './drawing-started-dialog.component.html',
  styleUrls: ['./drawing-started-dialog.component.scss']
})
export class DrawingStartedDialogComponent implements OnInit {
  constructor(private dialogRef: MatDialogRef<DrawingStartedDialogComponent>, private dialog: MatDialog) {}
  openCreateDrawing(): void {
    this.closeDialog();
    this.dialog.open(CreateDrawingComponent)
  }
  closeDialog() {
    this.dialogRef.close()
  }
  ngOnInit() {/* Nothing in ngOnInit() */}
  }
}
