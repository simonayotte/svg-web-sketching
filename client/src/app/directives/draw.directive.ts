import { Directive, ElementRef, EventEmitter, HostListener, OnInit, Output } from '@angular/core';
import { DrawHandlerService } from '../services/draw-handler/draw-handler.service';
import { ContinueDrawingService } from '../services/continue-drawing/continue-drawing.service';
@Directive({
    selector: '[draw]',
})
export class DrawDirective implements OnInit {
    private isContinueDrawing: boolean;
    constructor(private el: ElementRef, private drawHandler: DrawHandlerService, private continueDrawingService:ContinueDrawingService) {
        this.continueDrawingService.isContinueDrawingObs.subscribe((value:boolean)=>{
            this.isContinueDrawing = value;
        })
    }

    @Output() drawSvgChange = new EventEmitter();

    ngOnInit() {
        this.drawSvgChange.emit(this.el.nativeElement);
        if(this.isContinueDrawing){
            this.continueDrawingService.loadSavedDrawing()
        }
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

    @HostListener('mouseleave')
    onMouseleave() {
        this.drawHandler.stopTool();
    }

    @HostListener('mousemove', ['$event'])
    onMouseMove(event: MouseEvent) {
        this.drawHandler.onMouseMove(event);
    }
}
