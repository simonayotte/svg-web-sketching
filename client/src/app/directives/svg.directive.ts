import { Directive, ElementRef, OnInit, OnDestroy, Input, Renderer2 } from '@angular/core';
import { Tools } from '../models/enums';
@Directive({
    selector: '[svg]',
})
export class SvgDirective implements OnInit, OnDestroy {
    @Input('svg') svg: SVGGraphicsElement;
    @Input('drawSvg') drawSvg: SVGSVGElement;
    @Input('tool') tool: Tools;
    constructor(protected el: ElementRef, private renderer: Renderer2) {}

    ngOnInit() {
        this.renderer.appendChild(this.drawSvg, this.svg);
    }

    ngOnDestroy() {
        this.renderer.removeChild(this.drawSvg, this.svg);
    }
}
