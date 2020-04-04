import { Directive, ElementRef, EventEmitter, HostListener, Input, Output } from '@angular/core';
import { Color } from '../models/color';
/* tslint:disable:no-any */

@Directive({
    selector: '[canvas-grid]',
})
export class CanvasGridDirective {
    constructor(private el: ElementRef) {}

    canvas: HTMLCanvasElement;
    ctx: CanvasRenderingContext2D;
    @Input('gridSize') size: number;
    @Input('isKeyHandlerActive') isKeyHandlerActive: boolean;
    @Input('isDisplayGrid') isDisplay: boolean;
    @Input('gridColor') color: Color;

    @Output() toggleGrid: EventEmitter<void> = new EventEmitter();
    @Output() gridSizeChange: EventEmitter<number> = new EventEmitter();

    readonly MIN_SQUARE_SIZE: number = 30;
    readonly MAX_SQUARE_SIZE: number = 500;
    readonly GRID_SIZE_CHANGE: number = 5;
    ngOnInit(): void {
        this.canvas = this.el.nativeElement;
        this.ctx = this.canvas.getContext('2d') as CanvasRenderingContext2D;
    }

    ngOnChanges(changes: any): void {
        if (!this.ctx || changes.isKeyHandlerActive) {
            return;
        }

        if (changes.size || changes.color || changes.isDisplay) {
            this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

            if (this.isDisplay) {
                this.draw(this.size, this.canvas.width, this.canvas.height);
            }
        }
    }

    @HostListener('document:keydown', ['$event'])
    onKeyDown(event: KeyboardEvent): void {
        if (this.isKeyHandlerActive) {
            switch (event.key) {
                case 'g':
                    if (!event.ctrlKey) {
                        this.toggleGrid.emit();
                    }
                    break;
                case '+':
                    if (this.isDisplay) {
                        this.gridSizeChange.emit(this.setSize(this.size, this.GRID_SIZE_CHANGE));
                    }
                    break;
                case '-':
                    if (this.isDisplay) {
                        this.gridSizeChange.emit(this.setSize(this.size, -this.GRID_SIZE_CHANGE));
                    }
                    break;
            }
        }
    }

    draw(size: number, width: number, height: number): void {
        for (let x = size; x <= width; x += size) {
            for (let y = size; y <= height; y += size) {
                this.ctx.strokeStyle = this.color.hex();
                this.ctx.beginPath();

                this.ctx.moveTo(x, 0);
                this.ctx.lineTo(x, height);
                this.ctx.stroke();

                this.ctx.moveTo(0, y);
                this.ctx.lineTo(width, y);
                this.ctx.stroke();

                this.ctx.closePath();
            }
        }
    }

    setSize(size: number, value: number): number {
        if (size + value < this.MIN_SQUARE_SIZE) {
            return this.MIN_SQUARE_SIZE;
        }
        if (size + value > this.MAX_SQUARE_SIZE) {
            return this.MAX_SQUARE_SIZE;
        }

        return size + value;
    }
}
