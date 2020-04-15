import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material';
import { HttpResponseDialogComponent } from 'src/app/components/dialogs/http-response-dialog/http-response-dialog.component';
import { ExportedDrawing } from 'src/app/models/exported-drawing';
import { HttpResponse } from 'src/app/models/http-response';
import { DrawingHandler } from 'src/app/services/drawing-handler/drawing-handler.service';
import { ExportDrawingService } from 'src/app/services/export-drawing-service/export-drawing.service';
import { HttpResponseService } from 'src/app/services/http-response/http-response.service';
import { HttpService } from 'src/app/services/http-service/http.service';
import { DrawState } from 'src/app/state/draw-state';
import { DrawStore } from 'src/app/store/draw-store';

@Component({
    selector: 'app-preview-export',
    templateUrl: './preview-export.component.html',
    styleUrls: ['./preview-export.component.scss'],
})
export class PreviewExportComponent implements OnInit {
    dataURL: string;
    state: DrawState;
    previewHeight: number;
    previewWidth: number;
    constructor(
        private drawingHandler: DrawingHandler,
        private store: DrawStore,
        public dialogRef: MatDialogRef<PreviewExportComponent>,
        private exportDrawingService: ExportDrawingService,
        private httpService: HttpService,
        private httpResponseService: HttpResponseService,
        public dialog: MatDialog,
    ) {
        this.drawingHandler.dataURLObs.subscribe((dataURL: string) => (this.dataURL = dataURL));
        this.drawingHandler.previewWidthObs.subscribe((previewWidth: number) => (this.previewWidth = previewWidth));
        this.drawingHandler.previewHeightObs.subscribe((previewHeight: number) => (this.previewHeight = previewHeight));
        this.store.stateObs.subscribe((value: DrawState) => {
            this.state = value;
        });
    }
    ngOnInit(): void {
        this.drawingHandler.setPreviewImgWidth();
        this.drawingHandler.setPreviewImgHeight();
        this.store.setIsKeyHandlerActive(false);
    }

    ngOnDestroy(): void {
        this.store.setIsKeyHandlerActive(true);
    }

    async exportDrawing(): Promise<void> {
        const drawing = new ExportedDrawing(this.exportDrawingService.getExportName(), this.exportDrawingService.getType(), this.dataURL);
        this.dialogRef.close();
        return this.httpService
            .exportDrawing(drawing)
            .toPromise()
            .then((data: HttpResponse) => {
                this.httpResponseService.setMessage(data.message);
                this.dialog.open(HttpResponseDialogComponent);
            })
            .catch((err: HttpResponse) => {
                this.httpResponseService.setMessage(err.message);
                this.dialog.open(HttpResponseDialogComponent);
            });
    }
}
