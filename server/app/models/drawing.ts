export class Drawing {
    _id: string;
    name: string;
    tags: Array<string>;
    constructor(name: string, tags: Array<string>){
        this.name = name;
        this.tags = tags;
    }
}
