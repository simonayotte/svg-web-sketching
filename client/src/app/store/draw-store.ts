import { Injectable } from '@angular/core';
import { Color } from '../models/color';
import { BrushTextures, SelectedColors, Tools, Types } from '../models/enums';
import { DrawState } from '../state/draw-state';
import { Store } from './store';
@Injectable({
    providedIn: 'root',
})
export class DrawStore extends Store<DrawState> {
    constructor() {
        super(new DrawState());
    }

    // undoRedo
    undo() {
        if (this.state.undoRedoState.undoState.length === 0) {
            return;
        }
        const next = this.state.undoRedoState.undoState[this.state.undoRedoState.undoState.length - 1];
        this.setState({
            ...this.state,
            svgState: { ...this.state.svgState, svgs: next },
            undoRedoState: {
                ...this.state.undoRedoState,
                undoState: this.state.undoRedoState.undoState.slice(0, this.state.undoRedoState.undoState.length - 1),
                redoState: this.state.undoRedoState.redoState.concat([this.state.svgState.svgs]),
            },
        });
    }
    redo() {
        if (this.state.undoRedoState.redoState.length === 0) {
            return;
        }
        const next = this.state.undoRedoState.redoState[this.state.undoRedoState.redoState.length - 1];

        this.setState({
            ...this.state,
            svgState: { ...this.state.svgState, svgs: next },
            undoRedoState: {
                ...this.state.undoRedoState,
                redoState: this.state.undoRedoState.redoState.slice(0, this.state.undoRedoState.redoState.length - 1),
                undoState: this.state.undoRedoState.undoState.concat([this.state.svgState.svgs]),
            },
        });
    }

    resetUndoRedo() {
        this.setState({
            ...this.state,
            undoRedoState: { ...this.state.undoRedoState, redoState: [], undoState: [] },
        });
    }

    // Svg
    setDrawSvg(value: SVGSVGElement) {
        this.setState({
            ...this.state,
            svgState: { ...this.state.svgState, drawSvg: value },
        });
    }

    setDrawWidth(value: number) {
        this.setState({
            ...this.state,
            svgState: { ...this.state.svgState, width: value },
        });
    }

    setDrawHeight(value: number) {
        this.setState({
            ...this.state,
            svgState: { ...this.state.svgState, height: value },
        });
    }

    setSVGFilter(value: string) {
        this.setState({
            ...this.state,
            svgState: { ...this.state.svgState, svgFilter: value },
        });
    }

    pushSvg(value: SVGGraphicsElement) {
        const newState = this.state.svgState.svgs.concat(value);
        this.setState({
            ...this.state,
            svgState: { ...this.state.svgState, svgs: newState },
            undoRedoState: {
                ...this.state.undoRedoState,
                undoState: this.state.undoRedoState.undoState.concat([this.state.svgState.svgs]),
                redoState: [],
            },
        });
    }

    deleteSvgs(value: SVGGraphicsElement[]) {
        this.setState({
            ...this.state,
            svgState: { ...this.state.svgState, svgs: this.state.svgState.svgs.filter((svg) => !value.includes(svg)) },
            undoRedoState: {
                ...this.state.undoRedoState,
                undoState: this.state.undoRedoState.undoState.concat([this.state.svgState.svgs]),
                redoState: [],
            },
        });
    }

    emptySvg() {
        this.setState({
            ...this.state,
            svgState: { ...this.state.svgState, svgs: [] },
        });
    }

    saveSvgsState(value: SVGGraphicsElement[]) {
        this.setState({
            ...this.state,
            undoRedoState: {
                ...this.state.undoRedoState,
                undoState: this.state.undoRedoState.undoState.concat([value]),
                redoState: [],
            },
        });
    }

    popSvg() {
        this.setState({
            ...this.state,
            svgState: { ...this.state.svgState, svgs: this.state.svgState.svgs.slice(0, this.state.svgState.svgs.length - 1) },
        });
    }
    // Global

    setThickness(value: number) {
        this.setState({
            ...this.state,
            globalState: { ...this.state.globalState, thickness: value },
        });
    }
    setTool(value: Tools) {
        const isPanelOpen =
            this.state.globalState.tool === Tools.None || (this.state.globalState.tool === value && this.state.globalState.isPanelOpen)
                ? false
                : true;
        this.setState({
            ...this.state,
            globalState: { ...this.state.globalState, tool: value, isPanelOpen },
        });
    }
    toggleGrid() {
        this.setState({
            ...this.state,
            globalState: { ...this.state.globalState, isDisplayGrid: !this.state.globalState.isDisplayGrid },
        });
    }
    setGridSize(value: number) {
        this.setState({
            ...this.state,
            globalState: { ...this.state.globalState, gridSize: value },
        });
    }
    setIsKeyHandlerActive(value: boolean) {
        this.setState({
            ...this.state,
            globalState: { ...this.state.globalState, isKeyHandlerActive: value },
        });
    }

    setMousePosition(x: number, y: number) {
        this.setState({
            ...this.state,
            globalState: { ...this.state.globalState, cursorX: x, cursorY: y },
        });
    }
    // Color
    setFirstColor(value: Color, isAddLastColor?: boolean): void {
        this.setState({
            ...this.state,
            colorState: { ...this.state.colorState, firstColor: value },
        });
        if (isAddLastColor) {
            this.addLastColor(value);
        }
    }

    setSecondColor(value: Color, isAddLastColor?: boolean): void {
        this.setState({
            ...this.state,
            colorState: { ...this.state.colorState, secondColor: value },
        });
        if (isAddLastColor) {
            this.addLastColor(value);
        }
    }

    setCanvasColor(value: Color, isAddLastColor?: boolean): void {
        this.setState({
            ...this.state,
            colorState: { ...this.state.colorState, canvasColor: value },
        });
        if (isAddLastColor) {
            this.addLastColor(value);
        }
    }

    setWorkspaceColor(value: Color): void {
        this.setState({
            ...this.state,
            colorState: { ...this.state.colorState, workspaceColor: value },
        });
    }

    setIsSidebarColorOpen(value: boolean): void {
        this.setState({
            ...this.state,
            globalState: { ...this.state.globalState, isKeyHandlerActive: !value },
            colorState: { ...this.state.colorState, isSidebarColorOpen: value },
        });
    }

    selectColor(value: SelectedColors): void {
        this.setState({
            ...this.state,
            colorState: { ...this.state.colorState, selectedColor: value },
        });
    }

    swapColor(): void {
        this.setState({
            ...this.state,
            colorState: { ...this.state.colorState, firstColor: this.state.colorState.secondColor, secondColor: this.state.colorState.firstColor },
        });
    }

    addLastColor(value: Color): void {
        const lastColors: (Color | null)[] = this.state.colorState.lastColors;
        lastColors[this.state.colorState.lastColorsIndex] = value;
        const lastColorsIndex: number = (this.state.colorState.lastColorsIndex + 1) % 10;

        this.setState({
            ...this.state,
            colorState: { ...this.state.colorState, lastColorsIndex, lastColors },
        });
    }

    setGridOpacity(value: number) {
        const gridColor = this.state.colorState.gridColor;
        this.setState({
            ...this.state,
            colorState: { ...this.state.colorState, gridColor: new Color(gridColor.r, gridColor.g, gridColor.b, value) },
        });
    }
    // Brush
    setBrushTexture(value: BrushTextures) {
        this.setState({
            ...this.state,
            brushTexture: value,
        });
    }

    // Line
    setLineJunctionThickness(value: number) {
        this.setState({
            ...this.state,
            lineJunctionThickness: value,
        });
    }

    setLineHasJunction(value: boolean) {
        this.setState({
            ...this.state,
            lineHasJunction: value,
        });
    }
    // Rect
    setRectangleType(value: Types) {
        this.setState({
            ...this.state,
            rectangleType: value,
        });
    }
    // Aerosol
    setEmissionRate(value: number) {
        this.setState({
            ...this.state,
            emissionRate: value,
        });
    }
    // Polygon

    setPolygonType(value: Types) {
        this.setState({
            ...this.state,
            polygonType: value,
        });
    }

    setPolygonSides(value: number) {
        this.setState({
            ...this.state,
            polygonSides: value,
        });
    }

    // Ellipsis
    setEllipsisType(value: Types) {
        this.setState({
            ...this.state,
            ellipsisType: value,
        });
    }

    // Eraser
    setEraserThickness(value: number) {
        this.setState({
            ...this.state,
            eraserThickness: value,
        });
    }
}
