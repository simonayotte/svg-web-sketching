import { Tools } from '../models/enums';

const THICKNESS_DEFAULT = 25;
const GRID_SIZE_DEFAULT = 50;

export class GlobalState {
    isKeyHandlerActive = true;
    isPanelOpen = false;
    thickness = THICKNESS_DEFAULT;
    tool = Tools.None;
    isDisplayGrid = false;
    gridSize = GRID_SIZE_DEFAULT;
    cursorX = 0;
    cursorY = 0;
    constructor() {}
}
