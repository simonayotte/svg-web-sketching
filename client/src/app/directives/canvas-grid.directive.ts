import { Directive, ElementRef, HostListener, Input, Output, EventEmitter } from '@angular/core';

const MIN_SQUARE_SIZE = 30;

@Directive({
    selector: '[canvas-grid]',
})
export class CanvasGridDirective {
    constructor(private el: ElementRef) {}

    canvas: HTMLCanvasElement;
    ctx: CanvasRenderingContext2D;
    @Input('gridSize') size: number;
    @Input('isDisplayGrid') isDisplay: boolean;
    @Input('gridColor') color: string;

    @Output() toggleGrid = new EventEmitter();
    @Output() gridSizeChange = new EventEmitter();

    ngOnInit() {
        this.canvas = this.el.nativeElement;
        this.ctx = this.canvas.getContext('2d') as CanvasRenderingContext2D;
    }

    ngOnChanges(changes: any) {
        if (!this.ctx) {
            return;
        }

        if (changes.size) {
            this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
            this.draw(this.size, this.canvas.width, this.canvas.height);
        }

        if (changes.isDisplay) {
            if (this.isDisplay) {
                this.draw(this.size, this.canvas.width, this.canvas.height);
            } else {
                this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
            }
        }
    }

    @HostListener('document:keydown', ['$event'])
    onKeyDown(event: KeyboardEvent) {
        switch (event.key) {
            case 'g':
                this.toggleGrid.emit();
                break;
            case '+':
                if (this.isDisplay) {
                    this.gridSizeChange.emit(this.setSize(this.size, 5));
                }
                break;
            case '-':
                if (this.isDisplay) {
                    this.gridSizeChange.emit(this.setSize(this.size, -5));
                }
                break;
        }
    }

    draw(size: number, width: number, height: number) {
        this.ctx.lineWidth = 1;
        this.ctx.strokeStyle = this.color;
        this.ctx.beginPath();

        for (let x = size; x <= width; x += size) {
            for (let y = size; y <= height; y += size) {
                this.ctx.moveTo(x, 0);
                this.ctx.lineTo(x, height);
                this.ctx.stroke();
                this.ctx.moveTo(0, y);
                this.ctx.lineTo(width, y);
                this.ctx.stroke();
            }
        }
        this.ctx.closePath();
    }

    setSize(size: number, value: number): number {
        if (size + value < MIN_SQUARE_SIZE) {
            return MIN_SQUARE_SIZE;
        }
        if (size + value > this.canvas.width || size + value > this.canvas.height) {
            return size;
        }

        return size + value;
    }
}
