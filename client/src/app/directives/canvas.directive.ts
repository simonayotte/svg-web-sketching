import { Directive, ElementRef, HostListener, OnInit, Output, EventEmitter } from '@angular/core';
import { CanvasHandlerService } from '../services/canvas-handler/canvas-handler.service';
@Directive({
    selector: '[canvas]',
})
export class CanvasDirective implements OnInit {
    constructor(private el: ElementRef, private canvasHandler: CanvasHandlerService) {}

    @Output() canvasHTMLChange = new EventEmitter();
    @Output() toolChange = new EventEmitter<string>();

    ngOnInit() {
        this.canvasHTMLChange.emit(this.el.nativeElement);
    }

    @HostListener('document:keydown', ['$event'])
    onKeyDown(event: KeyboardEvent) {
        this.canvasHandler.onKeyDown(event);
    }
    @HostListener('document:keyup', ['$event'])
    onKeyUp(event: KeyboardEvent) {
        this.canvasHandler.onKeyUp(event);
    }
    @HostListener('mousedown', ['$event'])
    onMouseDown(event: MouseEvent) {
        this.canvasHandler.startTool(event);
    }

    @HostListener('mouseup')
    onMouseUp() {
        this.canvasHandler.stopTool();
    }

    @HostListener('dblclick', ['$event'])
    onDoubleClick(event: MouseEvent) {
        //this.canvasHandler.onDoubleClick(event);
    }

    @HostListener('mouseleave')
    onMouseleave() {
        this.canvasHandler.stopTool();
    }
}
