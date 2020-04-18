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
            const rotation = this.getRotation(svg);
            clone.setAttribute(
                'transform',
                `translate(${offset + translation[0]},${offset + translation[1]}) rotate(${rotation[0]},${rotation[1]},${rotation[2]})`,
            );
            newSvgs.push(clone);
        }
        return newSvgs;
    }

    static getTranslation(svg: SVGGraphicsElement): number[] {
        const str = svg.getAttribute('transform');
        if (!str) {
            return [0, 0];
        }

        const matches = str.match(/-?\d+\.?\d*/g);

        if (!matches) {
            return [0, 0];
        }
        return [parseFloat(matches[0]), parseFloat(matches[1])]; // returns first 2 numbers of transform
    }
    // Returns current angle on selection box
    static getRotation(svg: SVGGraphicsElement): number[] {
        const str = svg.getAttribute('transform');
        if (!str) {
            return [0, 0, 0];
        }

        const matches = str.match(/-?\d+\.?\d*/g);

        if (!matches) {
            return [0, 0, 0];
        }
        // tslint:disable:no-magic-numbers
        return [parseFloat(matches[2]), parseFloat(matches[3]), parseFloat(matches[4])]; // returns last 3 numbers of transform
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
