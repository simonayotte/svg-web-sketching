import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material';
import { HttpResponseDialogComponent } from 'src/app/components/dialogs/http-response-dialog/http-response-dialog.component';
import { HttpResponse } from 'src/app/models/http-response';
import { SavedDrawing } from 'src/app/models/saved-drawing';
import { DrawingHandler } from 'src/app/services/drawing-handler/drawing-handler.service';
import { HttpResponseService } from 'src/app/services/http-response/http-response.service';
import { HttpService } from 'src/app/services/http-service/http.service';
import { SaveDrawingService } from 'src/app/services/save-drawing-service/save-drawing.service';
import { DrawState } from 'src/app/state/draw-state';
import { DrawStore } from 'src/app/store/draw-store';

@Component({
  selector: 'app-preview-image',
  templateUrl: './preview-image.component.html',
  styleUrls: ['./preview-image.component.scss']
})

export class PreviewImageComponent implements OnInit {
  dataURL: string;
  state: DrawState;
  buttonDisabled: boolean;
  previewHeight: number;
  previewWidth: number;
  svgsHTML: string[];
  constructor(
    private saveDrawingService: SaveDrawingService,
    private store: DrawStore,
    public dialogRef: MatDialogRef<PreviewImageComponent>,
    private drawingHandler: DrawingHandler,
    private httpService: HttpService,
    private dialog: MatDialog,
    private httpResponseService: HttpResponseService) {
    this.drawingHandler.dataURLObs.subscribe((dataURL: string) => (this.dataURL = dataURL));
    this.drawingHandler.previewWidthObs.subscribe((previewWidth: number) => (this.previewWidth = previewWidth));
    this.drawingHandler.previewHeightObs.subscribe((previewHeight: number) => (this.previewHeight = previewHeight));
    this.store.stateObs.subscribe((value: DrawState) => {
      this.state = value;
    });
    this.buttonDisabled = false;
    this.svgsHTML = [];
  }

  ngOnInit(): void {
    this.drawingHandler.setPreviewImgWidth();
    this.drawingHandler.setPreviewImgHeight();
    this.store.setIsKeyHandlerActive(false);
  }

  ngOnDestroy(): void {
    this.store.setIsKeyHandlerActive(true);
  }

  getSvgsHTML(): void {
    for (const svg of this.state.svgState.svgs) {
      this.svgsHTML.push(svg.outerHTML);
    }
  }

  async saveDrawing(): Promise<void> {
    this.getSvgsHTML();
    this.buttonDisabled = true;
    const canvasColor = this.state.colorState.canvasColor;
    const drawing = new SavedDrawing(this.saveDrawingService.getImgName(),
    this.saveDrawingService.getTags(),
    this.dataURL,
    this.svgsHTML,
    this.state.svgState.width,
    this.state.svgState.height,
    canvasColor.rgba());
    console.log(drawing);
    return this.httpService.saveDrawing(drawing)
    .toPromise()
    .then(
    (data: HttpResponse) => {
      this.httpResponseService.setMessage(data.message);
      this.dialog.open(HttpResponseDialogComponent);
      this.dialogRef.close();
      this.buttonDisabled = false;
    }).catch(
    (err: HttpResponse) => {
      this.httpResponseService.setMessage(err.message);
      this.dialog.open(HttpResponseDialogComponent);
      this.dialogRef.close();
      this.buttonDisabled = false;
    });
  }
}
