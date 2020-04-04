import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
    selector: 'app-grid-panel',
    templateUrl: './grid-panel.component.html',
    styleUrls: ['./grid-panel.component.scss'],
})
export class GridPanelComponent {
    constructor() {
        this.isSizeError = false;
        this.sizeErrorMsg = '';
    }
    @Input('gridOpacity') opacity: number;
    @Input('gridSize') size: number;
    @Output() gridOpacityChange: EventEmitter<number> = new EventEmitter();
    @Output() gridSizeChange: EventEmitter<number> = new EventEmitter();
    @Output() keyHandlerChange: EventEmitter<boolean> = new EventEmitter();
    isSizeError: boolean;
    sizeErrorMsg: string;
    readonly MIN_SQUARE_SIZE = 30;
    readonly MAX_SQUARE_SIZE = 500;

    setGridOpacity(event: any): void {
        this.gridOpacityChange.emit(event.target.value);
    }

    setKeyHandler(value: boolean): void {
        this.keyHandlerChange.emit(value);
    }

    confirmGridSize(): void {
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
