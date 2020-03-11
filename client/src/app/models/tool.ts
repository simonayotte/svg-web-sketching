export interface Tool {
    start(event: MouseEvent): void;
    continue(event: MouseEvent): void;
    continueSignal(): void;
    prepare(): void;
    stop(): void;
    stopSignal(): void;
    handleKeyDown(key: string): void;
    handleKeyUp(key: string): void;
}
