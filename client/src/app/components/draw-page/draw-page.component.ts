import { Component, OnDestroy } from '@angular/core';
import { DrawStore } from 'src/app/store/draw-store';

@Component({
    selector: 'app-draw-page',
    templateUrl: './draw-page.component.html',
    styleUrls: ['./draw-page.component.scss'],
})
export class DrawPageComponent implements OnDestroy  {
    constructor(public store: DrawStore) {}

    ngOnDestroy(){
        this.store.emptySvg(false);
    }
    

}
