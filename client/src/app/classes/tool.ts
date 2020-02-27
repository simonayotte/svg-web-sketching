export interface Tool {
    start(event: MouseEvent): void;
    continue(event: MouseEvent): void;
    prepare(): void;
    stop(): void;
    handleKeyDown(key: string): void;
    handleKeyUp(key: string): void;
}
