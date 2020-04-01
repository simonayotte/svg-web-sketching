import { Component, HostListener, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material';
import { Color } from 'src/app/models/color';
import { DrawingHandler } from 'src/app/services/drawing-handler/drawing-handler.service';
import { DrawState } from 'src/app/state/draw-state';
import { DrawStore } from 'src/app/store/draw-store';

const SIDEBAR_WIDTH = 52;

@Component({
    selector: 'app-create-drawing',
    templateUrl: './create-drawing.component.html',
    styleUrls: ['./create-drawing.component.scss'],
})
export class CreateDrawingComponent implements OnInit {
    constructor(private store: DrawStore, public dialogRef: MatDialogRef<CreateDrawingComponent>, private drawingHandler: DrawingHandler) {
        this.store.stateObs.subscribe((value: DrawState) => {
            this.state = value;
        });
    }
    get width() {
        return this.createDrawingForm.get('width');
    }
    get height() {
        return this.createDrawingForm.get('height');
    }

    state: DrawState;

    isWidthModified = false;
    isHeightModified = false;
    isCreateDrawColorOpen = false;

    backgroundColor: Color;

    createDrawingForm = new FormGroup({
        width: new FormControl('width', [Validators.required, Validators.min(1), Validators.max(5000), Validators.pattern('[^. | ^,]+')]),
        height: new FormControl('height', [Validators.required, Validators.min(1), Validators.max(5000), Validators.pattern('[^. | ^,]+')]),
    });
    ngOnInit() {
        this.createDrawingForm.patchValue({ width: window.innerWidth });
        this.createDrawingForm.patchValue({ height: window.innerHeight });
        this.isWidthModified = false;
        this.isHeightModified = false;
        this.backgroundColor = new Color(255, 255, 255, 255);
        this.store.setIsKeyHandlerActive(false);
    }

    ngOnDestroy() {
        this.store.setIsKeyHandlerActive(true);
    }

    @HostListener('window:resize')
    onResize(): void {
        if (!this.isWidthModified) {
            this.createDrawingForm.patchValue({ width: window.innerWidth });
        }
        if (!this.isHeightModified) {
            this.createDrawingForm.patchValue({ height: window.innerHeight });
        }
    }

    setCanvasColor(event: any) {
        this.backgroundColor = event;
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

    submit(): void {
        if (this.state.svgState.svgs.length != 0) {
            this.drawingHandler.clearCanvas();
            this.store.resetUndoRedo();
        }
        this.store.setCanvasColor(this.backgroundColor);
<<<<<<< HEAD
        this.createDrawingForm.controls.width.value >= window.innerWidth ?
        this.store.setDrawWidth(this.createDrawingForm.controls.width.value - SIDEBAR_WIDTH) :
        this.store.setDrawWidth(this.createDrawingForm.controls.width.value);
        this.store.setDrawHeight(this.createDrawingForm.controls.height.value);
=======
        this.createDrawingForm.controls['width'].value >= window.innerWidth
            ? this.store.setDrawWidth(this.createDrawingForm.controls['width'].value - SIDEBAR_WIDTH)
            : this.store.setDrawWidth(this.createDrawingForm.controls['width'].value);
        this.store.setDrawHeight(this.createDrawingForm.controls['height'].value);
>>>>>>> f9eeec2fd7e525fa37d46f7851b3afef831cef95
        this.dialogRef.close();
    }
}
