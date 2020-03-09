import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material';
import { CreateDrawingComponent } from '../create-drawing-dialog/create-drawing.component';
import { DrawState } from 'src/app/state/draw-state';
import { DrawStore } from 'src/app/store/draw-store';

@Component({
    selector: 'app-drawing-started-dialog',
    templateUrl: './drawing-started-dialog.component.html',
    styleUrls: ['./drawing-started-dialog.component.scss'],
})
export class DrawingStartedDialogComponent implements OnInit {

    private state:DrawState;

    constructor(private dialogRef: MatDialogRef<DrawingStartedDialogComponent>, private dialog: MatDialog,private store:DrawStore) {
        this.store.stateObs.subscribe((value: DrawState) => {
            this.state = value;
        });
    }
    ngOnInit() {
        this.state.globalState.isKeyHandlerActive = false;
    }

    ngOnDestroy() {
        this.state.globalState.isKeyHandlerActive = true;
    }

    openCreateDrawing(): void {
        this.dialogRef.close();
        this.dialog.open(CreateDrawingComponent);
    }
}
