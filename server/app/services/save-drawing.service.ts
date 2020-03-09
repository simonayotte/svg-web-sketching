import {injectable } from 'inversify';
import 'reflect-metadata';
import * as fs from 'fs'

@injectable()
export class SaveDrawingService {
    constructor() {}

    saveDrawing(name:string, tags: Array<string>, dataURL:string ){
      if(!this.validateName(name)){
        throw new Error('Erreur:Le nom est requis. Image non sauvegardée')
      }
      if(!this.validateTags(tags)){
        throw new Error("Erreur:Les étiquettes ne doivent pas contenir de caractères spéciaux ou d'espaces. Image non sauvegardée")
      }
      let base64DataURL:string = dataURL.replace('data:image/png;base64,','');
      let data = new Buffer(base64DataURL,'base64');
      let filename:string = name + '.png';
      fs.writeFileSync(__dirname + '/image-storage/'+ filename,data,'utf-8'); 
    }

    validateName(name:string):boolean{
      return name.length>0;
    }

    validateTags(tags:Array<string>):boolean{
      for(let tag of tags){
        if (tag.match('[^a-zA-Z0-9-\S]+') != null){
          return false;
        }     
      }
      return true;
    }
}
