import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { BrushTextures } from 'src/app/models/enums';

@Component({
    selector: 'app-brush',
    templateUrl: './brush.component.html',
    styleUrls: ['./brush.component.scss'],
})
export class BrushComponent implements OnInit {
    constructor() {}

    @Input('texture') texture: BrushTextures;
    @Input('thickness') thickness: string;

    @Output() textureChange = new EventEmitter();
    @Output() thicknessChange = new EventEmitter();
    ngOnInit() {}

    setThickness(event: any) {
        this.thicknessChange.emit(event.target.value);
    }

    setTexture(value: BrushTextures) {
        this.textureChange.emit(value);
    }
}
