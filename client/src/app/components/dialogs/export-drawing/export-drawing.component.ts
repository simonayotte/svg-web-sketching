import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef } from '@angular/material';
import { DrawingHandler } from 'src/app/services/drawing-handler/drawing-handler.service';
import { ExportDrawingService } from 'src/app/services/export-drawing-service/export-drawing.service';
import { DrawState } from 'src/app/state/draw-state';
import { DrawStore } from 'src/app/store/draw-store';
import { PreviewExportComponent } from '../preview-export/preview-export.component';
import { FormValuesName } from 'src/app/models/enums';

@Component({
  selector: 'app-export-drawing',
  templateUrl: './export-drawing.component.html',
  styleUrls: ['./export-drawing.component.scss']
})
export class ExportDrawingComponent implements OnInit {
  constructor(
     private drawingHandler: DrawingHandler,
     private store: DrawStore,
     public dialogRef: MatDialogRef<ExportDrawingComponent>,
     private fb: FormBuilder,
     public dialog: MatDialog,
     private exportDrawingService: ExportDrawingService) {
    this.store.stateObs.subscribe((value: DrawState) => {
      this.state = value;
  }); }

   get name() { return this.exportDrawingForm.get(FormValuesName.Name); }
   get type() { return this.exportDrawingForm.get(FormValuesName.Type) ; }
  state: DrawState;

  exportDrawingForm = this.fb.group({
    name : ['', Validators.required],
    type : ['', Validators.required],
    filter: ['']
   });
  ngOnInit() {
    this.store.setIsKeyHandlerActive(false);
  }

  ngOnDestroy() {
    this.store.setIsKeyHandlerActive(true);
  }

  submit(): void {
    this.drawingHandler.prepareDrawingExportation(this.exportDrawingForm.controls[FormValuesName.Type].value, this.exportDrawingForm.controls[FormValuesName.Filter].value);
    this.exportDrawingService.setExportName(this.exportDrawingForm.controls[FormValuesName.Name].value);
    this.exportDrawingService.setType(this.exportDrawingForm.controls[FormValuesName.Type].value);
    this.dialogRef.close();
    this.dialog.open(PreviewExportComponent);
  }

}
