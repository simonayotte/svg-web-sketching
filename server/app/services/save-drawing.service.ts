import {injectable } from 'inversify';
import 'reflect-metadata';
import * as fs from 'fs'

@injectable()
export class SaveDrawingService {
    constructor() {}

    saveDrawing(ids:Array<string>, tags: Array<string>, dataURL:string ){
      let base64DataURL:string = dataURL.replace('data:image/png;base64,','');
      let data = Buffer.from(base64DataURL,'base64');
      let i:number = 0;
      let path: string = `${__dirname}/image-storage/${ids[0]}.png`
      while(fs.existsSync(path) && i<ids.length ){
        i++;
        path = `${__dirname}/image-storage/${ids[i]}.png`
      }
      fs.writeFileSync(path,data,'utf-8'); 
    }

  }
