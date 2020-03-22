import { Directive, ElementRef, HostListener, OnInit, EventEmitter, Output } from '@angular/core';
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
        this.drawHandler.startTool(event);
    }

    @HostListener('mousemove', ['$event'])
    mousemove(event: MouseEvent) {
        this.drawHandler.continueTool(event);
    }

    @HostListener('mouseup')
    onMouseUp() {
        this.drawHandler.stopTool();
    }

    @HostListener('mouseleave')
    onMouseleave() {
        this.drawHandler.stopTool();
    }
}
