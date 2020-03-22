import { Component, OnInit, Output, Input, EventEmitter } from '@angular/core';

@Component({
    selector: 'app-grid-panel',
    templateUrl: './grid-panel.component.html',
    styleUrls: ['./grid-panel.component.scss'],
})
export class GridPanelComponent implements OnInit {
    constructor() {}
    @Input('gridOpacity') opacity: number;
    @Input('gridSize') size: number;
    @Output() gridOpacityChange = new EventEmitter();
    @Output() gridSizeChange = new EventEmitter();
    @Output() keyHandlerChange = new EventEmitter();
    isSizeError: boolean = false;
    sizeErrorMsg: string;
    readonly MIN_SQUARE_SIZE = 30;
    readonly MAX_SQUARE_SIZE = 500;
    ngOnInit() {}

    setGridOpacity(event: any) {
        this.gridOpacityChange.emit(event.target.value);
    }

    setKeyHandler(value: boolean) {
        this.keyHandlerChange.emit(value);
    }

    confirmGridSize() {
        if (this.size < this.MIN_SQUARE_SIZE) {
            this.isSizeError = true;
            this.sizeErrorMsg = 'Taille est plus petite que 30';
            return;
        } else if (this.size > this.MAX_SQUARE_SIZE) {
            this.isSizeError = true;
            this.sizeErrorMsg = 'Taille est plus grande que 500';
            return;
        } else {
            this.isSizeError = false;
            this.gridSizeChange.emit(this.size);
        }
    }
}
