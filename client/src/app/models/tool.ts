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
}
