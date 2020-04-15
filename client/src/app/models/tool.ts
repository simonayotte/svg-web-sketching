import { Renderer2 } from '@angular/core';
import { DrawState } from '../state/draw-state';

export abstract class Tool {
    protected mouseUpListener: EventListener;
    protected mouseMoveListener: EventListener;

    svg: SVGGraphicsElement;
    state: DrawState = new DrawState();

    renderer: Renderer2;

    static cloneSvgs(svgs: SVGGraphicsElement[], offset: number = 0): SVGGraphicsElement[] {
        const newSvgs = [];
        for (const svg of svgs) {
            const clone = svg.cloneNode(false) as SVGGraphicsElement;
            const translation = this.getTranslation(svg);
            clone.setAttribute('transform', `translate(${offset + translation[0]},${offset + translation[1]})`);
            newSvgs.push(clone);
        }
        return newSvgs;
    }

    static getTranslation(svg: SVGGraphicsElement): number[] {
        const str = svg.getAttribute('transform');
        if (!str) {
            return [0, 0];
        }

        const matches = str.match(/(?!translate)[+-]?\d+/g);

        if (!matches) {
            return [0, 0];
        }
        return [parseInt(matches[0], 10), parseInt(matches[1], 10)];
    }
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
}
