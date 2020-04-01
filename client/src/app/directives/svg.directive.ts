import { Directive, ElementRef, Input, OnDestroy, OnInit, Renderer2 } from '@angular/core';
@Directive({
    selector: '[svg]',
})
export class SvgDirective implements OnInit, OnDestroy {
    @Input('svg') svg: SVGGraphicsElement;
    @Input('drawSvg') drawSvg: SVGSVGElement;
    constructor(protected el: ElementRef, private renderer: Renderer2) {}

    ngOnInit() {
        this.renderer.appendChild(this.drawSvg, this.svg);
    }

    ngOnDestroy() {
        this.renderer.removeChild(this.drawSvg, this.svg);
    }

}
