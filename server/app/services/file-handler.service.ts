import {injectable } from 'inversify';
import 'reflect-metadata';
import * as fs from 'fs'
import { ObjectId } from 'mongodb';

@injectable()
export class FileHandler {
    constructor() {}

    saveDrawing(ids:Array<ObjectId>, dataURL:string ){
      let base64DataURL:string = dataURL.replace('data:image/png;base64,','');
      let data = Buffer.from(base64DataURL,'base64');
      let i:number = 0;
      let path: string = `${__dirname}/image-storage/${ids[0]}.png`
      while(fs.existsSync(path) && i<ids.length ){
        i++;
        path = `${__dirname}/image-storage/${ids[i].valueOf()}.png`
      }
      fs.writeFileSync(path,data,'utf-8'); 
    }

    exportDrawing(name:string, type:string, dataURL:string):void{
      let base64DataURL:string = dataURL.replace(`data:image/${type};base64,`,'');
      let data = Buffer.from(base64DataURL,'base64');
      let filename:string;
      type == 'svg+xml' ? filename = `${name}.svg`: filename = `${name}.${type}`;
      let localPath:string = __dirname.replace("\\server\\app\\services", `\\client\\local-images\\${filename}`);
      fs.writeFileSync(localPath,data,'utf-8'); 
    }

    deleteDrawing(id:string): void{
      fs.unlinkSync(`${__dirname}/image-storage/${id}.png`)
    }

  }
