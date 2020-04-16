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
        if (!this.selectedSvgs || this.selectedSvgs.length === 0) {
            this.display = false;
            return;
        }
        this.display = true;

        let left = Number.MAX_SAFE_INTEGER;
        let right = 0;
        let top = Number.MAX_SAFE_INTEGER;
        let bottom = 0;

        for (const svg of this.selectedSvgs) {
            let thickness = 0;
            if (svg.getAttribute('stroke-width')) {
                thickness = parseInt(svg.getAttribute('stroke-width') as string, 10) / 2;
            }

            const domRect = svg.getBoundingClientRect();
            const rectLeft = domRect.left - thickness - (this.isPanelOpen ? PANEL_WIDTH : SIDEBAR_WIDTH);
            const rectTop = domRect.top - thickness;
            const rectRight = domRect.right + thickness - (this.isPanelOpen ? PANEL_WIDTH : SIDEBAR_WIDTH);
            const rectBottom = domRect.bottom + thickness;

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
    move(dX: number, dY: number): void {
        this.x += dX;
        this.y += dY;
    }

    push(svg: SVGGraphicsElement): void {
        this.svgs = this.selectedSvgs.concat(svg);
    }

    delete(svgToDelete: SVGGraphicsElement): void {
        this.svgs = this.svgs.filter((svg: SVGGraphicsElement) => svg !== svgToDelete);
    }
}
