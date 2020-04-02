import { Injectable, Renderer2, RendererFactory2 } from '@angular/core';
import { Tool } from 'src/app/models/tool';
import { DrawState } from 'src/app/state/draw-state';
import { DrawStore } from 'src/app/store/draw-store';
import { Tools, SelectionButtons } from 'src/app/models/enums';

//copier les svg avec create element avec les attributs, apres deplacement, save les svg copiees
@Injectable({
    providedIn: 'root',
})
export class SelectionService extends Tool {
    state: DrawState = new DrawState();
    initialX: number;
    initialY: number;
    shapes: Element[] = [];
    selectedShapes: Element[] = [];
    tempSelectedShapes: Element[] = [];
    oldSvgsState: SVGGraphicsElement[] = [];
    hasSelected = false;
    selectMultiple = false;
    isSelecting = false;
    isDeselecting = false;
    isMoving = false;
    startMovementX: number;
    startMovementY: number;
    lastPosX: number;
    lastPosY: number;
    selectionRectangle = false;
    singleSelect = false;

    controlKey = false;
    aKey = false;
    arrowRightKey = false;
    arrowLeftKey = false;
    arrowUpKey = false;
    arrowDownKey = false;

    encompassingBox: SVGGraphicsElement;
    displayEncompassingBox: boolean = true;
    encompassingBoxStartX: number;
    encompassingBoxStartY: number;
    encompassingBoxEndX: number;
    encompassingBoxEndY: number;

    offset: number;

    renderer: Renderer2;

    constructor(private store: DrawStore, rendererFactory: RendererFactory2) {
        super();
        this.store.stateObs.subscribe((value: DrawState) => {
            if (this.state.globalState.tool === Tools.Selection && value.globalState.tool !== Tools.Selection) {
                this.renderer.setAttribute(this.encompassingBox, 'width', '0');
                this.renderer.setAttribute(this.encompassingBox, 'height', '0');
            }
            this.state = value;
        });

        this.renderer = rendererFactory.createRenderer(null, null);

        this.mouseMoveListener = this.continue.bind(this);
        this.mouseUpListener = this.stopSelect.bind(this);
    }

    handleKeyDown(key: string): void {
        if (key === SelectionButtons.Control) {
            this.controlKey = true;
        }
        if (key === SelectionButtons.a) {
            this.aKey = true;
        }
        if (this.controlKey && this.aKey) {
            this.selectedShapes = this.shapes.slice();
            if (this.selectedShapes[0]) {
                this.drawEncompassingBox(this.selectedShapes);
            }
        }
        if (key === SelectionButtons.ArrowRight) {
            this.arrowRightKey = true;
        }
        if (this.arrowRightKey) {
            this.moveShapes(3, 0);
        }
        if (key === SelectionButtons.ArrowLeft) {
            this.arrowLeftKey = true;
        }
        if (this.arrowLeftKey) {
            this.moveShapes(-3, 0);
        }
        if (key === SelectionButtons.ArrowUp) {
            this.arrowUpKey = true;
        }
        if (this.arrowUpKey) {
            this.moveShapes(0, -3);
        }
        if (key === SelectionButtons.ArrowDown) {
            this.arrowDownKey = true;
        }
        if (this.arrowDownKey) {
            this.moveShapes(0, 3);
        }
    }

    handleKeyUp(key: string): void {
        if (key === SelectionButtons.Control) {
            this.controlKey = false;
        }
        if (key === SelectionButtons.a) {
            this.aKey = false;
        }
        if (key === SelectionButtons.ArrowRight) {
            this.arrowRightKey = false;
        }
        if (key === SelectionButtons.ArrowLeft) {
            this.arrowLeftKey = false;
        }
        if (key === SelectionButtons.ArrowUp) {
            this.arrowUpKey = false;
        }
        if (key === SelectionButtons.ArrowDown) {
            this.arrowDownKey = false;
        }
    }

    start(event: MouseEvent) {
        this.singleSelect = true;
        this.initialX = event.offsetX;
        this.initialY = event.offsetY;
        this.shapes = <Element[]>this.state.svgState.svgs;
        this.offset = this.offset;
        this.oldSvgsState = this.copyState(this.state.svgState.svgs);
        if (event.button == 0) {
            // left click
            this.isDeselecting = false;
            this.isSelecting = true;
            if (!this.encompassingBox) {
                this.createEncompassingBox();
            }
        } else if (event.button == 2 && !this.isDeselecting) {
            // right click
            this.isDeselecting = true;
            this.isSelecting = false;
            this.tempSelectedShapes = this.selectedShapes.slice();
        }

        this.createSelectionRectangle();

        this.state.svgState.drawSvg.addEventListener('mousemove', this.mouseMoveListener);
        this.state.svgState.drawSvg.addEventListener('mouseup', this.mouseUpListener);
    }

    continue(event: MouseEvent): void {
        this.singleSelect = false;

        if (!this.isMoving && !this.selectionRectangle) {
            let targetedElement = <Element>event.target;

            if (this.shapes.includes(targetedElement) && this.selectedShapes.includes(targetedElement)) {
                this.isMoving = true;
            } else if (this.shapes.includes(targetedElement) && !this.selectedShapes.includes(targetedElement)) {
                this.isMoving = true;
                this.selectedShapes = [targetedElement];
                this.drawEncompassingBox(this.selectedShapes);
            } else if (
                event.offsetX > this.encompassingBoxStartX &&
                event.offsetX < this.encompassingBoxEndX &&
                event.offsetY > this.encompassingBoxStartY &&
                event.offsetY < this.encompassingBoxEndY
            ) {
                this.isMoving = true;
            }
            if (this.isMoving) {
                this.startMovementX = event.offsetX;
                this.startMovementY = event.offsetY;
                this.lastPosX = event.offsetX;
                this.lastPosY = event.offsetY;
            }
        }

        // Translation
        if (this.isMoving) {
            let translationX = event.offsetX - this.lastPosX;
            let translationY = event.offsetY - this.lastPosY;
            this.lastPosX = event.offsetX;
            this.lastPosY = event.offsetY;
            this.moveShapes(translationX, translationY);
        } else {
            // Selection
            this.selectionRectangle = true;
            this.drawSelectionRectangle(this.initialX, this.initialY, event.offsetX, event.offsetY);

            if (!this.isDeselecting) {
                this.selectedShapes = this.findMultipleShapes(this.shapes, this.initialX, this.initialY, event.offsetX, event.offsetY);
            } else {
                this.reverseSelection(event.offsetX, event.offsetY);
            }
            if (this.selectedShapes[0]) {
                this.drawEncompassingBox(this.selectedShapes);
            } else {
                if (this.encompassingBox) {
                    this.hideEncompassingBox();
                }
            }
        }
    }

    stop() {
        if (this.svg) {
            this.renderer.removeChild(this.state.svgState.drawSvg, this.svg);
        }
        if (this.isMoving) {
            this.store.saveSvgsState(this.oldSvgsState);
        }
        this.state.svgState.drawSvg.removeEventListener('mousemove', this.mouseMoveListener);
        this.state.svgState.drawSvg.removeEventListener('mouseup', this.mouseUpListener);

        this.isSelecting = false;
        this.isDeselecting = false;

        this.isMoving = false;
        this.selectionRectangle = false;
    }
    stopSelect(event: MouseEvent): void {
        let targetedElement = <Element>event.target;
        if (this.singleSelect) {
            this.findSingleShape(targetedElement);
        }
        this.drawEncompassingBox(this.selectedShapes);
        this.stop();
    }

    // Check which shape is under the mouse cursor
    findSingleShape(targetedElement: Element): void {
        if (this.isSelecting) {
            if (this.shapes.includes(targetedElement)) {
                this.selectedShapes = [targetedElement];
            } else {
                this.selectedShapes = [];
            }
        } else if (this.isDeselecting) {
            if (this.shapes.includes(targetedElement)) {
                let isPresent = false;
                for (let i = 0; i < this.selectedShapes.length; i++) {
                    if (targetedElement == this.selectedShapes[i]) {
                        this.selectedShapes.splice(i, 1);
                        isPresent = true;
                        break;
                    }
                }
                if (!isPresent) {
                    this.selectedShapes.push(targetedElement);
                }
            }
        }
    }

    // Check which shapes are inside the given selection rectangle
    findMultipleShapes(shapes: Element[], startX: number, startY: number, endX: number, endY: number): Element[] {
        let Aleft = startX > endX ? endX : startX;
        let Aright = startX > endX ? startX : endX;
        let Atop = startY > endY ? endY : startY;
        let Abottom = startY > endY ? startY : endY;
        let selectedShapes: Element[] = [];
        this.offset = this.state.svgState.drawSvg.getBoundingClientRect().left;
        for (let i = 0; i < shapes.length; i++) {
            let shape = shapes[i];
            let boundingRect = shape.getBoundingClientRect();
            let thickness = +shapes[i].getAttribute('stroke-width')! / 2;
            let Bleft =
                boundingRect.left - thickness > boundingRect.right + thickness ? boundingRect.right + thickness : boundingRect.left - thickness;
            let Bright =
                boundingRect.left - thickness > boundingRect.right + thickness ? boundingRect.left - thickness : boundingRect.right + thickness;
            let Btop =
                boundingRect.top - thickness > boundingRect.bottom + thickness ? boundingRect.bottom + thickness : boundingRect.top - thickness;
            let Bbottom =
                boundingRect.top - thickness > boundingRect.bottom + thickness ? boundingRect.top - thickness : boundingRect.bottom + thickness;
            if (Aleft < Bright - this.offset && Aright > Bleft - this.offset && Atop < Bbottom && Abottom > Btop) {
                selectedShapes.push(shape);
            }
        }
        return selectedShapes;
    }

    // Find the shapes inside the rectangle drawn by the mouse and inverse their selection state
    reverseSelection(mouseX: number, mouseY: number) {
        let shapeIsSelected;
        this.selectedShapes = this.tempSelectedShapes.slice();
        let shapesToRemove = this.findMultipleShapes(this.shapes, this.initialX, this.initialY, mouseX, mouseY);
        let shapesToAdd: Element[] = [];
        if (this.selectedShapes[0] && shapesToRemove[0]) {
            for (let i = 0; i < shapesToRemove.length; i++) {
                shapeIsSelected = false;
                for (let j = 0; j < this.selectedShapes.length; j++) {
                    if (shapesToRemove[i] == this.selectedShapes[j]) {
                        this.selectedShapes.splice(j, 1);
                        shapeIsSelected = true;
                        break;
                    }
                }
                if (!shapeIsSelected) {
                    shapesToAdd.push(shapesToRemove[i]);
                }
            }
        }

        if (shapesToAdd != []) {
            for (let i = 0; i < shapesToAdd.length; i++) {
                this.selectedShapes.push(shapesToAdd[i]);
            }
        }
    }

    createSelectionRectangle(): void {
        this.svg = this.renderer.createElement('rect', 'svg');
        this.renderer.setAttribute(this.svg, 'stroke-width', '6');
        this.renderer.setAttribute(this.svg, 'fill', this.state.colorState.firstColor.hex()); // TODO no color ?
        this.renderer.setAttribute(this.svg, 'stroke', `#${this.state.colorState.gridColor.colorHex()}`);
        this.renderer.setAttribute(this.svg, 'stroke-dasharray', '10');
        this.renderer.appendChild(this.state.svgState.drawSvg, this.svg);
    }

    drawSelectionRectangle(startX: number, startY: number, endX: number, endY: number) {
        this.renderer.setAttribute(this.svg, 'fill', this.state.colorState.firstColor.hex());
        this.renderer.setAttribute(this.svg, 'stroke', `#${this.state.colorState.gridColor.colorHex()}`);

        let height = Math.abs(endY - startY);
        let width = Math.abs(endX - startX);
        let x = endX > startX ? startX : endX;
        let y = endY > startY ? startY : endY;
        this.renderer.setAttribute(this.svg, 'x', x.toString());
        this.renderer.setAttribute(this.svg, 'y', y.toString());
        this.renderer.setAttribute(this.svg, 'height', height.toString());
        this.renderer.setAttribute(this.svg, 'width', width.toString());
        this.renderer.setAttribute(this.svg, 'fill-opacity', '0.2');
    }

    createEncompassingBox(): void {
        this.encompassingBox = this.renderer.createElement('rect', 'svg');
        this.renderer.setAttribute(this.encompassingBox, 'stroke-width', '6');
        this.renderer.setAttribute(this.encompassingBox, 'fill', 'none');
        this.renderer.setAttribute(this.encompassingBox, 'stroke-dasharray', '10');
        this.renderer.setAttribute(this.encompassingBox, 'stroke', `#${this.state.colorState.gridColor.colorHex()}`); // TODO no color ?
        this.renderer.setAttribute(this.encompassingBox, 'opacity', '1');
        this.renderer.appendChild(this.state.svgState.drawSvg, this.encompassingBox);
    }

    drawEncompassingBox(shapes: Element[]) {
        if (!shapes[0]) {
            this.hideEncompassingBox();
            return;
        }
        this.offset = this.state.svgState.drawSvg.getBoundingClientRect().left;
        let tempStart = shapes[0].getBoundingClientRect();
        let thickness = +shapes[0].getAttribute('stroke-width')! / 2;
        let startX = tempStart.left - thickness - this.offset;
        let startY = tempStart.top - thickness;
        let endX = tempStart.right + thickness - this.offset;
        let endY = tempStart.bottom + thickness;
        for (let i = 0; i < shapes.length; i++) {
            let boundingRectangle = shapes[i].getBoundingClientRect();
            thickness = +shapes[i].getAttribute('stroke-width')! / 2;
            if (startX > boundingRectangle.left - thickness - this.offset) {
                startX = boundingRectangle.left - thickness - this.offset;
            }
            if (startY > boundingRectangle.top - thickness) {
                startY = boundingRectangle.top - thickness;
            }
            if (endX < boundingRectangle.right + thickness - this.offset) {
                endX = boundingRectangle.right + thickness - this.offset;
            }
            if (endY < boundingRectangle.bottom + thickness) {
                endY = boundingRectangle.bottom + thickness;
            }
        }

        this.encompassingBoxStartX = startX;
        this.encompassingBoxStartY = startY;
        this.encompassingBoxEndX = endX;
        this.encompassingBoxEndY = endY;
        this.renderer.setAttribute(this.encompassingBox, 'x', startX.toString());
        this.renderer.setAttribute(this.encompassingBox, 'y', startY.toString());
        this.renderer.setAttribute(this.encompassingBox, 'height', (endY - startY).toString());
        this.renderer.setAttribute(this.encompassingBox, 'width', (endX - startX).toString());
        this.renderer.setAttribute(this.encompassingBox, 'opacity', '1');
    }

    hideEncompassingBox(): void {
        this.renderer.setAttribute(this.encompassingBox, 'opacity', '0');
        this.encompassingBoxStartX = 0;
        this.encompassingBoxStartY = 0;
        this.encompassingBoxEndX = 0;
        this.encompassingBoxEndY = 0;
    }

    moveShapes(translationX: number, translationY: number): void {
        for (let i = 0; i < this.selectedShapes.length; i++) {
            let X: number;
            let Y: number;
            if (this.selectedShapes[i].getAttribute('transform')) {
                X = +this.selectedShapes[i]
                    .getAttribute('transform')!
                    .split(',')[0]
                    .split('translate(')
                    .reverse()[0];
                Y = +this.selectedShapes[i]
                    .getAttribute('transform')!
                    .split(')')[0]
                    .split(',')
                    .reverse()[0];
            } else {
                X = 0;
                Y = 0;
            }
            this.renderer.setAttribute(
                this.selectedShapes[i],
                'transform',
                'translate(' + (X + translationX).toString() + ',' + (Y + translationY).toString() + ')',
            );
        }
        this.drawEncompassingBox(this.selectedShapes);
    }
}
