import { Component, OnInit } from '@angular/core';
import { DrawingHandler } from 'src/app/services/drawing-handler/drawing-handler.service';
import { DrawStore } from 'src/app/store/draw-store';
import { DrawState } from 'src/app/state/draw-state';
import { MatDialogRef, MatDialog } from '@angular/material';
import { FormBuilder, Validators } from '@angular/forms';
import { PreviewExportComponent } from '../preview-export/preview-export.component';
import { ExportDrawingService } from 'src/app/services/export-drawing-service/export-drawing.service';

const NAME_STRING: string = 'name';
const TYPE_STRING: string = 'type';
const FILTER_STRING: string = 'filter';

@Component({
  selector: 'app-export-drawing',
  templateUrl: './export-drawing.component.html',
  styleUrls: ['./export-drawing.component.scss']
})
export class ExportDrawingComponent implements OnInit {
  state:DrawState;
  constructor(
     private drawingHandler:DrawingHandler,
     private store:DrawStore, 
     private dialogRef:MatDialogRef<ExportDrawingComponent>, 
     private fb:FormBuilder,
     private dialog: MatDialog,
     private exportDrawingService:ExportDrawingService) { 
    this.store.stateObs.subscribe((value: DrawState) => {
      this.state = value;
  })};
  ngOnInit() {
    this.state.globalState.isKeyHandlerActive = false;
  }

  ngOnDestroy() {
    this.state.globalState.isKeyHandlerActive = true;
  }

  exportDrawingForm = this.fb.group({
    name : ['', Validators.required],
    type : ['', Validators.required],
    filter: ['']
   })

   get name() { return this.exportDrawingForm.get(NAME_STRING); }
   get type() { return this.exportDrawingForm.get(TYPE_STRING) ;}
  
  submit() {
    this.drawingHandler.prepareDrawingExportation(this.exportDrawingForm.controls[TYPE_STRING].value,this.exportDrawingForm.controls[FILTER_STRING].value);
    this.exportDrawingService.setExportName(this.exportDrawingForm.controls[NAME_STRING].value);
    this.exportDrawingService.setType(this.exportDrawingForm.controls[TYPE_STRING].value);
    this.dialogRef.close();
    this.dialog.open(PreviewExportComponent)
  }
  


}
