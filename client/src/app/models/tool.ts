import { Renderer2 } from '@angular/core';
import { DrawState } from '../state/draw-state';

export abstract class Tool {
    protected mouseUpListener: EventListener;
    protected mouseMoveListener: EventListener;

    svg: SVGGraphicsElement;
    state: DrawState = new DrawState();

    renderer: Renderer2;
    start(event: MouseEvent): void {
        /**/
    }
    continue(event: MouseEvent): void {
        /**/
    }
    stop(): void {
        /**/
    }
    stopSignal(): void {
        /**/
    } // for testing purpose
    handleKeyDown(key: string): void {
        /**/
    }
    handleKeyUp(key: string): void {
        /**/
    }

    copyState(svgs: SVGGraphicsElement[]): SVGGraphicsElement[] {
        const newSvgs = [];
        for (let svg of svgs) {
            const clone = svg.cloneNode(true) as SVGGraphicsElement;
            newSvgs.push(clone);
        }
        return newSvgs;
    }
}
