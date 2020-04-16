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
        for (let svg of svgs) {
            const clone = svg.cloneNode(false) as SVGGraphicsElement;
            let translation = this.getTranslation(svg);
            let rotation = this.getRotation(svg);
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

        let matches = str.match(/-?\d+\.?\d*/g);

        if (!matches) {
            return [0, 0];
        }
        return [parseFloat(matches[0]), parseFloat(matches[1])];
    }
    // Returns current angle on selection box
    static getRotation(svg: SVGGraphicsElement): number[] {
        let str = svg.getAttribute('transform');
        if (!str) {
            return [0, 0, 0];
        }

        let matches = str.match(/-?\d+\.?\d*/g);

        if (!matches) {
            return [0, 0, 0];
        }
        return [parseFloat(matches[2]), parseFloat(matches[3]), parseFloat(matches[4])];
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
