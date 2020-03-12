import { Component, OnInit, HostListener } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material';
import { DrawStore } from 'src/app/store/draw-store';
import { DrawState } from 'src/app/state/draw-state';
import { Color } from 'src/app/models/color';

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
        this.createDrawingForm.patchValue({ width: window.innerWidth });
        this.createDrawingForm.patchValue({ height: window.innerHeight });
        this.isWidthModified = false;
        this.isHeightModified = false;
        this.canvasColor = new Color(255, 255, 255, 255);
        this.state.globalState.isKeyHandlerActive = false;
    }

    ngOnDestroy(){
        this.state.globalState.isKeyHandlerActive = true;
    }
    
    isWidthModified = false;
    isHeightModified = false;
    isCreateDrawColorOpen = false;

    canvasColor: Color;

    createDrawingForm = new FormGroup({
        width: new FormControl('width', [Validators.required, Validators.min(1), Validators.max(5000), Validators.pattern('[^. | ^,]+')]),
        height: new FormControl('height', [Validators.required, Validators.min(1), Validators.max(5000), Validators.pattern('[^. | ^,]+')]),
      })
    get width() {
        return this.createDrawingForm.get('width');
    }
    get height() {
        return this.createDrawingForm.get('height');
    }

    submit(): void {
        this.dialogRef.close();
        if(this.state.canvasState.shapes.length != 0){
            this.state.canvasState.ctx.clearRect(0, 0, this.state.canvasState.width, this.state.canvasState.height);
            this.state.canvasState.shapes = [];
        }
        this.store.setCanvasColor(this.canvasColor);
        this.createDrawingForm.controls['width'].value >= window.innerWidth?
        this.store.setCanvasWidth(this.createDrawingForm.controls['width'].value - SIDEBAR_WIDTH): 
        this.store.setCanvasWidth(this.createDrawingForm.controls['width'].value);
        this.store.setCanvasHeight(this.createDrawingForm.controls['height'].value);
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
