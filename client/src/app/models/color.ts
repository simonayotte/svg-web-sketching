/* tslint:disable:no-magic-numbers */
export class Color {
    r: number;
    g: number;
    b: number;
    a: number;
    rgbHex: string;
    rgbaHex: string;
    isHexValid: boolean;

    private rgbHexPattern: RegExp = new RegExp('[a-fA-F0-9]{6}');

    constructor(r: number, g: number, b: number, a: number) {
        this.r = r;
        this.g = g;
        this.b = b;
        this.a = a;
        this.rgbaHex = this.hex();
        this.rgbHex = this.colorHex();
        this.isHexValid = true;
    }

    fixColorRGB(type: string): void {
        switch (type) {
            case 'r':
                if (this.r < 0 || this.r == null) {
                    this.r = 0;
                } else if (this.r > 255) {
                    this.r = 255;
                }
                break;
            case 'g':
                if (this.g < 0 || this.g == null) {
                    this.g = 0;
                } else if (this.g > 255) {
                    this.g = 255;
                }
                break;
            case 'b':
                if (this.b < 0 || this.b == null) {
                    this.b = 0;
                } else if (this.b > 255) {
                    this.b = 255;
                }
                break;
        }
    }
    synchronizeHex(type?: string): void {
        if (type) {
            this.fixColorRGB(type);
        }
        this.rgbHex = this.colorHex();
        this.isHexValid = true;
    }

    synchronizeRGB(): void {
        if (this.rgbHexPattern.test(this.rgbHex)) {
            this.isHexValid = true;
            this.r = parseInt(`0x${this.rgbHex.substring(0, 2)}`, 16);
            this.g = parseInt(`0x${this.rgbHex.substring(2, 4)}`, 16);
            this.b = parseInt(`0x${this.rgbHex.substring(4, 6)}`, 16);
        } else {
            this.isHexValid = false;
        }
    }

    hex(): string {
        let red: string = Number(this.r).toString(16);
        if (red.length < 2) {
            red = '0' + red;
        }

        let green: string = Number(this.g).toString(16);
        if (green.length < 2) {
            green = '0' + green;
        }

        let blue: string = Number(this.b).toString(16);
        if (blue.length < 2) {
            blue = '0' + blue;
        }

        let opacity: string = Number(this.a).toString(16);
        if (opacity.length < 2) {
            opacity = '0' + opacity;
        }

        return '#' + red + green + blue + opacity;
    }

    colorHex(): string {
        let red: string = Number(this.r).toString(16);
        if (red.length < 2) {
            red = '0' + red;
        }

        let green: string = Number(this.g).toString(16);
        if (green.length < 2) {
            green = '0' + green;
        }

        let blue: string = Number(this.b).toString(16);
        if (blue.length < 2) {
            blue = '0' + blue;
        }

        return red + green + blue;
    }

    rgba(): number[] {
        return [this.r, this.g, this.b, this.a];
    }

    rgb(): number[] {
        return [this.r, this.g, this.b];
    }
}
