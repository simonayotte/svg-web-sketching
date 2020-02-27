import { Component, OnInit, HostListener } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material';
import { DrawStore } from 'src/app/store/draw-store';
import { DrawState } from 'src/app/state/draw-state';
import { Color } from 'src/app/classes/color';

const SIDEBAR_WIDTH = 52;

@Component({
    selector: 'app-create-drawing',
    templateUrl: './create-drawing.component.html',
    styleUrls: ['./create-drawing.component.scss'],
})
export class CreateDrawingComponent implements OnInit {
    constructor(private store: DrawStore, public dialogRef: MatDialogRef<CreateDrawingComponent>) {
        this.store.stateObs.subscribe((value: DrawState) => {
            this.state = value;
        });
    }

    state: DrawState;
    ngOnInit() {
        this.drawingForm.patchValue({ width: window.innerWidth });
        this.drawingForm.patchValue({ height: window.innerHeight });
        this.isWidthModified = false;
        this.isHeightModified = false;
        this.canvasColor = new Color(255, 255, 255, 255);
    }
    isWidthModified = false;
    isHeightModified = false;
    isCreateDrawColorOpen = false;

    canvasColor: Color;

    drawingForm = new FormGroup({
        width: new FormControl('width', [Validators.required, Validators.min(0)]),
        height: new FormControl('height', [Validators.required, Validators.min(0)]),
    });
    get width() {
        return this.drawingForm.get('width');
    }
    get height() {
        return this.drawingForm.get('height');
    }

    submit(): void {
        this.dialogRef.close();
        this.state.canvasState.ctx.clearRect(0, 0, this.state.canvasState.width, this.state.canvasState.height);
        this.store.setCanvasColor(this.canvasColor);
        this.store.setCanvasWidth(this.drawingForm.controls['width'].value - SIDEBAR_WIDTH);
        this.store.setCanvasHeight(this.drawingForm.controls['height'].value);
    }

    @HostListener('window:resize')
    onResize(): void {
        if (!this.isWidthModified) {
            this.drawingForm.patchValue({ width: window.innerWidth });
        }
        if (!this.isHeightModified) {
            this.drawingForm.patchValue({ height: window.innerHeight });
        }
    }

    setCanvasColor(event: any) {
        this.canvasColor = event;
    }

    setIsWidthChangedToTrue(): void {
        this.isWidthModified = true;
    }

    setIsHeightChangedToTrue(): void {
        this.isHeightModified = true;
    }

    setIsCreateDrawColorOpen(value: boolean): void {
        this.isCreateDrawColorOpen = value;
    }
}
