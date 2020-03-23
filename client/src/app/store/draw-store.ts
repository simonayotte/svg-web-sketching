import { Injectable, ElementRef } from '@angular/core';
import { DrawState } from '../state/draw-state';
import { Store } from './store';
import { Color } from '../models/color';
@Injectable({
    providedIn: 'root',
})
export class DrawStore extends Store<DrawState> {
    constructor() {
        super(new DrawState());
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

    pushSvg(value: SVGElement) {
        this.setState({
            ...this.state,
            svgState: { ...this.state.svgState, svgs: this.state.svgState.svgs.concat(value) },
        });
    }

    setSvg(value: Array<SVGElement>){
        this.setState({
            ...this.state,
            svgState: {...this.state.svgState, svgs: value}
        })
    }

    emptySvg(){
        this.setState({
            ...this.state,
            svgState: {...this.state.svgState, svgs: []}
        })
    }

    popShape() {
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
    setIsKeyHandlerActive(value: boolean) {
        this.setState({
            ...this.state,
            globalState: { ...this.state.globalState, isKeyHandlerActive: value },
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
