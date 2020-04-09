import { Coordinate } from './coordinate';
const PANEL_WIDTH = 252;
const SIDEBAR_WIDTH = 52;

export class SelectionBox {
    display: boolean;
    isPanelOpen: boolean;
    x: number;
    y: number;
    isMoving: boolean;
    width: number;
    height: number;

    private selectedSvgs: SVGGraphicsElement[] = [];

    constructor(x: number = 0, y: number = 0, width: number = 0, height: number = 0) {
        this.display = false;
        this.isPanelOpen = false;
        this.isMoving = false;
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
    }

    set svgs(svgs: SVGGraphicsElement[]) {
        this.selectedSvgs = svgs;
        if (this.selectedSvgs.length === 0) {
            this.display = false;
            return;
        }
        this.display = true;

        let left = Number.MAX_SAFE_INTEGER;
        let right = 0;
        let top = Number.MAX_SAFE_INTEGER;
        let bottom = 0;

        for (const svg of this.selectedSvgs) {
            let thickness = parseInt(<string>svg.getAttribute('stroke-width')) / 2;

            let domRect = svg.getBoundingClientRect();
            let rectLeft = domRect.left - thickness - (this.isPanelOpen ? PANEL_WIDTH : SIDEBAR_WIDTH);
            let rectTop = domRect.top - thickness;
            let rectRight = domRect.right + thickness - (this.isPanelOpen ? PANEL_WIDTH : SIDEBAR_WIDTH);
            let rectBottom = domRect.bottom + thickness;

            left = left > rectLeft ? rectLeft : left; // choose min
            right = right < rectRight ? rectRight : right; // choose max
            top = top > rectTop ? rectTop : top; // choose min
            bottom = bottom < rectBottom ? rectBottom : bottom;
        }

        this.x = left;
        this.y = top;
        this.width = right - left;
        this.height = bottom - top;
    }

    get svgs(): SVGGraphicsElement[] {
        return this.selectedSvgs;
    }

    push(svg: SVGGraphicsElement): void {
        this.svgs = this.selectedSvgs.concat(svg);
    }

    getCenter(): Coordinate {
        return new Coordinate(this.x + this.width/2, this.y + this.height/2);
    }
    
    delete(svgToDelete: SVGGraphicsElement): void {
        this.svgs = this.svgs.filter((svg: SVGGraphicsElement) => svg !== svgToDelete);
    }

    update(): void {
        this.svgs = this.svgs;
    }
}
