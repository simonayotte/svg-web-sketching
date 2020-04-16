import { Component, HostListener } from '@angular/core';
import { MatDialog } from '@angular/material';
import { CreateDrawingComponent } from 'src/app/components/dialogs/create-drawing-dialog/create-drawing.component';
import { ContinueDrawingService } from 'src/app/services/continue-drawing/continue-drawing.service';
import { DrawStore } from 'src/app/store/draw-store';
import { DrawingGalleryComponent } from '../dialogs/drawing-gallery/drawing-gallery.component';

@Component({
    selector: 'app-home-page',
    templateUrl: './home-page.component.html',
    styleUrls: ['./home-page.component.scss'],
})
export class HomePageComponent {
    private isCreateDrawingOpen: boolean;
    private isGalleryOpen: boolean;
    localStorageLength: number;
    constructor(private dialog: MatDialog, public store: DrawStore, private continueDrawingService: ContinueDrawingService) {
        this.localStorageLength = localStorage.length;
        this.isCreateDrawingOpen = false;
        this.isGalleryOpen = false;
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
    openModal(event: KeyboardEvent): void {
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
