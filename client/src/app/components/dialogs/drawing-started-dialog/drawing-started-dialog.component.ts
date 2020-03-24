import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material';
import { CreateDrawingComponent } from '../create-drawing-dialog/create-drawing.component';
import { DrawState } from 'src/app/state/draw-state';
import { DrawStore } from 'src/app/store/draw-store';
import { GalleryService } from 'src/app/services/gallery-service/gallery.service';
import { SavedDrawing } from 'src/app/models/saved-drawing';

@Component({
    selector: 'app-drawing-started-dialog',
    templateUrl: './drawing-started-dialog.component.html',
    styleUrls: ['./drawing-started-dialog.component.scss'],
})
export class DrawingStartedDialogComponent implements OnInit {

    private state:DrawState;
    private didGalleryOpenDialog: boolean = false;
    private drawingToLoad:SavedDrawing;
    constructor(private dialogRef: MatDialogRef<DrawingStartedDialogComponent>, private dialog: MatDialog,private store:DrawStore, private galleryService:GalleryService) {
        this.store.stateObs.subscribe((value: DrawState) => {
            this.state = value;
        });
        this.galleryService.drawingToLoadObs.subscribe((value: SavedDrawing) => {
            this.drawingToLoad = value;
        });
        this.galleryService.didGalleryOpenObs.subscribe((value: boolean) => {
            this.didGalleryOpenDialog = value;
        })
    }
    ngOnInit() {
        this.state.globalState.isKeyHandlerActive = false;
    }

    ngOnDestroy() {
        this.state.globalState.isKeyHandlerActive = true;
    }

    continue(): void {
        console.log(this.didGalleryOpenDialog)
        this.didGalleryOpenDialog?  this.galleryService.loadDrawing(this.drawingToLoad) : this.dialog.open(CreateDrawingComponent);
        this.dialogRef.close();
        this.galleryService.setDidGalleryOpen(false);
    }
}
