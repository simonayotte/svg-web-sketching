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
                res.send(drawings);
            },
            (err => {
                res.send(err);
            }));
        });

        this.router.delete('/delete/:id', async (req: Request, res: Response, next: NextFunction) => {
            console.log(req.params.id);
            this.dbService.deleteDrawingDb(req.params.id).then((result) => {
                this.fileHandler.deleteDrawing(req.params.id.valueOf())
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

