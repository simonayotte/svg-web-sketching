import { Component, OnInit, Input, ViewChild, TemplateRef } from '@angular/core';

@Component({
    selector: 'app-svg',
    templateUrl: './svg.component.html',
    styleUrls: ['./svg.component.scss'],
})
export class SvgComponent implements OnInit {
    @Input('svg') svg: SVGElement;
    @Input('drawSvg') drawSvg: SVGSVGElement;

    @ViewChild('ref', { static: true }) ref: TemplateRef<any>;

    constructor() {}

    ngOnInit() {
        this.ref.createEmbeddedView(this.svg);
        //this.ref.nativeElement.appendChild(this.svg);
    }
}
