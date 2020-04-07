import { Renderer2 } from '@angular/core';
import { DrawState } from '../state/draw-state';

export abstract class Tool {
    protected mouseUpListener: EventListener;
    protected mouseMoveListener: EventListener;

    svg: SVGGraphicsElement;
    state: DrawState = new DrawState();

    renderer: Renderer2;
    start(event: MouseEvent): void {
        return;
    }
    continue(event: MouseEvent): void {
        return;
    }
    stop(): void {
        return;
    }
    stopSignal(): void {
        return;
    } // for testing purpose
    handleKeyDown(key: string): void {
        return;
    }
    handleKeyUp(key: string): void {
        return;
    }

    cloneSvgs(svgs: SVGGraphicsElement[]): SVGGraphicsElement[] {
        const newSvgs = [];
        for (let svg of svgs) {
            const clone = svg.cloneNode(false) as SVGGraphicsElement;
            newSvgs.push(clone);
        }
        return newSvgs;
    }
}
