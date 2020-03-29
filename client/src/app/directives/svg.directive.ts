import { Directive, ElementRef, OnInit, OnDestroy, Input, Renderer2 } from '@angular/core';
import { SvgHandlerService } from '../services/svg-handler/svg-handler.service';
import { Tools } from '../models/enums';
@Directive({
    selector: '[svg]',
})
export class SvgDirective implements OnInit, OnDestroy {
    @Input('svg') svg: SVGGraphicsElement;
    @Input('drawSvg') drawSvg: SVGSVGElement;
    @Input('tool') tool: Tools;
    constructor(protected el: ElementRef, private renderer: Renderer2, private svgHandler: SvgHandlerService) {}

    ngOnInit() {
        this.renderer.appendChild(this.drawSvg, this.svg);

        this.renderer.listen(this.svg, 'mouseover', () => {
            this.onMouseOver(this.svg);
        });
        this.renderer.listen(this.svg, 'mouseout', () => {
            this.onMouseOut(this.svg);
        });

        this.renderer.listen(this.svg, 'click', () => {
            this.onClick(this.svg);
        });
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
