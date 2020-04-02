import { Renderer2 } from '@angular/core';
import { DrawState } from '../state/draw-state';

export abstract class Tool {
    start(event: MouseEvent) {}
    continue(event: MouseEvent) {}
    stop() {}
    stopSignal() {} //for testing purpose
    handleKeyDown(key: string) {}
    handleKeyUp(key: string) {}

    protected mouseUpListener: EventListener;
    protected mouseMoveListener: EventListener;

    svg: SVGGraphicsElement;
    state = new DrawState();

    renderer: Renderer2;

    copyState(svgs: SVGGraphicsElement[]): SVGGraphicsElement[] {
        let newSvgs = [];
        for (let i = 0; i < svgs.length; i++) {
            let svg = <SVGGraphicsElement>svgs[i].cloneNode(true);
            newSvgs.push(svg);
        }
        return newSvgs;
    }
}
