import { Component, HostListener, OnInit } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material';
import { Color } from 'src/app/models/color';
import { FormValuesName } from 'src/app/models/enums';
import { DrawingHandler } from 'src/app/services/drawing-handler/drawing-handler.service';
import { DrawState } from 'src/app/state/draw-state';
import { DrawStore } from 'src/app/store/draw-store';

const SIDEBAR_WIDTH = 52;
const MIN_WIDTH = 1;
const MAX_WIDTH = 5000;
const WHITE = 255;

@Component({
    selector: 'app-create-drawing',
    templateUrl: './create-drawing.component.html',
    styleUrls: ['./create-drawing.component.scss'],
})
export class CreateDrawingComponent implements OnInit {
    state: DrawState;
    isWidthModified: boolean;
    isHeightModified: boolean;
    isCreateDrawColorOpen: boolean;
    backgroundColor: Color;
    createDrawingForm: FormGroup; 
    constructor(
        private store: DrawStore, 
        public dialogRef: MatDialogRef<CreateDrawingComponent>, 
        private drawingHandler: DrawingHandler) 
        {
        this.store.stateObs.subscribe((value: DrawState) => {
            this.state = value;
        });
        this.isWidthModified = false;
        this.isHeightModified = false;
        this.isCreateDrawColorOpen = false;
        this.createDrawingForm = new FormGroup({
            width: new FormControl(FormValuesName.Width,
                [Validators.required,
                Validators.min(MIN_WIDTH),
                Validators.max(MAX_WIDTH),
                Validators.pattern('[^. | ^,]+')]),
            height: new FormControl(FormValuesName.Height,
                [Validators.required,
                Validators.min(MIN_WIDTH),
                Validators.max(MAX_WIDTH),
                Validators.pattern('[^. | ^,]+')]),
        });
    }
    get width(): AbstractControl | null {
        return this.createDrawingForm.get(FormValuesName.Width);
    }
    get height(): AbstractControl | null {
        return this.createDrawingForm.get(FormValuesName.Height);
    }

    ngOnInit(): void {
        this.createDrawingForm.patchValue({ width: window.innerWidth });
        this.createDrawingForm.patchValue({ height: window.innerHeight });
        this.isWidthModified = false;
        this.isHeightModified = false;
        this.backgroundColor = new Color(WHITE, WHITE, WHITE, WHITE);
        this.store.setIsKeyHandlerActive(false);
    }

    ngOnDestroy(): void {
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

    setCanvasColor(event: Color): void {
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
        if (this.state.svgState.svgs.length !== 0) {
            this.drawingHandler.clearCanvas();
        }
        this.store.setCanvasColor(this.backgroundColor);
        this.createDrawingForm.controls.width.value >= window.innerWidth ?
        this.store.setDrawWidth(this.createDrawingForm.controls.width.value - SIDEBAR_WIDTH) :
        this.store.setDrawWidth(this.createDrawingForm.controls.width.value);
        this.store.setDrawHeight(this.createDrawingForm.controls.height.value);
        this.dialogRef.close();
    }
}
