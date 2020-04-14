import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material';
import { ExportedDrawing } from 'src/app/models/exported-drawing';
import { HttpResponse } from 'src/app/models/httpResponse';
import { DrawingHandler } from 'src/app/services/drawing-handler/drawing-handler.service';
import { ExportDrawingService } from 'src/app/services/export-drawing-service/export-drawing.service';
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
            .then((data: HttpResponse) => alert(data.message))
            .catch((err: HttpResponse) => alert(err));
    }
}
