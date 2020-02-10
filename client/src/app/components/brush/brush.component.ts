import { Component, OnInit, ElementRef, OnDestroy } from '@angular/core';
//import { DrawStateService } from 'src/app/services/draw-state/draw-state.service';

import { BrushService } from '../../services/brush/brush.service';
import { ColorService } from 'src/app/services/color/color.service';
import { DrawStateService } from 'src/app/services/draw-state/draw-state.service';
@Component({
    selector: 'app-brush',
    templateUrl: './brush.component.html',
    styleUrls: ['./brush.component.scss'],
})
export class BrushComponent implements OnInit, OnDestroy {
    constructor(private drawStateService: DrawStateService, private brushService: BrushService, private colorService: ColorService) {
        this.brushService.thicknessObs.subscribe((thickness: number) => {
            this.thickness = thickness;
        });
        this.colorService.firstColorObs.subscribe(() => this.setTexture(this.texture)); //to load texture with different color

        this.drawStateService.canvasRefObs.subscribe((canvasRef: ElementRef) => (this.canvasRef = canvasRef));
        this.mouseDownListener = this.brushService.startDraw.bind(this.brushService);
    }

    public texture: string = 'normal';
    public thickness: number;

    private canvasRef: ElementRef;
    private mouseDownListener: EventListener;

    ngOnInit() {
        this.canvasRef.nativeElement.addEventListener('mousedown', this.mouseDownListener);
    }

    ngOnDestroy() {
        this.canvasRef.nativeElement.removeEventListener('mousedown', this.mouseDownListener);
    }

    setThickness(event: Event) {
        if (event.target) {
            this.brushService.setThickess(parseInt((<HTMLInputElement>event.target).value));
        }
    }

    setTexture(texture: string) {
        if (
            texture === 'normal' ||
            texture === 'circle' ||
            texture === 'brick' ||
            texture === 'zigzag' ||
            texture === 'square' ||
            texture === 'wave'
        ) {
            this.brushService.setTexture(texture);
            this.texture = texture;
        }
    }
}
