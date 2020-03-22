import { NextFunction, Request, Response, Router } from 'express';
import { inject, injectable } from 'inversify';
import { FileHandler } from '../services/file-handler.service';
import Types from '../types';
import { DatabaseService } from '../services/DB.service';

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
                this.dbService.addDrawingDb(req.body.name,req.body.tags, req.body.dataURL);
                await wait(1000);
                let drawing_id = await this.dbService.getIdsOfDrawing(req.body.name, req.body.tags);
                await wait(1000);
                this.fileHandler.saveDrawing(drawing_id, req.body.dataURL);
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
