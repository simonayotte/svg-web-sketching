import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef } from '@angular/material';
import { FormValuesName, Tools } from 'src/app/models/enums';
import { DrawingHandler } from 'src/app/services/drawing-handler/drawing-handler.service';
import { ExportDrawingService } from 'src/app/services/export-drawing-service/export-drawing.service';
import { DrawState } from 'src/app/state/draw-state';
import { DrawStore } from 'src/app/store/draw-store';
import { PreviewExportComponent } from '../preview-export/preview-export.component';

@Component({
    selector: 'app-export-drawing',
    templateUrl: './export-drawing.component.html',
    styleUrls: ['./export-drawing.component.scss'],
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
    });
    this.exportDrawingForm = this.fb.group({
      name : ['', Validators.required],
      type : ['', Validators.required],
      option: ['', Validators.required],
      email: ['',[Validators.email]],
      filter: [''],
      
     });
  }

   get name(): AbstractControl | null { return this.exportDrawingForm.get(FormValuesName.Name); }
   get type(): AbstractControl | null { return this.exportDrawingForm.get(FormValuesName.Type) ; }
   get option() : AbstractControl | null { return this.exportDrawingForm.get(FormValuesName.Option) ; }
   get email(): AbstractControl | null { return this.exportDrawingForm.get(FormValuesName.Email) ; }

  state: DrawState;

    exportDrawingForm: FormGroup;
    ngOnInit(): void {
        this.store.setIsKeyHandlerActive(false);
        setTimeout(() => this.store.setTool(Tools.None));
    }

    ngOnDestroy(): void {
        this.store.setIsKeyHandlerActive(true);
    }

    submit(): void {
        this.drawingHandler.prepareDrawingExportation(
            this.exportDrawingForm.controls[FormValuesName.Type].value,
            this.exportDrawingForm.controls[FormValuesName.Filter].value,
        );
        this.exportDrawingService.setExportName(this.exportDrawingForm.controls[FormValuesName.Name].value);
        this.exportDrawingService.setType(this.exportDrawingForm.controls[FormValuesName.Type].value);
        this.exportDrawingService.setOption(this.exportDrawingForm.controls[FormValuesName.Option].value);
        this.exportDrawingService.setEmail(this.exportDrawingForm.controls[FormValuesName.Email].value);
        this.dialogRef.close();
        this.dialog.open(PreviewExportComponent);
    }
}
