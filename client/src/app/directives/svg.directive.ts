import { Directive, ElementRef, OnInit, OnDestroy, Input, Renderer2 } from '@angular/core';
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

    onMouseOver(svg: SVGGraphicsElement) {
        this.svgHandler.onMouseOver(svg);
    }


    onMouseOut(svg: SVGGraphicsElement) {
        this.svgHandler.onMouseOut(svg);
    }

    onClick(svg: SVGGraphicsElement) {
        this.svgHandler.onClick(svg);
    }

}
