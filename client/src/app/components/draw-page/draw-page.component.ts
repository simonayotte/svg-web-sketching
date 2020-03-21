import { Component, OnInit, HostListener } from '@angular/core';
@Component({
    selector: 'app-draw-page',
    templateUrl: './draw-page.component.html',
    styleUrls: ['./draw-page.component.scss'],
})
export class DrawPageComponent implements OnInit {
    //constructor(public store: DrawStore) {}
    constructor() {}

    svgElement: SVGElement;
    ngOnInit() {
        let rect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');

        rect.setAttribute('fill', 'blue');
        rect.setAttribute('width', '300');
        rect.setAttribute('height', '300');
        rect.setAttribute('id', '1');

        let element = document.querySelector('.svg-draw');
        if (element) {
            // element.appendChild(rect);
        }
    }

    @HostListener('mousemove', ['$event'])
    onMouseMove(event: MouseEvent) {
        if (this.svgElement) {
            this.translate(event.clientX, event.clientY);
        }
    }
    moveCircle($event: MouseEvent) {
        this.svgElement = $event.target as SVGElement;
    }

    translate(x: number, y: number) {
        this.svgElement.setAttribute('transform', `translate(${x} ${y})`);
    }
}
