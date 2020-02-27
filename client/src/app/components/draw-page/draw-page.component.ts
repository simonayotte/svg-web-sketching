import { Component, OnInit } from '@angular/core';
import { DrawStore } from 'src/app/store/draw-store';
/*import { CreateDrawingComponent } from '../create-drawing/create-drawing.component';
import { DrawingStartedDialogComponent } from '../drawing-started-dialog/drawing-started-dialog.component';*/

@Component({
    selector: 'app-draw-page',
    templateUrl: './draw-page.component.html',
    styleUrls: ['./draw-page.component.scss'],
})
export class DrawPageComponent implements OnInit {
    constructor(public store: DrawStore) {}

    ngOnInit() {}

    /*openDialog(): void { hibenk bro
        const dialogRef = this.isDrawingStarted ? this.dialog.open(DrawingStartedDialogComponent) : this.dialog.open(CreateDrawingComponent);
        window.removeEventListener('keydown', this.keyDownListener);
        dialogRef.afterClosed().subscribe(result => {
            window.addEventListener('keydown', this.keyDownListener);
        });
    }*/
}
