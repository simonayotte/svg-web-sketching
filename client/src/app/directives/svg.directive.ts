import { Directive, ElementRef, Input, OnDestroy, OnInit, Renderer2, AfterViewInit } from '@angular/core';
@Directive({
    selector: '[svg]',
})
export class SvgDirective implements OnInit, OnDestroy, AfterViewInit {
    @Input('svg') svg: SVGGraphicsElement;
    @Input('drawSvg') drawSvg: SVGSVGElement;

    filterHTML: Element;
    constructor(protected el: ElementRef, private renderer: Renderer2) {}

    ngOnInit() {
        this.filterHTML = <Element>this.drawSvg.children.namedItem('filter');
    }

    ngAfterViewInit() {
        this.renderer.insertBefore(this.drawSvg, this.svg, this.filterHTML);
    }
    ngOnDestroy() {
        this.renderer.removeChild(this.drawSvg, this.svg);
    }
}
