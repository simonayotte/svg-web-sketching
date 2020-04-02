export class SelectionState {
    initialX: number;
    initialY: number;
    hasSelected = false;
    selectMultiple = false;
    isSelecting = false;
    isDeselecting = false;
    isMoving = false;
    selectionRectangle = false;
    singleSelect = false;
    offset: number;
}