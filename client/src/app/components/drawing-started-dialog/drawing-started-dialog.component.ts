import { Component, OnInit } from '@angular/core';
import { MatDialogRef, MatDialog } from '@angular/material';
import { CreateDrawingComponent } from '../create-drawing/create-drawing.component'

@Component({
  selector: 'app-drawing-started-dialog',
  templateUrl: './drawing-started-dialog.component.html',
  styleUrls: ['./drawing-started-dialog.component.scss']
})
export class DrawingStartedDialogComponent implements OnInit {
  constructor(private dialogRef:MatDialogRef<DrawingStartedDialogComponent>,private dialog:MatDialog) { }
  openCreateDrawing(): void {
    this.closeDialog();
    this.dialog.open(CreateDrawingComponent)
  }
  closeDialog(){
    this.dialogRef.close()
  }
  ngOnInit() {
  }

}
