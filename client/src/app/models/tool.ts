export abstract class Tool {
    start(event: MouseEvent) {}
    continue(event: MouseEvent) {}
    stop() {}
    handleKeyDown(key: string) {}
    handleKeyUp(key: string) {}

    svg: SVGElement;
}
