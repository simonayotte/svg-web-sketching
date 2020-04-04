import { Tools } from '../models/enums';

const THICKNESS_DEFAULT = 25;
const GRID_SIZE_DEFAULT = 50;

export class GlobalState {
    isKeyHandlerActive: boolean;
    isPanelOpen: boolean;
    thickness: number = THICKNESS_DEFAULT;
    tool: Tools = Tools.None;
    isDisplayGrid: boolean;
    gridSize: number = GRID_SIZE_DEFAULT;
    cursorX: number;
    cursorY: number;

    constructor() {
        this.isKeyHandlerActive = true;
        this.isPanelOpen = false;
        this.isDisplayGrid = false;
        this.cursorX = 0;
        this.cursorY = 0;
    }
}
