export abstract class Tool<T> {
    start(event: MouseEvent) {}
    continue(event: MouseEvent) {}
    stop() {}
    stopSignal() {} //to be called in stop for testing purpose

    setup(element: T) {} //to be called in draw
    draw(element: T) {}

    handleKeyDown(key: string) {}
    handleKeyUp(key: string) {}

    element: T;
}
