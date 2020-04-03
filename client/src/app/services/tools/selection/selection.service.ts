import { Injectable, Renderer2, RendererFactory2 } from '@angular/core';
import { Tool } from 'src/app/models/tool';
import { DrawState } from 'src/app/state/draw-state';
import { DrawStore } from 'src/app/store/draw-store';
import { EncompassingBox } from './encompassingBox';
import { SelectionState } from './selectionState';
import { SelectionKeys } from './selectionKeys';
import { MovementState } from './movementState';
import { SelectionButtons, Tools } from 'src/app/models/enums';

//copier les svg avec create element avec les attributs, apres deplacement, save les svg copiees
@Injectable({
    providedIn: 'root',
})
export class SelectionService extends Tool {
    state: DrawState = new DrawState();
    shapes: Element[] = [];
    selectedShapes: Element[] = [];
    tempSelectedShapes: Element[] = [];
    oldSvgsState: SVGGraphicsElement[] = [];

    movementState: MovementState = new MovementState();
    selectionState: SelectionState = new SelectionState();
    encompassingBox: EncompassingBox;
    keys: SelectionKeys = new SelectionKeys();
    timer: NodeJS.Timer;

    mouseUpListener: EventListener;
    mouseMoveListener: EventListener;

    renderer: Renderer2;

    constructor(private store: DrawStore, rendererFactory: RendererFactory2) {
        super();
        this.store.stateObs.subscribe((value: DrawState) => {
            if (this.state.globalState.tool === Tools.Selection && value.globalState.tool !== Tools.Selection) {
                this.renderer.setAttribute(this.encompassingBox.encompassingBox, 'width', '0');
                this.renderer.setAttribute(this.encompassingBox.encompassingBox, 'height', '0');
            }

            this.state = value;
        });
        this.mouseMoveListener = this.continue.bind(this);
        this.mouseUpListener = this.stopSelect.bind(this);

        this.renderer = rendererFactory.createRenderer(null, null);
    }

    start(event: MouseEvent) {
        this.selectionState.singleSelect = true;
        this.selectionState.initialX = event.offsetX;
        this.selectionState.initialY = event.offsetY;
        this.shapes = <Element[]>this.state.svgState.svgs;
        this.selectionState.offset = this.selectionState.offset;

        this.oldSvgsState = this.copyState(this.state.svgState.svgs); //Copy state for undo

        if (event.button == 0) {
            // left click
            this.selectionState.isDeselecting = false;
            this.selectionState.isSelecting = true;
        } else if (event.button == 2 && !this.selectionState.isDeselecting) {
            // right click
            this.selectionState.isDeselecting = true;
            this.selectionState.isSelecting = false;
            this.tempSelectedShapes = this.selectedShapes.slice();
        }

        this.createSelectionRectangle();
        if (!this.encompassingBox) {
            this.createEncompassingBox();
        }

        this.state.svgState.drawSvg.addEventListener('mousemove', this.mouseMoveListener);
        this.state.svgState.drawSvg.addEventListener('mouseup', this.mouseUpListener);
    }

    continue(event: MouseEvent): void {
        this.selectionState.singleSelect = false;

        if (!this.selectionState.isMoving && !this.selectionState.selectionRectangle && !this.selectionState.isDeselecting) {
            let targetedElement = <Element>event.target;
            this.determineMovingState(event, targetedElement);
        }

        if (this.selectionState.isMoving) {
            this.applyTranslation(event.offsetX, event.offsetY);
        } else {
            this.applySelection(event.offsetX, event.offsetY);
        }
    }

    determineMovingState(event: MouseEvent, target: Element): void {
        if (this.shapes.includes(target) && this.selectedShapes.includes(target)) {
            this.selectionState.isMoving = true;
        } else if (this.shapes.includes(target) && !this.selectedShapes.includes(target)) {
            this.selectionState.isMoving = true;
            this.selectedShapes = [target];
            this.drawEncompassingBox(this.selectedShapes);
        } else if (
            event.offsetX > this.encompassingBox.startX &&
            event.offsetX < this.encompassingBox.endX &&
            event.offsetY > this.encompassingBox.startY &&
            event.offsetY < this.encompassingBox.endY
        ) {
            this.selectionState.isMoving = true;
        }
        if (this.selectionState.isMoving) {
            this.movementState.startMovementX = event.offsetX;
            this.movementState.startMovementY = event.offsetY;
            this.movementState.lastPosX = event.offsetX;
            this.movementState.lastPosY = event.offsetY;
        }
    }

    applyTranslation(mouseX: number, mouseY: number): void {
        let translationX = mouseX - this.movementState.lastPosX;
        let translationY = mouseY - this.movementState.lastPosY;
        this.movementState.lastPosX = mouseX;
        this.movementState.lastPosY = mouseY;
        this.moveShapes(this.selectedShapes, translationX, translationY);
    }

    applySelection(mouseX: number, mouseY: number): void {
        this.selectionState.selectionRectangle = true;
        this.drawSelectionRectangle(this.selectionState.initialX, this.selectionState.initialY, mouseX, mouseY);

        if (!this.selectionState.isDeselecting) {
            this.selectedShapes = this.findMultipleShapes(this.shapes, this.selectionState.initialX, this.selectionState.initialY, mouseX, mouseY);
        } else {
            this.reverseSelection(mouseX, mouseY);
        }
        if (this.selectedShapes[0]) {
            this.drawEncompassingBox(this.selectedShapes);
        } else {
            if (this.encompassingBox) {
                this.hideEncompassingBox();
            }
        }
    }

    stopSelect(event: MouseEvent): void {
        let targetedElement = <Element>event.target;
        event.preventDefault();
        if (this.selectionState.singleSelect) {
            this.findSingleShape(targetedElement);
        }
        this.drawEncompassingBox(this.selectedShapes);
        this.stop();
    }

    stop() {
        if (this.selectionState.isMoving) {
            this.store.saveSvgsState(this.oldSvgsState);
        }

        this.selectionState.isSelecting = false;
        this.selectionState.isDeselecting = false;
        this.selectionState.isMoving = false;
        this.selectionState.selectionRectangle = false;
        if (this.svg) {
            this.renderer.removeChild(this.state.svgState.drawSvg, this.svg);
        }
        this.state.svgState.drawSvg.removeEventListener('mousemove', this.mouseMoveListener);
        this.state.svgState.drawSvg.removeEventListener('mouseup', this.mouseUpListener);
    }

    // Add or remove the targetedElement depending on the type of selection/deselection
    findSingleShape(targetedElement: Element): void {
        if (this.selectionState.isSelecting) {
            if (this.shapes.includes(targetedElement)) {
                this.selectedShapes = [targetedElement];
            } else {
                this.selectedShapes = [];
            }
        } else if (this.selectionState.isDeselecting) {
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
        this.selectionState.offset = this.state.svgState.drawSvg.getBoundingClientRect().left;
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
            if (Aleft < Bright - this.selectionState.offset && Aright > Bleft - this.selectionState.offset && Atop < Bbottom && Abottom > Btop) {
                selectedShapes.push(shape);
            }
        }
        return selectedShapes;
    }

    // Find the shapes inside the rectangle drawn by the mouse and inverse their selection state
    reverseSelection(mouseX: number, mouseY: number) {
        let shapeIsSelected;
        this.selectedShapes = this.tempSelectedShapes.slice();
        let shapesToRemove = this.findMultipleShapes(this.shapes, this.selectionState.initialX, this.selectionState.initialY, mouseX, mouseY);
        let shapesToAdd: Element[] = [];
        if (shapesToRemove[0]) {
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
        this.renderer.setAttribute(this.svg, 'stroke-width', '1');
        this.renderer.setAttribute(this.svg, 'fill', '#000000');
        this.renderer.setAttribute(this.svg, 'stroke', 'transparent');
        this.renderer.setAttribute(this.svg, 'stroke-dasharray', '10');
        this.renderer.appendChild(this.state.svgState.drawSvg, this.svg);
    }

    drawSelectionRectangle(startX: number, startY: number, endX: number, endY: number) {
        this.renderer.setAttribute(this.svg, 'fill', this.state.colorState.firstColor.hex());
        this.renderer.setAttribute(this.svg, 'stroke', this.state.colorState.secondColor.hex());

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
        this.encompassingBox = new EncompassingBox();
        this.encompassingBox.encompassingBox = this.renderer.createElement('rect', 'svg');
        this.encompassingBox.controlPoint1 = this.renderer.createElement('rect', 'svg');
        this.encompassingBox.controlPoint2 = this.renderer.createElement('rect', 'svg');
        this.encompassingBox.controlPoint3 = this.renderer.createElement('rect', 'svg');
        this.encompassingBox.controlPoint4 = this.renderer.createElement('rect', 'svg');

        this.renderer.setAttribute(this.encompassingBox.encompassingBox, 'stroke-width', '2');
        this.renderer.setAttribute(this.encompassingBox.encompassingBox, 'fill', 'none');
        this.renderer.setAttribute(this.encompassingBox.encompassingBox, 'stroke-dasharray', '10');
        this.renderer.setAttribute(this.encompassingBox.encompassingBox, 'stroke', '#000000');
        this.renderer.setAttribute(this.encompassingBox.encompassingBox, 'opacity', '0.4');
        this.renderer.appendChild(this.state.svgState.drawSvg, this.encompassingBox.encompassingBox);
        this.renderer.appendChild(this.state.svgState.drawSvg, this.encompassingBox.controlPoint1);
        this.renderer.appendChild(this.state.svgState.drawSvg, this.encompassingBox.controlPoint2);
        this.renderer.appendChild(this.state.svgState.drawSvg, this.encompassingBox.controlPoint3);
        this.renderer.appendChild(this.state.svgState.drawSvg, this.encompassingBox.controlPoint4);
    }

    drawEncompassingBox(shapes: Element[]) {
        if (!shapes[0]) {
            this.hideEncompassingBox();
            return;
        }
        this.selectionState.offset = this.state.svgState.drawSvg.getBoundingClientRect().left;
        let tempStart = shapes[0].getBoundingClientRect();
        let thickness = +shapes[0].getAttribute('stroke-width')! / 2;
        let startX = tempStart.left - thickness - this.selectionState.offset;
        let startY = tempStart.top - thickness;
        let endX = tempStart.right + thickness - this.selectionState.offset;
        let endY = tempStart.bottom + thickness;
        for (let i = 0; i < shapes.length; i++) {
            let boundingRectangle = shapes[i].getBoundingClientRect();
            thickness = +shapes[i].getAttribute('stroke-width')! / 2;
            if (startX > boundingRectangle.left - thickness - this.selectionState.offset) {
                startX = boundingRectangle.left - thickness - this.selectionState.offset;
            }
            if (startY > boundingRectangle.top - thickness) {
                startY = boundingRectangle.top - thickness;
            }
            if (endX < boundingRectangle.right + thickness - this.selectionState.offset) {
                endX = boundingRectangle.right + thickness - this.selectionState.offset;
            }
            if (endY < boundingRectangle.bottom + thickness) {
                endY = boundingRectangle.bottom + thickness;
            }
        }

        this.encompassingBox.startX = startX;
        this.encompassingBox.startY = startY;
        this.encompassingBox.endX = endX;
        this.encompassingBox.endY = endY;
        this.renderer.setAttribute(this.encompassingBox.encompassingBox, 'x', startX.toString());
        this.renderer.setAttribute(this.encompassingBox.encompassingBox, 'y', startY.toString());
        this.renderer.setAttribute(this.encompassingBox.encompassingBox, 'height', (endY - startY).toString());
        this.renderer.setAttribute(this.encompassingBox.encompassingBox, 'width', (endX - startX).toString());
        this.renderer.setAttribute(this.encompassingBox.encompassingBox, 'opacity', '0.4');

        this.encompassingBox.controlPointWidth = 10;
        this.drawControlPoints();
    }

    drawControlPoints(): void {
        let width = this.encompassingBox.controlPointWidth;
        this.setPosition(
            this.encompassingBox.controlPoint1,
            (this.encompassingBox.endX - this.encompassingBox.startX) / 2 - width / 2 + this.encompassingBox.startX,
            this.encompassingBox.startY - width,
            width,
            width,
        );
        this.setPosition(
            this.encompassingBox.controlPoint2,
            (this.encompassingBox.endX - this.encompassingBox.startX) / 2 - width / 2 + this.encompassingBox.startX,
            this.encompassingBox.endY,
            width,
            width,
        );
        this.setPosition(
            this.encompassingBox.controlPoint3,
            this.encompassingBox.startX - width,
            (this.encompassingBox.endY - this.encompassingBox.startY) / 2 + this.encompassingBox.startY - width / 2,
            width,
            width,
        );
        this.setPosition(
            this.encompassingBox.controlPoint4,
            this.encompassingBox.endX,
            (this.encompassingBox.endY - this.encompassingBox.startY) / 2 + this.encompassingBox.startY - width / 2,
            width,
            width,
        );
    }

    setPosition(element: SVGElement, x: number, y: number, height: number, width: number) {
        this.renderer.setAttribute(element, 'x', x.toString());
        this.renderer.setAttribute(element, 'y', y.toString());
        this.renderer.setAttribute(element, 'height', height.toString());
        this.renderer.setAttribute(element, 'width', width.toString());
        this.renderer.setAttribute(element, 'opacity', '0.4');
    }

    hideEncompassingBox(): void {
        this.renderer.setAttribute(this.encompassingBox.encompassingBox, 'opacity', '0');
        this.renderer.setAttribute(this.encompassingBox.controlPoint1, 'opacity', '0');
        this.renderer.setAttribute(this.encompassingBox.controlPoint2, 'opacity', '0');
        this.renderer.setAttribute(this.encompassingBox.controlPoint3, 'opacity', '0');
        this.renderer.setAttribute(this.encompassingBox.controlPoint4, 'opacity', '0');

        this.encompassingBox.startX = 0;
        this.encompassingBox.startY = 0;
        this.encompassingBox.endX = 0;
        this.encompassingBox.endY = 0;
    }

    moveShapes(shapes: Element[], translationX: number, translationY: number): void {
        for (let i = 0; i < shapes.length; i++) {
            let X: number;
            let Y: number;
            if (shapes[i].getAttribute('transform')) {
                X = +shapes[i]
                    .getAttribute('transform')!
                    .split(',')[0]
                    .split('translate(')
                    .reverse()[0];
                Y = +shapes[i]
                    .getAttribute('transform')!
                    .split(')')[0]
                    .split(',')
                    .reverse()[0];
            } else {
                X = 0;
                Y = 0;
            }
            shapes[i].setAttribute('transform', 'translate(' + (X + translationX).toString() + ',' + (Y + translationY).toString() + ')');
        }
        this.drawEncompassingBox(shapes);
    }

    handleKeyDown(key: string): void {
        if (key === SelectionButtons.Control) {
            this.keys.controlKey = true;
        }
        if (key === SelectionButtons.a) {
            this.keys.aKey = true;
        }
        if (this.keys.controlKey && this.keys.aKey) {
            this.selectedShapes = this.shapes.slice();
            if (this.selectedShapes[0]) {
                this.drawEncompassingBox(this.selectedShapes);
            }
        }
        if (key === SelectionButtons.ArrowRight) {
            this.keys.arrowRightKey = true;
            
        }
        if (this.keys.arrowRightKey) {
            this.moveShapes(this.selectedShapes, 3, 0);
        }
        if (key === SelectionButtons.ArrowLeft) {
            this.keys.arrowLeftKey = true;
        }
        if (this.keys.arrowLeftKey) {
            this.moveShapes(this.selectedShapes, -3, 0);
        }
        if (key === SelectionButtons.ArrowUp) {
            this.keys.arrowUpKey = true;
        }
        if (this.keys.arrowUpKey) {
            this.moveShapes(this.selectedShapes, 0, -3);
        }
        if (key === SelectionButtons.ArrowDown) {
            this.keys.arrowDownKey = true;
        }
        if (this.keys.arrowDownKey) {
            this.moveShapes(this.selectedShapes, 0, 3);
        }
        this.checkKeyTimePressed();
    }

    handleKeyUp(key: string): void {
        if (key === SelectionButtons.Control) {
            this.keys.controlKey = false;
        }
        if (key === SelectionButtons.a) {
            this.keys.aKey = false;
        }
        if (key === SelectionButtons.ArrowRight) {
            this.keys.arrowRightKey = false;
        }
        if (key === SelectionButtons.ArrowLeft) {
            this.keys.arrowLeftKey = false;
        }
        if (key === SelectionButtons.ArrowUp) {
            this.keys.arrowUpKey = false;
        }
        if (key === SelectionButtons.ArrowDown) {
            this.keys.arrowDownKey = false;
        }
        this.checkKeyTimePressed();
    }

    checkKeyTimePressed() {
        if ((this.keys.arrowDownKey || this.keys.arrowLeftKey || this.keys.arrowRightKey || this.keys.arrowUpKey) && !this.keys.keepLooping) {
            this.keys.keepLooping = true;
            this.timer = setInterval(() => {
                this.repeatKeyMovement();
            }, this.keys.loop);
        }

        if (!(this.keys.arrowDownKey || this.keys.arrowLeftKey || this.keys.arrowRightKey || this.keys.arrowUpKey) && this.keys.keepLooping) {
            this.keys.keepLooping = false;
            if (this.timer) {
                clearInterval(this.timer);
            }
        }
    }

    repeatKeyMovement() {
        if (this.keys.repeat) {
            if (this.keys.arrowRightKey) {
                this.moveShapes(this.selectedShapes, 3, 0);
            }
            if (this.keys.arrowLeftKey) {
                this.moveShapes(this.selectedShapes, -3, 0);
            }
            if (this.keys.arrowUpKey) {
                this.moveShapes(this.selectedShapes, 0, -3);
            }
            if (this.keys.arrowDownKey) {
                this.moveShapes(this.selectedShapes, 0, 3);
            }
        }
    }
}
