import { Directive, ElementRef, EventEmitter, HostListener, OnInit, Output } from '@angular/core';
import { DrawHandlerService } from '../services/draw-handler/draw-handler.service';
@Directive({
    selector: '[draw]',
})
export class DrawDirective implements OnInit {
    constructor(private el: ElementRef, private drawHandler: DrawHandlerService) {}

    @Output() drawSvgChange: EventEmitter<SVGSVGElement> = new EventEmitter();

    ngOnInit(): void {
        this.drawSvgChange.emit(this.el.nativeElement);
    }

    @HostListener('document:keydown', ['$event'])
    onKeyDown(event: KeyboardEvent): void {
        this.drawHandler.onKeyDown(event);
    }
    @HostListener('document:keyup', ['$event'])
    onKeyUp(event: KeyboardEvent): void {
        this.drawHandler.onKeyUp(event);
    }

    @HostListener('mousedown', ['$event'])
    onMouseDown(event: MouseEvent): void {
        this.drawHandler.startTool(event);
    }

    @HostListener('mouseleave')
    onMouseleave(): void {
        this.drawHandler.stopTool();
    }

    @HostListener('mousemove', ['$event'])
    onMouseMove(event: MouseEvent): void {
        this.drawHandler.onMouseMove(event);
    }
}
