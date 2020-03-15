import { Injectable } from '@angular/core';
import { DrawState } from '../state/draw-state';
import { Store } from './store';
import { Color } from '../models/color';
import { Shape } from '../models/shape';
@Injectable({
    providedIn: 'root',
})
export class DrawStore extends Store<DrawState> {
    constructor() {
        super(new DrawState());
    }

    //Global
    setCanvasHTML(value: HTMLCanvasElement) {
        this.setState({
            ...this.state,
            canvasState: { ...this.state.canvasState, canvas: value, ctx: value.getContext('2d') as CanvasRenderingContext2D },
        });
    }
    setThickness(value: number) {
        this.setState({
            ...this.state,
            globalState: { ...this.state.globalState, thickness: value },
        });
    }
    setTool(value: string) {
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
    //Canvas
    setCanvasWidth(value: number) {
        this.setState({
            ...this.state,
            canvasState: { ...this.state.canvasState, width: value },
        });
    }
    setCanvasHeight(value: number) {
        this.setState({
            ...this.state,
            canvasState: { ...this.state.canvasState, height: value },
        });
    }
    pushShape(value: Shape) {
        this.setState({ ...this.state, canvasState: { ...this.state.canvasState, shapes: this.state.canvasState.shapes.concat(value) } });
    }
    popShape(value: Shape) {
        this.setState({
            ...this.state,
            canvasState: { ...this.state.canvasState, shapes: this.state.canvasState.shapes.slice(0, this.state.canvasState.shapes.length - 1) },
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

    selectColor(value: string): void {
        if (value == 'first') {
            this.setState({
                ...this.state,
                colorState: { ...this.state.colorState, selectedColor: value },
            });
        } else if (value == 'second') {
            this.setState({
                ...this.state,
                colorState: { ...this.state.colorState, selectedColor: value },
            });
        } else if (value == 'canvas') {
            this.setState({
                ...this.state,
                colorState: { ...this.state.colorState, selectedColor: value },
            });
        }
    }

    swapColor(): void {
        this.setState({
            ...this.state,
            colorState: { ...this.state.colorState, firstColor: this.state.colorState.secondColor, secondColor: this.state.colorState.firstColor },
        });
    }

    addLastColor(value: Color): void {
        const lastColorsIndex: number = (this.state.colorState.lastColorsIndex + 1) % 10;
        let lastColors: (Color | null)[] = this.state.colorState.lastColors;
        lastColors[lastColorsIndex] = value;

        this.setState({
            ...this.state,
            colorState: { ...this.state.colorState, lastColorsIndex, lastColors },
        });
    }
    //Brush
    setBrushTexture(value: string) {
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
    setRectangleType(value: string) {
        this.setState({
            ...this.state,
            rectangleType: value,
        });
    }

    //Polygon

    setPolygonType(value: string) {
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
    setEllipsisType(value: string) {
        this.setState({
            ...this.state,
            ellipsisType: value,
        });
    }
}
