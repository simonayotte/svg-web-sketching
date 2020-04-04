export class SelectionState {
    initialX: number;
    initialY: number;
    hasSelected: boolean;
    selectMultiple: boolean;
    isSelecting: boolean;
    isDeselecting: boolean;
    isMoving: boolean;
    selectionRectangle: boolean;
    singleSelect: boolean;
    offset: number;

    constructor() {
        this.hasSelected = false;
        this.selectMultiple = false;
        this.isSelecting = false;
        this.isDeselecting = false;
        this.isMoving = false;
        this.selectionRectangle = false;
        this.singleSelect = false;
    }
}
