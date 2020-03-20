import {injectable } from 'inversify';
import 'reflect-metadata';
import * as fs from 'fs'

@injectable()
export class ExportDrawingService {
    constructor() {}

    exportDrawing(name:string, type:string, dataURL:string):void{
      let base64DataURL:string = dataURL.replace(`data:image/${type};base64,`,'');
      let data = Buffer.from(base64DataURL,'base64');
      let filename:string;
      type == 'svg+xml' ? filename = `${name}.svg`: filename = `${name}.${type}`;
      console.log(name);
      let localPath:string = __dirname.replace("\\server\\app\\services", `\\client\\local-images\\${filename}`);
      fs.writeFileSync(localPath,data,'utf-8'); 
    }
}
