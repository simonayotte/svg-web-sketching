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

    static cloneSvgs(svgs: SVGGraphicsElement[], offset: number = 0): SVGGraphicsElement[] {
        const newSvgs = [];
        for (let i = 0; i < svgs.length; i++) {
            const clone = svgs[i].cloneNode(false) as SVGGraphicsElement;
            let translation = this.getTranslation(svgs[i]);
            clone.setAttribute('transform', `translate(${offset + translation[0]},${offset + translation[1]})`);
            newSvgs.push(clone);
        }
        return newSvgs;
    }

    static getTranslation(svg: SVGGraphicsElement): [number, number] {
        let str = svg.getAttribute('transform');
        if (!str) {
            return [0, 0];
        }

        let matches = str.match(/[+-]?\d+/g);

        if (!matches) {
            return [0, 0];
        }
        return <[number, number]>matches.map(Number);
    }
}
