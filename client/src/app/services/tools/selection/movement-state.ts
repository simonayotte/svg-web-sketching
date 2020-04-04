export class MovementState {
    startMovementX: number;
    startMovementY: number;
    lastPosX: number;
    lastPosY: number;

    constructor() {
        this.startMovementX = 0;
        this.startMovementY = 0;
        this.lastPosX = 0;
        this.lastPosY = 0;
    }
}
