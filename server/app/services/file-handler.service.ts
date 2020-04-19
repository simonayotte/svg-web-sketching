import * as fs from 'fs';
import { injectable } from 'inversify';
import 'reflect-metadata';
import { Drawing } from '../../models/drawing';
import { Encoding, FilePaths, FileTypes} from '../../models/enum';

export interface ExportReturn {
  name: string;
  stream: fs.ReadStream;
}

@injectable()
export class FileHandler {
    constructor() {}

    saveDrawing(ids: string[], dataURL: string ): void {
      const base64DataURL: string = dataURL.replace(`${Encoding.DataImage}${FileTypes.Png};${Encoding.Base64},`, '');
      const data = Buffer.from(base64DataURL, 'base64');
      let i = 0;
      let path = `${__dirname}${FilePaths.ImageStorage}${ids[0]}.${FileTypes.Png}`;
      // this is necessary to be able so save drawings with identical name and/or tags
      while ( fs.existsSync(path) && i < ids.length ) {
        i++;
        path = `${__dirname}${FilePaths.ImageStorage}${ids[i]}.${FileTypes.Png}`;
      }
      fs.writeFileSync(path, data, `${Encoding.Utf8}`);
    }

    exportDrawing(name: string, type: string, dataURL: string): void {
      const base64DataURL: string = dataURL.replace(`${Encoding.DataImage}${type};${Encoding.Base64},`, '');
      const data = Buffer.from(base64DataURL, 'base64');
      let filename: string;
      type === FileTypes.SvgXml ? filename = `${name}.${FileTypes.Svg}` : filename = `${name}.${type}`;
      const localPath: string = __dirname.replace(FilePaths.ServerPath, `${FilePaths.LocalPath}${filename}`);
      fs.writeFileSync(localPath, data, `${Encoding.Utf8}`);
    }

    async exportDrawingEmail(name: string, type: string, dataURL: string): Promise <ExportReturn> {
      return new Promise<ExportReturn> ((resolve) => {
      const base64DataURL: string = dataURL.replace(`${Encoding.DataImage}${type};${Encoding.Base64},`, '');
      const data = Buffer.from(base64DataURL, 'base64');
      let filename: string;
      type === FileTypes.SvgXml ? filename = ` ${name}.${FileTypes.Svg} ` : filename = ` ${name}.${type} ` ;
      const localPath: string = __dirname.replace(FilePaths.ServerPath, `${FilePaths.LocalPath}${filename}`);
      fs.writeFileSync(localPath, data, `${Encoding.Utf8}` );
      resolve({
        name: filename,
        stream: fs.createReadStream(localPath),
      });
      });

    }

    deleteDrawing(id: string): void {
      fs.unlinkSync(`${__dirname}${FilePaths.ImageStorage}${id}.${FileTypes.Png}`);
    }

    checkAllDrawingsAreInServer(drawings: Drawing[]): Drawing[] {
      let path: string;
      const filteredDrawings: Drawing[] = [];
      drawings.forEach((drawing) => {
        path = `${__dirname}${FilePaths.ImageStorage}${drawing._id.valueOf()}.${FileTypes.Png}`;
        if (fs.existsSync(path)) {
          filteredDrawings.push(drawing);
        }
      });
      return filteredDrawings;
    }

  }
