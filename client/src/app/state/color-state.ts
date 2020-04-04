import { Color } from '../models/color';
import { SelectedColors } from '../models/enums';

/* tslint:disable:no-magic-numbers */
export class ColorState {
    firstColor: Color = new Color(0, 0, 0, 255); // BLACK
    secondColor: Color = new Color(0, 0, 0, 255);
    canvasColor: Color = new Color(255, 255, 255, 255); // WHITE
    workspaceColor: Color = new Color(0, 0, 0, 100);
    gridColor: Color = new Color(70, 70, 70, 255);

    isSidebarColorOpen: boolean;
    lastColors: (Color | null)[] = [null, null, null, null, null, null, null, null, null, null];
    lastColorsIndex: number;
    selectedColor: SelectedColors = SelectedColors.None;
    constructor() {
        this.isSidebarColorOpen = false;
        this.lastColorsIndex = 0;
    }
}
