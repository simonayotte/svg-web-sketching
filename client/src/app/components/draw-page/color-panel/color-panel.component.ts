import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Color } from 'src/app/models/color';
@Component({
    selector: 'app-color-panel',
    templateUrl: './color-panel.component.html',
    styleUrls: ['./color-panel.component.scss'],
})
export class ColorPanelComponent implements OnInit {
    constructor() {}

    @Input('firstColor') firstColor: Color;
    @Input('secondColor') secondColor: Color;
    @Input('canvasColor') canvasColor: Color;

    @Output() openColor = new EventEmitter();
    @Output() selectedColorChange = new EventEmitter();
    @Output() swapColor = new EventEmitter();

    openColorWindow(color: string) {
        this.openColor.emit();
        this.selectedColorChange.emit(color);
    }

    swap() {
        this.swapColor.emit();
    }

    ngOnInit() {}
}
