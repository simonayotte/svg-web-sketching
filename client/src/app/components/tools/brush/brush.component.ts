import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
    selector: 'app-brush',
    templateUrl: './brush.component.html',
    styleUrls: ['./brush.component.scss'],
})
export class BrushComponent implements OnInit {
    constructor() {}

    @Input('texture') texture: string;
    @Input('thickness') thickness: string;

    @Output() textureChange = new EventEmitter();
    @Output() thicknessChange = new EventEmitter();
    ngOnInit() {}

    setThickness(event: any) {
        this.thicknessChange.emit(event.target.value);
    }

    setTexture(value: string) {
        if (value === 'normal' || value === 'line' || value === 'circle' || value === 'zigzag-h' || value === 'zigzag-v' || value === 'square') {
            console.log(value);
            this.textureChange.emit(value);
        }
    }
}
