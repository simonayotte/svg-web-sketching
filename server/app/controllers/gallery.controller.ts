import { NextFunction, Request, Response, Router } from 'express';
import { inject, injectable } from 'inversify';
import Types from '../types';
import { DatabaseService } from '../services/DB.service';
import { Drawing } from '../../models/drawing';
import { FileHandler } from '../services/file-handler.service';

@injectable()
export class GalleryController {
    router: Router;

    constructor(@inject(Types.DatabaseService) private dbService: DatabaseService,
                @inject(Types.FileHandler) private fileHandler: FileHandler) {
        this.configureRouter();
    }

    private configureRouter(): void {
        this.router = Router();

        this.router.get('/', async (req: Request, res: Response, next: NextFunction) => {
            // Send the request to the service and send the response
            this.dbService.getAllDrawingsDb().then((drawings: Array<Drawing>) => {
                let returnedDrawings: Array<Drawing> = this.fileHandler.checkAllDrawingsAreInServer(drawings);
                res.send(returnedDrawings);
            })
            .catch(err => {
                res.send([]);
            });
        });

        this.router.delete('/delete/:id', async (req: Request, res: Response, next: NextFunction) => {
            this.dbService.deleteDrawingDb(req.params.id).then((result) => {
                this.fileHandler.deleteDrawing(req.params.id)
                let succesMsg = {status:'200', message:'Dessin supprimé avec succès!'}
                res.json(succesMsg)
            },
            (err) => {
                let errorMsg = {status:'400', message:"Le dessin n'a pas pu être supprimé!"}
                res.json(errorMsg)
            })
        });
    }
}  

