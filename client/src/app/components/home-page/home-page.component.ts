import { Component, HostListener, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material';
import { CreateDrawingComponent } from 'src/app/components/dialogs/create-drawing-dialog/create-drawing.component';
import { DrawingGalleryComponent } from '../dialogs/drawing-gallery/drawing-gallery.component';
import { DrawStore } from 'src/app/store/draw-store';
import { ContinueDrawingService } from 'src/app/services/continue-drawing/continue-drawing.service';


@Component({
    selector: 'app-home-page',
    templateUrl: './home-page.component.html',
    styleUrls: ['./home-page.component.scss'],
})
export class HomePageComponent implements OnInit {
    private isCreateDrawingOpen = false;
    private isGalleryOpen = false;
    localStorageLength: number
    constructor(private dialog: MatDialog, public store: DrawStore, private continueDrawingService: ContinueDrawingService) {
        this.localStorageLength = localStorage.length;
    }
    ngOnInit() {
        /* Nothing needed in ngOnInit() */
    }
    openCreateDrawingDialog(): void {
        const dialogRef = this.dialog.open(CreateDrawingComponent);
        this.isCreateDrawingOpen = true;

        dialogRef.afterClosed().subscribe((result) => {
            this.isCreateDrawingOpen = false;
        });
    }

    openGalleryDialog(): void {
        const dialogRef = this.dialog.open(DrawingGalleryComponent);
        this.isGalleryOpen = true;

        dialogRef.afterClosed().subscribe((result) => {
            this.isGalleryOpen = false;
        });
    }

    @HostListener('document:keydown', ['$event'])
    openModal(event: KeyboardEvent) {
        if (event.code === 'KeyO' && event.ctrlKey) {
            event.preventDefault();
            event.stopPropagation();
            if (!this.isCreateDrawingOpen) {
                this.openCreateDrawingDialog();
            }
        } else if (event.code === 'KeyG' && event.ctrlKey) {
            event.preventDefault();
            event.stopPropagation();
            if (!this.isGalleryOpen) {
                this.openGalleryDialog();
            }
        }
    }

    continueDrawing(): void {
       this.continueDrawingService.setIsContinueDrawing(true);
    }
}
