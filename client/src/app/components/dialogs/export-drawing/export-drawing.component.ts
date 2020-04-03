import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef } from '@angular/material';
import { DrawingHandler } from 'src/app/services/drawing-handler/drawing-handler.service';
import { ExportDrawingService } from 'src/app/services/export-drawing-service/export-drawing.service';
import { DrawState } from 'src/app/state/draw-state';
import { DrawStore } from 'src/app/store/draw-store';
import { PreviewExportComponent } from '../preview-export/preview-export.component';

const NAME_STRING = 'name';
const TYPE_STRING = 'type';
const FILTER_STRING = 'filter';

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

   get name() { return this.exportDrawingForm.get(NAME_STRING); }
   get type() { return this.exportDrawingForm.get(TYPE_STRING) ; }
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

  submit() {
    this.drawingHandler.prepareDrawingExportation(this.exportDrawingForm.controls[TYPE_STRING].value, this.exportDrawingForm.controls[FILTER_STRING].value);
    this.exportDrawingService.setExportName(this.exportDrawingForm.controls[NAME_STRING].value);
    this.exportDrawingService.setType(this.exportDrawingForm.controls[TYPE_STRING].value);
    this.dialogRef.close();
    this.dialog.open(PreviewExportComponent);
  }

}
