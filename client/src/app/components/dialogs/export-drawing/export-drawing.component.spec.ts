import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OverlayModule } from '@angular/cdk/overlay';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatDialog, MatDialogModule, MatDialogRef } from '@angular/material';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { DrawingHandler } from 'src/app/services/drawing-handler/drawing-handler.service';
import { ExportDrawingService } from 'src/app/services/export-drawing-service/export-drawing.service';
import { DrawStore } from 'src/app/store/draw-store';
import { PreviewExportComponent } from '../preview-export/preview-export.component';
import { ExportDrawingComponent } from './export-drawing.component';
import { FormValuesName, Tools } from 'src/app/models/enums';

describe('ExportDrawingComponent', () => {
  let component: ExportDrawingComponent;
  let fixture: ComponentFixture<ExportDrawingComponent>;
  let store: DrawStore;
  let drawingHandler: DrawingHandler;
  let exportDrawingService: ExportDrawingService;
  const dialogMock = {
    close: () => {
        /*empty function*/
    },
    open: () => {
    },
  };

  beforeEach(async(() => {
    TestBed.configureTestingModule({
        declarations: [ExportDrawingComponent],
        imports: [FormsModule, ReactiveFormsModule, HttpClientTestingModule, OverlayModule, MatDialogModule, BrowserModule, BrowserAnimationsModule],
        providers: [
            {provide: MatDialogRef, useValue:  dialogMock },
            {provide: MatDialog, useValue: dialogMock},
            ExportDrawingService,
            DrawStore,
            DrawingHandler
        ],
    }).compileComponents();
    store = TestBed.get(DrawStore);
    store.setDrawSvg(document.createElementNS('http://www.w3.org/2000/svg', 'svg'));
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ExportDrawingComponent);
    component = fixture.componentInstance;
    drawingHandler = TestBed.get(DrawingHandler);
    exportDrawingService = TestBed.get(ExportDrawingService);
    fixture.detectChanges();
    // clear the tags array before each test
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('#submit should call #prepareDrawingExportation() of drawingHandler', () => {
    spyOn(drawingHandler, 'prepareDrawingExportation').and.callThrough();
    component.submit();
    expect(drawingHandler.prepareDrawingExportation).toHaveBeenCalledWith(component.exportDrawingForm.controls[FormValuesName.Type].value, component.exportDrawingForm.controls[FormValuesName.Filter].value);
  });

  it('#submit should call #setExportName() of exportDrawingService', () => {
    spyOn(exportDrawingService, 'setExportName').and.callThrough();
    component.submit();
    expect(exportDrawingService.setExportName).toHaveBeenCalledWith(component.exportDrawingForm.controls[FormValuesName.Name].value);
  });

  it('#submit should call #setType() of exportDrawingService', () => {
    spyOn(exportDrawingService, 'setType').and.callThrough();
    component.submit();
    expect(exportDrawingService.setType).toHaveBeenCalledWith(component.exportDrawingForm.controls[FormValuesName.Type].value);
  });

  it('#submit should close the dialog', () => {
    spyOn(component.dialogRef, 'close').and.callThrough();
    component.submit();
    expect(component.dialogRef.close).toHaveBeenCalled();
  });

  it('#submit should open the previewExportImage dialog', () => {
    spyOn(component.dialog, 'open').and.callThrough();
    component.submit();
    expect(component.dialog.open).toHaveBeenCalledWith(PreviewExportComponent);
  });

  it('#submit should call the #setTool() of the store', () => {
    spyOn(store, 'setTool').and.callThrough();
    component.submit();
    expect(store.setTool).toHaveBeenCalledWith(Tools.None);
  });


});
