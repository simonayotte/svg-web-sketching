const TIMER_DEFAULT = 500;
const LOOP_DEFAULT = 100;

export class SelectionKeys {
    controlKey: boolean;
    aKey: boolean;
    arrowRightKey: boolean;
    arrowLeftKey: boolean;
    arrowUpKey: boolean;
    arrowDownKey: boolean;
    keepLooping: boolean;
    repeat: boolean;
    timer: number;
    loop: number;

    constructor() {
        this.controlKey = false;
        this.aKey = false;
        this.arrowRightKey = false;
        this.arrowLeftKey = false;
        this.arrowUpKey = false;
        this.arrowDownKey = false;
        this.keepLooping = true;
        this.repeat = false;
        this.timer = TIMER_DEFAULT;
        this.loop = LOOP_DEFAULT;
    }
}
