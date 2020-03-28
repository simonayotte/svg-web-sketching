import { Tools } from '../models/enums';

export class GlobalState {
    isKeyHandlerActive = true;
    isPanelOpen = false;
    thickness = 25;
    tool = Tools.None;
    isDisplayGrid = false;
    gridSize = 50;
    constructor() {}
}
