import { Directive, ElementRef, HostListener, OnInit, Input } from '@angular/core';
@Directive({
    selector: '[svg]',
})
export class SvgDirective implements OnInit {
    @Input('svg') svg: SVGElement;
    @Input('drawSvg') drawSvg: SVGSVGElement;
    constructor(private el: ElementRef) {
    }
    //With this directive, you already have events listeners that are going to call DrawHandler functions that will call selection services, deplacement, etc...
    ngOnInit() {
        this.drawSvg.appendChild(this.svg);
    }

    @HostListener('mousedown', ['$event'])
    onMouseDown(event: MouseEvent) {
    }

    @HostListener('mousemove', ['$event'])
    onMouseMove(event: MouseEvent) {
    }
    @HostListener('mouseup')
    onMouseUp() {}
}
