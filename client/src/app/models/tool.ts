export abstract class Tool {
    start(event: MouseEvent) {}
    continue(event: MouseEvent) {}
    stop(): SVGElement {
        return this.svg;
    }
    handleKeyDown(key: string) {}
    handleKeyUp(key: string) {}

    svg: SVGElement;
}
