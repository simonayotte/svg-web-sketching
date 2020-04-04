import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material';
import { SavedDrawing } from 'src/app/models/saved-drawing';
import { GalleryService } from 'src/app/services/gallery-service/gallery.service';
import { DrawStore } from 'src/app/store/draw-store';
import { CreateDrawingComponent } from '../create-drawing-dialog/create-drawing.component';

@Component({
    selector: 'app-drawing-started-dialog',
    templateUrl: './drawing-started-dialog.component.html',
    styleUrls: ['./drawing-started-dialog.component.scss'],
})
export class DrawingStartedDialogComponent implements OnInit {

    private didGalleryOpenDialog: boolean;
    drawingToLoad: SavedDrawing;
    constructor(public dialogRef: MatDialogRef<DrawingStartedDialogComponent>,
                public dialog: MatDialog, private store: DrawStore,
                private galleryService: GalleryService) {
        this.galleryService.drawingToLoadObs.subscribe((value: SavedDrawing) => {
            this.drawingToLoad = value;
        });
        this.galleryService.didGalleryOpenObs.subscribe((value: boolean) => {
            this.didGalleryOpenDialog = value;
        });
        this.didGalleryOpenDialog = false;
    }
    ngOnInit(): void {
        this.store.setIsKeyHandlerActive(false);
    }

    ngOnDestroy(): void {
        this.store.setIsKeyHandlerActive(true);
    }

    continue(): void {
        this.didGalleryOpenDialog ?
        this.galleryService.loadDrawing(this.drawingToLoad) :
        this.dialog.open(CreateDrawingComponent);
        this.dialogRef.close();
        this.galleryService.setDidGalleryOpen(false);
    }
}
