import { Component, EventEmitter, Input, Output } from '@angular/core';
import { BrushTextures } from 'src/app/models/enums';

/* tslint:disable:no-any */
@Component({
    selector: 'app-brush',
    templateUrl: './brush.component.html',
    styleUrls: ['./brush.component.scss'],
})
export class BrushComponent {
    @Input('texture') texture: BrushTextures;
    @Input('thickness') thickness: string;

    @Output() textureChange = new EventEmitter();
    @Output() thicknessChange = new EventEmitter();

    setThickness(event: any) {
        this.thicknessChange.emit(event.target.value);
    }

    setTexture(value: BrushTextures) {
        this.textureChange.emit(value);
    }
}
