import { NextFunction, Request, Response, Router } from 'express';
import { inject, injectable } from 'inversify';
import { Drawing } from '../../models/drawing';
import { DatabaseService } from '../services/DB.service';
import { FileHandler } from '../services/file-handler.service';
import Types from '../types';

const  wait =  ((ms: number) => new  Promise ( res => setTimeout(res, ms)));
const MILLE = 1000;
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
            const drawing = new Drawing(req.body.name, req.body.tags, req.body.dataURL, req.body.svgsHTML,
                                                             req.body.width, req.body.height, req.body.RGBA);
            try {
                this.dbService.addDrawingDb(drawing);
                await wait(MILLE);
                const DRAWIND_ID: string[] = await this.dbService.getIdsOfDrawing(req.body.name, req.body.tags);
                await wait(MILLE);
                this.fileHandler.saveDrawing(DRAWIND_ID, drawing.dataURL);
            }
            catch (error) {
                const errorMsg = {status: '400', message: error.message};
                res.json(errorMsg);
            }
            const succesMsg = {status: '200', message: 'Image sauvegardée avec succès!'};
            res.json(succesMsg);
        });
    }
}
