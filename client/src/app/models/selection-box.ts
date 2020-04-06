export class SelectionBox {
    display: boolean;
    x: number;
    y: number;
    width: number;
    height: number;

    private selectedSvgs: SVGGraphicsElement[] = [];

    constructor() {
        this.display = false;
        this.x = 0;
        this.y = 0;
        this.width = 0;
        this.height = 0;
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
            let domRect = svg.getBBox();
            let rectLeft = domRect.x - thickness;
            let rectTop = domRect.y - thickness;
            let rectRight = domRect.x + domRect.width + thickness;
            let rectBottom = domRect.y + domRect.height + thickness;

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

    push(svg: SVGGraphicsElement) {
        this.svgs = this.selectedSvgs.concat(svg);
    }
}
