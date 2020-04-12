import {injectable } from 'inversify';
import 'reflect-metadata';
import * as fs from 'fs'
import { Drawing } from '../../models/drawing';
import { FilePaths, FileTypes, Encoding } from '../../models/enum';

export interface ExportReturn {
  name: string,
  stream: fs.ReadStream,
}

@injectable()
export class FileHandler {
    constructor() {}

    saveDrawing(ids:Array<string>, dataURL:string ): void{
      let base64DataURL:string = dataURL.replace(`${Encoding.DataImage}${FileTypes.Png};${Encoding.Base64},`,'');
      let data = Buffer.from(base64DataURL,'base64');
      let i:number = 0;
      let path: string = `${__dirname}${FilePaths.ImageStorage}${ids[0]}.${FileTypes.Png}`
      //this is necessary to be able so save drawings with identical name and/or tags
      while(fs.existsSync(path) && i<ids.length ){
        i++;
        path = `${__dirname}${FilePaths.ImageStorage}${ids[i]}.${FileTypes.Png}`
      }
      fs.writeFileSync(path,data,`${Encoding.Utf8}`); 
    }

    exportDrawing(name:string, type:string, dataURL:string): ExportReturn {
      let base64DataURL:string = dataURL.replace(`${Encoding.DataImage}${type};${Encoding.Base64},`,'');
      let data = Buffer.from(base64DataURL,'base64');
      let filename:string;
      type == FileTypes.SvgXml ? filename = `${name}.${FileTypes.Svg}`: filename = `${name}.${type}`;
      let localPath:string = __dirname.replace(FilePaths.ServerPath, `${FilePaths.LocalPath}${filename}`);
      fs.writeFileSync(localPath,data,`${Encoding.Utf8}`);
      return {
        name: filename,
        stream: fs.createReadStream(localPath),
      };
    }

    deleteDrawing(id:string): void {
      fs.unlinkSync(`${__dirname}${FilePaths.ImageStorage}${id}.${FileTypes.Png}`)
    }

    checkAllDrawingsAreInServer(drawings: Array<Drawing>): Array<Drawing>{
      let path:string;
      let filteredDrawings:Array<Drawing> = [];
      for(let i = 0; i<drawings.length; i++){
        path = `${__dirname}${FilePaths.ImageStorage}${drawings[i]._id.valueOf()}.${FileTypes.Png}`
        if(fs.existsSync(path)){
          filteredDrawings.push(drawings[i]);
        }
      }
      return filteredDrawings;
    }

  }
