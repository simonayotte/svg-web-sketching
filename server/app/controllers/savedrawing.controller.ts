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
            // Send the request to the service and send the response
            try{
                let drawing = new Drawing(req.body.name,req.body.tags, req.body.dataURL, req.body.svgs, req.body.width, req.body.height, req.body.RGBA);
                this.dbService.addDrawingDb(drawing);
                console.log(req.body.svgs);
                await wait(1000);
                let drawing_id = await this.dbService.getIdsOfDrawing(req.body.name, req.body.tags);
                await wait(1000);
                this.fileHandler.saveDrawing(drawing_id, drawing.dataURL);
            }
            catch(e){
                let errorMsg = {status:'400', message: e.message}
                res.json(errorMsg);
            }
            let succesMsg = {status:'200', message:'Image sauvegardée avec succès!'}
            res.json(succesMsg)
        });
    }
}
