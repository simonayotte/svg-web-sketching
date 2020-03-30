import { Injectable } from '@angular/core';
import { DrawState } from '../state/draw-state';
import { Store } from './store';
import { Color } from '../models/color';
import { Tools, SelectedColors, BrushTextures, Types } from '../models/enums';
@Injectable({
    providedIn: 'root',
})
export class DrawStore extends Store<DrawState> {
    constructor() {
        super(new DrawState());
    }
    //Undo
    undo() {
        this.state.undoRedoState.canRedo = true;
        if(this.state.undoRedoState.undoState.length != 0){
            //lock redo
            
            let undo = this.state.undoRedoState.undoState[this.state.undoRedoState.undoState.length - 1];
            this.state.undoRedoState.undoState.pop();
            let svgs = this.state.svgState.svgs;
            console.log('undo'+undo);
            console.log('svgs'+svgs)
            //Add present state to redoState
            this.state.undoRedoState.redoState.push(svgs);

            this.setState({
                ...this.state,
                svgState: {...this.state.svgState, svgs: undo}
            })
        } else {
            this.state.undoRedoState.nextUndoState = [];
        }
    }

    redo() {
        if(this.state.undoRedoState.redoState.length != 0 && this.state.undoRedoState.canRedo){
            //Get dernier element et enlever de l'array des states
            let redo = this.state.undoRedoState.redoState[this.state.undoRedoState.redoState.length - 1];
            this.state.undoRedoState.redoState.pop();
            let svgs = this.state.svgState.svgs;

            //Add present state to undoState 
            this.state.undoRedoState.undoState.push(svgs);

            this.setState({
                ...this.state,
                svgState: {...this.state.svgState, svgs: redo}
            })
        }
    }

    clearRedo() {
        this.state.undoRedoState.redoState = [];
    }

    resetUndoRedo(svgs: Array<SVGGraphicsElement>){
        this.state.undoRedoState.canRedo = false;
        this.state.undoRedoState.nextUndoState = svgs;
        this.state.undoRedoState.redoState = [];
        this.state.undoRedoState.undoState = [];
    }


    //Svg
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

    setSVGFilter(value: string){
        this.setState({
            ...this.state,
            svgState: { ...this.state.svgState, svgFilter: value },
        });
    }

    pushSvg(value: SVGGraphicsElement) {
        let newState = this.state.svgState.svgs.concat(value);
        this.state.undoRedoState.undoState.push(this.state.undoRedoState.nextUndoState);
        this.state.undoRedoState.nextUndoState = newState;
        //lock canRedo on new action
        this.state.undoRedoState.canRedo = false;
        this.setState({
            ...this.state,
            svgState: { ...this.state.svgState, svgs: newState},
        });
    }

    deleteSvgs(value: SVGGraphicsElement[]) {
        let newState = this.state.svgState.svgs;
        this.state.undoRedoState.undoState.push(newState);

        this.setState({
            ...this.state,
            svgState: { ...this.state.svgState, svgs: this.state.svgState.svgs.filter(svg => !value.includes(svg)) },
        });
    }

    emptySvg() {
        this.setState({
            ...this.state,
            svgState: { ...this.state.svgState, svgs: [] },
        });
    }

    popSvg() {
        this.setState({
            ...this.state,
            svgState: { ...this.state.svgState, svgs: this.state.svgState.svgs.slice(0, this.state.svgState.svgs.length - 1) },
        });
    }

    //Global

    setThickness(value: number) {
        this.setState({
            ...this.state,
            globalState: { ...this.state.globalState, thickness: value },
        });
    }
    setTool(value: Tools) {
        const isPanelOpen = this.state.globalState.tool == value && this.state.globalState.isPanelOpen ? false : true;
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
    //Color
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
        let lastColors: (Color | null)[] = this.state.colorState.lastColors;
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
    //Brush
    setBrushTexture(value: BrushTextures) {
        this.setState({
            ...this.state,
            brushTexture: value,
        });
    }

    //Line
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
    //Rect
    setRectangleType(value: Types) {
        this.setState({
            ...this.state,
            rectangleType: value,
        });
    }
    //Aerosol
    setEmissionRate(value: number) {
        this.setState({
            ...this.state,
            emissionRate: value,
        });
    }
    //Polygon

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

    //Ellipsis
    setEllipsisType(value: Types) {
        this.setState({
            ...this.state,
            ellipsisType: value,
        });
    }

    //Eraser
    setEraserThickness(value: number) {
        this.setState({
            ...this.state,
            eraserThickness: value,
        });
    }
}
