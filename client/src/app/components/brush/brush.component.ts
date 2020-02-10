import { Component, OnInit, OnDestroy } from '@angular/core';
//import { DrawStateService } from 'src/app/services/draw-state/draw-state.service';

import { BrushService } from '../../services/brush/brush.service';
import { ColorService } from 'src/app/services/color/color.service';
@Component({
    selector: 'app-brush',
    templateUrl: './brush.component.html',
    styleUrls: ['./brush.component.scss'],
})
export class BrushComponent implements OnInit, OnDestroy {
    constructor(private brushService: BrushService, private colorService: ColorService) {
        this.brushService.thicknessObs.subscribe((thickness: number) => {
            this.thickness = thickness;
        });

        this.colorService.firstColorObs.subscribe(() => this.setTexture(this.texture)); //to load texture with different color
    }

    texture: string = 'normal';
    thickness: number;

    ngOnInit() {
        this.brushService.ngOnInit();
    }

    ngOnDestroy() {
        this.brushService.ngOnDestroy();
    }
    setThickness($event: Event) {
        if ($event.target) {
            this.brushService.setThickess(parseInt((<HTMLInputElement>$event.target).value));
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
