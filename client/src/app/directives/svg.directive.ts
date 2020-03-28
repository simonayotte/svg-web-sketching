import { Directive, ElementRef, HostListener, OnInit, OnDestroy, Input, Renderer2 } from '@angular/core';
@Directive({
    selector: '[svg]',
})
export class SvgDirective implements OnInit, OnDestroy {
    @Input('svg') svg: SVGElement;
    @Input('drawSvg') drawSvg: SVGSVGElement;
    constructor(private el: ElementRef, private renderer: Renderer2) {
        console.log(this.el.nativeElement);
    }
    //With this directive, you already have events listeners that are going to call DrawHandler functions that will call selection services, deplacement, etc...
    ngOnInit() {
        this.renderer.appendChild(this.drawSvg, this.svg);
    }

    ngOnDestroy() {
        this.renderer.removeChild(this.drawSvg, this.svg);
    }

    @HostListener('mousedown', ['$event'])
    onMouseDown(event: MouseEvent) {
        console.log(event);
    }

    @HostListener('mousemove', ['$event'])
    onMouseMove(event: MouseEvent) {
        console.log(event);
    }
    @HostListener('mouseup')
    onMouseUp() {}
}
