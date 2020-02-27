import { Color } from '../classes/color';

export class ColorState {
    firstColor = new Color(0, 0, 0, 255);
    secondColor = new Color(0, 0, 0, 255);
    canvasColor = new Color(255, 255, 255, 255);
    workspaceColor = new Color(0, 0, 0, 100);
    isSidebarColorOpen = false;
    lastColors: (Color | null)[] = [null, null, null, null, null, null, null, null, null, null];
    lastColorsIndex = 0;
    selectedColor = '';
    constructor() {}
}

//faire couleur et key-handler
