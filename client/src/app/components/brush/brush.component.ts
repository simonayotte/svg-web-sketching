import { Component, OnInit, OnDestroy } from '@angular/core';
//import { DrawStateService } from 'src/app/services/draw-state/draw-state.service';

import { BrushService } from '../../services/brush/brush.service';
@Component({
    selector: 'app-brush',
    templateUrl: './brush.component.html',
    styleUrls: ['./brush.component.scss'],
})
export class BrushComponent implements OnInit, OnDestroy {
    constructor(private brushService: BrushService) {
        this.brushService.thicknessObs.subscribe(thickness => {
            this.thickness = thickness;
        });
    }

    private thickness: number;

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
}
