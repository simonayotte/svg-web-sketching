import { AfterViewInit, Directive, ElementRef, Input, OnDestroy, OnInit, Renderer2 } from '@angular/core';
@Directive({
    selector: '[svg]',
})
export class SvgDirective implements OnInit, OnDestroy, AfterViewInit {
    @Input('svg') svg: SVGGraphicsElement;
    @Input('drawSvg') drawSvg: SVGSVGElement;

    filterHTML: Element;
    constructor(protected el: ElementRef, private renderer: Renderer2) {}

    ngOnInit(): void {
        this.filterHTML = this.drawSvg.children.namedItem('filter') as Element;
    }

    ngAfterViewInit(): void {
        this.renderer.insertBefore(this.drawSvg, this.svg, this.filterHTML);
    }
    ngOnDestroy(): void {
        this.renderer.removeChild(this.drawSvg, this.svg);
    }
}
