import { NextFunction, Request, Response, Router } from 'express';
import { inject, injectable } from 'inversify';
import { FileHandler } from '../services/file-handler.service';
import Types from '../types';
import { DatabaseService } from '../services/DB.service';
import { Drawing } from '../../models/drawing';

const wait = (ms:number) => new Promise(res => setTimeout(res, ms));

@injectable()
export class SaveDrawingController {
    router: Router;

    constructor(@inject(Types.FileHandler) private fileHandler: FileHandler, 
                @inject(Types.DatabaseService) private dbService: DatabaseService) {
        this.configureRouter();
    }

    private configureRouter(): void {
        this.router = Router();

        this.router.post('/', async (req: Request, res: Response, next: NextFunction) => {
            let drawing = new Drawing(req.body.name,req.body.tags, req.body.dataURL, req.body.svgsHTML, req.body.width, req.body.height, req.body.RGBA);
            this.dbService.addDrawingDb(drawing).catch((err:Error) => {
                let errorMsg = {status:'400', message: err.message}
                res.json(errorMsg)});
            await wait(100);
            let drawing_id = await this.dbService.getIdsOfDrawing(req.body.name, req.body.tags);
            await wait(100);
            this.fileHandler.saveDrawing(drawing_id, drawing.dataURL);
            let succesMsg = {status:'200', message:'Image sauvegardée avec succès!'}
            res.json(succesMsg)
        });
    }
}
