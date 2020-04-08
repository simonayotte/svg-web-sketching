import { Component } from '@angular/core';
import { DrawStore } from 'src/app/store/draw-store';

@Component({
    selector: 'app-draw-page',
    templateUrl: './draw-page.component.html',
    styleUrls: ['./draw-page.component.scss'],
})
export class DrawPageComponent  {
    constructor(public store: DrawStore) {}
    

}
