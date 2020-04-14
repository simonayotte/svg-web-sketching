import { Directive, ElementRef, EventEmitter, HostListener, OnInit, Output } from '@angular/core';
import { DrawHandlerService } from '../services/draw-handler/draw-handler.service';
@Directive({
    selector: '[draw]',
})
export class DrawDirective implements OnInit {
    constructor(private el: ElementRef, private drawHandler: DrawHandlerService) {}

    @Output() drawSvgChange = new EventEmitter();

    ngOnInit() {
        this.drawSvgChange.emit(this.el.nativeElement);
    }

    @HostListener('document:keydown', ['$event'])
    onKeyDown(event: KeyboardEvent) {
        this.drawHandler.onKeyDown(event);
    }
    @HostListener('document:keyup', ['$event'])
    onKeyUp(event: KeyboardEvent) {
        this.drawHandler.onKeyUp(event);
    }

    @HostListener('mousedown', ['$event'])
    onMouseDown(event: MouseEvent) {
        console.log(event.offsetX);
        console.log(event.offsetY);

        this.drawHandler.startTool(event);
    }

    @HostListener('mouseleave')
    onMouseleave() {
        this.drawHandler.stopTool();
    }

    @HostListener('mousemove', ['$event'])
    onMouseMove(event: MouseEvent) {
        this.drawHandler.onMouseMove(event);
    }
}
