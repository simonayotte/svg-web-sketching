export class DrawingBoardInfo {
    private width:number;
    private height:number;
    private backgroundColor:string;

    constructor(width:number,height:number,backgroundColor:string){
        this.width = width;
        this.height = height;
        this.backgroundColor = backgroundColor;
    }

    getWidth(){
        return this.width;
    }

    getHeight(){
        return this.height;
    }

    getBackgroundColor(){
        return this.backgroundColor;
    }

    setWidth(width:number){
        this.width = width;
    }

    setHeight(height:number){
        this.height = height;
    }

    setBackgroundColor(backgroundColor:string){
        this.backgroundColor = backgroundColor;
    }
}