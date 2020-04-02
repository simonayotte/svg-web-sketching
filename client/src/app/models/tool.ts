export abstract class Tool {

    protected mouseUpListener: EventListener;
    protected mouseMoveListener: EventListener;

    svg: SVGGraphicsElement;
    start(event: MouseEvent) {}
    continue(event: MouseEvent) {}
    stop() {}
    stopSignal() {} // for testing purpose
    handleKeyDown(key: string) {}
    handleKeyUp(key: string) {}

    copyState(svgs: SVGGraphicsElement[]): SVGGraphicsElement[] {
        let newSvgs = [];
        for (let i = 0; i < svgs.length; i++) {
            let svg = <SVGGraphicsElement>svgs[i].cloneNode(true);
            newSvgs.push(svg);
        }
        return newSvgs;
    }
}
