import { NextFunction, Request, Response, Router } from 'express';
import { inject, injectable } from 'inversify';
import { SaveDrawingService } from '../services/save-drawing.service';
import Types from '../types';

@injectable()
export class SaveDrawingController {
    router: Router;

    constructor(@inject(Types.SaveDrawingService) private saveDrawingService: SaveDrawingService) {
        this.configureRouter();
    }

    private configureRouter(): void {
        this.router = Router();

        this.router.post('/', (req: Request, res: Response, next: NextFunction) => {
            // Send the request to the service and send the response
            try{
                this.saveDrawingService.saveDrawing(req.body.name, req.body.tags, req.body.dataURL);
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
