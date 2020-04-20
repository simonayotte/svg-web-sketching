import { NextFunction, Request, Response, Router } from 'express';
import { inject, injectable } from 'inversify';
import { Drawing } from '../../models/drawing';
import { DatabaseService } from '../services/db-service';
import { FileHandler } from '../services/file-handler.service';
import Types from '../types';

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
            this.dbService.getAllDrawingsDb().then((drawings: Drawing[]) => {
                const returnedDrawings: Drawing[] = this.fileHandler.checkAllDrawingsAreInServer(drawings);
                res.send(returnedDrawings);
            })
            .catch ((err: Error) => {
                res.send([]);
            });
        });

        this.router.delete('/delete/:id', async (req: Request, res: Response, next: NextFunction) => {
            this.dbService.deleteDrawingDb(req.params.id).then(() => {
                this.fileHandler.deleteDrawing(req.params.id);
                const succesMsg = {status: '200', message: 'Dessin supprimé avec succès!'};
                res.json(succesMsg);
            })
            .catch ((err: Error) => {
                const errorMsg = {status: '400', message: "Le dessin n'a pas pu être supprimé!"};
                res.json(errorMsg);
            });
        });
    }
}
